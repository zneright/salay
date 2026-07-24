import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { SnowflakeBadge } from '../components/ui/SnowflakeBadge';
import { CountUp } from '../components/ui/CountUp';
import { showToast } from '../components/ui/Toast';
import { fetchProjects, createProject, CivicProject } from '../services/api';
import { getProjectTitleForDoc, detectDepartment, formatCurrency } from '../utils/documentCatalog';
import { CoCoTerminalModal } from '../components/ui/CoCoTerminalModal';
import { 
  Sparkles, 
  AlertTriangle,
  CheckCircle2,
  Cpu,
  X,
  Plus,
  Building2,
  ShieldCheck,
  Terminal,
  ArrowRight
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const role = user?.role || 'Citizen';

  // Projects State - Loaded from live Snowflake backend
  const [projects, setProjects] = useState<CivicProject[]>([]);
  const [loading, setLoading] = useState(true);

  // CoCo CLI Terminal Modal state
  const [isCliModalOpen, setIsCliModalOpen] = useState(false);
  const [cliInitialCommand, setCliInitialCommand] = useState('coco status');

  // Load live projects from Snowflake backend on mount
  useEffect(() => {
    let isMounted = true;
    fetchProjects()
      .then((data) => {
        if (isMounted) {
          setProjects(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load projects from Snowflake:", err);
        if (isMounted) {
          setLoading(false);
        }
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Modal States
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  // New Project Form
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Public Works & Engineering');
  const [newBudget, setNewBudget] = useState('');
  const [newLocation] = useState('Ward 4 (North Metro)');
  const [newTimeline] = useState('Aug 2026 - Dec 2027');
  const [newProjectAnon, setNewProjectAnon] = useState(false);

  // Upload & Auto-Extraction States
  const [pdfFileName, setPdfFileName] = useState('');

  const handleAskCortexForProject = (projectTitle: string, projectId: string) => {
    showToast(`Querying Cortex AI regarding ${projectTitle} (${projectId})`, 'info');
    navigate('/dashboard/chat');
  };

  const handleCreateProjectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const derivedTitle = (newTitle || (pdfFileName ? getProjectTitleForDoc(pdfFileName) : '')).trim();
    if (!derivedTitle || !newBudget) {
      showToast('Please specify a project title or attach a PDF document proof', 'error');
      return;
    }

    const amount = parseFloat(newBudget);
    if (isNaN(amount) || amount <= 0) {
      showToast('Please enter a valid project budget', 'error');
      return;
    }

    const derivedDept = newDept || detectDepartment(pdfFileName) || detectDepartment(derivedTitle);
    const authorName = newProjectAnon ? 'Anonymous Citizen' : (user?.fullName || 'Registered User');

    // Handle Demo Mode Sandbox
    if (user?.isDemo) {
      const createdDemo: CivicProject = {
        id: `PRJ-${Math.floor(1000 + Math.random() * 9000)}`,
        title: derivedTitle,
        department: derivedDept,
        budget: amount,
        status: 'Planned',
        location: newLocation || 'Municipal District',
        timeline: newTimeline || '2026',
        progress: 0,
        postedBy: authorName,
        pdfDocName: pdfFileName || undefined,
        risk: amount > 500000000 ? 'High' : 'Low'
      };

      setProjects((prev) => [createdDemo, ...prev]);
      setShowNewProjectModal(false);
      setNewTitle('');
      setNewBudget('');
      setPdfFileName('');
      setNewProjectAnon(false);
      showToast('⚡ Demo Sandbox: Project added to current session view (Not saved permanently)', 'info');
      return;
    }

    try {
      const created = await createProject({
        title: derivedTitle,
        department: derivedDept,
        budget: amount,
        status: 'Planned',
        location: newLocation || 'Municipal District',
        timeline: newTimeline || '2026',
        progress: 0,
        postedBy: authorName,
        pdfDocName: pdfFileName || undefined,
      });

      setProjects((prev) => [created, ...prev]);
      setShowNewProjectModal(false);
      setNewTitle('');
      setNewBudget('');
      setPdfFileName('');
      setNewProjectAnon(false);
      showToast(`Project "${derivedTitle}" posted to Snowflake DB (${derivedDept})`, 'success');
    } catch (err) {
      showToast('Failed to post project to Snowflake DB', 'error');
    }
  };

  const departments = [
    { name: 'Public Works & Engineering', allocated: 250000000, spent: 198000000 },
    { name: 'Health & Sanitation Outlay', allocated: 120000000, spent: 89000000 },
    { name: 'Transportation & Traffic Management', allocated: 80000000, spent: 64000000 },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8 w-full overflow-x-hidden">
      {/* Quick Role Switcher Bar */}
      <div className="p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-neutral-900 dark:text-white font-mono uppercase tracking-wider text-[11px]">
            Active Role View:
          </span>
          <span className="px-2.5 py-0.5 rounded-full font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            {role}
          </span>
          {user?.isDemo && (
            <span className="text-[10px] text-amber-600 dark:text-amber-300 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              🔒 Ephemeral Demo Sandbox
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-neutral-500 text-[11px] mr-1 hidden sm:inline">Switch Role View:</span>
          {(['Citizen', 'Auditor', 'Government Official', 'Administrator'] as const).map((r) => (
            <button
              key={r}
              onClick={() => {
                loginAsDemo(r);
                showToast(`Switched view to ${r} Persona`, 'info');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                role === r
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              }`}
            >
              {r === 'Administrator' ? '⚡ Admin' : r === 'Government Official' ? '🏛️ Official' : r === 'Auditor' ? '🕵️ Auditor' : '👤 Citizen'}
            </button>
          ))}
        </div>
      </div>

      {/* Top Banner Greeting */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'}
            alt={user?.fullName || 'User'}
            className="w-14 h-14 rounded-full object-cover ring-2 ring-sky-500/30"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
                {role === 'Administrator' && '⚡ System Governance & CoCo CLI Console'}
                {role === 'Auditor' && '🕵️ Auditor General Intelligence Hub'}
                {role === 'Government Official' && '🏛️ Department Expenditure & Allocation Control'}
                {role === 'Citizen' && `Welcome back, ${user?.fullName || 'Citizen'}`}
              </h1>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {role === 'Administrator' && 'Snowflake DB Schema Administration • CoCo Agent Automation • Live Logs'}
              {role === 'Auditor' && 'Snowflake Cortex Anomaly Detection • Line-Item PDF Proofs • SQL Verification'}
              {role === 'Government Official' && 'Municipal Department Appropriations • Budget Utilization • Approval Queue'}
              {role === 'Citizen' && `${user?.organization || 'Metro City Municipality'} • Public Works Transparency Portal`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {role === 'Administrator' && (
            <button
              onClick={() => {
                setCliInitialCommand('coco status');
                setIsCliModalOpen(true);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md transition-all active:scale-95"
            >
              <Terminal className="w-4 h-4" />
              <span>Launch CoCo CLI Terminal</span>
            </button>
          )}

          {role === 'Auditor' && (
            <button
              onClick={() => navigate('/dashboard/chat')}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Inspect Anomaly Proofs</span>
            </button>
          )}

          {role === 'Government Official' && (
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Allocate New Project</span>
            </button>
          )}

          {role === 'Citizen' && (
            <button
              onClick={() => setShowNewProjectModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-sm transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Report Incident / Project</span>
            </button>
          )}

          <button
            onClick={() => navigate('/dashboard/chat')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-sm transition-all active:scale-95"
          >
            <Cpu className="w-4 h-4" />
            <span>Ask Cortex AI</span>
          </button>
        </div>
      </div>

      {/* PERSONA 1: CITIZEN DASHBOARD */}
      {role === 'Citizen' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1">
              <span className="text-xs font-medium text-neutral-500">Active Metro Projects</span>
              <div className="text-2xl font-extrabold text-neutral-900 dark:text-white">
                <CountUp end={projects.length} duration={500} />
              </div>
              <SnowflakeBadge variant="source" label="Source: Projects DB" size="sm" />
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1">
              <span className="text-xs font-medium text-neutral-500">Public Works Budget</span>
              <div className="text-2xl font-extrabold text-neutral-900 dark:text-white">
                <CountUp end={450} prefix="₱" suffix="M" decimals={1} duration={500} />
              </div>
              <SnowflakeBadge variant="snowpark" label="Snowpark Calculated" size="sm" />
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1">
              <span className="text-xs font-medium text-neutral-500">Citizen Reports Resolved</span>
              <div className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                <CountUp end={87} suffix="%" duration={500} />
              </div>
              <SnowflakeBadge variant="coco" label="CoCo Pipeline Active" size="sm" />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Public Infrastructure Projects Matrix</h3>
                <p className="text-xs text-neutral-500">View photo proofs, analyze attached PDF documents via Cortex AI, or post inquiries</p>
              </div>
              <button
                onClick={() => setShowNewProjectModal(true)}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Post Project
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {loading ? (
                <div className="col-span-2 py-8 text-center text-xs text-neutral-500 flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-500 animate-spin" />
                  <span>Loading projects from Snowflake DB...</span>
                </div>
              ) : projects.length === 0 ? (
                <div className="col-span-2 py-8 text-center text-xs text-neutral-500">
                  No projects currently found in Snowflake PROJECTS table. Click "Post Project" above to create one.
                </div>
              ) : (
                projects.map((p) => {
                  return (
                    <div key={p.id} className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/60 space-y-4 flex flex-col justify-between shadow-xs hover:border-sky-500/40 transition-all">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="font-mono text-[11px] text-sky-600 dark:text-sky-400 font-bold">{p.id}</span>
                            <h4 className="font-bold text-sm text-neutral-900 dark:text-white">{p.title}</h4>
                            <p className="text-xs text-neutral-500">{p.department} • {p.location}</p>
                          </div>
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-sky-500/10 text-sky-600 border border-sky-500/20">
                            {p.status}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-200 dark:border-neutral-700/40">
                          <span className="text-neutral-500">Allocation:</span>
                          <strong className="text-neutral-900 dark:text-white font-mono">{formatCurrency(p.budget)}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => handleAskCortexForProject(p.title, p.id)}
                          className="flex-1 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <Sparkles className="w-3.5 h-3.5" /> Ask Cortex AI
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* PERSONA 2: GOVERNMENT OFFICIAL DASHBOARD */}
      {role === 'Government Official' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1">
              <span className="text-xs font-medium text-neutral-500">Total Department Appropriations</span>
              <div className="text-2xl font-extrabold text-neutral-900 dark:text-white">₱450.0M</div>
              <SnowflakeBadge variant="snowpark" label="Snowpark Aggregated" size="sm" />
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1">
              <span className="text-xs font-medium text-neutral-500">Outlay Utilization Rate</span>
              <div className="text-2xl font-extrabold text-sky-600 dark:text-sky-400">81.4%</div>
              <SnowflakeBadge variant="status" label="Within Target" size="sm" />
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1">
              <span className="text-xs font-medium text-neutral-500">Pending Approval Queue</span>
              <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">3 Items</div>
              <SnowflakeBadge variant="coco" label="CoCo CLI Triggered" size="sm" />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">Department Expenditure Breakdown</h3>
            <div className="space-y-4">
              {departments.map((d) => {
                const pct = Math.round((d.spent / d.allocated) * 100);
                return (
                  <div key={d.name} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-neutral-900 dark:text-white">{d.name}</span>
                      <span className="font-mono">{formatCurrency(d.spent)} / {formatCurrency(d.allocated)} ({pct}%)</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                      <div className="h-full bg-sky-500 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* PERSONA 3: INDEPENDENT AUDITOR DASHBOARD */}
      {role === 'Auditor' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
              <span><strong>Cortex AI Anomaly Alert:</strong> 1 high-variance budget contract detected (`DPWH-24C00088` exceeded phase cap by ₱45.2M).</span>
            </div>
            <button
              onClick={() => navigate('/dashboard/chat')}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold shrink-0"
            >
              Verify Proof →
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Auditor Risk & Contract Anomaly Register</h3>
                <p className="text-xs text-neutral-500">Cortex LLM vector search parsed from attached DPWH PDF contract files</p>
              </div>
              <SnowflakeBadge variant="cortex" label="Cortex AI Analyzed" />
            </div>

            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 flex items-center justify-between gap-4 text-xs hover:border-sky-500/40 border border-transparent transition-all">
                  <div className="space-y-1">
                    <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{p.id}</span>
                    <h4 className="font-bold text-neutral-900 dark:text-white">{p.title}</h4>
                    <p className="text-neutral-500">{p.department} • Timeline: {p.timeline}</p>
                  </div>
                  <div className="text-right space-y-2">
                    <span className={`px-2.5 py-1 rounded-full font-semibold text-[10px] ${
                      p.risk === 'High' ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {p.risk || 'Low'} Risk Flag
                    </span>
                    <p className="font-bold font-mono text-neutral-900 dark:text-white">{formatCurrency(p.budget)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PERSONA 4: ADMINISTRATOR DASHBOARD */}
      {role === 'Administrator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1">
              <span className="text-xs font-medium text-neutral-500">Snowflake DB Instance</span>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> CIVIC_TRANSPARENCY_DB
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1">
              <span className="text-xs font-medium text-neutral-500">Cortex LLM Model</span>
              <div className="text-lg font-bold text-sky-500">llama3-70b / llama3.1-405b</div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1">
              <span className="text-xs font-medium text-neutral-500">CoCo CLI Agent Health</span>
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">Healthy (0ms CLI Sync)</div>
            </div>
          </div>

          {/* CoCo Agent Embedded Control Console */}
          <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl text-slate-100 space-y-4 w-full overflow-x-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 flex-wrap gap-2">
              <div className="flex items-center space-x-2">
                <Terminal className="w-5 h-5 text-[#29b5e8]" />
                <h3 className="text-sm font-bold font-mono">CoCo Agent CLI Control Suite</h3>
              </div>
              <button
                onClick={() => {
                  setCliInitialCommand('coco status');
                  setIsCliModalOpen(true);
                }}
                className="px-3 py-1.5 bg-[#29b5e8] hover:bg-[#1fa0d0] text-slate-950 font-bold text-xs rounded-lg flex items-center gap-1.5"
              >
                <Terminal className="w-3.5 h-3.5" /> Open Full Terminal Modal
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button
                onClick={() => {
                  setCliInitialCommand('coco status');
                  setIsCliModalOpen(true);
                }}
                className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-left hover:border-[#29b5e8] transition group"
              >
                <div className="font-mono text-xs font-bold text-[#29b5e8] flex items-center justify-between">
                  <span>$ coco status</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Audit FastAPI & Snowflake readiness</p>
              </button>

              <button
                onClick={() => {
                  setCliInitialCommand('coco cortex --prompt "Summarize high-cost infrastructure projects"');
                  setIsCliModalOpen(true);
                }}
                className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-left hover:border-purple-400 transition group"
              >
                <div className="font-mono text-xs font-bold text-purple-400 flex items-center justify-between">
                  <span>$ coco cortex</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Execute Cortex LLM query</p>
              </button>

              <button
                onClick={() => {
                  setCliInitialCommand('coco audit');
                  setIsCliModalOpen(true);
                }}
                className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-left hover:border-emerald-400 transition group"
              >
                <div className="font-mono text-xs font-bold text-emerald-400 flex items-center justify-between">
                  <span>$ coco audit</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Generate automated audit report</p>
              </button>
            </div>

            {/* Pipeline Latency Console Output */}
            <div className="p-4 rounded-xl bg-black border border-slate-900 font-mono text-xs text-emerald-400 space-y-1 overflow-x-auto whitespace-pre-wrap break-all max-w-full">
              <div>[SYSTEM] Connected to Snowflake account (CIVIC_TRANSPARENCY_DB)...</div>
              <div>[SNOWPARK] Ingested {projects.length} Projects, 3 Budgets, 143 Incident Reports.</div>
              <div>[CORTEX] Vector index refreshed for llama3-70b.</div>
              <div>[STATUS] 200 OK - All pipeline services operational.</div>
            </div>
          </div>
        </div>
      )}

      {/* Post New Infrastructure Project Modal */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold">Post New Infrastructure Project</h3>
              </div>
              <button onClick={() => setShowNewProjectModal(false)} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold">Project Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Metro Manila Flood Control Station"
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold">Budget (PHP ₱)</label>
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    placeholder="350000000"
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold">Department</label>
                  <select
                    value={newDept}
                    onChange={(e) => setNewDept(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option value="Public Works & Engineering">Public Works (DPWH)</option>
                    <option value="Health & Sanitation">Health & Sanitation (DOH)</option>
                    <option value="Transportation & Traffic">Transportation (DOTr)</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 rounded-xl border border-neutral-200 dark:border-neutral-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Post Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Terminal Modal for CoCo CLI */}
      <CoCoTerminalModal
        isOpen={isCliModalOpen}
        onClose={() => setIsCliModalOpen(false)}
        initialCommand={cliInitialCommand}
      />
    </div>
  );
};
export default Dashboard;
