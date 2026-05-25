import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getSharedQuery } from '../lib/api';
import ResultPanel from '../components/ResultPanel';
import { Loader2, Database, AlertCircle } from 'lucide-react';

export default function SharedQuery() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSharedQuery(id)
      .then(res => {
        setData(res);
        setLoading(false);
      })
      .catch(err => {
        setError('Query not found or is no longer public.');
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <p className="text-gray-500 font-medium">Loading shared optimization...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        <div className="bg-white border border-gray-200 p-10 rounded-2xl text-center max-w-md shadow-sm">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Found</h2>
          <p className="text-gray-500 mb-8">{error}</p>
          <Link to="/" className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-3 rounded-lg transition-colors shadow-sm">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 max-w-5xl py-12 animate-in fade-in duration-500 min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Database className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">Shared Optimization</span>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">Query Analysis Report</h1>
        </div>
        <Link to="/" className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-bold px-5 py-2.5 rounded-lg transition-colors border border-gray-200 shadow-sm">
          Try QueryAI
        </Link>
      </div>
      
      <div className="min-h-[700px]">
        <ResultPanel result={data} originalQuery={data.original_query} />
      </div>
    </div>
  );
}
