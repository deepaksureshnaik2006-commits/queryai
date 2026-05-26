import { Link } from 'react-router-dom';
import { Book, ArrowLeft, Zap, Database, BarChart2, History, Download } from 'lucide-react';

const Section = ({ icon: Icon, title, children }) => (
  <section className="border border-white/6 rounded-2xl p-6 bg-[#0a0d14]">
    <h2 className="text-base font-bold text-white flex items-center gap-2.5 mb-4">
      <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
        <Icon className="w-4 h-4 text-blue-400" />
      </div>
      {title}
    </h2>
    <div className="text-sm text-slate-400 leading-relaxed space-y-3">{children}</div>
  </section>
);

const Code = ({ children }) => (
  <code className="bg-white/6 border border-white/8 rounded px-1.5 py-0.5 font-mono text-xs text-blue-300">{children}</code>
);

export default function Docs() {
  return (
    <div className="min-h-screen" style={{ background: '#030712' }}>
      <div className="max-w-3xl mx-auto px-6 py-16">

        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Book className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Documentation</h1>
            <p className="text-sm text-slate-500 mt-0.5">Everything you need to use QueryAI effectively</p>
          </div>
        </div>

        <div className="space-y-5">

          <Section icon={Zap} title="Getting Started">
            <p>QueryAI analyzes and rewrites SQL queries using AI to eliminate bottlenecks, suggest indexes, and detect security risks.</p>
            <ol className="list-decimal list-inside space-y-1 text-slate-400">
              <li>Sign in or create a free account.</li>
              <li>Go to the <strong className="text-white">Query Optimizer</strong> tab on the dashboard.</li>
              <li>Paste your SQL query into the editor.</li>
              <li>Select your <strong className="text-white">database type</strong> and <strong className="text-white">explanation level</strong>.</li>
              <li>Click <strong className="text-white">Optimize</strong> and review the results.</li>
            </ol>
          </Section>

          <Section icon={Database} title="Supported Databases">
            <p>QueryAI generates optimizations tailored to the specific SQL dialect and features of each engine.</p>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {['PostgreSQL', 'MySQL', 'SQLite', 'SQL Server'].map(db => (
                <div key={db} className="bg-white/4 border border-white/6 rounded-lg px-3 py-2 text-xs font-semibold text-slate-300">
                  {db}
                </div>
              ))}
            </div>
          </Section>

          <Section icon={Book} title="Explanation Levels">
            <p>Choose how technical the AI explanation should be:</p>
            <div className="space-y-2 mt-1">
              <div className="flex items-start gap-3 bg-emerald-500/5 border border-emerald-500/15 rounded-lg p-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5">BEGINNER</span>
                <p>Plain-English explanations with analogies. No jargon. Ideal for developers new to SQL tuning.</p>
              </div>
              <div className="flex items-start gap-3 bg-blue-500/5 border border-blue-500/15 rounded-lg p-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 shrink-0 mt-0.5">INTERMEDIATE</span>
                <p>Developer-friendly language. Covers indexes, joins, scans, and sorting with clear cause-and-effect reasoning.</p>
              </div>
              <div className="flex items-start gap-3 bg-red-500/5 border border-red-500/15 rounded-lg p-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/15 text-red-400 shrink-0 mt-0.5">DBA EXPERT</span>
                <p>Advanced DBA terminology: cardinality, predicate pushdown, I/O amplification, execution plan analysis.</p>
              </div>
            </div>
          </Section>

          <Section icon={BarChart2} title="Understanding Results">
            <p>The results panel shows four key metrics at the top:</p>
            <ul className="list-disc list-inside space-y-1">
              <li><strong className="text-white">Complexity Score</strong> — a 0–100 rating of the query's inherent complexity.</li>
              <li><strong className="text-white">Performance Gain</strong> — estimated speedup after optimization.</li>
              <li><strong className="text-white">Exec. Time Before / After</strong> — estimated execution times.</li>
              <li><strong className="text-white">Risk Level</strong> — Low, Medium, High, or Critical based on detected issues.</li>
            </ul>
            <p>The <strong className="text-white">AI Analysis</strong> tab shows the full explanation, bottlenecks, and security risks. The <strong className="text-white">Indexes</strong> tab provides ready-to-run <Code>CREATE INDEX</Code> statements.</p>
          </Section>

          <Section icon={History} title="Query History">
            <p>Every optimization you run is automatically saved to your query history (requires a signed-in account). Access it from the <strong className="text-white">History</strong> link in the navigation bar. Each entry is shareable via a unique public link.</p>
          </Section>

          <Section icon={Download} title="Exporting Reports">
            <p>Click <strong className="text-white">Export PDF</strong> in the top-right of the results panel to download a professionally formatted report including:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Executive summary with KPI metrics</li>
              <li>Original and optimized SQL side by side</li>
              <li>Detected bottlenecks and security risks</li>
              <li>All recommended <Code>CREATE INDEX</Code> statements</li>
              <li>Full AI explanation</li>
            </ul>
          </Section>

        </div>
      </div>
    </div>
  );
}
