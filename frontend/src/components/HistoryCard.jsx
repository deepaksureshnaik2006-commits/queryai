import { useState } from 'react';
import { Calendar, Trash2, ChevronDown, ChevronUp, Database, Star, Share2, Link as LinkIcon, Check } from 'lucide-react';
import { toggleFavorite, togglePublic } from '../lib/api';
import toast from 'react-hot-toast';
import { format } from 'sql-formatter';

export default function HistoryCard({ item, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(item.is_favorite || false);
  const [isPublic, setIsPublic] = useState(item.is_public || false);
  const [copiedLink, setCopiedLink] = useState(false);

  const date = new Date(item.created_at).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
  });

  const handleFavorite = async (e) => {
    e.stopPropagation();
    try {
      await toggleFavorite(item.id, !isFavorite);
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch {
      toast.error('Failed to update favorite status');
    }
  };

  const handleShare = async (e) => {
    e.stopPropagation();
    try {
      if (!isPublic) {
        await togglePublic(item.id, true);
        setIsPublic(true);
      }
      const shareUrl = `${window.location.origin}/share/${item.id}`;
      navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      toast.success('Public link copied!');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      toast.error('Failed to generate share link');
    }
  };

  return (
    <div className={`bg-[#0a0d14] rounded-xl border transition-all duration-200 overflow-hidden ${expanded ? 'border-blue-500/25' : 'border-white/6 hover:border-white/12'}`}>
      {/* Header Row */}
      <div
        className="px-4 py-3.5 cursor-pointer flex items-center gap-3"
        onClick={() => setExpanded(!expanded)}
      >
        {/* Star */}
        <button
          onClick={handleFavorite}
          className="shrink-0 text-slate-600 hover:text-yellow-400 transition-colors p-1 rounded-lg hover:bg-yellow-400/10"
        >
          <Star className={`w-4 h-4 ${isFavorite ? 'fill-yellow-400 text-yellow-400' : ''}`} />
        </button>

        {/* Meta */}
        <div className="hidden sm:flex flex-col gap-0.5 text-xs text-slate-600 w-24 shrink-0">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3" /> {date}
          </span>
          <span className="flex items-center gap-1">
            <Database className="w-3 h-3" /> {item.db_type}
          </span>
        </div>

        {/* Query preview */}
        <div className="flex-1 min-w-0 mx-2 border-l border-white/6 pl-3">
          <div className="text-xs font-mono text-slate-400 truncate bg-white/3 px-3 py-2 rounded-lg border border-white/6">
            {item.original_query.substring(0, 120)}{item.original_query.length > 120 ? '...' : ''}
          </div>
        </div>

        {/* Gain badge + toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="bg-emerald-500/10 text-emerald-400 text-xs font-bold px-2.5 py-1 rounded-lg border border-emerald-500/20 whitespace-nowrap">
            {item.performance_gain}
          </span>
          <div className="text-slate-600">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="border-t border-white/6 p-5" style={{ background: 'rgba(255,255,255,0.01)' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
            <div>
              <h4 className="text-[10px] font-bold text-slate-600 mb-2 uppercase tracking-widest">Original Query</h4>
              <pre className="text-xs font-mono bg-white/3 p-4 rounded-xl border border-white/6 overflow-x-auto text-slate-400 max-h-64 leading-relaxed">
                {format(item.original_query || '', { language: 'postgresql' })}
              </pre>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-slate-600 mb-2 uppercase tracking-widest">Optimized Query</h4>
              <pre className="text-xs font-mono bg-blue-500/5 p-4 rounded-xl border border-blue-500/15 overflow-x-auto text-blue-300 max-h-64 leading-relaxed">
                {format(item.optimized_query || '', { language: 'postgresql' })}
              </pre>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => { e.stopPropagation(); window.open(`/share/${item.id}`, '_blank'); }}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white bg-white/5 hover:bg-white/8 px-3 py-2 rounded-lg transition-all border border-white/8 hover:border-white/15"
              >
                <Database className="w-3.5 h-3.5" /> View Report
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 px-3 py-2 rounded-lg transition-all border border-transparent hover:border-blue-500/20"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Share2 className="w-3.5 h-3.5" />}
                {copiedLink ? 'Copied!' : isPublic ? 'Copy Link' : 'Share'}
              </button>

              {isPublic && (
                <span className="text-[10px] text-slate-600 flex items-center gap-1 bg-white/4 px-2 py-1 rounded-md border border-white/8 font-medium">
                  <LinkIcon className="w-3 h-3" /> Public
                </span>
              )}
            </div>

            <button
              onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-red-400 hover:bg-red-500/8 px-3 py-2 rounded-lg transition-all border border-transparent hover:border-red-500/15"
            >
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
