import { useState } from 'react';
import QueryEditor from '../components/QueryEditor';
import ResultPanel from '../components/ResultPanel';
import LoadingAnimation from '../components/LoadingAnimation';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { useAuth } from '../context/AuthContext';
import { optimizeQuery, saveHistory } from '../lib/api';
import toast from 'react-hot-toast';
import { Activity } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const [result, setResult] = useState(null);
  const [originalQuery, setOriginalQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [explanationLevel, setExplanationLevel] = useState('Intermediate');
  const [activeTab, setActiveTab] = useState('optimizer'); // 'optimizer' or 'analytics'

  const handleOptimize = async (query, dbType) => {
    setIsLoading(true);
    setResult(null);
    setOriginalQuery(query);
    
    try {
      const optimizedData = await optimizeQuery(query, dbType, explanationLevel);
      setResult(optimizedData);
      
      // Save to history silently
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
    <div className="container mx-auto px-6 max-w-7xl py-8 animate-in fade-in duration-500 min-h-screen relative">
      
      {/* Tabs */}
      <div className="flex items-center gap-4 mb-8 border-b border-gray-800 pb-2">
        <button 
          onClick={() => setActiveTab('optimizer')}
          className={`text-sm font-bold pb-2 border-b-2 transition-colors ${activeTab === 'optimizer' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          Query Optimizer
        </button>
        <button 
          onClick={() => setActiveTab('analytics')}
          className={`text-sm font-bold pb-2 border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'analytics' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          <Activity className="w-4 h-4" /> Analytics Dashboard
        </button>
      </div>

      {activeTab === 'optimizer' ? (
        <>
          <div className="mb-8">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
              Welcome back, {user?.user_metadata?.full_name ? user.user_metadata.full_name.split(' ')[0] : 'Developer'}
            </h1>
            <p className="text-gray-500 font-medium">Paste your unoptimized SQL below, select your target database, and let our AI engine handle the rest.</p>
          </div>
          
          <div className="flex flex-col xl:flex-row gap-6 relative">
            <div className="w-full xl:w-1/2 flex flex-col min-h-[600px] z-10">
              <QueryEditor 
                onOptimize={handleOptimize} 
                isLoading={isLoading} 
                explanationLevel={explanationLevel}
                setExplanationLevel={setExplanationLevel}
              />
            </div>
            
            <div className="w-full xl:w-1/2 flex flex-col min-h-[600px] z-10">
              {isLoading ? (
                <LoadingAnimation />
              ) : (
                <ResultPanel result={result} originalQuery={originalQuery} />
              )}
            </div>
          </div>
        </>
      ) : (
        <AnalyticsDashboard />
      )}
    </div>
  );
}
