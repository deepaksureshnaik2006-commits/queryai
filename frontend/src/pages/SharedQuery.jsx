import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSharedQuery } from '../lib/api';
import ResultPanel from '../components/ResultPanel';
import { Loader2, Database, AlertCircle, ArrowRight } from 'lucide-react';

export default function SharedQuery() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSharedQuery(id)
      .then(res => { setData(res); setLoading(false); })
      .catch(() => { setError('Query not found or is no longer public.'); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-3" style={{ background: '#030712' }}>
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-slate-500 text-sm font-medium">Loading shared optimization...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] px-4" style={{ background: '#030712' }}>
        <div className="bg-[#0a0d14] border border-white/8 p-10 rounded-2xl text-center max-w-sm shadow-2xl">
          <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
            <AlertCircle className="w-7 h-7 text-red-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Not Found</h2>
          <p className="text-slate-500 text-sm mb-7">{error}</p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl transition-all duration-200 text-sm"
          >
            Go Home <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-6 py-10" style={{ background: '#030712' }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-md bg-blue-500/15 flex items-center justify-center">
                <Database className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Shared Optimization</span>
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Query Analysis Report</h1>
          </div>
          <Link
            to="/"
            className="flex items-center gap-2 bg-white/5 hover:bg-white/8 border border-white/10 text-slate-300 hover:text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200"
          >
            Try QueryAI <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="min-h-[700px]">
          <ResultPanel result={data} originalQuery={data.original_query} />
        </div>
      </div>
    </div>
  );
}
