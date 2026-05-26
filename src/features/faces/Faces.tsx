import React from 'react';
import { motion } from 'framer-motion';
import { User, Sparkles, ArrowLeft, Heart, MessageCircle } from 'lucide-react';

interface FacesProps {
  onNavigate: (page: string) => void;
}

const FACES = [
  { id: 1, name: "Kalu Nwosu", role: "Master Cobbler", area: "Ariaria Market", image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&q=80" },
  { id: 2, name: "Uche Amadi", role: "Metal Fabricator", area: "Cemetery Market", image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=400&q=80" },
  { id: 3, name: "Chidi Okafor", role: "Fashion Designer", area: "Ahia Ohuru", image: "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=400&q=80" },
  { id: 4, name: "Ngozi Obi", role: "Leather Tannery", area: "Aba North", image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400&q=80" },
];

const Faces: React.FC<FacesProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-aba-dark text-white flex flex-col p-6 pb-24">
      <header className="flex items-center gap-6 mb-12 py-4">
        <button onClick={() => onNavigate('home')} className="p-4 bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all transform active:scale-90">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">Faces Of Aba</h1>
          <p className="text-[10px] font-black tracking-[0.3em] text-aba-gold uppercase mt-1">The Soul of Enyimba City</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {FACES.map((face) => (
          <motion.div 
            key={face.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative h-96 overflow-hidden rounded-[2rem] border border-white/5"
          >
            <img src={face.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={face.name} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-8 space-y-2">
               <div className="flex items-center gap-2">
                 <Sparkles size={14} className="text-aba-gold" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-aba-gold">{face.area}</span>
               </div>
               <h3 className="text-3xl font-black uppercase tracking-tighter leading-none">{face.name}</h3>
               <p className="text-white/40 font-bold uppercase tracking-widest text-xs">{face.role}</p>
               
               <div className="flex gap-4 pt-4 pt-4 border-t border-white/10 mt-6">
                 <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-aba-gold">
                   <Heart size={16} /> 2.4k
                 </button>
                 <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-aba-gold">
                   <MessageCircle size={16} /> Connect
                 </button>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-12 p-8 bg-aba-gold/5 border border-aba-gold/10 rounded-[2rem] text-center">
         <p className="text-sm font-bold uppercase tracking-widest text-aba-gold/40">Want to be featured?</p>
         <button className="mt-4 px-10 py-4 bg-aba-gold text-black font-black uppercase text-xs tracking-[0.2em] hover:scale-105 transition-all">
            Join the Registry
         </button>
      </div>
    </div>
  );
};

export default Faces;
