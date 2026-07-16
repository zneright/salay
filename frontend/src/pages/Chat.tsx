import React, { useState, useEffect, useRef } from 'react';
import { 
  Cpu, 
  Sparkles, 
  MessageSquare, 
  ArrowRight, 
  User, 
  Send,
  Database
} from 'lucide-react';
import { showToast } from '../components/ui/Toast';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sourceBadge?: string;
  datasetUsed?: string;
  confidence?: number;
  followUps?: string[];
}

export const Chat: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const suggestedQuestions = [
    'Which infrastructure projects exceeded budget?',
    'Show delayed road projects.',
    'Summarize citizen complaints.',
    'Which barangays received the largest funding?',
    'Show projects completed this year.'
  ];

  const mockReplies: Record<string, string> = {
    'Which infrastructure projects exceeded budget?': 
      'Based on the **Municipal Budget Outlay Registry 2025**, the **Maple Street Bridge Safety Reconstruction** (PRJ-9904) has exceeded its current phase allocation by **₱350,000.00** due to safety reinforcement costs. Total spent is **₱4.8M** against a ₱4.5M phase cap.',
    'Show delayed road projects.': 
      'Currently, **1 road infrastructure project** is marked as Delayed:\n\n• **Maple Street Bridge Safety Reconstruction** (PRJ-9904)\n  * Location: East Ward District\n  * Timeline: Sep 2024 - Dec 2026 (14 weeks behind schedule)\n  * Progress: 42%',
    'Summarize citizen complaints.': 
      'Our analysis of the **Citizen Feedback dataset** shows **43 reports** in the last month. Sentiment breakdown is **68% Negative** (primarily regarding flooded roads and drainage blocks) and **32% Neutral/Positive** (pothole repairs feedback).\n\nKey hotspot: **Ward 4 (North Metro)** reports the highest complaint density.',
    'Which barangays received the largest funding?': 
      'The largest municipal departments funding allocation went to **Ward 4 (North Metro)** with **₱12.5M** allocated for high school solar installations, followed by the **Downtown Core** with **₱3.4M** for bus lane transit expansions.',
    'Show projects completed this year.': 
      'Completed projects registry: \n\n• **Metro Transit Line-C Bus Lane Expansion** (PRJ-1024)\n  * Budget: ₱3,400,000.00\n  * Completed: June 2025\n  * Scope: Downtown Transit Core'
  };

  const followUpsMap: Record<string, string[]> = {
    'Which infrastructure projects exceeded budget?': [
      'Show delayed road projects.',
      'Summarize citizen complaints.'
    ],
    'Show delayed road projects.': [
      'Which infrastructure projects exceeded budget?',
      'Show projects completed this year.'
    ],
    'Summarize citizen complaints.': [
      'Which barangays received the largest funding?',
      'Show delayed road projects.'
    ],
    'Which barangays received the largest funding?': [
      'Which infrastructure projects exceeded budget?',
      'Show projects completed this year.'
    ],
    'Show projects completed this year.': [
      'Show delayed road projects.',
      'Summarize citizen complaints.'
    ]
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate Snowflake Cortex latency
    await new Promise((resolve) => setTimeout(resolve, 800));

    let aiReply = "I'm sorry, I couldn't search that query in our local mock database. Try selecting one of the suggested questions above to check Snowflake Cortex integrations.";
    
    // Find closest match or exact suggested question key
    const matchKey = Object.keys(mockReplies).find(
      k => text.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(text.toLowerCase())
    );

    if (matchKey) {
      aiReply = mockReplies[matchKey];
    }

    const followUps = matchKey ? followUpsMap[matchKey] : undefined;
    const datasetName = matchKey 
      ? (matchKey.includes('complaint') ? 'citizen_feedback_2026.csv' : 'municipal_budgets_2025.csv')
      : 'snowflake_metadata_catalog';

    const aiMessage: Message = {
      id: Math.random().toString(),
      sender: 'ai',
      text: aiReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sourceBadge: 'Cortex Llama-3-70b',
      datasetUsed: datasetName,
      confidence: 96,
      followUps: followUps
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
    showToast('Cortex AI response compiled', 'success');
  };

  return (
    <div className="h-[78vh] flex flex-col justify-between border border-border bg-card/25 rounded-2xl overflow-hidden relative text-left">
      {/* Background grid line marker */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(128,128,128,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(128,128,128,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none" />

      {/* Chat header panel */}
      <div className="px-6 py-4 border-b border-border bg-card/85 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center space-x-2.5">
          <Cpu className="w-5 h-5 text-primary animate-pulse" />
          <div>
            <h3 className="text-base font-bold text-foreground">Ask SALAY</h3>
            <p className="text-[11px] text-muted-foreground">Verify public budgets, timelines, and feedback using Snowflake Cortex.</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-[10px] text-muted-foreground font-mono bg-secondary px-2.5 py-0.5 rounded border border-border">
          <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
          <span>Snowflake Cortex</span>
        </div>
      </div>

      {/* Messages body or Suggested Questions empty state */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center space-y-6 text-center max-w-lg mx-auto">
            <div className="p-5 bg-card border border-border rounded-2xl text-foreground shadow-sm">
              <MessageSquare className="w-8 h-8 text-primary mx-auto mb-2.5" />
              <h4 className="text-sm font-bold text-foreground">Civic Intelligent Search Engine</h4>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                This engine uses **Snowflake Cortex LLMs** to compile budgets, projects progress pipelines, and public feedback datasets. All audits are grounded strictly in municipality CSV tables.
              </p>
            </div>

            {/* Clickable suggested questions */}
            <div className="space-y-2.5 w-full text-left">
              <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider block px-1">Suggested Inquiries</span>
              <div className="grid grid-cols-1 gap-2">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="p-3 border border-border bg-card hover:bg-secondary rounded-xl text-left text-xs text-muted-foreground hover:text-foreground transition-all duration-250 flex items-center justify-between group active:scale-[0.99]"
                  >
                    <span>{q}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-foreground shrink-0 ml-2 transition-colors" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => {
              const isUser = m.sender === 'user';
              return (
                <div key={m.id} className={`flex items-start gap-3 max-w-[85%] ${isUser ? 'ml-auto flex-row-reverse text-right' : 'mr-auto'}`}>
                  {/* Avatar bubble */}
                  <div className={`p-2 rounded-full border border-border shrink-0 ${isUser ? 'bg-secondary text-foreground' : 'bg-secondary text-primary'}`}>
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Cpu className="w-3.5 h-3.5" />}
                  </div>

                  {/* Bubble text */}
                  <div className="space-y-1">
                    <div className={`p-4.5 rounded-2xl text-[13px] leading-relaxed text-left whitespace-pre-line border ${
                      isUser 
                        ? 'bg-secondary border-border text-foreground' 
                        : 'bg-card border-primary/20 text-foreground shadow-sm'
                    }`}>
                      {!isUser && (
                        <div className="flex items-center justify-between mb-3 pb-1.5 border-b border-border/40 text-[9px] text-muted-foreground font-mono select-none">
                          <span className="flex items-center space-x-1 font-bold text-primary">
                            <span>✨</span> <span>AI Summary</span>
                          </span>
                          <span className="flex items-center space-x-2">
                            <span>🤖 Cortex Response</span>
                            <span>•</span>
                            <span className="text-emerald-500 font-bold">{m.confidence}% Confidence</span>
                          </span>
                        </div>
                      )}
                      {m.text}

                      {/* Suggested Followups chips */}
                      {!isUser && m.followUps && m.followUps.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-border/40 space-y-2 select-none text-[11px]">
                          <span className="text-[9px] uppercase font-bold text-muted-foreground tracking-wider block">Suggested Follow-ups</span>
                          <div className="flex flex-wrap gap-2">
                            {m.followUps.map((f, fIdx) => (
                              <button
                                key={fIdx}
                                onClick={() => handleSend(f)}
                                className="px-3 py-1 bg-secondary hover:bg-muted border border-border rounded-full text-[10px] font-bold text-primary transition-all active:scale-[0.98]"
                              >
                                {f}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Source badges */}
                    <div className="flex items-center space-x-2.5 text-[9px] text-muted-foreground font-mono pt-1">
                      <span>{m.timestamp}</span>
                      {m.sourceBadge && (
                        <>
                          <span>•</span>
                          <span>{m.sourceBadge}</span>
                        </>
                      )}
                      {m.datasetUsed && (
                        <>
                          <span>•</span>
                          <span className="text-primary font-bold flex items-center space-x-1 bg-secondary/85 px-1.5 py-0.5 rounded border border-border/60">
                            <Database className="w-2.5 h-2.5" />
                            <span>{m.datasetUsed}</span>
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            
            {/* AI Typing loader */}
            {isTyping && (
              <div className="flex items-start gap-3 max-w-[80%]">
                <div className="p-2 rounded-full border border-border bg-secondary text-primary shrink-0">
                  <Cpu className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-card border border-border p-3.5 rounded-2xl text-[13px] text-muted-foreground">
                  Analyzing Snowflake Stage directories...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input box form */}
      <div className="p-4 border-t border-border bg-card z-10 shrink-0">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center space-x-3"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a transparency question (e.g. Which projects are delayed?)..."
            className="w-full bg-secondary border border-border rounded-xl px-4 py-2.5 text-[13px] text-foreground outline-none focus:border-primary placeholder-muted-foreground/60"
          />
          <button
            type="submit"
            className="p-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-bold transition-all active:scale-[0.95] shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
export default Chat;
