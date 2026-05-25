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
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  const handleFavorite = async (e) => {
    e.stopPropagation();
    try {
      await toggleFavorite(item.id, !isFavorite);
      setIsFavorite(!isFavorite);
      toast.success(isFavorite ? 'Removed from favorites' : 'Added to favorites');
    } catch (error) {
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
      toast.success('Public link copied to clipboard!');
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (error) {
      toast.error('Failed to generate share link');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-4 transition-all duration-300 hover:border-blue-300 shadow-sm">
      {/* Header */}
      <div 
        className="p-4 cursor-pointer flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4 flex-1">
          <button onClick={handleFavorite} className="text-gray-400 hover:text-yellow-500 transition-colors p-1">
            <Star className={`w-5 h-5 ${isFavorite ? 'fill-yellow-500 text-yellow-500' : ''}`} />
          </button>
          
          <div className="hidden sm:flex flex-col text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {date}</span>
            <span className="flex items-center gap-1.5 mt-1"><Database className="w-3.5 h-3.5" /> {item.db_type}</span>
          </div>
          
          <div className="flex-1 min-w-0 px-2 border-l border-gray-200 ml-2">
            <div className="text-sm font-mono text-gray-700 truncate bg-white px-3 py-1.5 rounded-lg border border-gray-200 shadow-sm">
              {item.original_query.substring(0, 100)}{item.original_query.length > 100 ? '...' : ''}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="bg-green-50 text-green-700 text-xs font-bold px-3 py-1.5 rounded-lg border border-green-200 whitespace-nowrap shadow-sm">
              {item.performance_gain}
            </span>
            <div className="bg-white border border-gray-200 p-1.5 rounded-full shadow-sm">
              {expanded ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className="p-6 border-t border-gray-200 bg-white">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div>
              <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Original Query</h4>
              <pre className="text-xs font-mono bg-gray-50 p-4 rounded-xl border border-gray-200 overflow-x-auto text-gray-700 shadow-inner max-h-96">
                {format(item.original_query || '', { language: 'postgresql' })}
              </pre>
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider flex justify-between">
                Optimized Query
              </h4>
              <pre className="text-xs font-mono bg-blue-50 p-4 rounded-xl border border-blue-100 overflow-x-auto text-blue-900 shadow-inner max-h-96">
                {format(item.optimized_query || '', { language: 'postgresql' })}
              </pre>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-2">
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`/share/${item.id}`, '_blank');
                }}
                className="flex items-center gap-1.5 text-sm font-bold text-gray-700 hover:text-gray-900 bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-lg transition-colors border border-gray-200 shadow-sm"
              >
                <Database className="w-4 h-4" />
                View Full Report
              </button>
              
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 text-sm font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-blue-200"
              >
                {copiedLink ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                {copiedLink ? 'Link Copied!' : isPublic ? 'Copy Public Link' : 'Share Publicly'}
              </button>
              {isPublic && (
                <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-100 px-2 py-1 rounded border border-gray-200 font-medium">
                  <LinkIcon className="w-3 h-3"/> Public
                </span>
              )}
            </div>
            
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(item.id);
              }}
              className="flex items-center gap-1.5 text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors border border-transparent hover:border-red-200"
            >
              <Trash2 className="w-4 h-4" />
              Delete Record
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
