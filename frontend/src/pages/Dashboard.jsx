import { useState } from 'react';
import QueryEditor from '../components/QueryEditor';
import ResultPanel from '../components/ResultPanel';
import LoadingAnimation from '../components/LoadingAnimation';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { useAuth } from '../context/AuthContext';
import { optimizeQuery, saveHistory } from '../lib/api';
import toast from 'react-hot-toast';
import { Activity, Zap } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [result, setResult] = useState(null);
  const [originalQuery, setOriginalQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [explanationLevel, setExplanationLevel] = useState('Intermediate');
  const [activeTab, setActiveTab] = useState('optimizer');

  const handleOptimize = async (query, dbType) => {
    setIsLoading(true);
    setResult(null);
    setOriginalQuery(query);
    try {
      const optimizedData = await optimizeQuery(query, dbType, explanationLevel);
      setResult(optimizedData);
      if (user) {
        saveHistory(query, optimizedData, dbType).catch(err => {
          console.error("Failed to save history:", err);
        });
      }
    } catch (error) {
      toast.error(error.message || 'Optimization failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#030712' }}>
      <div className="container mx-auto px-6 max-w-7xl py-8">

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 bg-white/4 border border-white/6 rounded-xl p-1 w-fit">
          <button
            onClick={() => setActiveTab('optimizer')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'optimizer' ? 'bg-blue-600 text-white shadow-[0_0_12px_-3px_rgba(37,99,235,0.6)]' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Zap className="w-3.5 h-3.5" />
            Query Optimizer
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'analytics' ? 'bg-blue-600 text-white shadow-[0_0_12px_-3px_rgba(37,99,235,0.6)]' : 'text-slate-400 hover:text-slate-200'}`}
          >
            <Activity className="w-3.5 h-3.5" />
            Analytics
          </button>
        </div>

        {activeTab === 'optimizer' ? (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-black text-white mb-1 tracking-tight">
                Welcome back, <span className="text-blue-400">{user?.user_metadata?.full_name ? user.user_metadata.full_name.split(' ')[0] : 'Developer'}</span>
              </h1>
              <p className="text-slate-500 text-sm">Paste your SQL below, pick your database, and let the AI handle the rest.</p>
            </div>

            <div className="flex flex-col xl:flex-row gap-5 relative">
              <div className="w-full xl:w-1/2 flex flex-col min-h-[620px] z-10">
                <QueryEditor
                  onOptimize={handleOptimize}
                  isLoading={isLoading}
                  explanationLevel={explanationLevel}
                  setExplanationLevel={setExplanationLevel}
                />
              </div>
              <div className="w-full xl:w-1/2 flex flex-col min-h-[620px] z-10">
                {isLoading ? (
                  <LoadingAnimation />
                ) : (
                  <ResultPanel result={result} originalQuery={originalQuery} explanationLevel={explanationLevel} />
                )}
              </div>
            </div>
          </>
        ) : (
          <AnalyticsDashboard />
        )}
      </div>
    </div>
  );
}
