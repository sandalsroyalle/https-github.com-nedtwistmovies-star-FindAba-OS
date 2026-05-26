import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Truck, MapPin, Search, ArrowLeft, Loader2, Navigation, Package, Clock, ShieldCheck } from 'lucide-react';
import { fetchAllBusinesses, fetchLogisticsOrders } from '../../services/supabaseService';
import { Business, LogisticOrder } from '../../types';

interface LogisticsViewProps {
  onNavigate: (page: string) => void;
}

const LogisticsView: React.FC<LogisticsViewProps> = ({ onNavigate }) => {
  const [carriers, setCarriers] = useState<Business[]>([]);
  const [orders, setOrders] = useState<LogisticOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLogistics = async () => {
      try {
        const [bizData, orderData] = await Promise.all([
          fetchAllBusinesses(),
          fetchLogisticsOrders()
        ]);
        
        const filtered = bizData.filter(b => 
          b.category?.toLowerCase().includes('logistics') || 
          b.category?.toLowerCase().includes('transport') ||
          b.category?.toLowerCase().includes('delivery')
        );
        setCarriers(filtered);
        setOrders(orderData as LogisticOrder[]);
      } catch (err) {
        console.error("Load logistics error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadLogistics();
  }, []);

  return (
    <div className="min-h-screen bg-aba-dark text-white font-sans flex flex-col p-6 pb-24">
      <header className="flex items-center gap-6 mb-12 py-4">
        <button onClick={() => onNavigate('home')} className="p-4 bg-white/5 border border-white/10 text-white/40 hover:text-white transition-all active:scale-90 rounded-2xl">
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter leading-none">Logistics</h1>
          <p className="text-[10px] font-black tracking-[0.3em] text-aba-gold uppercase mt-1">Industrial Supply Chain</p>
        </div>
      </header>

      {/* DASHBOARD STATS */}
      <div className="grid grid-cols-2 gap-4 mb-12">
        <div className="bg-aba-gold/5 border border-aba-gold/20 p-6 rounded-3xl flex flex-col justify-center">
           <div className="text-[8px] font-black uppercase text-aba-gold tracking-widest mb-1">Active Deliveries</div>
           <div className="text-3xl font-black">{orders.length}</div>
        </div>
        <div className="bg-aba-green/5 border border-aba-green/20 p-6 rounded-3xl flex flex-col justify-center">
           <div className="text-[8px] font-black uppercase text-aba-green tracking-widest mb-1">Verified Fleets</div>
           <div className="text-3xl font-black">{carriers.length}</div>
        </div>
      </div>

      {/* ACTIVE TRACKING */}
      {orders.length > 0 && (
        <div className="mb-12 space-y-4">
          <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 px-2">Real-time Tracking</h2>
          <div className="space-y-2">
            {orders.slice(0, 2).map(order => (
              <div key={order.id} className="bg-white/5 border border-white/5 p-6 rounded-[2rem] flex items-center gap-6">
                <div className="w-12 h-12 bg-aba-green/20 rounded-2xl flex items-center justify-center text-aba-green">
                  <Package size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest">{order.tracking_number}</span>
                    <span className="px-2 py-0.5 bg-aba-green/10 text-aba-green text-[7px] font-black uppercase rounded-full">{order.status}</span>
                  </div>
                  <div className="text-[9px] font-bold text-white/40 uppercase mt-1 truncate max-w-[200px]">
                    {order.pickup_address} &rarr; {order.delivery_address}
                  </div>
                </div>
                <button className="p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
                  <Navigation size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-white/20 px-2">Find Industrial Carriers</h2>
        
        {loading ? (
          <div className="py-20 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin text-aba-gold" size={32} />
            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-white/20">Scanning Logistics Node...</span>
          </div>
        ) : carriers.length > 0 ? (
          <div className="grid gap-2">
            {carriers.map(carrier => (
              <div key={carrier.id} className="bg-white/5 border border-white/5 p-6 rounded-[2.5rem] flex items-center gap-6 hover:bg-white/10 transition-all group">
                <div className="w-16 h-16 bg-white flex items-center justify-center text-black rounded-3xl shrink-0 grayscale group-hover:grayscale-0 transition-all">
                  <Truck size={32} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-2xl font-black uppercase tracking-tighter truncate">{carrier.name}</h3>
                    {carrier.is_verified && <ShieldCheck size={14} className="text-aba-gold" />}
                  </div>
                  <div className="flex items-center gap-2 text-white/40 mt-1">
                    <MapPin size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">{carrier.area || 'Aba South'}</span>
                  </div>
                </div>
                <button className="px-6 py-3 bg-aba-gold text-black font-black uppercase text-[10px] tracking-widest rounded-2xl hover:scale-105 transition-all outline-none">
                  Request
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 border border-white/5 bg-white/5 rounded-[2rem] text-center">
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest">No logistics hubs found in the immediate registry.</p>
            <button onClick={() => onNavigate('register')} className="mt-6 text-aba-gold text-[10px] font-black uppercase tracking-widest underline">Join the Supply Chain</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LogisticsView;
