import { useState, useRef } from 'react';
import { Play, Database, Loader2, AlignLeft, Code2, Copy, FileText, LayoutTemplate } from 'lucide-react';
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

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden flex flex-col shadow-sm h-[600px]">
      {/* Header */}
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200 flex flex-wrap justify-between items-center gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <Database className="w-5 h-5 text-blue-500" />
          <select 
            value={dbType}
            onChange={(e) => setDbType(e.target.value)}
            className="bg-white border border-gray-300 text-sm text-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium px-3 py-1.5"
          >
            <option value="PostgreSQL">PostgreSQL</option>
            <option value="MySQL">MySQL</option>
            <option value="SQLite">SQLite</option>
            <option value="SQL Server">SQL Server</option>
          </select>
          <select
            value={explanationLevel}
            onChange={(e) => setExplanationLevel(e.target.value)}
            className="bg-white border border-gray-300 text-sm text-gray-700 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 cursor-pointer font-medium px-3 py-1.5"
          >
            <option value="Beginner">Level: Beginner</option>
            <option value="Intermediate">Level: Intermediate</option>
            <option value="DBA Expert">Level: DBA Expert</option>
          </select>
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={!query.trim() || isLoading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-sm font-bold transition-colors shadow-sm w-full sm:w-auto justify-center"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
          {isLoading ? 'Analyzing...' : 'Optimize Query'}
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <button onClick={handleFormat} className="text-xs font-medium text-gray-600 hover:text-blue-600 flex items-center gap-1.5 bg-white hover:bg-blue-50 px-3 py-1.5 rounded-md border border-gray-200 transition-colors">
            <AlignLeft className="w-3.5 h-3.5" /> Format
          </button>
          <button onClick={handleMinify} className="text-xs font-medium text-gray-600 hover:text-blue-600 flex items-center gap-1.5 bg-white hover:bg-blue-50 px-3 py-1.5 rounded-md border border-gray-200 transition-colors">
            <Code2 className="w-3.5 h-3.5" /> Minify
          </button>
          <button onClick={handleCopy} className="text-xs font-medium text-gray-600 hover:text-blue-600 flex items-center gap-1.5 bg-white hover:bg-blue-50 px-3 py-1.5 rounded-md border border-gray-200 transition-colors">
            <Copy className="w-3.5 h-3.5" /> Copy
          </button>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 border-l border-gray-300 pl-3">
          <span className="text-xs text-gray-500 font-semibold flex items-center gap-1 hidden sm:flex"><LayoutTemplate className="w-3.5 h-3.5"/> Templates:</span>
          <button onClick={() => setQuery(DEMO_QUERIES.slowJoin)} className="text-[10px] uppercase font-bold tracking-wider text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2 py-1 rounded transition-colors bg-white border border-gray-200">Slow Join</button>
          <button onClick={() => setQuery(DEMO_QUERIES.subquery)} className="text-[10px] uppercase font-bold tracking-wider text-green-600 hover:text-green-700 hover:bg-green-50 px-2 py-1 rounded transition-colors bg-white border border-gray-200">Subquery</button>
          <button onClick={() => setQuery(DEMO_QUERIES.missingIndex)} className="text-[10px] uppercase font-bold tracking-wider text-orange-600 hover:text-orange-700 hover:bg-orange-50 px-2 py-1 rounded transition-colors bg-white border border-gray-200">Full Scan</button>
        </div>
      </div>
      
      {/* Editor */}
      <div className="relative flex-1 min-h-0 bg-white">
        <Editor
          height="100%"
          defaultLanguage="sql"
          theme="light"
          value={query}
          onChange={(value) => setQuery(value)}
          onMount={handleEditorDidMount}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'JetBrains Mono, monospace',
            lineHeight: 24,
            padding: { top: 16, bottom: 16 },
            scrollBeyondLastLine: false,
            smoothScrolling: true,
            cursorBlinking: 'smooth',
          }}
        />
      </div>
    </div>
  );
}
