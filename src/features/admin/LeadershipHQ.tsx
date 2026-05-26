import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Fingerprint, Lock, ArrowLeft, Users, BarChart3, Database } from 'lucide-react';

interface LeadershipHQProps {
  onNavigate: (page: string) => void;
}

const LeadershipHQ: React.FC<LeadershipHQProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-aba-dark text-white font-sans flex flex-col p-6 pb-24">
      <header className="flex items-center gap-6 mb-12 py-4">
        <button onClick={() => onNavigate('home')} className="p-4 bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all active:scale-90 rounded-2xl">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">Leadership HQ</h1>
          <p className="text-[10px] font-black tracking-[0.3em] text-red-500 uppercase mt-1">Classification: Top Secret</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center text-center px-12 space-y-12">
        <div className="relative">
          <div className="w-32 h-32 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center text-red-500 animate-pulse">
            <ShieldAlert size={64} />
          </div>
          <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-aba-dark border border-red-500/30 rounded-full flex items-center justify-center text-red-500">
            <Lock size={20} />
          </div>
        </div>

        <div className="max-w-md space-y-6">
          <h2 className="text-4xl font-black uppercase tracking-tighter">Access Denied</h2>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest leading-relaxed">
            Your current digital identity lacks the biometric clearance required to access the City Command Module.
          </p>
        </div>

        <div className="w-full max-w-sm p-8 bg-white/5 border border-white/10 rounded-[2.5rem] space-y-8 blur-sm select-none opacity-20 pointer-events-none">
           <div className="flex justify-between items-center px-4">
              <Users size={20} />
              <BarChart3 size={20} />
              <Database size={20} />
           </div>
           <div className="h-4 bg-white/10 rounded-full w-full" />
           <div className="h-4 bg-white/10 rounded-full w-2/3" />
        </div>

        <button 
          onClick={() => onNavigate('home')}
          className="px-12 py-5 bg-white text-black font-black uppercase text-xs tracking-widest rounded-3xl hover:scale-105 transition-all"
        >
          Return to Hub
        </button>
      </div>
    </div>
  );
};

export default LeadershipHQ;
