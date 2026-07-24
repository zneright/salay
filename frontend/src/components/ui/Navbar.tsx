import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sun, Moon, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../providers/AuthProvider';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('salay_theme');
    if (saved === 'light') {
      setTheme('light');
      document.documentElement.classList.remove('dark');
    } else {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (theme === 'dark') {
      setTheme('light');
      localStorage.setItem('salay_theme', 'light');
      document.documentElement.classList.remove('dark');
    } else {
      setTheme('dark');
      localStorage.setItem('salay_theme', 'dark');
      document.documentElement.classList.add('dark');
    }
  };

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  const handleNavClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    if (window.location.pathname !== '/') {
      navigate('/#' + id);
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200 dark:border-neutral-900 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md transition-colors text-neutral-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center space-x-2.5">
          <img src="/logo.png" alt="SALAY Logo" className="h-7 w-auto object-contain drop-shadow-sm" />
          <span className="font-extrabold text-base tracking-tight">SALAY</span>
        </Link>

        {/* Scroll link points */}
        <nav className="hidden md:flex items-center space-x-6 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          <a href="#features" onClick={(e) => handleNavClick(e, 'features')} className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">Features</a>
          <a href="#technology" onClick={(e) => handleNavClick(e, 'technology')} className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">Technology</a>
          <Link to="/coco-agent" className="text-[#29b5e8] font-semibold hover:underline flex items-center gap-1">
            <span>CoCo Agent CLI</span>
          </Link>
          <a href="#faq" onClick={(e) => handleNavClick(e, 'faq')} className="hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer">FAQ</a>
        </nav>

        {/* Action Triggers */}
        <div className="flex items-center space-x-3">
          {/* Instant Demo Role Launcher Page Trigger */}
          <button
            onClick={() => navigate('/demo')}
            className="text-xs font-bold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white px-3.5 py-2 rounded-xl transition-all active:scale-95 flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            title="Choose Live Demo Persona - No Registration Required"
          >
            <span>⚡ Try Live Demo (No Sign-Up)</span>
          </button>

          <button
            onClick={toggleTheme}
            className="p-2 border border-neutral-200 dark:border-neutral-800 rounded-lg bg-neutral-100 dark:bg-neutral-900 hover:text-sky-500 text-neutral-600 dark:text-neutral-400 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/dashboard"
                className="text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-2 rounded-xl transition-all active:scale-95 flex items-center gap-1.5 shadow-sm"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Dashboard ({user.fullName.split(' ')[0]})</span>
              </Link>
              <button
                onClick={handleSignOut}
                className="text-xs font-medium text-neutral-500 dark:text-neutral-400 hover:text-rose-500 transition-colors p-2 flex items-center gap-1"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-xs text-neutral-600 dark:text-neutral-300 hover:text-sky-500 transition-colors px-3 py-1.5 font-medium"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
export default Navbar;
