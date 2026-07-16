import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../providers/AuthProvider';
import { AuthLayout } from '../layouts/AuthLayout';
import { showToast } from '../components/ui/Toast';
import { AlertCircle, ArrowRight } from 'lucide-react';

const registerSchema = z.object({
  fullName: z.string().min(3, 'Name must contain at least 3 characters.'),
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must contain at least 6 characters.'),
  confirmPassword: z.string(),
  terms: z.boolean().refine(val => val === true, 'You must accept the terms of use.'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match.',
  path: ['confirmPassword']
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export const Register: React.FC = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [pwdStrength, setPwdStrength] = useState<'Weak' | 'Medium' | 'Strong'>('Weak');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      password: '',
      confirmPassword: '',
      terms: false,
    }
  });

  const pwdValue = watch('password');

  React.useEffect(() => {
    if (!pwdValue) {
      setPwdStrength('Weak');
      return;
    }
    const hasNumbers = /\d/.test(pwdValue);
    const hasLetters = /[a-zA-Z]/.test(pwdValue);
    if (pwdValue.length >= 10 && hasNumbers && hasLetters) {
      setPwdStrength('Strong');
    } else if (pwdValue.length >= 7) {
      setPwdStrength('Medium');
    } else {
      setPwdStrength('Weak');
    }
  }, [pwdValue]);

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      await registerUser(data.fullName, data.email);
      showToast('Registration successful! Setup your profile.', 'success');
      navigate('/onboarding');
    } catch {
      showToast('Registration failed.', 'error');
    }
  };

  const strengthColors = {
    Weak: 'bg-rose-500 w-1/3',
    Medium: 'bg-amber-500 w-2/3',
    Strong: 'bg-emerald-500 w-full',
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left">
        <div>
          <h1 className="text-sm font-bold text-neutral-200">Create Account</h1>
          <p className="text-[10px] text-neutral-500 mt-0.5">Register for the civic audit terminal.</p>
        </div>

        {/* Full name */}
        <div className="space-y-1.5">
          <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400">Full Name</label>
          <input
            type="text"
            {...register('fullName')}
            placeholder="John Doe"
            className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-neutral-700 placeholder-neutral-600"
          />
          {errors.fullName && (
            <span className="text-[10px] text-rose-500 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" /> <span>{errors.fullName.message}</span>
            </span>
          )}
        </div>

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

        {/* Password */}
        <div className="space-y-1.5">
          <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400">Password</label>
          <input
            type="password"
            {...register('password')}
            placeholder="••••••••"
            className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-neutral-700 placeholder-neutral-600"
          />
          {pwdValue && (
            <div className="space-y-1">
              <div className="flex justify-between text-[9px] text-neutral-500">
                <span>Strength</span>
                <span>{pwdStrength}</span>
              </div>
              <div className="w-full bg-neutral-900 h-1 rounded-full overflow-hidden border border-neutral-855">
                <div className={`h-full transition-all duration-300 ${strengthColors[pwdStrength]}`} />
              </div>
            </div>
          )}
          {errors.password && (
            <span className="text-[10px] text-rose-500 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" /> <span>{errors.password.message}</span>
            </span>
          )}
        </div>

        {/* Confirm password */}
        <div className="space-y-1.5">
          <label className="text-[9px] uppercase font-bold tracking-wider text-neutral-400">Confirm Password</label>
          <input
            type="password"
            {...register('confirmPassword')}
            placeholder="••••••••"
            className="w-full bg-neutral-900 border border-neutral-800 rounded px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-neutral-700 placeholder-neutral-600"
          />
          {errors.confirmPassword && (
            <span className="text-[10px] text-rose-500 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" /> <span>{errors.confirmPassword.message}</span>
            </span>
          )}
        </div>

        {/* Terms */}
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="terms"
              {...register('terms')}
              className="rounded border-neutral-800 bg-neutral-900 text-neutral-100 w-3.5 h-3.5 focus:ring-0 outline-none"
            />
            <label htmlFor="terms" className="text-[10px] text-neutral-400 select-none">
              I accept the Civic audit terms of use.
            </label>
          </div>
          {errors.terms && (
            <span className="text-[10px] text-rose-500 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" /> <span>{errors.terms.message}</span>
            </span>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 disabled:bg-neutral-800 disabled:text-neutral-500 text-neutral-900 font-semibold text-xs rounded transition-all flex items-center justify-center space-x-1.5 active:scale-[0.98]"
        >
          {isSubmitting ? 'Registering...' : 'Create Account'}
          {!isSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
        </button>

        {/* Footer actions */}
        <div className="text-center pt-2 border-t border-neutral-900 text-[10px] text-neutral-500">
          <span>Already have an account? </span>
          <Link to="/login" className="text-neutral-300 hover:underline">
            Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};
export default Register;
