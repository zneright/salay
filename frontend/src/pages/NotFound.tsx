import React from 'react';
import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export const NotFound: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 text-center px-4">
      <div className="p-4 bg-neutral-900 border border-neutral-800 rounded-full animate-bounce">
        <Compass className="w-10 h-10 text-neutral-300" />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold tracking-tight">404</h1>
        <h2 className="text-lg font-medium text-neutral-300">Page not found</h2>
        <p className="text-sm text-neutral-500 max-w-sm">
          The civic transparency endpoint you requested does not exist or has been relocated.
        </p>
      </div>
      <Link
        to="/"
        className="px-4 py-2 text-xs font-semibold bg-neutral-100 text-neutral-900 hover:bg-neutral-200 rounded-md transition-all active:scale-95"
      >
        Return to Dashboard
      </Link>
    </div>
  );
};
export default NotFound;
