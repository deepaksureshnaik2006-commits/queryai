import { useState, useRef } from 'react';
import { Play, Database, Loader2, AlignLeft, Code2, Copy, LayoutTemplate, ChevronDown } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { format } from 'sql-formatter';
import toast from 'react-hot-toast';

const DEMO_QUERIES = {
  slowJoin: `SELECT * FROM users u LEFT JOIN orders o ON u.id = o.user_id LEFT JOIN products p ON o.product_id = p.id WHERE u.status = 'active' AND p.price > 100`,
  subquery: `SELECT id, (SELECT COUNT(*) FROM orders WHERE user_id = users.id) as order_count FROM users WHERE status = 'active'`,
  missingIndex: `SELECT * FROM large_log_table WHERE created_at > '2024-01-01' AND event_type = 'error' ORDER BY created_at DESC`,
};

export default function QueryEditor({ onOptimize, isLoading, explanationLevel, setExplanationLevel }) {
  const [query, setQuery] = useState('');
  const [dbType, setDbType] = useState('PostgreSQL');
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const handleSubmit = () => {
    if (!query.trim()) return;
    onOptimize(query, dbType);
  };

  const handleFormat = () => {
    try {
      const formatted = format(query, { language: dbType.toLowerCase() === 'postgresql' ? 'postgresql' : 'mysql' });
      setQuery(formatted);
      toast.success('Query formatted');
    } catch (e) {
      toast.error('Could not format query');
    }
  };

  const handleMinify = () => {
    try {
      setQuery(query.replace(/\s+/g, ' ').trim());
      toast.success('Query minified');
    } catch (e) {
      toast.error('Could not minify query');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(query);
    toast.success('Copied to clipboard');
  };

  const selectClass = "appearance-none bg-[#0f111a] border border-white/10 text-sm text-slate-300 rounded-lg focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 cursor-pointer font-medium px-3 py-1.5 pr-7 transition-all duration-150";

  return (
    <div className="bg-[#0a0d14] rounded-2xl border border-white/8 overflow-hidden flex flex-col h-[620px] shadow-2xl">

      {/* Header */}
      <div className="px-4 py-3 border-b border-white/6 flex flex-wrap justify-between items-center gap-3" style={{ background: 'rgba(255,255,255,0.02)' }}>
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Database className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Config</span>
          </div>
          <div className="relative">
            <select
              value={dbType}
              onChange={(e) => setDbType(e.target.value)}
              className={selectClass}
            >
              <option value="PostgreSQL">PostgreSQL</option>
              <option value="MySQL">MySQL</option>
              <option value="SQLite">SQLite</option>
              <option value="SQL Server">SQL Server</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={explanationLevel}
              onChange={(e) => setExplanationLevel(e.target.value)}
              className={selectClass}
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="DBA Expert">DBA Expert</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-500 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!query.trim() || isLoading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 shadow-[0_0_16px_-4px_rgba(37,99,235,0.5)] hover:shadow-[0_0_20px_-4px_rgba(37,99,235,0.7)] w-full sm:w-auto justify-center"
        >
          {isLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5 fill-white" />}
          {isLoading ? 'Analyzing...' : 'Optimize'}
        </button>
      </div>

      {/* Toolbar */}
      <div className="px-3 py-2 border-b border-white/5 flex flex-wrap items-center justify-between gap-2" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="flex flex-wrap items-center gap-1.5">
          <button onClick={handleFormat} className="text-xs font-medium text-slate-400 hover:text-blue-400 flex items-center gap-1.5 hover:bg-blue-500/10 px-2.5 py-1.5 rounded-md transition-all duration-150 border border-transparent hover:border-blue-500/20">
            <AlignLeft className="w-3 h-3" /> Format
          </button>
          <button onClick={handleMinify} className="text-xs font-medium text-slate-400 hover:text-blue-400 flex items-center gap-1.5 hover:bg-blue-500/10 px-2.5 py-1.5 rounded-md transition-all duration-150 border border-transparent hover:border-blue-500/20">
            <Code2 className="w-3 h-3" /> Minify
          </button>
          <button onClick={handleCopy} className="text-xs font-medium text-slate-400 hover:text-blue-400 flex items-center gap-1.5 hover:bg-blue-500/10 px-2.5 py-1.5 rounded-md transition-all duration-150 border border-transparent hover:border-blue-500/20">
            <Copy className="w-3 h-3" /> Copy
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-xs text-slate-600 font-medium hidden sm:flex items-center gap-1">
            <LayoutTemplate className="w-3 h-3" /> Examples:
          </span>
          <button onClick={() => setQuery(DEMO_QUERIES.slowJoin)} className="text-[10px] uppercase font-bold tracking-wide text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 px-2 py-1 rounded-md transition-all border border-purple-500/15 hover:border-purple-500/30">
            Slow Join
          </button>
          <button onClick={() => setQuery(DEMO_QUERIES.subquery)} className="text-[10px] uppercase font-bold tracking-wide text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10 px-2 py-1 rounded-md transition-all border border-emerald-500/15 hover:border-emerald-500/30">
            Subquery
          </button>
          <button onClick={() => setQuery(DEMO_QUERIES.missingIndex)} className="text-[10px] uppercase font-bold tracking-wide text-orange-400 hover:text-orange-300 hover:bg-orange-500/10 px-2 py-1 rounded-md transition-all border border-orange-500/15 hover:border-orange-500/30">
            Full Scan
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="relative flex-1 min-h-0" style={{ background: '#0a0d14' }}>
        <Editor
          height="100%"
          defaultLanguage="sql"
          theme="vs-dark"
          value={query}
          onChange={(value) => setQuery(value)}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            fontFamily: 'JetBrains Mono, monospace',
            lineHeight: 22,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
            lineNumbers: 'on',
            renderLineHighlight: 'line',
            scrollbar: { verticalScrollbarSize: 6, horizontalScrollbarSize: 6 },
          }}
        />
      </div>
    </div>
  );
}
