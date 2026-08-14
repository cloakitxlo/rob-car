import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthUser, ConnectedUser } from '../types';
import {
  ShieldCheck,
  Lock,
  Mail,
  User,
  Key,
  ArrowRight,
  ShieldAlert,
  ArrowLeft,
  Shield,
} from 'lucide-react';
import { EMAIL_VALIDATION_ERROR, isValidEmailAddress } from '../utils/emailValidation';

interface AuthScreenProps {
  onLoginSuccess: (user: AuthUser, userAccount?: ConnectedUser) => void;
  onBack?: () => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

const isAllowedAdminLoginId = (value: string) => {
  const id = value.trim().toLowerCase();
  return id === 'admin' || id === 'admin@cryptocard.com' || id === 'admin@system.com';
};

export function AuthScreen({ onLoginSuccess, onBack }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setInfo(null);

    if (!email || !password) {
      setError('Please enter both email address and password.');
      return;
    }

    const allowAdminAlias = mode === 'login' && isAllowedAdminLoginId(email);
    if (!allowAdminAlias && !isValidEmailAddress(email)) {
      setError(EMAIL_VALIDATION_ERROR);
      return;
    }

    if (mode === 'signup' && !fullName) {
      setError('Please enter your full name to register.');
      return;
    }

    setIsLoading(true);

    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: fullName }),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        onLoginSuccess(data.user, data.userAccount);
      } else if (data.code === 'NEED_SIGNUP') {
        setMode('signup');
        setError(null);
        setInfo('No account found. Please sign up first, then you can log in with your email and password.');
      } else if (data.code === 'ALREADY_REGISTERED') {
        setMode('login');
        setError(null);
        setInfo('Account already exists. Please sign in with your email and password.');
      } else {
        setError(data.error || 'Authentication failed. Please check credentials.');
      }
    } catch {
      setError('Connection error. Server failed to process login.');
    } finally {
      setIsLoading(false);
    }
  };

  const switchMode = (next: 'login' | 'signup') => {
    setMode(next);
    setError(null);
    setInfo(null);
  };

  return (
    <div className="landing-root min-h-screen relative overflow-x-hidden">
      <div className="landing-hero-plane absolute inset-0" aria-hidden="true" />
      <div className="landing-hero-sheen absolute inset-0 opacity-50" aria-hidden="true" />

      <header className="relative z-20 border-b border-white/[0.08] bg-[#110e08]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2.5 group text-left"
          >
            <span className="landing-mark">
              <Shield className="w-4 h-4" />
            </span>
            <span className="landing-display text-lg text-white group-hover:text-[#ccff00] transition-colors duration-300">
              Robin Card
            </span>
          </button>

          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#a09c8f] hover:text-white transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to home
            </button>
          )}
        </div>
      </header>

      <main className="relative z-10 flex-1 min-h-[calc(100svh-4rem)] flex items-center justify-center px-5 sm:px-8 py-10 sm:py-14">
        <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease }}
            className="hidden lg:block space-y-6"
          >
            <p className="landing-display text-4xl xl:text-5xl text-white leading-[1.08]">
              Log in to manage your card
            </p>
            <p className="text-[#a09c8f] text-base leading-relaxed max-w-md">
              Sign in or create an account to load USDT, activate spending, and manage Robin Card — intuitive tools, controls you define, same secure experience from the homepage.
            </p>
            <ul className="space-y-3 text-sm text-[#e8e5dc]">
              {[
                'Get started with your first deposit — no KYC friction',
                'We work hard to keep your data safe and secure',
                'Vault balances and card controls in one place',
              ].map((line) => (
                <li key={line} className="flex gap-3 border-l-2 border-[#ccff00] pl-4">
                  {line}
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-2 text-xs text-[#6a6760] pt-2">
              <Lock className="w-3.5 h-3.5 text-[#ccff00]" />
              <span>Protected session · Secure vault authentication</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease, delay: 0.08 }}
            className="w-full max-w-md mx-auto lg:mx-0"
          >
            <div className="auth-panel rounded-[28px] p-6 sm:p-8 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 text-[#110e08]">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                    Secure access
                  </span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease }}
                  >
                    <h1 className="landing-display text-2xl sm:text-3xl text-[#110e08]">
                      {mode === 'login' ? 'Log in to Robin Card' : 'Create your account'}
                    </h1>
                    <p className="mt-1.5 text-sm text-[#5c5648] leading-relaxed">
                      {mode === 'login'
                        ? 'Welcome back. Enter your details to open your dashboard.'
                        : 'Sign up in minutes and start with your first deposit.'}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-2 gap-1 p-1 rounded-full bg-[#f2efe7] border border-[#e5e0d2] text-xs">
                <button
                  type="button"
                  onClick={() => switchMode('login')}
                  className={`auth-tab py-2.5 ${mode === 'login' ? 'is-active' : 'text-[#5c5648] hover:text-[#110e08]'}`}
                >
                  Log in
                </button>
                <button
                  type="button"
                  onClick={() => switchMode('signup')}
                  className={`auth-tab py-2.5 ${mode === 'signup' ? 'is-active' : 'text-[#5c5648] hover:text-[#110e08]'}`}
                >
                  Sign up
                </button>
              </div>

              <form onSubmit={handleAuthSubmit} className="space-y-4">
                <AnimatePresence initial={false}>
                  {(mode === 'signup' || mode === 'login') && (
                    <motion.div
                      key={`name-${mode}`}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="space-y-1.5 overflow-hidden"
                    >
                      <label className="text-[11px] font-semibold text-[#5c5648] uppercase tracking-[0.14em] block">
                        Full Name{' '}
                        {mode === 'login' && (
                          <span className="text-[#8a8576] font-medium normal-case tracking-normal">
                            (matches card name)
                          </span>
                        )}
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#8a8576] absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          placeholder="Enter your full name"
                          className="auth-input w-full rounded-full pl-10 pr-4 py-3 text-sm placeholder:text-[#8a8576] focus:outline-none transition-all"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-[#5c5648] uppercase tracking-[0.14em] block">
                    Login ID / Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#8a8576] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      inputMode="email"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@gmail.com"
                      className="auth-input w-full rounded-full pl-10 pr-4 py-3 text-sm placeholder:text-[#8a8576] focus:outline-none transition-all"
                      autoComplete="email"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-[#5c5648] uppercase tracking-[0.14em] block">
                    Password
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-[#8a8576] absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="auth-input w-full rounded-full pl-10 pr-4 py-3 text-sm placeholder:text-[#8a8576] focus:outline-none transition-all"
                      autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    />
                  </div>
                </div>

                <AnimatePresence>
                  {info && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-3 rounded-2xl bg-[rgba(204,255,0,0.18)] border border-[rgba(168,212,0,0.45)] text-[#110e08] text-xs font-medium text-left flex items-start gap-2"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#7fa200] shrink-0 mt-0.5" />
                      <span>{info}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="p-3 rounded-2xl bg-[#ff5000]/10 border border-[#ff5000]/30 text-[#d43a00] text-xs font-medium text-left flex items-start gap-2"
                    >
                      <ShieldAlert className="w-4 h-4 text-[#ff5000] shrink-0 mt-0.5" />
                      <span>{error}</span>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileTap={{ scale: 0.98 }}
                  className="rh-cta w-full py-3.5 text-sm disabled:opacity-50 mt-1"
                >
                  {isLoading ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="auth-spinner" />
                      Authenticating...
                    </span>
                  ) : (
                    <>
                      <span>{mode === 'login' ? 'Log in' : 'Sign up'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>

              <div className="flex items-center justify-center gap-2 text-[11px] text-[#8a8576] pt-1">
                <Lock className="w-3 h-3 text-[#7fa200]" />
                <span>256-bit AES vault authentication</span>
              </div>
            </div>

            <p className="mt-5 text-center text-xs text-[#6a6760]">
              {mode === 'login' ? (
                <>
                  Not on Robin Card?{' '}
                  <button type="button" onClick={() => switchMode('signup')} className="font-semibold text-[#ccff00] hover:text-[#dbff40]">
                    Create an account
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button type="button" onClick={() => switchMode('login')} className="font-semibold text-[#ccff00] hover:text-[#dbff40]">
                    Log in
                  </button>
                </>
              )}
            </p>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
