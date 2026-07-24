import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Sparkles, 
  User, 
  Send,
  Code,
  Filter,
  FileText,
  Volume2,
  VolumeX,
  Download,
  Plus,
  Trash2,
  ExternalLink,
  Bot,
  Copy,
  Check,
  PanelLeftOpen,
  PanelLeftClose
} from 'lucide-react';
import { SnowflakeBadge } from '../components/ui/SnowflakeBadge';
import { DocumentProofModal } from '../components/ui/DocumentProofModal';
import { sendAIChatQuery, fetchAIModels, CortexModelInfo, AIChatMessageTurn } from '../services/api';
import { getProjectTitleForDoc } from '../utils/documentCatalog';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sourceBadge?: string;
  datasetUsed?: string;
  confidence?: number;
  sqlPreview?: string;
  pdfAttachmentName?: string;
  pdfSnippet?: string;
  followUps?: string[];
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: Message[];
}

const FormattedMessageText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  const lines = text.split('\n');

  return (
    <div className="space-y-1.5 leading-relaxed text-xs sm:text-sm text-neutral-800 dark:text-neutral-200">
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={idx} className="h-1" />;

        const renderFormatted = (str: string) => {
          const parts = str.split(/(\*\*.*?\*\*|`.*?`)/g);
          return parts.map((part, pIdx) => {
            if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
              return (
                <strong key={pIdx} className="font-bold text-neutral-900 dark:text-white">
                  {part.slice(2, -2)}
                </strong>
              );
            }
            if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
              return (
                <code key={pIdx} className="px-1.5 py-0.5 rounded bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono text-[11px] font-medium">
                  {part.slice(1, -1)}
                </code>
              );
            }
            return part;
          });
        };

        if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
          const content = trimmed.replace(/^[•-]\s*/, '');
          return (
            <div key={idx} className="flex items-start gap-2 pl-1 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0 mt-1.5" />
              <div className="flex-1">{renderFormatted(content)}</div>
            </div>
          );
        }

        if (trimmed.startsWith('📄') || trimmed.startsWith('⚠️') || trimmed.startsWith('💡')) {
          return (
            <div key={idx} className="font-semibold text-neutral-900 dark:text-white pt-1 pb-0.5">
              {renderFormatted(trimmed)}
            </div>
          );
        }

        return <p key={idx}>{renderFormatted(line)}</p>;
      })}
    </div>
  );
};


