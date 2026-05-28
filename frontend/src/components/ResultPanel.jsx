import { useState } from 'react';
import { Check, Copy, AlertTriangle, Zap, Info, Download, Gauge, Activity, ShieldAlert, Code2, Columns, Database, FileText } from 'lucide-react';
import { DiffEditor, Editor } from '@monaco-editor/react';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import { format } from 'sql-formatter';

const LEVEL_META = {
  beginner:      { label: 'Beginner',     color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25' },
  intermediate:  { label: 'Intermediate', color: 'text-blue-400 bg-blue-500/10 border-blue-500/25' },
  expert:        { label: 'Expert',        color: 'text-red-400 bg-red-500/10 border-red-500/25' },
  'dba expert':  { label: 'DBA Expert',   color: 'text-red-400 bg-red-500/10 border-red-500/25' },
};

const safeFormatSQL = (sql, dbType = 'postgresql') => {
  if (!sql) return '';
  let lang = 'postgresql';
  const type = (dbType || '').toLowerCase().trim();
  if (type === 'mysql') lang = 'mysql';
  else if (type === 'sqlite') lang = 'sqlite';
  else if (type === 'sql server' || type === 'tsql') lang = 'tsql';
  
  try {
    return format(sql, { 
      language: lang,
      tabWidth: 2,
      keywordCase: 'upper'
    });
  } catch (err) {
    try {
      // Fallback to standard SQL formatting if dialect-specific fails
      return format(sql, {
        language: 'sql',
        tabWidth: 2,
        keywordCase: 'upper'
      });
    } catch (fallbackErr) {
      console.warn('SQL formatting failed, using raw query:', fallbackErr);
      return sql;
    }
  }
};

const getLevelMeta = (level) => LEVEL_META[(level || '').toLowerCase()] || LEVEL_META.intermediate;

const cleanPerformanceGain = (gain) => {
  if (!gain) return '—';
  const str = String(gain).trim();
  if (str.length <= 15) return str;

  // Try to find a multiplier pattern like "10x faster" or "10x"
  const multiplierMatch = str.match(/(\d+(?:\.\d+)?x(?:\s+faster)?)/i);
  if (multiplierMatch && multiplierMatch[1]) {
    return multiplierMatch[1].toLowerCase();
  }

  // Try to find a percentage pattern like "95% faster"
  const percentMatch = str.match(/(\d+%\s*(?:faster|improvement|reduction)?)/i);
  if (percentMatch && percentMatch[1]) {
    return percentMatch[1];
  }

  // Otherwise, just truncate it gracefully
  return str.substring(0, 15) + '...';
};

export default function ResultPanel({ result, originalQuery, explanationLevel, dbType = 'PostgreSQL' }) {
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('diff');
  const [viewMode, setViewMode] = useState('diff');

  if (!result) {
    return (
      <div className="h-full min-h-[620px] flex flex-col items-center justify-center border border-dashed border-white/8 rounded-2xl p-8 bg-[#0a0d14]/50">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/8 border border-blue-500/15 flex items-center justify-center mb-5">
          <Activity className="w-7 h-7 text-blue-500/40" />
        </div>
        <p className="font-semibold text-base text-slate-400">Awaiting your query</p>
        <p className="text-sm text-slate-600 mt-1.5">Optimization results will appear here.</p>
      </div>
    );
  }

  const handleCopy = (text, type = 'query', index = null) => {
    navigator.clipboard.writeText(text);
    if (type === 'query') {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } else {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
    toast.success('Copied to clipboard');
  };

  const handleExportPDF = () => {
    const toastId = toast.loading('Generating PDF...');
    try {
      const pdf = new jsPDF('p', 'mm', 'a4');
      const W = 210;
      const M = 15;
      const CW = W - M * 2;
      const generatedAt = new Date().toLocaleString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ' ·');
      let y = 0;

      const drawHeader = () => {
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(8);
        pdf.setTextColor(0, 0, 0);
        pdf.text('QUERYAI', M, 12);
        
        pdf.setFont('helvetica', 'normal');
        pdf.setTextColor(100, 100, 100);
        pdf.text('SQL Optimization Report', M + 18, 12);
        
        pdf.text('Generated ' + generatedAt, W - M, 12, { align: 'right' });
        
        pdf.setDrawColor(0, 0, 0);
        pdf.setLineWidth(0.3);
        pdf.line(M, 14, W - M, 14);
      };

      const drawFooter = (pageNo, total) => {
        pdf.setDrawColor(200, 200, 200);
        pdf.setLineWidth(0.3);
        pdf.line(M, 285, W - M, 285);
        
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(120, 120, 120);
        pdf.text('QueryAI © 2026 — Confidential', M, 290);
        pdf.text('Page ' + pageNo, W - M, 290, { align: 'right' });
      };

      const checkPage = (need = 18) => {
        if (y + need > 278) {
          pdf.addPage();
          drawHeader();
          y = 22;
        }
      };

      const sectionHeader = (title, requiredSpace = 10) => {
        checkPage(requiredSpace + 10);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(0, 0, 0);
        pdf.text(title, M, y);
        y += 6;
      };

      const tryFormatSQL = (sql) => {
        return safeFormatSQL(sql, dbType);
      };

      const codeBlock = (sql) => {
        const formatted = tryFormatSQL(sql);
        const rawLines = formatted.split('\n');
        let lines = [];
        rawLines.forEach(line => {
           if (line.length > 95) {
             lines.push(line.substring(0, 95));
             lines.push('  ' + line.substring(95));
           } else {
             lines.push(line);
           }
        });

        const lh = 4.5;
        const padding = 5;
        const bh = Math.max(lines.length * lh + padding * 2, 16);
        
        pdf.setFillColor(248, 248, 248);
        pdf.setDrawColor(220, 220, 220);
        pdf.setLineWidth(0.2);
        pdf.rect(M, y, CW, bh, 'FD');

        pdf.setFont('courier', 'normal');
        pdf.setFontSize(8.5);
        pdf.setTextColor(40, 40, 40);
        
        let textY = y + padding + 3;
        lines.forEach(l => {
          if (l.trim() !== '') {
            pdf.text(l, M + padding, textY);
          }
          textY += lh;
        });
        
        y += bh + 6;
      };

      const bulletRow = (text) => {
        const lines = pdf.splitTextToSize('—  ' + text, CW - 4);
        const rh = lines.length * 5.5 + 2;
        checkPage(rh);
        
        pdf.setFont('times', 'normal');
        pdf.setFontSize(10.5);
        pdf.setTextColor(30, 30, 30);
        pdf.text(lines, M + 4, y + 4);
        y += rh;
      };

      const bodyText = (text) => {
        pdf.setFont('times', 'normal');
        pdf.setFontSize(10.5);
        pdf.setTextColor(30, 30, 30);
        const lines = pdf.splitTextToSize(text || '', CW);
        lines.forEach(line => {
          checkPage(7);
          pdf.text(line, M, y);
          y += 5.5;
        });
        y += 4;
      };

      // PAGE 1 Header
      drawHeader();
      y = 28;

      pdf.setFont('times', 'bold');
      pdf.setFontSize(22);
      pdf.setTextColor(0, 0, 0);
      pdf.text('SQL Optimization Report', M, y);
      
      y += 8;
      pdf.setFont('times', 'italic');
      pdf.setFontSize(11);
      pdf.setTextColor(60, 60, 60);
      pdf.text('Performance analysis, index recommendations, and risk assessment for the query.', M, y);
      
      y += 6;

      // KPI Grid
      pdf.setDrawColor(120, 120, 120);
      pdf.setLineWidth(0.5);
      pdf.line(M, y, W - M, y); // Top line
      y += 6;

      const colW = CW / 4;
      
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8);
      pdf.setTextColor(80, 80, 80);
      pdf.text('Complexity', M, y);
      pdf.text('Improvement', M + colW, y);
      pdf.text('Risk Level', M + colW * 2, y);
      pdf.text('Execution Time', M + colW * 3, y);
      
      y += 7;
      
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(11);
      pdf.setTextColor(0, 0, 0);
      pdf.text((result.complexity_score || 0) + ' / 100', M, y);
      pdf.text((cleanPerformanceGain(result.performance_gain) || '—'), M + colW, y);
      pdf.text(result.query_risk_level || 'Unknown', M + colW * 2, y);
      pdf.text((result.estimated_execution_time_before || '—') + ' -> ' + (result.estimated_execution_time_after || '—'), M + colW * 3, y);
      
      y += 5;
      pdf.setDrawColor(220, 220, 220);
      pdf.setLineWidth(0.3);
      pdf.line(M, y, W - M, y); // Bottom line
      y += 12;

      // 1. Original Query
      if (originalQuery) {
        const formatted = tryFormatSQL(originalQuery);
        const linesCount = formatted.split('\n').length;
        const requiredSpace = Math.max(linesCount * 4.5 + 10, 16) + 12;
        sectionHeader('1. Original Query', requiredSpace);
        codeBlock(originalQuery);
      }

      // 2. Optimized Query
      if (result.optimized_query) {
        const formatted = tryFormatSQL(result.optimized_query);
        const linesCount = formatted.split('\n').length;
        const requiredSpace = Math.max(linesCount * 4.5 + 10, 16) + 12;
        sectionHeader('2. Optimized Query', requiredSpace);
        codeBlock(result.optimized_query);
        
        const isUnchanged = tryFormatSQL(originalQuery || '') === formatted;
        if (isUnchanged) {
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(9);
          pdf.setTextColor(100, 100, 100);
          pdf.text('Query text is unchanged; performance gains derive entirely from the recommended indexes.', M, y - 2);
          y += 6;
        }
      }

      // 3. Bottlenecks
      if (result.issues_found?.length > 0) {
        sectionHeader('3. Bottlenecks & Issues', 20);
        result.issues_found.forEach(item => bulletRow(item));
        y += 6;
      }

      // 4. Detected Risks
      if (result.detected_risks?.length > 0) {
        sectionHeader('4. Detected Risks', 20);
        result.detected_risks.forEach(item => bulletRow(item));
        y += 6;
      }

      // 5. Recommended Indexes
      if (result.index_sql?.length > 0) {
        let firstBoxH = 30;
        if (result.index_sql[0]) {
          const formattedIdx = tryFormatSQL(result.index_sql[0]);
          let linesIdx = [];
          formattedIdx.split('\n').forEach(line => {
            if (line.length > 95) {
              linesIdx.push(line.substring(0, 95));
              linesIdx.push('  ' + line.substring(95));
            } else {
              linesIdx.push(line);
            }
          });
          const codeBlockH = Math.max(linesIdx.length * 4.5 + 10, 16) + 4;
          const explanation = result.index_suggestions?.[0];
          const explanationH = explanation ? (pdf.splitTextToSize(explanation, CW - 4).length * 5 + 6) : 0;
          firstBoxH = codeBlockH + explanationH + 16;
        }
        sectionHeader('5. Recommended Indexes', firstBoxH + 10);
        
        result.index_sql.forEach((sql, i) => {
          const formattedIdx = tryFormatSQL(sql);
          const rawLinesIdx = formattedIdx.split('\n');
          let linesIdx = [];
          rawLinesIdx.forEach(line => {
            if (line.length > 95) {
              linesIdx.push(line.substring(0, 95));
              linesIdx.push('  ' + line.substring(95));
            } else {
              linesIdx.push(line);
            }
          });
          const codeBlockH = Math.max(linesIdx.length * 4.5 + 10, 16) + 4;
          const explanation = result.index_suggestions?.[i];
          const explanationH = explanation ? (pdf.splitTextToSize(explanation, CW - 4).length * 5 + 6) : 0;
          
          const boxH = codeBlockH + explanationH + 16;
          
          checkPage(boxH);
          
          pdf.setFillColor(255, 255, 255);
          pdf.setDrawColor(220, 220, 220);
          pdf.rect(M, y, CW, boxH - 4, 'FD');
          
          let curY = y + 7;
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(9);
          pdf.setTextColor(20, 20, 20);
          pdf.text('INDEX ' + (i + 1), M + 4, curY);
          
          curY += 6;
          
          pdf.setFillColor(248, 248, 248);
          pdf.setDrawColor(220, 220, 220);
          pdf.rect(M + 4, curY, CW - 8, codeBlockH - 4, 'FD');
          
          pdf.setFont('courier', 'normal');
          pdf.setFontSize(8.5);
          pdf.setTextColor(40, 40, 40);
          
          let textY = curY + 6;
          linesIdx.forEach(l => {
            if (l.trim() !== '') {
              pdf.text(l, M + 6, textY);
            }
            textY += 4.5;
          });
          
          curY += codeBlockH;
          
          if (explanation) {
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(9);
            pdf.setTextColor(100, 100, 100);
            const expLines = pdf.splitTextToSize(explanation, CW - 8);
            let expY = curY + 4;
            expLines.forEach(l => {
              pdf.text(l, M + 4, expY);
              expY += 5;
            });
          }
          
          y += boxH + 6; // Extra space between options
        });
      }

      // 6. Explanation & Strategy
      if (result.explanation) {
        sectionHeader('6. Explanation & Strategy', 20);
        bodyText(result.explanation);
      }

      const totalPages = pdf.internal.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        pdf.setPage(p);
        drawFooter(p, totalPages);
      }

      const slug = new Date().toISOString().slice(0, 10);
      pdf.save(`queryai-report-${slug}.pdf`);
      toast.success('PDF downloaded', { id: toastId });
    } catch (e) {
      console.error(e);
      toast.error('Failed to export PDF', { id: toastId });
    }
  };

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    }
  };

  const levelMeta = getLevelMeta(result.explanation_level || explanationLevel);

  const tabs = [
    { id: 'diff', icon: Code2, label: 'Code Comparison' },
    { id: 'analysis', icon: FileText, label: 'AI Analysis' },
    { id: 'indexes', icon: Database, label: 'Indexes' },
  ];

  return (
    <div className="bg-[#0a0d14] rounded-2xl border border-white/8 overflow-hidden flex flex-col h-full shadow-2xl min-h-[620px]">

      {/* Header */}
      <div className="px-4 py-3 border-b border-white/6 flex justify-between items-center gap-3 flex-wrap" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <h3 className="font-bold text-white flex items-center gap-2 text-sm">
          <div className="w-6 h-6 rounded-md bg-yellow-500/15 flex items-center justify-center">
            <Zap className="w-3.5 h-3.5 text-yellow-400" />
          </div>
          Optimization Report
          <span className={`ml-1 px-2 py-0.5 rounded text-[10px] font-bold border ${levelMeta.color}`}>
            {levelMeta.label}
          </span>
        </h3>
        <button onClick={handleExportPDF} className="text-xs font-semibold flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-all bg-blue-500/10 hover:bg-blue-500/15 px-3 py-1.5 rounded-lg border border-blue-500/20">
          <Download className="w-3.5 h-3.5" /> Export PDF
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Dialect Mismatch Banner */}
        {(() => {
          const dialectMismatch = [...(result.detected_risks || []), ...(result.issues_found || [])].find(
            msg => /dialect|mismatch|wrong database|mysql syntax|postgresql syntax|sqlite syntax|sql server syntax/i.test(msg)
          );
          if (!dialectMismatch) return null;
          return (
            <div className="mx-4 mt-4 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-start gap-3 text-amber-300 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
              <div>
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-400">Dialect Mismatch Warning</h4>
                <p className="text-xs text-amber-200 mt-1 leading-relaxed">{dialectMismatch}</p>
              </div>
            </div>
          );
        })()}

        {/* KPI Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-white/6 divide-x divide-white/5 shrink-0" style={{ background: 'rgba(255,255,255,0.01)' }}>
          <div className="p-4 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-slate-600 mb-1.5 flex items-center gap-1">
              <Gauge className="w-3 h-3" /> Complexity
            </span>
            <div className="flex items-end gap-1.5">
              <span className="text-2xl font-black text-white">{result.complexity_score || 0}</span>
              <span className="text-xs text-slate-600 mb-0.5">/100</span>
            </div>
            <div className="w-full bg-white/5 h-1 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-700" style={{ width: `${result.complexity_score || 0}%` }} />
            </div>
          </div>
          <div className="p-4 flex flex-col justify-center overflow-hidden">
            <span className="text-[10px] uppercase font-bold text-slate-600 mb-1.5 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Gain
            </span>
            <span className="text-xl font-black text-emerald-400 truncate block" title={result.performance_gain}>
              {cleanPerformanceGain(result.performance_gain)}
            </span>
          </div>
          <div className="p-4 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-slate-600 mb-1.5">Before / After</span>
            <span className="text-xs font-bold text-red-400 line-through">{result.estimated_execution_time_before || 'N/A'}</span>
            <span className="text-base font-black text-emerald-400">{result.estimated_execution_time_after || 'N/A'}</span>
          </div>
          <div className="p-4 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-slate-600 mb-1.5 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Risk
            </span>
            <span className={`mt-1 inline-block px-2.5 py-1 rounded-md text-xs font-bold border w-max ${getRiskColor(result.query_risk_level)}`}>
              {result.query_risk_level || 'Unknown'}
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/6 px-3 shrink-0 overflow-x-auto gap-1 pt-1" style={{ background: 'rgba(255,255,255,0.015)' }}>
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold border-b-2 transition-all whitespace-nowrap ${
                activeTab === id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300 hover:border-white/10'
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5" style={{ background: '#0a0d14' }}>

          {/* CODE COMPARISON */}
          {activeTab === 'diff' && (
            <div className="h-full min-h-[400px] flex flex-col">
              <div className="flex justify-between items-center mb-3 shrink-0">
                <div className="flex bg-white/5 rounded-lg p-1 border border-white/8 gap-0.5">
                  <button
                    onClick={() => setViewMode('diff')}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${viewMode === 'diff' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Columns className="w-3 h-3" /> Diff
                  </button>
                  <button
                    onClick={() => setViewMode('code')}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-all ${viewMode === 'code' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                  >
                    <Code2 className="w-3 h-3" /> Final
                  </button>
                </div>
                <button
                  onClick={() => handleCopy(result.optimized_query)}
                  className="text-xs font-semibold flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-all bg-white/4 hover:bg-white/8 px-3 py-1.5 rounded-lg border border-white/8 hover:border-white/15"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <div className="h-[480px] rounded-xl overflow-hidden border border-white/8">
                {viewMode === 'diff' ? (
                  <DiffEditor
                    height="100%"
                    language="sql"
                    theme="vs-dark"
                    original={safeFormatSQL(originalQuery || '', dbType)}
                    modified={safeFormatSQL(result.optimized_query || '', dbType)}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 12,
                      fontFamily: 'JetBrains Mono, monospace',
                      renderSideBySide: true,
                      automaticLayout: true,
                      padding: { top: 16, bottom: 16 },
                      lineHeight: 20,
                      wordWrap: 'on'
                    }}
                  />
                ) : (
                  <div className="flex-1 h-full flex flex-col min-w-0 bg-[#1e1e1e]">
                    <div className="text-[10px] font-bold text-emerald-400 bg-emerald-500/5 py-2 px-4 uppercase tracking-wider shrink-0 border-b border-white/5">Final Optimized Query</div>
                    <Editor
                      height="100%"
                      language="sql"
                      theme="vs-dark"
                      value={safeFormatSQL(result.optimized_query || '', dbType)}
                      options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        fontSize: 12,
                        fontFamily: 'JetBrains Mono, monospace',
                        automaticLayout: true,
                        padding: { top: 16, bottom: 16 },
                        lineHeight: 20,
                        wordWrap: 'on',
                        scrollBeyondLastLine: false
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI ANALYSIS */}
          {activeTab === 'analysis' && (
            <div className="space-y-5 max-w-4xl">
              <section>
                <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <div className="w-5 h-5 rounded bg-blue-500/15 flex items-center justify-center">
                    <Info className="w-3 h-3 text-blue-400" />
                  </div>
                  AI Strategy & Explanation
                  <span className={`ml-auto px-2 py-0.5 rounded text-[10px] font-bold border ${levelMeta.color}`}>
                    {levelMeta.label}
                  </span>
                </h4>
                <div className="bg-blue-500/5 p-5 rounded-xl border border-blue-500/15">
                  <p className="text-sm text-slate-300 leading-relaxed">{result.explanation}</p>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {result.issues_found && result.issues_found.length > 0 && (
                  <section className="bg-orange-500/5 p-5 rounded-xl border border-orange-500/15">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                      <AlertTriangle className="w-4 h-4 text-orange-400" /> Bottlenecks
                    </h4>
                    <ul className="space-y-2">
                      {result.issues_found.map((issue, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-white/3 p-3 rounded-lg border border-white/5">
                          <span className="text-orange-400 mt-0.5 font-bold shrink-0">▸</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {result.detected_risks && result.detected_risks.length > 0 && (
                  <section className="bg-red-500/5 p-5 rounded-xl border border-red-500/15">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                      <ShieldAlert className="w-4 h-4 text-red-400" /> Security Risks
                    </h4>
                    <ul className="space-y-2">
                      {result.detected_risks.map((risk, i) => (
                        <li key={i} className="text-xs text-slate-300 flex items-start gap-2 bg-white/3 p-3 rounded-lg border border-white/5">
                          <span className="text-red-400 mt-0.5 font-bold shrink-0">!</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </div>
          )}

          {/* INDEXES */}
          {activeTab === 'indexes' && (
            <div className="max-w-4xl space-y-6">
              {result.index_sql && result.index_sql.length > 0 ? (
                <>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2">
                    <div className="w-5 h-5 rounded bg-purple-500/15 flex items-center justify-center">
                      <Database className="w-3 h-3 text-purple-400" />
                    </div>
                    Recommended Indexes
                    <span className="ml-auto text-xs font-normal text-slate-500">{result.index_sql.length} index{result.index_sql.length !== 1 ? 'es' : ''}</span>
                  </h4>

                  <div className="space-y-5">
                    {result.index_sql.map((sql, i) => {
                      const explanation = result.index_suggestions?.[i];
                      return (
                        <div key={i} className="rounded-2xl border border-white/8 overflow-hidden">
                          {/* Index header */}
                          <div className="flex items-center gap-2 px-4 py-2.5 bg-purple-500/6 border-b border-white/6">
                            <span className="text-[10px] font-bold text-purple-400 tracking-widest uppercase">Index {i + 1}</span>
                          </div>

                          {/* SQL block */}
                          <div className="relative group bg-[#0d1117]">
                            <pre className="text-xs font-mono text-purple-200 overflow-x-auto p-4 pr-14 leading-relaxed">
                              {safeFormatSQL(sql || '', dbType)}
                            </pre>
                            <button
                              onClick={() => handleCopy(sql, 'index', i)}
                              className="absolute top-3 right-3 text-xs font-semibold flex items-center gap-1 text-slate-400 hover:text-purple-300 transition-all bg-[#0a0d14] p-2 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100"
                            >
                              {copiedIndex === i ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          {/* Explanation */}
                          {explanation && (
                            <div className="px-4 py-3 bg-white/2 border-t border-white/6 flex items-start gap-2.5">
                              <Info className="w-3.5 h-3.5 text-blue-400 mt-0.5 shrink-0" />
                              <p className="text-xs text-slate-400 leading-relaxed">{explanation}</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Extra strategy notes that don't pair 1:1 with SQL blocks */}
                  {result.index_suggestions && result.index_suggestions.length > result.index_sql.length && (
                    <section className="bg-blue-500/5 border border-blue-500/15 rounded-xl p-4 space-y-2">
                      <h5 className="text-xs font-bold text-blue-400 mb-2">Additional Strategy Notes</h5>
                      {result.index_suggestions.slice(result.index_sql.length).map((note, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs text-slate-400">
                          <span className="text-blue-400 shrink-0 mt-0.5">→</span>
                          {note}
                        </div>
                      ))}
                    </section>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-white/8 rounded-2xl">
                  <div className="w-12 h-12 rounded-2xl bg-white/4 flex items-center justify-center mb-4">
                    <Database className="w-5 h-5 text-slate-600" />
                  </div>
                  <h3 className="text-base font-bold text-slate-400 mb-1.5">No Indexes Needed</h3>
                  <p className="text-slate-600 text-sm max-w-sm">The AI determined your current schema doesn't require additional indexing for this query.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
