import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, User, LayoutDashboard, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { getInitials } from '../utils/helpers';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="section-container">
        <div className="flex items-center h-16 gap-6">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-1">
            <span className="font-heading font-black text-2xl text-trust-blue-800">Task</span>
            <span className="font-heading font-black text-2xl text-construction-orange">R</span>
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1 ml-4">
            {[
              { path: '/search', label: 'Find Workers' },
              { path: '/#how-it-works', label: 'How It Works' },
              { path: '/#categories', label: 'Categories' },
            ].map(({ path, label }) => (
              <Link
                key={path}
                to={path}
                className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                  isActive(path)
                    ? 'text-trust-blue font-medium bg-trust-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex-1" />

          {/* Auth buttons or user avatar */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-trust-blue flex items-center justify-center text-white text-xs font-bold">
                  {getInitials(user.name)}
                </div>
                <span className="hidden sm:block text-sm font-medium text-gray-700">{user.name.split(' ')[0]}</span>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full mt-2 w-52 card border border-gray-100 py-1 shadow-lg"
                  >
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                    </div>
                    <Link
                      to={user.role === 'worker' ? '/worker/dashboard' : '/dashboard'}
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <LayoutDashboard size={15} />
                      Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      <Settings size={15} />
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={15} />
                      Log Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="btn-secondary text-sm py-2 px-4">Log in</Link>
              <Link to="/register" className="btn-primary text-sm py-2 px-4">Register</Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-gray-100 bg-white overflow-hidden"
          >
            <div className="px-4 py-3 flex flex-col gap-1">
              <Link to="/search" className="py-2.5 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Find Workers</Link>
              {user ? (
                <>
                  <Link to={user.role === 'worker' ? '/worker/dashboard' : '/dashboard'} className="py-2.5 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                  <button onClick={handleLogout} className="py-2.5 px-3 rounded-lg text-sm text-red-600 hover:bg-red-50 text-left">Log Out</button>
                </>
              ) : (
                <>
                  <Link to="/login" className="py-2.5 px-3 rounded-lg text-sm text-gray-700 hover:bg-gray-50" onClick={() => setMobileOpen(false)}>Log In</Link>
                  <Link to="/register" className="py-2.5 px-3 rounded-lg text-sm bg-trust-blue text-white" onClick={() => setMobileOpen(false)}>Register</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
