import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Lock, CreditCard, Zap, Globe2, Wifi, ShieldCheck } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenPrivacy: () => void;
  onOpenTerms: () => void;
}

const ease = [0.22, 1, 0.36, 1] as const;

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onOpenPrivacy,
  onOpenTerms,
}) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="landing-root min-h-screen">
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-[#110e08]/92 backdrop-blur-xl border-b border-white/[0.08]'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 sm:h-[4.5rem] flex items-center justify-between">
          <a href="#top" className="flex items-center gap-2.5 group">
            <span className="landing-mark">
              <Shield className="w-4 h-4" />
            </span>
            <span className="landing-display text-lg sm:text-xl text-white group-hover:text-[#ccff00] transition-colors duration-300">
              Robin Card
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#a09c8f]">
            <a href="#how" className="hover:text-white transition-colors duration-300">
              How it works
            </a>
            <a href="#security" className="hover:text-white transition-colors duration-300">
              Security
            </a>
            <a href="#kyc" className="hover:text-white transition-colors duration-300">
              No KYC
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onGetStarted}
              className="hidden sm:inline-flex text-sm font-semibold text-white hover:text-[#ccff00] transition-colors duration-300"
            >
              Log in
            </button>
            <button
              type="button"
              onClick={onGetStarted}
              className="rh-cta px-4 sm:px-5 py-2.5 text-sm"
            >
              Sign up
            </button>
          </div>
        </div>
      </header>

      <section id="top" className="landing-hero relative min-h-[100svh] overflow-x-hidden">
        <div className="landing-hero-plane absolute inset-0" aria-hidden="true" />
        <div className="landing-hero-sheen absolute inset-0" aria-hidden="true" />

        <div className="relative z-10 w-full max-w-6xl mx-auto px-5 sm:px-8 pt-24 pb-14 sm:py-28 min-h-[100svh] flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-10">
          <motion.div
            className="landing-hero-card-wrap pointer-events-none order-1 lg:order-2"
            aria-hidden="true"
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.16 }}
          >
            <div className="landing-hero-card-face">
              <div className="landing-hero-card-shine" />
              <div className="landing-hero-card-top">
                <div className="landing-hero-card-brand">
                  <span className="landing-hero-card-brand-mark">
                    <Shield className="w-3.5 h-3.5" />
                  </span>
                  <span>Robin Card</span>
                </div>
                <div className="landing-hero-contactless" title="Contactless">
                  <Wifi className="w-5 h-5 rotate-90" />
                </div>
              </div>

              <div className="landing-hero-chip-row">
                <div className="landing-hero-chip">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>

              <div className="landing-hero-pan">4890  ••••  ••••  9042</div>

              <div className="landing-hero-card-bottom">
                <div>
                  <p className="landing-hero-label">Card holder</p>
                  <p className="landing-hero-value">ALEX MEMBER</p>
                </div>
                <div>
                  <p className="landing-hero-label">Expires</p>
                  <p className="landing-hero-value">12/28</p>
                </div>
                <div className="landing-hero-network" aria-hidden="true">
                  <span className="landing-hero-network-o landing-hero-network-o--a" />
                  <span className="landing-hero-network-o landing-hero-network-o--b" />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease }}
            className="max-w-2xl space-y-6 order-2 lg:order-1 relative z-10"
          >
            <p className="landing-display text-4xl sm:text-6xl lg:text-7xl text-white leading-[1.05]">
              Put crypto in your everyday life
            </p>
            <h1 className="text-xl sm:text-2xl font-medium text-[#e8e5dc] leading-snug tracking-tight">
              Spend your crypto like cash — no KYC required.
            </h1>
            <p className="text-base sm:text-lg text-[#a09c8f] leading-relaxed max-w-xl">
              Load USDT into your vault, activate your Robin Card, and pay with confidence. Transfer, spend, and manage everything in one place — with card controls you define.
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={onGetStarted}
                className="rh-cta px-6 py-3.5 text-sm"
              >
                Sign up
              </button>
              <a
                href="#how"
                className="rh-cta-ghost px-6 py-3.5 text-sm"
              >
                See how it works
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="how" className="landing-section-light relative py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease }}
            className="max-w-xl mb-12 sm:mb-16"
          >
            <h2 className="landing-display text-3xl sm:text-4xl text-[#110e08]">
              Get started in minutes
            </h2>
            <p className="mt-3 text-[#5c5648] text-base leading-relaxed">
              No bank waitlists. Create an account, fund your vault, and your card is ready when your deposit clears — start with your first USDT load.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-8 sm:gap-10">
            {[
              {
                icon: Zap,
                title: 'Create your account',
                text: 'Sign up in minutes with your name and email. Jump straight into your Robin Card portal.',
              },
              {
                icon: Globe2,
                title: 'Load crypto to your vault',
                text: 'Deposit USDT via supported networks. Buy time back from paperwork — your balance updates after a verified transfer.',
              },
              {
                icon: CreditCard,
                title: 'Use your card freely',
                text: 'A crypto card with controls you define. Once funded, spend everyday — contactless, online, or ATM.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.65, delay: i * 0.1, ease }}
                className="space-y-3"
              >
                <div className="w-11 h-11 rounded-full bg-[#110e08] text-[#ccff00] flex items-center justify-center">
                  <item.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold text-[#110e08] tracking-tight">{item.title}</h3>
                <p className="text-sm text-[#5c5648] leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12">
            <button
              type="button"
              onClick={onGetStarted}
              className="rh-cta px-6 py-3.5 text-sm"
            >
              Sign up
            </button>
          </div>
        </div>
      </section>

      <section id="kyc" className="relative py-20 sm:py-28 landing-band">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease }}
            className="space-y-4"
          >
            <h2 className="landing-display text-3xl sm:text-4xl text-white">
              Use crypto on a card — without KYC friction
            </h2>
            <p className="text-[#e8e5dc] text-base leading-relaxed">
              Robin Card is built for speed and privacy-minded access. Start with as little as your first deposit. Load USDT, activate spending, and pay — without uploading endless identity documents to get moving.
            </p>
            <p className="text-[#a09c8f] text-sm leading-relaxed">
              You stay in control: deposit, track balances, manage card controls you define, and reach support when you need help.
            </p>
            <button
              type="button"
              onClick={onGetStarted}
              className="mt-2 rh-cta px-6 py-3.5 text-sm"
            >
              Sign up
            </button>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, delay: 0.08, ease }}
            className="space-y-4"
          >
            {[
              'No lengthy identity queue to explore the product',
              'Deposit crypto and activate spending after your transfer is verified',
              'Card controls you define — contactless, online, ATM preferences',
              'We’ve got your back — support tickets with real replies inside your account',
            ].map((line) => (
              <li
                key={line}
                className="flex gap-3 text-sm text-[#e8e5dc] leading-relaxed border-l-2 border-[#ccff00] pl-4"
              >
                {line}
              </li>
            ))}
          </motion.ul>
        </div>
      </section>

      <section id="security" className="landing-section-light relative py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-5 sm:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease }}
            className="max-w-2xl mb-12"
          >
            <div className="inline-flex items-center gap-2 text-[#110e08] mb-3">
              <Lock className="w-5 h-5" />
              <span className="text-xs font-semibold uppercase tracking-[0.16em]">Robin Card Protection</span>
            </div>
            <h2 className="landing-display text-3xl sm:text-4xl text-[#110e08]">
              We work hard to keep your data safe and secure
            </h2>
            <p className="mt-3 text-[#5c5648] text-base leading-relaxed">
              Encrypted account access, vault-style balances, freeze controls, and clear activity history — so spending crypto feels protected and usable.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              {
                title: 'We keep your data safe',
                text: 'Email and password protected sessions so only you enter your Robin Card portal.',
              },
              {
                title: 'We protect against unauthorized activity',
                text: 'Freeze your card, manage channels, and keep spending settings under your command.',
              },
              {
                title: 'We verify every deposit',
                text: 'Transfers are checked before balances update — so credits map to real on-chain activity.',
              },
              {
                title: 'We’ve got your back',
                text: 'Support lives inside your account. Open a ticket and get a real reply when you need help.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.08, ease }}
                className="p-6 rounded-[28px] border border-[#d8d2c2] bg-white"
              >
                <div className="w-9 h-9 rounded-full bg-[#110e08] text-[#ccff00] flex items-center justify-center mb-4">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <h3 className="font-semibold text-[#110e08] mb-2 tracking-tight">{item.title}</h3>
                <p className="text-sm text-[#5c5648] leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 sm:py-24 bg-black">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease }}
          className="max-w-6xl mx-auto px-5 sm:px-8 text-center space-y-6"
        >
          <h2 className="landing-display text-3xl sm:text-5xl text-white">
            Ready to spend crypto like cash?
          </h2>
          <p className="text-[#a09c8f] max-w-xl mx-auto">
            Sign up, fund your vault, and start using Robin Card — simple, secure, and built without KYC bottlenecks.
          </p>
          <button
            type="button"
            onClick={onGetStarted}
            className="rh-cta px-8 py-4 text-base"
          >
            Sign up
          </button>
        </motion.div>
      </section>

      <footer className="border-t border-white/[0.08] bg-black">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div className="sm:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="landing-mark landing-mark--sm">
                <Shield className="w-4 h-4" />
              </span>
              <span className="landing-display text-white">Robin Card</span>
            </div>
            <p className="text-sm text-[#a09c8f] max-w-md leading-relaxed">
              Load digital assets, spend with ease, and manage everything from one secure portal. Crypto offered through Robin Card — see our Terms for details.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6a6760] mb-3">Product</p>
            <ul className="space-y-2 text-sm text-[#e8e5dc]">
              <li>
                <a href="#how" className="hover:text-[#ccff00] transition-colors duration-300">
                  How it works
                </a>
              </li>
              <li>
                <a href="#security" className="hover:text-[#ccff00] transition-colors duration-300">
                  Security
                </a>
              </li>
              <li>
                <button type="button" onClick={onGetStarted} className="hover:text-[#ccff00] transition-colors duration-300">
                  Sign up
                </button>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#6a6760] mb-3">Legal</p>
            <ul className="space-y-2 text-sm text-[#e8e5dc]">
              <li>
                <button type="button" onClick={onOpenPrivacy} className="hover:text-[#ccff00] transition-colors duration-300 text-left">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button type="button" onClick={onOpenTerms} className="hover:text-[#ccff00] transition-colors duration-300 text-left">
                  Terms &amp; Conditions
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.08]">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between text-xs text-[#6a6760]">
            <p>© {new Date().getFullYear()} Robin Card. All rights reserved.</p>
            <p>Crypto involves risk. By using this site you agree to our Terms and acknowledge our Privacy Policy.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
