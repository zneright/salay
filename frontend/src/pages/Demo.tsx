import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { showToast } from '../components/ui/Toast';
import { 
  User, 
  Building, 
  ShieldAlert, 
  Terminal,
  ArrowLeft,
  Building2,
  Check,
  X as CloseIcon,
  Sparkles
} from 'lucide-react';

interface DemoPersona {
  role: 'Citizen' | 'Government Official' | 'Auditor' | 'Administrator';
  name: string;
  avatar: string;
  municipality: string;
  description: string;
  canAccess: string[];
  cannotAccess: string[];
  datasets: { projects: number; budgets: number; reports: number };
  questions: string[];
  icon: React.ComponentType<any>;
  color: string;
}

export const Demo: React.FC = () => {
  const { loginAsDemoRole } = useAuth();
  const navigate = useNavigate();
  
  // Loading Tour state
  const [isInitializing, setIsInitializing] = useState(false);
  const [initLogs, setInitLogs] = useState<string[]>([]);
  const [targetRole, setTargetRole] = useState<string>('');

  const personas: DemoPersona[] = [
    {
      role: 'Citizen',
      name: 'Juan Dela Cruz',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80',
      municipality: 'Municipality of Salay',
      description: 'Review local infrastructure projects progress in Wards and submit feedback complaints directly to the council.',
      canAccess: ['Civic Dashboard', 'AI Cortex Search', 'Feedback submission'],
      cannotAccess: ['Capital Budget analytics', 'Contractor Audit trail logs', 'Engine Status overrides'],
      datasets: { projects: 12, budgets: 0, reports: 43 },
      questions: ['Which roads in Ward 4 are delayed?', 'Show solar conversions budgets'],
      icon: User,
      color: 'border-neutral-900 hover:border-blue-500/30 text-blue-400 bg-neutral-950/70',
    },
    {
      role: 'Government Official',
      name: 'Roberto Santos (Mayor)',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=100&q=80',
      municipality: 'Mayoralty Council Office',
      description: 'Oversee municipal spending profiles, examine departmental charts, and inspect public works delay statistics.',
      canAccess: ['Civic Dashboard', 'AI Cortex Search', 'Capital Budget analytics', 'Citizen Complaints list'],
      cannotAccess: ['Contractor Audit trail logs', 'Engine Settings configurations'],
      datasets: { projects: 12, budgets: 4, reports: 143 },
      questions: ['Which departments exceeded allocations?', 'Review citizen feedback summaries'],
      icon: Building,
      color: 'border-neutral-900 hover:border-purple-500/30 text-purple-400 bg-neutral-950/70',
    },
    {
      role: 'Auditor',
      name: 'Maria Santos (Auditor)',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80',
      municipality: 'Auditor General Office',
      description: 'Conduct strict timeline analyses on contractors, verify budget variances, and audit risk indicator models.',
      canAccess: ['Civic Dashboard', 'AI Cortex Search', 'Budget Analytics charts', 'Citizen Complaints list', 'Settings Overrides'],
      cannotAccess: ['Engine config settings edits'],
      datasets: { projects: 12, budgets: 4, reports: 143 },
      questions: ['Which projects exceeded budget?', 'Find high-risk contractor anomalies'],
      icon: ShieldAlert,
      color: 'border-neutral-900 hover:border-amber-500/30 text-amber-400 bg-neutral-950/70',
    },
    {
      role: 'Administrator',
      name: 'System Overseer',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
      municipality: 'Core Controls Node',
      description: 'Oversee Cortex model indices parameters, manage setup logs, check engine latency parameters.',
      canAccess: ['Civic Dashboard', 'AI Cortex Search', 'Budget Analytics charts', 'Citizen Complaints list', 'Settings Overrides', 'Engine Control Panels'],
      cannotAccess: [],
      datasets: { projects: 12, budgets: 4, reports: 143 },
      questions: ['Check Cortex API latency logs', 'Manage system records index'],
      icon: Terminal,
      color: 'border-neutral-900 hover:border-emerald-500/30 text-emerald-400 bg-neutral-950/70',
    },
  ];

  const handleLaunch = async (persona: DemoPersona) => {
    setTargetRole(persona.role);
    setIsInitializing(true);
    setInitLogs([]);

    const steps = [
      'Initializing Demo Environment...',
      '✓ Loading Municipal Projects Registry',
      '✓ Loading Budgets Outlay Registry',
      '✓ Staging Ingestion Pipelines',
      '✓ Configuring Cortex AI Q&A Models',
      '✓ Structuring Dashboard layout views',
      'Done'
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, i === 0 ? 250 : 200));
      setInitLogs((prev) => [...prev, steps[i]]);
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    try {
      await loginAsDemoRole(persona.role);
      showToast(`Logged in successfully as ${persona.role}`, 'success');
      navigate('/dashboard');
    } catch {
      showToast('Role launch failed.', 'error');
      setIsInitializing(false);
    }
  };

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden px-6">
        {/* Glow grid mesh background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-neutral-900/40 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="max-w-md w-full border border-neutral-900 bg-neutral-950/80 backdrop-blur-md rounded-xl p-8 shadow-2xl relative z-10 space-y-6 text-left">
          <div className="flex items-center space-x-3 text-emerald-400 font-semibold text-sm">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span>SALAY Environment Bootloader</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-sm font-bold text-neutral-200">Setting up {targetRole} environment</h2>
            <p className="text-[10px] text-neutral-500">Staging Snowflake Cortex queries and layout templates...</p>
          </div>

          <div className="font-mono text-[10px] text-neutral-400 bg-neutral-900/40 p-4 border border-neutral-900 rounded space-y-2 min-h-40">
            {initLogs.map((log, idx) => (
              <div 
                key={idx} 
                className={`transition-opacity duration-300 ${log.startsWith('✓') || log === 'Done' ? 'text-emerald-400' : 'text-neutral-400'}`}
              >
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between p-6 md:p-12">
      {/* Background glowing mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-35 pointer-events-none" />

      {/* Header */}
      <header className="flex justify-between items-center relative z-10">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-xs text-neutral-400 hover:text-neutral-100 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center space-x-2 text-xs">
          <Building2 className="w-5 h-5 text-neutral-100" />
          <span className="font-bold text-sm tracking-tight">SALAY</span>
        </div>
      </header>

      {/* Main Persona grids */}
      <main className="max-w-6xl mx-auto w-full space-y-8 relative z-10 py-12">
        <div className="text-center space-y-3">
          <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight">Demo Control Center</h1>
          <p className="text-xs text-neutral-400 max-w-md mx-auto">
            Choose a stakeholder persona to launch. Each role presents a contextual view of SALAY.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((persona) => {
            const Icon = persona.icon;
            return (
              <div
                key={persona.role}
                className={`border rounded-xl p-5 shadow-2xl flex flex-col justify-between space-y-5 transition-all duration-300 hover:scale-[1.02] ${persona.color}`}
              >
                {/* Header User details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={persona.avatar} 
                        alt={persona.name} 
                        className="w-10 h-10 rounded-full border border-neutral-900 shrink-0"
                      />
                      <div className="text-left leading-tight">
                        <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">{persona.role}</h3>
                        <h4 className="text-xs font-bold text-neutral-100 truncate max-w-[130px]">{persona.name}</h4>
                      </div>
                    </div>
                    <div className="p-1.5 border border-neutral-900 bg-neutral-900/60 rounded-md text-neutral-400 shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>


                  <div className="space-y-1 text-left">
                    <span className="text-[9px] uppercase font-bold text-neutral-500 block">Municipality</span>
                    <span className="text-[10px] text-neutral-350">{persona.municipality}</span>
                  </div>

                  <p className="text-[10px] text-neutral-400 leading-relaxed text-left">
                    {persona.description}
                  </p>
                </div>

                {/* Modules checklists */}
                <div className="space-y-3.5 border-t border-neutral-900 pt-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-neutral-500 block mb-1">Access Checklist</span>
                    <div className="space-y-1.5">
                      {persona.canAccess.map((m, idx) => (
                        <div key={idx} className="flex items-center space-x-1.5 text-[10px] text-neutral-350">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{m}</span>
                        </div>
                      ))}
                      {persona.cannotAccess.map((m, idx) => (
                        <div key={idx} className="flex items-center space-x-1.5 text-[10px] text-neutral-600">
                          <CloseIcon className="w-3.5 h-3.5 text-neutral-700 shrink-0" />
                          <span className="truncate">{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Datasets counters mock */}
                  <div className="space-y-1 border-t border-neutral-900/60 pt-3">
                    <span className="text-[9px] uppercase font-bold text-neutral-500 block mb-1">Available Datasets</span>
                    <div className="grid grid-cols-3 gap-1 text-center font-mono text-[9px] text-neutral-450 bg-neutral-900/40 p-2 rounded">
                      <div className="flex flex-col">
                        <span className="font-bold text-neutral-300">{persona.datasets.projects}</span>
                        <span className="text-[7px]">PRJS</span>
                      </div>
                      <div className="flex flex-col border-x border-neutral-900">
                        <span className="font-bold text-neutral-300">{persona.datasets.budgets}</span>
                        <span className="text-[7px]">BDGTS</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-neutral-300">{persona.datasets.reports}</span>
                        <span className="text-[7px]">RPRTS</span>
                      </div>
                    </div>
                  </div>

                  {/* Suggested questions */}
                  <div className="space-y-1.5 border-t border-neutral-900/60 pt-3">
                    <span className="text-[9px] uppercase font-bold text-neutral-500 block">Suggested Queries</span>
                    <div className="space-y-1 font-mono text-[9px] text-neutral-400">
                      {persona.questions.map((q, idx) => (
                        <div key={idx} className="truncate">
                          • "{q}"
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Launch Demo button */}
                <button
                  onClick={() => handleLaunch(persona)}
                  className="w-full py-2 bg-neutral-100 hover:bg-neutral-250 text-neutral-900 font-bold text-xs rounded transition-all active:scale-[0.98] flex items-center justify-center space-x-1"
                >
                  <span>Launch Demo Portal</span>
                </button>
              </div>
            );
          })}
        </div>
      </main>

      {/* Footer info */}
      <footer className="text-center text-[10px] text-neutral-500 relative z-10 pt-6">
        Designed for judges audit reviews. Mapped using mock local caches matching Snowflake target structures.
      </footer>
    </div>
  );
};
export default Demo;
