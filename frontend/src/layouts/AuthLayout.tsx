import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4 py-12 relative overflow-hidden text-foreground">
      {/* Background CSS visual glowing mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      
      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Top Back Navigation Link */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-500 hover:text-sky-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Landing Page</span>
          </Link>
        </div>

        {/* Logo Card Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <Link to="/" className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl shadow-inner hover:scale-105 transition-transform">
            <img src="/logo.png" alt="SALAY Logo" className="w-12 h-12 object-contain" />
          </Link>
          <Link to="/">
            <h2 className="text-xl font-bold tracking-tight hover:text-sky-400 transition-colors">SALAY Engine Gateway</h2>
          </Link>
          <p className="text-xs text-neutral-500">Democratizing Civic Budgets and Projects Records</p>
        </div>

        {/* Card Body */}
        <div className="bg-neutral-950/70 border border-neutral-900 rounded-xl p-8 backdrop-blur-sm shadow-2xl">
          {children}
        </div>
      </div>
    </div>
  );
};
export default AuthLayout;
