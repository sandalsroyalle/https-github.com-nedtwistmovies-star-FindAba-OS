import React from 'react';
import { motion } from 'framer-motion';
import { Info, ArrowLeft, Building2, Globe, Heart } from 'lucide-react';

interface AboutViewProps {
  onNavigate: (page: string) => void;
}

const AboutView: React.FC<AboutViewProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-aba-dark text-white font-sans flex flex-col p-6 pb-24">
      <header className="flex items-center gap-6 mb-12 py-4">
        <button onClick={() => onNavigate('home')} className="p-4 bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all active:scale-90 rounded-2xl">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">About Aba</h1>
          <p className="text-[10px] font-black tracking-[0.3em] text-aba-gold uppercase mt-1">Enyimba Industrial City</p>
        </div>
      </header>

      <div className="space-y-12">
        <div className="relative h-64 rounded-[3rem] overflow-hidden group">
          <img src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80" alt="Aba City" className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 transition-all duration-700" />
          <div className="absolute inset-0 bg-gradient-to-t from-aba-dark to-transparent" />
          <div className="absolute bottom-8 left-8 right-8">
            <h2 className="text-4xl font-black uppercase tracking-tighter">The Giant of the East</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-4">
              <Building2 className="text-aba-gold" size={24} />
              <h3 className="text-xl font-black uppercase tracking-tighter">Industry</h3>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                Aba is the manufacturing hub of West Africa, famous for world-class leather and garments.
              </p>
           </div>
           <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-4">
              <Globe className="text-aba-green" size={24} />
              <h3 className="text-xl font-black uppercase tracking-tighter">Export</h3>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                Our vision is to sync Enyimba products with the global market through findaba.com.ng.
              </p>
           </div>
           <div className="p-8 bg-white/5 border border-white/10 rounded-[2rem] space-y-4">
              <Heart className="text-red-500" size={24} />
              <h3 className="text-xl font-black uppercase tracking-tighter">Spirit</h3>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">
                Driven by the Enyimba spirit of resilience, innovation, and unwavering hard work.
              </p>
           </div>
        </div>

        <div className="p-12 bg-white/5 border border-white/5 rounded-[3rem] space-y-6">
           <h3 className="text-3xl font-black uppercase tracking-tighter">Our Mission</h3>
           <p className="text-white/60 text-sm font-medium leading-[2] uppercase tracking-wide">
             FindAba is a unified operating system for the city of Aba. We are building the infrastructure to digitize commerce, identity, and industrial scaling for millions of artisans and businesses.
           </p>
           <button className="px-12 py-5 bg-aba-gold text-black font-black uppercase text-xs tracking-widest rounded-3xl">Learn more</button>
        </div>
      </div>
    </div>
  );
};

export default AboutView;
