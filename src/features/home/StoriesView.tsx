import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ArrowLeft, Heart, MessageCircle, Share2, Eye } from 'lucide-react';

interface StoriesViewProps {
  onNavigate: (page: string) => void;
}

const STORIES = [
  {
    id: 1,
    title: "The Rise of Ariaria Digital",
    excerpt: "How local artisans are using FindAba to reach customers in Lagos and beyond.",
    author: "Industrial Desk",
    category: "Commerce",
    readTime: "5 min",
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=600&q=80"
  },
  {
    id: 2,
    title: "Mastering Leather Craft",
    excerpt: "A deep dive into the traditional tanning techniques of the Enyimba elders.",
    author: "City Heritage",
    category: "Culture",
    readTime: "8 min",
    image: "https://images.unsplash.com/photo-1558222218-b7b54eede3f3?w=600&q=80"
  }
];

const StoriesView: React.FC<StoriesViewProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-aba-dark text-white font-sans flex flex-col p-6 pb-24">
      <header className="flex items-center gap-6 mb-12 py-4">
        <button onClick={() => onNavigate('home')} className="p-4 bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all active:scale-90 rounded-2xl">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">Stories</h1>
          <p className="text-[10px] font-black tracking-[0.3em] text-aba-gold uppercase mt-1">Enyimba Industrial Chronicles</p>
        </div>
      </header>

      <div className="space-y-8">
        {STORIES.map((story) => (
          <motion.div 
            key={story.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-6 p-8 bg-white/5 border border-white/5 rounded-[3rem] hover:bg-white/10 transition-all group"
          >
            <div className="relative h-64 rounded-[2rem] overflow-hidden">
               <img src={story.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
               <div className="absolute top-6 left-6 px-4 py-2 bg-aba-gold text-black text-[8px] font-black uppercase tracking-widest rounded-lg">
                 {story.category}
               </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-[9px] font-black text-white/40 uppercase tracking-widest">
                <span>By {story.author}</span>
                <span>•</span>
                <span>{story.readTime} Read</span>
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter group-hover:text-aba-gold transition-colors">{story.title}</h2>
              <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-relaxed">{story.excerpt}</p>
              
              <div className="flex items-center justify-between pt-6 border-t border-white/10">
                 <div className="flex gap-4">
                    <button className="flex items-center gap-1.5 text-[9px] font-black text-white/20 hover:text-white"><Eye size={14} /> 1.2k</button>
                    <button className="flex items-center gap-1.5 text-[9px] font-black text-white/20 hover:text-white"><Heart size={14} /> 450</button>
                 </div>
                 <button className="p-3 bg-white/5 rounded-xl hover:bg-aba-gold hover:text-black transition-all">
                    <Share2 size={16} />
                 </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StoriesView;
