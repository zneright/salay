import React, { useState, useEffect } from 'react';
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { showToast } from '../components/ui/Toast';

import { 
  LayoutDashboard, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  Settings, 
  X,
  Building2,
  ChevronDown,
  User,
  LogOut,
  Sliders,
  ShieldAlert,
  Sun,
  Moon
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



  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
    { name: 'AI Chat', href: '/dashboard/chat', icon: MessageSquare },
    { name: 'Citizen Feedback', href: '/dashboard/feedback', icon: FileText },
    { name: 'Settings', href: '/dashboard/settings', icon: Settings },
  ].filter((item) => {
    if (!user) return false;
    if (user.role === 'Citizen') {
      return ['Dashboard', 'AI Chat', 'Citizen Feedback'].includes(item.name);
    }
    if (user.role === 'Government Official') {
      return ['Dashboard', 'Analytics', 'AI Chat', 'Citizen Feedback'].includes(item.name);
    }
    // Auditor and Administrator have complete access
    return true;
  });


  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'info');
      navigate('/login');
    } catch {
      showToast('Logout failed', 'error');
    }
  };



  const isPathAllowed = () => {
    const rawPath = location.pathname;
    if (rawPath === '/dashboard' || rawPath === '/dashboard/') return true;
    if (rawPath.startsWith('/dashboard/analytics')) return user?.role !== 'Citizen';
    if (rawPath.startsWith('/dashboard/settings')) return ['Auditor', 'Administrator'].includes(user?.role || '');
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
      {/* Mobile Header */}
      <header className="flex md:hidden items-center justify-between px-6 py-4 bg-neutral-950 border-b border-neutral-900 relative z-30">
        <div className="flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-neutral-100" />
          <span className="font-semibold text-sm tracking-tight text-neutral-200">SALAY</span>
        </div>
        <button
          onClick={toggleTheme}
          className="p-1.5 border border-border bg-secondary rounded text-muted-foreground hover:text-foreground"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </header>


      {/* Sidebar Navigation - Hidden on Mobile */}
      <aside className="hidden md:flex flex-col justify-between w-64 bg-card border-r border-border p-6 shrink-0 text-left">

        <div className="space-y-8">
          {/* Logo Brand */}
          <div className="flex items-center space-x-2.5 px-2">
            <Building2 className="w-6 h-6 text-foreground" />
            <span className="font-bold text-base tracking-tight text-foreground font-sans">SALAY Engine</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navigation.map((item) => {
              // Checks sub-routes exact match or start path
              const isActive = location.pathname === item.href || (item.href !== '/dashboard' && location.pathname.startsWith(item.href));
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-secondary text-foreground border-l-2 border-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary/60'
                  }`}

                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile footer element with Dropdown trigger */}
        <div className="relative pt-4 border-t border-border">
          <button 
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-secondary/40 transition-colors"
          >
            <div className="flex items-center space-x-3 text-left">
              <img 
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80'} 
                alt="Profile Avatar"
                className="w-8 h-8 rounded-full border border-border"
              />
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-foreground truncate max-w-[120px]">
                  {user?.fullName || 'Guest Observer'}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono tracking-wide">{user?.role}</span>
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </button>

          {/* Profile Dropdown menu */}
          {profileMenuOpen && (
            <>
              <div className="absolute bottom-16 right-0 left-0 bg-card border border-border rounded-lg p-2 shadow-2xl space-y-1 z-50">
                <button
                  onClick={() => {
                    setProfileModalOpen(true);
                    setProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded text-[11px] text-muted-foreground hover:text-foreground hover:bg-secondary"
                >

                  <User className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Profile Overview</span>
                </button>
                <button
                  onClick={() => {
                    showToast('Connection parameters operational', 'info');
                    setProfileMenuOpen(false);
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded text-[11px] text-muted-foreground hover:text-foreground hover:bg-secondary"
                >
                  <Sliders className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>Account Settings</span>
                </button>
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center space-x-2.5 px-3 py-2 rounded text-[11px] text-rose-500 hover:text-rose-600 hover:bg-secondary border-t border-border mt-1"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
              {/* Overlay blocker */}
              <div 
                onClick={() => setProfileMenuOpen(false)}
                className="fixed inset-0 z-40 bg-transparent"
              />
            </>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop Navbar Header */}
        <header className="hidden md:flex items-center justify-between px-8 py-5 border-b border-border bg-card/40 backdrop-blur-md">
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-muted-foreground font-mono tracking-wide uppercase">
              {user?.role} Portal • {user?.organization}
            </span>
            <h2 className="text-sm font-semibold tracking-tight text-foreground mt-1">
              Good Morning, {user?.fullName} • <span className="text-muted-foreground font-normal">Tuesday, 8:24 AM</span>
            </h2>
            <p className="text-[10px] text-emerald-500 mt-0.5 font-medium">
              Recommended Action: {
                user?.role === 'Citizen' ? 'Ask Cortex AI about local budgets' :
                user?.role === 'Government Official' ? 'Review feedback complaint trends' :
                user?.role === 'Auditor' ? 'Audit PRJ-9904 Reconstruction timeline lag' :
                'Audit search engine logs status'
              }
            </p>
          </div>


          <div className="flex items-center space-x-3.5">
            <span className="text-[10px] text-muted-foreground font-mono border border-border px-2 py-0.5 rounded bg-secondary/60">
              Press Ctrl + K to Search
            </span>
            <button
              onClick={toggleTheme}
              className="p-1.5 border border-neutral-850 bg-neutral-900 rounded text-neutral-400 hover:text-neutral-200 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
            <div className="text-xs font-semibold bg-emerald-950/20 text-emerald-400 px-2.5 py-1 border border-emerald-900 rounded-md">
              Live (Demo Mocks Active)
            </div>
          </div>

        </header>

        {/* Dynamic Pages Mount Area */}
        <section className="flex-1 overflow-y-auto p-6 md:p-8 pb-20 md:pb-8 max-w-7xl w-full mx-auto">

          {isPathAllowed() ? (
            <Outlet />
          ) : (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="p-4 bg-rose-950/20 border border-rose-900 rounded-full text-rose-500">
                <ShieldAlert className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-neutral-200">Access Restricted</h3>
                <p className="text-xs text-neutral-500 max-w-md">
                  Your active role profile ({user?.role}) does not have permission to access this page. 
                  Please use the demo persona selector to login as a different role if needed.
                </p>
              </div>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold text-xs rounded transition-all active:scale-95"
              >
                Return to Dashboard
              </button>
            </div>
          )}
        </section>
      </main>


      {/* Mobile Bottom Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background border-t border-border backdrop-blur-lg flex items-center justify-around h-16 px-2 pb-safe select-none">
        <Link
          to="/dashboard"
          className={`flex flex-col items-center justify-center flex-1 h-full text-[10px] font-medium transition-all ${
            location.pathname === '/dashboard' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <LayoutDashboard className="w-5 h-5 mb-0.5" />
          <span>Dashboard</span>
        </Link>

        <Link
          to="/dashboard/chat"
          className={`flex flex-col items-center justify-center flex-1 h-full text-[10px] font-medium transition-all ${
            location.pathname.startsWith('/dashboard/chat') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <MessageSquare className="w-5 h-5 mb-0.5" />
          <span>AI Search</span>
        </Link>

        {user?.role !== 'Citizen' && (
          <Link
            to="/dashboard/analytics"
            className={`flex flex-col items-center justify-center flex-1 h-full text-[10px] font-medium transition-all ${
              location.pathname.startsWith('/dashboard/analytics') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <BarChart3 className="w-5 h-5 mb-0.5" />
            <span>Analytics</span>
          </Link>
        )}

        <Link
          to="/dashboard/feedback"
          className={`flex flex-col items-center justify-center flex-1 h-full text-[10px] font-medium transition-all ${
            location.pathname.startsWith('/dashboard/feedback') ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <FileText className="w-5 h-5 mb-0.5" />
          <span>Feedback</span>
        </Link>

        <button
          onClick={() => setProfileModalOpen(true)}
          className="flex flex-col items-center justify-center flex-1 h-full text-[10px] font-medium text-muted-foreground hover:text-foreground transition-all"
        >
          <User className="w-5 h-5 mb-0.5" />
          <span>Profile</span>
        </button>
      </nav>





      {/* Profile Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-neutral-950 border border-neutral-900 rounded-xl overflow-hidden shadow-2xl relative p-6 space-y-6 text-left">
            <button
              onClick={() => setProfileModalOpen(false)}
              className="absolute top-4 right-4 p-1 border border-neutral-850 bg-neutral-900 rounded hover:text-neutral-100 text-neutral-500"
              aria-label="Close profile details"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div className="flex flex-col items-center text-center space-y-3 pb-4 border-b border-neutral-900">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'}
                alt={user?.fullName || 'User Avatar'}
                className="w-16 h-16 rounded-full border border-neutral-800"
              />
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-neutral-200">{user?.fullName}</h3>
                <span className="inline-block px-2.5 py-0.5 bg-neutral-900 border border-neutral-800 text-[9px] uppercase font-bold tracking-wider text-emerald-400 rounded-full">
                  {user?.role}
                </span>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <span className="text-neutral-500 font-medium">Email Address</span>
                <span className="col-span-2 text-neutral-300 font-mono select-all truncate">{user?.email}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-neutral-500 font-medium">Jurisdiction</span>
                <span className="col-span-2 text-neutral-300">{user?.organization}</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <span className="text-neutral-500 font-medium">Created On</span>
                <span className="col-span-2 text-neutral-300 font-mono">July 17, 2026</span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-neutral-900/60">
                <span className="text-neutral-500 font-medium">Data Sync</span>
                <span className="col-span-2 text-emerald-500 font-semibold flex items-center space-x-1">
                  <span>●</span> <span>Snowflake Live</span>
                </span>
              </div>
            </div>

            <button
              onClick={() => setProfileModalOpen(false)}
              className="w-full py-2 bg-neutral-900 hover:bg-neutral-850 border border-neutral-800 hover:border-neutral-700 text-neutral-200 hover:text-neutral-100 font-semibold text-xs rounded transition-all active:scale-[0.98]"
            >
              Close Profile Overview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

