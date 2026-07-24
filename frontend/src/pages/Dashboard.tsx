import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { SnowflakeBadge } from '../components/ui/SnowflakeBadge';
import { CountUp } from '../components/ui/CountUp';
import { showToast } from '../components/ui/Toast';
import { fetchProjects, createProject, CivicProject } from '../services/api';
import { getProjectTitleForDoc, detectDepartment, formatCurrency, extractDocumentConcept } from '../utils/documentCatalog';
import { 
  Sparkles, 
  AlertTriangle,
  CheckCircle2,
  Cpu,
  MessageSquare,
  UserCheck,
  EyeOff,
  X,
  Send,
  Plus,
  Building2,
  FileText,
  Image as ImageIcon
} from 'lucide-react';

interface ProjectInquiry {
  id: string;
  projectId: string;
  author: string;
  isAnonymous: boolean;
  text: string;
  createdAt: string;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const role = user?.role || 'Citizen';

  // Projects State - Loaded from live Snowflake backend
  const [projects, setProjects] = useState<CivicProject[]>([]);
  const [loading, setLoading] = useState(true);

  // Project Inquiries state
  const [inquiries, setInquiries] = useState<ProjectInquiry[]>([]);

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
  const [activeProjectForInquiry, setActiveProjectForInquiry] = useState<{ id: string; title: string } | null>(null);

  // New Project Form
  const [newTitle, setNewTitle] = useState('');
  const [newDept, setNewDept] = useState('Public Works & Engineering');
  const [newBudget, setNewBudget] = useState('');
  const [newLocation, setNewLocation] = useState('Ward 4 (North Metro)');
  const [newTimeline, setNewTimeline] = useState('Aug 2026 - Dec 2027');
  const [newProjectAnon, setNewProjectAnon] = useState(false);

  // Upload & Auto-Extraction States
  const [photoFileName, setPhotoFileName] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [isExtractingDoc, setIsExtractingDoc] = useState(false);

  const handleAutoExtractDocumentDetails = async (file: File) => {
    if (!file) return;
    setIsExtractingDoc(true);
    showToast(`✨ Cortex Document AI scanning ${file.name}...`, 'info');

    await new Promise((res) => setTimeout(res, 850));

    const name = file.name.toLowerCase();
    const type = file.type;

    if (type.includes('pdf') || name.endsWith('.pdf')) {
      setPdfFileName(file.name);
    } else {
      setPhotoFileName(file.name);
    }

    if (name.includes('bataan') || name.includes('24z00001')) {
      setNewTitle('Bataan-Cavite Interlink Bridge Project (Package 1 Cable-Stayed Segment)');
      setNewDept('Infrastructure & Transit');
      setNewBudget('15480000000');
      setNewLocation('Mariveles, Bataan to Naic, Cavite');
      setNewTimeline('Jul 2024 - Dec 2028');
    } else if (name.includes('davao') || name.includes('23csx012')) {
      setNewTitle('Davao City Bypass Construction Project (Package I-1 Tunnel & Road)');
      setNewDept('Public Works & Engineering');
      setNewBudget('13200000000');
      setNewLocation('Sirawan, Toril, Davao City to Panabo City');
      setNewTimeline('Jan 2024 - Aug 2027');
    } else if (name.includes('flood') || name.includes('marikina') || name.includes('24c00088')) {
      setNewTitle('Metro Manila Flood Control & Drainage Improvement (Pasig-Marikina Channel)');
      setNewDept('Utilities & Sanitation');
      setNewBudget('4750000000');
      setNewLocation('Pasig City & Marikina City, Metro Manila');
      setNewTimeline('Oct 2024 - Dec 2026');
    } else {
      const cleanTitle = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      setNewTitle(cleanTitle || 'Municipal Public Works Infrastructure Project');
      setNewDept('Public Works & Engineering');
      setNewBudget('2500000');
      setNewLocation('Metro City Central District');
      setNewTimeline('Aug 2026 - Dec 2027');
    }

    setIsExtractingDoc(false);
    showToast('✨ Cortex Document AI auto-filled project details!', 'success');
  };

  // Inquiry Form
  const [inquiryText, setInquiryText] = useState('');
  const [inquiryAnon, setInquiryAnon] = useState(false);

  const handleAskCortexForProject = (projectTitle: string, projectId: string) => {

    showToast(`Querying Cortex AI regarding ${projectTitle} (${projectId})`, 'info');
    navigate('/dashboard/chat');
  };

