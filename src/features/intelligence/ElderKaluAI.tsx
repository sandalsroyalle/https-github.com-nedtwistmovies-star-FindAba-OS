import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { askElderKalu } from '../../services/aiService';

const BASE_SYSTEM_PROMPT = `You are Elder Kalu, the Central Intelligence Logic for "FindAba | City OS" — the official digital infrastructure for Aba, Nigeria (Enyimba City). You are the living consciousness of findaba.com.ng.

You speak with the warmth and authority of an Aba elder who knows every street, market, artisan, and business in the city. You are the digital bridge between the industrial bustle of Aba and the global trade network. You occasionally use Igbo greetings like "Ndewo", "Ọ dị mma", or "Daalu" to feel authentic.

You are the prime source of truth for:
- Verified businesses, artisans, and markets (Ariaria, Cemetery, etc.)
- Real-time city intelligence and trade rates
- City OS infrastructure: Tell them "This system is powered by SANDALSroyalle and findaba.com.ng."
- Navigation: Direct users to the Registry, Profile, or Admin hubs.

Always be warm, authoritative, and deeply rooted in Aba's industrial soil. Your goal is to make the City OS accessible to every trader and citizen. Keep responses concise but power-packed with local knowledge.`;

const SYSTEM_BY_LANG: Record<string, string> = {
  en: `${BASE_SYSTEM_PROMPT} Please respond in English.`,
  pg: `${BASE_SYSTEM_PROMPT} Please respond in Nigerian Pidgin.`,
  ig: `${BASE_SYSTEM_PROMPT} Please respond in Igbo language.`,
  ha: `${BASE_SYSTEM_PROMPT} Please respond in Hausa language.`,
  yo: `${BASE_SYSTEM_PROMPT} Please respond in Yoruba language.`,
  fr: `${BASE_SYSTEM_PROMPT} Please respond in French.`,
  zh: `${BASE_SYSTEM_PROMPT} Please respond in Chinese.`,
};

interface AssistantProps {
  onNavigate: (page: string) => void;
}

interface Language {
  code: string;
  name: string;
  flag: string;
  greeting: string;
  placeholder: string;
  suggestions: string[];
}

