'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Wallet, CalendarClock, Zap, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { SectionReveal, staggerContainer, staggerItem } from './SectionReveal';

const benefits = [
  {
    icon: Wallet,
    title: 'Keep More of What You Earn',
    description: 'Industry-leading commission structure. Transparent pricing — no hidden fees eating into your income.',
  },
  {
    icon: CalendarClock,
    title: 'Drive When You Want',
    description: 'Go online when it suits you. No mandatory hours, no minimum shifts. Your schedule, your rules.',
  },
  {
    icon: Zap,
    title: 'Instant Payouts',
    description: 'Withdraw earnings to your bank account daily. No waiting for weekly pay cycles.',
  },
];

export function DriverCTA() {
  const ref = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="drive" ref={ref} className="py-20 sm:py-28 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute top-1/2 right-0 w-[600px] h-[600px] -translate-y-1/2 translate-x-1/2 gradient-radial-glow opacity-20 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left — Visual */}
          <SectionReveal className="flex-1 w-full" direction="left">
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-gradient-to-br from-primary to-background border border-border">
              <div className="absolute inset-0 grid-pattern opacity-20" />
              
              {/* Earnings Dashboard Mockup */}
              <div className="absolute inset-6 sm:inset-8 flex flex-col">
                <div className="glass-panel rounded-xl p-4 sm:p-5 mb-4">
                  <div className="text-[11px] text-text-secondary mb-1.5">Today&apos;s Earnings</div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ delay: 0.5 }}
                    className="font-heading text-3xl sm:text-4xl font-bold text-text-primary"
                  >
                    ₦47,200
                  </motion.div>
                  <div className="text-emerald-400 text-xs font-medium mt-1">↑ 12% from yesterday</div>
                </div>

                <div className="grid grid-cols-2 gap-3 flex-1">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.7 }}
                    className="glass-panel rounded-xl p-3 sm:p-4 flex flex-col justify-center"
                  >
                    <div className="text-[10px] text-text-secondary">Rides</div>
                    <div className="font-heading text-2xl font-bold text-text-primary">14</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 0.85 }}
                    className="glass-panel rounded-xl p-3 sm:p-4 flex flex-col justify-center"
                  >
                    <div className="text-[10px] text-text-secondary">Hours Online</div>
                    <div className="font-heading text-2xl font-bold text-text-primary">6.5h</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1.0 }}
                    className="glass-panel rounded-xl p-3 sm:p-4 flex flex-col justify-center"
                  >
                    <div className="text-[10px] text-text-secondary">Rating</div>
                    <div className="font-heading text-2xl font-bold text-text-primary">4.9★</div>
                  </motion.div>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ delay: 1.15 }}
                    className="glass-panel rounded-xl p-3 sm:p-4 flex flex-col justify-center"
                  >
                    <div className="text-[10px] text-text-secondary">Acceptance</div>
                    <div className="font-heading text-2xl font-bold text-emerald-400">92%</div>
                  </motion.div>
                </div>
              </div>
            </div>
          </SectionReveal>

          {/* Right — Content */}
          <div className="flex-1">
            <SectionReveal>
              <p className="text-cta text-sm font-semibold tracking-widest uppercase mb-4">For Drivers</p>
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary mb-6 leading-tight">
                Your Car. Your Schedule.{' '}
                <span className="text-gradient">Your Earnings.</span>
              </h2>
            </SectionReveal>

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="space-y-6 mb-10"
            >
              {benefits.map((benefit) => {
                const Icon = benefit.icon;
                return (
                  <motion.div
                    key={benefit.title}
                    variants={staggerItem}
                    className="flex gap-4 group"
                  >
                    <div className="w-11 h-11 rounded-xl bg-cta/10 flex items-center justify-center shrink-0 transition-all duration-300 group-hover:bg-cta/20 group-hover:scale-110">
                      <Icon size={20} className="text-cta" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary mb-1">{benefit.title}</h3>
                      <p className="text-text-secondary text-sm leading-relaxed">{benefit.description}</p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            <SectionReveal delay={0.4}>
              <Link
                href="/register?role=driver"
                className="group inline-flex items-center gap-2 bg-cta text-white font-semibold rounded-2xl px-8 py-4 text-base transition-all duration-300 hover:bg-cta-hover cta-glow-hover cursor-pointer"
                id="driver-cta-apply"
              >
                Apply to Drive
                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <p className="text-text-secondary/50 text-xs mt-3">
                Takes less than 5 minutes &middot; Start earning this week
              </p>
            </SectionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
