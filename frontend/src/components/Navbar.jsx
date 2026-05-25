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
    <nav className="bg-[#030712]/80 backdrop-blur-xl sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-6 max-w-7xl h-20 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4">
            {location.pathname !== '/' && (
              <button 
                onClick={() => navigate(-1)}
                className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors flex items-center justify-center"
                title="Go Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2 group">
              <div className="bg-blue-500/20 p-2 rounded-lg group-hover:bg-blue-500/30 transition-colors shadow-[0_0_15px_-3px_rgba(59,130,246,0.4)]">
                <Database className="w-6 h-6 text-blue-400" />
              </div>
              <span className="text-2xl font-black text-white tracking-tight flex items-center gap-1">
                Query<span className="text-blue-500">AI</span>
              </span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center gap-6 ml-4 text-sm font-bold">
            <Link to="/" className="text-blue-400 hover:text-blue-300 transition-colors">Platform</Link>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Link 
                to="/dashboard" 
                className="text-sm font-bold text-gray-300 hover:text-white transition-colors"
              >
                Studio
              </Link>
              <Link 
                to="/history" 
                className="text-sm font-bold text-gray-300 hover:text-white transition-colors mr-4"
              >
                Library
              </Link>
              
              <div className="flex items-center gap-3 pl-4 border-l border-gray-800">
                <div className="flex items-center gap-2 text-sm text-gray-300 font-bold bg-[#0f111a] px-4 py-2 rounded-full border border-gray-800 shadow-inner">
                  <User className="w-4 h-4 text-blue-400" />
                  <span className="hidden sm:inline">
                    {user.user_metadata?.full_name ? user.user_metadata.full_name.split(' ')[0] : 'Developer'}
                  </span>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-6">
              <Link 
                to="/login" 
                className="text-sm font-bold text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link 
                to="/signup" 
                className="text-sm font-bold bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg transition-colors shadow-[0_0_15px_-3px_rgba(37,99,235,0.4)] flex items-center gap-2"
              >
                <Zap className="w-4 h-4"/> Start Free
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
