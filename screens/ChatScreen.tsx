
import React, { useState, useRef, useEffect } from 'react';
import { AppState, ChatMessage } from '../types';
import { getFinancialAdvice } from '../services/geminiService';

interface ChatProps {
  state: AppState;
  onBack: () => void;
  initialQuery?: string | null;
  onClearInitialQuery?: () => void;
}

const ChatScreen: React.FC<ChatProps> = ({ state, onBack, initialQuery, onClearInitialQuery }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: "Hello! I'm your Financial Guru. How can I help you save for your goals today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle initial query from dashboard (e.g. the Roast)
  useEffect(() => {
    if (initialQuery && !loading) {
      handleSend(initialQuery);
      // Immediately clear so it doesn't trigger again on re-renders
      onClearInitialQuery?.();
    }
  }, [initialQuery]);

  const handleSend = async (textToSend: string = input) => {
    const text = textToSend.trim();
    if (!text || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    
    // Clear input if message came from the textbox
    if (textToSend === input) setInput('');
    
    setLoading(true);

    try {
      const response = await getFinancialAdvice(text, { 
        transactions: state.transactions, 
        goals: state.goals,
        monthlyAllowance: state.monthlyAllowance
      });
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: response || "Hmm, something went wrong. Try again!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "Guru is feeling a bit tired. Check your connection and try again!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#050505] transition-colors relative">
      <header className="glass p-4 md:px-8 border-b border-white/5 flex items-center gap-3 bg-black/40 backdrop-blur-xl sticky top-0 z-20">
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors text-white/70 cursor-pointer">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="size-11 rounded-full border border-primary/40 overflow-hidden shadow-lg shadow-black/50 bg-[#1a1814]">
              <img src="/guru-avatar.png" alt="AI Financial Guru" className="size-full object-cover object-top scale-105" />
            </div>
            <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-[#050505]"></div>
          </div>
          <div>
            <h2 className="text-white text-lg font-bold leading-tight">Financial Guru</h2>
            <div className="flex items-center gap-1">
              <span className="size-1.5 rounded-full bg-primary animate-pulse"></span>
              <p className="text-white/40 text-xs font-medium uppercase tracking-widest">Active Now</p>
            </div>
          </div>
        </div>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6 pb-40 no-scrollbar max-w-4xl mx-auto w-full">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
            {msg.role === 'model' && (
              <div className="shrink-0 mt-1 size-9 md:size-10 rounded-full overflow-hidden border border-white/15 shadow-md bg-[#1a1814]">
                <img src="/guru-avatar.png" alt="AI Guru" className="size-full object-cover object-top scale-105" />
              </div>
            )}
            <div className={`max-w-[85%] md:max-w-[70%] flex flex-col gap-1 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-5 py-3.5 rounded-2xl shadow-lg ${
                msg.role === 'user' 
                ? 'bg-primary text-background-dark rounded-tr-sm font-bold' 
                : 'bg-[#1a1814] text-white rounded-tl-sm border border-white/5 backdrop-blur-md'
              }`}>
                <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>
              </div>
              <p className="text-white/20 text-[10px] px-1 font-bold uppercase tracking-widest">
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-start gap-3 animate-pulse">
            <div className="size-9 md:size-10 rounded-full overflow-hidden border border-primary/40 shadow-md bg-[#1a1814] shrink-0">
              <img src="/guru-avatar.png" alt="AI Guru" className="size-full object-cover object-top scale-105" />
            </div>
            <div className="bg-white/5 px-5 py-3.5 rounded-2xl rounded-tl-sm border border-white/5 text-white/40 text-sm italic">
              Guru is analyzing...
            </div>
          </div>
        )}
      </div>

      {/* Responsive Input bar */}
      <div className="absolute bottom-0 inset-x-0 p-4 pb-28 md:pb-6 z-30 flex justify-center bg-gradient-to-t from-[#050505] via-[#050505]/90 to-transparent pointer-events-none">
        <div className="w-full max-w-2xl pointer-events-auto">
          <div className="flex items-center glass bg-[#1a1a1a]/95 p-2 rounded-[2.5rem] border border-white/10 shadow-2xl backdrop-blur-3xl transition-all focus-within:border-primary/50">
            <input 
              className="flex-1 bg-transparent border-none text-white placeholder-white/30 focus:ring-0 text-[15px] font-medium px-4 py-2"
              placeholder="Ask Guru anything about your money, budget or goals..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button 
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className={`shrink-0 size-11 flex items-center justify-center rounded-full shadow-lg transition-all cursor-pointer ${loading || !input.trim() ? 'bg-white/10 cursor-not-allowed text-white/20' : 'bg-[#D0BB95] text-[#0d0c0b] hover:scale-105 active:scale-95'}`}
            >
              <span className="material-symbols-outlined font-black">arrow_upward</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
