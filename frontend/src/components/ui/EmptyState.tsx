import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed border-neutral-300 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/30 ${className}`}
    >
      <div className="p-3 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 mb-3">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-semibold text-neutral-900 dark:text-neutral-100">{title}</h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mt-1 mb-4">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-sky-600 text-white hover:bg-sky-500 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
