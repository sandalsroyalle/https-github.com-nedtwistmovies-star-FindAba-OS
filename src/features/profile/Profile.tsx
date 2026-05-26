import React, { useState, useEffect } from 'react';
import { UserCircle, ArrowLeft, LogOut, Edit, Mail, User, ShieldCheck, MapPin } from 'lucide-react';
import { getSupabase } from '../../services/supabaseService';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileProps {
  onNavigate: (page: string) => void;
}

const Profile: React.FC<ProfileProps> = ({ onNavigate }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  const [business, setBusiness] = useState<any>(null);

  useEffect(() => {
    const fetchSessionAndBusiness = async () => {
      try {
        const supabase = getSupabase();
        const { data: { session } } = await supabase.auth.getSession();
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        
        if (currentUser) {
          const { fetchUserBusiness } = await import('../../services/supabaseService');
          const userBusiness = await fetchUserBusiness(currentUser.id);
          setBusiness(userBusiness);
        }
      } catch (err) {
        console.error("Error fetching session/business:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionAndBusiness();

    const { data: { subscription } } = getSupabase().auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        const { fetchUserBusiness } = await import('../../services/supabaseService');
        const userBusiness = await fetchUserBusiness(currentUser.id);
        setBusiness(userBusiness);
      } else {
        setBusiness(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = getSupabase();
      await supabase.auth.signOut();
      onNavigate('home');
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setAuthLoading(true);
    setMessage(null);

    try {
      const supabase = getSupabase();
      const redirectTo = window.location.origin;
      console.log("Attempting login with redirectTo:", redirectTo);
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo
        }
      });

      if (error) {
        if (error.status === 429) {
          throw new Error("Too many attempts. Please wait a few minutes and try again.");
        }
        throw error;
      }
      setMessage({ type: 'success', text: 'Magic link sent! Check your email.' });
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to send magic link.' });
    } finally {
      setAuthLoading(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'A';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#021E16] text-[#F5F5F5] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-aba-gold/20 border-t-aba-gold rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-aba-dark text-white font-sans flex flex-col p-6 pb-24">
      <header className="flex items-center justify-between mb-12 py-4">
        <button onClick={() => onNavigate('home')} className="p-4 bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-black uppercase tracking-tighter">My Account</h1>
        <div className="w-12" />
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full">
        <AnimatePresence mode="wait">
          {!user ? (
            <motion.div
              key="auth-form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="bg-white/5 border border-white/10 p-12"
            >
              <div className="w-24 h-24 bg-aba-gold flex items-center justify-center mb-10 shadow-2xl">
                <ShieldCheck size={48} className="text-black" />
              </div>
              <h2 className="text-5xl font-black uppercase tracking-tighter mb-4 leading-none">Authentication</h2>
              <p className="text-white/20 text-xs font-black uppercase tracking-[0.3em] mb-12 leading-relaxed">
                Connect your identity to Enyimba City.
              </p>

              <form onSubmit={handleLogin} className="space-y-6">
                <div className="relative border-b border-white/10 focus-within:border-aba-gold transition-all">
                  <Mail className="absolute left-0 top-1/2 -translate-y-1/2 text-white/10" size={18} />
                  <input
                    type="email"
                    placeholder="ENTER YOUR EMAIL..."
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-transparent py-6 pl-8 pr-4 text-sm font-black uppercase tracking-widest outline-none transition-colors placeholder:text-white/5"
                  />
                </div>

                {message && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-[10px] text-center font-black uppercase tracking-widest ${
                      message.type === 'success' ? 'text-aba-gold' : 'text-red-500'
                    }`}
                  >
                    {message.text}
                  </motion.p>
                )}

                <button
                  disabled={authLoading}
                  className="w-full py-6 bg-white text-black font-black uppercase text-xs tracking-[0.3em] shadow-2xl hover:bg-aba-gold transition-all disabled:opacity-50"
                >
                  {authLoading ? 'Verifying...' : 'Request Access'}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="profile-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-12"
            >
              {/* PROFILE CARD */}
              <div className="bg-white/5 border border-white/10 p-12 relative overflow-hidden">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-12">
                  <div className="w-32 h-32 bg-white p-2 shrink-0 grayscale hover:grayscale-0 transition-all shadow-2xl">
                    <div className="w-full h-full bg-aba-dark flex items-center justify-center overflow-hidden">
                      {user.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} className="w-full h-full object-cover" alt="Profile" />
                      ) : (
                        <span className="text-5xl font-black text-aba-gold">
                          {getInitials(user.user_metadata?.full_name || user.email || '')}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex-1 text-center md:text-left space-y-4">
                    <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                      {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Artisan'}
                    </h2>
                    <p className="text-white/20 font-black uppercase tracking-widest text-[10px]">{user.email}</p>

                    {business && (
                      <div className="inline-flex flex-col bg-aba-gold text-black px-6 py-3 mt-4">
                        <span className="text-[8px] font-black uppercase tracking-widest mb-1">Entity Registered</span>
                        <span className="text-xl font-black uppercase leading-none">{business.name}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
                  <button 
                    onClick={() => onNavigate('register')}
                    className="py-6 bg-white text-black font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:bg-aba-gold transition-all"
                  >
                    {business ? 'Manage Entity' : 'Register Business'}
                  </button>

                  <button 
                    onClick={handleLogout}
                    className="py-6 border border-white/10 text-white/40 font-black uppercase text-xs tracking-[0.2em] hover:text-red-500 hover:border-red-500/20 transition-all"
                  >
                    Sign Out
                  </button>

                  {(user.email === 'pastornelsonezi@gmail.com' || user.email === 'admin@findaba.com') && (
                    <button 
                      onClick={() => onNavigate('admin')}
                      className="md:col-span-2 py-6 bg-aba-gold/5 border border-aba-gold/30 text-aba-gold font-black uppercase text-xs tracking-[0.2em] hover:bg-aba-gold/10 transition-all"
                    >
                      Access Registry Hub
                    </button>
                  )}
                </div>
              </div>

              {/* NETWORK STATS */}
              <div className="bg-white/5 border border-white/5 p-12">
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-white/20 mb-10 text-center">Industrial Credentials</h3>
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <p className="text-5xl font-black text-white leading-none">{business ? '01' : '00'}</p>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-4">Entities</p>
                  </div>
                  <div className="text-center border-x border-white/5">
                    <p className="text-5xl font-black text-white leading-none">00</p>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mt-4">Network</p>
                  </div>
                  <div className="text-center">
                    <p className="text-5xl font-black text-aba-gold leading-none">{business?.integrity_grade || '—'}</p>
                    <p className="text-[8px] font-black text-aba-gold/20 uppercase tracking-widest mt-4">Grade</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Profile;
