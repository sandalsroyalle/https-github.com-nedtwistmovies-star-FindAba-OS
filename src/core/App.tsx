import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Layers, Zap, UserCircle } from 'lucide-react';
import Onboarding from '../features/auth/Onboarding';
import Register from '../features/merchant/Register';
import Home from '../features/home/Home';
import Registry from '../features/discovery/Registry';
import ElderKaluAI from '../features/intelligence/ElderKaluAI';
import Profile from '../features/profile/Profile';
import AdminConsole from '../features/admin/AdminConsole';
import Faces from '../features/faces/Faces';
import GenericView from '../components/GenericView';
import { Wallet, Truck, Hotel, ArrowRight, Briefcase, Info, ShieldCheck } from 'lucide-react';
import { checkSupabaseConnection } from '../services/supabaseService';

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(GOOGLE_MAPS_API_KEY) && GOOGLE_MAPS_API_KEY !== 'YOUR_API_KEY';

const App: React.FC = () => {
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [currentPage, setCurrentPage] = useState<'home' | 'register' | 'registry' | 'assistant' | 'profile' | 'admin' | 'faces' | 'wallet' | 'logistics' | 'hotels' | 'delivery' | 'savings' | 'about' | 'privacy'>('home');

  // Check if onboarding was completed before and verify DB connection
  useEffect(() => {
    const completed = localStorage.getItem('onboarding_completed');
    if (completed === 'true') {
      setShowOnboarding(false);
    }
    
    // Test Supabase Connection
    checkSupabaseConnection();
  }, []);

  const handleOnboardingComplete = () => {
    localStorage.setItem('onboarding_completed', 'true');
    setShowOnboarding(false);
  };

  const AppContent = (
    <div className="min-h-screen bg-aba-dark">
      {showOnboarding ? (
        <Onboarding onComplete={handleOnboardingComplete} />
      ) : currentPage === 'register' ? (
        <Register onClose={() => setCurrentPage('home')} />
      ) : currentPage === 'assistant' ? (
        <ElderKaluAI onNavigate={(page: any) => setCurrentPage(page)} />
      ) : currentPage === 'admin' ? (
        <AdminConsole onNavigate={(page: any) => setCurrentPage(page)} />
      ) : (
        <Home 
          onRegisterClick={() => setCurrentPage('register')} 
          onNavigate={(page: any) => setCurrentPage(page)}
          currentPage={currentPage}
        />
      )}
    </div>
  );

  if (hasValidKey) {
    return (
      <APIProvider apiKey={GOOGLE_MAPS_API_KEY}>
        {AppContent}
      </APIProvider>
    );
  }

  return AppContent;
};

export default App;
