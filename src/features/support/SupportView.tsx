import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, MessageSquare, Phone, Mail, ArrowLeft, Terminal, ShieldCheck, Info } from 'lucide-react';

interface SupportViewProps {
  onNavigate: (page: string) => void;
}

const SupportView: React.FC<SupportViewProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-aba-dark text-white font-sans flex flex-col p-6 pb-24">
      <header className="flex items-center gap-6 mb-12 py-4">
        <button onClick={() => onNavigate('home')} className="p-4 bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all active:scale-90 rounded-2xl">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">Support</h1>
          <p className="text-[10px] font-black tracking-[0.3em] text-aba-gold uppercase mt-1">Enyimba Systems Command</p>
        </div>
      </header>

      <div className="bg-black/40 border border-white/5 p-8 rounded-[2rem] font-mono mb-12">
        <div className="flex items-center gap-2 mb-6 text-aba-gold">
          <Terminal size={14} />
          <span className="text-[10px] uppercase font-bold tracking-widest">Active Session: Support_Root</span>
        </div>
        <div className="space-y-4 text-white/60 text-[11px] leading-relaxed">
           <p className="text-white">Welcome to the Industrial Support node.</p>
           <p>Type your query or select a communication channel below.</p>
           <div className="flex items-center gap-2">
             <span className="text-aba-green">root@enyimba:~#</span>
             <span className="animate-pulse">_</span>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between group hover:bg-aba-green/10 transition-all cursor-pointer">
           <div className="space-y-1">
             <h3 className="text-xl font-black uppercase tracking-tighter">Live Chat</h3>
             <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Instant Resolution</p>
           </div>
           <MessageSquare size={24} className="text-aba-green opacity-40 group-hover:opacity-100 transition-all" />
        </div>

        <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between group hover:bg-aba-gold/10 transition-all cursor-pointer">
           <div className="space-y-1">
             <h3 className="text-xl font-black uppercase tracking-tighter">Hotline</h3>
             <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Available 24/7</p>
           </div>
           <Phone size={24} className="text-aba-gold opacity-40 group-hover:opacity-100 transition-all" />
        </div>

        <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
           <div className="space-y-1">
             <h3 className="text-xl font-black uppercase tracking-tighter">Email Node</h3>
             <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">support@findaba.com.ng</p>
           </div>
           <Mail size={24} className="text-white/40 group-hover:opacity-100 transition-all" />
        </div>

        <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center justify-between group hover:bg-white/10 transition-all cursor-pointer">
           <div className="space-y-1">
             <h3 className="text-xl font-black uppercase tracking-tighter">Identity Aid</h3>
             <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">Verification Support</p>
           </div>
           <ShieldCheck size={24} className="text-white/40 group-hover:opacity-100 transition-all" />
        </div>
      </div>

      <div className="mt-12 flex items-center gap-3 p-6 border border-white/5 bg-white/5 rounded-3xl">
        <Info size={16} className="text-white/20" />
        <p className="text-[9px] font-bold uppercase tracking-widest text-white/20">FindAba Industrial Operating System v1.4.0</p>
      </div>
    </div>
  );
};

export default SupportView;
