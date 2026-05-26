import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, User, Briefcase, MapPin, Phone, Sparkles, Building2, ShieldCheck } from 'lucide-react';

const ONBOARDING_STEPS = [
  {
    tag: "CITY PRIDE",
    title: "Enyimba City is Open for Business",
    subtext: "Experience the pulse of Aba. We've mapped every artisan, warehouse, and market stall so you don't have to.",
    image: "https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=1200&q=80",
    color: "bg-aba-gold"
  },
  {
    tag: "VERIFIED",
    title: "Unmatched Local Excellence",
    subtext: "From world-class footwear to precision metalwork. Discover the makers that define 'Made in Aba'.",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&q=80",
    color: "bg-aba-green"
  },
  {
    tag: "LOGISTICS",
    title: "Seamless Supply Chains",
    subtext: "Move goods from Ariaria to the world. Connect with trusted logistics partners instantly.",
    image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?w=1200&q=80",
    color: "bg-white"
  }
];

interface OnboardingProps {
  onComplete: () => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showSetup, setShowSetup] = useState(false);
  const [role, setRole] = useState<'buyer' | 'business' | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    location: ''
  });

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      setShowSetup(true);
    }
  };

  const handleFinish = () => {
    if (role && formData.fullName && formData.phone && formData.location) {
      onComplete();
    }
  };

  const step = ONBOARDING_STEPS[currentStep];

  return (
    <div className="fixed inset-0 bg-aba-dark text-white z-50 overflow-hidden flex flex-col md:flex-row">
      <AnimatePresence mode="wait">
        {!showSetup ? (
          <motion.div 
            key="story"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 relative flex flex-col"
          >
            {/* BACKGROUND IMAGE - Full bleed on mobile, split on desktop */}
            <div className="absolute inset-0 md:relative md:w-1/2 h-full overflow-hidden">
               <motion.img 
                  key={step.image}
                  src={step.image}
                  initial={{ scale: 1.2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 0.6 }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
                  alt="Aba Culture"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-aba-dark via-aba-dark/20 to-transparent" />
            </div>

            {/* CONTENT OVERLAY */}
            <div className="absolute inset-0 md:absolute md:inset-auto md:right-0 md:w-1/2 h-full z-10 flex flex-col justify-end p-8 md:p-16 md:justify-center">
              <div className="max-w-xl">
                <motion.div
                  key={`content-${currentStep}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="space-y-6"
                >
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${step.color} text-black`}>
                      {step.tag}
                    </span>
                    <div className="hidden md:block h-px w-20 bg-white/20" />
                  </div>
                  
                  <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] uppercase">
                    {step.title.split(' ').map((word, i) => (
                      <span key={i} className="block overflow-hidden">
                        <motion.span 
                          initial={{ y: "100%" }}
                          animate={{ y: 0 }}
                          transition={{ delay: i * 0.1, duration: 0.5 }}
                          className="inline-block"
                        >
                          {word}
                        </motion.span>
                      </span>
                    ))}
                  </h1>

                  <p className="text-lg md:text-xl text-white/60 font-light leading-relaxed max-w-md">
                    {step.subtext}
                  </p>

                  <div className="pt-8 flex flex-col sm:flex-row gap-4">
                    <button 
                      onClick={handleNext}
                      className="group relative px-8 py-4 bg-aba-gold text-black font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 overflow-hidden"
                    >
                      <span>{currentStep === ONBOARDING_STEPS.length - 1 ? "Enter FindAba" : "Next Chapter"}</span>
                      <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                    </button>
                    <button 
                      onClick={() => setShowSetup(true)}
                      className="px-8 py-4 border border-white/20 hover:bg-white/5 text-white/60 hover:text-white font-black uppercase text-xs tracking-widest transition-all"
                    >
                      Skip Story
                    </button>
                  </div>
                </motion.div>
              </div>

              {/* PROGRESS BAR */}
              <div className="mt-12 md:absolute md:bottom-12 md:left-12 flex gap-3">
                {ONBOARDING_STEPS.map((_, i) => (
                  <div 
                    key={i}
                    className={`h-1 transition-all duration-500 rounded-full ${i === currentStep ? 'w-12 bg-aba-gold' : 'w-4 bg-white/10'}`}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="setup"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 bg-aba-dark flex flex-col md:flex-row"
          >
            {/* LEFT SIDE: SELECTION */}
            <div className="flex-1 p-8 md:p-20 flex flex-col justify-center border-b md:border-b-0 md:border-r border-white/5">
              <div className="max-w-md mx-auto w-full space-y-12">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-[0.9]">Start Your Journey</h2>
                  <p className="text-white/40 text-lg">Are you searching for quality, or providing it?</p>
                </div>

                <div className="grid gap-6">
                  <RoleCard 
                    active={role === 'buyer'} 
                    onClick={() => setRole('buyer')}
                    icon={<Sparkles size={24} />}
                    title="I'm a Buyer"
                    desc="I want to find trusted artisans and businesses."
                  />
                  <RoleCard 
                    active={role === 'business'} 
                    onClick={() => setRole('business')}
                    icon={<Building2 size={24} />}
                    title="I'm a Merchant"
                    desc="I want to list my business in the registry."
                  />
                </div>
              </div>
            </div>

            {/* RIGHT SIDE: DETAILS */}
            <div className="flex-1 p-8 md:p-20 flex flex-col justify-center bg-white/[0.02]">
              <div className="max-w-md mx-auto w-full space-y-8">
                <div className="space-y-6">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-aba-gold">Basic Credentials</h3>
                  
                  <div className="space-y-4">
                    <InputGroup 
                      icon={<User size={18} />} 
                      placeholder="Full Name" 
                      value={formData.fullName}
                      onChange={val => setFormData(p => ({...p, fullName: val}))}
                    />
                    <InputGroup 
                      icon={<Phone size={18} />} 
                      placeholder="Phone Number" 
                      value={formData.phone}
                      onChange={val => setFormData(p => ({...p, phone: val}))}
                    />
                    <InputGroup 
                      icon={<MapPin size={18} />} 
                      placeholder="Current Area (e.g. Ogbor Hill)" 
                      value={formData.location}
                      onChange={val => setFormData(p => ({...p, location: val}))}
                    />
                  </div>
                </div>

                <div className="pt-4 space-y-6">
                  <div className="flex items-start gap-4 p-4 rounded-2xl bg-aba-gold/5 border border-aba-gold/10">
                    <ShieldCheck className="text-aba-gold shrink-0" size={20} />
                    <p className="text-[10px] text-white/50 leading-relaxed uppercase tracking-wider">
                      By continuing, you agree to FindAba's merchant standards and community guidelines for Enyimba City.
                    </p>
                  </div>

                  <button 
                    disabled={!role || !formData.fullName || !formData.phone || !formData.location}
                    onClick={handleFinish}
                    className="w-full py-5 bg-white text-black font-black uppercase text-xs tracking-[0.2em] disabled:opacity-20 disabled:cursor-not-allowed transition-all hover:bg-aba-gold"
                  >
                    Complete Registration
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const RoleCard = ({ active, onClick, icon, title, desc }: any) => (
  <button 
    onClick={onClick}
    className={`p-8 text-left border-2 transition-all group ${
      active ? 'border-aba-gold bg-aba-gold/5' : 'border-white/5 bg-white/5 hover:bg-white/10'
    }`}
  >
    <div className={`w-12 h-12 rounded-xl mb-4 flex items-center justify-center transition-all ${
      active ? 'bg-aba-gold text-black' : 'bg-white/5 text-white/40'
    }`}>
      {icon}
    </div>
    <h4 className={`text-xl font-black uppercase tracking-tight mb-2 ${active ? 'text-aba-gold' : 'text-white'}`}>{title}</h4>
    <p className="text-xs text-white/40 leading-relaxed uppercase tracking-wide">{desc}</p>
  </button>
);

const InputGroup = ({ icon, placeholder, value, onChange }: any) => (
  <div className="relative group">
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-aba-gold transition-colors">
      {icon}
    </div>
    <input 
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full bg-white/5 border border-white/10 py-5 pl-12 pr-6 text-sm outline-none focus:border-aba-gold focus:bg-white/10 transition-all font-medium placeholder:text-white/20"
    />
  </div>
);

export default Onboarding;

