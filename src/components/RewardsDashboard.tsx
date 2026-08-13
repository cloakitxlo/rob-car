import React, { useState } from 'react';
import { CardTier } from '../types';
import { CARD_TIERS } from '../data/mockData';
import { Zap, Award, Gift, Sparkles, TrendingUp, Music, Film, Plane, Lock } from 'lucide-react';

interface RewardsDashboardProps {
  currentTier: CardTier;
  onOpenTiersModal: () => void;
}

export const RewardsDashboard: React.FC<RewardsDashboardProps> = ({
  currentTier,
  onOpenTiersModal,
}) => {
  const [stakedAmount] = useState<number>(12500);

  const tierInfo = CARD_TIERS.find((t) => t.id === currentTier) || CARD_TIERS[3];

  const perkList = [
    { name: 'Spotify Premium', rebate: '100% Rebate ($11.99/mo)', icon: Music, active: true },
    { name: 'Netflix Ultra HD', rebate: '100% Rebate ($19.99/mo)', icon: Film, active: true },
    { name: 'Airport LoungeKey', rebate: 'Unlimited Airport Passes', icon: Plane, active: currentTier === 'platinum' || currentTier === 'black' },
    { name: 'VIP Concierge', rebate: '24/7 Dedicated Support', icon: Award, active: currentTier === 'gold' || currentTier === 'platinum' || currentTier === 'black' },
  ];

  const estimatedYearlyRewards = stakedAmount * 0.125 + 3400 * (tierInfo.cashbackPercent / 100) * 12;

  return (
    <div className="space-y-6">
      {/* Rewards Header Banner */}
      <div className="relative rounded-3xl glass-card border border-white/10 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ccff00]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                <Zap className="w-4 h-4" />
              </span>
              <span className="text-xs font-semibold text-amber-400 uppercase tracking-widest">
                Tier Active: {tierInfo.name}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-semibold text-[#faf7f0] tracking-tight">
              Earn {tierInfo.cashbackPercent}% Instant Crypto Cashback
            </h2>
            <p className="text-xs text-[#a09c8f] max-w-xl leading-relaxed font-medium">
              Every card swipe deposits APEX or BTC cashback directly into your wallet with zero foreign exchange fees.
            </p>
          </div>

          <button
            onClick={onOpenTiersModal}
            className="px-6 py-3 rounded-full trust-gradient hover:trust-gradient-hover font-semibold text-xs shadow-lg shadow-[#ccff00]/15 transition-all active:scale-95 whitespace-nowrap"
          >
            Upgrade Rewards Tier
          </button>
        </div>
      </div>

      {/* Rewards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Earned Counter */}
        <div className="glass-card border border-white/10 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex justify-between items-center text-[#a09c8f] text-xs font-bold uppercase tracking-wider">
            <span>Lifetime Cashback Earned</span>
            <Gift className="w-4 h-4 text-[#ccff00]" />
          </div>
          <div className="text-3xl font-semibold text-[#faf7f0] font-mono">
            $412.85 <span className="text-xs font-mono text-[#ccff00] font-bold">USD</span>
          </div>
          <p className="text-[11px] text-[#a09c8f] font-medium">
            Equivalent to 491.5 APEX tokens automatically reinvested at 12.5% APY.
          </p>
        </div>

        {/* Staking APY Pool */}
        <div className="glass-card border border-white/10 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex justify-between items-center text-[#a09c8f] text-xs font-bold uppercase tracking-wider">
            <span>APEX Staking APY Boost</span>
            <TrendingUp className="w-4 h-4 text-[#ccff00]" />
          </div>
          <div className="text-3xl font-semibold text-[#ccff00] font-mono">
            12.5% <span className="text-xs font-mono text-[#a09c8f] font-bold">APY</span>
          </div>
          <p className="text-[11px] text-[#a09c8f] font-medium">
            Currently staking {stakedAmount.toLocaleString()} APEX tokens in lockup pool.
          </p>
        </div>

        {/* Estimated Annual Yield */}
        <div className="glass-card border border-white/10 rounded-3xl p-6 shadow-xl space-y-3">
          <div className="flex justify-between items-center text-[#a09c8f] text-xs font-bold uppercase tracking-wider">
            <span>Est. Annual Benefit Value</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-3xl font-semibold text-amber-400 font-mono">
            ${estimatedYearlyRewards.toFixed(0)} <span className="text-xs font-mono text-[#a09c8f] font-bold">/yr</span>
          </div>
          <p className="text-[11px] text-[#a09c8f] font-medium">
            Includes cashback rewards, staking yields, and merchant subscription rebates.
          </p>
        </div>
      </div>

      {/* Subscription Rebates & Perks */}
      <div className="glass-card border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
        <h3 className="font-semibold text-base text-[#faf7f0]">Merchant Subscription Rebates</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {perkList.map((perk, idx) => {
            const Icon = perk.icon;
            return (
              <div
                key={idx}
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 ${
                  perk.active
                    ? 'bg-black/40 border-white/5 hover:border-[#ccff00]/25'
                    : 'bg-[#0a0805]/30 border-white/5 opacity-50'
                } transition-all`}
              >
                <div className="flex justify-between items-center">
                  <div className="p-2.5 rounded-xl bg-[#1c180d] border border-white/10 text-[#ccff00]">
                    <Icon className="w-5 h-5" />
                  </div>
                  {perk.active ? (
                    <span className="text-[10px] font-semibold text-[#ccff00] bg-[#ccff00]/10 px-2.5 py-0.5 rounded-full border border-[#ccff00]/25">
                      Active
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-[#a09c8f] bg-[#35322d]/80 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Locked
                    </span>
                  )}
                </div>

                <div>
                  <h4 className="font-semibold text-xs text-[#faf7f0]">{perk.name}</h4>
                  <p className="text-[11px] text-[#a09c8f] mt-0.5 font-medium">{perk.rebate}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
