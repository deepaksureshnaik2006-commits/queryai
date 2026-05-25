import { useState } from 'react';
import { Check, Copy, AlertTriangle, Zap, Info, Download, FileJson, Gauge, Activity, ShieldAlert, Code2, Columns, Database, FileText } from 'lucide-react';
import { DiffEditor } from '@monaco-editor/react';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import { format } from 'sql-formatter';

export default function ResultPanel({ result, originalQuery }) {
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
      const MARGIN = 20;
      const CONTENT_W = W - MARGIN * 2;
      const generatedAt = new Date().toLocaleString('en-US', { dateStyle: 'long', timeStyle: 'short' });

      const checkPage = (needed = 20) => {
        if (y + needed > 275) { pdf.addPage(); drawPageFooter(); y = 24; }
      };

      const drawPageFooter = () => {
        const pageCount = pdf.internal.getNumberOfPages();
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 160);
        pdf.text('QueryAI Optimization Report', MARGIN, 289);
        pdf.text(`Page ${pageCount}`, W - MARGIN, 289, { align: 'right' });
        pdf.setDrawColor(220, 220, 230);
        pdf.setLineWidth(0.3);
        pdf.line(MARGIN, 285, W - MARGIN, 285);
      };

      const sectionHeader = (title) => {
        checkPage(18);
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(11);
        pdf.setTextColor(30, 30, 40);
        pdf.text(title.toUpperCase(), MARGIN, y);
        pdf.setDrawColor(59, 130, 246);
        pdf.setLineWidth(0.8);
        pdf.line(MARGIN, y + 2, MARGIN + 30, y + 2);
        pdf.setLineWidth(0.2);
        pdf.setDrawColor(220, 220, 230);
        pdf.line(MARGIN + 31, y + 2, W - MARGIN, y + 2);
        y += 10;
      };

      const bodyText = (text, color = [55, 65, 81]) => {
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(10);
        pdf.setTextColor(...color);
        const lines = pdf.splitTextToSize(text, CONTENT_W - 4);
        checkPage(lines.length * 5.5 + 4);
        pdf.text(lines, MARGIN + 2, y);
        y += lines.length * 5.5 + 3;
      };

      let y = 0;

      // ── COVER HEADER ─────────────────────────────────────────────
      pdf.setFillColor(10, 13, 20);
      pdf.rect(0, 0, W, 48, 'F');
      pdf.setFillColor(59, 130, 246);
      pdf.rect(0, 48, W, 1.5, 'F');

      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(20);
      pdf.setTextColor(255, 255, 255);
      pdf.text('QueryAI', MARGIN, 22);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(148, 163, 184);
      pdf.text('SQL Optimization Report', MARGIN, 31);

      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(8.5);
      pdf.setTextColor(100, 116, 139);
      pdf.text(`Generated: ${generatedAt}`, MARGIN, 43);

      const riskLevelText = result.query_risk_level || 'Unknown';
      const riskBadgeX = W - MARGIN - 36;
      const riskColor =
        riskLevelText === 'Critical' ? [239, 68, 68] :
        riskLevelText === 'High'     ? [249, 115, 22] :
        riskLevelText === 'Medium'   ? [234, 179, 8] :
                                       [34, 197, 94];
      pdf.setFillColor(...riskColor);
      pdf.roundedRect(riskBadgeX, 33, 36, 8, 2, 2, 'F');
      pdf.setFont('helvetica', 'bold');
      pdf.setFontSize(8);
      pdf.setTextColor(255, 255, 255);
      pdf.text(`${riskLevelText} Risk`, riskBadgeX + 18, 38.5, { align: 'center' });

      y = 60;

      // ── KPI CARDS ────────────────────────────────────────────────
      const kpis = [
        { label: 'Complexity Score', value: `${result.complexity_score || 0}/100`, rgb: [59, 130, 246] },
        { label: 'Performance Gain', value: result.performance_gain || 'N/A', rgb: [34, 197, 94] },
        { label: 'Time Before', value: result.estimated_execution_time_before || 'N/A', rgb: [239, 68, 68] },
        { label: 'Time After', value: result.estimated_execution_time_after || 'N/A', rgb: [34, 197, 94] },
      ];
      const cardW = (CONTENT_W - 9) / 4;
      kpis.forEach((k, i) => {
        const cx = MARGIN + i * (cardW + 3);
        pdf.setFillColor(245, 247, 250);
        pdf.roundedRect(cx, y, cardW, 22, 2, 2, 'F');
        pdf.setFillColor(...k.rgb);
        pdf.roundedRect(cx, y, cardW, 2.5, 2, 2, 'F');
        pdf.setFont('helvetica', 'bold');
        pdf.setFontSize(13);
        pdf.setTextColor(...k.rgb);
        pdf.text(k.value, cx + cardW / 2, y + 13, { align: 'center' });
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(7.5);
        pdf.setTextColor(100, 116, 139);
        pdf.text(k.label, cx + cardW / 2, y + 19, { align: 'center' });
      });
      y += 30;

      // ── AI EXPLANATION ───────────────────────────────────────────
      sectionHeader('AI Strategy & Explanation');
      pdf.setFillColor(239, 246, 255);
      const explanationLines = pdf.splitTextToSize(result.explanation || 'No explanation provided.', CONTENT_W - 8);
      checkPage(explanationLines.length * 5.5 + 10);
      pdf.roundedRect(MARGIN, y - 3, CONTENT_W, explanationLines.length * 5.5 + 8, 2, 2, 'F');
      pdf.setFont('helvetica', 'normal');
      pdf.setFontSize(10);
      pdf.setTextColor(30, 58, 138);
      pdf.text(explanationLines, MARGIN + 4, y + 2);
      y += explanationLines.length * 5.5 + 12;

      // ── ORIGINAL QUERY ───────────────────────────────────────────
      if (originalQuery) {
        checkPage(16);
        sectionHeader('Original Query');
        const origLines = pdf.splitTextToSize(originalQuery, CONTENT_W - 8);
        checkPage(origLines.length * 5 + 10);
        pdf.setFillColor(248, 248, 252);
        pdf.roundedRect(MARGIN, y - 3, CONTENT_W, origLines.length * 5 + 8, 2, 2, 'F');
        pdf.setDrawColor(200, 200, 210);
        pdf.setLineWidth(0.3);
        pdf.roundedRect(MARGIN, y - 3, CONTENT_W, origLines.length * 5 + 8, 2, 2, 'D');
        pdf.setFont('courier', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(60, 60, 80);
        pdf.text(origLines, MARGIN + 4, y + 2);
        y += origLines.length * 5 + 14;
      }

      // ── OPTIMIZED QUERY ──────────────────────────────────────────
      if (result.optimized_query) {
        checkPage(16);
        sectionHeader('Optimized Query');
        const optLines = pdf.splitTextToSize(result.optimized_query, CONTENT_W - 8);
        checkPage(optLines.length * 5 + 10);
        pdf.setFillColor(240, 253, 244);
        pdf.roundedRect(MARGIN, y - 3, CONTENT_W, optLines.length * 5 + 8, 2, 2, 'F');
        pdf.setDrawColor(34, 197, 94);
        pdf.setLineWidth(0.5);
        pdf.line(MARGIN, y - 3, MARGIN, y - 3 + optLines.length * 5 + 8);
        pdf.setFont('courier', 'normal');
        pdf.setFontSize(9);
        pdf.setTextColor(20, 83, 45);
        pdf.text(optLines, MARGIN + 5, y + 2);
        y += optLines.length * 5 + 14;
      }

      // ── DETECTED BOTTLENECKS ─────────────────────────────────────
      if (result.issues_found && result.issues_found.length > 0) {
        checkPage(16);
        sectionHeader('Detected Bottlenecks');
        result.issues_found.forEach((issue) => {
          const lines = pdf.splitTextToSize(issue, CONTENT_W - 14);
          checkPage(lines.length * 5.5 + 8);
          pdf.setFillColor(255, 247, 237);
          pdf.roundedRect(MARGIN, y - 2, CONTENT_W, lines.length * 5.5 + 6, 2, 2, 'F');
          pdf.setFillColor(249, 115, 22);
          pdf.circle(MARGIN + 5, y + lines.length * 2.5, 1.5, 'F');
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(10);
          pdf.setTextColor(124, 45, 18);
          pdf.text(lines, MARGIN + 10, y + 2);
          y += lines.length * 5.5 + 8;
        });
        y += 4;
      }

      // ── SECURITY RISKS ───────────────────────────────────────────
      if (result.detected_risks && result.detected_risks.length > 0) {
        checkPage(16);
        sectionHeader('Security & Logic Risks');
        result.detected_risks.forEach((risk) => {
          const lines = pdf.splitTextToSize(risk, CONTENT_W - 14);
          checkPage(lines.length * 5.5 + 8);
          pdf.setFillColor(254, 242, 242);
          pdf.roundedRect(MARGIN, y - 2, CONTENT_W, lines.length * 5.5 + 6, 2, 2, 'F');
          pdf.setFillColor(239, 68, 68);
          pdf.rect(MARGIN, y - 2, 2.5, lines.length * 5.5 + 6, 'F');
          pdf.setFont('helvetica', 'normal');
          pdf.setFontSize(10);
          pdf.setTextColor(127, 29, 29);
          pdf.text(lines, MARGIN + 7, y + 2);
          y += lines.length * 5.5 + 8;
        });
        y += 4;
      }

      // ── INDEX RECOMMENDATIONS ────────────────────────────────────
      if (result.index_sql && result.index_sql.length > 0) {
        checkPage(16);
        sectionHeader('Recommended Indexes');
        result.index_sql.forEach((sql, i) => {
          const lines = pdf.splitTextToSize(sql, CONTENT_W - 10);
          checkPage(lines.length * 5 + 12);
          pdf.setFillColor(245, 243, 255);
          pdf.roundedRect(MARGIN, y - 2, CONTENT_W, lines.length * 5 + 8, 2, 2, 'F');
          pdf.setDrawColor(139, 92, 246);
          pdf.setLineWidth(0.4);
          pdf.roundedRect(MARGIN, y - 2, CONTENT_W, lines.length * 5 + 8, 2, 2, 'D');
          pdf.setFont('helvetica', 'bold');
          pdf.setFontSize(7.5);
          pdf.setTextColor(109, 40, 217);
          pdf.text(`INDEX ${i + 1}`, MARGIN + 3, y + 2);
          pdf.setFont('courier', 'normal');
          pdf.setFontSize(9);
          pdf.setTextColor(76, 29, 149);
          pdf.text(lines, MARGIN + 4, y + 7);
          y += lines.length * 5 + 14;
        });
      }

      // ── INDEX SUGGESTIONS (text) ─────────────────────────────────
      if (result.index_suggestions && result.index_suggestions.length > 0) {
        checkPage(16);
        sectionHeader('Index Strategy Notes');
        result.index_suggestions.forEach((note) => {
          bodyText(`→  ${note}`, [75, 85, 99]);
        });
        y += 4;
      }

      // ── FOOTER on all pages ──────────────────────────────────────
      const totalPages = pdf.internal.getNumberOfPages();
      for (let p = 1; p <= totalPages; p++) {
        pdf.setPage(p);
        drawPageFooter();
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 160);
        pdf.text(`Page ${p} of ${totalPages}`, W - MARGIN, 289, { align: 'right' });
      }

      const slug = new Date().toISOString().slice(0, 10);
      pdf.save(`queryai-report-${slug}.pdf`);
      toast.success('PDF report downloaded', { id: toastId });
    } catch (e) {
      console.error(e);
      toast.error('Failed to export PDF', { id: toastId });
    }
  };

  const handleExportJSON = () => {
    const reportId = Math.random().toString(36).slice(2, 10).toUpperCase();
    const report = {
      meta: {
        report_id: reportId,
        generated_by: 'QueryAI',
        generated_at: new Date().toISOString(),
        version: '2.0',
      },
      summary: {
        complexity_score: result.complexity_score ?? null,
        performance_gain: result.performance_gain ?? null,
        query_risk_level: result.query_risk_level ?? null,
        estimated_execution_time: {
          before: result.estimated_execution_time_before ?? null,
          after: result.estimated_execution_time_after ?? null,
        },
      },
      queries: {
        original: originalQuery || null,
        optimized: result.optimized_query || null,
      },
      analysis: {
        explanation: result.explanation || null,
        issues_found: result.issues_found || [],
        detected_risks: result.detected_risks || [],
      },
      indexes: {
        suggestions: result.index_suggestions || [],
        sql_statements: result.index_sql || [],
      },
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const a = document.createElement('a');
    const slug = new Date().toISOString().slice(0, 10);
    a.setAttribute('href', dataStr);
    a.setAttribute('download', `queryai-report-${slug}.json`);
    document.body.appendChild(a);
    a.click();
    a.remove();
    toast.success('JSON report downloaded');
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
        </h3>
        <div className="flex items-center gap-2">
          <button onClick={handleExportJSON} className="text-xs font-semibold flex items-center gap-1.5 text-slate-400 hover:text-slate-200 transition-all hover:bg-white/6 px-3 py-1.5 rounded-lg border border-white/8 hover:border-white/15">
            <FileJson className="w-3.5 h-3.5" /> JSON
          </button>
          <button onClick={handleExportPDF} className="text-xs font-semibold flex items-center gap-1.5 text-blue-400 hover:text-blue-300 transition-all bg-blue-500/10 hover:bg-blue-500/15 px-3 py-1.5 rounded-lg border border-blue-500/20">
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>
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
