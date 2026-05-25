import { useState, useEffect, useMemo } from 'react';
import toast from 'react-hot-toast';
import { getHistory, deleteHistory } from '../lib/api';
import HistoryCard from '../components/HistoryCard';
import { Loader2, BookOpen, Star, LayoutList, Search, Filter, X } from 'lucide-react';

const DB_TYPES = ['All', 'PostgreSQL', 'MySQL', 'SQLite', 'SQL Server'];

export default function History() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [dbFilter, setDbFilter] = useState('All');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const data = await getHistory();
      setHistory(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to load history');
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteHistory(id);
      setHistory(prev => prev.filter(item => item.id !== id));
      toast.success('Record deleted');
    } catch {
      toast.error('Failed to delete record');
    }
  };

  const filtered = useMemo(() => {
    let result = history;
    if (filter === 'favorites') result = result.filter(h => h.is_favorite);
    if (dbFilter !== 'All') result = result.filter(h => h.db_type === dbFilter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(h =>
        (h.original_query || '').toLowerCase().includes(q) ||
        (h.optimized_query || '').toLowerCase().includes(q)
      );
    }
    return result;
  }, [history, filter, dbFilter, search]);

  const hasActiveFilters = search || dbFilter !== 'All' || filter === 'favorites';

  const clearFilters = () => {
    setSearch('');
    setDbFilter('All');
    setFilter('all');
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]" style={{ background: '#030712' }}>
        <Loader2 className="w-7 h-7 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: '#030712' }}>
      <div className="max-w-5xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
              <BookOpen className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">Optimization Library</h1>
              <p className="text-slate-500 text-sm mt-0.5">
                {history.length} saved {history.length === 1 ? 'query' : 'queries'} in total
              </p>
            </div>
          </div>

          {/* Favorite / All toggle */}
          <div className="flex items-center bg-white/4 rounded-xl p-1 border border-white/6 gap-0.5 shrink-0">
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

        {/* Search + Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search queries..."
              className="w-full bg-[#0a0d14] border border-white/8 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* DB Type Filter */}
          <div className="flex items-center gap-2 bg-[#0a0d14] border border-white/8 rounded-xl px-3 py-2.5 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <div className="flex items-center gap-1 flex-wrap">
              {DB_TYPES.map(db => (
                <button
                  key={db}
                  onClick={() => setDbFilter(db)}
                  className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all duration-150 ${
                    dbFilter === db
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
                  }`}
                >
                  {db}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active filters summary */}
        {hasActiveFilters && (
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs text-slate-500">
              Showing <span className="text-white font-semibold">{filtered.length}</span> of <span className="text-white font-semibold">{history.length}</span> queries
            </span>
            <button
              onClick={clearFilters}
              className="text-xs font-semibold text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              <X className="w-3 h-3" /> Clear filters
            </button>
          </div>
        )}

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="bg-[#0a0d14] rounded-2xl p-16 text-center border border-white/6 mt-4">
            <div className="w-14 h-14 rounded-2xl bg-white/4 border border-white/6 flex items-center justify-center mx-auto mb-5">
              {search || dbFilter !== 'All' ? (
                <Search className="w-6 h-6 text-slate-600" />
              ) : (
                <BookOpen className="w-6 h-6 text-slate-600" />
              )}
            </div>
            <h3 className="text-base font-bold text-slate-400 mb-2">
              {search || dbFilter !== 'All'
                ? 'No matching queries found'
                : filter === 'favorites'
                ? 'No favorites yet'
                : 'No history found'
              }
            </h3>
            <p className="text-slate-600 text-sm max-w-xs mx-auto">
              {search || dbFilter !== 'All'
                ? 'Try a different search term or adjust your filters.'
                : filter === 'favorites'
                ? 'Star any optimization to save it here for quick access.'
                : 'Your optimized queries will be saved here automatically after each run.'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="mt-5 text-sm font-semibold text-blue-400 hover:text-blue-300 transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(item => (
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
