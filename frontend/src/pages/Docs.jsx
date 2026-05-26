import { Link } from 'react-router-dom';
import { Book, ArrowLeft, Zap, Database, BarChart2, Download } from 'lucide-react';

const Section = ({ icon: Icon, title, children }) => (
  <section className="border border-white/6 rounded-2xl p-6 bg-[#0a0d14]">
    <h2 className="text-sm font-bold text-white flex items-center gap-2.5 mb-4">
      <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
        <Icon className="w-3.5 h-3.5 text-blue-400" />
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
      <div className="max-w-2xl mx-auto px-6 py-16">

        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-300 transition-colors mb-10">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        <div className="flex items-center gap-3 mb-10">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Book className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white tracking-tight">Documentation</h1>
            <p className="text-sm text-slate-500 mt-0.5">How to get the most out of QueryAI</p>
          </div>
        </div>

        <div className="space-y-4">

          <Section icon={Zap} title="How to optimize a query">
            <ol className="list-decimal list-inside space-y-1.5">
              <li>Sign in and go to the <strong className="text-white">Query Optimizer</strong> tab.</li>
              <li>Paste your SQL into the editor.</li>
              <li>Select your <strong className="text-white">database type</strong> (PostgreSQL, MySQL, SQLite, or SQL Server).</li>
              <li>Choose an <strong className="text-white">explanation level</strong> — Beginner, Intermediate, or DBA Expert.</li>
              <li>Click <strong className="text-white">Optimize</strong>. Results appear on the right.</li>
            </ol>
          </Section>

          <Section icon={Database} title="Explanation levels">
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 shrink-0 mt-0.5">BEGINNER</span>
                <p>Plain English with analogies. No jargon — ideal if you're still learning SQL.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-400 shrink-0 mt-0.5">INTERMEDIATE</span>
                <p>Developer-level explanations covering indexes, joins, scans, and filtering.</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/15 text-red-400 shrink-0 mt-0.5">DBA EXPERT</span>
                <p>Advanced terminology — cardinality, predicate pushdown, execution plan analysis, I/O overhead.</p>
              </div>
            </div>
          </Section>

          <Section icon={BarChart2} title="Reading the results">
            <ul className="list-disc list-inside space-y-1.5">
              <li><strong className="text-white">Complexity Score</strong> — 0–100 rating of how complex your query is.</li>
              <li><strong className="text-white">Performance Gain</strong> — estimated speedup from the optimization.</li>
              <li><strong className="text-white">Before / After time</strong> — estimated execution time comparison.</li>
              <li><strong className="text-white">Risk Level</strong> — Low, Medium, High, or Critical based on detected issues.</li>
            </ul>
            <p>Switch between <strong className="text-white">Code Comparison</strong> (diff view), <strong className="text-white">AI Analysis</strong> (explanation + bottlenecks), and <strong className="text-white">Indexes</strong> (ready-to-run <Code>CREATE INDEX</Code> statements).</p>
          </Section>

          <Section icon={Download} title="Exporting a report">
            <p>Click <strong className="text-white">Export PDF</strong> in the results panel to download a clean, professional report containing the KPI summary, both SQL versions, detected issues, and all index recommendations.</p>
            <p>Your query history is saved automatically. Access it via the <strong className="text-white">History</strong> link in the navbar.</p>
          </Section>

        </div>
      </div>
    </div>
  );
}
