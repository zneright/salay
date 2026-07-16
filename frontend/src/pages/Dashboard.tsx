import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { 
  Briefcase, 
  DollarSign, 
  Activity, 
  MapPin,
  AlertTriangle,
  CheckCircle,
  Layers,
  Database,
  Search,
  ArrowRight,
  Plus
} from 'lucide-react';


interface CivicProject {
  id: string;
  title: string;
  department: string;
  budget: number;
  status: 'In Progress' | 'Planned' | 'Completed' | 'Delayed';
  location: string;
  timeline: string;
  progress: number;
  riskScore?: 'Low' | 'Medium' | 'High';
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Animation values
  const [totalSpent, setTotalSpent] = useState(0);
  const [projectsCount, setProjectsCount] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);

  const targetSpent = 33.2; // Million
  const targetCount = 12;

  useEffect(() => {
    // Count up spent
    const spentInterval = setInterval(() => {
      setTotalSpent((prev) => {
        if (prev >= targetSpent) {
          clearInterval(spentInterval);
          return targetSpent;
        }
        return parseFloat((prev + 1.2).toFixed(1));
      });
    }, 40);

    // Count up projects count
    const countInterval = setInterval(() => {
      setProjectsCount((prev) => {
        if (prev >= targetCount) {
          clearInterval(countInterval);
          return targetCount;
        }
        return prev + 1;
      });
    }, 60);

    // Slide progress bar
    setTimeout(() => {
      setProgressWidth(68);
    }, 150);

    return () => {
      clearInterval(spentInterval);
      clearInterval(countInterval);
    };
  }, []);

  const projects: CivicProject[] = [
    {
      id: 'PRJ-8812',
      title: 'Oakridge High School Solar Retrofit',
      department: 'Energy & Environment',
      budget: 1250000.00,
      status: 'In Progress',
      location: 'Ward 4 (North Metro)',
      timeline: 'Mar 2025 - Nov 2026',
      progress: 68,
      riskScore: 'Low'
    },
    {
      id: 'PRJ-1024',
      title: 'Metro Transit Line-C Bus Lane Expansion',
      department: 'Infrastructure & Transit',
      budget: 3400000.00,
      status: 'Completed',
      location: 'Downtown Core',
      timeline: 'Jan 2024 - Jun 2025',
      progress: 100,
      riskScore: 'Low'
    },
    {
      id: 'PRJ-9904',
      title: 'Maple Street Bridge Safety Reconstruction',
      department: 'Public Works & Engineering',
      budget: 4800000.00,
      status: 'Delayed',
      location: 'East Ward District',
      timeline: 'Sep 2024 - Dec 2026',
      progress: 42,
      riskScore: 'High'
    },
    {
      id: 'PRJ-7711',
      title: 'District 3 Smart Water Valve Integration',
      department: 'Utilities & Sanitation',
      budget: 850000.00,
      status: 'Planned',
      location: 'District 3 Subdivisions',
      timeline: 'Aug 2025 - Jun 2027',
      progress: 0,
      riskScore: 'Medium'
    }
  ];

  const recentFeedback = [
    { id: 'FB-902', name: 'Alfonso Cruz', desc: 'Flooded drainage along Oakridge Blvd', status: 'Pending', sentiment: 'Negative' },
    { id: 'FB-881', name: 'Maria Santos', desc: 'Pothole repaired quickly near Metro Park - Ty!', status: 'Resolved', sentiment: 'Positive' },
    { id: 'FB-760', name: 'Ariel Roxas', desc: 'Solar converter unit reports noise issues', status: 'Under Review', sentiment: 'Neutral' },
  ];

  // Helper status color classes
  const getStatusColor = (status: CivicProject['status']) => {
    switch (status) {
      case 'Completed': return 'text-emerald-400 bg-emerald-950/30 border-emerald-900';
      case 'In Progress': return 'text-blue-400 bg-blue-950/30 border-blue-900';
      case 'Delayed': return 'text-rose-400 bg-rose-950/30 border-rose-900';
      case 'Planned': return 'text-neutral-400 bg-neutral-900 border-neutral-800';
    }
  };

  const getRiskColor = (risk: CivicProject['riskScore']) => {
    switch (risk) {
      case 'High': return 'text-rose-400 bg-rose-950/20 border-rose-900';
      case 'Medium': return 'text-amber-400 bg-amber-955/20 border-amber-900';
      case 'Low': return 'text-emerald-400 bg-emerald-955/20 border-emerald-900';
      default: return 'text-neutral-400';
    }
  };

  // 1. CITIZEN DASHBOARD LAYOUT
  const renderCitizenDashboard = () => (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Visual greeting card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 border border-neutral-900 bg-neutral-950/45 p-6 rounded-xl space-y-4">
          <div className="space-y-1">
            <span className="text-[10px] text-neutral-500 font-mono tracking-wide uppercase">Cortex AI Assistant</span>
            <h3 className="text-sm font-bold text-neutral-200">How can I help you observe municipal spending?</h3>
            <p className="text-xs text-neutral-400">SALAY indexes public works schedules and complaints. Query records directly.</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard/chat')}
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold rounded transition-all active:scale-95 inline-flex items-center space-x-1.5"
          >
            <Search className="w-3.5 h-3.5" />
            <span>Launch AI Search</span>
          </button>
        </div>

        <div className="border border-neutral-900 bg-neutral-950/45 p-6 rounded-xl flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[9px] uppercase font-bold text-neutral-500 block">Citizen Action</span>
            <h3 className="text-xs font-bold text-neutral-200">Report Civic Incident</h3>
            <p className="text-[10px] text-neutral-400 leading-relaxed">Spotted a pothole or flooded road? Register complaints to alert auditors.</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard/feedback')}
            className="w-full mt-4 py-2 border border-neutral-800 hover:border-neutral-700 bg-neutral-900 rounded text-xs font-semibold text-neutral-350 hover:text-neutral-100 flex items-center justify-center space-x-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>File Incident Complaint</span>
          </button>
        </div>
      </div>

      {/* Projects Nearby List */}
      <div className="border border-neutral-900 bg-neutral-950/20 rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs uppercase font-bold text-neutral-400 tracking-wider">Public Works Projects in your Ward</h3>
          <span className="text-[9px] text-neutral-500 font-mono">Source: Snowflake Stages</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.slice(0, 2).map((item) => (
            <div key={item.id} className="p-4 border border-neutral-905 bg-neutral-950/70 rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-mono text-neutral-500">{item.id}</span>
                <span className={`text-[8px] font-bold border px-1.5 py-0.5 rounded ${getStatusColor(item.status)}`}>
                  {item.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-neutral-200">{item.title}</h4>
              <div className="flex items-center space-x-2 text-[10px] text-neutral-400">
                <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                <span>{item.location}</span>
              </div>
              <div className="space-y-1 pt-1.5 border-t border-neutral-900/60">
                <div className="flex justify-between text-[9px] text-neutral-500">
                  <span>Project progress</span>
                  <span>{item.progress}%</span>
                </div>
                <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-neutral-300 h-full transition-all duration-500" style={{ width: `${item.progress}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 2. GOVERNMENT OFFICIAL DASHBOARD LAYOUT
  const renderOfficialDashboard = () => (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Counters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-neutral-900 bg-neutral-950/45 p-5 rounded-xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-neutral-500 uppercase font-bold">Total Capital Budget</span>
            <DollarSign className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="text-xl font-bold text-neutral-100">$45.0M</div>
          <span className="text-[9px] text-neutral-500 block">Approved for Fiscal Year 2026</span>
        </div>

        <div className="border border-neutral-900 bg-neutral-950/45 p-5 rounded-xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-neutral-500 uppercase font-bold">Spent to Date</span>
            <DollarSign className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-xl font-bold text-emerald-400">${totalSpent}M</div>
          <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden mt-1">
            <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${progressWidth}%` }} />
          </div>
        </div>

        <div className="border border-neutral-900 bg-neutral-950/45 p-5 rounded-xl space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-neutral-500 uppercase font-bold">Monitored Projects</span>
            <Briefcase className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="text-xl font-bold text-neutral-100">{projectsCount} active</div>
          <span className="text-[9px] text-neutral-500 block">4 administrative divisions</span>
        </div>
      </div>

      {/* Projects overview lists */}
      <div className="border border-neutral-900 bg-neutral-950/20 rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs uppercase font-bold text-neutral-400 tracking-wider">Public Works Status Registry</h3>
          <button 
            onClick={() => navigate('/dashboard/analytics')}
            className="text-[10px] text-neutral-400 hover:text-neutral-200 flex items-center space-x-1"
          >
            <span>View Expenditure breakdown</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {projects.map((p) => (
            <div key={p.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3.5 border border-neutral-905 bg-neutral-950/60 rounded-lg gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-[9px] text-neutral-500">{p.id}</span>
                  <span className="font-bold text-neutral-200">{p.title}</span>
                </div>
                <div className="flex items-center space-x-2 text-[10px] text-neutral-500">
                  <span>{p.department}</span>
                  <span>•</span>
                  <span>{p.location}</span>
                </div>
              </div>
              <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-end shrink-0">
                <span className="font-bold text-neutral-300 font-mono">${(p.budget / 1000000).toFixed(2)}M</span>
                <span className={`text-[8px] font-bold border px-1.5 py-0.5 rounded ${getStatusColor(p.status)}`}>
                  {p.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Citizen Feedback Reports */}
      <div className="border border-neutral-900 bg-neutral-950/20 rounded-xl p-6 space-y-4">
        <h3 className="text-xs uppercase font-bold text-neutral-400 tracking-wider">Citizen Feedback Reports</h3>
        <div className="space-y-3">
          {recentFeedback.map((fb) => (
            <div key={fb.id} className="p-3 border border-neutral-905 bg-neutral-950/60 rounded-lg flex items-center justify-between text-xs">
              <div>
                <span className="font-mono text-[9px] text-neutral-500 mr-2">{fb.id}</span>
                <span className="text-neutral-250 font-semibold">{fb.desc}</span>
              </div>
              <span className={`text-[8px] font-bold border px-1.5 py-0.5 rounded ${
                fb.status === 'Resolved' ? 'text-emerald-450 bg-emerald-950/20 border-emerald-900' : 'text-amber-450 bg-amber-955/20 border-amber-900'
              }`}>
                {fb.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // 3. AUDITOR DASHBOARD LAYOUT
  const renderAuditorDashboard = () => (
    <div className="space-y-6 text-left animate-fade-in">
      {/* Risk flags */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-neutral-900 bg-neutral-950/45 p-6 rounded-xl space-y-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2 border border-rose-900/40 bg-rose-955/20 text-rose-500 rounded-lg">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs uppercase font-bold text-neutral-500">Timeline Risk Alerts</h3>
              <h4 className="text-sm font-bold text-neutral-200">1 Delayed Contract flagged</h4>
              <p className="text-[10px] text-neutral-400 leading-relaxed mt-1">
                Maple Street Bridge safety rebuilding (PRJ-9904) reports a timeline gap of 14 weeks. Contractor logs have been locked for audit check.
              </p>
            </div>
          </div>
        </div>

        <div className="border border-neutral-900 bg-neutral-950/45 p-6 rounded-xl space-y-4">
          <div className="flex items-start space-x-3.5">
            <div className="p-2 border border-emerald-900/40 bg-emerald-955/20 text-emerald-500 rounded-lg">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div className="space-y-0.5">
              <h3 className="text-xs uppercase font-bold text-neutral-500">Budget Variance Indexes</h3>
              <h4 className="text-sm font-bold text-neutral-200">Expenditures match thresholds</h4>
              <p className="text-[10px] text-neutral-400 leading-relaxed mt-1">
                Total spent values (${totalSpent}M) matches predicted targets margins. No budget deviations or unauthorized ledger changes flagged.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Audit Registry Table */}
      <div className="border border-neutral-900 bg-neutral-950/20 rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs uppercase font-bold text-neutral-400 tracking-wider">Contractor Risk Ratings</h3>
          <span className="text-[9px] text-neutral-500 font-mono">Snowflake Cortex Audited</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-neutral-300">
            <thead>
              <tr className="border-b border-neutral-900 text-left text-neutral-500 text-[9px] uppercase font-bold tracking-wider">
                <th className="pb-3">Project</th>
                <th className="pb-3">Contractor Scope</th>
                <th className="pb-3 text-right">Outlay Value</th>
                <th className="pb-3 text-center">Status</th>
                <th className="pb-3 text-right">Risk Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-900/60 font-medium">
              {projects.map((p) => (
                <tr key={p.id} className="hover:bg-neutral-900/25 transition-colors">
                  <td className="py-3.5">
                    <span className="font-mono text-[9px] text-neutral-500 block">{p.id}</span>
                    <span className="text-neutral-200 font-bold">{p.title.substring(0, 24)}...</span>
                  </td>
                  <td className="py-3.5 text-neutral-450">{p.department}</td>
                  <td className="py-3.5 text-right font-mono text-neutral-300">${(p.budget / 1000000).toFixed(2)}M</td>
                  <td className="py-3.5 text-center">
                    <span className={`text-[8px] font-bold border px-1.5 py-0.5 rounded ${getStatusColor(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <span className={`text-[8px] font-bold border px-1.5 py-0.5 rounded ${getRiskColor(p.riskScore)}`}>
                      {p.riskScore}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // 4. ADMINISTRATOR DASHBOARD LAYOUT
  const renderAdminDashboard = () => (
    <div className="space-y-6 text-left animate-fade-in">
      {/* System Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="border border-neutral-900 bg-neutral-950/45 p-5 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-neutral-500 uppercase font-bold">Cortex Latency Index</span>
            <Activity className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg font-bold">142ms</div>
          <span className="text-[9px] text-emerald-400 flex items-center space-x-1">
            <span>●</span> <span>Search APIs Operational</span>
          </span>
        </div>

        <div className="border border-neutral-900 bg-neutral-950/45 p-5 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-neutral-500 uppercase font-bold">Snowpark Engine</span>
            <Layers className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="text-lg font-bold">Idle</div>
          <span className="text-[9px] text-neutral-500">Last pipeline copy: 14m ago</span>
        </div>

        <div className="border border-neutral-900 bg-neutral-950/45 p-5 rounded-xl space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-neutral-500 uppercase font-bold">Snowflake Stage Space</span>
            <Database className="w-4 h-4 text-neutral-500" />
          </div>
          <div className="text-lg font-bold">2.4 GB / 10 GB</div>
          <span className="text-[9px] text-neutral-500">22 datasets structured</span>
        </div>
      </div>

      {/* System health logs registry mock */}
      <div className="border border-neutral-900 bg-neutral-950/20 rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs uppercase font-bold text-neutral-400 tracking-wider">Cortex AI Vector Status Logs</h3>
          <span className="text-[9px] text-neutral-550 font-mono">Engine Version: 1.0.2</span>
        </div>

        <div className="font-mono text-[9px] text-neutral-450 bg-neutral-905/30 border border-neutral-900 p-4 rounded-lg space-y-2">
          <div>{"[2026-07-16 18:54:12] INFO: Ingesting dataset stream budget_records_2025.csv..."}</div>
          <div>{"[2026-07-16 18:54:18] INFO: Snowflake Snowpark transformation pipeline executed (Duration: 5.4s)"}</div>
          <div>{"[2026-07-16 18:55:01] INFO: Cortex LLM vector indices compiled successfully (14,321 vectors)"}</div>
          <div className="text-emerald-400">{"[2026-07-16 18:57:38] INFO: Health status connection test returned 200 OK"}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {user?.role === 'Citizen' && renderCitizenDashboard()}
      {user?.role === 'Government Official' && renderOfficialDashboard()}
      {user?.role === 'Auditor' && renderAuditorDashboard()}
      {user?.role === 'Administrator' && renderAdminDashboard()}
    </div>
  );
};
export default Dashboard;
