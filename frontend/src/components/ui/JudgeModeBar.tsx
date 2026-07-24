import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../providers/AuthProvider';
import { ChevronRight, Eye, Terminal, Bug, X, Trash2, CheckCircle2, AlertTriangle, RefreshCw } from 'lucide-react';
import { subscribeApiLogs, clearApiDebugLogs, ApiDebugLog } from '../../lib/axios';

export const JudgeModeBar: React.FC = () => {
  const { user, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const [logs, setLogs] = useState<ApiDebugLog[]>([]);
  const [showDebugModal, setShowDebugModal] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ApiDebugLog | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeApiLogs((newLogs) => {
      setLogs(newLogs);
    });
    return () => unsubscribe();
  }, []);

  const hasError = logs.some((l) => typeof l.status === 'number' && l.status >= 400);

  return (
    <>
      <div className="sticky top-0 z-50 w-full bg-neutral-900/95 text-white backdrop-blur border-b border-neutral-800 shadow-md transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center justify-between gap-4 text-xs">
          {/* Left: Live Session Branding */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/30 font-semibold uppercase tracking-wider text-[10px]">
              <Eye className="w-3 h-3 text-sky-400" />
              Live Snowflake Terminal
            </span>
            <span className="hidden md:flex items-center gap-2 text-neutral-400 text-[11px]">
              <span>Active Persona:</span>
              {/* Quick Role Switcher Dropdown */}
              <select
                value={user?.role || 'Auditor'}
                onChange={(e) => {
                  const role = e.target.value as any;
                  loginAsDemo(role);
                }}
                className="bg-neutral-950 text-emerald-400 border border-neutral-700 px-2 py-0.5 rounded text-[11px] font-bold cursor-pointer focus:outline-none"
              >
                <option value="Auditor">🕵️ Auditor (Full Proof Access)</option>
                <option value="Government Official">🏛️ Government Official</option>
                <option value="Citizen">👤 Citizen Persona</option>
              </select>
              <span className="text-[10px] text-amber-400 font-mono bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                🔒 Ephemeral Sandbox (Not Saved)
              </span>
            </span>
          </div>

          {/* Right: Direct Actions */}
          <div className="flex items-center gap-2">
            {/* Take Demo Tour Button */}
            <button
              onClick={() => window.dispatchEvent(new Event('start-guided-tour'))}
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 bg-emerald-500/10 px-2.5 py-1 rounded-md border border-emerald-500/20 font-medium"
            >
              <span>Take Demo Tour</span>
            </button>

            {/* Live Debugger Toggle */}
            <button
              onClick={() => setShowDebugModal(true)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-semibold transition-all ${
                hasError
                  ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                  : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
              }`}
            >
              <Bug className="w-3.5 h-3.5" />
              <span>F12 Debugger ({logs.length})</span>
            </button>

            <button
              onClick={() => navigate('/coco-agent')}
              className="hidden sm:flex items-center gap-1 text-[#29b5e8] hover:text-sky-200 bg-[#29b5e8]/10 px-2.5 py-1 rounded-md border border-[#29b5e8]/30 font-medium"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>CoCo Agent CLI</span>
            </button>

            <button
              onClick={() => navigate('/dashboard/chat')}
              className="hidden sm:flex items-center gap-1 text-sky-400 hover:text-sky-300 bg-sky-500/10 px-2.5 py-1 rounded-md border border-sky-500/20 font-medium"
            >
              <span>Ask Cortex AI</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>
      </div>

      {/* Onscreen Debugger Modal Drawer */}
      {showDebugModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end animate-fade-in text-left">
          <div className="w-full max-w-2xl bg-neutral-950 border-l border-neutral-800 h-full flex flex-col shadow-2xl text-neutral-200">
            {/* Header */}
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900/60">
              <div className="flex items-center space-x-2">
                <Bug className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-bold text-white">Live F12 Snowflake API Debugger</h3>
                <span className="text-[10px] bg-sky-950 text-sky-400 border border-sky-800/60 px-2 py-0.5 rounded font-mono">
                  {logs.length} API Events Logged
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => clearApiDebugLogs()}
                  className="p-1.5 text-neutral-400 hover:text-rose-400 rounded hover:bg-neutral-800 transition-colors"
                  title="Clear Debug Logs"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setShowDebugModal(false)}
                  className="p-1.5 text-neutral-400 hover:text-white rounded hover:bg-neutral-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Hint Banner */}
            <div className="p-3 bg-sky-950/30 border-b border-sky-900/40 text-[11px] text-sky-300 flex items-center gap-2 font-mono">
              <span>💡 Tip: Press <kbd className="bg-neutral-800 px-1 py-0.5 rounded text-white">F12</kbd> → <strong>Console</strong> tab in your browser for colorized raw HTTP request objects.</span>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
              {logs.length === 0 ? (
                <div className="py-16 text-center text-neutral-500 space-y-2">
                  <Bug className="w-8 h-8 mx-auto text-neutral-700" />
                  <p>No API requests captured yet.</p>
                  <p className="text-[10px]">Perform actions like logging in, registering, or querying Cortex AI to see live traffic!</p>
                </div>
              ) : (
                logs.map((log) => {
                  const isOk = typeof log.status === 'number' && log.status >= 200 && log.status < 300;
                  const isErr = typeof log.status === 'number' && log.status >= 400;

                  return (
                    <div
                      key={log.id}
                      onClick={() => setSelectedLog(selectedLog?.id === log.id ? null : log)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        isErr
                          ? 'bg-rose-950/20 border-rose-900/60 hover:border-rose-700'
                          : isOk
                          ? 'bg-neutral-900 border-neutral-800 hover:border-sky-700'
                          : 'bg-neutral-900 border-neutral-800'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center space-x-2">
                          {isOk && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
                          {isErr && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
                          {log.status === 'PENDING' && <RefreshCw className="w-4 h-4 text-sky-400 animate-spin shrink-0" />}
                          <span className="font-bold text-sky-300">{log.method}</span>
                          <span className="text-neutral-300 truncate max-w-xs">{log.url}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          {log.durationMs !== undefined && (
                            <span className="text-[10px] text-neutral-400">{log.durationMs}ms</span>
                          )}
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isOk
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/50'
                                : isErr
                                ? 'bg-rose-950 text-rose-400 border border-rose-800/50'
                                : 'bg-sky-950 text-sky-400'
                            }`}
                          >
                            {log.status}
                          </span>
                        </div>
                      </div>

                      {/* Error details */}
                      {log.errorDetail && (
                        <div className="mt-2 p-2 rounded bg-rose-950/40 border border-rose-900/60 text-rose-300 text-[11px]">
                          <strong>Error:</strong> {log.errorDetail}
                        </div>
                      )}

                      {/* Expanded JSON Inspector */}
                      {selectedLog?.id === log.id && (
                        <div className="mt-3 pt-3 border-t border-neutral-800 space-y-2 text-[10px]">
                          {log.requestData && (
                            <div>
                              <span className="text-neutral-400 uppercase font-bold block mb-1">Request Payload:</span>
                              <pre className="p-2 rounded bg-black/60 text-neutral-300 overflow-x-auto">
                                {JSON.stringify(log.requestData, null, 2)}
                              </pre>
                            </div>
                          )}
                          {log.responseData && (
                            <div>
                              <span className="text-neutral-400 uppercase font-bold block mb-1">Response Data:</span>
                              <pre className="p-2 rounded bg-black/60 text-emerald-300 overflow-x-auto">
                                {JSON.stringify(log.responseData, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
