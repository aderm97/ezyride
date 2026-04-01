'use client';

import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Search, UserCheck, Navigation } from 'lucide-react';
import { SectionReveal } from './SectionReveal';

const steps = [
  {
    number: '01',
    title: 'Request',
    description: 'Set your pickup & destination. Get an instant fare estimate powered by real-time distance calculation.',
    apiHint: 'POST /rides/estimate → POST /rides/request',
    icon: Search,
    color: 'from-sky-500/20 to-blue-600/20',
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Pickup pin */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute top-[30%] left-[30%] flex flex-col items-center"
        >
          <div className="w-4 h-4 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.6)]" />
          <div className="w-0.5 h-6 bg-emerald-400/50" />
          <span className="text-[10px] text-emerald-400 font-medium mt-1">Pickup</span>
        </motion.div>
        {/* Destination pin */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, type: 'spring', stiffness: 300, damping: 20 }}
          className="absolute top-[25%] right-[25%] flex flex-col items-center"
        >
          <div className="w-4 h-4 rounded-full bg-cta shadow-[0_0_12px_rgba(14,165,233,0.6)]" />
          <div className="w-0.5 h-6 bg-cta/50" />
          <span className="text-[10px] text-cta font-medium mt-1">Drop-off</span>
        </motion.div>
        {/* Route line */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200" fill="none">
          <motion.path
            d="M90 80 Q 150 50 210 65"
            stroke="#0EA5E9"
            strokeWidth="2"
            strokeDasharray="6 4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
          />
        </svg>
        {/* Fare card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.1, duration: 0.4 }}
          className="absolute bottom-[15%] left-1/2 -translate-x-1/2 glass-panel rounded-xl px-5 py-3 text-center"
        >
          <div className="text-[10px] text-text-secondary mb-0.5">Estimated Fare</div>
          <div className="font-heading text-xl font-bold text-text-primary">₦3,450</div>
        </motion.div>
      </div>
    ),
  },
  {
    number: '02',
    title: 'Match',
    description: 'A verified driver accepts your ride in seconds. See their name, vehicle, and real-time ETA.',
    apiHint: 'PATCH /rides/{id}/accept → ACCEPTED',
    icon: UserCheck,
    color: 'from-emerald-500/20 to-green-600/20',
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Driver card */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="glass-panel rounded-2xl p-5 w-[220px]"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cta to-sky-300 flex items-center justify-center text-white font-bold text-sm">AO</div>
            <div>
              <div className="text-sm font-semibold text-text-primary">Adewale O.</div>
              <div className="text-[11px] text-text-secondary flex items-center gap-1">
                ★ 4.9 <span className="text-white/20">·</span> 1,240 rides
              </div>
            </div>
          </div>
          <div className="text-[11px] text-text-secondary mb-1">Toyota Camry · LND-452-XY</div>
          <motion.div
            initial={{ width: '0%' }}
            whileInView={{ width: '100%' }}
            viewport={{ once: true }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="h-1 bg-gradient-to-r from-cta to-emerald-400 rounded-full mt-3"
          />
          <div className="flex justify-between text-[10px] mt-1.5">
            <span className="text-emerald-400 font-medium">Arriving</span>
            <span className="text-text-secondary">3 min away</span>
          </div>
        </motion.div>
      </div>
    ),
  },
  {
    number: '03',
    title: 'Ride',
    description: 'Track your ride in real-time. Arrive safely and pay securely — no cash required.',
    apiHint: 'PATCH /rides/{id}/status → COMPLETED',
    icon: Navigation,
    color: 'from-violet-500/20 to-purple-600/20',
    visual: (
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Animated route */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 200" fill="none">
          <path d="M40 150 Q 100 50 150 100 Q 200 150 260 50" stroke="rgba(14, 165, 233, 0.15)" strokeWidth="2" strokeLinecap="round" />
          <motion.path
            d="M40 150 Q 100 50 150 100 Q 200 150 260 50"
            stroke="#0EA5E9"
            strokeWidth="2.5"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1.5, ease: 'easeInOut' }}
          />
          {/* Moving car dot */}
          <motion.circle
            r="5"
            fill="#0EA5E9"
            filter="url(#step3glow)"
            initial={{ offsetDistance: '0%' }}
            whileInView={{ offsetDistance: '100%' }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 1.5, ease: 'easeInOut' }}
            style={{ offsetPath: "path('M40 150 Q 100 50 150 100 Q 200 150 260 50')" }}
          />
          <defs>
            <filter id="step3glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
        </svg>
        {/* Completion card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1.8, duration: 0.4 }}
          className="absolute bottom-[10%] left-1/2 -translate-x-1/2 glass-panel rounded-xl px-6 py-3 text-center"
        >
          <div className="text-emerald-400 text-xs font-semibold mb-0.5">Ride Complete ✓</div>
          <div className="font-heading text-xl font-bold text-text-primary">₦3,450</div>
          <div className="text-[10px] text-text-secondary mt-0.5">12.4 km · 24 min</div>
        </motion.div>
      </div>
    ),
  },
];

export function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section id="how-it-works" ref={sectionRef} className="py-20 sm:py-28 relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <SectionReveal className="text-center mb-16 sm:mb-20">
          <p className="text-cta text-sm font-semibold tracking-widest uppercase mb-4">How It Works</p>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary mb-5">
            Three Steps. Zero Friction.
          </h2>
          <p className="text-text-secondary text-base sm:text-lg max-w-xl mx-auto">
            Powered by a real-time state machine that handles your ride from request to drop-off.
          </p>
        </SectionReveal>

        {/* Steps */}
        <div className="space-y-16 sm:space-y-24">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isReversed = i % 2 === 1;
            return (
              <SectionReveal key={step.number} delay={0.1}>
                <div className={`flex flex-col ${isReversed ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-10 lg:gap-16`}>
                  {/* Text */}
                  <div className="flex-1 text-center lg:text-left">
                    <div className="inline-flex items-center gap-3 mb-4">
                      <span className="text-cta/40 font-heading text-5xl font-bold">{step.number}</span>
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${step.color} flex items-center justify-center`}>
                        <Icon size={20} className="text-cta" />
                      </div>
                    </div>
                    <h3 className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-3">
                      {step.title}
                    </h3>
                    <p className="text-text-secondary text-base sm:text-lg leading-relaxed mb-4 max-w-md mx-auto lg:mx-0">
                      {step.description}
                    </p>
                    <code className="text-xs text-cta/60 font-mono bg-cta/5 rounded-lg px-3 py-1.5 inline-block">
                      {step.apiHint}
                    </code>
                  </div>
                  {/* Visual */}
                  <div className="flex-1 w-full max-w-md lg:max-w-none">
                    <div className="relative aspect-[4/3] rounded-2xl bg-gradient-to-br from-primary/50 to-background border border-border overflow-hidden">
                      {/* Grid background */}
                      <div className="absolute inset-0 grid-pattern opacity-30" />
                      {step.visual}
                    </div>
                  </div>
                </div>
              </SectionReveal>
            );
          })}
        </div>

        {/* Progress connector — desktop only */}
        <div className="hidden lg:block absolute left-1/2 top-[280px] bottom-40 w-px bg-gradient-to-b from-transparent via-cta/10 to-transparent -translate-x-1/2" />
      </div>
    </section>
  );
}
