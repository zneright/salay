import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../providers/AuthProvider';
import { SnowflakeBadge } from '../components/ui/SnowflakeBadge';
import { fetchFeedback, submitFeedback, CitizenFeedback } from '../services/api';
import { 
  CheckCircle2, 
  MapPin, 
  FileText,
  Heart,
  Plus,
  Send,
  X,
  MessageSquare,
  UserCheck,
  EyeOff
} from 'lucide-react';
import { showToast } from '../components/ui/Toast';

interface CommentItem {
  id: string;
  author: string;
  isAnonymous: boolean;
  text: string;
  createdAt: string;
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
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState<CitizenFeedback[]>([]);

  // Load live feedback reports from Snowflake backend on mount
  useEffect(() => {
    let isMounted = true;
    fetchFeedback()
      .then((data) => {
        if (isMounted) {
          setFeedbacks(data);
        }
      })
      .catch((err) => {
        console.error("Failed to load feedback from Snowflake:", err);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const [formOpen, setFormOpen] = useState(false);

  // Comment Modal State
  const [activeCommentTicketId, setActiveCommentTicketId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');
  const [commentAnonymously, setCommentAnonymously] = useState(false);

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
    if (!data.submit_anonymously && !data.citizen_contact?.trim()) {
      setError('citizen_contact', {
        type: 'manual',
        message: 'Email address is required unless submitting anonymously.',
      });
      return;
    }

    try {
      const created = await submitFeedback({
        report_type: data.report_type,
        address: data.address,
        description: data.description,
        citizen_contact: data.submit_anonymously ? undefined : data.citizen_contact,
        submit_anonymously: data.submit_anonymously,
      });

      setFeedbacks((prev) => [created, ...prev]);
      showToast('Incident report filed successfully to Snowflake DB', 'success');
      reset();
      
      setTimeout(() => {
        setFormOpen(false);
      }, 1000);
    } catch {
      showToast('Failed to submit report to Snowflake DB', 'error');
    }
  };


  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !activeCommentTicketId) return;

    const authorName = commentAnonymously ? 'Anonymous Resident' : (user?.fullName || 'Registered Citizen');

    const newComment: CommentItem = {
      id: Math.random().toString(),
      author: authorName,
      isAnonymous: commentAnonymously,
      text: commentText.trim(),
      createdAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
    };

    setFeedbacks((prev) =>
      prev.map((t) => {
        if (t.id === activeCommentTicketId) {
          return { ...t, comments: [...(t.comments || []), newComment] };
        }
        return t;
      })
    );

    showToast(`Comment posted as ${authorName}`, 'success');
    setCommentText('');
    setActiveCommentTicketId(null);
  };

  return (
    <div className="space-y-8 animate-fade-in text-left max-w-7xl mx-auto pb-8">
      {/* 1. Header with Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">Citizen Incident Reports & Public Comments</h1>
            <SnowflakeBadge variant="coco" label="CoCo Pipeline Ingestion" />
          </div>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
            File municipal maintenance tickets or comment publicly on local infrastructure issues.
          </p>
        </div>
        <button
          onClick={() => setFormOpen(true)}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-xl shadow-sm transition-all active:scale-95 flex items-center space-x-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>File Incident Report</span>
        </button>
      </div>

      {/* 2. Community Health Stat Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-2xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-neutral-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Reports Ingested</span>
            <FileText className="w-4 h-4 text-sky-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white">143 Reports</div>
          <SnowflakeBadge variant="source" label="Source: FEEDBACK_REPORTS Table" size="sm" />
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-2xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-neutral-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Community Sentiment</span>
            <Heart className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white">68% Positive</div>
          <SnowflakeBadge variant="cortex" label="Cortex Sentiment Analyzed" size="sm" />
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-5 rounded-2xl shadow-sm space-y-2">
          <div className="flex justify-between items-center text-neutral-500">
            <span className="text-[10px] uppercase font-bold tracking-wider">Avg Resolution Time</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-neutral-900 dark:text-white">2.4 Days</div>
          <p className="text-[10px] text-neutral-500">Public Works Dispatch Average</p>
        </div>
      </div>

      {/* 3. Feedback Reports List with Public Comments */}
      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm space-y-6">
        <h3 className="text-base font-bold text-neutral-900 dark:text-white">Public Community Incident Feed</h3>

        <div className="space-y-4">
          {feedbacks.map((item) => (
            <div key={item.id} className="p-5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sky-500 font-bold">{item.id}</span>
                  <h4 className="font-bold text-neutral-900 dark:text-white text-sm">{item.type}</h4>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                    item.status === 'Resolved' ? 'bg-emerald-500/10 text-emerald-600' :
                    item.status === 'Under Investigation' ? 'bg-amber-500/10 text-amber-600' : 'bg-sky-500/10 text-sky-600'
                  }`}>
                    {item.status}
                  </span>
                  {item.isAnonymous ? (
                    <span className="inline-flex items-center gap-1 text-[11px] text-neutral-400">
                      <EyeOff className="w-3 h-3" /> Anonymous
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] text-sky-600 dark:text-sky-400">
                      <UserCheck className="w-3 h-3" /> Verified Citizen ({item.contactEmail})
                    </span>
                  )}
                </div>
              </div>

              <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed">{item.description}</p>

              <div className="flex items-center justify-between text-[11px] text-neutral-500 pt-2 border-t border-neutral-200/60 dark:border-neutral-700/40">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" /> {item.location}
                </span>
                <span>Submitted: {item.submittedAt}</span>
              </div>

              {/* Public Comments Thread */}
              <div className="mt-3 pt-3 border-t border-neutral-200/40 dark:border-neutral-700/40 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1">
                    <MessageSquare className="w-3.5 h-3.5 text-sky-500" /> Public Discussion ({item.comments?.length || 0})
                  </span>
                  <button
                    onClick={() => setActiveCommentTicketId(item.id)}
                    className="text-[11px] text-sky-600 dark:text-sky-400 hover:underline font-semibold"
                  >
                    + Add Comment
                  </button>
                </div>

                {item.comments && item.comments.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {item.comments.map((c) => (
                      <div key={c.id} className="p-3 rounded-lg bg-white dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800 text-xs space-y-1">
                        <div className="flex justify-between items-center text-[10px] text-neutral-400">
                          <span className="font-bold text-neutral-800 dark:text-neutral-200 flex items-center gap-1">
                            {c.isAnonymous ? <EyeOff className="w-2.5 h-2.5" /> : <UserCheck className="w-2.5 h-2.5 text-sky-500" />}
                            {c.author}
                          </span>
                          <span>{c.createdAt}</span>
                        </div>
                        <p className="text-neutral-700 dark:text-neutral-300">{c.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Public Comment Modal */}
      {activeCommentTicketId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-2xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-sky-500" /> Add Public Comment
              </h3>
              <button onClick={() => setActiveCommentTicketId(null)} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddComment} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Your Comment / Observation</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Provide additional details or updates on this ticket..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Anonymous Checkbox Toggle */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <input
                  type="checkbox"
                  id="commentAnon"
                  checked={commentAnonymously}
                  onChange={(e) => setCommentAnonymously(e.target.checked)}
                  className="rounded border-neutral-400 text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="commentAnon" className="cursor-pointer font-medium">
                  Post anonymously (hides your name from public thread)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveCommentTicketId(null)}
                  className="px-4 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-sm"
                >
                  Post Comment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Incident Report Submission Modal */}
      {formOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg p-6 rounded-2xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white border border-neutral-200 dark:border-neutral-800 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold flex items-center gap-2">
                <Plus className="w-4 h-4 text-sky-500" /> File New Incident Report
              </h3>
              <button onClick={() => setFormOpen(false)} className="p-1 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold mb-1">Report Category</label>
                <select
                  {...register('report_type')}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="">Select report category...</option>
                  <option value="Road Maintenance / Pothole">Road Maintenance / Pothole</option>
                  <option value="Transit Delay / Traffic Control">Transit Delay / Traffic Control</option>
                  <option value="Water & Utility Overflow">Water & Utility Overflow</option>
                  <option value="Public Safety Hazard">Public Safety Hazard</option>
                </select>
                {errors.report_type && <p className="text-rose-500 text-[11px] mt-1">{errors.report_type.message}</p>}
              </div>

              <div>
                <label className="block font-semibold mb-1">Incident Address / Location</label>
                <input
                  type="text"
                  placeholder="e.g. 124 Maple Street, East Ward"
                  {...register('address')}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                {errors.address && <p className="text-rose-500 text-[11px] mt-1">{errors.address.message}</p>}
              </div>

              <div>
                <label className="block font-semibold mb-1">Description Details</label>
                <textarea
                  rows={3}
                  placeholder="Describe the issue in detail..."
                  {...register('description')}
                  className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                {errors.description && <p className="text-rose-500 text-[11px] mt-1">{errors.description.message}</p>}
              </div>

              {/* Anonymous Checkbox Toggle */}
              <div className="flex items-center gap-2 p-3 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                <input
                  type="checkbox"
                  id="submitAnon"
                  {...register('submit_anonymously')}
                  className="rounded border-neutral-400 text-sky-600 focus:ring-sky-500"
                />
                <label htmlFor="submitAnon" className="cursor-pointer font-medium">
                  Submit anonymously (does not attach your email)
                </label>
              </div>

              {!submitAnonymously && (
                <div>
                  <label className="block font-semibold mb-1">Contact Email Address</label>
                  <input
                    type="email"
                    placeholder="e.g. citizen@gmail.com"
                    {...register('citizen_contact')}
                    className="w-full px-3 py-2 rounded-lg bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  {errors.citizen_contact && <p className="text-rose-500 text-[11px] mt-1">{errors.citizen_contact.message}</p>}
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setFormOpen(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Ticket</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