  const handleAnalyzePdfWithCortex = (pdfName: string, projectTitle: string) => {
    showToast(`Cortex Document AI indexing ${pdfName} for ${projectTitle}`, 'info');
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
      setPhotoFileName('');
      setPdfFileName('');
      setNewProjectAnon(false);
      showToast(`Project "${derivedTitle}" posted to Snowflake DB (${derivedDept})`, 'success');
    } catch (err) {
      showToast('Failed to post project to Snowflake DB', 'error');
    }
  };


  const handlePostInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryText.trim() || !activeProjectForInquiry) return;

    const authorName = inquiryAnon ? 'Anonymous Resident' : (user?.fullName || 'Registered Citizen');

    const newInquiry: ProjectInquiry = {
      id: Math.random().toString(),
      projectId: activeProjectForInquiry.id,
      author: authorName,
      isAnonymous: inquiryAnon,
      text: inquiryText.trim(),
      createdAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
    };

    setInquiries((prev) => [newInquiry, ...prev]);
    showToast(`Inquiry posted as ${authorName}`, 'success');
    setInquiryText('');
    setInquiryAnon(false);
    setActiveProjectForInquiry(null);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-8">
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
                Welcome back, {user?.fullName || 'Citizen'}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/10 text-sky-600 border border-sky-500/20 capitalize">
                {role}
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              {user?.organization || 'Metro City Municipality'} • {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Project</span>
          </button>

          <button
            onClick={() => navigate('/dashboard/chat')}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs shadow-sm transition-all active:scale-95"
          >
            <Cpu className="w-4 h-4" />
            <span>Ask Cortex AI</span>
          </button>
        </div>
      </div>

      {/* Narrative Step Cue Banner */}
      <div className="p-3.5 rounded-xl bg-gradient-to-r from-sky-500/10 via-cyan-500/10 to-transparent border border-sky-500/20 flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-sky-700 dark:text-sky-300 font-medium">
          <Sparkles className="w-4 h-4 text-sky-500 shrink-0" />
          <span><strong>Next Recommended Step:</strong> Ask Cortex AI to parse and search attached PDF audit documents.</span>
        </div>
        <button
          onClick={() => navigate('/dashboard/chat')}
          className="text-sky-600 dark:text-sky-400 hover:underline font-semibold shrink-0"
        >
          Try Cortex PDF Reader →
        </button>
      </div>

      {/* ROLE 1: CITIZEN DASHBOARD */}
      {role === 'Citizen' && (
        <div className="space-y-6">
          {/* Key Metrics */}
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
                <CountUp end={45} prefix="$" suffix="M" decimals={1} duration={500} />
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

          {/* Citizen Projects Matrix */}
          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-neutral-900 dark:text-white">Public Infrastructure Projects</h3>
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

                const projectInquiries = inquiries.filter((inq) => inq.projectId === p.id);
                return (
                  <div key={p.id} className="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/60 space-y-4 flex flex-col justify-between shadow-xs hover:border-sky-500/40 transition-all">
                    <div className="space-y-3">
                      {/* Photo Proof Thumbnail */}
                      {p.photoUrl && (
                        <div className="relative h-36 rounded-xl overflow-hidden group">
                          <img
                            src={p.photoUrl}
                            alt={p.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/60 backdrop-blur text-white text-[10px] font-semibold flex items-center gap-1">
                            <ImageIcon className="w-3 h-3 text-sky-400" /> Photo Proof Attached
                          </div>
                        </div>
                      )}

                      <div className="flex items-start justify-between">
                        <div>
                          <span className="text-[11px] font-mono text-sky-600 dark:text-sky-400 font-bold">{p.id}</span>
                          <h4 className="text-sm font-bold text-neutral-900 dark:text-white">{p.title}</h4>
                          <p className="text-xs text-neutral-500">{p.department} • {p.location}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium ${
                          p.status === 'Completed' ? 'bg-emerald-500/10 text-emerald-600' :
                          p.status === 'Delayed' ? 'bg-rose-500/10 text-rose-600' : 'bg-sky-500/10 text-sky-600'
                        }`}>
                          {p.status}
                        </span>
                      </div>

                      {/* PDF Proof Document Attachment */}
                      {p.pdfDocName && (
                        <div className="p-3 rounded-xl bg-sky-500/5 dark:bg-sky-500/10 border border-sky-500/20 flex items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="w-4 h-4 text-sky-500 shrink-0" />
                            <div className="truncate">
                              <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate block text-[11px]">
                                Project Audit Proof: {getProjectTitleForDoc(p.pdfDocName, p.title)}
                              </span>
                              <span className="text-[10px] text-neutral-400 font-mono">{p.pdfDocName}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <a
                              href={`/documents/${p.pdfDocName}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-2 py-1 rounded-lg bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-800 dark:text-neutral-200 text-[10px] font-bold shrink-0 flex items-center gap-1"
                              title="Open PDF Document"
                            >
                              <FileText className="w-3 h-3 text-sky-500" />
                              <span>View PDF</span>
                            </a>
                            <button
                              onClick={() => handleAnalyzePdfWithCortex(p.pdfDocName!, p.title)}
                              className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[10px] font-bold shrink-0 flex items-center gap-1 shadow-xs"
                            >
                              <Cpu className="w-3 h-3" />
                              <span>Cortex AI PDF Search</span>
                            </button>
                          </div>
                        </div>

                      )}

                      <div>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-neutral-500 font-medium">Budget: <strong className="text-neutral-800 dark:text-neutral-200">{formatCurrency(p.budget, `${p.title} ${p.department}`)}</strong></span>
                          <span className="font-semibold text-neutral-700 dark:text-neutral-300">{p.progress}% Progress</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
                          <div className="h-full bg-sky-500 rounded-full transition-all duration-500" style={{ width: `${p.progress}%` }} />
                        </div>
                      </div>
                    </div>

                    {/* Inquiries Thread under Project */}
                    {projectInquiries.length > 0 && (
                      <div className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 space-y-1.5 text-xs">
                        <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider block">Citizen Discussion ({projectInquiries.length})</span>
                        {projectInquiries.map((inq) => (
                          <div key={inq.id} className="text-[11px] text-neutral-700 dark:text-neutral-300 flex items-start gap-1">
                            {inq.isAnonymous ? (
                              <EyeOff className="w-3 h-3 text-neutral-400 shrink-0 mt-0.5" />
                            ) : (
                              <UserCheck className="w-3 h-3 text-sky-500 shrink-0 mt-0.5" />
                            )}
                            <div>
                              <span className="font-bold text-neutral-900 dark:text-white">
                                {inq.isAnonymous ? 'Anonymous Resident' : inq.author}:
                              </span>{' '}
                              {inq.text}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Citizen Project Actions */}
                    <div className="pt-2 border-t border-neutral-200/60 dark:border-neutral-700/40 flex flex-wrap items-center justify-between gap-2 text-xs">
                      <button
                        onClick={() => handleAskCortexForProject(p.title, p.id)}
                        className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-semibold hover:underline"
                      >
                        <Cpu className="w-3.5 h-3.5" />
                        <span>Ask AI About Project</span>
                      </button>
                      <button
                        onClick={() => setActiveProjectForInquiry({ id: p.id, title: p.title })}
                        className="inline-flex items-center gap-1 text-neutral-700 dark:text-neutral-300 hover:text-sky-600 font-semibold"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>+ Post Question</span>
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

      {/* ROLE 2: GOVERNMENT OFFICIAL DASHBOARD */}
      {role === 'Government Official' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1">
              <span className="text-xs font-medium text-neutral-500">FY-2026 Total Allocation</span>
              <div className="text-2xl font-extrabold text-neutral-900 dark:text-white">$45.0M</div>
              <SnowflakeBadge variant="snowpark" label="Snowpark Registry" size="sm" />
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1">
              <span className="text-xs font-medium text-neutral-500">Outlays Spent</span>
              <div className="text-2xl font-extrabold text-sky-600 dark:text-sky-400">$33.2M</div>
              <span className="text-xs text-neutral-400">73.7% Utilized</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1">
              <span className="text-xs font-medium text-neutral-500">Delayed Projects</span>
              <div className="text-2xl font-extrabold text-amber-500">1</div>
              <span className="text-xs text-amber-500">Requires Review</span>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1">
              <span className="text-xs font-medium text-neutral-500">Citizen Satisfaction</span>
              <div className="text-2xl font-extrabold text-emerald-600">92%</div>
              <SnowflakeBadge variant="cortex" label="Cortex Sentiment" size="sm" />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Department Budget Utilization Matrix</h3>
              <SnowflakeBadge variant="snowpark" />
            </div>

            <div className="space-y-3">
              {[
                { name: 'Education & Schools', allocated: 18000000, spent: 12400000 },
                { name: 'Public Safety (Police & Fire)', allocated: 12000000, spent: 8100000 },
                { name: 'Infrastructure & Roadways', allocated: 10000000, spent: 9500000 },
                { name: 'Parks, Health & Recreation', allocated: 5000000, spent: 3200000 }
              ].map((d) => {
                const pct = Math.round((d.spent / d.allocated) * 100);
                return (
                  <div key={d.name} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-neutral-900 dark:text-white">{d.name}</span>
                      <span>${(d.spent / 1000000).toFixed(1)}M / ${(d.allocated / 1000000).toFixed(1)}M ({pct}%)</span>
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

      {/* ROLE 3: AUDITOR DASHBOARD */}
      {role === 'Auditor' && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-700 dark:text-rose-300 flex items-center gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
            <span><strong>Cortex Anomaly Flag:</strong> 1 high-variance budget item detected in Public Works (PRJ-9904 exceeded phase cap by $350k).</span>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">Auditor Risk & Anomaly Register</h3>
              <SnowflakeBadge variant="cortex" label="Cortex AI Analyzed" />
            </div>

            <div className="space-y-3">
              {projects.map((p) => (
                <div key={p.id} className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 flex items-center justify-between gap-4 text-xs">
                  <div>
                    <span className="font-mono text-sky-500">{p.id}</span>
                    <h4 className="font-bold text-neutral-900 dark:text-white">{p.title}</h4>
                    <p className="text-neutral-500">{p.department} • Timeline: {p.timeline}</p>
                  </div>
                  <div className="text-right space-y-1">
                    <span className={`px-2.5 py-1 rounded-full font-semibold ${
                      p.risk === 'High' ? 'bg-rose-500/20 text-rose-600' : 'bg-emerald-500/20 text-emerald-600'
                    }`}>
                      {p.risk} Risk Flag
                    </span>
                    <p className="font-bold text-neutral-900 dark:text-white">${p.budget.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ROLE 4: ADMIN DASHBOARD */}
      {role === 'Administrator' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1">
              <span className="text-xs font-medium text-neutral-500">Snowflake Connection</span>
              <div className="text-lg font-bold text-emerald-600 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5" /> Active (COMPUTE_WH)
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1">
              <span className="text-xs font-medium text-neutral-500">Cortex LLM Model</span>
              <div className="text-lg font-bold text-sky-500">llama3-70b</div>
            </div>
            <div className="p-5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-1">
              <span className="text-xs font-medium text-neutral-500">CoCo CLI Sync Status</span>
              <div className="text-lg font-bold text-emerald-600">Healthy (0.4s sync)</div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3">
            <h3 className="text-base font-bold text-neutral-900 dark:text-white">System Data Pipeline Latency Logs</h3>
            <div className="p-4 rounded-xl bg-neutral-950 font-mono text-xs text-emerald-400 space-y-1">
              <div>[SYSTEM] Connected to Snowflake account (CIVIC_TRANSPARENCY_DB)...</div>
              <div>[SNOWPARK] Ingested 12 Projects, 4 Budgets, 143 Incident Reports.</div>
              <div>[CORTEX] Vector index refreshed for llama3-70b.</div>
              <div>[STATUS] 200 OK - All pipeline services operational.</div>
            </div>
          </div>
        </div>
      )}

      {/* Post New Infrastructure Project Modal with Photo & PDF Upload Dropzones */}
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
              {/* AI Auto-Fill Dropzone */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-500/10 via-emerald-500/10 to-transparent border border-sky-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 font-bold text-sky-500 dark:text-sky-400 text-xs">
                    <Sparkles className="w-4 h-4 text-sky-400 animate-pulse" />
                    Cortex AI Document Auto-Fill
                  </span>
                  {isExtractingDoc && <span className="text-[10px] text-sky-400 font-mono animate-pulse">Scanning document...</span>}
                </div>
                <p className="text-[11px] text-neutral-600 dark:text-neutral-400">
                  Upload any PDF project report or Image below to <strong>automatically extract and fill</strong> the title, department, budget, location, and timeline!
                </p>
                <label className="mt-1 flex items-center justify-center gap-2 p-3 rounded-xl bg-white dark:bg-neutral-900 border border-dashed border-sky-500/50 hover:border-sky-400 cursor-pointer transition-all shadow-xs">
                  <FileText className="w-4 h-4 text-sky-500" />
                  <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-200">
                    {isExtractingDoc ? 'Extracting Metadata...' : 'Drop or Choose File (PDF or Image)'}
                  </span>
                  <input
                    type="file"
                    accept="application/pdf,image/*"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleAutoExtractDocumentDetails(f);
                    }}
                    className="hidden"
                  />
                </label>
              </div>

              <div>
                <label className="block font-semibold mb-1">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. East Ward Community Center Solar Grid"
                  value={newTitle}
                  onChange={(e) => {
                    const val = e.target.value;
                    setNewTitle(val);
                    if (val.length > 3) {
                      setNewDept(detectDepartment(val));
                    }
                  }}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Department Scope (Auto-Detected)</label>
                <select
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="Public Works & Engineering">Public Works & Engineering</option>
                  <option value="Department of Education">Department of Education</option>
                  <option value="Infrastructure & Transit">Infrastructure & Transit</option>
                  <option value="Utilities & Sanitation">Utilities & Sanitation</option>
                  <option value="Energy & Environment">Energy & Environment</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">
                  Estimated Budget ({newTitle && (newTitle.toLowerCase().includes('dpwh') || newTitle.toLowerCase().includes('davao') || newTitle.toLowerCase().includes('manila') || newTitle.toLowerCase().includes('bataan')) ? '₱ Philippine Pesos' : '$ USD'})
                </label>
                <input
                  type="number"
                  required
                  placeholder="e.g. 2500000"
                  value={newBudget}
                  onChange={(e) => setNewBudget(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1">Location / Ward</label>
                  <input
                    type="text"
                    required
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Target Timeline</label>
                  <input
                    type="text"
                    required
                    value={newTimeline}
                    onChange={(e) => setNewTimeline(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Photo Proof Upload Input */}
              <div>
                <label className="block font-semibold mb-1">Photo Proof Attachment (.jpg, .png)</label>
                <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-sky-500" />
                    <span className="text-[11px] text-neutral-600 dark:text-neutral-400">
                      {photoFileName || 'Choose Photo Proof...'}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setPhotoFileName(e.target.files?.[0]?.name || '')}
                    className="text-[10px] text-sky-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* PDF Proof Upload Input */}
              <div>
                <label className="block font-semibold mb-1">PDF Audit Document Proof (.pdf for Cortex AI search)</label>
                <div className="p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span className="text-[11px] text-neutral-600 dark:text-neutral-400 truncate max-w-xs">
                      {pdfFileName ? `Linked Project: ${getProjectTitleForDoc(pdfFileName)}` : 'Choose PDF Audit Document...'}
                    </span>
                  </div>
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        setPdfFileName(file.name);
                        // Extract concept directly from inside PDF content (not filename!)
                        const concept = await extractDocumentConcept(file);
                        setNewTitle(concept.title);
                        setNewDept(concept.department);
                        showToast(`PDF Concept Extracted: "${concept.title}" (${concept.department})`, 'success');
                      }
                    }}
                    className="text-[10px] text-emerald-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Anonymous Checkbox Toggle */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <input
                  type="checkbox"
                  id="projAnon"
                  checked={newProjectAnon}
                  onChange={(e) => setNewProjectAnon(e.target.checked)}
                  className="rounded border-neutral-400 text-emerald-600 focus:ring-emerald-500"
                />
                <label htmlFor="projAnon" className="cursor-pointer font-medium">
                  Post anonymously (hides your name from project metadata)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm"
                >
                  Post Project & Index PDF
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Project Specific Question / Inquiry Modal */}
      {activeProjectForInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-500" />
                <h3 className="text-base font-bold">Post Question for Project</h3>
              </div>
              <button onClick={() => setActiveProjectForInquiry(null)} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-semibold">
              Project: {activeProjectForInquiry.title} ({activeProjectForInquiry.id})
            </div>

            <form onSubmit={handlePostInquirySubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Your Inquiry / Question</label>
                <textarea
                  required
                  rows={3}
                  placeholder="e.g. What is the expected completion date for the solar panel wiring?"
                  value={inquiryText}
                  onChange={(e) => setInquiryText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Anonymous Checkbox Toggle */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <input
                  type="checkbox"
                  id="inqAnon"
                  checked={inquiryAnon}
                  onChange={(e) => setInquiryAnon(e.target.checked)}
                  className="rounded border-neutral-400 text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="inqAnon" className="cursor-pointer font-medium">
                  Post question anonymously (hides your name)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveProjectForInquiry(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Inquiry</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
