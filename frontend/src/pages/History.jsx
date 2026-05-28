import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { getHistory, deleteHistory } from '../lib/api';
import HistoryCard from '../components/HistoryCard';
import { Loader2, BookOpen, Star, LayoutList, Search, Filter, X, Trash2, ArrowRight } from 'lucide-react';

const DB_TYPES = ['All', 'PostgreSQL', 'MySQL', 'SQLite', 'SQL Server'];

export default function History() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [dbFilter, setDbFilter] = useState('All');
  const [deleteTarget, setDeleteTarget] = useState(null); // 'all' or id
  const [isDeleting, setIsDeleting] = useState(false);

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

  const handleDelete = (id) => setDeleteTarget(id);
  const handleDeleteAll = () => setDeleteTarget('all');

  const confirmDelete = async () => {
    setIsDeleting(true);
    if (deleteTarget === 'all') {
      try {
        const { deleteAllHistory } = await import('../lib/api');
        await deleteAllHistory();
        setHistory([]);
        toast.success('All history deleted');
      } catch {
        toast.error('Failed to delete history');
      }
    } else {
      try {
        await deleteHistory(deleteTarget);
        setHistory(prev => prev.filter(item => item.id !== deleteTarget));
        toast.success('Record deleted');
      } catch {
        toast.error('Failed to delete record');
      }
    }
    setIsDeleting(false);
    setDeleteTarget(null);
  };

  const handleUpdate = (updatedItem) => {
    setHistory(prev => prev.map(item => item.id === updatedItem.id ? { ...item, ...updatedItem } : item));
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

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Delete All Button */}
            {history.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-red-400 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all duration-200"
              >
                <Trash2 className="w-4 h-4" /> Delete All
              </button>
            )}

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
            {!hasActiveFilters && filter === 'all' && (
              <div className="mt-6">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/8 border border-white/10 text-slate-300 hover:text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200"
                >
                  Try QueryAI <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
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
                onUpdate={handleUpdate}
              />
            ))}
          </div>
        )}
      </div>

      {/* Premium Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop with Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !isDeleting && setDeleteTarget(null)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="relative w-full max-w-md bg-[#0a0d14]/90 border border-white/10 backdrop-blur-xl rounded-2xl p-6 shadow-2xl overflow-hidden z-10"
            >
              {/* Top Accent Gradient Border */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-red-500/0 via-red-500/50 to-red-500/0" />

              <div className="flex flex-col items-center text-center">
                {/* Warning Icon Container */}
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mb-4 animate-pulse">
                  <Trash2 className="w-5.5 h-5.5" />
                </div>

                {/* Heading */}
                <h3 className="text-lg font-bold text-white mb-2">
                  {deleteTarget === 'all' ? 'Clear All History' : 'Delete Record'}
                </h3>

                {/* Subtext */}
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  {deleteTarget === 'all'
                    ? 'Are you sure you want to delete all history? This action cannot be undone and will permanently remove all your optimization records.'
                    : 'Are you sure you want to delete this record? This action cannot be undone and will permanently remove this optimized query.'}
                </p>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 w-full">
                  <button
                    disabled={isDeleting}
                    onClick={() => setDeleteTarget(null)}
                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-slate-400 hover:text-slate-200 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    Cancel
                  </button>
                  <button
                    disabled={isDeleting}
                    onClick={confirmDelete}
                    className="flex-1 px-4 py-2.5 text-sm font-semibold text-white bg-red-600 hover:bg-red-500 active:bg-red-700 rounded-xl shadow-[0_0_15px_rgba(220,38,38,0.3)] hover:shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isDeleting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      'Delete'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
