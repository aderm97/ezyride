'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import dynamic from 'next/dynamic';
const LiveMap = dynamic(() => import('@/components/ui/LiveMap').then(m => m.LiveMap), { ssr: false, loading: () => <div className="absolute inset-0 bg-slate-900" /> });
import { fetchApi } from '@/lib/api';
import { LogOut, Navigation, Clock, XCircle } from 'lucide-react';
import { RouteInfo } from '@/components/ui/RouteInfo';

export default function RiderPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [activeRide, setActiveRide] = useState<any>(null);
  const [requestError, setRequestError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const [pickupConfig, setPickup] = useState({ lat: 51.5074, lng: -0.1278, name: 'Current Location' }); // Default to London, UK
  const [dropoffConfig, setDropoff] = useState({ lat: 51.5074, lng: -0.1278, name: '' });
  const [estimate, setEstimate] = useState<number | null>(null);
  const [estimating, setEstimating] = useState(false);
  const [requesting, setRequesting] = useState(false);

  useEffect(() => { 
    loadRiderData(); 
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPickup({ lat: pos.coords.latitude, lng: pos.coords.longitude, name: 'Current Location' }),
        () => console.warn("Geolocation denied, using default")
      );
    }
  }, []);

  const loadRiderData = async () => {
    try {
      const userData = await fetchApi('/users/me');
      if (userData.role !== 'RIDER') { router.push('/login'); return; }
      setUser(userData);
      
      try {
        const activeRides = await fetchApi(`/rides?riderId=${userData.id}`);
        const current = activeRides.find((r: any) => ['PENDING', 'ACCEPTED', 'ARRIVED', 'IN_PROGRESS'].includes(r.status));
        if (current) setActiveRide(current);
      } catch (e) {
        // Soft fail if ride fetch fails
      }

      setIsLoading(false);
    } catch { router.push('/login'); }
  };

  const pollRideStatus = async () => {
    if (!activeRide) return;
    try {
      const data = await fetchApi(`/rides/${activeRide.id}`);
      setActiveRide(data);
      if (data.status === 'COMPLETED' || data.status === 'CANCELED') {
        setTimeout(() => setActiveRide(null), 3000);
      }
    } catch (e) {
      // Background retry silently
    }
  };

  useEffect(() => {
    const interval = setInterval(pollRideStatus, 2000);
    return () => clearInterval(interval);
  }, [activeRide]);

  const handleEstimate = async () => {
    if (!dropoffConfig.name || !pickupConfig.name) return;
    setEstimating(true);
    let finalPickupLat = pickupConfig.lat;
    let finalPickupLng = pickupConfig.lng;
    let finalDropoffLat = dropoffConfig.lat;
    let finalDropoffLng = dropoffConfig.lng;
    
    try {
      // Geocode pickup if not default
      if (pickupConfig.name !== 'Current Location') {
        const pickupRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pickupConfig.name)}`);
        const pickupData = await pickupRes.json();
        if (pickupData && pickupData.length > 0) {
          finalPickupLat = parseFloat(pickupData[0].lat);
          finalPickupLng = parseFloat(pickupData[0].lon);
          setPickup({ name: pickupConfig.name, lat: finalPickupLat, lng: finalPickupLng });
        }
      }

      // Geocode dropoff
      const dropoffRes = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(dropoffConfig.name)}`);
      const dropoffData = await dropoffRes.json();
      if (dropoffData && dropoffData.length > 0) {
        finalDropoffLat = parseFloat(dropoffData[0].lat);
        finalDropoffLng = parseFloat(dropoffData[0].lon);
        setDropoff({ name: dropoffConfig.name, lat: finalDropoffLat, lng: finalDropoffLng });
      }

      const data = await fetchApi('/rides/estimate', {
        method: 'POST',
        body: JSON.stringify({ pickupLat: finalPickupLat, pickupLng: finalPickupLng, dropoffLat: finalDropoffLat, dropoffLng: finalDropoffLng })
      });
      setEstimate(data.estimatedFare);
    } catch { alert('Estimation failed'); } finally { setEstimating(false); }
  };

  const handleRequestRide = async () => {
    setRequesting(true);
    setRequestError(null);
    try {
      const ride = await fetchApi('/rides/request', {
        method: 'POST',
        body: JSON.stringify({ pickupLat: pickupConfig.lat, pickupLng: pickupConfig.lng, dropoffLat: dropoffConfig.lat, dropoffLng: dropoffConfig.lng, fare: estimate })
      });
      setActiveRide(ride);
    } catch (error: any) { 
      setRequestError(error.message || 'Ride request failed. Please try again.');
    } finally { 
      setRequesting(false); 
    }
  };

  const handleCancelRide = async () => {
    if (!activeRide) return;
    try {
      await fetchApi(`/rides/${activeRide.id}/cancel`, { method: 'PATCH' });
      setActiveRide(null);
      setEstimate(null);
    } catch (error: any) {
      alert(error.message || 'Failed to cancel ride');
    }
  };

  if (isLoading) return <div className="h-screen bg-background flex items-center justify-center"><div className="w-10 h-10 rounded-full border-t-2 border-cta animate-spin"/></div>;

  return (
    <div className="h-screen bg-background text-white relative flex flex-col overflow-hidden font-body">
      
      <LiveMap 
        pickupLat={pickupConfig.lat} 
        pickupLng={pickupConfig.lng} 
        dropoffLat={dropoffConfig.lat} 
        dropoffLng={dropoffConfig.lng} 
        status={activeRide?.status} 
      />

      {/* Floating Header Panel */}
      <div className="absolute top-0 w-full p-4 md:p-8 z-20 flex justify-between items-center pointer-events-none">
        <div className="glass-panel px-6 py-3 rounded-full flex items-center gap-3 pointer-events-auto">
          <div className="w-8 h-8 bg-cta rounded-full flex items-center justify-center text-sm font-bold shadow-inner">
            {user?.name.charAt(0)}
          </div>
          <span className="font-semibold tracking-wide text-sm">{user?.name}</span>
        </div>
        <button onClick={() => { localStorage.removeItem('token'); router.push('/login'); }} className="w-12 h-12 glass-panel rounded-full flex items-center justify-center active:scale-95 transition-transform pointer-events-auto">
          <LogOut size={18} className="text-slate-300" />
        </button>
      </div>

      {/* Driver Interaction Bottom Sheet */}
      <div className="absolute bottom-0 w-full z-20 p-4 md:p-8 pb-8 flex justify-center perspective-[1000px]">
        <AnimatePresence mode="wait">
          {!activeRide ? (
            <motion.div 
              key="request-flow"
              initial={{ y: 100, opacity: 0, rotateX: 10 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="glass-heavy p-8 rounded-[2.5rem] w-full max-w-lg shadow-[0_-20px_80px_rgba(0,0,0,0.5)] border-t border-white/10"
            >
              <h2 className="font-heading text-3xl font-semibold mb-8 text-white">Where to?</h2>
              
              <div className="flex flex-col gap-5 relative">
                <div className="absolute left-[15px] top-[26px] bottom-[26px] w-[2px] bg-slate-800" />
                
                <div className="flex items-center gap-4 relative z-10 hover:opacity-80 transition-opacity">
                  <div className="w-3 h-3 bg-cta rounded-full shadow-[0_0_15px_rgba(3,105,161,0.8)] ml-[10px]" />
                  <input suppressHydrationWarning
                    value={pickupConfig.name}
                    onChange={(e) => setPickup({...pickupConfig, name: e.target.value})}
                    onBlur={handleEstimate}
                    className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-cta focus:ring-1 focus:ring-cta rounded-2xl px-5 py-4 min-h-[44px] text-sm text-white placeholder:text-slate-500 outline-none transition-all shadow-inner"
                    placeholder="Enter pickup location..."
                  />
                </div>
                
                <div className="flex items-center gap-4 relative z-10 group">
                  <div className="w-3 h-3 bg-rose-500 rounded-sm shadow-[0_0_15px_rgba(244,63,94,0.8)] ml-[10px] transform group-focus-within:rotate-45 transition-transform" />
                  <input 
                    placeholder="Search destination..."
                    value={dropoffConfig.name}
                    onChange={(e) => setDropoff({...dropoffConfig, name: e.target.value})}
                    onBlur={handleEstimate}
                    className="w-full bg-slate-800/80 border border-slate-700/80 focus:border-cta focus:ring-1 focus:ring-cta rounded-2xl px-5 py-4 min-h-[44px] text-sm text-white placeholder:text-slate-500 outline-none transition-all shadow-inner"
                  />
                </div>
              </div>

              {estimate && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, y: 10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="mt-6 glass-panel rounded-2xl p-5 flex justify-between items-center group cursor-pointer hover:bg-white/10 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-cta/20 text-blue-300 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Clock size={20} />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-100">Ezyride Priority</p>
                      <p className="text-cta text-sm font-medium">4 mins away</p>
                    </div>
                  </div>
                  <div className="text-2xl font-bold tracking-tight">${estimate.toFixed(2)}</div>
                </motion.div>
              )}
              {requestError && (
                <div className="mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-200 text-sm font-medium text-center shadow-[0_0_15px_rgba(239,68,68,0.2)]">
                  {requestError}
                </div>
              )}

              <Button 
                variant="liquid-glass"
                className="w-full mt-6 py-5 text-lg font-bold" 
                disabled={!estimate}
                isLoading={requesting}
                onClick={handleRequestRide}
              >
                Request Ezyride
              </Button>
            </motion.div>
          ) : (
            <motion.div 
              key="active-flow"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="glass-heavy p-8 rounded-[2.5rem] w-full max-w-lg shadow-[0_-20px_80px_rgba(0,0,0,0.5)] border-t border-white/10"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="font-heading text-2xl font-semibold tracking-tight text-gradient">
                  {activeRide.status === 'PENDING' && "Locating nearest driver..."}
                  {activeRide.status === 'ACCEPTED' && "Your driver is en route"}
                  {activeRide.status === 'ARRIVED' && "Driver is waiting"}
                  {activeRide.status === 'IN_PROGRESS' && "Heading to destination"}
                  {activeRide.status === 'COMPLETED' && "You've arrived."}
                  {activeRide.status === 'CANCELED' && "Ride cancelled"}
                </h2>
                {activeRide.status === 'PENDING' && (
                  <div className="w-8 h-8 rounded-full border-[3px] border-slate-700 border-t-cta animate-spin shadow-[0_0_15px_rgba(3,105,161,0.5)]"/>
                )}
              </div>

              <RouteInfo
                pickupLat={activeRide.pickupLat}
                pickupLng={activeRide.pickupLng}
                dropoffLat={activeRide.dropoffLat}
                dropoffLng={activeRide.dropoffLng}
                pickupName={pickupConfig.name}
                dropoffName={dropoffConfig.name}
              />

              {activeRide.driver && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-5 glass-panel p-5 rounded-2xl mb-6"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-slate-600 to-slate-800 border-2 border-white/10 rounded-full flex items-center justify-center text-xl font-bold shadow-xl">
                    {activeRide.driver.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-xl">{activeRide.driver.name}</p>
                    <p className="text-sm text-cta font-medium flex items-center gap-1 mt-1">
                      <Navigation size={14} /> 4.9 ★ • Premium Class
                    </p>
                  </div>
                </motion.div>
              )}

              {activeRide.status !== 'COMPLETED' && activeRide.status !== 'CANCELED' && (
                <div className="w-full bg-slate-800/50 h-2 rounded-full overflow-hidden mt-2 p-[1px] shadow-inner">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-400 to-cta rounded-full relative"
                    initial={{ width: '0%' }}
                    animate={{ 
                      width: activeRide.status === 'PENDING' ? '25%' : 
                             activeRide.status === 'ACCEPTED' ? '50%' : 
                             activeRide.status === 'ARRIVED' ? '75%' : '90%' 
                    }}
                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <div className="absolute inset-0 bg-white/20 animate-pulse-glow" />
                  </motion.div>
                </div>
              )}

              {activeRide.status !== 'COMPLETED' && activeRide.status !== 'CANCELED' && activeRide.status !== 'IN_PROGRESS' && (
                <button
                  onClick={handleCancelRide}
                  className="w-full mt-4 py-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-red-500/20 active:scale-[0.98] transition-all"
                >
                  <XCircle size={18} /> Cancel Ride
                </button>
              )}

              {activeRide.status === 'CANCELED' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center p-6 bg-red-500/10 rounded-2xl border border-red-500/20 mt-4"
                >
                  <XCircle size={40} className="text-red-400 mb-3" />
                  <span className="font-heading text-xl font-semibold text-red-300">Ride Cancelled</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
