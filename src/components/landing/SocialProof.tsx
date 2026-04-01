'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { Car, MapPin, Star, Clock } from 'lucide-react';

const stats = [
  { icon: Car, value: 10000, suffix: '+', label: 'Rides Completed' },
  { icon: MapPin, value: 5, suffix: '', label: 'Cities & Growing' },
  { icon: Star, value: 4.9, suffix: '★', label: 'Average Rating', isDecimal: true },
  { icon: Clock, value: 2, suffix: 'min', label: 'Average Wait' },
];

function CountUp({ target, suffix, isDecimal, inView }: { target: number; suffix: string; isDecimal?: boolean; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 2000;
    const steps = 60;
    const stepDuration = duration / steps;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.min(target, increment * step);
      setCount(current);
      if (step >= steps) {
        setCount(target);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [inView, target]);

  const displayValue = isDecimal ? count.toFixed(1) : Math.floor(count).toLocaleString();

  return (
    <span>{displayValue}{suffix}</span>
  );
}

export function SocialProof() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section className="relative py-8 sm:py-12" id="social-proof">
      <div className="section-divider mb-8 sm:mb-12" />

      <div ref={ref} className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center group"
              >
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-cta/10 text-cta mb-3 transition-transform duration-300 group-hover:scale-110">
                  <Icon size={20} />
                </div>
                <div className="font-heading text-3xl sm:text-4xl font-bold text-text-primary mb-1">
                  <CountUp target={stat.value} suffix={stat.suffix} isDecimal={stat.isDecimal} inView={isInView} />
                </div>
                <div className="text-text-secondary text-sm font-medium">
                  {stat.label}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="section-divider mt-8 sm:mt-12" />
    </section>
  );
}
