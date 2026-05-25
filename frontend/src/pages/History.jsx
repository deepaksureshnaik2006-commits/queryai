import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getHistory, deleteHistory } from '../lib/api';
import HistoryCard from '../components/HistoryCard';
import { Loader2, History as HistoryIcon, Star } from 'lucide-react';

export default function History() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' or 'favorites'

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(data);
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHistory(id);
      setHistory(history.filter(item => item.id !== id));
      toast.success('Record deleted');
    } catch (error) {
      toast.error('Failed to delete record');
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const filteredHistory = filter === 'favorites' ? history.filter(h => h.is_favorite) : history;

  return (
    <div className="max-w-5xl mx-auto animate-in fade-in duration-500 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 mt-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-xl shadow-lg border border-blue-500/20">
            <HistoryIcon className="w-7 h-7 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Optimization Library</h1>
            <p className="text-gray-400 font-medium mt-1">Access your saved queries and shared optimizations.</p>
          </div>
        </div>
        
        <div className="flex items-center bg-[#14161f] rounded-lg p-1 border border-gray-800">
          <button 
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${filter === 'all' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            All Queries
          </button>
          <button 
            onClick={() => setFilter('favorites')}
            className={`px-4 py-2 rounded-md text-sm font-bold flex items-center gap-2 transition-colors ${filter === 'favorites' ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-300'}`}
          >
            <Star className="w-4 h-4" /> Favorites
          </button>
        </div>
      </div>

      {filteredHistory.length === 0 ? (
        <div className="bg-[#0f111a] rounded-2xl p-16 text-center border border-gray-800 shadow-xl mt-8">
          <HistoryIcon className="w-16 h-16 text-gray-700 mx-auto mb-6" />
          <h3 className="text-xl font-bold text-gray-300 mb-2">No history found</h3>
          <p className="text-gray-500 font-medium">Your optimized queries will automatically be saved here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map(item => (
            <HistoryCard 
              key={item.id} 
              item={item} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
}
