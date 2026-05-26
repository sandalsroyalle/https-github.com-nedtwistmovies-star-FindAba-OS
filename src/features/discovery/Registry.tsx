import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, Loader2, BadgeCheck, MapPin, Building2, Store, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllBusinesses } from '../../services/supabaseService';
import { Business } from '../../types';

interface RegistryProps {
  onNavigate: (page: string) => void;
}

const Registry: React.FC<RegistryProps> = ({ onNavigate }) => {
  const [search, setSearch] = useState('');
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConn = async () => {
      const { checkSupabaseConnection } = await import('../../services/supabaseService');
      const connected = await checkSupabaseConnection();
      setIsConnected(connected);
    };
    checkConn();
  }, []);

  useEffect(() => {
    const loadBusinesses = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAllBusinesses(search);
        setBusinesses(data);
      } catch (err: any) {
        console.error("Load businesses error:", err);
        setError(err.message === 'Failed to fetch' ? "Could not connect to the Market Registry. Please check your signal." : err.message);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(loadBusinesses, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="min-h-screen bg-aba-dark text-white font-sans flex flex-col p-6">
      <header className="flex items-center gap-6 mb-12 py-4">
        <button onClick={() => onNavigate('home')} className="p-4 bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all active:scale-90">
          <ArrowLeft size={24} />
        </button>
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">The Registry</h1>
            {isConnected && (
              <div className="flex items-center gap-1.5 px-2 py-1 bg-aba-green/10 border border-aba-green/30 rounded text-[8px] font-black text-aba-green uppercase tracking-widest animate-pulse">
                <div className="w-1 h-1 bg-aba-green rounded-full" />
                Live
              </div>
            )}
          </div>
          <p className="text-[10px] font-black tracking-[0.3em] text-aba-gold uppercase mt-1">Verified Artisans & Commerce</p>
        </div>
      </header>

      {/* SEARCH BAR */}
      <div className="relative mb-12">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-white/20" size={20} />
        <input 
          type="text" 
          placeholder="Search by name or category..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white/5 border-b border-white/10 py-6 pl-16 pr-6 text-xl outline-none focus:border-aba-gold transition-all placeholder:text-white/10 font-bold"
        />
      </div>

      {/* BUSINESS LIST */}
      <main className="flex-1 overflow-y-auto pb-32">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-6"
            >
              <Loader2 className="w-12 h-12 text-aba-gold animate-spin" />
              <p className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20">Syncing Industrial Data</p>
            </motion.div>
          ) : error ? (
            <motion.div 
              key="error"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-start py-20 px-6 border border-red-500/20 bg-red-500/5"
            >
              <h3 className="text-4xl font-black uppercase tracking-tighter mb-4 text-red-500">Registry Offline</h3>
              <p className="text-white/40 text-sm font-medium leading-relaxed max-w-sm mb-8 uppercase tracking-wide">
                {error}
              </p>
              <button 
                onClick={() => setSearch(s => s + ' ')} 
                className="px-10 py-4 bg-red-500 text-white font-black uppercase text-xs tracking-widest"
              >
                Reconnect
              </button>
            </motion.div>
          ) : businesses.length > 0 ? (
            <motion.div 
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid gap-1 shadow-2xl"
            >
              {businesses.map((biz) => (
                <motion.div 
                  key={biz.id}
                  whileTap={{ scale: 0.99 }}
                  className="bg-white/5 border border-white/5 p-8 flex flex-col md:flex-row md:items-center gap-8 group hover:bg-white/10 transition-all border-l-4 border-l-transparent hover:border-l-aba-gold"
                >
                  <div className="w-20 h-20 bg-white p-4 flex items-center justify-center text-black shrink-0 grayscale group-hover:grayscale-0 transition-all">
                    {biz.category === 'Retail' ? <Store size={32} /> : biz.category === 'Manufacturing' ? <Building2 size={32} /> : <Store size={32} />}
                  </div>
                  
                  <div className="flex-1 min-w-0 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-black uppercase tracking-tight text-3xl truncate group-hover:text-aba-gold transition-colors leading-none">{biz.name}</h3>
                      {biz.is_verified && <BadgeCheck size={24} className="text-aba-gold shrink-0" />}
                    </div>
                    
                    <div className="flex flex-wrap gap-x-6 gap-y-1">
                      <div className="flex items-center gap-2 text-white/40">
                        <span className="text-[10px] font-black uppercase tracking-widest">{biz.category}</span>
                      </div>
                      <div className="flex items-center gap-2 text-white/40">
                        <MapPin size={12} className="text-aba-gold/50" />
                        <span className="text-[10px] font-black uppercase tracking-widest">{biz.area || 'City Center'}</span>
                      </div>
                    </div>
                  </div>

                  <button className="md:opacity-0 group-hover:opacity-100 px-6 py-3 border border-white/20 text-[10px] font-black uppercase tracking-widest transition-all">
                    Connect
                  </button>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div 
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6 text-white/20">
                <Search size={40} />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tighter mb-2">No businesses found</h3>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest max-w-[200px] leading-relaxed">
                Try searching for a different name or industrial category.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Registry;
