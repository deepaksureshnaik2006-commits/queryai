import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Zap, Activity, Database, CheckCircle2, ShieldCheck, Code2, TrendingUp, Lock, BarChart3 } from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center min-h-screen text-white w-full overflow-hidden" style={{ background: '#030712' }}>

      {/* Hero Section */}
      <section className="pt-28 pb-24 px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto w-full gap-16 relative">
        {/* Background glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[140px]" />
          <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[120px]" />
        </div>

        {/* Left Column */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-10">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-semibold text-xs uppercase tracking-widest mb-8 w-fit">
            <Zap className="w-3.5 h-3.5 fill-blue-400" />
            Query Optimizer Engine 2.0
          </div>

          <h1 className="text-5xl lg:text-6xl xl:text-7xl font-black tracking-tight mb-6 text-white leading-[1.08]">
            Supercharge<br />
            your database<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-purple-500">
              performance.
            </span>
          </h1>

          <p className="text-slate-400 text-lg md:text-xl max-w-lg mb-10 leading-relaxed">
            AI-driven SQL analysis. Automatically detect bottlenecks, generate indexes, and rewrite queries for maximum efficiency.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)] hover:shadow-[0_0_40px_-5px_rgba(37,99,235,0.8)] text-sm group"
            >
              {user ? 'Open Studio' : 'Start Optimizing'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="https://github.com"
              target="_blank"
              className="flex items-center justify-center gap-2 bg-white/5 hover:bg-white/8 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white font-semibold px-8 py-3.5 rounded-xl transition-all duration-200 text-sm"
            >
              <Code2 className="w-4 h-4" /> View Documentation
            </Link>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-6 mt-10 pt-10 border-t border-white/5 w-full">
            <div className="text-center">
              <div className="text-2xl font-black text-white">10x</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Avg Speed Gain</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-black text-white">99%</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">Accuracy</div>
            </div>
            <div className="w-px h-10 bg-white/10" />
            <div className="text-center">
              <div className="text-2xl font-black text-white">4</div>
              <div className="text-xs text-slate-500 font-medium mt-0.5">DB Engines</div>
            </div>
          </div>
        </div>

        {/* Right Column: Visual */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end relative mt-4 md:mt-0 z-0">
          <div className="relative w-full max-w-md aspect-square">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/20 rounded-full blur-[100px]" />
            <div className="absolute top-1/4 right-1/4 w-60 h-60 bg-purple-500/15 rounded-full blur-[80px]" />

            {/* Main card */}
            <div className="absolute right-0 top-8 w-80 bg-[#0a0d14] border border-white/8 rounded-2xl shadow-2xl p-5 transform rotate-2 hover:rotate-0 transition-all duration-500 hover:shadow-blue-500/10">
              <div className="flex items-center gap-2 mb-5 pb-4 border-b border-white/6">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500/80" />
                </div>
                <span className="text-slate-500 text-xs font-mono ml-1">optimizer.sql</span>
              </div>
              <div className="space-y-2.5">
                <div className="w-3/4 h-2.5 bg-slate-800 rounded-full" />
                <div className="w-1/2 h-2.5 bg-slate-800 rounded-full" />
                <div className="w-full h-2.5 bg-blue-500/25 rounded-full" />
                <div className="w-5/6 h-2.5 bg-blue-500/25 rounded-full" />
                <div className="w-2/3 h-2.5 bg-blue-500/25 rounded-full" />
                <div className="mt-6 pt-4 border-t border-white/6">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Execution time: 0.02s
                  </div>
                </div>
              </div>
            </div>

            {/* Stat card */}
            <div className="absolute left-0 bottom-12 w-60 bg-[#0a0d14] border border-white/8 rounded-2xl shadow-2xl p-5 transform -rotate-3 hover:rotate-0 transition-all duration-500">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/15 border border-purple-500/20 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-5 h-5 text-purple-400" />
                </div>
                <div>
                  <div className="text-white font-bold text-sm">100x Faster</div>
                  <div className="text-slate-500 text-xs mt-0.5">Full table scan avoided</div>
                </div>
              </div>
            </div>

            {/* Badge */}
            <div className="absolute top-0 left-6 w-fit bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2 transform -rotate-1">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                AI Analyzing...
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-7xl mx-auto px-6 pb-32 relative z-10">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-3">Everything you need</h2>
          <p className="text-slate-400 text-base max-w-xl mx-auto">A complete SQL intelligence platform built for modern development teams.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {[
            {
              icon: Code2,
              color: 'blue',
              title: 'Intelligent Rewrites',
              desc: 'Automatically restructure slow SQL into highly optimized, index-friendly variants without changing logical outputs.',
            },
            {
              icon: BarChart3,
              color: 'purple',
              title: 'Deep Profiling',
              desc: 'Analyze execution plans to identify missing WHERE clauses, Cartesian joins, and N+1 query inefficiencies.',
            },
            {
              icon: ShieldCheck,
              color: 'emerald',
              title: 'Risk Detection',
              desc: 'Instantly flag potential SQL injection vulnerabilities and destructive data manipulation logic before it hits production.',
            },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div
              key={title}
              className="group bg-[#0a0d14] border border-white/6 rounded-2xl p-7 text-left hover:-translate-y-1 hover:border-white/12 transition-all duration-300"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 border ${
                color === 'blue' ? 'bg-blue-500/10 border-blue-500/20' :
                color === 'purple' ? 'bg-purple-500/10 border-purple-500/20' :
                'bg-emerald-500/10 border-emerald-500/20'
              } group-hover:scale-105 transition-transform`}>
                <Icon className={`w-6 h-6 ${
                  color === 'blue' ? 'text-blue-400' :
                  color === 'purple' ? 'text-purple-400' :
                  'text-emerald-400'
                }`} />
              </div>
              <h3 className="text-base font-bold text-white mb-2">{title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="w-full max-w-7xl mx-auto px-6 pb-32 relative z-10">
        <div className="relative bg-gradient-to-br from-blue-600/20 to-purple-600/10 border border-blue-500/20 rounded-3xl p-12 text-center overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 bg-blue-500/15 rounded-full blur-[60px]" />
          </div>
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Lock className="w-4 h-4 text-blue-400" />
              <span className="text-blue-400 text-sm font-semibold">Free to start — no credit card required</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Ready to optimize?</h2>
            <p className="text-slate-400 text-base mb-8 max-w-md mx-auto">Join developers who use QueryAI to ship faster, leaner database queries.</p>
            <Link
              to={user ? "/dashboard" : "/signup"}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3.5 rounded-xl transition-all duration-200 shadow-[0_0_30px_-5px_rgba(37,99,235,0.6)] group text-sm"
            >
              {user ? 'Go to Studio' : 'Create Free Account'}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
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
          <p className="text-xs text-slate-600">© 2024 QueryAI. Built for developers.</p>
          <div className="flex items-center gap-6 text-xs text-slate-600">
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-slate-400 cursor-pointer transition-colors">Docs</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
