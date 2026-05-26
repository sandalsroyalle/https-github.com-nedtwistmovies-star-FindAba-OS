import React, { useState, useEffect } from 'react';
import { Search, ArrowLeft, Loader2, BadgeCheck, MapPin, Building2, Store, Hotel as HotelIcon, Utensils, Star, Bed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchAllBusinesses, fetchHotels } from '../services/supabaseService';
import { Business, Hotel } from '../types';

interface CategoryRegistryProps {
  category: string;
  title: string;
  onNavigate: (page: string) => void;
}

const CategoryRegistry: React.FC<CategoryRegistryProps> = ({ category, title, onNavigate }) => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (category.toLowerCase() === 'hotel') {
          const hotels = await fetchHotels();
          setItems(hotels);
        } else {
          const bizData = await fetchAllBusinesses();
          const filtered = bizData.filter(b => 
            b.category?.toLowerCase().includes(category.toLowerCase())
          );
          setItems(filtered);
        }
      } catch (err) {
        console.error("Load registry error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [category]);

  const getIcon = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('hotel') || c.includes('hospitality')) return <HotelIcon size={24} />;
    if (c.includes('food') || c.includes('restaurant')) return <Utensils size={24} />;
    if (c.includes('manufacturing')) return <Building2 size={24} />;
    return <Store size={24} />;
  };

  return (
    <div className="min-h-screen bg-aba-dark text-white font-sans flex flex-col p-6 pb-24">
      <header className="flex items-center gap-6 mb-12 py-4">
        <button onClick={() => onNavigate('home')} className="p-4 bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all active:scale-90 rounded-2xl">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">{title}</h1>
          <p className="text-[10px] font-black tracking-[0.3em] text-aba-gold uppercase mt-1">Verified {title} Network</p>
        </div>
      </header>

      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <Loader2 className="animate-spin text-aba-gold" size={32} />
          <span className="text-[8px] font-black uppercase tracking-widest text-white/20">Syncing City Node</span>
        </div>
      ) : items.length > 0 ? (
        <div className="grid gap-2">
          {items.map(item => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] flex flex-col md:flex-row md:items-center gap-8 group hover:bg-white/10 transition-all cursor-pointer"
            >
              <div className="w-20 h-20 bg-white flex items-center justify-center text-black rounded-[2rem] shrink-0 grayscale group-hover:grayscale-0 transition-all font-black text-2xl">
                {category.toLowerCase() === 'hotel' ? <Bed size={32} /> : getIcon(item.category || '')}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="text-3xl font-black uppercase tracking-tighter group-hover:text-aba-gold transition-colors">{item.name}</h3>
                  {item.is_verified && <BadgeCheck className="text-aba-gold" size={20} />}
                </div>
                <p className="text-[10px] text-white/40 font-bold uppercase mt-1 tracking-widest line-clamp-1">
                   {item.address || item.area || 'Enyimba Region'}
                </p>
                <div className="flex items-center gap-6 mt-4">
                   <div className="flex items-center gap-1 text-aba-gold">
                     <Star size={10} fill="currentColor" />
                     <span className="text-[9px] font-black uppercase tracking-widest">4.8</span>
                   </div>
                   {category.toLowerCase() === 'hotel' && item.rooms_available !== undefined && (
                     <div className="text-[9px] font-black uppercase text-aba-green tracking-widest">
                       {item.rooms_available} Rooms Available
                     </div>
                   )}
                </div>
              </div>
              <button className="px-8 py-4 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-aba-gold hover:text-black transition-all">
                {category.toLowerCase() === 'hotel' ? 'Book' : 'View'}
              </button>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex-1 border border-white/5 bg-white/5 rounded-[3rem] flex flex-col items-center justify-center p-12 text-center">
           <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-white/10 mb-8">
              <Building2 size={48} />
           </div>
           <h2 className="text-2xl font-black uppercase tracking-tighter mb-4">No Listings Found</h2>
           <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed max-w-xs">
              This node in the industrial cluster is currently inactive. Be the first to register.
           </p>
           <button onClick={() => onNavigate('register')} className="mt-8 px-10 py-4 bg-aba-gold text-black font-black uppercase text-xs tracking-widest rounded-2xl">
              Register Entry
           </button>
        </div>
      )}
    </div>
  );
};

export default CategoryRegistry;
