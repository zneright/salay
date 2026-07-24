import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { showToast } from './Toast';
import { 
  Search, 
  LayoutDashboard, 
  BarChart3, 
  MessageSquare, 
  FileText, 
  Settings, 
  X, 
  LogOut,
  FolderKanban,
  Coins
} from 'lucide-react';

interface PaletteItem {
  name: string;
  category: 'Navigation' | 'Actions' | 'Search Data';
  icon: React.ComponentType<any>;
  keywords: string;
  action: () => void;
}

export const CommandPalette: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const { logout } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const items: PaletteItem[] = [
    // Navigation
    { 
      name: 'Go to Dashboard', 
      category: 'Navigation', 
      icon: LayoutDashboard, 
      keywords: 'home landing main public projects', 
      action: () => navigate('/dashboard') 
    },
    { 
      name: 'Municipal Budgets Analytics', 
      category: 'Navigation', 
      icon: BarChart3, 
      keywords: 'charts graphs money allocation spend', 
      action: () => navigate('/dashboard/analytics') 
    },
    { 
      name: 'Cortex AI Chat', 
      category: 'Navigation', 
      icon: MessageSquare, 
      keywords: 'ask search help answers model llama', 
      action: () => navigate('/dashboard/chat') 
    },
    { 
      name: 'Citizen Feedback Center', 
      category: 'Navigation', 
      icon: FileText, 
      keywords: 'report ticket pothole traffic complaints', 
      action: () => navigate('/dashboard/feedback') 
    },
    { 
      name: 'Configure Settings', 
      category: 'Navigation', 
      icon: Settings, 
      keywords: 'theme custom connection setup account', 
      action: () => navigate('/dashboard/settings') 
    },

    // Actions
    {
      name: 'Submit New Complaint Report',
      category: 'Actions',
      icon: FileText,
      keywords: 'create report file ticket complaint problem',
      action: () => {
        navigate('/dashboard/feedback');
        showToast('Use the form below to file a civic complaint', 'info');
      }
    },
    {
      name: 'Ask AI: Delayed Projects Query',
      category: 'Actions',
      icon: MessageSquare,
      keywords: 'delayed projects audit schedule lag',
      action: () => {
        navigate('/dashboard/chat');
        showToast('Type: "Show delayed infrastructure projects"', 'info');
      }
    },
    {
      name: 'Sign Out Account',
      category: 'Actions',
      icon: LogOut,
      keywords: 'logout exit session clear reset',
      action: async () => {
        await logout();
        showToast('Logged out successfully', 'info');
        navigate('/login');
      }
    },

    // Live Snowflake Data Navigation
    {
      name: 'Snowflake Table: PROJECTS (Public Infrastructure)',
      category: 'Search Data',
      icon: FolderKanban,
      keywords: 'project infrastructure public works database snowflake',
      action: () => {
        navigate('/dashboard');
        showToast('Viewing live Snowflake PROJECTS table registry', 'info');
      }
    },
    {
      name: 'Snowflake Table: BUDGETS (Municipal Outlays)',
      category: 'Search Data',
      icon: Coins,
      keywords: 'budget money code engineering infrastructure spends capital snowflake',
      action: () => {
        navigate('/dashboard/analytics');
        showToast('Viewing live Snowflake BUDGETS table allocations', 'info');
      }
    },
    {
      name: 'Snowflake Table: FEEDBACK_REPORTS (Citizen Tickets)',
      category: 'Search Data',
      icon: FileText,
      keywords: 'feedback reports citizen incident tickets snowflake',
      action: () => {
        navigate('/dashboard/feedback');
        showToast('Viewing live Snowflake FEEDBACK_REPORTS registry', 'info');
      }
    }
  ];


  const filtered = items.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.keywords.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (item: PaletteItem) => {
    item.action();
    setIsOpen(false);
    setSearch('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4 bg-black/60 backdrop-blur-sm">
      <div 
        className="w-full max-w-lg bg-neutral-950 border border-neutral-900 rounded-xl overflow-hidden shadow-2xl flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Search header line */}
        <div className="flex items-center px-4 py-3 border-b border-neutral-900 space-x-3">
          <Search className="w-4 h-4 text-neutral-500 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects, switch roles, or trigger actions..."
            className="w-full bg-transparent text-xs text-neutral-250 outline-none placeholder-neutral-600"
          />
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 border border-neutral-850 bg-neutral-900 rounded hover:text-neutral-100 text-neutral-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Results grid */}
        <div className="p-3 max-h-80 overflow-y-auto space-y-3">
          {filtered.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500">
              No matching commands, pages, or database records found.
            </div>
          ) : (
            // Group by category
            (['Navigation', 'Actions', 'Demo Roles', 'Search Data'] as const).map((cat) => {
              const catItems = filtered.filter(i => i.category === cat);
              if (catItems.length === 0) return null;
              return (
                <div key={cat} className="space-y-1">
                  <span className="px-2 text-[9px] uppercase font-bold text-neutral-600 tracking-wider">
                    {cat}
                  </span>
                  {catItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.name}
                        onClick={() => handleSelect(item)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-neutral-900 text-left transition-colors text-xs text-neutral-300 hover:text-neutral-100 group"
                      >
                        <div className="flex items-center space-x-3">
                          <Icon className="w-4 h-4 text-neutral-500 group-hover:text-neutral-300" />
                          <span>{item.name}</span>
                        </div>
                        <span className="text-[9px] text-neutral-600 font-mono">Run ↵</span>
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Shortcuts guide footer */}
        <div className="px-4 py-2.5 bg-neutral-900/50 border-t border-neutral-900 flex justify-between text-[10px] text-neutral-500 font-mono">
          <span>Snowflake-Indexed Data Search</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
export default CommandPalette;
