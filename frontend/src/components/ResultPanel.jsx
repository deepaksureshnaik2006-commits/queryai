import { useState } from 'react';
import { Check, Copy, AlertTriangle, Zap, Info, Download, Gauge, Activity, ShieldAlert, Code2, Columns, Database, FileText } from 'lucide-react';
import { DiffEditor } from '@monaco-editor/react';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import { format } from 'sql-formatter';

const LEVEL_META = {
  beginner:      { label: 'Beginner',     color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25' },
  intermediate:  { label: 'Intermediate', color: 'text-blue-400 bg-blue-500/10 border-blue-500/25' },
  expert:        { label: 'Expert',        color: 'text-red-400 bg-red-500/10 border-red-500/25' },
  'dba expert':  { label: 'DBA Expert',   color: 'text-red-400 bg-red-500/10 border-red-500/25' },
};

const getLevelMeta = (level) => LEVEL_META[(level || '').toLowerCase()] || LEVEL_META.intermediate;

export default function ResultPanel({ result, originalQuery, explanationLevel }) {
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
      const M = 18;
      const CW = W - M * 2;
      const generatedAt = new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });
      let y = 0;

      // ── Color palette ──────────────────────────────────────────────
      const NAVY   = [15, 33, 65];
      const DKGRAY = [30, 41, 59];
      const MIDGRAY= [71, 85, 105];
      const LTGRAY = [148, 163, 184];
      const RULE   = [226, 232, 240];
      const PAGBG  = [255, 255, 255];
      const CARDBG = [248, 250, 252];
      const BLUE   = [37, 99, 235];
      const LTBLUE = [96, 165, 250];
      const GREEN  = [22, 163, 74];
      const RED    = [220, 38, 38];
      const ORANGE = [234, 88, 12];
      const PURPLE = [124, 58, 237];

      // ── Helpers ────────────────────────────────────────────────────
      const checkPage = (need = 18) => {
        if (y + need > 274) {
          pdf.addPage();
          pdf.setFillColor(...PAGBG);
          pdf.rect(0, 0, W, 297, 'F');
          y = M + 4;
          drawFooter();
        }
      };

      const drawFooter = () => {
        const pg = pdf.internal.getNumberOfPages();
        pdf.setDrawColor(...RULE);
        pdf.setLineWidth(0.25);
        pdf.line(M, 284, W - M, 284);
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7.5);
        pdf.setTextColor(...LTGRAY);
        pdf.text('QueryAI — SQL Optimization Report', M, 289.5);
        pdf.text(`Page ${pg}`, W - M, 289.5, { align: 'right' });
      };

      const sectionHeader = (title) => {
        checkPage(18);
        y += 3;
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(9);
        pdf.setTextColor(...NAVY);
        pdf.text(title.toUpperCase(), M, y);
        const tw = pdf.getTextWidth(title.toUpperCase());
        y += 2;
        pdf.setDrawColor(...BLUE);
        pdf.setLineWidth(1.2);
        pdf.line(M, y, M + tw + 2, y);
        pdf.setDrawColor(...RULE);
        pdf.setLineWidth(0.25);
        pdf.line(M + tw + 4, y, W - M, y);
        y += 7;
      };

      const bodyText = (text, indent = 0, color = DKGRAY, size = 9.5) => {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(size);
        pdf.setTextColor(...color);
        const lines = pdf.splitTextToSize(text, CW - indent - 2);
        checkPage(lines.length * 5.2 + 3);
        pdf.text(lines, M + indent, y);
        y += lines.length * 5.2 + 2;
      };

      const formatSQL = (sql) => {
        try {
          return format(sql || '', { language: 'postgresql', tabWidth: 2, keywordCase: 'upper', linesBetweenQueries: 1 });
        } catch { return sql || ''; }
      };

      const codeBlock = (sql, accentColor = null) => {
        const formatted = formatSQL(sql);
        const lines = pdf.splitTextToSize(formatted, CW - 10);
        const blockH = Math.max(lines.length * 4.6 + 8, 14);
        checkPage(blockH + 4);
        pdf.setFillColor(...CARDBG);
        pdf.setDrawColor(...RULE);
        pdf.setLineWidth(0.3);
        pdf.roundedRect(M, y, CW, blockH, 1.5, 1.5, 'FD');
        if (accentColor) {
          pdf.setFillColor(...accentColor);
          pdf.rect(M, y, 2, blockH, 'F');
        }
        pdf.setFont('courier', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(...DKGRAY);
        const startX = accentColor ? M + 5 : M + 4;
        pdf.text(lines, startX, y + 5.5);
        y += blockH + 5;
      };

      const accentRow = (text, dotColor = MIDGRAY) => {
        const lines = pdf.splitTextToSize(text, CW - 8);
        const rowH = lines.length * 5 + 6;
        checkPage(rowH + 2);
        pdf.setFillColor(...dotColor);
        pdf.rect(M, y + 1, 1.8, rowH - 3, 'F');
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(9.5);
        pdf.setTextColor(...DKGRAY);
        pdf.text(lines, M + 5, y + 4.5);
        pdf.setDrawColor(...RULE);
        pdf.setLineWidth(0.2);
        pdf.line(M, y + rowH, W - M, y + rowH);
        y += rowH + 1;
      };

      // ── White page background ──────────────────────────────────────
      pdf.setFillColor(...PAGBG);
      pdf.rect(0, 0, W, 297, 'F');

      // ── COVER HEADER ──────────────────────────────────────────────
      pdf.setFillColor(...NAVY);
      pdf.rect(0, 0, W, 44, 'F');
      pdf.setFillColor(...BLUE);
      pdf.rect(0, 44, W, 1.5, 'F');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(24);
      pdf.setTextColor(255, 255, 255);
      pdf.text('QueryAI', M, 20);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(9.5);
      pdf.setTextColor(...LTBLUE);
      pdf.text('SQL Optimization Report', M, 29);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7.5);
      pdf.setTextColor(100, 130, 165);
      pdf.text(`Generated  ${generatedAt}`, M, 38);

      // Risk level — top right of header
      const riskText = (result.query_risk_level || 'Unknown').toUpperCase();
      const riskColor =
        riskText === 'CRITICAL' ? RED :
        riskText === 'HIGH'     ? ORANGE :
        riskText === 'MEDIUM'   ? [161, 120, 0] :
                                  GREEN;
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(...riskColor);
      pdf.text(riskText, W - M, 22, { align: 'right' });
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.setTextColor(100, 130, 165);
      pdf.text('RISK LEVEL', W - M, 29, { align: 'right' });

      // Explanation level — below risk
      const lvlText = (result.explanation_level || explanationLevel || 'intermediate').toUpperCase();
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(7);
      pdf.setTextColor(100, 130, 165);
      pdf.text('EXPLANATION', W - M, 36, { align: 'right' });
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(...LTBLUE);
      pdf.text(lvlText, W - M, 41, { align: 'right' });

      y = 56;

      // ── KPI ROW ────────────────────────────────────────────────────
      const kpis = [
        { label: 'COMPLEXITY SCORE',   value: `${result.complexity_score || 0}/100` },
        { label: 'PERFORMANCE GAIN',   value: result.performance_gain || '—' },
        { label: 'EXEC. TIME BEFORE',  value: result.estimated_execution_time_before || '—' },
        { label: 'EXEC. TIME AFTER',   value: result.estimated_execution_time_after  || '—' },
      ];
      const cw4 = (CW - 6) / 4;
      kpis.forEach((k, i) => {
        const cx = M + i * (cw4 + 2);
        pdf.setFillColor(...CARDBG);
        pdf.setDrawColor(...RULE);
        pdf.setLineWidth(0.3);
        pdf.roundedRect(cx, y, cw4, 20, 1.5, 1.5, 'FD');
        // Blue top accent bar
        pdf.setFillColor(...BLUE);
        pdf.rect(cx, y, cw4, 1.5, 'F');

        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11.5);
        pdf.setTextColor(...NAVY);
        pdf.text(k.value, cx + cw4 / 2, y + 11, { align: 'center' });

        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(6.5);
        pdf.setTextColor(...LTGRAY);
        pdf.text(k.label, cx + cw4 / 2, y + 17, { align: 'center' });
      });
      y += 28;

      // ── AI EXPLANATION ─────────────────────────────────────────────
      sectionHeader('AI Strategy & Explanation');
      bodyText(result.explanation || 'No explanation provided.', 0, DKGRAY, 9.5);
      y += 3;

      // ── ORIGINAL QUERY ─────────────────────────────────────────────
      if (originalQuery) {
        sectionHeader('Original Query');
        codeBlock(originalQuery, null);
      }

      // ── OPTIMIZED QUERY ────────────────────────────────────────────
      if (result.optimized_query) {
        sectionHeader('Optimized Query');
        codeBlock(result.optimized_query, BLUE);
      }

      // ── DETECTED BOTTLENECKS ───────────────────────────────────────
      if (result.issues_found?.length > 0) {
        sectionHeader('Detected Bottlenecks');
        result.issues_found.forEach((item) => accentRow(item, ORANGE));
        y += 4;
      }

      // ── SECURITY & LOGIC RISKS ─────────────────────────────────────
      if (result.detected_risks?.length > 0) {
        sectionHeader('Security & Logic Risks');
        result.detected_risks.forEach((item) => accentRow(item, RED));
        y += 4;
      }

      // ── RECOMMENDED INDEXES ────────────────────────────────────────
      if (result.index_sql?.length > 0) {
        sectionHeader('Recommended Indexes');
        result.index_sql.forEach((sql, i) => {
          checkPage(14);
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(7.5);
          pdf.setTextColor(...MIDGRAY);
          pdf.text(`INDEX ${i + 1}`, M, y);
          y += 5;
          codeBlock(sql, PURPLE);
        });
      }

      // ── INDEX STRATEGY NOTES ───────────────────────────────────────
      if (result.index_suggestions?.length > 0) {
        sectionHeader('Index Strategy Notes');
        result.index_suggestions.forEach((note) => accentRow(note, BLUE));
        y += 2;
      }

      // ── FOOTER ON ALL PAGES ────────────────────────────────────────
      const total = pdf.internal.getNumberOfPages();
      for (let p = 1; p <= total; p++) {
        pdf.setPage(p);
        drawFooter();
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7.5);
        pdf.setTextColor(...LTGRAY);
        pdf.text(`${p} of ${total}`, W - M, 289.5, { align: 'right' });
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
          <div className="p-4 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-slate-600 mb-1.5 flex items-center gap-1">
              <Zap className="w-3 h-3" /> Gain
            </span>
            <span className="text-xl font-black text-emerald-400">{result.performance_gain}</span>
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
              <div className="flex-1 min-h-[450px] rounded-xl overflow-hidden border border-white/8">
                {viewMode === 'diff' ? (
                  <DiffEditor
                    height="100%"
                    language="sql"
                    theme="vs-dark"
                    original={format(originalQuery || '', { language: 'postgresql' })}
                    modified={format(result.optimized_query || '', { language: 'postgresql' })}
                    options={{ readOnly: true, minimap: { enabled: false }, fontSize: 12, fontFamily: 'JetBrains Mono, monospace', renderSideBySide: true }}
                  />
                ) : (
                  <DiffEditor
                    height="100%"
                    language="sql"
                    theme="vs-dark"
                    original={format(result.optimized_query || '', { language: 'postgresql' })}
                    modified={format(result.optimized_query || '', { language: 'postgresql' })}
                    options={{ readOnly: true, minimap: { enabled: false }, fontSize: 12, fontFamily: 'JetBrains Mono, monospace', renderSideBySide: false }}
                  />
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
            <div className="max-w-4xl">
              {result.index_sql && result.index_sql.length > 0 ? (
                <section>
                  <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                    <div className="w-5 h-5 rounded bg-purple-500/15 flex items-center justify-center">
                      <Database className="w-3 h-3 text-purple-400" />
                    </div>
                    Recommended Indexes
                  </h4>
                  <div className="space-y-3">
                    {result.index_sql.map((sql, i) => (
                      <div key={i} className="relative bg-purple-500/5 border border-purple-500/15 rounded-xl overflow-hidden group">
                        <pre className="text-xs font-mono text-purple-300 overflow-x-auto p-4 pr-14 leading-relaxed">
                          {format(sql || '', { language: 'postgresql' })}
                        </pre>
                        <button
                          onClick={() => handleCopy(sql, 'index', i)}
                          className="absolute top-3 right-3 text-xs font-semibold flex items-center gap-1 text-slate-400 hover:text-purple-300 transition-all bg-[#0a0d14] p-2 rounded-lg border border-white/10 opacity-0 group-hover:opacity-100"
                        >
                          {copiedIndex === i ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
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
