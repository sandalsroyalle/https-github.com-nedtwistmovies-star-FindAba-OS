import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ArrowLeft, Lock, EyeOff, Fingerprint, FileText } from 'lucide-react';

interface PrivacyViewProps {
  onNavigate: (page: string) => void;
}

const PrivacyView: React.FC<PrivacyViewProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-aba-dark text-white font-sans flex flex-col p-6 pb-24">
      <header className="flex items-center gap-6 mb-12 py-4">
        <button onClick={() => onNavigate('home')} className="p-4 bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all active:scale-90 rounded-2xl">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">Privacy & Safety</h1>
          <p className="text-[10px] font-black tracking-[0.3em] text-aba-gold uppercase mt-1">Industrial Grade Encryption</p>
        </div>
      </header>

      <div className="space-y-6">
        <div className="p-10 bg-aba-green/5 border border-aba-green/20 rounded-[3rem] space-y-6">
           <div className="w-14 h-14 bg-aba-green/20 rounded-2xl flex items-center justify-center text-aba-green">
              <ShieldCheck size={32} />
           </div>
           <h2 className="text-3xl font-black uppercase tracking-tighter">Identity Protection</h2>
           <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
             Finding the right balance between public visibility and private data. Your industrial identity is protected by city-level cryptographic protocols.
           </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center gap-6">
              <Fingerprint className="text-aba-gold" size={32} />
              <div>
                 <h3 className="text-xl font-black uppercase tracking-tighter">Biometric Lock</h3>
                 <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">ENABLED</p>
              </div>
           </div>
           <div className="p-8 bg-white/5 border border-white/10 rounded-[2.5rem] flex items-center gap-6">
              <EyeOff className="text-aba-gold" size={32} />
              <div>
                 <h3 className="text-xl font-black uppercase tracking-tighter">Stealth Mode</h3>
                 <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">DISABLED</p>
              </div>
           </div>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-[3rem] p-10 space-y-8">
           <h3 className="text-2xl font-black uppercase tracking-tighter flex items-center gap-4">
             <FileText size={24} className="text-aba-gold" /> Legal Protocols
           </h3>
           <div className="space-y-4">
             <button className="w-full flex justify-between items-center py-4 border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all">
               <span>Terms of Trade</span>
               <Lock size={12} />
             </button>
             <button className="w-full flex justify-between items-center py-4 border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all">
               <span>Privacy Directive</span>
               <Lock size={12} />
             </button>
             <button className="w-full flex justify-between items-center py-4 border-b border-white/5 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 hover:text-white transition-all">
               <span>Data Governance</span>
               <Lock size={12} />
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyView;
