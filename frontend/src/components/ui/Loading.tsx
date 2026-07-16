import React from 'react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-2 border-neutral-800 border-t-neutral-100 ${sizeClasses[size]}`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export const LoadingPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-sm text-neutral-400 animate-pulse">Loading transparency records...</p>
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="border border-neutral-800 bg-neutral-900/50 rounded-lg p-5 space-y-4 animate-pulse">
      <div className="h-4 bg-neutral-800 rounded w-1/3" />
      <div className="space-y-2">
        <div className="h-3 bg-neutral-800 rounded w-full" />
        <div className="h-3 bg-neutral-800 rounded w-5/6" />
      </div>
      <div className="flex justify-between items-center pt-2">
        <div className="h-6 bg-neutral-800 rounded w-1/4" />
        <div className="h-6 bg-neutral-800 rounded w-1/4" />
      </div>
    </div>
  );
};

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 4 }) => {
  return (
    <div className="border border-neutral-800 rounded-lg overflow-hidden animate-pulse">
      <div className="bg-neutral-900/80 px-6 py-3 border-b border-neutral-800">
        <div className="h-4 bg-neutral-800 rounded w-1/4" />
      </div>
      <div className="divide-y divide-neutral-800">
        {Array.from({ length: rows }).map((_, idx) => (
          <div key={idx} className="px-6 py-4 flex justify-between space-x-4">
            <div className="h-4 bg-neutral-800 rounded w-1/3" />
            <div className="h-4 bg-neutral-800 rounded w-1/4" />
            <div className="h-4 bg-neutral-800 rounded w-1/6" />
          </div>
        ))}
      </div>
    </div>
  );
};
