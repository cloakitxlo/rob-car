import React, { useState } from 'react';
import { CreditCard, ShieldCheck, Bell, Zap, ArrowUpRight, Shield, ShieldAlert, Send, LogOut, User, Headphones } from 'lucide-react';
import { AuthUser } from '../types';

interface HeaderProps {
  authUser?: AuthUser | null;
  onLogout?: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenTopup: () => void;
  onOpenTiers: () => void;
  onOpenSendReceive: (mode?: 'send' | 'receive') => void;
}

export const Header: React.FC<HeaderProps> = ({
  authUser,
  onLogout,
  activeTab,
  setActiveTab,
  onOpenTopup,
  onOpenTiers,
  onOpenSendReceive,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'Cashback Credited', text: '+$64.95 Robin Card reward for Apple Store purchase.', time: '10m ago' },
    { id: 2, title: 'Card Auto Top-up', text: 'Auto top-up triggered: $500 added from ETH balance.', time: '2h ago' },
    { id: 3, title: 'Security Alert', text: 'New login session verified from Chrome / MacOS.', time: '1d ago' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#110e08]/92 backdrop-blur-xl border-b border-white/[0.08] text-[#faf7f0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-6 xl:gap-8">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => setActiveTab('overview')}
            >
              <span className="landing-mark w-10 h-10 group-hover:scale-105 transition-transform duration-300">
                <Shield className="w-5 h-5" />
              </span>
              <span className="landing-display text-lg sm:text-xl text-white group-hover:text-[#ccff00] transition-colors duration-300">
                Robin Card
              </span>
            </div>

            <nav className="hidden md:flex items-center gap-1 bg-[#1c180d]/70 p-1 rounded-full border border-white/[0.08]">
              {[
                { id: 'overview', label: 'Overview', icon: CreditCard },
                { id: 'support', label: 'Support', icon: Headphones },
                { id: 'transactions', label: 'Activity', icon: ArrowUpRight },
                { id: 'security', label: 'Security', icon: ShieldCheck },
                { id: 'profile', label: 'Profile', icon: User },
                ...(authUser?.role === 'admin'
                  ? [{ id: 'admin', label: 'Admin Vault', icon: ShieldAlert, badge: 'PRO' }]
                  : []),
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-semibold transition-all duration-300 ${
                      isActive
                        ? tab.id === 'admin'
                          ? 'bg-[#ff5000] text-white shadow-md shadow-[#ff5000]/25'
                          : 'trust-gradient shadow-md shadow-[#ccff00]/15'
                        : tab.id === 'admin'
                        ? 'text-[#ff5000] hover:bg-[#ff5000]/10'
                        : 'text-[#a09c8f] hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 ${isActive && tab.id !== 'admin' ? 'text-[#110e08]' : isActive ? 'text-white' : tab.id === 'admin' ? 'text-[#ff5000]' : 'text-[#a09c8f]'}`} />
                    <span>{tab.label}</span>
                    {tab.badge && (
                      <span className="text-[9px] font-semibold px-1.5 py-0.5 bg-black/20 text-white/90 rounded-full uppercase tracking-wide">
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => onOpenSendReceive('send')}
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-transparent hover:bg-white hover:text-[#110e08] text-[#e8e5dc] border border-white/15 transition-all duration-300 active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send / Receive</span>
            </button>

            <button
              onClick={onOpenTopup}
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold trust-gradient hover:trust-gradient-hover shadow-lg shadow-[#ccff00]/15 transition-all duration-300 active:scale-95"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Top Up</span>
            </button>

            <button
              onClick={onOpenTiers}
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all duration-300"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>Tiers</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-full bg-[#1c180d]/80 text-[#a09c8f] hover:text-white border border-white/10 transition-all duration-300 relative hover:border-[#ccff00]/30"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ccff00] animate-ping" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ccff00]" />
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 rounded-[28px] glass-card border border-white/10 shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3">
                    <span className="font-semibold text-xs text-[#faf7f0] uppercase tracking-[0.14em]">
                      Live Card Activity
                    </span>
                    <span className="text-[10px] text-[#ccff00] font-semibold cursor-pointer hover:text-[#dbff40]">
                      Mark all read
                    </span>
                  </div>
                  <div className="space-y-2.5">
                    {notifications.map((n) => (
                      <div key={n.id} className="p-3 rounded-2xl bg-black/40 border border-white/5 text-xs hover:border-[#ccff00]/25 transition-all duration-300">
                        <div className="flex justify-between items-center text-[#e8e5dc] font-semibold mb-1">
                          <span>{n.title}</span>
                          <span className="text-[10px] text-[#6a6760]">{n.time}</span>
                        </div>
                        <p className="text-[#a09c8f] text-[11px] leading-relaxed">{n.text}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {authUser && (
              <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                <button
                  onClick={() => setActiveTab('profile')}
                  className="hidden sm:flex flex-col text-right group/prof hover:opacity-80 transition-opacity"
                  title="Open User Profile"
                >
                  <span className="text-xs font-semibold text-[#e8e5dc] group-hover/prof:text-[#ccff00] transition-colors duration-300">
                    {authUser.name}
                  </span>
                  <span className="text-[10px] font-mono text-[#ccff00] font-semibold uppercase flex items-center gap-1 justify-end">
                    <User className="w-3 h-3" />
                    <span>{authUser.role === 'admin' ? 'Super Admin' : 'Profile'}</span>
                  </span>
                </button>

                <button
                  onClick={onLogout}
                  title="Log out or switch session"
                  className="p-2 rounded-full bg-[#1c180d] hover:bg-[#ff5000]/15 text-[#a09c8f] hover:text-[#ff5000] border border-white/10 transition-all duration-300 flex items-center gap-1.5 text-xs font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden xl:inline">Exit</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="md:hidden flex items-center justify-around border-t border-white/[0.08] bg-[#110e08] px-2 py-2">
        {[
          { id: 'overview', label: 'Card', icon: CreditCard },
          { id: 'support', label: 'Support', icon: Headphones },
          { id: 'transactions', label: 'History', icon: ArrowUpRight },
          { id: 'security', label: 'Security', icon: ShieldCheck },
          { id: 'profile', label: 'Profile', icon: User },
          ...(authUser?.role === 'admin'
            ? [{ id: 'admin', label: 'Admin', icon: ShieldAlert }]
            : []),
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 py-1.5 px-2.5 rounded-full text-[11px] font-semibold transition-all duration-300 ${
                isActive
                  ? tab.id === 'admin'
                    ? 'text-white bg-[#ff5000]'
                    : 'trust-gradient'
                  : 'text-[#a09c8f]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
