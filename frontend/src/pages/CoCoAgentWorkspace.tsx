import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const { user } = useAuth();
  const navigate = useNavigate();

  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [activeModalCommand, setActiveModalCommand] = useState('coco status');

  // Strict Security RBAC Route Guard
  useEffect(() => {
    if (user && user.role !== 'Administrator') {
      showToast('⛔ Security RBAC: Administrator role required to access CoCo CLI Agent', 'error');
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  if (user && user.role !== 'Administrator') {
    return null;
  }

  const handleQuickRun = (cmd: string) => {
    setActiveModalCommand(cmd);
    setIsTerminalOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-4 sm:p-6 space-y-8 max-w-7xl mx-auto w-full overflow-x-hidden">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800/80 pb-6">
        <div>
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-[#29b5e8]/10 text-[#29b5e8] rounded-lg border border-[#29b5e8]/20">
              <Terminal className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold font-sans tracking-tight">
              CoCo CLI Agent & Automation Workspace
            </h1>
          </div>
          <p className="text-slate-400 text-sm max-w-2xl font-sans">
            Command-line automation suite for Snowflake database management, Cortex AI query execution, and public works expenditure audit pipelines.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <SnowflakeBadge variant="coco" />
          <button
            onClick={() => handleQuickRun('coco status')}
            className="bg-[#29b5e8] hover:bg-[#1fa0d0] text-slate-950 font-sans font-semibold px-4 py-2 rounded-lg text-sm flex items-center space-x-2 transition shadow-lg shadow-[#29b5e8]/20"
          >
            <Terminal className="w-4 h-4" />
            <span>Launch CLI Terminal</span>
          </button>
        </div>
      </div>

      {/* System Diagnostics Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">CLI Agent Status</span>
            <Cpu className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-slate-100">ONLINE (v1.0.0)</div>
          <div className="flex items-center space-x-1.5 text-xs text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Snowflake CoCo 2026 Ready</span>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Database Engine</span>
            <Database className="w-4 h-4 text-[#29b5e8]" />
          </div>
          <div className="text-xl font-bold text-slate-100">CIVIC_TRANSPARENCY_DB</div>
          <div className="text-xs text-slate-400">Warehouse: COMPUTE_WH</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Cortex AI Model</span>
            <Zap className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-slate-100">llama3-70b</div>
          <div className="text-xs text-purple-400">SNOWFLAKE.CORTEX.COMPLETE</div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 p-5 rounded-xl space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-semibold uppercase tracking-wider">Compliance Audit</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-emerald-400">81.38% Spent</div>
          <div className="text-xs text-slate-400">0 Risk Flags Detected</div>
        </div>
      </div>

      {/* Available CLI Agent Commands Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold font-sans flex items-center space-x-2">
          <Code className="w-5 h-5 text-[#29b5e8]" />
          <span>CoCo Agent CLI Command Suite</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-3 hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-[#29b5e8]">coco status</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Diagnostic</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Audits system health, FastAPI readiness, Snowflake DB connection schema, and Cortex AI model availability.
            </p>
            <button
              onClick={() => handleQuickRun('coco status')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 rounded text-xs font-semibold flex items-center justify-center space-x-1 transition"
            >
              <Play className="w-3 h-3 fill-current text-[#29b5e8]" />
              <span>Run Status Check</span>
            </button>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-3 hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-purple-400">coco cortex</span>
              <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded border border-purple-500/20">Cortex LLM</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Queries Snowflake Cortex AI engine via terminal parameters for instant municipal intelligence summaries.
            </p>
            <button
              onClick={() => handleQuickRun('coco cortex --prompt "Summarize high-cost infrastructure projects"')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 rounded text-xs font-semibold flex items-center justify-center space-x-1 transition"
            >
              <Play className="w-3 h-3 fill-current text-purple-400" />
              <span>Query Cortex AI</span>
            </button>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-3 hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-emerald-400">coco audit</span>
              <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded border border-emerald-500/20">Audit Report</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates an automated municipal budget allocation vs expenditure audit with compliance signature.
            </p>
            <button
              onClick={() => handleQuickRun('coco audit')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 rounded text-xs font-semibold flex items-center justify-center space-x-1 transition"
            >
              <Play className="w-3 h-3 fill-current text-emerald-400" />
              <span>Generate Audit</span>
            </button>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-3 hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-amber-400">coco ingest</span>
              <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2 py-0.5 rounded border border-amber-500/20">Data Pipeline</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Triggers the automated data ingestion pipeline to seed or reload projects, budgets, and feedback records.
            </p>
            <button
              onClick={() => handleQuickRun('coco ingest --dataset all')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 rounded text-xs font-semibold flex items-center justify-center space-x-1 transition"
            >
              <Play className="w-3 h-3 fill-current text-amber-400" />
              <span>Trigger Pipeline</span>
            </button>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-3 hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-[#29b5e8]">coco benchmark</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Performance</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Benchmarks request latency between local client cache, Snowpark queries, and Cortex LLM inference.
            </p>
            <button
              onClick={() => handleQuickRun('coco benchmark')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 rounded text-xs font-semibold flex items-center justify-center space-x-1 transition"
            >
              <Play className="w-3 h-3 fill-current text-[#29b5e8]" />
              <span>Run Benchmark</span>
            </button>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-xl space-y-3 hover:border-slate-700 transition">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm font-bold text-slate-300">coco health</span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">Fast Ping</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Executes lightweight service ping to ensure API Gateway and database adapters respond in under 2ms.
            </p>
            <button
              onClick={() => handleQuickRun('coco health')}
              className="w-full bg-slate-800 hover:bg-slate-700 text-slate-200 py-1.5 rounded text-xs font-semibold flex items-center justify-center space-x-1 transition"
            >
              <Play className="w-3 h-3 fill-current text-slate-400" />
              <span>Ping Health</span>
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
