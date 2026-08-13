import React, { useState } from 'react';
import { CryptoCard } from '../types';
import { SlidersHorizontal, Smartphone, Globe, Landmark, Zap, Check, Save } from 'lucide-react';

interface CardControlsProps {
  card: CryptoCard;
  onUpdateLimits: (updated: Partial<CryptoCard>) => void;
}

export const CardControls: React.FC<CardControlsProps> = ({ card, onUpdateLimits }) => {
  const [contactless, setContactless] = useState(card.contactlessEnabled);
  const [online, setOnline] = useState(card.onlinePaymentsEnabled);
  const [atm, setAtm] = useState(card.atmWithdrawalsEnabled);
  const [autoTopup, setAutoTopup] = useState(card.autoTopupEnabled);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onUpdateLimits({
      contactlessEnabled: contactless,
      onlinePaymentsEnabled: online,
      atmWithdrawalsEnabled: atm,
      autoTopupEnabled: autoTopup,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="glass-card border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-white/10 pb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/25">
            <SlidersHorizontal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="dash-title text-base text-[#faf7f0]">Card Controls & Limits</h3>
            <p className="text-xs text-[#a09c8f] font-medium">Manage payment channels and security settings</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full trust-gradient hover:trust-gradient-hover text-xs font-semibold transition-all shadow-lg shadow-[#ccff00]/15 active:scale-95"
        >
          {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
          <span>{saved ? 'Saved!' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Payment Channel Toggles */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-[#a09c8f] uppercase tracking-wider">
          Security Payment Channels
        </h4>

        {/* Contactless */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-[#ccff00]/25 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#1c180d] text-[#ccff00] border border-white/10">
              <Smartphone className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#faf7f0]">Contactless (NFC) Tap & Pay</p>
              <p className="text-[11px] text-[#a09c8f]">Physical terminal touchless POS payments</p>
            </div>
          </div>
          <button
            onClick={() => setContactless(!contactless)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${
              contactless ? 'bg-[#ccff00]' : 'bg-[#35322d]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                contactless ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Online Payments */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-[#ccff00]/25 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#1c180d] text-[#ccff00] border border-white/10">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#faf7f0]">Online E-Commerce Transactions</p>
              <p className="text-[11px] text-[#a09c8f]">Web purchases and subscription billing</p>
            </div>
          </div>
          <button
            onClick={() => setOnline(!online)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${
              online ? 'bg-[#ccff00]' : 'bg-[#35322d]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                online ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* ATM Withdrawals */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-[#ccff00]/25 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#1c180d] text-[#ccff00] border border-white/10">
              <Landmark className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#faf7f0]">Physical ATM Cash Withdrawals</p>
              <p className="text-[11px] text-[#a09c8f] font-medium">Global fee-free cash network access</p>
            </div>
          </div>
          <button
            onClick={() => setAtm(!atm)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${
              atm ? 'bg-[#ccff00]' : 'bg-[#35322d]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                atm ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Auto Topup Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5 hover:border-[#ccff00]/25 transition-all">
          <div className="flex items-center gap-3.5">
            <div className="p-2.5 rounded-xl bg-[#1c180d] text-amber-400 border border-white/10">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-semibold text-[#faf7f0]">Smart Auto Top-up Trigger</p>
              <p className="text-[11px] text-[#a09c8f] font-medium">
                Auto reload $500 from ETH when card drops below $100
              </p>
            </div>
          </div>
          <button
            onClick={() => setAutoTopup(!autoTopup)}
            className={`w-12 h-6 rounded-full p-1 transition-colors ${
              autoTopup ? 'bg-amber-500' : 'bg-[#35322d]'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                autoTopup ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
