import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Database, ArrowRight, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await login(email, password);
      if (error) throw error;
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to log in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 animate-in fade-in zoom-in-95 duration-500 relative z-10">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] -z-10 pointer-events-none"></div>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#0f111a] border border-gray-800 text-purple-500 mb-4 shadow-[0_0_20px_-5px_rgba(168,85,247,0.5)]">
            <Database className="w-7 h-7" />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tight">Welcome back</h2>
          <p className="text-gray-400 font-medium mt-2 text-base">Log in to access your saved queries</p>
        </div>

        <div className="bg-[#0f111a]/80 backdrop-blur-xl p-8 rounded-3xl border border-gray-800 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-1.5">Email</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#14161f] border border-gray-800 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-400 mb-1.5">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#14161f] border border-gray-800 rounded-xl px-4 py-3 text-white font-medium focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all shadow-inner"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 mt-8 disabled:opacity-70 shadow-[0_0_20px_-5px_rgba(168,85,247,0.5)] group"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Sign In'}
              {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 font-medium mt-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-purple-400 font-bold hover:text-purple-300 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
