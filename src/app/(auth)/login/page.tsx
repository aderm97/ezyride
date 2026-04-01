'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { fetchApi } from '@/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [role, setRole] = useState<'RIDER' | 'DRIVER'>('RIDER');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const endpoint = isLogin ? '/auth/login' : '/auth/register';
      const body = isLogin ? { email, password } : { email, password, name, role };
      const data = await fetchApi(endpoint, { method: 'POST', body: JSON.stringify(body) });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.user.role === 'DRIVER') {
        router.push('/driver');
      } else {
        router.push('/rider');
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-white flex items-center justify-center p-4 relative overflow-hidden font-body">
      {/* Immersive Fluid Liquid Background */}
      <div className="absolute inset-[-50%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary via-background to-background opacity-80" />
      <motion.div className="absolute top-0 right-0 w-[60vw] h-[60vw] bg-cta/10 blur-[120px] rounded-full animate-liquid -z-10 mix-blend-screen" />
      <motion.div className="absolute bottom-0 left-0 w-[50vw] h-[50vw] bg-purple-900/10 blur-[130px] rounded-full animate-float -z-10 mix-blend-screen" />

      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-lg glass-heavy rounded-3xl p-8 md:p-12 z-10"
      >
        <div className="mb-10 text-center">
          <h1 className="font-heading text-5xl font-semibold text-gradient mb-3">Ezyride</h1>
          <p className="text-slate-400 text-sm tracking-wide">
            {isLogin ? 'Premium rides, instantly.' : 'Join the fluid movement.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="overflow-hidden flex flex-col gap-6"
              >
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Full Name</label>
                  <input suppressHydrationWarning
                    type="text" required value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full mt-2 bg-slate-800/40 border border-slate-700/50 focus:border-cta focus:ring-1 focus:ring-cta rounded-2xl px-5 py-4 text-white outline-none transition-all placeholder:text-slate-500"
                    placeholder="John Astors"
                  />
                </div>
                
                <div>
                  <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Join As</label>
                  <div className="flex gap-3 mt-2">
                    <button suppressHydrationWarning type="button" onClick={() => setRole('RIDER')} className={`flex-1 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 ${role === 'RIDER' ? 'bg-cta/20 border border-cta text-blue-200 shadow-[0_0_15px_rgba(3,105,161,0.3)]' : 'bg-slate-800/40 border border-slate-700/50 text-slate-400 hover:bg-slate-800/60'}`}>
                      Rider
                    </button>
                    <button suppressHydrationWarning type="button" onClick={() => setRole('DRIVER')} className={`flex-1 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 ${role === 'DRIVER' ? 'bg-purple-500/20 border border-purple-500/50 text-purple-200 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'bg-slate-800/40 border border-slate-700/50 text-slate-400 hover:bg-slate-800/60'}`}>
                      Driver
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Email Address</label>
            <input suppressHydrationWarning
              type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
              className="w-full mt-2 bg-slate-800/40 border border-slate-700/50 focus:border-cta focus:ring-1 focus:ring-cta rounded-2xl px-5 py-4 text-white outline-none transition-all placeholder:text-slate-500"
              placeholder="hello@luxury.com"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest pl-1">Password</label>
            <input suppressHydrationWarning
              type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 bg-slate-800/40 border border-slate-700/50 focus:border-cta focus:ring-1 focus:ring-cta rounded-2xl px-5 py-4 text-white outline-none transition-all placeholder:text-slate-500"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-rose-400 text-sm font-medium bg-rose-500/10 p-4 rounded-xl border border-rose-500/20">
              {error}
            </motion.div>
          )}

          <Button type="submit" variant="primary" isLoading={isLoading} className="mt-4 w-full py-5 text-lg shadow-[0_4px_30px_rgba(3,105,161,0.5)]">
            {isLogin ? 'Sign In' : 'Begin Journey'}
          </Button>

          <div className="text-center mt-2">
            <button suppressHydrationWarning type="button" onClick={() => setIsLogin(!isLogin)} className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
              {isLogin ? "Experience Ezyride. Create account." : "Already flying with us? Sign in."}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
