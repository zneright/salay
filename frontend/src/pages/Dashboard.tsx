import React from 'react';
import { 
  Briefcase, 
  DollarSign, 
  Activity, 
  MapPin,
  Calendar,
  Layers
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
}

export const Dashboard: React.FC = () => {
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
    },
    {
      id: 'PRJ-7711',
      title: 'District 3 Smart Water Valve Integration',
      department: 'Utilities & Sanitation',
      budget: 850000.00,
      status: 'Planned',
      location: 'District 3 Subdivisions',
      timeline: 'Aug 2026 - Mar 2027',
      progress: 0,
    }
  ];

  const statusColors = {
    'In Progress': 'text-amber-400 bg-amber-950/30 border-amber-900',
    'Completed': 'text-emerald-400 bg-emerald-950/30 border-emerald-900',
    'Delayed': 'text-rose-400 bg-rose-950/30 border-rose-900',
    'Planned': 'text-neutral-400 bg-neutral-900 border-neutral-800',
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold tracking-tight">Public Works Projects</h1>
        <p className="text-xs text-neutral-400 mt-1">
          Monitor public infrastructure expenditures and project status updates.
        </p>
      </div>

      {/* Analytics Summary Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Active Projects', value: '3', icon: Activity, change: '+1 this month' },
          { label: 'Total Allocated Budget', value: '$10.3M', icon: DollarSign, change: '100% transparency checked' },
          { label: 'Infrastructure Scope', value: '4 Districts', icon: Layers, change: 'Metro City Area' },
          { label: 'Completed Works', value: '1', icon: Briefcase, change: 'Voted on in 2024' }
        ].map((card, idx) => {
          const Icon = card.icon;
          return (
            <div key={idx} className="bg-neutral-950 border border-neutral-900 rounded-lg p-5 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase font-bold tracking-wider text-neutral-500">{card.label}</span>
                <Icon className="w-4 h-4 text-neutral-400" />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold tracking-tight">{card.value}</h3>
                <p className="text-[10px] text-neutral-400">{card.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Projects List Card */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-sm font-bold tracking-tight text-neutral-200">Municipal Project Index</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {projects.map((project) => (
            <div 
              key={project.id} 
              className="bg-neutral-950/60 border border-neutral-900 hover:border-neutral-800 transition-all rounded-lg p-5 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between space-x-2">
                  <span className="text-[10px] font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 border border-neutral-800 rounded">
                    {project.id}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 border rounded-full ${statusColors[project.status]}`}>
                    {project.status}
                  </span>
                </div>
                <h3 className="text-sm font-semibold tracking-tight leading-snug">{project.title}</h3>
                <p className="text-[11px] text-neutral-400">{project.department}</p>
              </div>

              {/* Progress Slider Mock */}
              {project.status !== 'Planned' && (
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[10px]">
                    <span className="text-neutral-500">Progress</span>
                    <span className="text-neutral-300 font-semibold">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden border border-neutral-800/40">
                    <div 
                      className="bg-neutral-300 h-full rounded-full transition-all duration-300"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Footer specs */}
              <div className="flex justify-between items-center pt-2 border-t border-neutral-900/60 text-[10px] text-neutral-400">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{project.location}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{project.timeline}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
