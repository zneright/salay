import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AuthLayout } from '../layouts/AuthLayout';
import { showToast } from '../components/ui/Toast';
import { AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export const ForgotPassword: React.FC = () => {
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    }
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    await new Promise((resolve) => setTimeout(resolve, 800));
    showToast(`Password reset link sent to ${data.email}`, 'success');
    setSuccess(true);
  };

  return (
    <AuthLayout>
      <div className="space-y-4 text-left">
        <div>
          <h1 className="text-sm font-bold text-neutral-200">Reset Password</h1>
          <p className="text-[10px] text-neutral-500 mt-0.5">Enter your email to receive a recovery link.</p>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-2.5 p-3.5 bg-emerald-950/20 border border-emerald-900 text-emerald-400 rounded-lg text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>We've dispatched a recovery link. Please check your inbox.</span>
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold text-xs rounded transition-all active:scale-[0.98]"
            >
              Return to Login
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400">Email Address</label>
              <input
                type="text"
                {...register('email')}
                placeholder="john@example.com"
                className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-neutral-700 placeholder-neutral-600"
              />
              {errors.email && (
                <span className="text-[10px] text-rose-500 flex items-center space-x-1">
                  <AlertCircle className="w-3 h-3" /> <span>{errors.email.message}</span>
                </span>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-900 font-semibold text-xs rounded transition-all active:scale-[0.98]"
            >
              {isSubmitting ? 'Sending...' : 'Send Recovery Link'}
            </button>

            <div className="text-center pt-2 border-t border-neutral-900">
              <Link to="/login" className="inline-flex items-center space-x-1.5 text-[10px] text-neutral-400 hover:text-neutral-200">
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to Login</span>
              </Link>
            </div>
          </form>
        )}
      </div>
    </AuthLayout>
  );
};
export default ForgotPassword;
