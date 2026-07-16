import React, { useState } from 'react';
import { Send, Sparkles, User } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  confidence?: number;
  timestamp: string;
}

export const Chat: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'assistant',
      text: 'Hello! I am your Civic Transparency assistant. Ask me questions about municipal budgets, public works projects, or citizen feedback reports.',
      timestamp: '02:15',
    }
  ]);
  const [input, setInput] = useState('');

  const suggestions = [
    'What is the budget for the Oakridge School Solar project?',
    'List all public works projects in progress.',
    'Summarize recent citizen feedback regarding potholes.',
  ];

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    // Simulate AI response logic matching Civic Transparency theme
    setTimeout(() => {
      let replyText = 'I am scanning the active municipal database stages. ';
      let conf = 0.92;

      if (text.toLowerCase().includes('solar') || text.toLowerCase().includes('oakridge')) {
        replyText = 'The "Oakridge High School Solar Retrofit" is registered in Ward 4 under the Energy & Environment department. It has an allocated budget of $1,250,000.00 and is currently 68% complete.';
        conf = 0.98;
      } else if (text.toLowerCase().includes('feedback') || text.toLowerCase().includes('pothole')) {
        replyText = 'Based on the citizen complaint stage databases, we have 1 open report regarding road conditions (potholes) in the Downtown Core. Feedback sentiment maps to negative due to transit delays.';
        conf = 0.89;
      } else if (text.toLowerCase().includes('projects') || text.toLowerCase().includes('works')) {
        replyText = 'There are currently 4 recorded Public Works projects. 1 is Completed, 2 are In Progress or Delayed, and 1 is Planned.';
        conf = 0.95;
      } else {
        replyText = `Regarding your query "${text}": No active databases match the specific parameters. Initial budget allocations list a total of $45,000,000 allocated across municipal divisions. Please refine your search.`;
      }

      const assistantMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: replyText,
        confidence: conf,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    }, 800);
  };

  return (
    <div className="flex flex-col h-[75vh] border border-neutral-900 bg-neutral-950/40 rounded-lg overflow-hidden">
      {/* Panel Header */}
      <div className="flex justify-between items-center px-6 py-4 bg-neutral-950 border-b border-neutral-900">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-neutral-300" />
          <h2 className="text-sm font-bold text-neutral-200">Cortex AI Q&A Panel</h2>
        </div>
        <span className="text-[10px] text-emerald-500 font-mono flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping mr-1" />
          cortex-llama3-70b
        </span>
      </div>

      {/* Message Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((msg) => {
          const isAssistant = msg.sender === 'assistant';
          return (
            <div key={msg.id} className={`flex space-x-3 max-w-2xl ${isAssistant ? '' : 'ml-auto justify-end'}`}>
              {isAssistant && (
                <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
                </div>
              )}

              <div className="space-y-1">
                <div className={`p-4 rounded-lg text-xs leading-relaxed ${
                  isAssistant 
                    ? 'bg-neutral-950 border border-neutral-900 text-neutral-200' 
                    : 'bg-neutral-100 text-neutral-900 font-medium'
                }`}>
                  {msg.text}
                </div>

                <div className="flex items-center justify-between px-1 text-[9px] text-neutral-500">
                  <span>{msg.timestamp}</span>
                  {isAssistant && msg.confidence && (
                    <span className="font-mono">Confidence: {Math.round(msg.confidence * 100)}%</span>
                  )}
                </div>
              </div>

              {!isAssistant && (
                <div className="w-7 h-7 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                  <User className="w-3.5 h-3.5 text-neutral-400" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Suggestions and inputs */}
      <div className="p-4 bg-neutral-950 border-t border-neutral-900 space-y-4">
        {messages.length === 1 && (
          <div className="flex flex-wrap gap-2">
            {suggestions.map((sug, idx) => (
              <button
                key={idx}
                onClick={() => handleSend(sug)}
                className="text-[10px] text-left px-3 py-1.5 bg-neutral-900 hover:bg-neutral-850 hover:text-neutral-200 border border-neutral-800 rounded-md transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>
        )}

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex space-x-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Query municipal database stages..."
            className="flex-1 bg-neutral-900 border border-neutral-800 rounded-md px-4 py-2.5 text-xs text-neutral-200 focus:outline-none focus:border-neutral-700 placeholder-neutral-500"
          />
          <button
            type="submit"
            className="p-2.5 bg-neutral-100 text-neutral-900 hover:bg-neutral-200 transition-all rounded-md flex items-center justify-center active:scale-95 shrink-0"
            aria-label="Send query"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
export default Chat;
