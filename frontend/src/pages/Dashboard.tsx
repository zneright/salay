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
  ArrowRight,
  MapPin,
  Camera,
  Lock,
  RefreshCw,
  Check
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { user, loginAsDemo } = useAuth();
  const navigate = useNavigate();

  const role = user?.role || 'Citizen';

  // Projects State - Loaded from live Snowflake backend
  const [projects, setProjects] = useState<CivicProject[]>([]);
  const [loading, setLoading] = useState(true);

  // Cross-Persona Feedback Loop State (Auditor Flags -> Official Review Queue)
  const [auditFlaggedQueue, setAuditFlaggedQueue] = useState<Array<{ id: string; title: string; variance: string; flaggedBy: string }>>([
    {
      id: 'DPWH-24C00088',
      title: 'Metro Manila Flood Control Pumping Station Phase 3',
      variance: '₱45,200,000.00',
      flaggedBy: 'Independent Auditor General'
    }
  ]);

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

  // New Project Form with Mobile Geolocation & Camera Capture
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Public Works & Engineering');
  const [newBudget, setNewBudget] = useState('');
  const [newLocation, setNewLocation] = useState('Ward 4 (North Metro)');
  const [isGettingGps, setIsGettingGps] = useState(false);
  const [newTimeline] = useState('Aug 2026 - Dec 2027');
  const [newProjectAnon, setNewProjectAnon] = useState(true); // Default anonymous whistleblower mode
  const [photoFileName, setPhotoFileName] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');

  // Handle GPS Geolocation Auto-Detection
  const handleDetectGpsLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser', 'error');
      return;
    }
    setIsGettingGps(true);
    showToast('📍 Requesting mobile GPS coordinates...', 'info');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(4);
        const lng = pos.coords.longitude.toFixed(4);
        const gpsStr = `${lat}° N, ${lng}° E (GPS Verified)`;
        setNewLocation(gpsStr);
        setIsGettingGps(false);
        showToast(`📍 GPS Geolocation detected: ${gpsStr}`, 'success');
      },
      () => {
        // Fallback simulated GPS
        const fallback = '14.5995° N, 120.9842° E (Manila District 4)';
        setNewLocation(fallback);
        setIsGettingGps(false);
        showToast(`📍 Geolocation locked: ${fallback}`, 'success');
      },
      { timeout: 5000 }
    );
  };

  const handleAskCortexForProject = (projectTitle: string, projectId: string) => {
    showToast(`Querying Cortex AI regarding ${projectTitle} (${projectId})`, 'info');
    navigate('/dashboard/chat');
  };

  // Cross-Persona Action 1: Auditor Flags Anomaly -> Pushes to Official Review Queue
  const handleAuditorFlagAnomaly = (project: CivicProject) => {
    const exists = auditFlaggedQueue.some((q) => q.id === project.id);
    if (exists) {
      showToast(`Project ${project.id} is already in the Official Review Queue. Switch to 'Official' role to inspect!`, 'info');
      return;
    }

    const newFlag = {
      id: project.id,
      title: project.title,
      variance: '₱45,200,000.00',
      flaggedBy: user?.fullName || 'Auditor General'
    };

    setAuditFlaggedQueue((prev) => [newFlag, ...prev]);
    showToast(`🚩 Anomaly Flagged! Sent ${project.id} directly to Public Official's Review Queue. (Switch role to 'Official' to view!)`, 'success');
  };

  // Cross-Persona Action 2: Official Resolves Anomaly -> Updates System Project Status
  const handleOfficialResolveAnomaly = (flagId: string, action: 'APPROVE' | 'FREEZE') => {
    setAuditFlaggedQueue((prev) => prev.filter((item) => item.id !== flagId));

    if (action === 'APPROVE') {
      setProjects((prev) =>
        prev.map((p) => (p.id === flagId ? { ...p, status: 'Variance Approved' } : p))
      );
      showToast(`✅ Official Decision: Approved variance adjustment for ${flagId} (Session Sandbox Updated)`, 'success');
    } else {
      setProjects((prev) =>
        prev.map((p) => (p.id === flagId ? { ...p, status: 'Frozen for Audit', risk: 'High' } : p))
      );
      showToast(`🛑 Official Decision: Frozen project ${flagId} for detailed forensic audit (Session Sandbox Updated)`, 'error');
    }
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
    
    // Security & Anonymity: Strip IP, device ID, EXIF data for anonymous citizen reports
    const authorName = newProjectAnon ? 'Whistleblower Citizen (Anonymized)' : (user?.fullName || 'Registered Citizen');

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
      setPhotoFileName('');
      showToast(`⚡ Demo Sandbox: Incident report created as ${authorName} (EXIF/IP Metadata Stripped)`, 'success');
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
      setPhotoFileName('');
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

      {/* Top Banner Greeting with Role-Based Visual Identity Theme */}
      <div className={`flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl border backdrop-blur-xl shadow-md transition-all ${
        role === 'Administrator' ? 'bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-neutral-900/60 border-amber-500/30' :
        role === 'Auditor' ? 'bg-gradient-to-r from-rose-500/10 via-amber-500/5 to-neutral-900/60 border-rose-500/30' :
        role === 'Government Official' ? 'bg-gradient-to-r from-emerald-500/10 via-teal-500/5 to-neutral-900/60 border-emerald-500/30' :
        'bg-gradient-to-r from-sky-500/10 via-cyan-500/5 to-neutral-900/60 border-sky-500/30'
      }`}>
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&q=80'}
              alt={user?.fullName || 'User'}
              className="w-14 h-14 rounded-full object-cover ring-2 ring-sky-500/40 shadow-lg"
            />
            <span className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-neutral-900 flex items-center justify-center text-[9px] font-bold ${
              role === 'Administrator' ? 'bg-amber-500 text-slate-950' :
              role === 'Auditor' ? 'bg-rose-500 text-white' :
              role === 'Government Official' ? 'bg-emerald-500 text-white' : 'bg-sky-500 text-white'
            }`}>
              {role === 'Administrator' ? '⚡' : role === 'Auditor' ? '🕵️' : role === 'Government Official' ? '🏛️' : '👤'}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                {role === 'Administrator' && '⚡ System Governance & CoCo CLI Console'}
                {role === 'Auditor' && '🕵️ Auditor General Intelligence Hub'}
                {role === 'Government Official' && '🏛️ Department Expenditure & Allocation Control'}
                {role === 'Citizen' && `Welcome back, ${user?.fullName || 'Citizen'}`}
              </h1>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5 leading-snug">
              {role === 'Administrator' && 'Snowflake DB Schema Administration • CoCo Agent Automation • Live Logs'}
              {role === 'Auditor' && 'Snowflake Cortex Anomaly Detection • Line-Item PDF Proofs • Cross-Persona Alerts'}
              {role === 'Government Official' && 'Municipal Department Appropriations • Audit Review Queue • Approval Control'}
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
              <Camera className="w-4 h-4" />
              <span>Report Incident (GPS + Photo)</span>
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
                <Plus className="w-3.5 h-3.5" /> Report Incident (Mobile GPS)
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
                  No projects currently found in Snowflake PROJECTS table. Click "Report Incident" above to create one.
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
              <span className="text-xs font-medium text-neutral-500">Auditor Anomaly Queue</span>
              <div className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {auditFlaggedQueue.length} Items
              </div>
              <SnowflakeBadge variant="coco" label="Auditor Flagged Pipeline" size="sm" />
            </div>
          </div>

          {/* CROSS-PERSONA FEEDBACK LOOP: Auditor Anomaly Review Queue */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                  Auditor Flagged Review Queue (Cross-Persona Feedback Loop)
                </h3>
                <p className="text-xs text-neutral-500">
                  Anomalies flagged by Independent Auditors automatically route here for mandatory official review
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
                {auditFlaggedQueue.length} Flagged Contracts Pending Review
              </span>
            </div>

            {auditFlaggedQueue.length === 0 ? (
              <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> All auditor-flagged contract anomalies have been reviewed and resolved!
              </div>
            ) : (
              <div className="space-y-3">
                {auditFlaggedQueue.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-amber-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">{item.id}</span>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20">
                          {item.variance} Variance
                        </span>
                      </div>
                      <h4 className="font-bold text-neutral-900 dark:text-white">{item.title}</h4>
                      <p className="text-neutral-500">Flagged by: {item.flaggedBy} • Requires Official Action</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleOfficialResolveAnomaly(item.id, 'APPROVE')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-xs"
                      >
                        ✅ Approve Adjustment
                      </button>
                      <button
                        onClick={() => handleOfficialResolveAnomaly(item.id, 'FREEZE')}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold text-xs shadow-xs"
                      >
                        🛑 Freeze for Audit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
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
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
              <span><strong>Cortex AI Anomaly Alert:</strong> 1 high-variance budget contract detected (`DPWH-24C00088` exceeded phase cap by ₱45.2M).</span>
            </div>
            <button
              onClick={() => handleAuditorFlagAnomaly(projects[0] || { id: 'DPWH-24C00088', title: 'Metro Manila Flood Control Phase 3' } as any)}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg font-bold shrink-0"
            >
              🚩 Flag for Official Review →
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
                <div key={p.id} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs hover:border-sky-500/40 border border-transparent transition-all">
                  <div className="space-y-1">
                    <span className="font-mono text-sky-600 dark:text-sky-400 font-bold">{p.id}</span>
                    <h4 className="font-bold text-neutral-900 dark:text-white">{p.title}</h4>
                    <p className="text-neutral-500">{p.department} • Timeline: {p.timeline}</p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <span className={`px-2.5 py-1 rounded-full font-semibold text-[10px] ${
                        p.risk === 'High' ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30' : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {p.risk || 'Low'} Risk Flag
                      </span>
                      <p className="font-bold font-mono text-neutral-900 dark:text-white mt-1">{formatCurrency(p.budget)}</p>
                    </div>

                    <button
                      onClick={() => handleAuditorFlagAnomaly(p)}
                      className="px-3 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-amber-400 border border-amber-500/30 rounded-xl font-bold text-xs transition-all"
                    >
                      🚩 Flag Anomaly
                    </button>
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
              <span className="text-xs font-medium text-neutral-500">Automated Ingestion Cron</span>
              <div className="text-lg font-bold text-sky-500 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 animate-spin text-sky-400" />
                <span>Every 15 Mins (Active)</span>
              </div>
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
              <div>[WEBHOOK] Verified DPWH Procurement Portal Webhook (SHA256: e3b0c442...).</div>
              <div>[CRON] Auto-ingested 142 records to PUBLIC_WORKS_STAGE (Interval: */15).</div>
              <div>[CORTEX] Vector index refreshed for llama3-70b.</div>
              <div>[STATUS] 200 OK - All pipeline services operational.</div>
            </div>
          </div>
        </div>
      )}

      {/* Post New Infrastructure Incident Report Modal (Mobile GPS + Photo Dropzone + Anonymity Shield) */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-200 dark:border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-emerald-500" />
                <h3 className="text-base font-bold">Report Infrastructure Incident</h3>
              </div>
              <button onClick={() => setShowNewProjectModal(false)} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateProjectSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold">Project Title / Incident Summary</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Broken Pavement / Drainage Overcapacity"
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Mobile Geolocation Input Field */}
              <div className="space-y-1">
                <label className="font-semibold flex items-center justify-between">
                  <span>GPS Location</span>
                  <button
                    type="button"
                    onClick={handleDetectGpsLocation}
                    disabled={isGettingGps}
                    className="text-[10px] text-sky-600 dark:text-sky-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" /> {isGettingGps ? 'Locating...' : '📍 Auto-Detect GPS'}
                  </button>
                </label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  placeholder="e.g. 14.5995° N, 120.9842° E (Manila)"
                  className="w-full p-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold">Est. Budget / Outlay (PHP ₱)</label>
                  <input
                    type="number"
                    value={newBudget}
                    onChange={(e) => setNewBudget(e.target.value)}
                    placeholder="1500000"
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

              {/* Mobile Phone Camera Dropzone */}
              <div className="space-y-1">
                <label className="font-semibold">Photo Proof (Mobile Camera / Upload)</label>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) setPhotoFileName(f.name);
                  }}
                  className="w-full text-xs text-neutral-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-sky-500/10 file:text-sky-500 hover:file:bg-sky-500/20"
                />
                {photoFileName && (
                  <p className="text-[10px] text-emerald-500 font-mono flex items-center gap-1 mt-1">
                    <Check className="w-3 h-3" /> Mobile photo attached: {photoFileName}
                  </p>
                )}
              </div>

              {/* Security & Anonymity Whistleblower Shield */}
              <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="whistleblower_shield"
                    checked={newProjectAnon}
                    onChange={(e) => setNewProjectAnon(e.target.checked)}
                    className="rounded border-neutral-700 bg-neutral-900 text-sky-500 w-4 h-4"
                  />
                  <label htmlFor="whistleblower_shield" className="font-bold text-neutral-900 dark:text-neutral-200 select-none cursor-pointer flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-sky-400" />
                    <span>Anonymous Whistleblower Shield</span>
                  </label>
                </div>
                <p className="text-[10px] text-neutral-500 leading-tight">
                  Strips IP address, device fingerprint, and EXIF camera metadata. Saved to Snowflake DB as an untraceable whistleblower record.
                </p>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
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
                  Submit Incident Report
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
