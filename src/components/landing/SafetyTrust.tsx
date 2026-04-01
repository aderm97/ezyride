'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Radar, ShieldCheck, Lock } from 'lucide-react';
import { SectionReveal, staggerContainer, staggerItem } from './SectionReveal';

const features = [
  {
    icon: Radar,
    title: 'Real-Time GPS Tracking',
    description: 'Every ride is tracked live. Share your trip status with family or friends with one tap.',
    animation: 'pulse',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Drivers',
    description: 'Background checks and identity verification completed before every first ride on the platform.',
    animation: 'fill',
  },
  {
    icon: Lock,
    title: 'Secure Payments',
    description: 'End-to-end encrypted transactions. No cash required — pay digitally with full peace of mind.',
    animation: 'lock',
  },
];

function AnimatedIcon({ icon: Icon, animation }: { icon: typeof Radar; animation: string }) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
      className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cta/20 to-cta/5 border border-cta/10 flex items-center justify-center mb-5"
    >
      <motion.div
        animate={
          animation === 'pulse'
            ? { scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }
            : animation === 'fill'
            ? { scale: [1, 1.05, 1] }
            : { rotate: [0, -5, 5, 0] }
        }
        transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <Icon size={26} className="text-cta" />
      </motion.div>
    </motion.div>
  );
}

export function SafetyTrust() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="safety" ref={ref} className="py-20 sm:py-28 relative">
      {/* Background accent */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[400px] gradient-radial-glow opacity-15 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <SectionReveal className="text-center mb-14 sm:mb-16">
          <p className="text-cta text-sm font-semibold tracking-widest uppercase mb-4">Safety</p>
          <h2 className="font-heading text-4xl sm:text-5xl md:text-6xl font-bold text-text-primary mb-5">
            Built on Trust.{' '}
            <span className="text-gradient">Backed by Technology.</span>
          </h2>
          <p className="text-text-secondary text-base sm:text-lg max-w-xl mx-auto">
            Every feature is designed to put your safety first — from the moment you request a ride to when you reach your destination.
          </p>
        </SectionReveal>

        {/* Cards */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          className="grid md:grid-cols-3 gap-6 sm:gap-8"
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              variants={staggerItem}
              className="group glass-panel rounded-2xl p-7 sm:p-8 text-center sm:text-left hover:bg-surface-hover/50 transition-all duration-400 hover:border-cta/10 cursor-default"
            >
              <div className="flex justify-center sm:justify-start">
                <AnimatedIcon icon={feature.icon} animation={feature.animation} />
              </div>
              <h3 className="font-heading text-xl sm:text-2xl font-bold text-text-primary mb-3">
                {feature.title}
              </h3>
              <p className="text-text-secondary text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
