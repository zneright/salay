import React, { useState, useEffect, useRef } from 'react';
import { Terminal, X, Play, Copy, Check, RefreshCw, Cpu, ShieldCheck, Zap } from 'lucide-react';
import { showToast } from './Toast';
import { httpClient } from '../../lib/axios';

interface CoCoTerminalModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCommand?: string;
}

interface CommandLog {
  id: string;
  command: string;
  output: any;
  elapsed_ms: number;
  timestamp: string;
  status: 'SUCCESS' | 'ERROR';
}

export const CoCoTerminalModal: React.FC<CoCoTerminalModalProps> = ({
  isOpen,
  onClose,
  initialCommand = 'coco status',
}) => {
  const [input, setInput] = useState(initialCommand);
  const [logs, setLogs] = useState<CommandLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      if (logs.length === 0) {
        handleExecute(initialCommand);
      }
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  if (!isOpen) return null;

  const presetCommands = [
    { label: 'coco status', cmd: 'coco status', icon: Cpu },
    { label: 'coco cortex', cmd: 'coco cortex --prompt "Summarize municipal budget allocation"', icon: Zap },
    { label: 'coco audit', cmd: 'coco audit', icon: ShieldCheck },
    { label: 'coco ingest', cmd: 'coco ingest --dataset all', icon: RefreshCw },
    { label: 'coco benchmark', cmd: 'coco benchmark', icon: Terminal },
  ];

  const parseCommand = (fullCmd: string) => {
    const trimmed = fullCmd.trim();
    let commandName = trimmed.replace(/^coco\s+/, '').split(' ')[0];
    if (!commandName) commandName = 'status';

    let prompt = '';
    let dataset = 'all';

    if (trimmed.includes('--prompt')) {
      const match = trimmed.match(/--prompt\s+["']?([^"']+)["']?/);
      if (match) prompt = match[1];
    }

    if (trimmed.includes('--dataset')) {
      const match = trimmed.match(/--dataset\s+(\w+)/);
      if (match) dataset = match[1];
    }

    return { commandName, prompt, dataset };
  };

  const handleExecute = async (commandToRun?: string) => {
    const rawCmd = commandToRun || input;
    if (!rawCmd.trim() || isLoading) return;

    setIsLoading(true);
    const { commandName, prompt, dataset } = parseCommand(rawCmd);

    try {
      // API backend execution call via httpClient
      const res = await httpClient.post('/cli/execute', {
        command: commandName,
        prompt,
        dataset,
      });

      const data = res.data;
      setLogs((prev) => [
        ...prev,
        {
          id: data.id || `cli-${Date.now()}`,
          command: rawCmd,
          output: data.output,
          elapsed_ms: data.elapsed_ms || 15.4,
          timestamp: new Date().toLocaleTimeString(),
          status: 'SUCCESS',
        },
      ]);
    } catch (err: any) {
      setLogs((prev) => [
        ...prev,
        {
          id: `cli-err-${Date.now()}`,
          command: rawCmd,
          output: {
            status: 'ERROR',
            message: `Failed to execute command on backend API. ${err?.message || ''}`,
          },
          elapsed_ms: 0,
          timestamp: new Date().toLocaleTimeString(),
          status: 'ERROR',
        },
      ]);
    } finally {

      setIsLoading(false);
      setInput('coco ');
    }
  };

  const handleCopyLogs = () => {
    const text = logs
      .map((l) => `[$ ${l.command}]\n${JSON.stringify(l.output, null, 2)}`)
      .join('\n\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    showToast('Terminal logs copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fade-in">
      <div className="w-full max-w-4xl bg-slate-950 border border-slate-800 rounded-xl shadow-2xl overflow-hidden flex flex-col h-[650px] font-mono text-sm">
        
        {/* Terminal Window Top Bar */}
        <div className="bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/80" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <div className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <div className="flex items-center space-x-2 text-slate-300 font-semibold text-xs border-l border-slate-800 pl-3">
              <Terminal className="w-4 h-4 text-[#29b5e8]" />
              <span>SALAY CoCo CLI Agent Terminal</span>
              <span className="text-[10px] bg-[#29b5e8]/10 text-[#29b5e8] px-2 py-0.5 rounded border border-[#29b5e8]/30">
                CoCo Hackathon 2026
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyLogs}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition text-xs flex items-center space-x-1"
              title="Copy Output Logs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">Copy Logs</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Command Chips */}
        <div className="bg-slate-900/50 border-b border-slate-800/60 px-4 py-2 flex items-center space-x-2 overflow-x-auto text-xs scrollbar-none">
          <span className="text-slate-500 font-sans font-medium text-[11px] shrink-0">Quick Actions:</span>
          {presetCommands.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={() => {
                  setInput(item.cmd);
                  handleExecute(item.cmd);
                }}
                className="shrink-0 flex items-center space-x-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white px-2.5 py-1 rounded border border-slate-700 transition"
              >
                <Icon className="w-3 h-3 text-[#29b5e8]" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Log Viewer Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950 text-slate-200 leading-relaxed font-mono">
          <div className="text-xs text-slate-500 border-b border-slate-900 pb-2">
            SALAY CoCo Agent Pipeline v1.0.0 [Ready] • Snowflake Cortex Connected
          </div>

          {logs.map((log) => (
            <div key={log.id} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold">
                <div className="flex items-center space-x-2 text-[#29b5e8]">
                  <span>$</span>
                  <span className="text-slate-100 font-bold">{log.command}</span>
                </div>
                <span className="text-[10px] text-slate-500">{log.elapsed_ms}ms • {log.timestamp}</span>
              </div>
              <pre className="bg-slate-900/90 text-emerald-400 p-3 rounded border border-slate-800/80 text-xs overflow-x-auto whitespace-pre-wrap break-all max-w-full leading-relaxed shadow-inner">
                {typeof log.output === 'string'
                  ? log.output
                  : JSON.stringify(log.output, null, 2)}
              </pre>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-xs text-[#29b5e8] animate-pulse py-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Executing CoCo CLI command agent...</span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Command Input Area */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleExecute();
          }}
          className="bg-slate-900 border-t border-slate-800 p-3 flex items-center space-x-3"
        >
          <span className="text-[#29b5e8] font-bold text-base pl-2">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type 'coco status', 'coco cortex --prompt ...', 'coco audit'"
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 focus:outline-none font-mono text-sm"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#29b5e8] hover:bg-[#1fa0d0] text-slate-950 font-sans font-semibold px-3.5 py-1.5 rounded-lg text-xs flex items-center space-x-1.5 transition disabled:opacity-50"
          >
            <span>Run</span>
            <Play className="w-3.5 h-3.5 fill-current" />
          </button>
        </form>
      </div>
    </div>
  );
};
