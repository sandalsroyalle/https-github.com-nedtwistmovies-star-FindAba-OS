import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, LucideIcon, Sparkles } from 'lucide-react';

interface GenericViewProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  onNavigate: (page: string) => void;
  description?: string;
}

const GenericView: React.FC<GenericViewProps> = ({ 
  title, 
  subtitle, 
  icon: Icon, 
  onNavigate,
  description = "This industrial module is currently being optimized for the FindAba network. Check back soon for full integration."
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-8 pb-20"
    >
      <header className="flex items-center gap-4 mb-12">
        <button 
          onClick={() => onNavigate('home')}
          className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center rounded-2xl text-white/40 hover:text-white transition-all"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">{title}</h1>
          <p className="text-[10px] font-black tracking-[0.3em] text-aba-gold uppercase mt-1">{subtitle}</p>
        </div>
      </header>

      <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-12 flex flex-col items-center text-center gap-8">
        <div className="w-24 h-24 bg-aba-gold/10 rounded-[2rem] flex items-center justify-center text-aba-gold">
          <Icon size={48} />
        </div>
        
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-aba-green/10 border border-aba-green/30 rounded-full text-[8px] font-black text-aba-green uppercase tracking-widest">
            <Sparkles size={10} />
            Module Initializing
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tighter">System Integration In Progress</h2>
          <p className="text-white/40 text-xs font-bold uppercase tracking-widest leading-loose max-w-sm">
            {description}
          </p>
        </div>

        <button 
          onClick={() => onNavigate('home')}
          className="px-8 py-4 bg-aba-gold text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-xl"
        >
          Return to Hub
        </button>
      </div>
    </motion.div>
  );
};

export default GenericView;
