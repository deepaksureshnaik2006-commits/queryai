import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Database, LogOut, User, ArrowLeft, Zap } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5" style={{ background: 'rgba(3,7,18,0.85)', backdropFilter: 'blur(16px)' }}>
      <div className="container mx-auto px-6 max-w-7xl h-16 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            {location.pathname !== '/' && (
              <button
                onClick={() => navigate(-1)}
                className="p-1.5 text-slate-500 hover:text-white hover:bg-white/6 rounded-lg transition-all duration-150 flex items-center justify-center"
                title="Go Back"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
              <div className="bg-blue-500/15 p-1.5 rounded-lg group-hover:bg-blue-500/25 transition-all duration-200 shadow-[0_0_12px_-3px_rgba(59,130,246,0.4)]">
                <Database className="w-5 h-5 text-blue-400" />
              </div>
              <span className="text-xl font-black text-white tracking-tight">
                Query<span className="text-blue-500">AI</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-150 ${location.pathname === '/' ? 'text-white bg-white/6' : 'text-slate-400 hover:text-white hover:bg-white/4'}`}
            >
              Platform
            </Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Link
                to="/dashboard"
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-150 ${location.pathname === '/dashboard' ? 'text-white bg-white/6' : 'text-slate-400 hover:text-white hover:bg-white/4'}`}
              >
                Studio
              </Link>
              <Link
                to="/history"
                className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-all duration-150 ${location.pathname === '/history' ? 'text-white bg-white/6' : 'text-slate-400 hover:text-white hover:bg-white/4'}`}
              >
                Library
              </Link>

              <div className="flex items-center gap-2 pl-3 ml-1 border-l border-white/8">
                <div className="flex items-center gap-2 text-sm text-slate-300 font-medium bg-white/5 px-3 py-1.5 rounded-lg border border-white/8">
                  <User className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline text-sm">
                    {user.user_metadata?.full_name ? user.user_metadata.full_name.split(' ')[0] : 'Developer'}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-150"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm font-medium text-slate-400 hover:text-white transition-colors duration-150"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-sm font-semibold bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg transition-all duration-200 shadow-[0_0_12px_-3px_rgba(37,99,235,0.5)] flex items-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 fill-white" /> Start Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
