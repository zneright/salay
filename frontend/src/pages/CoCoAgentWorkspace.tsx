import React, { useState, useEffect } from 'react';
import { useAuth } from '../providers/AuthProvider';
import { showToast } from '../components/ui/Toast';
import { 
  Terminal, 
  Cpu, 
  Database, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Play,
  Code
} from 'lucide-react';
import { SnowflakeBadge } from '../components/ui/SnowflakeBadge';
import { CoCoTerminalModal } from '../components/ui/CoCoTerminalModal';

export const CoCoAgentWorkspace: React.FC = () => {
  const { user, loginAsDemo } = useAuth();

  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [activeModalCommand, setActiveModalCommand] = useState('coco status');

  // Auto-switch to Administrator persona when accessing CoCo CLI Workspace
  useEffect(() => {
    if (!user || user.role !== 'Administrator') {
      loginAsDemo('Administrator');
      showToast('⚡ Auto-switched to Administrator Persona for CoCo CLI Agent Access', 'info');
    }
  }, [user, loginAsDemo]);

  const handleQuickRun = (cmd: string) => {
    setActiveModalCommand(cmd);
    setIsTerminalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full overflow-x-hidden text-neutral-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200 dark:border-slate-800/80 pb-6 w-full max-w-full overflow-hidden">
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-3 mb-2 flex-wrap">
            <div className="p-2 bg-[#29b5e8]/10 text-[#29b5e8] rounded-lg border border-[#29b5e8]/20 shrink-0">
              <Terminal className="w-6 h-6" />
            </div>
            <h1 className="text-lg sm:text-2xl font-bold font-sans tracking-tight break-words max-w-full text-neutral-900 dark:text-slate-100">
              CoCo CLI Agent & Automation Workspace
            </h1>
          </div>
          <p className="text-neutral-600 dark:text-slate-400 text-xs sm:text-sm max-w-2xl font-sans leading-relaxed">
            Command-line automation suite for Snowflake database management, Cortex AI query execution, and public works expenditure audit pipelines.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0 flex-wrap gap-2">
          <SnowflakeBadge variant="coco" />
          <button
            onClick={() => handleQuickRun('coco status')}
            className="bg-[#29b5e8] hover:bg-[#1fa0d0] text-slate-950 font-sans font-semibold px-4 py-2 rounded-lg text-xs sm:text-sm flex items-center space-x-2 transition shadow-lg shadow-[#29b5e8]/20 active:scale-95"
          >
            <Terminal className="w-4 h-4" />
            <span>Launch CLI Terminal</span>
          </button>
        </div>
      </div>

      {/* System Diagnostics Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 w-full">
        <div className="bg-white dark:bg-slate-900/60 border border-neutral-200 dark:border-slate-800 p-5 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">CLI Agent Status</span>
            <Cpu className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-slate-100">ONLINE (v1.0.0)</div>
          <div className="flex items-center space-x-1.5 text-xs text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Snowflake CoCo 2026 Ready</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 border border-neutral-200 dark:border-slate-800 p-5 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Database Engine</span>
            <Database className="w-4 h-4 text-[#29b5e8]" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-slate-100 truncate">CIVIC_TRANSPARENCY_DB</div>
          <div className="text-xs text-neutral-500 dark:text-slate-400">Warehouse: COMPUTE_WH</div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 border border-neutral-200 dark:border-slate-800 p-5 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Cortex AI Model</span>
            <Zap className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-slate-100">llama3-70b</div>
          <div className="text-xs text-purple-600 dark:text-purple-400">SNOWFLAKE.CORTEX.COMPLETE</div>
        </div>

        <div className="bg-white dark:bg-slate-900/60 border border-neutral-200 dark:border-slate-800 p-5 rounded-2xl space-y-2 shadow-xs">
          <div className="flex items-center justify-between text-neutral-500 dark:text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Compliance Audit</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">81.38% Spent</div>
          <div className="text-xs text-neutral-500 dark:text-slate-400">0 Risk Flags Detected</div>
        </div>
      </div>

      {/* Available CLI Agent Commands Grid */}
      <div className="space-y-4 w-full">
        <h2 className="text-base sm:text-lg font-bold font-sans flex items-center space-x-2 text-neutral-900 dark:text-white">
          <Code className="w-5 h-5 text-[#29b5e8]" />
          <span>CoCo Agent CLI Command Suite</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 w-full">
          <div className="bg-white dark:bg-slate-900/80 border border-neutral-200 dark:border-slate-800 p-5 rounded-2xl space-y-3 hover:border-sky-500/40 transition shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs sm:text-sm font-bold text-[#29b5e8]">$ coco status</span>
              <span className="text-[10px] bg-neutral-100 dark:bg-slate-800 text-neutral-600 dark:text-slate-400 px-2 py-0.5 rounded font-mono">Diagnostic</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-slate-400 leading-relaxed">
              Audits system health, FastAPI readiness, Snowflake DB connection schema, and Cortex AI model availability.
            </p>
            <button
              onClick={() => handleQuickRun('coco status')}
              className="w-full bg-neutral-100 dark:bg-slate-800 hover:bg-neutral-200 dark:hover:bg-slate-700 text-neutral-900 dark:text-slate-200 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition active:scale-95"
            >
              <Play className="w-3 h-3 fill-current text-[#29b5e8]" />
              <span>Run Status Check</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900/80 border border-neutral-200 dark:border-slate-800 p-5 rounded-2xl space-y-3 hover:border-sky-500/40 transition shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs sm:text-sm font-bold text-purple-600 dark:text-purple-400">$ coco cortex</span>
              <span className="text-[10px] bg-purple-500/10 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded border border-purple-500/20 font-mono">Cortex LLM</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-slate-400 leading-relaxed">
              Queries Snowflake Cortex AI engine via terminal parameters for instant municipal intelligence summaries.
            </p>
            <button
              onClick={() => handleQuickRun('coco cortex --prompt "Summarize high-cost infrastructure projects"')}
              className="w-full bg-neutral-100 dark:bg-slate-800 hover:bg-neutral-200 dark:hover:bg-slate-700 text-neutral-900 dark:text-slate-200 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition active:scale-95"
            >
              <Play className="w-3 h-3 fill-current text-purple-500" />
              <span>Query Cortex AI</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900/80 border border-neutral-200 dark:border-slate-800 p-5 rounded-2xl space-y-3 hover:border-sky-500/40 transition shadow-xs">
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs sm:text-sm font-bold text-emerald-600 dark:text-emerald-400">$ coco audit</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">Audit Report</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-slate-400 leading-relaxed">
              Generates an automated municipal budget allocation vs expenditure audit with compliance signature.
            </p>
            <button
              onClick={() => handleQuickRun('coco audit')}
              className="w-full bg-neutral-100 dark:bg-slate-800 hover:bg-neutral-200 dark:hover:bg-slate-700 text-neutral-900 dark:text-slate-200 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center space-x-1 transition active:scale-95"
            >
              <Play className="w-3 h-3 fill-current text-emerald-500" />
              <span>Generate Audit</span>
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Modal */}
      <CoCoTerminalModal
        isOpen={isTerminalOpen}
        onClose={() => setIsTerminalOpen(false)}
        initialCommand={activeModalCommand}
      />
    </div>
  );
};
export default CoCoAgentWorkspace;
