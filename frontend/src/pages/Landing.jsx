import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ArrowRight, Zap, Activity, Database, CheckCircle2, ShieldCheck, Code2,
  TrendingUp, Lock, BarChart3, Search, GitBranch, Layers, Clock, Star,
  ChevronRight, Terminal, Cpu, Globe
} from 'lucide-react';

const DEMO_SQL_BEFORE = `SELECT *
FROM users u
LEFT JOIN orders o
  ON u.id = o.user_id
LEFT JOIN products p
  ON o.product_id = p.id
WHERE u.status = 'active'
  AND p.price > 100`;

const DEMO_SQL_AFTER = `SELECT
  u.id, u.name, u.email,
  o.id AS order_id,
  p.name AS product_name
FROM users u
INNER JOIN orders o
  ON u.id = o.user_id
INNER JOIN products p
  ON o.product_id = p.id
WHERE u.status = 'active'
  AND p.price > 100
  AND o.status != 'cancelled'`;

const STEPS = [
  {
    num: '01',
    icon: Terminal,
    title: 'Paste Your SQL',
    desc: 'Drop any raw or slow query into the editor. Supports PostgreSQL, MySQL, SQLite, and SQL Server.',
    color: 'blue',
  },
  {
    num: '02',
    icon: Cpu,
    title: 'AI Analyzes It',
    desc: 'Our engine scans for full-table scans, missing indexes, N+1 patterns, and security vulnerabilities.',
    color: 'purple',
  },
  {
    num: '03',
    icon: Zap,
    title: 'Get Results Instantly',
    desc: 'Receive optimized SQL, generated indexes, risk flags, and a detailed performance report — in seconds.',
    color: 'emerald',
  },
];

const FEATURES = [
  {
    icon: Code2,
    color: 'blue',
    title: 'Intelligent Query Rewrites',
    desc: 'Automatically restructure slow SQL into highly optimized, index-friendly variants without changing logical outputs. SELECT * eliminated, joins refined, subqueries flattened.',
    tags: ['JOIN optimization', 'Subquery flattening', 'SELECT pruning'],
  },
  {
    icon: BarChart3,
    color: 'purple',
    title: 'Deep Performance Profiling',
    desc: 'Analyze execution plans to pinpoint missing WHERE clauses, Cartesian joins, and N+1 query inefficiencies across your entire schema.',
    tags: ['Execution plans', 'N+1 detection', 'Full scan alerts'],
  },
  {
    icon: ShieldCheck,
    color: 'emerald',
    title: 'Security Risk Detection',
    desc: 'Instantly flag SQL injection vulnerabilities, missing parameterization, and destructive data manipulation logic before it reaches production.',
    tags: ['SQL injection', 'Risk scoring', 'Logic analysis'],
  },
  {
    icon: GitBranch,
    color: 'orange',
    title: 'Index Generator',
    desc: 'Automatically generate the exact CREATE INDEX statements your schema needs, based on your specific query patterns and WHERE clauses.',
    tags: ['CREATE INDEX', 'Composite indexes', 'Coverage analysis'],
  },
  {
    icon: Layers,
    color: 'pink',
    title: 'Side-by-Side Diff View',
    desc: 'Compare original and optimized queries in a professional diff editor with syntax highlighting — exactly like a code review.',
    tags: ['Diff editor', 'Syntax highlight', 'Copy to clipboard'],
  },
  {
    icon: Globe,
    color: 'teal',
    title: 'Shareable Reports',
    desc: 'Export full PDF reports or share optimization results via a public link. Perfect for code reviews, team collaboration, and documentation.',
    tags: ['PDF export', 'JSON export', 'Public sharing'],
  },
];

