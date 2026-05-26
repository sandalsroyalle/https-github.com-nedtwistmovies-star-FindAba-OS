import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { askElderKalu } from '../../services/aiService';

const ELDER_SYSTEM_PROMPT = `You are Elder Kalu, a wise, warm, and highly knowledgeable AI assistant for FindAba — a commerce and services platform for Aba, Nigeria (also called Enyimba City). 

You speak with the warmth and authority of an Aba elder who knows every street, market, artisan, and business in the city. You are helpful, direct, and occasionally use Igbo greetings like "Ndewo", "Ọ dị mma", or "Daalu" to feel authentic.

Always be warm, practical, and specific to Aba. Keep responses concise — 2-4 sentences for simple questions, more for complex ones.`;

interface AssistantProps {
  onNavigate: (page: string) => void;
}

const SUGGESTED = [
  "Where can I find leather goods in Ariaria?",
  "Best plumbers in GRA Aba?",
  "Current price of iron rods in Aba?",
  "Schools near Osisioma?",
  "How do I register my business on FindAba?",
];

const ELDER_AVATAR = () => (
  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-[0_0_12px_rgba(255,213,0,0.4)] relative bg-gradient-to-br from-[#B8860B] via-[#FFD500] to-[#8B6914]">
    <span className="text-base font-black text-[#021E16] font-serif">K</span>
    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#22c55e] border-2 border-[#021E16]" />
  </div>
);

const TypingDots = () => (
  <div className="flex gap-1 items-center py-1">
    {[0, 1, 2].map(i => (
      <motion.div 
        key={i}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
        className="w-1.5 h-1.5 rounded-full bg-aba-gold"
      />
    ))}
  </div>
);

const Assistant: React.FC<AssistantProps> = ({ onNavigate }) => {
  const [messages, setMessages] = useState<any[]>([
    {
      id: 1,
      role: "assistant",
      text: "Ndewo! I am Elder Kalu — your guide to everything Aba. Ask me about businesses, markets, prices, artisans, schools, logistics, or any service in Enyimba City. How can I help you today?",
      time: "now",
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggested, setShowSuggested] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMessage = async (text: string) => {
    if (!text.trim() || loading) return;
    const cleanText = text.trim();
    setShowSuggested(false);

    const userMsg = {
      id: Date.now(),
      role: "user",
      text: cleanText,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const reply = await askElderKalu(
        updatedMessages.map(m => ({ 
          role: m.role === 'assistant' ? 'assistant' : 'user', 
          content: m.text 
        })),
        ELDER_SYSTEM_PROMPT
      );

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: "assistant",
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } catch {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: "assistant",
        text: "My connection to the city grid is momentarily disrupted. Please try again shortly, nna.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen bg-[#021E16] text-[#F5F5F5] font-sans flex flex-col pt-0 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_30%_0%,rgba(255,213,0,0.05)_0%,transparent_50%),radial-gradient(ellipse_at_70%_100%,rgba(255,213,0,0.03)_0%,transparent_50%)]" />

      {/* HEADER */}
      <header className="px-5 py-4 bg-[#021E16]/95 backdrop-blur-2xl border-b border-aba-gold/10 flex items-center gap-3.5 relative z-10 shrink-0">
        <button onClick={() => onNavigate('home')} className="p-2 text-white/40 hover:text-white transition-all active:scale-90">
          <ArrowLeft size={24} />
        </button>
        
        <div className="relative">
          <div className="w-12 h-12 rounded-full p-0.5 bg-gradient-to-br from-[#8B6914] via-[#FFD500] to-[#8B6914] shadow-[0_0_20px_rgba(255,213,0,0.3)]">
            <div className="w-full h-full rounded-full bg-[#021E16] flex items-center justify-center text-xl font-black text-aba-gold font-serif">K</div>
          </div>
          <div className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-[#22c55e] border-2 border-[#021E16] animate-pulse" />
        </div>

        <div className="flex-1">
          <h1 className="text-base font-black text-[#F5F5F5] font-serif leading-none">Elder Kalu</h1>
          <p className="text-[10px] text-aba-gold font-bold uppercase tracking-widest mt-1">FindAba AI · Aba, Nigeria</p>
        </div>

        <div className="flex gap-0.5 items-end h-4">
          {[4, 8, 12, 16].map((h, i) => (
            <div key={i} className="w-[3px] rounded-sm" style={{ height: h, background: i < 3 ? '#FFD500' : 'rgba(255,213,0,0.2)' }} />
          ))}
        </div>
      </header>

      {/* MESSAGES */}
      <main className="flex-1 overflow-y-auto px-4 py-5 flex flex-col gap-4 scroll-smooth">
        <AnimatePresence>
          {showSuggested && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="space-y-2 mb-4"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.1em] text-white/30 text-center mb-3">Common questions</p>
              <div className="flex flex-col gap-2">
                {SUGGESTED.map((s, i) => (
                  <button 
                    key={i} 
                    onClick={() => sendMessage(s)} 
                    className="w-full bg-aba-gold/5 border border-aba-gold/15 p-3 rounded-xl text-white/70 text-xs text-left font-medium hover:bg-aba-gold/10 hover:border-aba-gold/30 hover:text-white transition-all active:scale-98"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {messages.map((msg, idx) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-2.5 items-end ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {msg.role === 'assistant' && <ELDER_AVATAR />}
              <div className={`max-w-[75%] space-y-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-gradient-to-br from-aba-gold to-[#E6BF00] text-[#021E16] font-bold rounded-[20px_20px_4px_20px] shadow-[0_4px_20px_rgba(255,213,0,0.2)]' 
                    : 'bg-white/5 border border-white/10 text-white rounded-[20px_20px_20px_4px] shadow-2xl shadow-black/20'
                }`}>
                  {msg.text}
                </div>
                <p className="text-[10px] text-white/20 font-bold tracking-widest px-1">
                  {idx === 0 ? "Elder Kalu" : msg.time}
                </p>
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2.5 items-end">
              <ELDER_AVATAR />
              <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-[20px_20px_20px_4px]">
                <TypingDots />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </main>

      {/* INPUT AREA */}
      <footer className="px-4 py-6 bg-[#021E16]/95 backdrop-blur-2xl border-t border-aba-gold/10 shrink-0">
        <p className="text-center text-[10px] text-aba-gold/30 font-black uppercase tracking-[0.15em] mb-3">
          ✦ Elder Kalu AI · Powered by FindAba ✦
        </p>
        
        <form 
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="flex gap-2.5 items-end bg-white/5 border border-aba-gold/15 p-2.5 pl-4 rounded-[20px] transition-all focus-within:border-aba-gold/40"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Ask Elder Kalu anything about Aba..."
            rows={1}
            className="flex-1 bg-transparent border-none outline-none text-[#F5F5F5] text-sm py-2 placeholder:text-white/20 resize-none max-h-24 scrollbar-hide"
          />
          <button
            type="submit"
            disabled={!input.trim() || loading}
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all ${
              input.trim() && !loading
                ? 'bg-gradient-to-br from-aba-gold to-[#E6BF00] text-[#021E16] shadow-[0_4px_12px_rgba(255,213,0,0.3)] hover:scale-105 active:scale-95'
                : 'bg-aba-gold/10 text-aba-gold/30'
            }`}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3 9L15 9M15 9L10 4M15 9L10 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </form>
      </footer>
    </div>
  );
};

export default Assistant;