export const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const [selectedDataset, setSelectedDataset] = useState('All Datasets (Snowflake Hybrid)');
  const [selectedModel, setSelectedModel] = useState('llama3-70b');
  const [availableModels, setAvailableModels] = useState<CortexModelInfo[]>([
    {
      id: 'llama3-70b',
      name: 'Cortex Llama 3 70B',
      provider: 'Meta / Snowflake Cortex',
      description: 'Optimized for civic data reasoning & audit analytics',
      badge: 'Recommended'
    },
    {
      id: 'llama3.1-405b',
      name: 'Cortex Llama 3.1 405B',
      provider: 'Meta / Snowflake Cortex',
      description: 'Frontier AI model for deep technical verification',
      badge: 'Frontier AI'
    },
    {
      id: 'mistral-large',
      name: 'Cortex Mistral Large',
      provider: 'Mistral AI / Snowflake Cortex',
      description: 'Multilingual contract & technical audit evaluation',
      badge: 'Enterprise'
    }
  ]);

  // Session State - Lazy Initializer from localStorage
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    try {
      const saved = localStorage.getItem('salay_chat_sessions');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to parse saved chat sessions:', e);
    }
    return [
      {
        id: 'sess-default',
        title: 'Infrastructure & Budget Analysis',
        createdAt: new Date().toLocaleDateString(),
        messages: [
          {
            id: 'welcome-msg',
            sender: 'ai',
            text: 'Welcome to **SALAY AI Analyst Workspace** powered by **Snowflake Cortex AI (`llama3-70b`)**. Ask questions about infrastructure budgets, public works progress, citizen reports, or search through attached PDF audit document proofs.',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sourceBadge: 'Cortex AI (llama3-70b)',
            datasetUsed: 'Snowflake Hybrid DB & Cortex Search PDF Stage',
            confidence: 0.99,
            followUps: [
              'Inspect Davao Tunnel technical audit document.',
              'Which infrastructure projects exceeded budget?',
              'Summarize citizen complaints.'
            ]
          }
        ]
      }
    ];
  });

  const [activeSessionId, setActiveSessionId] = useState<string>(() => {
    return sessions[0]?.id || 'sess-default';
  });

  const [showDrawer, setShowDrawer] = useState(false);

  // Modal & Auxiliary state
  const [inspectDoc, setInspectDoc] = useState<string | null>(null);
  const [inspectSnippet, setInspectSnippet] = useState<string | undefined>(undefined);
  const [isTyping, setIsTyping] = useState(false);
  const [showSqlId, setShowSqlId] = useState<string | null>(null);
  const [copiedSqlId, setCopiedSqlId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Active session helper
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];

  const datasets = [
    'All Datasets (Snowflake Hybrid)',
    'Public Works Projects DB',
    'Municipal Budgets Registry',
    'Citizen Incident Reports',
    'Attached PDF Proof Documents (Cortex Search Stage)'
  ];

  const suggestedQuestions = [
    'Inspect Davao Tunnel technical audit document.',
    'Which infrastructure projects exceeded budget?',
    'Search safety inspection findings in Maple_Bridge_Report.pdf',
    'Extract contract budget cap from Oakridge_Solar_Technical_Audit_Proof.pdf',
    'Show delayed road projects.'
  ];

  // Save sessions to localStorage whenever state mutates
  useEffect(() => {
    try {
      localStorage.setItem('salay_chat_sessions', JSON.stringify(sessions));
    } catch (e) {
      console.warn('Failed to persist chat sessions:', e);
    }
  }, [sessions]);

  useEffect(() => {
    fetchAIModels().then((res) => {
      if (res.models && res.models.length > 0) {
        setAvailableModels(res.models);
      }
    }).catch(() => {});
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeSession?.messages, isTyping]);

  // Handle Speech Synthesis
  const toggleSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      if (isSpeaking) {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
      } else {
        const cleanText = text.replace(/[*_#•`-]/g, '');
        const utterance = new SpeechSynthesisUtterance(cleanText);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        setIsSpeaking(true);
        window.speechSynthesis.speak(utterance);
      }
    }
  };

  const handleCreateNewSession = () => {
    const newId = `sess-${Date.now()}`;
    const newSession: ChatSession = {
      id: newId,
      title: `Audit Query ${sessions.length + 1}`,
      createdAt: new Date().toLocaleDateString(),
      messages: [
        {
          id: Math.random().toString(),
          sender: 'ai',
          text: `New conversation started with **${selectedModel}**. How can I assist with your civic audit analysis?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sourceBadge: `Cortex AI (${selectedModel})`,
          datasetUsed: selectedDataset,
          confidence: 0.99,
          followUps: suggestedQuestions.slice(0, 3)
        }
      ]
    };
    setSessions((prev) => [newSession, ...prev]);
    setActiveSessionId(newId);
  };

  const handleDeleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length === 1) return;
    setSessions((prev) => prev.filter((s) => s.id !== id));
    if (activeSessionId === id) {
      const remaining = sessions.filter((s) => s.id !== id);
      setActiveSessionId(remaining[0].id);
    }
  };

  const handleCopySql = (sql: string, id: string) => {
    navigator.clipboard.writeText(sql);
    setCopiedSqlId(id);
    setTimeout(() => setCopiedSqlId(null), 2000);
  };

  const handleExportReport = () => {
    const lines = [
      `# SALAY AI Civic Transparency Audit Report`,
      `Session ID: ${activeSession.id}`,
      `Date: ${new Date().toLocaleString()}`,
      `Model Used: ${selectedModel}`,
      `Scope: ${selectedDataset}`,
      `--------------------------------------------------\n`
    ];

    activeSession.messages.forEach((m) => {
      lines.push(`[${m.timestamp}] ${m.sender.toUpperCase()}:`);
      lines.push(`${m.text}\n`);
      if (m.pdfAttachmentName) {
        lines.push(`📄 Referenced Proof: ${m.pdfAttachmentName}`);
      }
      if (m.sqlPreview) {
        lines.push(`\`\`\`sql\n${m.sqlPreview}\n\`\`\``);
      }
      lines.push(`\n--------------------------------------------------\n`);
    });

    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SALAY_Audit_Report_${activeSession.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Append to current session
    setSessions((prev) =>
      prev.map((s) => {
        if (s.id === activeSessionId) {
          // Update title if default title
          const firstUserMsg = s.messages.find((m) => m.sender === 'user');
          const title = firstUserMsg ? s.title : text.trim().slice(0, 24) + '...';
          return {
            ...s,
            title,
            messages: [...s.messages, userMessage],
          };
        }
        return s;
      })
    );

    setInput('');
    setIsTyping(true);

    // 1. Shared Query Context Cache Check
    const cacheKey = `${selectedDataset}_${text.trim().toLowerCase()}`;
    const rawCache = localStorage.getItem('salay_context_cache');
    let contextCache: Record<string, any> = {};
    if (rawCache) {
      try { contextCache = JSON.parse(rawCache); } catch (e) {}
    }

    if (contextCache[cacheKey]) {
      const cached = contextCache[cacheKey];
      const aiMessage: Message = {
        id: Math.random().toString(),
        sender: 'ai',
        text: cached.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceBadge: `${cached.sourceBadge || selectedModel} (Shared Context Cache)`,
        datasetUsed: selectedDataset,
        confidence: cached.confidence || 0.99,
        sqlPreview: cached.sqlPreview,
        pdfAttachmentName: cached.pdfAttachmentName,
        pdfSnippet: cached.pdfSnippet,
        followUps: cached.followUps,
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId ? { ...s, messages: [...s.messages, aiMessage] } : s
        )
      );
      setIsTyping(false);

      if (cached.pdfAttachmentName && text.toLowerCase().includes('inspect')) {
        setInspectDoc(cached.pdfAttachmentName);
        setInspectSnippet(cached.pdfSnippet);
      }
      return;
    }

    // Build history
    const historyPayload: AIChatMessageTurn[] = activeSession.messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    try {
      const res = await sendAIChatQuery(
        text.trim(),
        activeSessionId,
        historyPayload,
        selectedModel,
        selectedDataset
      );

      const aiMessage: Message = {
        id: Math.random().toString(),
        sender: 'ai',
        text: res.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceBadge: `Cortex AI (${res.model_used || selectedModel})`,
        datasetUsed: selectedDataset,
        confidence: res.confidence_score || 0.96,
        sqlPreview: res.generated_sql || `SELECT * FROM CIVIC_TRANSPARENCY_DB.PUBLIC.PROJECTS;`,
        pdfAttachmentName: res.pdf_attachment_name || undefined,
        pdfSnippet: res.pdf_snippet || undefined,
        followUps: res.suggested_followups || suggestedQuestions.slice(0, 3),
      };

      // Store in Shared Query Context Cache
      contextCache[cacheKey] = {
        text: res.response,
        sourceBadge: res.model_used || selectedModel,
        sqlPreview: res.generated_sql,
        confidence: res.confidence_score || 0.96,
        pdfAttachmentName: res.pdf_attachment_name || undefined,
        pdfSnippet: res.pdf_snippet || undefined,
        followUps: res.suggested_followups,
      };
      try {
        localStorage.setItem('salay_context_cache', JSON.stringify(contextCache));
      } catch (e) {}

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId ? { ...s, messages: [...s.messages, aiMessage] } : s
        )
      );

      // Auto-open PDF modal if directly requested
      if (res.pdf_attachment_name && text.toLowerCase().includes('inspect')) {
        setInspectDoc(res.pdf_attachment_name);
        setInspectSnippet(res.pdf_snippet);
      }
    } catch (err) {
      const errorMessage: Message = {
        id: Math.random().toString(),
        sender: 'ai',
        text: 'Error querying Snowflake Cortex AI. Please check server connection.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        sourceBadge: 'Cortex AI (Error)',
      };
      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSessionId ? { ...s, messages: [...s.messages, errorMessage] } : s
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-[calc(100dvh-105px)] md:h-[calc(100vh-120px)] max-w-7xl mx-auto gap-2 md:gap-4 animate-fade-in text-left relative overflow-hidden md:overflow-visible">
      
      {/* Sessions History Drawer */}
      {showDrawer && (
        <>
          {/* Mobile Backdrop */}
          <div
            className="md:hidden fixed inset-0 z-40 bg-neutral-950/60 backdrop-blur-xs"
            onClick={() => setShowDrawer(false)}
          />

          {/* Drawer Container (Slide-over on mobile, Inline on desktop) */}
          <div className="fixed md:relative inset-y-0 left-0 z-50 md:z-auto w-72 md:w-64 flex flex-col bg-white dark:bg-neutral-900 border-r md:border border-neutral-200 dark:border-neutral-800 p-3 shadow-2xl md:shadow-sm shrink-0 space-y-3 md:rounded-2xl h-full">
            <div className="flex items-center justify-between px-2 pt-2 md:pt-0">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1.5">
                <Bot className="w-3.5 h-3.5 text-sky-500" />
                Saved Sessions
              </h3>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleCreateNewSession}
                  className="p-1.5 rounded-lg bg-sky-500/10 text-sky-500 hover:bg-sky-500 hover:text-white transition-all text-xs font-semibold flex items-center gap-1"
                  title="New Chat Session"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setShowDrawer(false)}
                  className="md:hidden p-1.5 rounded-lg text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
                >
                  <PanelLeftClose className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {sessions.map((s) => (
                <div
                  key={s.id}
                  onClick={() => {
                    setActiveSessionId(s.id);
                    setShowDrawer(false);
                  }}
                  className={`group flex items-center justify-between p-2.5 rounded-xl text-xs font-medium cursor-pointer transition-all ${
                    s.id === activeSessionId
                      ? 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20'
                      : 'text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <div className="truncate pr-2">
                    <p className="truncate font-semibold">{s.title}</p>
                    <p className="text-[10px] text-neutral-400">{s.createdAt}</p>
                  </div>
                  {sessions.length > 1 && (
                    <button
                      onClick={(e) => handleDeleteSession(s.id, e)}
                      className="opacity-80 md:opacity-0 group-hover:opacity-100 p-1 text-neutral-400 hover:text-rose-500 transition-all"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col space-y-2.5 sm:space-y-3 min-w-0 h-full">
        
        {/* 1. Header Toolbar & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-2.5 sm:p-3.5 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <button
              onClick={() => setShowDrawer(!showDrawer)}
              className="p-1.5 sm:p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:text-sky-500 transition-all shrink-0"
              title="Toggle Sessions Drawer"
            >
              {showDrawer ? <PanelLeftClose className="w-4 h-4" /> : <PanelLeftOpen className="w-4 h-4" />}
            </button>

            <div className="p-1.5 sm:p-2 rounded-xl bg-sky-500/10 text-sky-500 border border-sky-500/20 shrink-0">
              <Cpu className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h1 className="text-xs sm:text-base font-bold text-neutral-900 dark:text-white truncate">
                  Cortex AI Analyst
                </h1>
                <div className="hidden xs:inline-flex">
                  <SnowflakeBadge variant="cortex" label={selectedModel} size="sm" />
                </div>
                <span className="hidden lg:inline-flex px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-bold uppercase tracking-wider">
                  ⚡ Free-Tier Token Saver Active
                </span>
              </div>
              <p className="hidden sm:block text-xs text-neutral-500 truncate max-w-md">
                Lightweight grounded search across live Snowflake tables & PDF audit proofs
              </p>
            </div>

            <button
              onClick={handleExportReport}
              className="sm:hidden p-1.5 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all text-xs font-semibold shrink-0"
              title="Download Session Report"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Model & Dataset Selectors */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pt-1 sm:pt-0 border-t sm:border-t-0 border-neutral-100 dark:border-neutral-800 shrink-0">
            {/* Model Selector */}
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 text-[11px] sm:text-xs font-semibold px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none cursor-pointer flex-1 sm:flex-none max-w-[150px] sm:max-w-none truncate"
            >
              {availableModels.map((m) => (
                <option key={m.id} value={m.id} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                  {m.name} {m.badge ? `(${m.badge})` : ''}
                </option>
              ))}
            </select>

            {/* Dataset Scope */}
            <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 px-2 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-neutral-200 dark:border-neutral-700 flex-1 sm:flex-none min-w-0">
              <Filter className="w-3 h-3 text-neutral-400 shrink-0" />
              <select
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value)}
                className="bg-transparent text-[11px] sm:text-xs text-neutral-800 dark:text-neutral-200 font-medium focus:outline-none cursor-pointer w-full max-w-[150px] sm:max-w-none truncate"
              >
                {datasets.map((d) => (
                  <option key={d} value={d} className="bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white">
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Export Markdown Report (Desktop) */}
            <button
              onClick={handleExportReport}
              className="hidden sm:flex p-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-all text-xs font-semibold items-center gap-1 shrink-0"
              title="Download Session Report"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 2. Messages Conversation View */}
        <div className="flex-1 overflow-y-auto p-2.5 sm:p-4 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-sm space-y-3 sm:space-y-4 min-w-0">
          {activeSession.messages.map((m) => (
            <div
              key={m.id}
              className={`flex gap-2 sm:gap-3 text-xs ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-500 flex items-center justify-center shrink-0">
                  <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              )}

              <div className={`space-y-2 max-w-[88%] sm:max-w-2xl ${m.sender === 'user' ? 'items-end text-right' : 'items-start'}`}>
                <div
                  className={`p-3 sm:p-4 rounded-2xl break-words ${
                    m.sender === 'user'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-neutral-100 dark:bg-neutral-800/80 text-neutral-900 dark:text-neutral-100 border border-neutral-200 dark:border-neutral-700'
                  }`}
                >
                  <FormattedMessageText text={m.text} />

                  {/* PDF Document Proof Badge */}
                  {m.pdfAttachmentName && (
                    <div className="mt-3 p-2.5 sm:p-3 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-600 dark:text-sky-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs font-semibold">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-4 h-4 text-sky-500 shrink-0" />
                        <span className="truncate">Attached Proof: <strong>{getProjectTitleForDoc(m.pdfAttachmentName)}</strong></span>
                      </div>
                      <button
                        onClick={() => {
                          setInspectDoc(m.pdfAttachmentName || null);
                          setInspectSnippet(m.pdfSnippet);
                        }}
                        className="w-full sm:w-auto justify-center px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-[11px] font-bold flex items-center gap-1 shadow-xs transition-all active:scale-95 shrink-0"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Inspect Proof</span>
                      </button>
                    </div>
                  )}

                  {/* SQL Preview Toggle */}
                  {m.sqlPreview && (
                    <div className="mt-3 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                      <button
                        onClick={() => setShowSqlId(showSqlId === m.id ? null : m.id)}
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-500 hover:underline"
                      >
                        <Code className="w-3 h-3" />
                        <span>{showSqlId === m.id ? 'Hide Source SQL' : 'View Source SQL Query'}</span>
                      </button>

                      {showSqlId === m.id && (
                        <div className="relative mt-2 p-2.5 sm:p-3 rounded-xl bg-neutral-950 font-mono text-[10px] sm:text-[11px] text-emerald-400 border border-neutral-800 overflow-x-auto max-w-full">
                          <button
                            onClick={() => handleCopySql(m.sqlPreview || '', m.id)}
                            className="absolute top-2 right-2 p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] font-semibold flex items-center gap-1 z-10"
                          >
                            {copiedSqlId === m.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                            <span>{copiedSqlId === m.id ? 'Copied' : 'Copy'}</span>
                          </button>
                          <pre className="pr-16">{m.sqlPreview}</pre>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* AI Follow-up Suggestions Chips */}
                {m.sender === 'ai' && m.followUps && m.followUps.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {m.followUps.map((f) => (
                      <button
                        key={f}
                        onClick={() => handleSend(f)}
                        className="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500 hover:text-white border border-sky-500/20 text-sky-600 dark:text-sky-400 text-[11px] font-medium transition-all active:scale-95 text-left max-w-full truncate"
                      >
                        💡 {f}
                      </button>
                    ))}
                  </div>
                )}

                {/* AI Footer Metadata */}
                {m.sender === 'ai' && (
                  <div className="flex flex-wrap items-center gap-2 text-[10px] text-neutral-400 px-1">
                    {m.sourceBadge && <SnowflakeBadge variant="cortex" label={m.sourceBadge} size="sm" />}
                    {m.confidence !== undefined && <span>Confidence: {(m.confidence * 100).toFixed(1)}%</span>}
                    <span>• {m.timestamp}</span>
                    <button
                      onClick={() => toggleSpeech(m.text)}
                      className="p-1 hover:text-sky-500 transition-all flex items-center gap-0.5 ml-1"
                      title="Read Response Aloud"
                    >
                      {isSpeaking ? <VolumeX className="w-3 h-3 text-sky-500 animate-pulse" /> : <Volume2 className="w-3 h-3" />}
                    </button>
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              )}
            </div>
          ))}

          {isTyping && (
            <div className="flex gap-2 sm:gap-3 text-xs items-center">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0 animate-pulse">
                <Cpu className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              </div>
              <div className="px-3.5 py-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-500 flex items-center gap-2 text-[11px] sm:text-xs">
                <Sparkles className="w-3.5 h-3.5 text-sky-500 animate-spin shrink-0" />
                <span>Cortex AI is querying Snowflake context & scanning PDF audit proofs...</span>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* 3. Dynamic Suggested Prompts */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 shrink-0 max-w-full">
          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 flex items-center gap-1 shrink-0">
            <Sparkles className="w-3 h-3 text-sky-500" /> Prompts:
          </span>
          {suggestedQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1.5 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-sky-500/50 text-neutral-700 dark:text-neutral-300 text-[11px] sm:text-xs transition-all active:scale-95 text-left shrink-0 whitespace-nowrap"
            >
              {q}
            </button>
          ))}
        </div>

        {/* 4. Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2 shrink-0"
        >
          <input
            type="text"
            placeholder="Ask Cortex AI or search PDF proofs..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 px-3.5 py-2.5 sm:py-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-xs text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm min-w-0"
          />
          <button
            type="submit"
            className="px-3.5 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs shadow-sm transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>
      </div>

      {/* PDF Document Proof Inspector Modal */}
      <DocumentProofModal
        isOpen={!!inspectDoc}
        onClose={() => setInspectDoc(null)}
        filename={inspectDoc}
        snippet={inspectSnippet}
        onAskAIAboutDoc={(doc) => handleSend(`Summarize technical audit findings in document ${doc}`)}
      />
    </div>
  );
};

