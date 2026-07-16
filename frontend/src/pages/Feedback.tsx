import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AlertCircle, CheckCircle2, MapPin, Tag } from 'lucide-react';

interface CitizenFeedback {
  id: string;
  type: string;
  location: string;
  description: string;
  submittedAt: string;
  status: 'Open' | 'Under Investigation' | 'Resolved';
}

const feedbackSchema = z.object({
  report_type: z.string().min(2, 'Please select or enter a valid report type.'),
  address: z.string().min(5, 'Address must contain at least 5 characters.'),
  description: z.string().min(10, 'Details must contain at least 10 characters.'),
  citizen_contact: z.string().email('Please enter a valid email address.'),
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
    },
    {
      id: 'TCK-1982',
      type: 'Road Maintenance / Pothole',
      location: '124 Maple Street, East Ward',
      description: 'Huge pothole in front of the bridge crossing causing safety hazards for cycling commuters.',
      submittedAt: '2026-07-12',
      status: 'Resolved',
    }
  ]);

  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      report_type: 'Pothole',
      address: '',
      description: '',
      citizen_contact: '',
    }
  });

  const onSubmit = async (data: FeedbackFormValues) => {
    // Simulate API transport
    await new Promise((resolve) => setTimeout(resolve, 800));

    const newTicket: CitizenFeedback = {
      id: `TCK-${Math.floor(1000 + Math.random() * 9000)}`,
      type: data.report_type,
      location: data.address,
      description: data.description,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'Open',
    };

    setFeedbacks((prev) => [newTicket, ...prev]);
    setSubmitSuccess(true);
    reset();

    setTimeout(() => setSubmitSuccess(false), 4000);
  };

  const statusBadges = {
    'Open': 'bg-rose-950/20 text-rose-400 border-rose-900',
    'Under Investigation': 'bg-amber-950/20 text-amber-400 border-amber-900',
    'Resolved': 'bg-emerald-950/20 text-emerald-400 border-emerald-900',
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left panel: Feedback submission form */}
      <div className="lg:col-span-1 space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Citizen Report Center</h1>
          <p className="text-xs text-neutral-400 mt-1">
            Submit a civic complaint or suggestion regarding municipal public services.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-neutral-950 border border-neutral-900 rounded-lg p-5 space-y-4">
          <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">File A Report</h3>

          {submitSuccess && (
            <div className="flex items-center space-x-2 p-3 bg-emerald-950/30 border border-emerald-900 text-emerald-400 rounded-md text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Ticket submitted successfully!</span>
            </div>
          )}

          {/* Report Type */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-neutral-400">Report Type</label>
            <select
              {...register('report_type')}
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-neutral-700"
            >
              <option value="Pothole">Road Maintenance / Pothole</option>
              <option value="Traffic Signal">Transit Delay / Traffic Control</option>
              <option value="Water Utility">Utilities / Leakage</option>
              <option value="General Feedback">General Comment / Feedback</option>
            </select>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-neutral-400">Incident Address</label>
            <input
              type="text"
              {...register('address')}
              placeholder="e.g. 452 Pine Street"
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-neutral-700 placeholder-neutral-600"
            />
            {errors.address && (
              <span className="text-[10px] text-rose-500 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" /> <span>{errors.address.message}</span>
              </span>
            )}
          </div>

          {/* Details */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-neutral-400">Description Details</label>
            <textarea
              {...register('description')}
              rows={3}
              placeholder="Provide a thorough description..."
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-neutral-700 placeholder-neutral-600 resize-none"
            />
            {errors.description && (
              <span className="text-[10px] text-rose-500 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" /> <span>{errors.description.message}</span>
              </span>
            )}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label className="text-[10px] uppercase font-bold text-neutral-400">Citizen Contact Email</label>
            <input
              type="text"
              {...register('citizen_contact')}
              placeholder="citizen@gmail.com"
              className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-neutral-700 placeholder-neutral-600"
            />
            {errors.citizen_contact && (
              <span className="text-[10px] text-rose-500 flex items-center space-x-1">
                <AlertCircle className="w-3 h-3" /> <span>{errors.citizen_contact.message}</span>
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-900 font-semibold text-xs rounded transition-all active:scale-[0.98]"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Incident Report'}
          </button>
        </form>
      </div>

      {/* Right panel: Feedback streams lists */}
      <div className="lg:col-span-2 space-y-4">
        <h2 className="text-sm font-bold text-neutral-200 tracking-tight">Active Citizen Reports Registry</h2>

        <div className="space-y-4">
          {feedbacks.map((item) => (
            <div key={item.id} className="bg-neutral-950/60 border border-neutral-900 rounded-lg p-5 space-y-3">
              <div className="flex justify-between items-center text-[10px]">
                <span className="font-mono text-neutral-500 bg-neutral-900 px-2 py-0.5 border border-neutral-800 rounded">
                  {item.id}
                </span>
                <span className={`px-2 py-0.5 border rounded-full font-semibold ${statusBadges[item.status]}`}>
                  {item.status}
                </span>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center space-x-1.5 text-xs font-semibold text-neutral-200">
                  <Tag className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{item.type}</span>
                </div>
                <p className="text-xs text-neutral-400 leading-relaxed">{item.description}</p>
              </div>

              <div className="flex justify-between items-center text-[10px] text-neutral-500 pt-2 border-t border-neutral-900/60">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{item.location}</span>
                </div>
                <span>Submitted: {item.submittedAt}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Feedback;
