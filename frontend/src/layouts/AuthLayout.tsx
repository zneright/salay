import React from 'react';

export const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12 relative overflow-hidden">
      {/* Background CSS visual glowing mesh */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />
      
      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Logo Card Header */}
        <div className="flex flex-col items-center text-center space-y-2">
          <div className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl shadow-inner">
            <img src="/logo.png" alt="SALAY Logo" className="w-12 h-12 object-contain" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">SALAY Engine Gateway</h2>
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