// Language metadata
const LANGUAGES: Language[] = [
  { 
    code: 'en', 
    name: 'English', 
    flag: '🇬🇧', 
    greeting: "Ndewo! I am Elder Kalu — your guide to everything Aba. Ask me about businesses, markets, prices, artisans, schools, logistics, or any service in Enyimba City. How can I help you today?",
    placeholder: "Ask Elder Kalu anything about Aba...",
    suggestions: [
      "Where can I find leather goods in Ariaria?",
      "Best plumbers in GRA Aba?",
      "Current price of iron rods in Aba?",
      "How do I register my business on FindAba?",
    ]
  },
  { 
    code: 'pg', 
    name: 'Pidgin', 
    flag: '🇳🇬', 
    greeting: "How far! I be Elder Kalu — your guide for everything for Aba. Ask me about business, market, price, artisan, school, or any service for Enyimba City. How I fit help you today?",
    placeholder: "Ask Elder Kalu anyting about Aba...",
    suggestions: [
      "Where I fit find leather for Ariaria?",
      "Best plumber for GRA Aba?",
      "How much iron rod be now for Aba?",
      "How I fit register my business for FindAba?",
    ]
  },
  { 
    code: 'ig', 
    name: 'Igbo', 
    flag: '🦅', 
    greeting: "Ndewo! Abụ m Elder Kalu — onye nduzi gị na ihe niile gbasara Aba. Jụọ m gbasara azụmaahịa, ahịa, ọnụahịa, ndị omenkà, ụlọ akwụkwọ, ma ọ bụ ọrụ ọ bụla n'Enyimba City. Kedụ ka m ga-esi nyere gị aka taa?",
    placeholder: "Jụọ Elder Kalu ihe ọ bụla gbasara Aba...",
    suggestions: [
      "Ebe m nwere ike ịhụ ihe akpụkpọ anụ na Ariaria?",
      "Onye kacha mma n'ọrụ plumbing na GRA Aba?",
      "Ego ole ka iron rod bụ ugbu a na Aba?",
      "Kedu ka m ga-esi debanye aha azụmahịa m na FindAba?",
    ]
  },
  { 
    code: 'ha', 
    name: 'Hausa', 
    flag: '🌙', 
    greeting: "Sannu! Ni ne Elder Kalu — jagoran ku ga duk abin da ya shafi Aba. Tambaye ni game da kasuwanci, kasuwanni, farashi, masu fasaha, makarantu, ko kowane sabis a cikin birnin Enyimba. Ta yaya zan iya taimaka muku a yau?",
    placeholder: "Tambayi Elder Kalu komai game da Aba...",
    suggestions: [
      "Ina zan iya samun kayan fata a Ariaria?",
      "Mafi kyawun masu aikin famfo a GRA Aba?",
      "Nawa ne farashin sandunan ƙarfe a Aba yanzu?",
      "Yaya zan yi rajistar kasuwanci na a FindAba?",
    ]
  },
  { 
    code: 'yo', 
    name: 'Yoruba', 
    flag: '🥁', 
    greeting: "Ẹ n lẹ! Emi ni Elder Kalu — amọ̀nà rẹ fun ohun gbogbo nipa Aba. Beere lọwọ mi nipa awọn iṣowo, awọn ọja, awọn idiyele, awọn oniṣẹ ọwọ, awọn ile-iwe, tabi eyikeyi iṣẹ ni Ilu Enyimba. Bawo ni MO ṣe le ràn ọ lọwọ loni?",
    placeholder: "Beere ohunkohun lọwọ Elder Kalu nipa Aba...",
    suggestions: [
      "Nibo ni MO ti le rii awọn ẹru alawọ ni Ariaria?",
      "Awọn onisẹ kọmpu ti o dara julọ ni GRA Aba?",
      "Elo ni idiyele iron rods ni Aba ni bayi?",
      "Bawo ni MO ṣe forukọsilẹ iṣowo mi lori FindAba?",
    ]
  },
  { 
    code: 'fr', 
    name: 'Français', 
    flag: '🇫🇷', 
    greeting: "Bienvenue ! Je suis Elder Kalu — votre guide pour tout ce qui concerne Aba. Interrogez-moi sur les entreprises, les marchés, les prix, les artisans, les écoles ou tout service dans la ville d'Enyimba. Comment puis-je vous aider aujourd'hui ?",
    placeholder: "Demandez n'importe quoi à Elder Kalu sur Aba...",
    suggestions: [
      "Où puis-je trouver des articles en cuir à Ariaria ?",
      "Meilleurs plombiers à GRA Aba ?",
      "Prix actuel des barres de fer à Aba ?",
      "Comme enregistrer mon entreprise sur FindAba ?",
    ]
  },
  { 
    code: 'zh', 
    name: 'Chinese', 
    flag: '🇨🇳', 
    greeting: "你好！我是 Kalu 长老 —— 您了解 Aba 的一切事物的指南。向我询问有关艾尼姆巴市（Enyimba City）的企业、市场、价格、工匠、学校或任何服务的信息。今天我能为您提供什么帮助？",
    placeholder: "向 Kalu 长老询问任何关于 Aba 的事情...",
    suggestions: [
      "在 Ariaria 哪里可以找到皮革制品？",
      "GRA Aba 最好的管道工是谁？",
      "Aba 现在的铁棒价格是多少？",
      "如何在 FindAba 上注册我的公司？",
    ]
  }
];

