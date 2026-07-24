import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { showToast } from '../components/ui/Toast';
import { MobileBottomNav } from '../components/ui/MobileBottomNav';
import { SnowflakeBadge } from '../components/ui/SnowflakeBadge';

import { 
  LayoutDashboard, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  Settings, 
  X,
  ChevronDown,
  User,
  LogOut,
  Sun,
  Moon,
  Terminal
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

export const DashboardLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const location = useLocation();
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'info');
      navigate('/login');
    } catch {
      showToast('Logout failed', 'error');
    }
  };

  const rawNavigation: (NavigationItem & { adminOnly?: boolean })[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'AI Chat', href: '/dashboard/chat', icon: MessageSquare },
    { name: 'Reports', href: '/dashboard/feedback', icon: FileText },
    { name: 'CoCo Agent', href: '/coco-agent', icon: Terminal, adminOnly: true },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ];

  const navigation = rawNavigation.filter((item) => !item.adminOnly || user?.role === 'Administrator');

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground transition-colors font-sans antialiased">
      {/* Desktop Top Navigation Header */}
      <header className="hidden md:flex h-16 items-center justify-between px-6 border-b border-border bg-card/85 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center space-x-6">
          {/* Logo brand */}
          <Link to="/" className="flex items-center space-x-2.5 shrink-0">
            <img src="/logo.png" alt="SALAY Logo" className="h-7 w-auto object-contain drop-shadow-sm" />
            <span className="font-extrabold text-base tracking-wider text-neutral-900 dark:text-white uppercase">
              SALAY
            </span>
            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-500 border border-sky-500/20">
              AI
            </span>
          </Link>

          {/* Navigation Items (Role-Filtered) */}
          <nav className="flex items-center space-x-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-2 transition-all ${
                    isActive
                      ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Action Icons & Status */}
        <div className="flex items-center space-x-3">
          <SnowflakeBadge variant="status" label="Snowflake Connected" size="sm" />

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
            title="Toggle Light / Dark theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-muted/50 transition-colors border border-border"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'}
                alt={user?.fullName || 'User'}
                className="w-7 h-7 rounded-full object-cover"
              />
              <span className="text-xs font-bold text-foreground hidden lg:inline-block">
                {user?.fullName || 'Guest'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </button>

            {/* Profile Dropdown */}
            {profileMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-card border border-border shadow-lg py-1 z-50 text-xs">
                <div className="px-4 py-2 border-b border-border">
                  <p className="font-bold text-foreground">{user?.fullName}</p>
                  <p className="text-muted-foreground text-[11px] truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    setProfileModalOpen(true);
                    setProfileMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-muted flex items-center space-x-2 text-foreground"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Profile Overview</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-muted flex items-center space-x-2 text-rose-500 font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log Out</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Page Area */}
      <main className="flex-1 p-2 sm:p-4 md:p-8 pb-20 md:pb-8">
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Profile Overview Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card rounded-2xl border border-border p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold">Profile Details</h3>
              <button onClick={() => setProfileModalOpen(false)} className="p-1 rounded-lg hover:bg-muted">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center space-x-3 pt-2">
              <img src={user?.avatar} alt={user?.fullName} className="w-14 h-14 rounded-full object-cover ring-2 ring-sky-500" />
              <div>
                <h4 className="font-bold text-sm">{user?.fullName}</h4>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/10 text-sky-500 border border-sky-500/20 capitalize">
                  {user?.role} Persona
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
