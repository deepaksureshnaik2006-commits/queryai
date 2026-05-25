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

  const inputClass = "w-full bg-[#0a0d14] border border-white/8 rounded-xl px-4 py-3 text-white text-sm font-medium focus:outline-none focus:border-blue-500/60 focus:ring-1 focus:ring-blue-500/30 transition-all";

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 relative" style={{ background: '#030712' }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="w-full max-w-sm relative z-10">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 mb-5 shadow-[0_0_20px_-5px_rgba(59,130,246,0.4)]">
            <Database className="w-6 h-6 text-blue-400" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Welcome back</h2>
          <p className="text-slate-500 text-sm mt-1.5">Sign in to access your saved queries</p>
        </div>

        <div className="bg-[#0a0d14] p-7 rounded-2xl border border-white/8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputClass}
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={inputClass}
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 mt-2 disabled:opacity-60 shadow-[0_0_20px_-5px_rgba(37,99,235,0.5)] hover:shadow-[0_0_24px_-5px_rgba(37,99,235,0.7)] group text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
                <>Sign In <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <p className="text-sm text-slate-600">
              Don't have an account?{' '}
              <Link to="/signup" className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
                Sign up free
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
