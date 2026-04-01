'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import dynamic from 'next/dynamic';
const LiveMap = dynamic(() => import('@/components/ui/LiveMap').then(m => m.LiveMap), { ssr: false, loading: () => <div className="absolute inset-0 bg-slate-900 animate-pulse" /> });
import { fetchApi } from '@/lib/api';
import { LogOut, MapPin, Power, Map as MapIcon, CheckCircle, Navigation, XCircle } from 'lucide-react';
import { RouteInfo } from '@/components/ui/RouteInfo';

export default function DriverPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isOnline, setIsOnline] = useState(false);
  const [pendingRides, setPendingRides] = useState<any[]>([]);
  const [activeRide, setActiveRide] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { loadDriverData(); }, []);

  const loadDriverData = async () => {
    try {
      const userData = await fetchApi('/users/me');
      if (userData.role !== 'DRIVER') { router.push('/login'); return; }
      setUser(userData);
      setIsOnline(userData.isActive);

      try {
        const myActive = await fetchApi(`/rides?driverId=${userData.id}`);
        const current = myActive.find((r: any) => ['ACCEPTED', 'ARRIVED', 'IN_PROGRESS'].includes(r.status));
        if (current) setActiveRide(current);
      } catch (e) { }

      setIsLoading(false);
    } catch { router.push('/login'); }
  };

  const toggleStatus = async () => {
    try {
       const newStatus = !isOnline;
       setIsOnline(newStatus);
       await fetchApi('/users/location', {
         method: 'PATCH',
         body: JSON.stringify({ isActive: newStatus })
       });
    } catch { setIsOnline(!isOnline); }
  };

  const pollRides = async () => {
    if (!isOnline || activeRide) return;
    try {
      const rides = await fetchApi('/rides/poll/pending');
      setPendingRides(rides);
    } catch(e) {}
  };

  const pollActiveRide = async () => {
     if (!activeRide) return;
     try {
       const ride = await fetchApi(`/rides/${activeRide.id}`);
       setActiveRide(ride);
       if (ride.status === 'COMPLETED') { setTimeout(() => setActiveRide(null), 3000); }
     } catch(e) {}
  };

  useEffect(() => {
    const p1 = setInterval(pollRides, 3000);
    const p2 = setInterval(pollActiveRide, 2000);
    return () => { clearInterval(p1); clearInterval(p2); };
  }, [isOnline, activeRide]);

  const handleAccept = async (id: string) => {
    try {
      const data = await fetchApi(`/rides/${id}/accept`, { method: 'PATCH' });
      setActiveRide(data);
    } catch(err: any) { alert(err.message); }
  };

  const advanceStatus = async (status: string) => {
    try {
      const data = await fetchApi(`/rides/${activeRide.id}/status`, { 
        method: 'PATCH', body: JSON.stringify({ status })
      });
      setActiveRide(data);
    } catch(e) {}
  };

  const handleCancelRide = async () => {
    if (!activeRide) return;
    try {
      await fetchApi(`/rides/${activeRide.id}/cancel`, { method: 'PATCH' });
      setActiveRide(null);
    } catch (error: any) {
      alert(error.message || 'Failed to cancel ride');
    }
  };

  if (isLoading) return <div className="h-screen bg-background flex items-center justify-center"><div className="w-10 h-10 rounded-full border-t-2 border-cta animate-spin"/></div>;

  return (
    <div className="h-screen bg-background text-white relative flex flex-col overflow-hidden font-body">
      <LiveMap 
        pickupLat={activeRide ? activeRide.pickupLat : pendingRides[0]?.pickupLat} 
        pickupLng={activeRide ? activeRide.pickupLng : pendingRides[0]?.pickupLng} 
        dropoffLat={activeRide ? activeRide.dropoffLat : pendingRides[0]?.dropoffLat}
        dropoffLng={activeRide ? activeRide.dropoffLng : pendingRides[0]?.dropoffLng}
        status={activeRide?.status} 
      />

      {/* Driver Header */}
      <div className="absolute top-0 w-full p-6 z-20 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent pb-16 pointer-events-none">
        <div className="glass-panel px-6 py-3 rounded-full flex gap-4 items-center shadow-lg pointer-events-auto transition-colors">
            <div className={`w-3 h-3 rounded-full transition-colors duration-500 shadow-[0_0_15px] ${isOnline ? 'bg-emerald-400 shadow-emerald-400/80 animate-pulse-glow' : 'bg-rose-500 shadow-rose-500/50'}`} />
            <span className="font-semibold tracking-wide text-sm">{isOnline ? 'Online' : 'Offline'}</span>
        </div>
        <button onClick={() => { localStorage.removeItem('token'); router.push('/login'); }} className="p-4 glass-panel rounded-full active:scale-95 transition-transform pointer-events-auto">
          <LogOut size={18} className="text-slate-300" />
        </button>
      </div>

      <div className="absolute bottom-0 w-full z-20 p-4 pb-8 md:p-8 flex flex-col items-center">
        {!activeRide ? (
          <AnimatePresence mode="wait">
             {!isOnline ? (
               <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="flex flex-col items-center gap-8">
                 <div className="relative">
                   <div className="absolute inset-[-20px] bg-cta/20 rounded-full animate-pulse-glow blur-xl -z-10" />
                   <button 
                    onClick={toggleStatus}
                    className="w-28 h-28 rounded-full bg-gradient-to-b from-cta to-blue-800 shadow-[0_0_40px_rgba(3,105,161,0.6)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-white/20"
                   >
                     <Power size={36} className="text-white drop-shadow-md" />
                   </button>
                 </div>
                 <span className="font-heading text-3xl font-semibold tracking-wide drop-shadow-md">Tap to Go Online</span>
               </motion.div>
             ) : (
               <div className="w-full max-w-lg flex flex-col gap-4">
                 {pendingRides.length === 0 ? (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-center p-10 glass-heavy rounded-3xl border-t border-white/10 shadow-[0_-20px_60px_rgba(0,0,0,0.5)]">
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }} className="w-20 h-20 mx-auto bg-slate-800/50 rounded-full flex items-center justify-center mb-6 border border-slate-700 shadow-inner">
                        <MapIcon className="text-cta" size={32} />
                      </motion.div>
                      <h3 className="font-heading text-2xl font-semibold text-white">Finding nearby trips...</h3>
                      <p className="text-slate-400 text-sm mt-2">Searching your local area for incoming requests.</p>
                      <Button variant="danger" className="mt-8 mx-auto w-full py-4 text-base" onClick={toggleStatus}>Go Offline</Button>
                    </motion.div>
                 ) : (
                   pendingRides.map(ride => (
                     <motion.div key={ride.id} initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="glass-heavy p-6 rounded-[2rem] shadow-2xl flex flex-col gap-5 border-t border-white/10 hover:border-cta/50 transition-colors">
                        <div className="flex justify-between items-center">
                          <span className="text-xs uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-2">
                             <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> New Request
                          </span>
                          <span className="text-3xl font-bold tracking-tight">${ride.fare.toFixed(2)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-slate-300 bg-slate-800/40 p-3 rounded-xl border border-slate-700/50">
                          <MapPin size={18} className="text-rose-500" />
                          <span className="font-medium">4.2 km away • 8 mins</span>
                        </div>
                        <RouteInfo
                          pickupLat={ride.pickupLat}
                          pickupLng={ride.pickupLng}
                          dropoffLat={ride.dropoffLat}
                          dropoffLng={ride.dropoffLng}
                        />
                        <Button className="w-full font-bold py-5 text-lg" variant="liquid-glass" onClick={() => handleAccept(ride.id)}>
                          Tap to Accept
                        </Button>
                     </motion.div>
                   ))
                 )}
               </div>
             )}
          </AnimatePresence>
        ) : (
          <motion.div initial={{ y: 100, opacity: 0, rotateX: 10 }} animate={{ y: 0, opacity: 1, rotateX: 0 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="w-full max-w-lg glass-heavy p-8 rounded-[2.5rem] shadow-[0_-20px_80px_rgba(0,0,0,0.5)] border-t border-white/10 perspective-[1000px]">
             <div className="flex justify-between items-center mb-6">
                <span className="font-heading text-2xl font-bold">Current Trip</span>
                <span className="px-4 py-1.5 glass-panel rounded-full text-xs font-bold tracking-widest uppercase text-cta shadow-inner border border-cta/30">{activeRide.status.replace('_', ' ')}</span>
             </div>

             <RouteInfo
               pickupLat={activeRide.pickupLat}
               pickupLng={activeRide.pickupLng}
               dropoffLat={activeRide.dropoffLat}
               dropoffLng={activeRide.dropoffLng}
             />

             <div className="flex flex-col gap-4 mt-4">
                {activeRide.status === 'ACCEPTED' && (
                  <Button className="w-full text-lg py-6 font-bold" variant="liquid-glass" onClick={() => advanceStatus('ARRIVED')}>
                     I have Arrived
                  </Button>
                )}
                {activeRide.status === 'ARRIVED' && (
                  <Button className="w-full text-lg py-6 font-bold" variant="liquid-glass" onClick={() => advanceStatus('IN_PROGRESS')}>
                     Start Trip
                  </Button>
                )}
                {activeRide.status === 'IN_PROGRESS' && (
                  <Button className="w-full text-lg py-6 bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_30px_rgba(16,185,129,0.5)] transition-all font-bold" variant="primary" onClick={() => advanceStatus('COMPLETED')}>
                     Complete Trip
                  </Button>
                )}
                {activeRide.status === 'COMPLETED' && (
                  <div className="flex flex-col items-center p-8 bg-emerald-500/10 rounded-3xl border border-emerald-500/20">
                     <CheckCircle size={56} className="text-emerald-400 mb-4 drop-shadow-[0_0_15px_rgba(52,211,153,0.5)]" />
                     <span className="font-heading text-2xl font-semibold">Mission Accomplished</span>
                     <span className="text-emerald-300 font-bold mt-2 text-xl">+${activeRide.fare}</span>
                  </div>
                )}
                {activeRide.status === 'CANCELED' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col items-center p-6 bg-red-500/10 rounded-3xl border border-red-500/20"
                  >
                    <XCircle size={48} className="text-red-400 mb-3 drop-shadow-[0_0_10px_rgba(239,68,68,0.4)]" />
                    <span className="font-heading text-xl font-semibold text-red-300">Trip Cancelled</span>
                  </motion.div>
                )}
                {activeRide.status !== 'COMPLETED' && activeRide.status !== 'CANCELED' && activeRide.status !== 'IN_PROGRESS' && (
                  <button
                    onClick={handleCancelRide}
                    className="w-full mt-2 py-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-500/20 active:scale-[0.98] transition-all"
                  >
                    <XCircle size={18} /> Cancel Trip
                  </button>
                )}
             </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
