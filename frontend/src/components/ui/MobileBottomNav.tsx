import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart3, MessageSquare, FileText, Settings } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'AI Chat', href: '/dashboard/chat', icon: MessageSquare, isAiButton: true },
    { name: 'Reports', href: '/dashboard/feedback', icon: FileText },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur border-t border-neutral-200 dark:border-neutral-800 px-2 py-1.5 shadow-lg">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = location.pathname === item.href;
          const Icon = item.icon;

          if (item.isAiButton) {
            return (
              <Link
                key={item.href}
                to={item.href}
                className="flex flex-col items-center justify-center relative -top-3"
              >
                <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-sky-600 to-cyan-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 ring-4 ring-white dark:ring-neutral-900 transition-transform active:scale-95">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-semibold text-sky-600 dark:text-sky-400 mt-0.5">
                  Ask AI
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              to={item.href}
              className={`flex flex-col items-center justify-center px-3 py-1 rounded-lg transition-colors ${
                isActive
                  ? 'text-sky-600 dark:text-sky-400 font-semibold'
                  : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] mt-1">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
