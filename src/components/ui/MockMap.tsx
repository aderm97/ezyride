'use client';
import { motion } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';

interface MockMapProps {
  pickupLat?: number;
  pickupLng?: number;
  dropoffLat?: number;
  dropoffLng?: number;
  driverLat?: number;
  driverLng?: number;
  status?: string;
}

export function MockMap({ pickupLat, dropoffLat, driverLat, status }: MockMapProps) {
  return (
    <div className="absolute inset-0 bg-background overflow-hidden -z-10">
      
      {/* Liquid Iridescent Gradient Background */}
      <div className="absolute inset-[-50%] bg-gradient-to-br from-primary via-background to-secondary opacity-80" />
      
      {/* Fluid Morphing Shapes to replace strict CSS grids */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-[40vw] h-[40vw] bg-cta/10 blur-[80px] rounded-full animate-liquid -z-5"
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-[50vw] h-[50vw] bg-purple-900/10 blur-[100px] rounded-[40%_60%_70%_30%] animate-morph -z-5"
      />

      {/* Abstract Map Nodes mapping to new high contrast luxury colors */}
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: `radial-gradient(circle at center, #94A3B8 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      {/* User Center Node with Pulse Glow */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      >
        <div className="relative">
          <div className="w-10 h-10 bg-cta border-2 border-white/20 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(3,105,161,0.6)] z-10 relative">
            <span className="w-3 h-3 bg-white rounded-full shadow-inner shadow-black/50" />
          </div>
          <motion.div 
            className="absolute inset-[-10px] rounded-full bg-cta/30 animate-pulse-glow"
          />
        </div>
      </motion.div>

      {/* Driver Node Simulation */}
      {status && ['ACCEPTED', 'ARRIVED', 'IN_PROGRESS'].includes(status) && (
        <motion.div 
          initial={{ x: 100, y: -100, opacity: 0 }}
          animate={{ x: 30, y: -40, opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="absolute top-1/2 left-1/2 ml-10 -mt-10 animate-float"
        >
          <div className="w-10 h-10 glass-panel border border-white/30 text-white rounded-xl flex items-center justify-center shadow-2xl">
            <Navigation size={20} className="fill-white" />
          </div>
        </motion.div>
      )}

      {/* Destination Node */}
      {dropoffLat && (
        <motion.div 
          initial={{ y: 200, opacity: 0 }}
          animate={{ y: 140, opacity: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -ml-3"
        >
          <div className="relative">
            <div className="w-10 h-10 bg-rose-500/90 backdrop-blur-sm border border-rose-400 text-white rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(244,63,94,0.4)] z-10 pb-1">
              <MapPin size={22} />
            </div>
            <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-1 bg-black/50 blur-[2px] rounded-full" />
          </div>
        </motion.div>
      )}

      {/* Fluid connecting path */}
      {dropoffLat && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          <motion.path 
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            d="M calc(50%) calc(50%) Q calc(50% + 100px) calc(50% + 70px) calc(50% - 12px) calc(50% + 140px)"
            fill="none"
            stroke="url(#gradientPath)" 
            strokeWidth="4" 
            strokeLinecap="round"
            strokeDasharray="8 8" 
          />
          <defs>
            <linearGradient id="gradientPath" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0369A1" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#F43F5E" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>
      )}
    </div>
  );
}
