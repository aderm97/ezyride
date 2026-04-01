'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';

function AnimatedRouteBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Grid pattern */}
      <div className="absolute inset-0 grid-pattern opacity-40" />

      {/* Radial glow behind content */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] gradient-radial-glow opacity-40" />

      {/* Animated route SVG lines */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 1440 900"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {/* Route line 1 */}
        <motion.path
          d="M-50 600 Q 200 400, 500 450 T 900 300 T 1500 350"
          stroke="rgba(14, 165, 233, 0.15)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop', repeatDelay: 2 }}
        />
        {/* Route line 2 */}
        <motion.path
          d="M-100 200 Q 300 500, 600 300 T 1100 500 T 1550 200"
          stroke="rgba(14, 165, 233, 0.08)"
          strokeWidth="1.5"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 6, delay: 1, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop', repeatDelay: 3 }}
        />
        {/* Route line 3 */}
        <motion.path
          d="M200 800 Q 500 200, 800 500 T 1400 100"
          stroke="rgba(14, 165, 233, 0.06)"
          strokeWidth="1"
          strokeLinecap="round"
          fill="none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 5, delay: 2, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop', repeatDelay: 1 }}
        />

        {/* Animated dots along routes */}
        <motion.circle
          r="4"
          fill="#0EA5E9"
          filter="url(#glow)"
          initial={{ offsetDistance: '0%' }}
          animate={{ offsetDistance: '100%' }}
          transition={{ duration: 4, ease: 'easeInOut', repeat: Infinity, repeatDelay: 2 }}
          style={{ offsetPath: "path('M-50 600 Q 200 400, 500 450 T 900 300 T 1500 350')" }}
        />

        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Floating map pins */}
      <motion.div
        className="absolute top-[30%] left-[15%] text-cta/20"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <MapPin size={28} />
      </motion.div>
      <motion.div
        className="absolute top-[60%] right-[20%] text-cta/15"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1.5 }}
      >
        <MapPin size={22} />
      </motion.div>

      {/* Bottom fade gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 gradient-overlay" />
    </div>
  );
}

export function Hero() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {}
    }
  }, []);

  const riderHref = user ? (user.role === 'RIDER' ? '/rider' : '/login') : '/login';
  const driverHref = user ? (user.role === 'DRIVER' ? '/driver' : '/register?role=driver') : '/register?role=driver';

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <AnimatedRouteBackground />

      {/* Content */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-8 text-center pt-[72px]">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cta/20 bg-cta/5 text-cta text-xs font-medium tracking-wide mb-8"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cta animate-pulse" />
          Now Available in Lagos &middot; London &middot; Pretoria
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-heading text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight mb-6"
        >
          Move Smarter.{' '}
          <span className="text-gradient-hero">Earn Freely.</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="text-text-secondary text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          The e-hailing platform built for riders who value safety
          and drivers who value independence.
        </motion.p>

        {/* Dual CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href={riderHref}
            className="group relative inline-flex items-center gap-2 bg-cta text-white font-semibold rounded-2xl px-8 py-4 text-base sm:text-lg transition-all duration-300 hover:bg-cta-hover cta-glow-hover cursor-pointer min-w-[220px] justify-center"
            id="hero-cta-rider"
          >
            {user && user.role === 'RIDER' ? 'Explore Dashboard' : 'Book Your First Ride'}
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>

          <Link
            href={driverHref}
            className="group relative inline-flex items-center gap-2 glass-panel text-white font-semibold rounded-2xl px-8 py-4 text-base sm:text-lg transition-all duration-300 hover:bg-white/10 cursor-pointer min-w-[220px] justify-center"
            id="hero-cta-driver"
          >
            {user && user.role === 'DRIVER' ? 'View Earnings' : 'Start Driving Today'}
            <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </motion.div>

        {/* Trust micro-text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-text-secondary/50 text-xs mt-6"
        >
          No credit card required &middot; Free to download &middot; Available on iOS & Android
        </motion.p>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5"
        >
          <motion.div className="w-1 h-2 rounded-full bg-white/40" />
        </motion.div>
      </motion.div>
    </section>
  );
}
