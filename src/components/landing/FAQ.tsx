'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { SectionReveal } from './SectionReveal';

const faqs = [
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major debit and credit cards, mobile money, and bank transfers. Payments are processed securely with end-to-end encryption. Cash payments are not currently supported.',
  },
  {
    question: 'Can I cancel or change my booking?',
    answer: 'Yes. You can cancel a ride at any time before the driver arrives at your pickup location with no charge. If the driver has already arrived, a small cancellation fee may apply. You can modify your destination during the ride.',
  },
  {
    question: 'How do I track my ride?',
    answer: 'Every ride is tracked in real-time via GPS. You can see your driver\'s location, estimated arrival time, and share your live trip status with friends or family directly from the app.',
  },
  {
    question: 'How do I report a safety concern?',
    answer: 'Tap the SOS button in the app during any ride to reach our 24/7 safety team. You can also report issues after the ride through the trip history. We take every report seriously and respond within 1 hour.',
  },
  {
    question: 'What cities are you available in?',
    answer: 'We are currently live in Lagos, London, and Pretoria — with more cities launching soon. Enter your location in the app to check availability in your area.',
  },
  {
    question: 'How do driver earnings work?',
    answer: 'Drivers keep the majority of each fare with our transparent commission structure. Earnings are calculated per trip based on distance and time. You can withdraw your balance to your bank account daily — no waiting for weekly payouts.',
  },
];

function FAQItem({ faq, index }: { faq: typeof faqs[0]; index: number }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      className="border-b border-border last:border-b-0"
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-5 sm:py-6 text-left group cursor-pointer"
        aria-expanded={isOpen}
        id={`faq-${index}`}
      >
        <span className="font-medium text-text-primary text-base sm:text-lg pr-8 group-hover:text-cta transition-colors duration-200">
          {faq.question}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-text-secondary shrink-0"
        >
          <ChevronDown size={20} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <p className="text-text-secondary text-sm sm:text-base leading-relaxed pb-5 sm:pb-6 pr-12">
              {faq.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          {/* Left — Header */}
          <SectionReveal className="lg:w-[340px] shrink-0">
            <p className="text-cta text-sm font-semibold tracking-widest uppercase mb-4">FAQ</p>
            <h2 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary mb-4">
              Questions?{' '}
              <span className="text-gradient">Answers.</span>
            </h2>
            <p className="text-text-secondary text-base leading-relaxed">
              Everything you need to know about riding and driving with Ezyride.
            </p>
          </SectionReveal>

          {/* Right — Accordion */}
          <div className="flex-1">
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
