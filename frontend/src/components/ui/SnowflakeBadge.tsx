import React from 'react';
import { Database, Cpu, Terminal, ShieldCheck, Zap } from 'lucide-react';

export type SnowflakeBadgeVariant = 'snowpark' | 'cortex' | 'coco' | 'source' | 'status' | 'custom';

interface SnowflakeBadgeProps {
  variant?: SnowflakeBadgeVariant;
  label?: string;
  className?: string;
  size?: 'sm' | 'md';
}

export const SnowflakeBadge: React.FC<SnowflakeBadgeProps> = ({
  variant = 'status',
  label,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-medium';

  switch (variant) {
    case 'snowpark':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/20 ${sizeClasses} ${className}`}
          title="Aggregated using Snowflake Snowpark DataFrames"
        >
          <Database className="w-3.5 h-3.5 text-cyan-600 dark:text-cyan-400" />
          <span>{label || 'Snowpark Processed'}</span>
        </span>
      );

    case 'cortex':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20 ${sizeClasses} ${className}`}
          title="Generated via Snowflake Cortex AI (llama3-70b)"
        >
          <Cpu className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400 animate-pulse" />
          <span>{label || 'Cortex AI (llama3-70b)'}</span>
        </span>
      );

    case 'coco':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/20 ${sizeClasses} ${className}`}
          title="Orchestrated via CoCo CLI Pipeline"
        >
          <Terminal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>{label || 'CoCo CLI Active'}</span>
        </span>
      );

    case 'source':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700 ${sizeClasses} ${className}`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
          <span>{label || 'Source: Snowflake Civic DB'}</span>
        </span>
      );

    case 'status':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/30 ${sizeClasses} ${className}`}
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-sky-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-sky-500"></span>
          </span>
          <Zap className="w-3 h-3 text-sky-500" />
          <span>{label || 'Snowflake Live'}</span>
        </span>
      );
  }
};
