'use client';
import { HTMLMotionProps, motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'glass' | 'liquid-glass' | 'danger';
  isLoading?: boolean;
}

export function Button({ children, variant = 'primary', isLoading, className = '', ...props }: ButtonProps) {
  // Enforcing Touch & Interaction priority: min-h-[44px]
  const baseStyles = "relative overflow-hidden rounded-2xl font-semibold tracking-wide transition-all duration-300 select-none disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 px-8 min-h-[44px]";
  
  const variants = {
    primary: "bg-cta text-white shadow-[0_4px_20px_rgba(3,105,161,0.4)] hover:shadow-[0_8px_30px_rgba(3,105,161,0.6)] hover:bg-sky-700",
    secondary: "bg-secondary text-white hover:bg-slate-600 shadow-md",
    glass: "glass-panel text-white hover:bg-white/10",
    'liquid-glass': "glass-heavy text-white hover:border-white/20 hover:bg-white/5 active:scale-95 transition-all duration-400 after:absolute after:inset-0 after:-z-10 after:bg-gradient-to-r after:from-cta/20 after:to-transparent after:opacity-0 hover:after:opacity-100 after:transition-opacity",
    danger: "bg-rose-500/10 backdrop-blur-md text-rose-500 border border-rose-500/30 hover:bg-rose-500/20 hover:border-rose-500/60 transition-all"
  };

  return (
    <motion.button
      suppressHydrationWarning
      whileHover={{ scale: props.disabled ? 1 : 1.02 }}
      whileTap={{ scale: props.disabled ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${className} font-heading text-lg`}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : children}
    </motion.button>
  );
}
