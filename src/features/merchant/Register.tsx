import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X, CheckCircle2, ChevronRight, LayoutGrid, Users, MessageSquare, Wallet, User as UserIcon, MapPin, ArrowLeft } from 'lucide-react';
import { saveBusinessToDB, getSupabase } from '../../services/supabaseService';
import AddressLookup from '../../components/AddressLookup';
import { Business } from '../../types';

interface RegisterProps {
  onClose: () => void;
}

const Register: React.FC<RegisterProps> = ({ onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [session, setSession] = useState<any>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [email, setEmail] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  React.useEffect(() => {
    const checkAuth = async () => {
      const supabase = getSupabase();
      if (!supabase) {
        setAuthChecked(true);
        return;
      }
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        setSession(currentSession);

        // Listen for auth changes to catch magic link login immediately
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
          setSession(newSession);
        });

        return () => subscription.unsubscribe();
      } catch (err) {
        console.error("Auth session check failed", err);
      }
      setAuthChecked(true);
    };
    checkAuth();
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const [formData, setFormData] = useState<Partial<Business>>({
    name: '',
    category: 'Manufacturing',
    address: '',
    latitude: null,
    longitude: null,
    city: 'Aba'
  });

  const handlePlaceSelect = (place: google.maps.places.Place) => {
    const location = place.location;
    setFormData(prev => ({
      ...prev,
      address: place.formattedAddress || prev.address,
      latitude: location ? location.lat() : null,
      longitude: location ? location.lng() : null
    }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      setError("Business Name is required");
      return;
    }
    if (!formData.address) {
      setError("Business address is required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await saveBusinessToDB(formData);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    const supabase = getSupabase();
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.href.split('?')[0]
      }
    });
  };

  const handleMagicLink = async () => {
    if (!email || !email.includes('@')) {
      setError("Please enter a valid work email");
      return;
    }
    const supabase = getSupabase();
    setLoading(true);
    try {
      const { error: authError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.href.split('?')[0],
        },
      });
      if (authError) throw authError;
      setMagicLinkSent(true);
      showToast("Magic link sent!");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-aba-dark text-white flex flex-col font-sans">
      {/* HEADER */}
      <header className="p-8 flex items-center justify-between border-b border-white/5">
        <div className="flex items-center gap-6">
          <button onClick={onClose} className="p-4 bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tighter leading-none">Register Entity {session && <span className="text-[10px] bg-aba-green text-black px-2 py-0.5 ml-2 font-black rounded">Live Network</span>}</h1>
            <p className="text-[10px] font-black tracking-[0.3em] text-aba-gold uppercase mt-1">Onboarding to Enyimba City</p>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-8 md:p-20 space-y-12 max-w-4xl mx-auto w-full pb-32">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <form onSubmit={handleRegister} className="space-y-10">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Business Identity</label>
              <input 
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="NAME OF ENTERPRISE..."
                className="w-full bg-transparent border-b border-white/10 py-6 text-2xl font-black uppercase tracking-tighter outline-none focus:border-aba-gold transition-all"
              />
            </div>

            <div className="space-y-4">
               <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Physical Location</label>
               <AddressLookup onPlaceSelect={handlePlaceSelect} />
               {(formData.latitude || (formData.address && formData.address.length > 5)) && (
                 <div className="flex items-center gap-6 p-8 bg-white/5 border border-white/5">
                   <MapPin size={32} className="text-aba-gold shrink-0" />
                   <div className="flex-1 min-w-0">
                     <p className="text-[10px] font-black uppercase text-aba-gold tracking-widest mb-2">
                       {formData.latitude ? 'GPS CONFIRMED' : 'STREET ADDRESS'}
                     </p>
                     <p className="text-sm text-white/60 font-black uppercase tracking-widest leading-loose">
                       {formData.address}
                     </p>
                   </div>
                 </div>
               )}
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-8 bg-white text-black font-black text-xs uppercase tracking-[0.4em] transition-all flex items-center justify-center gap-4 hover:bg-aba-gold shadow-2xl disabled:opacity-50"
            >
              {loading ? 'PROCESSING...' : 'Register Entity'}
              <ChevronRight size={18} />
            </button>
          </form>

          <div className="hidden md:block">
            <div className="bg-white/5 border border-white/5 p-10 h-full flex flex-col justify-between">
              <div className="space-y-6">
                <h2 className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">The FindAba Standard</h2>
                <p className="text-2xl font-black uppercase tracking-tighter leading-tight text-white/60">
                   By registering your business, you become part of the most verified network in Aba.
                </p>
                <ul className="space-y-4 text-[10px] font-black uppercase tracking-[0.2em] text-aba-gold">
                   <li className="flex items-center gap-3">• Digital Integrity Grade</li>
                   <li className="flex items-center gap-3">• Verified Business Badge</li>
                   <li className="flex items-center gap-3">• Global Supply Chain Access</li>
                </ul>
              </div>

              <div className="aspect-square bg-white grayscale overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1590650153855-d9e808231d41?w=800&q=80" 
                  className="w-full h-full object-cover"
                  alt="Industrial Scene"
                />
              </div>
            </div>
          </div>
        </section>
      </main>

      <p className="text-[10px] text-center text-white/20 font-bold uppercase tracking-widest px-8 pb-32">
        By registering, you agree to our terms of service and trade rules.
      </p>

      {/* ERROR TOAST */}
      <AnimatePresence>
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-x-4 top-24 z-[100] bg-white text-black p-6 rounded-[2rem] shadow-2xl flex items-center gap-4 border border-black/5"
          >
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
              <AlertCircle size={24} />
            </div>
            <div className="flex-1">
              <h3 className="font-black text-xs uppercase tracking-tight leading-tight">
                {error.includes('SUPABASE_CONFIG_MISSING') 
                  ? 'Configuration Required: Please update database settings.' 
                  : `Error: ${error}`}
              </h3>
            </div>
            <button onClick={() => setError(null)} className="text-neutral-400 hover:text-black">
              <X size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SUCCESS TOAST */}
      <AnimatePresence>
        {success && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-[100] bg-[#021E16] flex flex-col items-center justify-center p-8 text-center"
          >
            <CheckCircle2 size={120} className="text-aba-gold mb-8" />
            <h1 className="text-4xl font-black uppercase tracking-tighter mb-4">Registration Successful!</h1>
            <p className="text-[#F5F5F5]/60 mb-12">Your business is now being verified for the FindAba directory.</p>
            <button onClick={() => setSuccess(false)} className="px-12 py-5 bg-white text-black rounded-full font-black uppercase text-xs tracking-widest">
              Continue
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BOTTOM NAV BAR */}
      <nav className="fixed bottom-0 inset-x-0 bg-[#021E16]/80 backdrop-blur-xl border-t border-white/5 p-4 flex justify-between items-center z-40">
        <NavButton onClick={onClose} icon={<LayoutGrid size={20}/>} label="Home" />
        <NavButton onClick={() => showToast('Faces directory coming soon')} icon={<Users size={20}/>} label="Faces" />
        <NavButton onClick={() => showToast('Assistant is in training')} icon={<MessageSquare size={20}/>} label="Assistant" />
        <NavButton onClick={() => showToast('Wallet activation requires verification')} icon={<Wallet size={20}/>} label="Wallet" />
        <NavButton onClick={() => showToast('Profile arriving soon')} icon={<UserIcon size={20}/>} label="Profile" />
      </nav>

      {/* AUTH GUARD OVERLAY */}
      {!session && authChecked && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 z-[110] bg-aba-dark/95 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center"
        >
          <div className="w-24 h-24 bg-aba-gold/20 rounded-[2rem] flex items-center justify-center text-aba-gold mb-8">
            <UserIcon size={48} />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-4">Network Identity</h1>
          
          <AnimatePresence mode="wait">
            {!magicLinkSent ? (
              <motion.div 
                key="auth-options"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col gap-8 w-full max-w-xs"
              >
                <p className="text-white/40 uppercase font-bold text-[10px] tracking-widest leading-loose">
                  To register your industry and secure your digital integrity grade, authenticate with the FindAba network.
                </p>

                <div className="space-y-4">
                  <button 
                    onClick={handleLogin}
                    className="w-full py-5 bg-aba-gold text-black font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-2xl flex items-center justify-center gap-3"
                  >
                    Continue with Google
                  </button>

                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5" /></div>
                    <div className="relative flex justify-center text-[8px] uppercase font-black text-white/20 tracking-widest bg-aba-dark px-2">Or Use Magic Link</div>
                  </div>

                  <div className="space-y-3">
                    <input 
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="ENTER WORK EMAIL..."
                      className="w-full bg-white/5 border border-white/10 p-5 rounded-2xl text-[10px] font-bold uppercase tracking-widest outline-none focus:border-aba-gold transition-all placeholder:text-white/20"
                    />
                    <button 
                      onClick={handleMagicLink}
                      disabled={loading}
                      className="w-full py-5 border border-white/10 text-white/60 font-black uppercase text-[10px] tracking-[0.2em] rounded-2xl hover:bg-white/5 transition-all"
                    >
                      {loading ? "SENDING..." : "Send Magic Link"}
                    </button>
                  </div>
                </div>

                <button 
                  onClick={onClose}
                  className="text-[9px] text-white/20 font-black uppercase tracking-widest hover:text-white"
                >
                  Return to Dashboard
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="magic-sent"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8 max-w-xs"
              >
                <div className="w-20 h-20 bg-aba-green/20 rounded-full flex items-center justify-center text-aba-green mx-auto">
                  <CheckCircle2 size={40} />
                </div>
                <h2 className="text-2xl font-black uppercase tracking-tighter">Check Your Inbox</h2>
                <p className="text-white/40 text-[10px] font-bold uppercase tracking-widest leading-loose">
                  We've sent a magic link to <span className="text-white">{email}</span>. Click the link in the email to automatically sign in.
                </p>
                <button 
                  onClick={() => setMagicLinkSent(false)}
                  className="text-aba-gold text-[10px] font-black uppercase tracking-widest underline decoration-aba-gold/30 underline-offset-4"
                >
                  Change Email
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* TOAST PANEL */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-aba-gold px-6 py-3 rounded-2xl shadow-2xl shadow-black/40 text-black text-xs font-black uppercase tracking-widest whitespace-nowrap"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavButton = ({ icon, label, onClick, active = false }: { icon: any, label: string, onClick: () => void, active?: boolean }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all active:scale-95 ${active ? 'text-aba-gold' : 'text-white/40'} hover:text-white group`}
  >
    <div className={`p-2.5 rounded-2xl transition-all ${active ? 'bg-aba-gold/10 shadow-lg shadow-aba-gold/5' : 'group-hover:bg-white/5'}`}>
      {icon}
    </div>
    <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
  </button>
);

export default Register;
