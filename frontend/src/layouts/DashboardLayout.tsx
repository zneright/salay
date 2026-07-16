import React, { useState } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  Settings, 
  Menu, 
  X,
  Building2,
  User
} from 'lucide-react';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<any>;
}

export const DashboardLayout: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigation: NavigationItem[] = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'AI Chat', href: '/chat', icon: MessageSquare },
    { name: 'Citizen Feedback', href: '/feedback', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground">
      {/* Mobile Top Navbar */}
      <header className="flex md:hidden items-center justify-between px-6 py-4 bg-neutral-900 border-b border-neutral-800">
        <div className="flex items-center space-x-2">
          <Building2 className="w-5 h-5 text-neutral-100" />
          <span className="font-semibold text-sm tracking-tight">Civic Glass</span>
        </div>
        <button
          onClick={toggleMobileMenu}
          className="p-1 border border-neutral-800 rounded bg-neutral-950 text-neutral-400 hover:text-neutral-100"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-neutral-950 border-r border-neutral-900 flex flex-col justify-between p-6 transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:inset-auto ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="space-y-8">
          {/* Logo Brand */}
          <div className="flex items-center space-x-2.5 px-2">
            <Building2 className="w-6 h-6 text-neutral-100" />
            <span className="font-bold text-base tracking-tight">Civic Glass</span>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navigation.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-neutral-900 text-neutral-100 border-l-2 border-neutral-100'
                      : 'text-neutral-400 hover:text-neutral-100 hover:bg-neutral-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-neutral-100' : 'text-neutral-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile footer element */}
        <div className="pt-4 border-t border-neutral-900 flex items-center space-x-3 px-2">
          <div className="w-8 h-8 rounded-full bg-neutral-900 flex items-center justify-center border border-neutral-800">
            <User className="w-4 h-4 text-neutral-300" />
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-neutral-200">Jane Citizen</span>
            <span className="text-[10px] text-neutral-500">Observer</span>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Desktop Navbar */}
        <header className="hidden md:flex items-center justify-between px-8 py-5 border-b border-neutral-900 bg-neutral-950/40 backdrop-blur-md">
          <div className="text-xs text-neutral-400 font-medium">
            System Status: <span className="text-emerald-500 font-semibold">Live (Demo Mocks Active)</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-xs font-medium bg-neutral-900 text-neutral-300 px-2.5 py-1 border border-neutral-800 rounded-md">
              Snowflake Phase 2
            </div>
          </div>
        </header>

        {/* Dynamic Pages Mount Area */}
        <section className="flex-1 overflow-y-auto p-6 md:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </section>
      </main>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 md:hidden"
        />
      )}
    </div>
  );
};
