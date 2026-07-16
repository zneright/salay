import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '../providers/AuthProvider';
import { AuthLayout } from '../layouts/AuthLayout';
import { showToast } from '../components/ui/Toast';
import { AlertCircle, ArrowRight } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(6, 'Password must contain at least 6 characters.'),
  remember_me: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember_me: false,
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data.email, data.password);
      showToast('Logged in successfully', 'success');
      navigate('/dashboard');
    } catch {
      showToast('Login failed. Please verify credentials.', 'error');
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-left font-semibold">
        <div>
          <h1 className="text-sm font-bold text-foreground">Welcome Back</h1>
          <p className="text-[10px] text-muted-foreground mt-0.5">Please sign in to access public projects ledgers.</p>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground">Email Address</label>
          <input
            type="text"
            {...register('email')}
            placeholder="name@organization.org"
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:border-primary placeholder-muted-foreground/60"
          />
          {errors.email && (
            <span className="text-[10px] text-rose-500 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" /> <span>{errors.email.message}</span>
            </span>
          )}
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground">Password</label>
            <Link to="/forgot-password" className="text-[9px] text-muted-foreground hover:text-foreground">
              Forgot Password?
            </Link>
          </div>
          <input
            type="password"
            {...register('password')}
            placeholder="••••••••"
            className="w-full bg-secondary border border-border rounded-lg px-3 py-2 text-xs text-foreground outline-none focus:border-primary placeholder-muted-foreground/60"
          />
          {errors.password && (
            <span className="text-[10px] text-rose-500 flex items-center space-x-1">
              <AlertCircle className="w-3 h-3" /> <span>{errors.password.message}</span>
            </span>
          )}
        </div>

        {/* Remember me check */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="remember_me"
            {...register('remember_me')}
            className="rounded border-border bg-secondary text-primary w-3.5 h-3.5 focus:ring-0 outline-none"
          />
          <label htmlFor="remember_me" className="text-[10px] text-muted-foreground select-none cursor-pointer">
            Remember my session
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 bg-primary hover:bg-primary/95 text-primary-foreground text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 active:scale-[0.98]"
        >
          {isSubmitting ? 'Verifying...' : 'Sign In'}
          {!isSubmitting && <ArrowRight className="w-3.5 h-3.5" />}
        </button>

        {/* Footer actions */}
        <div className="text-center pt-2 border-t border-border text-[10px] text-muted-foreground">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-primary hover:underline">
            Register here
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
};
export default Login;
