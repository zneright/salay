import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sun, Moon } from 'lucide-react';

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const saved = localStorage.getItem('salay_theme');
    const isDark = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (isDark) {
      setTheme('dark');
      document.documentElement.classList.add('dark');
    } else {
      setTheme('light');
      document.documentElement.classList.remove('dark');
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-900 dark:bg-neutral-950 dark:text-neutral-100 px-4 py-12 relative overflow-hidden transition-colors duration-300">
      {/* Background CSS visual glowing mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.08)_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-50 pointer-events-none" />
      
      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Top Navigation Bar with Back Link & Sun/Moon Theme Toggle */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 dark:text-neutral-400 hover:text-sky-600 dark:hover:text-sky-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Landing Page</span>
          </Link>

          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all shadow-sm"
            title="Toggle Light/Dark Theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>
        </div>

        {/* Logo Card Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link to="/" className="p-3 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-md hover:scale-105 transition-transform">
            <img src="/logo.png" alt="SALAY Logo" className="w-12 h-12 object-contain" />
          </Link>
          <Link to="/">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              SALAY Engine Gateway
            </h2>
          </Link>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">Democratizing Civic Budgets and Projects Records</p>
        </div>

        {/* Card Body */}
        <div className="bg-white/90 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-8 backdrop-blur-xl shadow-2xl text-neutral-900 dark:text-neutral-100">
          {children}
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;
