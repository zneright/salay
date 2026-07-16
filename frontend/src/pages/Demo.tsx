import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { showToast } from '../components/ui/Toast';
import { 
  User, 
  Building2, 
  ShieldAlert, 
  Sliders, 
  Sparkles, 
  Check, 
  X as CloseIcon, 
  ArrowLeft 
} from 'lucide-react';

export const Demo: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [targetRole, setTargetRole] = useState<string | null>(null);
  const [initLogs, setInitLogs] = useState<string[]>([]);

  const personas = [
    {
      role: 'Citizen' as const,
      name: 'Maria Santos',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80',
      municipality: 'Municipality of Salay',
      icon: User,
      color: 'border-border hover:border-primary/30 text-primary bg-card hover:shadow-md transition-all duration-200',
      description: 'Maria is a citizen of Salay. She queries municipal road status projects, files traffic signal incidents, and tracks local budgets in real-time.',
      canAccess: ['Project Registries', 'Cortex AI Chatbot', 'Feedback Reports Filing'],
      cannotAccess: ['Audit Logs Settings', 'Budget Allocation Controls'],
      questions: ['Which roads are delayed?', 'Show projects completed this year.'],
      datasets: { projects: 12, budgets: 4, reports: 143 }
    },
    {
      role: 'Government Official' as const,
      name: 'Mayor Jun Capistrano',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&q=80',
      municipality: 'Mayor’s Office, Salay',
      icon: Building2,
      color: 'border-border hover:border-primary/30 text-primary bg-card hover:shadow-md transition-all duration-200',
      description: 'The Mayor tracks infrastructure spending variance, checks citizen complaint hotspots, and prepares reports before the audit council.',
      canAccess: ['Spend Outlays Charts', 'Feedback Tickets Queue', 'Verifiable Registries'],
      cannotAccess: ['Security Configuration', 'System Engine Metrics'],
      questions: ['Compare budgets spend.', 'Show complaint hotspots.'],
      datasets: { projects: 12, budgets: 4, reports: 143 }
    },
    {
      role: 'Auditor' as const,
      name: 'Auditor Clarissa Velez',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=100&q=80',
      municipality: 'Commission on Audit (COA)',
      icon: ShieldAlert,
      color: 'border-border hover:border-primary/30 text-primary bg-card hover:shadow-md transition-all duration-200',
      description: 'Clarissa audits contractor risk ratings, verifies municipal timelines delay logs, and reviews Cortex compliance flags.',
      canAccess: ['Contractor Risk Ratings', 'Timeline Delays Log', 'Cortex Insights Warnings'],
      cannotAccess: ['Admin settings logs', 'System setups'],
      questions: ['Find high-risk contractor anomalies.', 'Which projects exceeded budget?'],
      datasets: { projects: 12, budgets: 4, reports: 143 }
    },
    {
      role: 'Administrator' as const,
      name: 'System Admin Renz',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&q=80',
      municipality: 'SALAY Core Engineering',
      icon: Sliders,
      color: 'border-border hover:border-primary/30 text-primary bg-card hover:shadow-md transition-all duration-200',
      description: 'Admin Renz oversees the Snowflake Cortex search index mapping setups, checks Snowflake pipeline stages, and tracks execution logs.',
      canAccess: ['Cortex Index Sync Console', 'Snowflake Stages Pipeline Logs', 'System Latency Panel'],
      cannotAccess: ['None (Full Access)'],
      questions: ['Show Cortex vector index latency logs.', 'Test Snowflake connection status.'],
      datasets: { projects: 12, budgets: 4, reports: 143 }
    }
  ];

  const handleLaunch = (persona: typeof personas[0]) => {
    setTargetRole(persona.role);
    setInitLogs([]);

    const logs = [
      'Establishing Snowflake secure gateway connection...',
      '✓ Connection test returned status 200 OK',
      'Ingesting staged CSV datasets from Snowflake stages...',
      '✓ Synched 12 projects, 4 budgets, 143 citizen complaints',
      'Configuring Cortex LLM semantic search index rules...',
      '✓ Cortex search catalog setup complete',
      `Activating session profile: ${persona.name} (${persona.role})`,
      'Done'
    ];

    logs.forEach((logText, idx) => {
      setTimeout(() => {
        setInitLogs((prev) => [...prev, logText]);
        if (idx === logs.length - 1) {
          setTimeout(async () => {
            // Logs in using predefined credentials matching mock roles
            const email = 
              persona.role === 'Citizen' ? 'citizen@salay.gov' :
              persona.role === 'Government Official' ? 'official@salay.gov' :
              persona.role === 'Auditor' ? 'auditor@salay.gov' :
              'admin@salay.gov';
            
            try {
              await login(email, 'password123');
              showToast(`Logged in successfully as ${persona.name}`, 'success');
              navigate('/dashboard');
            } catch {
              showToast('Demo environment initialization failed', 'error');
            }
          }, 400);
        }
      }, (idx + 1) * 200);
    });
  };

  if (targetRole) {
    return (
      <div className="min-h-screen bg-background relative flex items-center justify-center p-6 md:p-12 overflow-hidden text-left font-semibold">
        {/* Glow grid mesh background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl opacity-50 pointer-events-none" />

        <div className="max-w-md w-full border border-border bg-card/85 backdrop-blur-md rounded-2xl p-8 shadow-2xl relative z-10 space-y-6">
          <div className="flex items-center space-x-3 text-primary font-bold text-sm">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span>SALAY Environment Bootloader</span>
          </div>

          <div className="space-y-1">
            <h2 className="text-sm font-bold text-foreground">Setting up {targetRole} environment</h2>
            <p className="text-[10px] text-muted-foreground">Staging Snowflake Cortex queries and layout templates...</p>
          </div>

          <div className="font-mono text-[10px] text-muted-foreground bg-secondary/40 p-4 border border-border rounded-xl space-y-2 min-h-40">
            {initLogs.map((log, idx) => (
              <div 
                key={idx} 
                className={`transition-opacity duration-300 ${log.startsWith('✓') || log === 'Done' ? 'text-emerald-500 font-bold' : 'text-muted-foreground'}`}
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
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col justify-between p-6 md:p-12 text-left font-semibold">
      {/* Background glowing mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.05)_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35 pointer-events-none" />

      {/* Header */}
      <header className="flex justify-between items-center relative z-10">
        <Link 
          to="/" 
          className="flex items-center space-x-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </Link>
        <div className="flex items-center space-x-2 text-xs text-foreground">
          <Building2 className="w-5 h-5 text-primary" />
          <span className="font-bold text-sm tracking-tight">SALAY</span>
        </div>
      </header>

      {/* Main Persona grids */}
      <main className="max-w-6xl mx-auto w-full space-y-8 relative z-10 py-12">
        <div className="text-center space-y-3">
          <h1 className="text-[40px] font-bold tracking-tight text-foreground leading-none">Demo Control Center</h1>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            Choose a stakeholder persona to launch. Each role presents a contextual view of SALAY.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {personas.map((persona) => {
            const Icon = persona.icon;
            return (
              <div
                key={persona.role}
                className={`border rounded-2xl p-5 shadow-2xl flex flex-col justify-between space-y-5 transition-all duration-300 hover:scale-[1.02] ${persona.color}`}
              >
                {/* Header User details */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={persona.avatar} 
                        alt={persona.name} 
                        className="w-10 h-10 rounded-full border border-border shrink-0"
                      />
                      <div className="text-left leading-tight">
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">{persona.role}</h3>
                        <h4 className="text-xs font-bold text-foreground truncate max-w-[130px]">{persona.name}</h4>
                      </div>
                    </div>
                    <div className="p-1.5 border border-border bg-secondary rounded-xl text-primary shrink-0">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                  </div>

                  <div className="space-y-1 text-left">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground block">Municipality</span>
                    <span className="text-[10px] text-foreground">{persona.municipality}</span>
                  </div>

                  <p className="text-[10px] text-muted-foreground leading-relaxed text-left font-medium">
                    {persona.description}
                  </p>
                </div>

                {/* Modules checklists */}
                <div className="space-y-3.5 border-t border-border pt-4 text-left">
                  <div className="space-y-1">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground block mb-1">Access Checklist</span>
                    <div className="space-y-1.5">
                      {persona.canAccess.map((m, idx) => (
                        <div key={idx} className="flex items-center space-x-1.5 text-[10px] text-foreground">
                          <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="truncate">{m}</span>
                        </div>
                      ))}
                      {persona.cannotAccess.map((m, idx) => (
                        <div key={idx} className="flex items-center space-x-1.5 text-[10px] text-muted-foreground/60">
                          <CloseIcon className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="truncate">{m}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Datasets counters mock */}
                  <div className="space-y-1 border-t border-border pt-3">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground block mb-1">Available Datasets</span>
                    <div className="grid grid-cols-3 gap-1 text-center font-mono text-[9px] text-muted-foreground bg-secondary/40 p-2 rounded-lg border border-border/60">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">{persona.datasets.projects}</span>
                        <span className="text-[7px]">PRJS</span>
                      </div>
                      <div className="flex flex-col border-x border-border">
                        <span className="font-bold text-foreground">{persona.datasets.budgets}</span>
                        <span className="text-[7px]">BDGTS</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">{persona.datasets.reports}</span>
                        <span className="text-[7px]">RPRTS</span>
                      </div>
                    </div>
                  </div>

                  {/* Suggested questions */}
                  <div className="space-y-1.5 border-t border-border pt-3">
                    <span className="text-[9px] uppercase font-bold text-muted-foreground block">Suggested Queries</span>
                    <div className="space-y-1 font-mono text-[9px] text-muted-foreground">
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
                  className="w-full py-2 bg-primary hover:bg-primary/95 text-primary-foreground font-bold text-xs rounded-lg transition-all active:scale-[0.98] flex items-center justify-center space-x-1"
                >
                  <span>Launch Demo Portal</span>
                </button>
              </div>
            );
          })}
        </div>
      </main>

      <footer className="relative z-10 text-center text-[10px] text-muted-foreground pt-12">
        <span>Powered by Snowflake Cortex AI & Snowpark. Built for Civic Transparency.</span>
      </footer>
    </div>
  );
};
export default Demo;
