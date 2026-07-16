import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../providers/AuthProvider';
import { 
  MapPin,
  Database,
  Search,
  ArrowRight,
  Plus,
  Sparkles,
  Bell,
  ChevronRight
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

  // Helper status color classes
  const getStatusColor = (status: CivicProject['status']) => {
    switch (status) {
      case 'Completed': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'In Progress': return 'text-primary bg-primary/10 border-primary/20';
      case 'Delayed': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Planned': return 'text-muted-foreground bg-muted border-border';
    }
  };

  const getRiskColor = (risk: CivicProject['riskScore']) => {
    switch (risk) {
      case 'High': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Low': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-muted-foreground';
    }
  };

  // Roles specific properties mapping
  const roleMetadata = {
    Citizen: {
      mission: 'Review local infrastructure projects progress in Ward 4 and submit feedback complaints directly to the council.',
      actionLabel: 'Report Civic Incident',
      actionRoute: '/dashboard/feedback',
      actionIcon: Plus,
      aiSummary: 'Cortex AI found 12 infrastructure projects. 1 project is currently flagged as delayed in your district.'
    },
    'Government Official': {
      mission: 'Oversee spending profiles, examine departmental charts, and inspect public works delay statistics.',
      actionLabel: 'Review Expenditures',
      actionRoute: '/dashboard/analytics',
      actionIcon: ArrowRight,
      aiSummary: 'Cortex found two municipal projects exceeding phase budget allocations by 12%. Variance review recommended.'
    },
    Auditor: {
      mission: 'Conduct strict timeline analyses on contractors, verify budget variances, and audit risk indicator models.',
      actionLabel: 'Audit Project Delays',
      actionRoute: '/dashboard/analytics',
      actionIcon: Search,
      aiSummary: 'Cortex flagged PRJ-9904 (Maple Street Bridge) with high-risk variance. Timeline lag represents 14 weeks.'
    },
    Administrator: {
      mission: 'Oversee Cortex model indices parameters, manage setup logs, check engine latency parameters.',
      actionLabel: 'Configure System Settings',
      actionRoute: '/dashboard/settings',
      actionIcon: ArrowRight,
      aiSummary: 'Cortex vector indices are fully synched. Latency average is 142ms. Snowflake connection status is healthy.'
    }
  };

  const currentMeta = roleMetadata[user?.role as keyof typeof roleMetadata] || roleMetadata.Citizen;

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* Header story title */}
      <div>
        <h1 className="text-[40px] font-bold tracking-tight text-foreground leading-none">Today's Overview</h1>
        <p className="text-[13px] text-muted-foreground mt-2">
          Real-time municipal performance stats ingested from Snowflake stages.
        </p>
      </div>

      {/* Main Grid: Three Columns on Desktop, Single Column on Mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: GREETING & MISSION GUIDES (3/12 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Persona Greeting Card */}
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center space-x-3.5">
              <img 
                src={user?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80'}
                alt={user?.fullName || 'User Avatar'} 
                className="w-12 h-12 rounded-full border border-border shrink-0"
              />
              <div className="leading-tight">
                <h4 className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">{user?.role}</h4>
                <h3 className="text-base font-bold text-foreground truncate max-w-[140px]">{user?.fullName}</h3>
              </div>
            </div>
            <div className="text-[13px] text-muted-foreground pt-3 border-t border-border/60">
              <span className="block font-medium">{user?.organization}</span>
              <span className="block text-[11px] text-muted-foreground/80 mt-0.5">Tuesday, July 17</span>
            </div>
          </div>

          {/* Today's Mission Card */}
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4">
            <span className="text-[10px] uppercase font-bold text-primary font-mono tracking-wider block">Today's Mission</span>
            <p className="text-[13px] text-muted-foreground leading-relaxed">
              {currentMeta.mission}
            </p>
            <button
              onClick={() => navigate(currentMeta.actionRoute)}
              className="w-full py-2 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold rounded-lg transition-all active:scale-[0.98] flex items-center justify-center space-x-1.5"
            >
              <span>{currentMeta.actionLabel}</span>
              <ChevronRight className="w-3.5 h-3.5 animate-pulse" />
            </button>
          </div>

          {/* Snowflake Cortex AI Summary Insight Card */}
          <div className="bg-card border border-border/80 p-5 rounded-2xl shadow-sm space-y-4 relative overflow-hidden">
            {/* Background subtle glow */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none" />
            
            <div className="flex items-center space-x-2 text-[10px] text-primary font-bold font-mono tracking-wider">
              <Sparkles className="w-4 h-4 text-primary" />
              <span>✨ Cortex AI Summary</span>
            </div>
            <p className="text-[13px] text-muted-foreground leading-relaxed italic">
              "{currentMeta.aiSummary}"
            </p>
            <button 
              onClick={() => navigate('/dashboard/chat')}
              className="text-[11px] font-bold text-primary hover:text-primary/80 transition-colors flex items-center space-x-1"
            >
              <span>Ask Follow-up</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CENTER COLUMN: METRICS & WORK LISTS (6/12 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Metrics Grid */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-card border border-border p-4.5 rounded-2xl shadow-sm text-left">
              <div className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Projects</div>
              <div className="text-2xl font-bold text-foreground mt-1.5">{projectsCount}</div>
              <span className="text-[10px] text-muted-foreground/80 block mt-0.5">Active stages</span>
            </div>
            <div className="bg-card border border-border p-4.5 rounded-2xl shadow-sm text-left">
              <div className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Spent</div>
              <div className="text-2xl font-bold text-foreground mt-1.5">${totalSpent}M</div>
              <div className="w-full bg-secondary h-1 rounded-full overflow-hidden mt-2">
                <div className="bg-primary h-full transition-all duration-300" style={{ width: `${progressWidth}%` }} />
              </div>
            </div>
            <div className="bg-card border border-border p-4.5 rounded-2xl shadow-sm text-left">
              <div className="text-[11px] text-muted-foreground font-semibold uppercase tracking-wider">Reports</div>
              <div className="text-2xl font-bold text-foreground mt-1.5">143</div>
              <span className="text-[10px] text-emerald-500 font-bold block mt-0.5">Sync Live</span>
            </div>
          </div>

          {/* Active Data Lists Card based on persona */}
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-border/60">
              <h3 className="text-base font-bold text-foreground">
                {user?.role === 'Citizen' ? 'Municipal Projects Nearby' : 
                 user?.role === 'Auditor' ? 'Auditor Risk Registries' :
                 user?.role === 'Administrator' ? 'FastAPI System Engine Logs' :
                 'Public Works Status Registry'}
              </h3>
              <span className="text-[10px] text-muted-foreground font-mono bg-secondary px-2.5 py-0.5 rounded border border-border">
                {user?.role === 'Citizen' ? 'Ward 4' : 'Snowflake Stages'}
              </span>
            </div>

            {/* List renders */}
            {user?.role === 'Administrator' ? (
              <div className="font-mono text-[10px] text-muted-foreground bg-secondary/60 p-4 border border-border rounded-xl space-y-2">
                <div>{"[03:07:12] INFO: Ingesting dataset stream budget_records_2025.csv..."}</div>
                <div>{"[03:07:18] INFO: Snowflake transformation pipeline executed (Duration: 5.4s)"}</div>
                <div>{"[03:07:44] INFO: Cortex LLM vector indices compiled successfully (14,321 vectors)"}</div>
                <div className="text-emerald-500">{"[03:07:59] INFO: Health status connection test returned 200 OK"}</div>
              </div>
            ) : user?.role === 'Auditor' ? (
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-foreground">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground text-[10px] font-bold tracking-wider">
                      <th className="pb-3 font-semibold">Project</th>
                      <th className="pb-3 text-right font-semibold">Budget</th>
                      <th className="pb-3 text-center font-semibold">Status</th>
                      <th className="pb-3 text-right font-semibold">Risk Rating</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/40 font-medium">
                    {projects.map((p) => (
                      <tr key={p.id} className="hover:bg-secondary/40 transition-colors">
                        <td className="py-3.5">
                          <span className="font-mono text-[9px] text-muted-foreground block">{p.id}</span>
                          <span className="font-bold text-foreground">{p.title.substring(0, 20)}...</span>
                        </td>
                        <td className="py-3.5 text-right font-mono text-muted-foreground">${(p.budget / 1000000).toFixed(2)}M</td>
                        <td className="py-3.5 text-center">
                          <span className={`text-[8px] font-bold border px-1.5 py-0.5 rounded-full ${getStatusColor(p.status)}`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="py-3.5 text-right">
                          <span className={`text-[8px] font-bold border px-1.5 py-0.5 rounded-full ${getRiskColor(p.riskScore)}`}>
                            {p.riskScore}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="space-y-3">
                {projects.map((item) => (
                  <div 
                    key={item.id} 
                    className="p-4 border border-border bg-card/65 rounded-xl space-y-3 hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-mono text-muted-foreground">{item.id}</span>
                      <span className={`text-[8px] font-bold border px-1.5 py-0.5 rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-foreground">{item.title}</h4>
                    <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{item.location}</span>
                    </div>
                    <div className="space-y-1.5 pt-2 border-t border-border/60">
                      <div className="flex justify-between text-[10px] text-muted-foreground">
                        <span>Project progress</span>
                        <span>{item.progress}%</span>
                      </div>
                      <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                        <div className="bg-primary h-full transition-all duration-300" style={{ width: `${item.progress}%` }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: NOTIFICATIONS & TIMELINE (3/12 cols) */}
        <div className="lg:col-span-3 space-y-6">
          {/* Notifications List */}
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold text-primary font-mono tracking-wider flex items-center space-x-1">
                <Bell className="w-3.5 h-3.5 text-primary" />
                <span>Alerts Feed</span>
              </span>
              <span className="w-1.5 h-1.5 bg-primary rounded-full animate-ping" />
            </div>

            <div className="space-y-3.5 text-xs text-left">
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>Complaint filed</span>
                  <span>10m ago</span>
                </div>
                <p className="text-foreground font-semibold leading-relaxed">
                  TCK-2201 Ticket filed regarding transit timing blocks in Ward 4.
                </p>
              </div>

              <div className="space-y-1 border-t border-border/40 pt-3">
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>Budget Exceeded</span>
                  <span>2h ago</span>
                </div>
                <p className="text-foreground font-semibold leading-relaxed">
                  PRJ-9904 Reconstruction phase expenditures variance flagged.
                </p>
              </div>

              <div className="space-y-1 border-t border-border/40 pt-3">
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                  <span>Engine transformation</span>
                  <span>3h ago</span>
                </div>
                <p className="text-foreground font-semibold leading-relaxed">
                  Snowflake Snowpark transformed 22 project datasets successfully.
                </p>
              </div>
            </div>
          </div>

          {/* Dataset Status & Snowflake Stage badge Card */}
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4">
            <span className="text-[10px] uppercase font-bold text-primary font-mono tracking-wider flex items-center space-x-1">
              <Database className="w-3.5 h-3.5 text-primary" />
              <span>Snowflake Data Stages</span>
            </span>

            <div className="space-y-3 text-xs font-semibold text-left">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Budget CSVs</span>
                <span className="text-foreground font-mono">4 files</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Projects CSVs</span>
                <span className="text-foreground font-mono">12 files</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Complaints CSVs</span>
                <span className="text-foreground font-mono">143 entries</span>
              </div>
              <div className="flex justify-between items-center pt-2.5 border-t border-border/60">
                <span className="text-muted-foreground">Cortex API</span>
                <span className="text-emerald-500 flex items-center space-x-1 font-bold">
                  <span>●</span> <span>Operational</span>
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
export default Dashboard;
