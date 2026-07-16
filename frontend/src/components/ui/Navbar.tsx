import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Sun, Moon } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Check initial settings or defaults
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

  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-900 bg-background/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Brand Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-neutral-100" />
          <span className="font-bold text-sm tracking-tight">SALAY</span>
        </Link>

        {/* Scroll link points */}
        <nav className="hidden md:flex items-center space-x-6 text-xs text-neutral-400 font-medium">
          <a href="#features" className="hover:text-neutral-100 transition-colors">Features</a>
          <a href="#technology" className="hover:text-neutral-100 transition-colors">Technology</a>
          <a href="#faq" className="hover:text-neutral-100 transition-colors">FAQ</a>
          <span className="text-[10px] text-neutral-600 bg-neutral-900 border border-neutral-850 px-2 py-0.5 rounded cursor-not-allowed">
            Pricing (Coming Soon)
          </span>
        </nav>

        {/* Action Triggers */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 border border-neutral-800 rounded bg-neutral-950/60 hover:text-neutral-100 text-neutral-400"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
          </button>
          
          <Link
            to="/login"
            className="text-xs text-neutral-400 hover:text-neutral-100 transition-colors px-3 py-1.5"
          >
            Login
          </Link>

          <Link
            to="/demo"
            className="text-xs font-semibold bg-neutral-100 hover:bg-neutral-200 text-neutral-900 px-3.5 py-1.5 rounded transition-all active:scale-95"
          >
            Try Demo
          </Link>
        </div>
      </div>
    </header>
  );
};
export default Navbar;
