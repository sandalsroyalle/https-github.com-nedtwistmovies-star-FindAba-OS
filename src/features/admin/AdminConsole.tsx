import React, { useState, useEffect } from 'react';
import { ArrowLeft, Loader2, ShieldCheck, CheckCircle2, XCircle, Search, MapPin, Building2, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllBusinesses, getSupabase } from '../../services/supabaseService';
import { Business } from '../../types';

interface AdminConsoleProps {
  onNavigate: (page: string) => void;
}

const AdminConsole: React.FC<AdminConsoleProps> = ({ onNavigate }) => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const loadAllData = React.useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchAllBusinesses(search);
      setBusinesses(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const toggleVerification = async (id: string, currentStatus: boolean) => {
    setActionLoading(id);
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('businesses')
        .update({ is_verified: !currentStatus, verification_status: !currentStatus ? 'Verified' : 'Unverified' })
        .eq('id', id);
      
      if (error) throw error;
      
      setBusinesses(prev => prev.map(b => b.id === id ? { ...b, is_verified: !currentStatus, verification_status: !currentStatus ? 'Verified' : 'Unverified' } : b));
    } catch (err: any) {
      alert("Error updating status: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  const deleteBusiness = async (id: string) => {
    if (!confirm("Are you sure you want to delete this business from the registry?")) return;
    
    setActionLoading(id);
    try {
      const supabase = getSupabase();
      const { error } = await supabase
        .from('businesses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setBusinesses(prev => prev.filter(b => b.id !== id));
    } catch (err: any) {
      alert("Error deleting business: " + err.message);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-aba-dark text-white font-sans flex flex-col">
      {/* HEADER */}
      <header className="p-8 flex items-center justify-between sticky top-0 bg-aba-dark/95 backdrop-blur-xl border-b border-white/5 z-40">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => onNavigate('profile')} 
            className="p-4 bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all active:scale-90"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">Admin Console</h1>
            <p className="text-[10px] text-aba-gold font-black uppercase tracking-[0.3em] mt-1">Registry Oversight</p>
          </div>
        </div>
        <div className="w-14 h-14 bg-aba-gold flex items-center justify-center text-black shadow-2xl">
          <ShieldCheck size={32} />
        </div>
      </header>

      {/* SEARCH */}
      <div className="p-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30" size={18} />
          <input 
            type="text" 
            placeholder="Search registry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-xs font-bold uppercase tracking-widest outline-none focus:border-aba-gold transition-all"
          />
        </div>
      </div>

      <main className="flex-1 p-6 space-y-4 pb-24 overflow-y-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="animate-spin text-aba-gold" size={32} />
            <p className="text-[10px] font-black uppercase tracking-widest text-white/30">Scanning Database...</p>
          </div>
        ) : businesses.length === 0 ? (
          <div className="text-center py-20 px-10">
            <p className="text-white/20 text-[10px] font-black uppercase tracking-widest mb-2">No Records Found</p>
            <p className="text-sm opacity-60">The trade directory is currently empty or matches no search results.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 px-2">
              {businesses.length} INDUSTRIAL ENTITIES LISTED
            </p>
            {businesses.map((biz) => (
              <motion.div 
                key={biz.id}
                layout
                className="bg-white/5 border border-white/10 rounded-3xl p-5 group flex flex-col gap-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-6">
                    <div className="w-20 h-20 bg-white p-0.5 relative shrink-0">
                      <div className="w-full h-full bg-aba-dark flex items-center justify-center overflow-hidden">
                        {biz.image_url ? (
                          <img src={biz.image_url} className="w-full h-full object-cover grayscale" alt="" />
                        ) : (
                          <Building2 className="text-aba-gold/20" size={32} />
                        )}
                      </div>
                      {biz.is_verified && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-aba-gold flex items-center justify-center shadow-2xl">
                          <CheckCircle2 size={14} className="text-black" />
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-black uppercase tracking-tight text-2xl leading-none group-hover:text-aba-gold transition-colors">{biz.name}</h3>
                      <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-2">{biz.category} · {biz.area || 'Aba'}</p>
                      <div className="flex items-center gap-2 text-[9px] text-white/10 mt-4 font-black uppercase tracking-widest">
                        <MapPin size={12} />
                        <span className="truncate">{biz.address || 'Verified City Link'}</span>
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${
                    biz.is_verified ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                  }`}>
                    {biz.verification_status || (biz.is_verified ? 'Verified' : 'Unverified')}
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-2">
                  <button 
                    onClick={() => toggleVerification(biz.id!, biz.is_verified)}
                    disabled={actionLoading === biz.id}
                    className={`flex-1 py-3 rounded-xl font-black uppercase text-[10px] tracking-widest transition-all active:scale-95 flex items-center justify-center gap-2 ${
                      biz.is_verified ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500 text-black'
                    }`}
                  >
                    {actionLoading === biz.id ? <Loader2 className="animate-spin" size={14} /> : (biz.is_verified ? <XCircle size={14} /> : <CheckCircle2 size={14} />)}
                    {biz.is_verified ? 'Revoke Status' : 'Verify Entity'}
                  </button>
                  <button 
                    onClick={() => deleteBusiness(biz.id!)}
                    disabled={actionLoading === biz.id}
                    className="p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-xl hover:bg-red-500/20 transition-all active:scale-90"
                  >
                    <XCircle size={16} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="p-12 bg-aba-dark border-t border-white/5 text-center mt-auto">
        <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 leading-relaxed text-center">
          Secure Registry Protocol · City Oversight Unit · v4.1
        </p>
      </footer>
    </div>
  );
};

export default AdminConsole;