const STATS = [
  { value: '10x', label: 'Average speed gain', icon: TrendingUp },
  { value: '4', label: 'Database engines', icon: Database },
  { value: '<3s', label: 'Analysis time', icon: Clock },
  { value: '99%', label: 'Accuracy rate', icon: Star },
];

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center min-h-screen text-white w-full overflow-hidden" style={{ background: '#030712' }}>

      {/* ── HERO ── */}
      <section className="pt-24 pb-20 px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto w-full gap-14 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-20 left-1/3 w-[700px] h-[700px] bg-blue-600/8 rounded-full blur-[160px]" />
          <div className="absolute top-1/3 right-0 w-[400px] h-[400px] bg-purple-600/6 rounded-full blur-[120px]" />
        </div>

        {/* Left */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-10">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold text-xs uppercase tracking-widest mb-7 w-fit">
            <Zap className="w-3.5 h-3.5 fill-blue-400" />
            Query Optimizer Engine 2.0
          </div>

          <h1 className="text-5xl lg:text-6xl xl:text-[68px] font-black tracking-tight mb-5 text-white leading-[1.06]">
            Supercharge<br />
            your database<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-purple-500">
              performance.
            </span>
          </h1>

          <p className="text-slate-400 text-lg max-w-md mb-9 leading-relaxed">
            AI-driven SQL analysis. Detect bottlenecks, generate indexes, and rewrite queries for maximum efficiency — in seconds.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-7 py-3.5 rounded-xl transition-all duration-200 shadow-[0_0_30px_-5px_rgba(37,99,235,0.55)] hover:shadow-[0_0_40px_-5px_rgba(37,99,235,0.75)] text-sm group"
            >
              {user ? 'Open Studio' : 'Start Optimizing — Free'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/login"
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-semibold px-7 py-3.5 rounded-xl transition-all duration-200 text-sm"
            >
              Sign In <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="flex items-center gap-2 mt-6 text-xs text-slate-600">
            <Lock className="w-3.5 h-3.5" />
            No credit card required · Free forever plan
          </div>
        </div>

        {/* Right: code demo */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end relative z-10">
          <div className="relative w-full max-w-[460px]">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/15 rounded-full blur-[100px] pointer-events-none" />

            {/* Before card */}
            <div className="relative bg-[#0a0d14] border border-white/8 rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/6">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-slate-500 font-mono ml-1">slow_query.sql</span>
                <span className="ml-auto text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">Before</span>
              </div>
              <pre className="text-xs font-mono text-slate-400 p-4 leading-relaxed overflow-hidden">
                <span className="text-purple-400">SELECT</span> <span className="text-red-400">*</span>{'\n'}
                <span className="text-purple-400">FROM</span> <span className="text-blue-300">users</span> u{'\n'}
                <span className="text-purple-400">LEFT JOIN</span> <span className="text-blue-300">orders</span> o{'\n'}
                {'  '}<span className="text-purple-400">ON</span> u.id = o.user_id{'\n'}
                <span className="text-purple-400">WHERE</span> u.status = <span className="text-emerald-400">'active'</span>
              </pre>
            </div>

            {/* Arrow */}
            <div className="flex items-center justify-center py-3">
              <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-1.5">
                <Zap className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                <span className="text-xs text-blue-400 font-bold">AI Optimized</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
              </div>
            </div>

            {/* After card */}
            <div className="relative bg-[#0a0d14] border border-emerald-500/20 rounded-2xl overflow-hidden shadow-2xl">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-white/6">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-xs text-slate-500 font-mono ml-1">optimized.sql</span>
                <span className="ml-auto text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full">After</span>
              </div>
              <pre className="text-xs font-mono text-slate-300 p-4 leading-relaxed overflow-hidden">
                <span className="text-purple-400">SELECT</span>{'\n'}
                {'  '}u.id, u.name, <span className="text-blue-300">o.id</span> <span className="text-purple-400">AS</span> order_id{'\n'}
                <span className="text-purple-400">FROM</span> <span className="text-blue-300">users</span> u{'\n'}
                <span className="text-purple-400">INNER JOIN</span> <span className="text-blue-300">orders</span> o{'\n'}
                {'  '}<span className="text-purple-400">ON</span> u.id = o.user_id{'\n'}
                <span className="text-purple-400">WHERE</span> u.status = <span className="text-emerald-400">'active'</span>
              </pre>
              <div className="flex items-center gap-4 px-4 py-3 border-t border-white/5 bg-emerald-500/4">
                <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 0.02s execution
                </div>
                <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold">
                  <TrendingUp className="w-3.5 h-3.5" /> 47x faster
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section className="w-full border-y border-white/5 py-8 mb-20" style={{ background: 'rgba(255,255,255,0.015)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center md:items-start gap-1">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-blue-400" />
                  <span className="text-3xl font-black text-white">{value}</span>
                </div>
                <span className="text-xs text-slate-500 font-medium">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="w-full max-w-7xl mx-auto px-6 mb-28 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 font-semibold text-xs uppercase tracking-widest mb-5">
            <Search className="w-3 h-3" /> How it works
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">From slow to blazing fast</h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">Three simple steps. Zero configuration. No DBA degree required.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {STEPS.map(({ num, icon: Icon, title, desc, color }) => (
            <div key={num} className="relative bg-[#0a0d14] border border-white/6 rounded-2xl p-7 hover:border-white/12 transition-all duration-300 group">
              <div className="flex items-start gap-4 mb-5">
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${
                  color === 'blue' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                  color === 'purple' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                  'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                } group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-4xl font-black text-white/5 mt-1">{num}</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="w-full max-w-7xl mx-auto px-6 mb-28 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold text-xs uppercase tracking-widest mb-5">
            <Layers className="w-3 h-3" /> Full feature set
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-3">Everything you need</h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">A complete SQL intelligence platform built for modern development teams and solo engineers alike.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, color, title, desc, tags }) => (
            <div key={title} className="group bg-[#0a0d14] border border-white/6 rounded-2xl p-6 hover:-translate-y-1 hover:border-white/12 transition-all duration-300">
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 border group-hover:scale-105 transition-transform ${
                color === 'blue' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' :
                color === 'purple' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                color === 'emerald' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                color === 'orange' ? 'bg-orange-500/10 border-orange-500/20 text-orange-400' :
                color === 'pink' ? 'bg-pink-500/10 border-pink-500/20 text-pink-400' :
                'bg-teal-500/10 border-teal-500/20 text-teal-400'
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">{desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map(tag => (
                  <span key={tag} className="text-[10px] font-semibold text-slate-500 bg-white/4 border border-white/6 px-2 py-0.5 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TECH SUPPORT ── */}
      <section className="w-full max-w-7xl mx-auto px-6 mb-28 relative z-10">
        <div className="bg-gradient-to-br from-[#0f111a] to-[#0a0d14] border border-white/6 rounded-3xl p-10 text-center">
          <h3 className="text-lg font-bold text-white mb-2">Supports your stack</h3>
          <p className="text-slate-500 text-sm mb-8">Works with all major SQL databases right out of the box.</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {[
              { name: 'PostgreSQL', color: 'bg-blue-500/10 border-blue-500/20 text-blue-300' },
              { name: 'MySQL', color: 'bg-orange-500/10 border-orange-500/20 text-orange-300' },
              { name: 'SQLite', color: 'bg-teal-500/10 border-teal-500/20 text-teal-300' },
              { name: 'SQL Server', color: 'bg-red-500/10 border-red-500/20 text-red-300' },
            ].map(db => (
              <div key={db.name} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border font-semibold text-sm ${db.color}`}>
                <Database className="w-4 h-4" />
                {db.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="w-full max-w-7xl mx-auto px-6 pb-32 relative z-10">
        <div className="relative bg-gradient-to-br from-blue-600/15 via-blue-600/8 to-purple-600/10 border border-blue-500/20 rounded-3xl p-14 text-center overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-48 bg-blue-500/12 rounded-full blur-[80px]" />
          </div>
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-semibold text-xs uppercase tracking-widest mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Free to start — no credit card required
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Ready to ship<br />faster queries?
            </h2>
            <p className="text-slate-400 text-base mb-8 max-w-md mx-auto leading-relaxed">
              Join developers using QueryAI to eliminate slow database calls and write production-grade SQL — faster.
            </p>
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all duration-200 shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)] hover:shadow-[0_0_40px_-5px_rgba(37,99,235,0.8)] group text-sm"
            >
              {user ? 'Go to Studio' : 'Create Your Free Account'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="w-full border-t border-white/5 py-10 z-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-500/15 p-1.5 rounded-lg">
              <Database className="w-4 h-4 text-blue-400" />
            </div>
            <span className="text-base font-black text-white tracking-tight">
              Query<span className="text-blue-500">AI</span>
            </span>
          </div>
          <p className="text-xs text-slate-600">© 2024 QueryAI · Built for developers who care about performance.</p>
          <div className="flex items-center gap-5 text-xs text-slate-600">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Docs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
