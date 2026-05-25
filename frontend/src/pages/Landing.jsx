import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ArrowRight, Zap, Activity, Database, CheckCircle2, ShieldCheck, Code2 } from 'lucide-react';

export default function Landing() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col items-center min-h-screen text-center md:text-left text-white animate-in fade-in duration-700 w-full overflow-hidden">
      
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between max-w-7xl mx-auto w-full gap-12 lg:gap-20">
        
        {/* Left Column: Text */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left z-10">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-bold text-xs uppercase tracking-widest mb-8">
            <Zap className="w-4 h-4"/> Query Optimizer Engine 2.0
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tight mb-8 text-white leading-[1.1]">
            Supercharge<br />
            your database<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">performance.</span>
          </h1>
          
          <p className="text-gray-400 text-lg md:text-xl max-w-lg mb-10 leading-relaxed font-medium">
            AI-driven SQL analysis. Automatically detect bottlenecks, generate indexes, and rewrite queries for maximum efficiency.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              to={user ? "/dashboard" : "/signup"}
              className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_30px_-5px_rgba(37,99,235,0.5)] hover:shadow-[0_0_40px_-5px_rgba(37,99,235,0.7)] text-base group"
            >
              {user ? 'Open Studio' : 'Start Optimizing'}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              to="https://github.com" 
              target="_blank"
              className="flex items-center justify-center gap-2 bg-[#0f111a] hover:bg-[#1a1d27] border border-gray-800 text-white font-bold px-8 py-4 rounded-xl transition-colors text-base"
            >
              <Code2 className="w-5 h-5"/> View Documentation
            </Link>
          </div>
        </div>

        {/* Right Column: Graphic */}
        <div className="w-full md:w-1/2 flex justify-center md:justify-end relative mt-10 md:mt-0 z-0">
          <div className="relative w-full max-w-lg aspect-square">
            {/* Glowing Orbs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-500/30 rounded-full blur-[100px]"></div>
            <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-[80px]"></div>
            
            {/* Glass panels */}
            <div className="absolute right-0 top-10 w-80 h-96 bg-[#0f111a]/80 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl p-6 transform rotate-3 hover:rotate-0 transition-transform duration-500">
               <div className="flex items-center gap-3 mb-6 border-b border-gray-800 pb-4">
                 <div className="w-3 h-3 rounded-full bg-red-500"></div>
                 <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                 <div className="w-3 h-3 rounded-full bg-green-500"></div>
                 <span className="text-gray-500 text-xs font-mono ml-2">optimizer.sql</span>
               </div>
               <div className="space-y-3">
                 <div className="w-3/4 h-3 bg-gray-800 rounded"></div>
                 <div className="w-1/2 h-3 bg-gray-800 rounded"></div>
                 <div className="w-full h-3 bg-blue-500/20 rounded"></div>
                 <div className="w-5/6 h-3 bg-blue-500/20 rounded"></div>
                 <div className="mt-8 pt-4 border-t border-gray-800">
                    <div className="flex items-center gap-2 text-green-400 text-sm font-mono">
                      <CheckCircle2 className="w-4 h-4"/> Execution time: 0.02s
                    </div>
                 </div>
               </div>
            </div>
            
            <div className="absolute left-0 bottom-10 w-64 h-48 bg-[#0f111a]/90 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl p-6 transform -rotate-6 hover:rotate-0 transition-transform duration-500 flex flex-col justify-center">
              <div className="flex items-center gap-4">
                <Activity className="w-10 h-10 text-purple-400"/>
                <div>
                  <h4 className="text-white font-bold">100x Faster</h4>
                  <p className="text-gray-400 text-xs mt-1">Full table scan avoided</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full max-w-7xl mx-auto px-6 mb-32 mt-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#0f111a]/80 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 text-left transition-all hover:-translate-y-2 hover:border-gray-700 group">
            <div className="bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-blue-500/20 group-hover:scale-110 transition-transform">
              <Code2 className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Intelligent Rewrites</h3>
            <p className="text-gray-400 text-base leading-relaxed font-medium">
              Automatically restructure slow SQL into highly optimized, index-friendly variants without changing logical outputs.
            </p>
          </div>
          
          <div className="bg-[#0f111a]/80 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 text-left transition-all hover:-translate-y-2 hover:border-gray-700 group">
            <div className="bg-purple-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-purple-500/20 group-hover:scale-110 transition-transform">
              <Activity className="w-7 h-7 text-purple-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Deep Profiling</h3>
            <p className="text-gray-400 text-base leading-relaxed font-medium">
              Analyze execution plans to identify missing WHERE clauses, Cartesian joins, and N+1 query inefficiencies.
            </p>
          </div>

          <div className="bg-[#0f111a]/80 backdrop-blur-sm border border-gray-800 rounded-3xl p-8 text-left transition-all hover:-translate-y-2 hover:border-gray-700 group">
            <div className="bg-green-500/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-green-500/20 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-7 h-7 text-green-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Risk Detection</h3>
            <p className="text-gray-400 text-base leading-relaxed font-medium">
              Instantly flag potential SQL injection vulnerabilities and destructive data manipulation logic.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t border-gray-800 bg-[#030712] py-12 flex flex-col items-center z-10">
        <div className="flex items-center gap-2 mb-6">
          <Database className="w-6 h-6 text-blue-500" />
          <span className="text-xl font-black text-white tracking-tight">QueryAI</span>
        </div>
        <p className="text-sm text-gray-600 font-medium">
          © 2024 QueryAI. Built for developers.
        </p>
      </footer>
    </div>
  );
}
