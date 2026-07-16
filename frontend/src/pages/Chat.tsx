import React, { useState, useEffect, useRef } from 'react';

import { 
  MessageSquare, 
  Send, 
  Cpu, 
  User, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { showToast } from '../components/ui/Toast';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  sourceBadge?: string;
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
    const matchKey = Object.keys(mockReplies).find(k => text.toLowerCase().includes(k.toLowerCase()) || k.toLowerCase().includes(text.toLowerCase()));
    if (matchKey) {
      aiReply = mockReplies[matchKey];
    }

    const aiMessage: Message = {
      id: Math.random().toString(),
      sender: 'ai',
      text: aiReply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sourceBadge: 'Cortex Llama-3-70b • Staged CSV Records'
    };

    setMessages((prev) => [...prev, aiMessage]);
    setIsTyping(false);
    showToast('Cortex AI summary retrieved successfully', 'success');
  };

  return (
    <div className="h-[78vh] flex flex-col justify-between border border-neutral-900 bg-neutral-950/20 rounded-xl overflow-hidden relative text-left">
      {/* Background logo marker */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#161616_1px,transparent_1px),linear-gradient(to_bottom,#161616_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-20 pointer-events-none" />

      {/* Chat header panel */}
      <div className="px-6 py-4 border-b border-neutral-900 bg-neutral-950 flex items-center justify-between z-10 shrink-0">
        <div className="flex items-center space-x-2.5">
          <Cpu className="w-5 h-5 text-emerald-400" />
          <div>
            <h3 className="text-xs font-bold text-neutral-200">Cortex Transparency Q&A</h3>
            <p className="text-[10px] text-neutral-500">Ask natural language queries on municipal records.</p>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-[10px] text-neutral-500 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
          <span>Snowflake Cortex Enabled</span>
        </div>
      </div>

      {/* Messages body or Suggested Questions empty state */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 z-10">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center space-y-6 text-center max-w-lg mx-auto">
            <div className="p-4 bg-neutral-900/60 border border-neutral-850 rounded-2xl text-neutral-300">
              <MessageSquare className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-neutral-200">SALAY AI Search Portal</h4>
              <p className="text-[10px] text-neutral-500 leading-relaxed mt-1">
                This engine uses **Snowflake Cortex LLM** to translate citizen questions directly into queries and compile summaries of municipal budgets, project progress, and complaints.
              </p>
            </div>

            {/* Clickable suggested questions */}
            <div className="space-y-2 w-full text-left">
              <span className="text-[9px] uppercase font-bold text-neutral-600 tracking-wider block px-1">Suggested Inquiries</span>
              <div className="grid grid-cols-1 gap-2">
                {suggestedQuestions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSend(q)}
                    className="p-3 border border-neutral-900 bg-neutral-950/80 hover:border-neutral-800 rounded-lg text-left text-xs text-neutral-400 hover:text-neutral-200 transition-colors flex items-center justify-between group active:scale-[0.99]"
                  >
                    <span>{q}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-neutral-600 group-hover:text-neutral-400 shrink-0 ml-2" />
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
                  <div className={`p-2 rounded-full border border-neutral-900 shrink-0 ${isUser ? 'bg-neutral-900 text-neutral-300' : 'bg-neutral-900 text-emerald-400'}`}>
                    {isUser ? <User className="w-3.5 h-3.5" /> : <Cpu className="w-3.5 h-3.5" />}
                  </div>

                  {/* Bubble text */}
                  <div className="space-y-1">
                    <div className={`p-3 rounded-lg text-xs leading-relaxed text-left whitespace-pre-line border ${
                      isUser 
                        ? 'bg-neutral-900 border-neutral-800 text-neutral-200' 
                        : 'bg-neutral-950 border-neutral-900 text-neutral-100'
                    }`}>
                      {m.text}
                    </div>
                    {/* Source badges */}
                    <div className="flex items-center space-x-2 text-[9px] text-neutral-500 font-mono">
                      <span>{m.timestamp}</span>
                      {m.sourceBadge && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-500 font-semibold">{m.sourceBadge}</span>
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
                <div className="p-2 rounded-full border border-neutral-900 bg-neutral-900 text-emerald-400 shrink-0">
                  <Cpu className="w-3.5 h-3.5 animate-spin" />
                </div>
                <div className="bg-neutral-950 border border-neutral-900 p-3 rounded-lg text-xs text-neutral-500">
                  Cortex parsing dataset vectors...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input box form */}
      <div className="p-4 border-t border-neutral-900 bg-neutral-950 z-10 shrink-0">
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
            placeholder="Type a transparency question (e.g. Which road projects are delayed?)..."
            className="w-full bg-neutral-900 border border-neutral-850 rounded px-4 py-2.5 text-xs text-neutral-250 outline-none focus:border-neutral-700 placeholder-neutral-600"
          />
          <button
            type="submit"
            className="p-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 rounded font-bold transition-all active:scale-95 shrink-0"
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
