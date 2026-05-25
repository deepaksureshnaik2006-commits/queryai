import { useState } from 'react';
import { Check, Copy, AlertTriangle, Zap, Info, Download, FileJson, Gauge, Activity, ShieldAlert, Code2, Columns, Database, FileText } from 'lucide-react';
import { DiffEditor } from '@monaco-editor/react';
import jsPDF from 'jspdf';
import toast from 'react-hot-toast';
import { format } from 'sql-formatter';

export default function ResultPanel({ result, originalQuery }) {
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [activeTab, setActiveTab] = useState('diff'); // 'diff', 'analysis', 'indexes'
  const [viewMode, setViewMode] = useState('diff'); // 'diff' or 'code'

  if (!result) {
    return (
      <div className="h-full min-h-[600px] flex flex-col items-center justify-center text-gray-400 border border-dashed border-gray-300 rounded-2xl p-8 bg-white/50 backdrop-blur-sm shadow-sm">
        <Activity className="w-16 h-16 mb-6 opacity-20 text-blue-500" />
        <p className="font-semibold text-lg text-gray-500">Awaiting your query...</p>
        <p className="text-sm text-gray-400 mt-2">Optimization results will be rendered here.</p>
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
      let y = 20;
      
      // Document Title
      pdf.setFontSize(22);
      pdf.setFont("helvetica", "bold");
      pdf.text("QueryAI Optimization Report", 20, y);
      y += 15;
      
      // Key Metrics
      pdf.setFontSize(12);
      pdf.text(`Complexity Score: ${result.complexity_score}/100`, 20, y);
      y += 8;
      pdf.text(`Performance Gain: ${result.performance_gain}`, 20, y);
      y += 8;
      pdf.text(`Execution Time: ${result.estimated_execution_time_before} -> ${result.estimated_execution_time_after}`, 20, y);
      y += 8;
      pdf.text(`Risk Level: ${result.query_risk_level}`, 20, y);
      y += 15;
      
      // Strategy section
      pdf.setFontSize(16);
      pdf.text("AI Strategy & Explanation", 20, y);
      y += 10;
      pdf.setFontSize(11);
      pdf.setFont("helvetica", "normal");
      const splitExplanation = pdf.splitTextToSize(result.explanation || '', 170);
      pdf.text(splitExplanation, 20, y);
      y += (splitExplanation.length * 6) + 10;
      
      if (y > 270) { pdf.addPage(); y = 20; }
      
      // Bottlenecks
      if (result.issues_found && result.issues_found.length > 0) {
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("Detected Bottlenecks", 20, y);
        y += 10;
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        result.issues_found.forEach(issue => {
          const splitIssue = pdf.splitTextToSize(`• ${issue}`, 170);
          if (y > 280) { pdf.addPage(); y = 20; }
          pdf.text(splitIssue, 20, y);
          y += (splitIssue.length * 6) + 2;
        });
        y += 10;
      }
      
      if (y > 270) { pdf.addPage(); y = 20; }
      
      // Risks
      if (result.detected_risks && result.detected_risks.length > 0) {
        pdf.setFontSize(16);
        pdf.setFont("helvetica", "bold");
        pdf.text("Security & Logic Risks", 20, y);
        y += 10;
        pdf.setFontSize(11);
        pdf.setFont("helvetica", "normal");
        result.detected_risks.forEach(risk => {
          const splitRisk = pdf.splitTextToSize(`! ${risk}`, 170);
          if (y > 280) { pdf.addPage(); y = 20; }
          pdf.text(splitRisk, 20, y);
          y += (splitRisk.length * 6) + 2;
        });
      }
      
      pdf.save('query-optimization-report.pdf');
      toast.success('PDF Downloaded successfully', { id: toastId });
    } catch (e) {
      toast.error('Failed to export PDF', { id: toastId });
      console.error(e);
    }
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(result, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "optimization-data.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast.success('JSON Downloaded');
  };

  const getRiskColor = (level) => {
    switch (level?.toLowerCase()) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col h-full shadow-sm animate-in fade-in zoom-in-95 duration-300 min-h-[600px]">
      
      {/* Header */}
      <div className="bg-gray-50 px-5 py-3 border-b border-gray-200 flex justify-between items-center gap-4 flex-wrap">
        <h3 className="font-extrabold text-gray-900 flex items-center gap-2">
          <Zap className="w-5 h-5 text-yellow-500" />
          Optimization Report
        </h3>
        <div className="flex items-center gap-3">
          <button onClick={handleExportJSON} className="text-xs font-bold flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors bg-white hover:bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
            <FileJson className="w-3.5 h-3.5" /> JSON
          </button>
          <button onClick={handleExportPDF} className="text-xs font-bold flex items-center gap-1.5 text-blue-600 hover:text-blue-700 transition-colors bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200 shadow-sm">
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>
      </div>
      
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* KPI Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 border-b border-gray-200 divide-x divide-gray-200 bg-white shrink-0">
          <div className="p-4 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-gray-500 mb-1 flex items-center gap-1"><Gauge className="w-3 h-3"/> Complexity</span>
            <div className="flex items-end gap-2">
              <span className="text-2xl font-black text-gray-900">{result.complexity_score || 0}</span>
              <span className="text-xs text-gray-500 mb-1">/100</span>
            </div>
            <div className="w-full bg-gray-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-blue-500" style={{ width: `${result.complexity_score || 0}%` }}></div>
            </div>
          </div>
          <div className="p-4 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-gray-500 mb-1 flex items-center gap-1"><Zap className="w-3 h-3"/> Gain</span>
            <span className="text-xl font-black text-green-600">{result.performance_gain}</span>
          </div>
          <div className="p-4 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-gray-500 mb-1">Before / After</span>
            <span className="text-sm font-bold text-red-500 line-through">{result.estimated_execution_time_before || 'N/A'}</span>
            <span className="text-lg font-black text-green-600">{result.estimated_execution_time_after || 'N/A'}</span>
          </div>
          <div className="p-4 flex flex-col justify-center">
            <span className="text-[10px] uppercase font-bold text-gray-500 mb-1 flex items-center gap-1"><ShieldAlert className="w-3 h-3"/> Risk Level</span>
            <span className={`mt-1 inline-block px-2.5 py-1 rounded-md text-xs font-bold border w-max ${getRiskColor(result.query_risk_level)}`}>
              {result.query_risk_level || 'Unknown'}
            </span>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="flex border-b border-gray-200 bg-gray-50 px-4 shrink-0 overflow-x-auto gap-4">
          <button 
            onClick={() => setActiveTab('diff')}
            className={`flex items-center gap-2 px-2 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'diff' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <Code2 className="w-4 h-4" /> Code Comparison
          </button>
          <button 
            onClick={() => setActiveTab('analysis')}
            className={`flex items-center gap-2 px-2 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'analysis' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <FileText className="w-4 h-4" /> AI Analysis & Risks
          </button>
          <button 
            onClick={() => setActiveTab('indexes')}
            className={`flex items-center gap-2 px-2 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'indexes' ? 'border-blue-600 text-blue-700' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            <Database className="w-4 h-4" /> Generated Indexes
          </button>
        </div>

        {/* Tab Content Area */}
        <div className="flex-1 overflow-y-auto p-5 bg-white">
          
          {/* TAB: CODE COMPARISON */}
          {activeTab === 'diff' && (
            <div className="h-full min-h-[400px] flex flex-col animate-in fade-in duration-300">
              <div className="flex justify-between items-center mb-3 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
                    <button onClick={() => setViewMode('diff')} className={`text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${viewMode === 'diff' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                      <Columns className="w-3.5 h-3.5" /> Diff View
                    </button>
                    <button onClick={() => setViewMode('code')} className={`text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors ${viewMode === 'code' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}>
                      <Code2 className="w-3.5 h-3.5" /> Final Code
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(result.optimized_query)}
                  className="text-xs font-bold flex items-center gap-1.5 text-gray-700 hover:text-gray-900 transition-colors bg-white hover:bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-300 shadow-sm"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              
              <div className="flex-1 min-h-[500px] rounded-xl overflow-hidden border border-gray-200 shadow-inner relative">
                {viewMode === 'diff' ? (
                  <DiffEditor
                    height="100%"
                    language="sql"
                    theme="vs-light"
                    original={format(originalQuery || '', { language: 'postgresql' })}
                    modified={format(result.optimized_query || '', { language: 'postgresql' })}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 13,
                      fontFamily: 'JetBrains Mono, monospace',
                      renderSideBySide: true,
                    }}
                  />
                ) : (
                  <DiffEditor
                    height="100%"
                    language="sql"
                    theme="vs-light"
                    original={format(result.optimized_query || '', { language: 'postgresql' })}
                    modified={format(result.optimized_query || '', { language: 'postgresql' })}
                    options={{
                      readOnly: true,
                      minimap: { enabled: false },
                      fontSize: 13,
                      renderSideBySide: false,
                    }}
                  />
                )}
              </div>
            </div>
          )}

          {/* TAB: AI ANALYSIS */}
          {activeTab === 'analysis' && (
            <div className="space-y-8 animate-in fade-in duration-300 max-w-4xl">
              <section>
                <h4 className="text-lg font-extrabold text-gray-900 flex items-center gap-2 mb-4">
                  <Info className="w-5 h-5 text-blue-500" /> AI Strategy & Explanation
                </h4>
                <div className="bg-blue-50/50 p-6 rounded-xl border border-blue-100 shadow-sm">
                  <p className="text-base text-gray-800 leading-relaxed font-medium">
                    {result.explanation}
                  </p>
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {result.issues_found && result.issues_found.length > 0 && (
                  <section className="bg-orange-50/50 p-6 rounded-xl border border-orange-100 shadow-sm">
                    <h4 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
                      <AlertTriangle className="w-5 h-5 text-orange-500" /> Detected Bottlenecks
                    </h4>
                    <ul className="space-y-3">
                      {result.issues_found.map((issue, i) => (
                        <li key={i} className="text-sm text-gray-700 font-medium flex items-start gap-2 bg-white p-3 rounded-lg border border-orange-200 shadow-sm">
                          <span className="text-orange-500 mt-0.5 font-bold">•</span>
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}

                {result.detected_risks && result.detected_risks.length > 0 && (
                  <section className="bg-red-50/50 p-6 rounded-xl border border-red-100 shadow-sm">
                    <h4 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-4">
                      <ShieldAlert className="w-5 h-5 text-red-500" /> Security & Logic Risks
                    </h4>
                    <ul className="space-y-3">
                      {result.detected_risks.map((risk, i) => (
                        <li key={i} className="text-sm text-gray-700 font-medium flex items-start gap-2 bg-white p-3 rounded-lg border border-red-200 shadow-sm">
                          <span className="text-red-500 mt-0.5 font-bold">!</span>
                          {risk}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </div>
          )}

          {/* TAB: INDEXES */}
          {activeTab === 'indexes' && (
            <div className="animate-in fade-in duration-300 max-w-4xl">
              {result.index_sql && result.index_sql.length > 0 ? (
                <section>
                  <h4 className="text-lg font-extrabold text-gray-900 flex items-center gap-2 mb-4">
                    <Database className="w-5 h-5 text-purple-600" /> Recommended Indexes
                  </h4>
                  <div className="space-y-4">
                    {result.index_sql.map((sql, i) => (
                      <div key={i} className="relative bg-purple-50 border border-purple-200 rounded-xl overflow-hidden p-5 group shadow-sm">
                        <pre className="text-sm font-mono text-purple-900 overflow-x-auto pr-16">{format(sql || '', { language: 'postgresql' })}</pre>
                        <button
                          onClick={() => handleCopy(sql, 'index', i)}
                          className="absolute top-1/2 -translate-y-1/2 right-4 text-xs font-bold flex items-center gap-1.5 text-gray-600 hover:text-purple-700 transition-colors bg-white p-2.5 rounded-lg border border-purple-200 opacity-0 group-hover:opacity-100 shadow-sm"
                        >
                          {copiedIndex === i ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50">
                  <Database className="w-12 h-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-bold text-gray-700 mb-2">No Indexes Needed</h3>
                  <p className="text-gray-500 text-sm max-w-sm">The AI determined that your current schema does not require any additional indexing for this query.</p>
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
