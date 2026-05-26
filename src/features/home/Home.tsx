import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Menu, 
  ArrowRight, 
  Layers, 
  Zap, 
  UserCircle,
  X,
  Plus,
  Database,
  RefreshCw,
  Users,
  Briefcase,
  Truck,
  Sparkles,
  Search,
  ShoppingCart,
  Store,
  Wallet,
  MessageSquare,
  Hotel,
  ShieldCheck,
  Info,
  BookOpen,
  History,
  Navigation,
  Globe,
  Settings,
  Github,
  Map,
  User,
  Activity,
  Sun,
  LayoutGrid,
  ChevronRight
} from 'lucide-react';
import Registry from '../discovery/Registry';
import ElderKaluAI from '../intelligence/ElderKaluAI';
import Profile from '../profile/Profile';
import Faces from '../faces/Faces';
import LogisticsView from '../logistics/LogisticsView';
import SavingsView from '../savings/SavingsView';
import WalletView from '../wallet/WalletView';
import SupportView from '../support/SupportView';
import LeadershipHQ from '../admin/LeadershipHQ';
import AboutView from './AboutView';
import PrivacyView from './PrivacyView';
import StoriesView from './StoriesView';
import CategoryRegistry from '../../components/CategoryRegistry';
import GenericView from '../../components/GenericView';

