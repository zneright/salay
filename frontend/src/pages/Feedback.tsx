import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  AlertCircle, 
  CheckCircle2, 
  MapPin, 
  FileText,
  Sparkles,
  Heart,
  Plus,
  Send,
  X,
  Compass
} from 'lucide-react';
import { showToast } from '../components/ui/Toast';

interface CitizenFeedback {
  id: string;
  type: string;
  location: string;
  description: string;
  submittedAt: string;
  status: 'Open' | 'Under Investigation' | 'Resolved';
  isAnonymous?: boolean;
  contactEmail?: string;
  priority?: 'High' | 'Medium' | 'Low';
}

const feedbackSchema = z.object({
  report_type: z.string().min(2, 'Please select a valid report type.'),
  address: z.string().min(5, 'Address must contain at least 5 characters.'),
  description: z.string().min(10, 'Details must contain at least 10 characters.'),
  citizen_contact: z.string().optional().or(z.literal('')),
  submit_anonymously: z.boolean(),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export const Feedback: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<CitizenFeedback[]>([
    {
      id: 'TCK-2201',
      type: 'Transit Delay / Traffic Control',
      location: 'Oakridge Blvd & 5th Ave Intersection',
      description: 'The traffic signal timing is causing massive backups during construction of the high school solar installation.',
      submittedAt: '2026-07-16',
      status: 'Under Investigation',
      isAnonymous: true,
      priority: 'Medium'
    },
    {
      id: 'TCK-1982',
      type: 'Road Maintenance / Pothole',
      location: '124 Maple Street, East Ward',
      description: 'Huge pothole in front of the bridge crossing causing safety hazards for cycling commuters.',
      submittedAt: '2026-07-12',
      status: 'Resolved',
      isAnonymous: false,
      contactEmail: 'commuter.maria@outlook.com',
      priority: 'High'
    },
    {
      id: 'TCK-3304',
      type: 'Water & Utility Overflow',
      location: 'District 3 Main Line Valve',
      description: 'Secondary line backup causing minor drainage flooding on private driveways.',
      submittedAt: '2026-07-10',
      status: 'Open',
      isAnonymous: false,
      contactEmail: 'buday.renz@outlook.com',
      priority: 'Low'
    }
  ]);

  const [formOpen, setFormOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      report_type: '',
      address: '',
      description: '',
      citizen_contact: '',
      submit_anonymously: false,
    },
  });

  const submitAnonymously = watch('submit_anonymously');

  const onSubmit = async (data: FeedbackFormValues) => {
    // Custom flat validation if contact email is requested
    if (!data.submit_anonymously && !data.citizen_contact?.trim()) {
      setError('citizen_contact', {
        type: 'manual',
        message: 'Email address is required unless submitting anonymously.',
      });
      return;
    }

    try {
      // Simulate database write
      await new Promise((resolve) => setTimeout(resolve, 600));

      const newReport: CitizenFeedback = {
        id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
        type: data.report_type,
        location: data.address,
        description: data.description,
        submittedAt: new Date().toISOString().split('T')[0],
        status: 'Open',
        isAnonymous: data.submit_anonymously,
        contactEmail: data.submit_anonymously ? undefined : data.citizen_contact,
        priority: 'Low'
      };

      setFeedbacks((prev) => [newReport, ...prev]);
      setSubmitSuccess(true);
      showToast('Incident report filed successfully', 'success');
      reset();
      
      setTimeout(() => {
        setSubmitSuccess(false);
        setFormOpen(false);
      }, 2000);
    } catch {
      showToast('Failed to submit report', 'error');
    }
  };

  const getPriorityColor = (priority?: CitizenFeedback['priority']) => {
    switch (priority) {
      case 'High': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Low': return 'text-primary bg-primary/10 border-primary/20';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusColor = (status: CitizenFeedback['status']) => {
    switch (status) {
      case 'Resolved': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Under Investigation': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Open': return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  return (
    <div className="space-y-8 animate-fade-in text-left">
      {/* 1. Header with Actions */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-[40px] font-bold tracking-tight text-foreground leading-none">Citizen Feedback</h1>
          <p className="text-[13px] text-muted-foreground mt-2">
            File incident tickets or query community safety indices.
          </p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="px-4 py-2 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold rounded-lg transition-all active:scale-95 flex items-center space-x-1.5 shrink-0"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Report</span>
        </button>
      </div>

      {/* 2. Community Health Stat Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-2 hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">Reports Filed</span>
            <FileText className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">143</div>
          <p className="text-[10px] text-muted-foreground">Syncing via Snowflake Stages</p>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-2 hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">Community Sentiment</span>
            <Heart className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">68% Neutral</div>
          <p className="text-[10px] text-muted-foreground">Flooding complaints variance is -12%</p>
        </div>

        <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-2 hover:border-primary/20 hover:-translate-y-0.5 transition-all duration-200">
          <div className="flex justify-between items-center text-muted-foreground">
            <span className="text-[10px] uppercase font-bold tracking-wider">Avg Response Time</span>
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">3.2 Days</div>
          <p className="text-[10px] text-muted-foreground">92% audit resolution index</p>
        </div>
      </div>

      {/* 3. Main Split View: Map, Lists, and AI Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Map & AI Summary (5/12 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Snowflake Cortex AI Summary */}
          <div className="bg-card border border-primary/20 p-5 rounded-2xl shadow-sm space-y-3.5 relative overflow-hidden">
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-xl pointer-events-none" />
            <span className="flex items-center space-x-2 text-[10px] text-primary font-bold font-mono tracking-wider">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
              <span>✨ Cortex Incident Summary</span>
            </span>
            <p className="text-xs text-muted-foreground leading-relaxed">
              "Citizen report directories sync shows **43 reports** in the last month. Ward 4 (North Metro) represents the highest density hotspot. Most reports relate to flooded roadways, transit delays, and contractor delays."
            </p>
          </div>

          {/* Interactive Coordinates Map Mock */}
          <div className="bg-card border border-border p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase font-bold text-primary font-mono tracking-wider flex items-center space-x-1.5">
                <Compass className="w-4 h-4 text-primary animate-spin" style={{ animationDuration: '6s' }} />
                <span>Hotspot Coordinates Map</span>
              </span>
              <span className="text-[9px] text-muted-foreground font-mono">Ward 4 District</span>
            </div>
            
            {/* Map Placeholder Graphic */}
            <div className="h-44 bg-secondary/80 border border-border rounded-xl flex flex-col items-center justify-center relative overflow-hidden select-none">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,107,255,0.05)_0%,transparent_70%)]" />
              
              {/* Hotspot Markers */}
              <div className="absolute top-1/3 left-1/4 flex flex-col items-center">
                <div className="w-3 h-3 bg-rose-500 rounded-full animate-ping absolute" />
                <div className="w-3 h-3 bg-rose-500 rounded-full border-2 border-white relative" />
                <span className="text-[8px] font-mono text-rose-500 font-bold mt-1 bg-card border px-1 rounded">PRJ-9904</span>
              </div>
              <div className="absolute bottom-1/3 right-1/3 flex flex-col items-center">
                <div className="w-3 h-3 bg-primary rounded-full animate-ping absolute" />
                <div className="w-3 h-3 bg-primary rounded-full border-2 border-white relative" />
                <span className="text-[8px] font-mono text-primary font-bold mt-1 bg-card border px-1 rounded">TCK-2201</span>
              </div>

              <span className="text-[10px] text-muted-foreground font-mono">Live Coordinate Feed</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Priority & Recent Reports (7/12 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Priority Reports */}
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-base font-bold text-foreground">Priority Reports</h3>
            <div className="space-y-3">
              {feedbacks.filter(f => f.priority === 'High').map(f => (
                <div key={f.id} className="p-4 border border-rose-500/10 bg-rose-500/[0.02] rounded-xl space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-muted-foreground">{f.id}</span>
                    <span className={`text-[8px] font-bold border px-1.5 py-0.5 rounded-full ${getPriorityColor(f.priority)}`}>
                      {f.priority} Priority
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-foreground">{f.type}</h4>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{f.description}</p>
                  <div className="flex items-center space-x-2 text-[10px] text-muted-foreground pt-1 border-t border-border/40">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span>{f.location}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Reports */}
          <div className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-base font-bold text-foreground">Recent Feedback Registry</h3>
            <div className="space-y-3">
              {feedbacks.map((f) => (
                <div 
                  key={f.id} 
                  className="p-4 border border-border bg-card/45 hover:border-primary/20 rounded-xl space-y-3 hover:-translate-y-0.5 transition-all duration-200 text-left"
                >
                  <div className="flex justify-between items-start">
                    <div className="leading-tight">
                      <span className="text-[10px] font-mono text-muted-foreground">{f.id}</span>
                      <h4 className="text-xs font-bold text-foreground mt-0.5">{f.type}</h4>
                    </div>
                    <span className={`text-[8px] font-bold border px-1.5 py-0.5 rounded-full ${getStatusColor(f.status)}`}>
                      {f.status}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{f.description}</p>
                  
                  <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-2.5 border-t border-border/60">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-primary" />
                      <span className="truncate max-w-[180px]">{f.location}</span>
                    </div>
                    <span className="font-mono text-[9px]">
                      {f.isAnonymous ? 'Anonymous Citizen' : (f.contactEmail || 'Guest')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 4. Overlay Form Modal (Create Incident Report action triggers this) */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md bg-card border border-border rounded-2xl overflow-hidden shadow-2xl relative p-6 space-y-6 text-left">
            <button
              onClick={() => setFormOpen(false)}
              className="absolute top-4 right-4 p-1.5 border border-border bg-secondary rounded hover:text-foreground text-muted-foreground"
              aria-label="Close report form"
            >
              <X className="w-3.5 h-3.5" />
            </button>

            <div>
              <h3 className="text-lg font-bold text-foreground">File Incident Report</h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Submit municipal delays or infrastructure issues directly.</p>
            </div>

            {submitSuccess ? (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl flex items-center space-x-2 text-xs font-semibold select-none">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Report submitted successfully. Updating registries...</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs font-semibold">
                
                {/* Type Selection */}
                <div className="space-y-1">
                  <label htmlFor="report_type" className="text-muted-foreground">Report Type</label>
                  <select
                    id="report_type"
                    {...register('report_type')}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                  >
                    <option value="">Select report category...</option>
                    <option value="Road Maintenance / Pothole">Road Maintenance / Pothole</option>
                    <option value="Transit Delay / Traffic Control">Transit Delay / Traffic Control</option>
                    <option value="Water & Utility Overflow">Water & Utility Overflow</option>
                    <option value="Waste / Sanitation Complaints">Waste / Sanitation Complaints</option>
                  </select>
                  {errors.report_type && (
                    <span className="text-[10px] text-rose-500 flex items-center space-x-1 mt-0.5">
                      <AlertCircle className="w-3 h-3" /> <span>{errors.report_type.message}</span>
                    </span>
                  )}
                </div>

                {/* Address Input */}
                <div className="space-y-1">
                  <label htmlFor="address" className="text-muted-foreground">Location Address</label>
                  <input
                    id="address"
                    type="text"
                    placeholder="e.g. 124 Maple Street, East Ward"
                    {...register('address')}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                  />
                  {errors.address && (
                    <span className="text-[10px] text-rose-500 flex items-center space-x-1 mt-0.5">
                      <AlertCircle className="w-3 h-3" /> <span>{errors.address.message}</span>
                    </span>
                  )}
                </div>

                {/* Description Textarea */}
                <div className="space-y-1">
                  <label htmlFor="description" className="text-muted-foreground">Incident Details</label>
                  <textarea
                    id="description"
                    rows={3}
                    placeholder="Provide specific details about the issue (minimum 10 characters)..."
                    {...register('description')}
                    className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                  />
                  {errors.description && (
                    <span className="text-[10px] text-rose-500 flex items-center space-x-1 mt-0.5">
                      <AlertCircle className="w-3 h-3" /> <span>{errors.description.message}</span>
                    </span>
                  )}
                </div>

                {/* Anonymous Checkbox */}
                <div className="flex items-center space-x-2 py-1.5">
                  <input
                    id="submit_anonymously"
                    type="checkbox"
                    {...register('submit_anonymously')}
                    className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-primary"
                  />
                  <label htmlFor="submit_anonymously" className="text-xs text-foreground cursor-pointer select-none">
                    Submit report anonymously
                  </label>
                </div>

                {/* Contact Email (Conditional) */}
                {!submitAnonymously && (
                  <div className="space-y-1 animate-fade-in">
                    <label htmlFor="citizen_contact" className="text-muted-foreground">Contact Email Address</label>
                    <input
                      id="citizen_contact"
                      type="email"
                      placeholder="e.g. maria.santos@outlook.com"
                      {...register('citizen_contact')}
                      className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
                    />
                    {errors.citizen_contact && (
                      <span className="text-[10px] text-rose-500 flex items-center space-x-1 mt-0.5">
                        <AlertCircle className="w-3 h-3" /> <span>{errors.citizen_contact.message}</span>
                      </span>
                    )}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-bold rounded-lg transition-all active:scale-[0.98] flex items-center justify-center space-x-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Filing Report...' : 'File Report'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
export default Feedback;
