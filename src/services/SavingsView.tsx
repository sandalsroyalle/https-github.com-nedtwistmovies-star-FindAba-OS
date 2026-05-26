import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, TrendingUp, ShieldCheck, PieChart, ArrowLeft, Plus, Wallet, Loader2, Users, Target } from 'lucide-react';
import { fetchSavings, fetchThriftGroups, getSupabase } from '../../services/supabaseService';
import { Saving, ThriftGroup } from '../../types';

interface SavingsViewProps {
  onNavigate: (page: string) => void;
}

const SavingsView: React.FC<SavingsViewProps> = ({ onNavigate }) => {
  const [personalSavings, setPersonalSavings] = useState<Saving[]>([]);
  const [thriftGroups, setThriftGroups] = useState<ThriftGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const loadSavingsData = async () => {
      try {
        const supabase = getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        const uid = session?.user?.id;
        setUserId(uid || null);

        const [savingsData, thriftData] = await Promise.all([
          uid ? fetchSavings(uid) : Promise.resolve([]),
          fetchThriftGroups()
        ]);

        setPersonalSavings(savingsData as Saving[]);
        setThriftGroups(thriftData as ThriftGroup[]);
      } catch (err) {
        console.error("Load savings error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadSavingsData();
  }, []);

  const totalBalance = personalSavings.reduce((acc, s) => acc + s.amount, 0);

  return (
    <div className="min-h-screen bg-aba-dark text-white font-sans flex flex-col p-6 pb-24">
      <header className="flex items-center gap-6 mb-12 py-4">
        <button onClick={() => onNavigate('home')} className="p-4 bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all active:scale-90 rounded-2xl">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">Savings</h1>
          <p className="text-[10px] font-black tracking-[0.3em] text-aba-gold uppercase mt-1">Merchant Growth Fund</p>
        </div>
      </header>

      {/* TOTAL BALANCE CARD */}
      <div className="bg-gradient-to-br from-aba-gold/10 to-transparent border border-aba-gold/20 p-10 rounded-[3rem] mb-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Briefcase size={120} />
        </div>
        
        <div className="relative z-10 space-y-2">
          <div className="flex items-center gap-2 text-aba-gold">
            <TrendingUp size={16} />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Capital Yield: +15.5% P.A</span>
          </div>
          <h2 className="text-6xl font-black uppercase tracking-tighter">
            ₦{totalBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </h2>
          <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mt-4">Active Industrial Capital</p>
        </div>

        <div className="flex gap-4 mt-12">
          <button className="flex-1 py-5 bg-aba-gold text-black font-black uppercase text-[10px] tracking-widest rounded-3xl hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
            <Plus size={18} /> Add Capital
          </button>
          <button className="flex-1 py-5 bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-3xl hover:bg-white/10 transition-all flex items-center justify-center gap-3">
             Details
          </button>
        </div>
      </div>

      {/* THRIFT GROUPS (AJO) */}
      <div className="mb-12 space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/20">Merchant Thrift (Ajo)</h2>
          <button className="text-[10px] font-black text-aba-gold uppercase tracking-widest">Create Group</button>
        </div>

        {loading ? (
          <div className="h-40 flex flex-col items-center justify-center gap-4">
             <Loader2 size={32} className="animate-spin text-aba-gold opacity-40" />
             <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Syncing Market Nodes...</span>
          </div>
        ) : thriftGroups.length > 0 ? (
          <div className="grid gap-2">
            {thriftGroups.map(group => (
              <div key={group.id} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] flex items-center justify-between hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-aba-gold/10 rounded-2xl flex items-center justify-center text-aba-gold">
                    <Users size={24} />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-xl font-black uppercase tracking-tighter">{group.name}</h3>
                    <div className="flex items-center gap-3 text-[8px] font-bold text-white/40 uppercase tracking-widest">
                       <span>₦{group.contribution_amount.toLocaleString()}/{group.cycle_period}</span>
                       <span className="w-1 h-1 bg-white/20 rounded-full" />
                       <span className="text-aba-green">{group.member_count} Members</span>
                    </div>
                  </div>
                </div>
                <button className="px-5 py-3 bg-white/5 border border-white/10 text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-aba-gold hover:text-black transition-all">
                  Join
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 border border-dashed border-white/10 rounded-[2rem] text-center">
             <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">No active merchant groups in your local cluster.</p>
          </div>
        )}
      </div>

      {/* TARGET SAVINGS */}
      <div className="space-y-6">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 px-2">Target Goals</h2>
        {personalSavings.length > 0 ? (
          <div className="grid gap-2">
            {personalSavings.map(saving => (
              <div key={saving.id} className="bg-white/5 border border-white/5 p-6 rounded-[2.5rem] space-y-4">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-400">
                          <Target size={20} />
                       </div>
                       <div>
                          <h4 className="text-lg font-black uppercase tracking-tighter">{saving.goal || 'General Reserve'}</h4>
                          <span className="text-[8px] font-black uppercase text-white/40 tracking-widest">{saving.status}</span>
                       </div>
                    </div>
                    <div className="text-xl font-black">₦{saving.amount.toLocaleString()}</div>
                 </div>
                 <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: '45%' }}
                      className="h-full bg-aba-gold" 
                    />
                 </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 border border-white/5 bg-white/5 rounded-[3rem] text-center">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="text-white/20" />
            </div>
            <p className="text-white/40 text-[9px] font-bold uppercase tracking-[0.2em] leading-relaxed">
              Define a capital goal to unlock manufacturing subsidies.
            </p>
            <button className="mt-8 px-8 py-3 bg-white text-black text-[9px] font-black uppercase tracking-widest rounded-xl hover:scale-105 transition-all">
              Initiate Goal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SavingsView;
