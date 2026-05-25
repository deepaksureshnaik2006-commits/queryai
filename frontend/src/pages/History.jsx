import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getHistory, deleteHistory } from '../lib/api';
import HistoryCard from '../components/HistoryCard';
import { Loader2, BookOpen, Star, LayoutList } from 'lucide-react';

export default function History() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

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
      <div className="flex justify-center items-center h-[60vh]" style={{ background: '#030712' }}>
        <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
      </div>
    );
  }

  const filteredHistory = filter === 'favorites' ? history.filter(h => h.is_favorite) : history;

  return (
    <div className="min-h-screen" style={{ background: '#030712' }}>
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Optimization Library</h1>
              <p className="text-slate-500 text-sm mt-0.5">Your saved queries and optimization history.</p>
            </div>
          </div>

          <div className="flex items-center bg-white/4 rounded-xl p-1 border border-white/6 gap-0.5">
            <button
              onClick={() => setFilter('all')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${filter === 'all' ? 'bg-blue-600 text-white shadow-[0_0_10px_-3px_rgba(37,99,235,0.6)]' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <LayoutList className="w-3.5 h-3.5" /> All
            </button>
            <button
              onClick={() => setFilter('favorites')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${filter === 'favorites' ? 'bg-blue-600 text-white shadow-[0_0_10px_-3px_rgba(37,99,235,0.6)]' : 'text-slate-400 hover:text-slate-200'}`}
            >
              <Star className="w-3.5 h-3.5" /> Favorites
            </button>
          </div>
        </div>

        {/* Count */}
        {filteredHistory.length > 0 && (
          <p className="text-xs text-slate-600 mb-4 font-medium">
            {filteredHistory.length} {filteredHistory.length === 1 ? 'record' : 'records'}
          </p>
        )}

        {filteredHistory.length === 0 ? (
          <div className="bg-[#0a0d14] rounded-2xl p-16 text-center border border-white/6 mt-4">
            <div className="w-14 h-14 rounded-2xl bg-white/4 border border-white/6 flex items-center justify-center mx-auto mb-5">
              <BookOpen className="w-7 h-7 text-slate-600" />
            </div>
            <h3 className="text-base font-bold text-slate-400 mb-2">
              {filter === 'favorites' ? 'No favorites yet' : 'No history found'}
            </h3>
            <p className="text-slate-600 text-sm max-w-xs mx-auto">
              {filter === 'favorites'
                ? 'Star any optimization to save it here for quick access.'
                : 'Your optimized queries will be automatically saved here after each run.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-3">
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
    </div>
  );
}