interface HomeProps {
  onRegisterClick: () => void;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const Home: React.FC<HomeProps> = ({ onRegisterClick, onNavigate, currentPage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'connected' | 'error'>('idle');
  const [githubStatus, setGithubStatus] = useState<'idle' | 'syncing' | 'connected' | 'error'>('idle');
  const [githubUser, setGithubUser] = useState<string | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  React.useEffect(() => {
    // Pro-actively check Supabase connection on load
    const verifyConnection = async () => {
      try {
        const { checkSupabaseConnection } = await import('../../services/supabaseService');
        const isSupabaseConnected = await checkSupabaseConnection();
        if (isSupabaseConnected) {
          setSyncStatus('connected');
        }

        const { checkGithubConnection } = await import('../../services/githubService');
        const { connected: isGithubConnected, username, error } = await checkGithubConnection();
        if (isGithubConnected) {
          setGithubStatus('connected');
          setGithubUser(username || null);
        } else if (error === 'BAD_CREDENTIALS') {
          setGithubStatus('error');
        } else if (error === 'RATE_LIMITED') {
          setGithubStatus('error');
          showToast("GitHub Error: Rate limited. Please wait.", 'error');
        }
      } catch (err) {
        console.warn("Initial connection check failed");
      }
    };
    verifyConnection();
  }, []);

  const handleSync = async () => {
    setSyncStatus('syncing');
    try {
      const { checkSupabaseConnection } = await import('../../services/supabaseService');
      const isConnected = await checkSupabaseConnection();
      if (isConnected) {
        setSyncStatus('connected');
        showToast("Database Sync: Connected successfully", 'success');
      } else {
        setSyncStatus('error');
        showToast("Database Sync: Connection failed", 'error');
      }
    } catch (err) {
      setSyncStatus('error');
    }
  };

  const handleGithubSync = async () => {
    setGithubStatus('syncing');
    try {
      const { checkGithubConnection } = await import('../../services/githubService');
      const { connected: isConnected, username, error } = await checkGithubConnection();
      
      if (isConnected) {
        setGithubStatus('connected');
        setGithubUser(username || null);
        showToast(`GitHub Sync: Connected as ${username}`, 'success');
      } else {
        setGithubStatus('error');
        setGithubUser(null);
        if (error === 'BAD_CREDENTIALS') {
          showToast("GitHub Error: Bad Credentials. Check your token.", 'error');
        } else if (error === 'NO_TOKEN') {
          showToast("GitHub Error: Token missing. Add it to Secrets.", 'error');
        } else if (error === 'RATE_LIMITED') {
          showToast("GitHub Error: Rate limit reached. Try later.", 'error');
        } else if (error === 'NETWORK_ERROR') {
          showToast("GitHub Error: Network timeout. check connection.", 'error');
        } else {
          showToast("GitHub Error: Sync failed. Please try again.", 'error');
        }
      }
    } catch (err) {
      setGithubStatus('error');
      showToast("GitHub Error: Terminal connection failed.", 'error');
    }
  };

  const handleMenuNavigate = (page: string) => {
    setIsMenuOpen(false);
    onNavigate(page);
  };

  return (
    <div className="h-screen bg-aba-dark text-white flex flex-col overflow-hidden relative">
      {/* SIDE MENU */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-80 bg-aba-dark z-[101] flex flex-col border-l border-white/10"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-aba-gold via-white/50 to-aba-green p-0.5 rounded-lg shadow-lg">
                    <div className="w-full h-full bg-black rounded-[7px] flex items-center justify-center p-2">
                       <img src="input_file_0.png" className="w-full h-full object-contain" alt="" />
                    </div>
                  </div>
                  <div>
                    <h2 className="text-sm font-black tracking-tighter uppercase leading-none">Find<span className="text-white/40">Aba</span></h2>
                    <p className="text-[10px] text-aba-gold font-bold mt-1">v 6.1</p>
                  </div>
                </div>
                <button onClick={() => setIsMenuOpen(false)} className="w-10 h-10 bg-white/5 flex items-center justify-center rounded-lg hover:bg-white/10">
                  <X size={20} className="text-white/40" />
                </button>
              </div>

              <div className="p-6 space-y-3">
                <button 
                  onClick={() => { setIsMenuOpen(false); onRegisterClick(); }}
                  className="w-full py-4 bg-aba-green text-black font-black text-[10px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 rounded-xl active:scale-95 transition-all"
                >
                  <Plus size={14} /> Add Listing
                </button>
                <button 
                  onClick={handleSync}
                  className={`w-full py-3 border font-bold text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 rounded-xl transition-all ${
                    syncStatus === 'connected' ? 'border-aba-green/30 text-aba-green bg-aba-green/5' : 
                    syncStatus === 'error' ? 'border-red-500/30 text-red-500 bg-red-500/5' :
                    'border-white/10 text-white/40 hover:bg-white/5'
                  }`}
                >
                  <Database size={14} /> {syncStatus === 'connected' ? 'Database Linked' : syncStatus === 'error' ? 'Link Error' : 'Sync Database'}
                </button>
                <div className="flex gap-2">
                   <button 
                     onClick={() => window.open('https://findaba.com.ng', '_blank')}
                     className="flex-1 py-3 border border-white/10 text-white/40 font-bold text-[9px] uppercase flex items-center justify-center rounded-xl hover:bg-white/5"
                   >
                      <Globe size={14} />
                   </button>
                   <button 
                     onClick={handleGithubSync}
                     className={`flex-[3] py-3 font-black text-[9px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 rounded-xl active:scale-95 transition-all ${
                       githubStatus === 'connected' ? 'bg-aba-gold text-black' : 
                       githubStatus === 'error' ? 'bg-red-500/10 border border-red-500/30 text-red-500' :
                       githubStatus === 'syncing' ? 'bg-white/10 text-white/40' :
                       'bg-aba-gold text-black'
                     }`}
                   >
                      <Github size={14} /> 
                      {githubStatus === 'connected' ? 'Github Linked' : 
                       githubStatus === 'syncing' ? 'Connecting...' :
                       githubStatus === 'error' ? 'Sync Error' :
                       'Sync Github'}
                   </button>
                </div>

                {githubStatus === 'error' && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-3 bg-red-500/5 border border-red-500/10 rounded-xl"
                  >
                    <p className="text-[8px] font-bold text-red-400 uppercase tracking-wider leading-relaxed">
                      GitHub initialization failed. Ensure your token is correct in the Secrets panel.
                      <a 
                        href="https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/managing-your-personal-access-tokens" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="ml-1 text-white underline underline-offset-2 hover:text-aba-gold transition-colors inline-flex items-center gap-1"
                      >
                        Troubleshoot <Info size={8} />
                      </a>
                    </p>
                  </motion.div>
                )}

                <div className="pt-2">
                   <div className="p-3 bg-white/5 rounded-xl border border-white/5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[7px] font-black uppercase text-white/20 tracking-widest">System Health</span>
                        <div className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'connected' ? 'bg-aba-green' : 'bg-red-500'} animate-pulse`} />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center text-[7px] font-bold uppercase">
                           <span className="text-white/40">Database Node</span>
                           <span className={syncStatus === 'connected' ? 'text-aba-green' : 'text-red-400'}>{syncStatus === 'connected' ? 'ONLINE' : 'OFFLINE'}</span>
                        </div>
                        <div className="flex justify-between items-center text-[7px] font-bold uppercase">
                           <span className="text-white/40">Industrial Sync</span>
                           <span className={githubStatus === 'connected' ? 'text-aba-gold' : 'text-red-400'}>{githubStatus === 'connected' ? 'ACTIVE' : 'INACTIVE'}</span>
                        </div>
                      </div>
                   </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-4 space-y-8 scrollbar-hide">
                <div className="space-y-6">
                  <MenuLink icon={<Users size={18} />} label="Faces of Aba" onClick={() => handleMenuNavigate('faces')} />
                  <MenuLink icon={<Wallet size={18} />} label="Wallet" onClick={() => handleMenuNavigate('wallet')} />
                  <MenuLink icon={<Truck size={18} />} label="Logistics" onClick={() => handleMenuNavigate('logistics')} />
                  <div className="h-px bg-white/5 mx-2" />
                  <MenuLink icon={<Hotel size={18} />} label="Hotels" onClick={() => handleMenuNavigate('hotels')} />
                  <MenuLink icon={<ArrowRight size={18} />} label="Delivery" onClick={() => handleMenuNavigate('delivery')} />
                  <MenuLink icon={<Briefcase size={18} />} label="Savings" onClick={() => handleMenuNavigate('savings')} />
                  <div className="h-px bg-white/5 mx-2" />
                  <MenuLink icon={<ShieldCheck size={18} />} label="Privacy & Safety" onClick={() => handleMenuNavigate('privacy')} />
                  <MenuLink icon={<Info size={18} />} label="About Aba" onClick={() => handleMenuNavigate('about')} />
                  <MenuLink icon={<Layers size={18} />} label="Directory" onClick={() => handleMenuNavigate('registry')} />
                  <div className="h-px bg-white/5 mx-2" />
                  <MenuLink icon={<Activity size={18} />} label="Support" onClick={() => handleMenuNavigate('support')} />
                  <MenuLink icon={<Navigation size={18} />} label="Discover" onClick={() => handleMenuNavigate('registry')} />
                  <MenuLink icon={<BookOpen size={18} />} label="Stories" onClick={() => handleMenuNavigate('stories')} />
                  <MenuLink icon={<ShieldCheck size={18} />} label="Leadership HQ" onClick={() => handleMenuNavigate('admin')} />
                </div>
              </div>

              <div className="p-6 bg-white/5 border-t border-white/5 shrink-0">
                <div className="bg-white/5 p-6 rounded-3xl text-center border border-white/5">
                   <p className="text-[9px] font-black text-aba-gold uppercase tracking-[0.3em] mb-1">Monday, May 18</p>
                   <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">SandalsRoyalle Hub</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className={`fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl z-[200] flex items-center gap-3 backdrop-blur-xl border ${
              toast.type === 'error' ? 'bg-red-500/20 border-red-500/30 text-red-200' : 'bg-aba-green/20 border-aba-green/30 text-aba-green'
            }`}
          >
            {toast.type === 'error' ? <X size={16} /> : <Sparkles size={16} />}
            <span className="text-[10px] font-black uppercase tracking-widest">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP TICKER BAR */}
      <div className="bg-[#00261A] border-b border-white/5 px-6 py-2 flex items-center justify-between z-40 shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[8px] font-black uppercase text-aba-gold">
            <div className="w-4 h-4 bg-aba-gold/10 rounded flex items-center justify-center">
              <Plus size={8} />
            </div>
            MON, MAY 18, 2026
          </div>
          <div className="h-3 w-px bg-white/10" />
          <div className="text-[8px] font-black uppercase text-white/40 tracking-widest">
            AFOR MARKET DAY
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-[8px] font-black uppercase text-white/40">
            <Sun size={10} className="text-aba-gold" />
            28°C • Clear
          </div>
          <div className="flex items-center gap-2 text-aba-green">
            <div className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'connected' ? 'bg-aba-green' : 'bg-red-500'}`} />
            <Database size={10} />
          </div>
        </div>
      </div>

      <header className="p-6 flex items-center justify-between z-40 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-transparent p-[1.5px] rounded-lg border border-white/5 shadow-xl">
            <div className="w-full h-full bg-aba-dark rounded-[7px] flex items-center justify-center overflow-hidden p-2">
               <img src="input_file_0.png" className="w-full h-full object-contain" alt="" />
            </div>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-tighter uppercase leading-none">Find<span className="text-white/40">Aba</span></h1>
            <p className="text-[9px] text-aba-gold font-black uppercase tracking-[0.2em]">SANDALSROYALLE · •</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {githubStatus === 'connected' && (
            <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-aba-gold/10 border border-aba-gold/20 rounded-full">
              <Github size={10} className="text-aba-gold" />
              <span className="text-[7px] font-black text-aba-gold uppercase tracking-widest">Synced: {githubUser}</span>
            </div>
          )}
          <button className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
            <Search size={22} />
          </button>
          <div className="relative">
            <button className="w-10 h-10 flex items-center justify-center text-white/40 hover:text-white transition-colors">
              <Bell size={22} />
            </button>
            <div className="absolute top-2 right-2 w-3.5 h-3.5 bg-aba-gold text-black text-[8px] font-black flex items-center justify-center rounded-full border-2 border-aba-dark">2</div>
          </div>
          <button onClick={() => onNavigate('profile')} className="w-10 h-10 bg-aba-green/10 border border-aba-green/20 text-aba-green flex items-center justify-center rounded-full mx-1 hover:bg-aba-green/20 transition-all">
            <User size={20} />
          </button>
          <button 
            onClick={() => setIsMenuOpen(true)}
            className={`w-10 h-10 flex items-center justify-center transition-colors ${isMenuOpen ? 'text-white' : 'text-white/40 hover:text-white'}`}
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 overflow-y-auto pt-6 px-6 pb-24">
        <AnimatePresence mode="wait">
          {currentPage === 'home' ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-12 flex flex-col items-center justify-center min-h-[70vh]"
            >
              <div className="text-center space-y-8">
                <div className="flex flex-col items-center gap-3">
                  <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-aba-gold/5 border border-aba-gold/20 rounded-xl">
                    <Settings size={14} className="text-aba-gold animate-spin-slow" />
                    <span className="text-[10px] font-black text-aba-gold uppercase tracking-[0.4em]">FindAba Business Network</span>
                  </div>
                  {githubStatus === 'connected' ? (
                    <div className="flex items-center gap-2 text-[7px] font-black text-aba-green uppercase tracking-[0.3em]">
                      <Sparkles size={8} /> Active Industrial Sync Enabling
                    </div>
                  ) : githubStatus === 'error' ? (
                    <div className="flex items-center gap-2 text-[7px] font-black text-red-400 uppercase tracking-[0.3em]">
                      <Activity size={8} /> GitHub Node Offline - Check Credentials
                    </div>
                  ) : null}
                </div>
                
                <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-[0.8] uppercase flex flex-col items-center">
                  <span className="text-white">The Hub For</span>
                  <span className="text-aba-gold">Aba Trade.</span>
                </h1>
                
                <p className="text-white/40 text-[11px] font-black uppercase tracking-[0.3em] leading-relaxed max-w-sm mx-auto text-center px-4">
                  Find verified artisans, discover market hubs, and trade securely across the city.
                </p>
              </div>

              <div className="grid gap-4 w-full max-w-sm mx-auto">
                <button 
                   onClick={() => onNavigate('registry')}
                   className="w-full bg-white text-black p-5 rounded-[2.5rem] flex items-center justify-between group active:scale-95 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                >
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl">
                        <Search size={24} />
                      </div>
                      <div className="text-left">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-black/30 mb-0.5">Business Listing</p>
                        <h2 className="text-2xl font-black tracking-tighter uppercase leading-none flex items-center gap-2">
                          Get Started <ArrowRight size={20} />
                        </h2>
                      </div>
                   </div>
                </button>

                <button 
                   onClick={() => onNavigate('support')}
                   className="w-full bg-aba-green text-black p-5 rounded-[2.5rem] flex items-center justify-between group active:scale-95 transition-all shadow-[0_20px_50px_rgba(0,166,81,0.2)]"
                >
                   <div className="flex items-center gap-6">
                      <div className="w-14 h-14 bg-black/10 rounded-2xl flex items-center justify-center text-white shadow-xl">
                        <MessageSquare size={24} />
                      </div>
                      <div className="text-left">
                        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-black/30 mb-0.5">Customer Support</p>
                        <h2 className="text-2xl font-black tracking-tighter uppercase leading-none flex items-center gap-2">
                       Chat With Us ✨
                        </h2>
                      </div>
                   </div>
                </button>
              </div>

              <div className="pt-8">
                 <button className="text-[10px] font-black uppercase tracking-[0.5em] text-white/10 hover:text-aba-gold/40 transition-colors">
                    Industrial Partner • 2026
                 </button>
              </div>
            </motion.div>
          ) : currentPage === 'registry' ? (
            <motion.div key="registry" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Registry onNavigate={onNavigate} />
            </motion.div>
          ) : currentPage === 'assistant' ? (
            <motion.div key="assistant" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <ElderKaluAI onNavigate={onNavigate} />
            </motion.div>
          ) : currentPage === 'profile' ? (
            <motion.div key="profile" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Profile onNavigate={onNavigate} />
            </motion.div>
          ) : currentPage === 'faces' ? (
            <motion.div key="faces" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Faces onNavigate={onNavigate} />
            </motion.div>
          ) : currentPage === 'wallet' ? (
            <motion.div key="wallet" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WalletView onNavigate={onNavigate} />
            </motion.div>
          ) : currentPage === 'logistics' ? (
            <motion.div key="logistics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LogisticsView onNavigate={onNavigate} />
            </motion.div>
          ) : currentPage === 'hotels' ? (
            <motion.div key="hotels" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CategoryRegistry category="Hotel" title="Hotels" onNavigate={onNavigate} />
            </motion.div>
          ) : currentPage === 'delivery' ? (
            <motion.div key="delivery" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <CategoryRegistry category="Delivery" title="Delivery" onNavigate={onNavigate} />
            </motion.div>
          ) : currentPage === 'savings' ? (
            <motion.div key="savings" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SavingsView onNavigate={onNavigate} />
            </motion.div>
          ) : currentPage === 'privacy' ? (
            <motion.div key="privacy" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PrivacyView onNavigate={onNavigate} />
            </motion.div>
          ) : currentPage === 'about' ? (
            <motion.div key="about" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <AboutView onNavigate={onNavigate} />
            </motion.div>
          ) : currentPage === 'stories' ? (
            <motion.div key="stories" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <StoriesView onNavigate={onNavigate} />
            </motion.div>
          ) : currentPage === 'support' ? (
            <motion.div key="support" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <SupportView onNavigate={onNavigate} />
            </motion.div>
          ) : currentPage === 'admin' ? (
            <motion.div key="admin" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <LeadershipHQ onNavigate={onNavigate} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </main>

      {/* BOTTOM NAVIGATION */}
      <nav className="h-20 bg-[#02140F]/95 backdrop-blur-3xl border-t border-white/5 flex justify-evenly items-center z-50 shrink-0">
        <NavButton 
          icon={<LayoutGrid size={20} />} 
          label="HOME" 
          active={currentPage === 'home'} 
          onClick={() => onNavigate('home')}
        />
        <NavButton 
          icon={<Users size={20} />} 
          label="FACES" 
          active={currentPage === 'faces'} 
          onClick={() => onNavigate('faces')}
        />
        <NavButton 
          icon={<MessageSquare size={20} />} 
          label="ASSISTANT" 
          active={currentPage === 'assistant'} 
          onClick={() => onNavigate('assistant')}
        />
        <NavButton 
          icon={<Wallet size={20} />} 
          label="WALLET" 
          active={currentPage === 'wallet'} 
          onClick={() => onNavigate('wallet')}
        />
        <NavButton 
          icon={<User size={20} />} 
          label="PROFILE" 
          active={currentPage === 'profile'} 
          onClick={() => onNavigate('profile')}
        />
      </nav>
    </div>
  );
};

const NavButton = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-2 transition-all ${active ? 'text-aba-gold font-black' : 'text-white/20 hover:text-white/40'}`}
  >
    {icon}
    <span className="text-[9px] tracking-[0.2em]">{label}</span>
  </button>
);

const MenuLink = ({ icon, label, onClick }: { icon: React.ReactNode, label: string, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center gap-5 p-2 text-white/40 hover:text-white transition-all group"
  >
    <div className="group-hover:text-aba-gold group-hover:scale-110 transition-all">{icon}</div>
    <span className="text-xs font-black uppercase tracking-widest">{label}</span>
  </button>
);

export default Home;