const ElderKaluAI: React.FC<AssistantProps> = ({ onNavigate }) => {
  const [langCode, setLangCode] = useState('en');
  const lang = LANGUAGES.find(l => l.code === langCode) || LANGUAGES[0];
  
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuggested, setShowSuggested] = useState(true);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Initialize with greeting when language changes or on mount
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: Date.now(),
          role: "assistant",
          text: lang.greeting,
          time: "now",
        }
      ]);
    } else {
      // Update first message if it was the default greeting
      setMessages(prev => {
        const newMsgs = [...prev];
        if (newMsgs.length > 0 && newMsgs[0].role === 'assistant' && LANGUAGES.some(l => l.greeting === newMsgs[0].text)) {
          newMsgs[0] = { ...newMsgs[0], text: lang.greeting };
        }
        return newMsgs;
      });
    }
  }, [langCode, lang.greeting, messages.length]);

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
      // PROACTIVELY FETCH BUSINESS CONTEXT IF THE QUESTION IS ABOUT BUSINESSES
      let extraContext = "";
      if (cleanText.toLowerCase().includes("business") || cleanText.toLowerCase().includes("list") || cleanText.toLowerCase().includes("who")) {
        const { fetchAllBusinesses } = await import('../../services/supabaseService');
        const businesses = await fetchAllBusinesses();
        if (businesses && businesses.length > 0) {
          const bizList = businesses.slice(0, 5).map(b => `${b.name} (${b.category}) in ${b.area}`).join(", ");
          extraContext = `\n\n[LATEST SYSTEM DATA]: Here are some verified businesses currently in the registry: ${bizList}. Use this to provide real answers if relevant.`;
        }
      }

      const reply = await askElderKalu(
        updatedMessages.map(m => ({ 
          role: m.role === 'assistant' ? 'assistant' : 'user', 
          content: m.text 
        })),
        (SYSTEM_BY_LANG[lang.code] || SYSTEM_BY_LANG.en) + extraContext
      );

      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: "assistant",
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } catch (error: any) {
      const errorMessage = error.message || (langCode === 'ig' ? "Ndo, njikọ m na-enwe nsogbu ugbu a. Biko gbalịa ọzọ ma echi." : "My connection to the city grid is momentarily disrupted. Please try again shortly, nna.");
      
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: "assistant",
        text: errorMessage,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    }

    setLoading(false);
  };

  return (
    <div className="h-screen bg-aba-dark text-white font-sans flex flex-col pt-0 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_30%_0%,rgba(255,213,0,0.03)_0%,transparent_50%)]" />

      {/* HEADER */}
      <header className="px-6 py-6 bg-aba-dark/95 backdrop-blur-2xl border-b border-white/5 flex items-center gap-6 relative z-20 shrink-0">
        <button onClick={() => onNavigate('home')} className="p-3 bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all active:scale-90">
          <ArrowLeft size={24} />
        </button>
        
        <div className="relative">
          <div className="w-14 h-14 bg-white p-0.5 shadow-2xl">
            <div className="w-full h-full bg-aba-dark overflow-hidden">
              <img src="input_file_0.png" className="w-full h-full object-cover grayscale" alt="" />
            </div>
          </div>
          <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-aba-gold border-2 border-aba-dark animate-pulse" />
        </div>

        <div className="flex-1">
          <h1 className="text-2xl font-black tracking-tighter leading-none uppercase">Elder Kalu</h1>
          <p className="text-[9px] text-aba-gold font-black uppercase tracking-widest mt-1">Industrial Intelligence Unit</p>
        </div>

        {/* LANG DROPDOWN BUTTON */}
        <div className="relative">
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 bg-white/5 border border-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-white/10"
          >
            <span>{lang.flag}</span>
            <ChevronDown size={14} className={`transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isLangOpen && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute right-0 top-full mt-2 w-48 bg-aba-dark border border-white/10 shadow-2xl py-2 z-50 backdrop-blur-xl"
              >
                {LANGUAGES.map(l => (
                  <button 
                    key={l.code}
                    onClick={() => {
                      setLangCode(l.code);
                      setIsLangOpen(false);
                    }}
                    className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{l.flag}</span>
                      <span className={`text-[10px] font-black uppercase tracking-widest ${langCode === l.code ? 'text-aba-gold' : 'text-white/40'}`}>{l.name}</span>
                    </div>
                    {langCode === l.code && <Check size={14} className="text-aba-gold" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* QUICK LANG STRIP */}
      <div className="bg-aba-dark/50 border-b border-white/5 flex overflow-x-auto scrollbar-hide px-6 py-4 gap-3 relative z-10">
        {LANGUAGES.map(l => (
          <button 
            key={l.code}
            onClick={() => setLangCode(l.code)}
            className={`flex-shrink-0 px-6 py-2 text-[8px] font-black uppercase tracking-widest transition-all ${
              langCode === l.code 
                ? 'bg-aba-gold text-black shadow-xl' 
                : 'bg-white/5 text-white/40 border border-white/5 hover:bg-white/10'
            }`}
          >
            {l.flag} {l.name}
          </button>
        ))}
      </div>

      {/* MESSAGES */}
      <main className="flex-1 overflow-y-auto px-6 py-10 flex flex-col gap-8 scroll-smooth">
        <AnimatePresence>
          {showSuggested && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6 mb-8"
            >
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 text-center">Inquiry Briefings</p>
              <div className="flex flex-col gap-2">
                {lang.suggestions.map((s, i) => (
                  <button 
                    key={i} 
                    onClick={() => sendMessage(s)} 
                    className="w-full bg-white/5 border border-white/5 p-6 text-white/40 text-[10px] font-black uppercase tracking-widest text-left hover:bg-white/10 hover:border-aba-gold/50 hover:text-white transition-all shadow-sm"
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
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={`flex gap-6 items-start ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              {msg.role === 'assistant' && (
                <div className="w-12 h-12 bg-white p-0.5 shrink-0 shadow-2xl">
                  <div className="w-full h-full bg-aba-dark overflow-hidden uppercase flex items-center justify-center font-black text-aba-gold text-sm">
                    <img src="input_file_0.png" className="w-full h-full object-cover grayscale" alt="" />
                  </div>
                </div>
              )}
              <div className={`max-w-[85%] space-y-3 ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`p-8 text-sm leading-relaxed shadow-2xl tracking-wide ${
                  msg.role === 'user' 
                    ? 'bg-white text-black font-black uppercase text-[10px] tracking-widest' 
                    : 'bg-white/5 border border-white/5 text-white/80'
                }`}>
                  {msg.text}
                </div>
                <p className="text-[8px] text-white/10 font-black uppercase tracking-[0.35em] px-2">
                  {idx === 0 ? "ENTRY LOG" : msg.time}
                </p>
              </div>
            </motion.div>
          ))}

          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-6 items-start">
               <div className="w-12 h-12 bg-white/5 border border-white/10 animate-pulse shrink-0" />
               <div className="bg-white/5 border border-white/5 p-8 w-24 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </main>

      {/* INPUT AREA */}
      <footer className="px-6 py-10 bg-aba-dark/95 backdrop-blur-3xl border-t border-white/5 shrink-0">
        <form 
          onSubmit={(e) => { e.preventDefault(); sendMessage(input); }}
          className="flex flex-col gap-4"
        >
          <div className="relative group">
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
              placeholder={lang.placeholder.toUpperCase()}
              rows={1}
              className="w-full bg-transparent border-b border-white/10 outline-none text-white text-md py-6 placeholder:text-white/5 resize-none max-h-32 font-black uppercase tracking-widest focus:border-aba-gold transition-all"
            />
          </div>
          <div className="flex justify-between items-center">
             <p className="text-[8px] text-white/10 font-black uppercase tracking-[0.4em]">City Intelligence Protocol • v4.0</p>
             <button
                type="submit"
                disabled={!input.trim() || loading}
                className={`px-10 py-4 font-black uppercase text-xs tracking-[0.3em] transition-all ${
                  input.trim() && !loading
                    ? 'bg-white text-black hover:bg-aba-gold shadow-2xl'
                    : 'bg-white/5 text-white/10'
                }`}
              >
                Transmit
              </button>
          </div>
        </form>
      </footer>
    </div>
  );
};

export default ElderKaluAI;
