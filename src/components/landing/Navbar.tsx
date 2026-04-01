'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { Menu, X, User, LogOut, ChevronDown } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import Image from 'next/image';

const navLinks = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Drive With Us', href: '#drive' },
  { label: 'Safety', href: '#safety' },
  { label: 'FAQ', href: '#faq' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const { scrollY } = useScroll();
  const bgOpacity = useTransform(scrollY, [0, 100], [0, 1]);
  const borderOpacity = useTransform(scrollY, [0, 100], [0, 0.08]);

  useEffect(() => {
    setHasMounted(true);
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user', e);
      }
    }

    const handler = () => { if (window.innerWidth >= 768) setMobileOpen(false); };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  const dashboardHref = user?.role === 'DRIVER' ? '/driver' : '/rider';

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 transition-colors duration-300"
      style={{
        backgroundColor: useTransform(bgOpacity, (v) => `rgba(var(--background-rgb, 2, 6, 23), ${v * 0.85})`),
        borderBottomColor: useTransform(borderOpacity, (v) => `rgba(148, 163, 184, ${v})`),
        borderBottomWidth: '1px',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 cursor-pointer group" id="nav-logo">
            <div className="w-8 h-8 rounded-lg bg-cta flex items-center justify-center transition-transform duration-300 group-hover:scale-110 overflow-hidden">
              {/* Fallback to text logo if image not provided yet */}
              <span className="text-white font-heading font-bold text-lg leading-none">E</span>
            </div>
            <span className="font-heading text-xl font-semibold text-text-primary tracking-wide">
              Ezyride
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200 cursor-pointer"
                id={`nav-${link.label.toLowerCase().replace(/\s/g, '-')}`}
                suppressHydrationWarning
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-4">
            <ThemeToggle />
            
            <div className="h-6 w-px bg-border mx-1" />

            {hasMounted && (
              user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-surface transition-colors cursor-pointer"
                    suppressHydrationWarning
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cta to-blue-600 flex items-center justify-center text-white font-bold text-xs">
                      {user.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                    <span className="text-sm font-medium text-text-primary hidden lg:block">
                      {user.name?.split(' ')[0]}
                    </span>
                    <ChevronDown size={14} className={`text-text-secondary transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-2 w-48 glass-heavy rounded-2xl p-2 z-50"
                      >
                        <Link
                          href={dashboardHref}
                          className="flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-surface text-sm font-medium text-text-primary transition-colors"
                        >
                          <User size={16} className="text-cta" />
                          Dashboard
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-rose-500/10 text-sm font-medium text-rose-400 transition-colors cursor-pointer"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    href="/login"
                    className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors duration-200 px-4 py-2 cursor-pointer"
                    id="nav-signin"
                  >
                    Sign In
                  </Link>
                  <a
                    href="#download"
                    className="text-sm font-semibold bg-cta text-white rounded-xl px-5 py-2.5 hover:bg-cta-hover transition-all duration-300 cta-glow-hover cursor-pointer"
                    id="nav-download"
                    suppressHydrationWarning
                  >
                    Download App
                  </a>
                </div>
              )
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex items-center gap-3 md:hidden">
            <ThemeToggle />
            <button
              className="p-2 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              id="nav-mobile-toggle"
            >
              {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={false}
        animate={mobileOpen ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="md:hidden overflow-hidden bg-background/95 backdrop-blur-2xl border-t border-white/5"
      >
        <div className="px-5 py-6 flex flex-col gap-4">
          {user && (
            <div className="flex items-center gap-3 px-2 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cta to-blue-600 flex items-center justify-center text-white font-bold">
                {user.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <div className="text-sm font-semibold text-text-primary">{user.name}</div>
                <div className="text-xs text-text-secondary">{user.role}</div>
              </div>
            </div>
          )}

          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-base font-medium text-text-secondary hover:text-text-primary transition-colors py-2 cursor-pointer"
            >
              {link.label}
            </a>
          ))}
          
          <div className="section-divider my-2" />
          
          {user ? (
            <>
              <Link
                href={dashboardHref}
                onClick={() => setMobileOpen(false)}
                className="text-base font-medium text-text-secondary hover:text-text-primary transition-colors py-2 cursor-pointer flex items-center gap-3"
              >
                <User size={18} className="text-cta" />
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-base font-medium text-rose-400 hover:text-rose-300 transition-colors py-2 cursor-pointer flex items-center gap-3"
              >
                <LogOut size={18} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="text-base font-medium text-text-secondary hover:text-text-primary transition-colors py-2 cursor-pointer"
              >
                Sign In
              </Link>
              <a
                href="#download"
                onClick={() => setMobileOpen(false)}
                className="text-base font-semibold bg-cta text-white rounded-xl px-5 py-3 text-center hover:bg-cta-hover transition-all duration-300 cursor-pointer"
              >
                Download App
              </a>
            </>
          )}
        </div>
      </motion.div>
    </motion.nav>
  );
}
