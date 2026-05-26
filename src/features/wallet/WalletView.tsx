import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, ArrowUpRight, ArrowDownLeft, Shield, CreditCard, ArrowLeft, Plus, History } from 'lucide-react';

interface WalletViewProps {
  onNavigate: (page: string) => void;
}

const WalletView: React.FC<WalletViewProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-aba-dark text-white font-sans flex flex-col p-6 pb-24">
      <header className="flex items-center gap-6 mb-12 py-4">
        <button onClick={() => onNavigate('home')} className="p-4 bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all active:scale-90 rounded-2xl">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">Aba Wallet</h1>
          <p className="text-[10px] font-black tracking-[0.3em] text-aba-gold uppercase mt-1">Industrial Payment Hub</p>
        </div>
      </header>

      {/* CARD */}
      <div className="relative h-64 bg-gradient-to-br from-neutral-800 to-neutral-900 rounded-[3rem] p-10 border border-white/10 overflow-hidden group mb-12 shadow-2xl">
        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
          <Wallet size={200} />
        </div>
        
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div className="flex justify-between items-start">
             <div className="text-[10px] font-black uppercase tracking-[0.4em] text-white/40">City Operating Balance</div>
             <Shield className="text-aba-green" size={24} />
          </div>
          
          <div>
            <div className="text-5xl font-black uppercase tracking-tighter mb-2">₦450.00</div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-aba-green rounded-full animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Securely Synced with findaba Cloud</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-12">
        <button className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-[2rem] border border-white/5 active:scale-95 transition-all">
          <div className="w-12 h-12 bg-aba-gold text-black rounded-2xl flex items-center justify-center">
            <Plus size={24} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Fund</span>
        </button>
        <button className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-[2rem] border border-white/5 active:scale-95 transition-all outline-none">
          <div className="w-12 h-12 bg-aba-green text-black rounded-2xl flex items-center justify-center">
            <ArrowUpRight size={24} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Send</span>
        </button>
        <button className="flex flex-col items-center gap-3 p-6 bg-white/5 rounded-[2rem] border border-white/5 active:scale-95 transition-all">
          <div className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center">
            <History size={24} />
          </div>
          <span className="text-[9px] font-black uppercase tracking-widest">Log</span>
        </button>
      </div>

      <div className="flex-1 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-black uppercase tracking-widest text-white/20">Active Methods</h2>
          <button className="text-[8px] font-black uppercase text-aba-gold tracking-widest">Add New +</button>
        </div>
        
        <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 flex items-center gap-6">
          <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center text-black shrink-0">
            <CreditCard size={28} />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black uppercase tracking-tighter">Bank Link</h3>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Not Connected</p>
          </div>
          <button className="px-6 py-3 border border-white/20 rounded-xl text-[9px] font-black uppercase tracking-widest">Setup</button>
        </div>

        <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 flex items-center gap-6">
          <div className="w-14 h-14 bg-aba-gold rounded-xl flex items-center justify-center text-black shrink-0">
            <span className="font-black text-xs">VFD</span>
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-black uppercase tracking-tighter">Virtual Account</h3>
            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">309028***8</p>
          </div>
          <div className="text-aba-green text-[9px] font-black uppercase tracking-widest">Active</div>
        </div>
      </div>
    </div>
  );
};

export default WalletView;
