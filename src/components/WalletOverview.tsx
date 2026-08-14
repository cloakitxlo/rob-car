import React, { useState } from 'react';
import { CryptoAsset } from '../types';
import { TrendingUp, Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, Copy, Check, Sparkles, ShieldCheck, AlertCircle } from 'lucide-react';

interface WalletOverviewProps {
  assets: CryptoAsset[];
  totalValueUsd: number;
  isCardActive?: boolean;
  onOpenTopup: () => void;
  onOpenSendReceive: (mode?: 'send' | 'receive') => void;
  onRefreshPrices: () => void;
  isRefreshing: boolean;
}

export const WalletOverview: React.FC<WalletOverviewProps> = ({
  assets,
  totalValueUsd,
  isCardActive = false,
  onOpenTopup,
  onOpenSendReceive,
  onRefreshPrices,
  isRefreshing,
}) => {

  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset>(assets[0] || assets[1]);
  const [copied, setCopied] = useState(false);

  const mockAddress = 'TEYgjP8nFzAbSX1qnH8iDVBd6UsZTpDnqC';

  const handleCopy = () => {
    navigator.clipboard.writeText(mockAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Above Total Portfolio Holdings */}
      {isCardActive ? (
        <div className="relative overflow-hidden rounded-2xl border-2 border-[#ccff00]/50 bg-gradient-to-r from-[#1c180d] via-[#35322d]/70 to-slate-950 p-4 shadow-xl shadow-[#ccff00]/15">
          <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-[#ccff00]/20 blur-2xl pointer-events-none" />
          <div className="relative flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#ccff00]/20 border border-[#ccff00]/40 text-[#ccff00] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#ccff00] mb-0.5">Card Status</p>
              <h3 className="text-sm sm:text-base font-semibold text-[#faf7f0]">Your card is active now</h3>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-2xl border-2 border-amber-400/45 bg-gradient-to-r from-amber-950 via-orange-950/55 to-slate-950 p-4 shadow-xl shadow-amber-500/15">
          <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-amber-400/20 blur-2xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 shrink-0 animate-pulse">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-300 mb-0.5 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3" />
                  Activation Required
                </p>
                <h3 className="text-sm sm:text-base font-semibold text-amber-50">
                  Deposit 11 USDT to activate your card
                </h3>
                <p className="text-xs text-amber-100/80 mt-1">
                  Please deposit first and enjoy your card.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => onOpenSendReceive('receive')}
              className="shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-semibold transition-all active:scale-95"
            >
              <ArrowDownLeft className="w-4 h-4" />
              Deposit Now
            </button>
          </div>
        </div>
      )}

      {/* Portfolio Value Summary Card */}
      <div className="relative rounded-3xl glass-card p-6 sm:p-8 shadow-2xl overflow-hidden border border-white/10">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#ccff00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b border-white/10 pb-6">
          <div>
            <div className="flex items-center gap-2 text-[#a09c8f] text-xs font-bold uppercase tracking-wider">
              <Wallet className="w-4 h-4 text-[#ccff00]" />
              <span>Total Portfolio Holdings</span>
            </div>
            <div className="flex items-baseline gap-3 mt-2">
              <h2 className="text-3xl sm:text-5xl font-semibold text-white tracking-tight font-mono">
                ${totalValueUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </h2>
              <span className="flex items-center gap-1 text-xs font-bold text-[#ccff00] bg-[#ccff00]/10 px-2.5 py-1 rounded-full border border-[#ccff00]/25">
                <TrendingUp className="w-3.5 h-3.5 text-[#ccff00]" />
                +3.24% 24h
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onOpenSendReceive('receive')}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full bg-[#1c180d]/90 hover:bg-[#35322d]/90 text-[#e8e5dc] text-xs font-bold border border-white/10 transition-all active:scale-95 shadow-md"
            >
              <ArrowDownLeft className="w-4 h-4 text-[#ccff00]" />
              <span>Receive / Deposit</span>
            </button>

            <button
              onClick={() => onOpenSendReceive('send')}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#1c180d]/90 hover:bg-[#35322d]/90 text-[#e8e5dc] text-xs font-bold border border-white/10 transition-all active:scale-95 shadow-md"
            >
              <ArrowUpRight className="w-4 h-4 text-[#ccff00]" />
              <span>Send Asset</span>
            </button>

            <button
              onClick={onOpenTopup}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full trust-gradient hover:trust-gradient-hover text-xs font-semibold shadow-lg shadow-[#ccff00]/15 transition-all active:scale-95"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>Card Top-up</span>
            </button>
          </div>
        </div>

        {/* Live Asset List */}
        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-semibold text-[#e8e5dc] tracking-wider uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ccff00]" />
              Connected Crypto Vaults
            </h3>
            <button
              onClick={onRefreshPrices}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#a09c8f] hover:text-[#ccff00] transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#ccff00]' : ''}`} />
              <span>{isRefreshing ? 'Updating Prices...' : 'Refresh Live Rates'}</span>
            </button>
          </div>

          <div className="space-y-3">
            {assets.map((asset) => {
              const isPositive = asset.change24h >= 0;
              return (
                <div
                  key={asset.id}
                  className="flex items-center justify-between p-4 rounded-2xl bg-black/40 hover:bg-[#1c180d]/80 border border-white/5 hover:border-[#ccff00]/30 transition-all group shadow-sm"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-[#1c180d] border border-white/10 flex items-center justify-center font-bold font-mono text-[#ccff00] group-hover:scale-105 group-hover:bg-[#ccff00]/10 transition-all">
                      {asset.symbol.slice(0, 3)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#faf7f0]">{asset.name}</span>
                        <span className="text-xs text-[#a09c8f] font-mono font-semibold">({asset.symbol})</span>
                      </div>
                      <p className="text-xs text-[#a09c8f] font-mono mt-0.5">
                        {asset.balance.toLocaleString('en-US', { maximumFractionDigits: 4 })} {asset.symbol}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-mono font-semibold text-sm text-[#faf7f0]">
                      ${asset.valueUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                    <div className="flex items-center justify-end gap-1.5 mt-0.5">
                      <span className="text-xs text-[#a09c8f] font-mono">
                        ${asset.priceUsd.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </span>
                      <span
                        className={`text-[11px] font-bold px-1.5 py-0.5 rounded font-mono ${
                          isPositive ? 'text-[#ccff00] bg-[#ccff00]/10 border border-[#ccff00]/25' : 'text-[#ff5000] bg-[#ff5000]/10 border border-rose-500/20'
                        }`}
                      >
                        {isPositive ? '+' : ''}
                        {asset.change24h.toFixed(2)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Deposit Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-md flex items-center justify-center p-4">
          <div className="glass-card border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-semibold text-[#faf7f0]">Deposit Digital Assets</h3>
              <button
                onClick={() => setShowDepositModal(false)}
                className="text-[#a09c8f] hover:text-white text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* Asset Selector */}
            <div>
              <label className="text-xs font-bold text-[#a09c8f] uppercase tracking-wider mb-2 block">
                Select Asset to Deposit
              </label>
              <div className="grid grid-cols-3 gap-2">
                {assets.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => setSelectedAsset(a)}
                    className={`p-2.5 rounded-xl border text-xs font-bold transition-all ${
                      selectedAsset.id === a.id
                        ? 'trust-gradient border-[#ccff00] shadow-md shadow-[#ccff00]/15'
                        : 'bg-[#1c180d]/60 border-white/10 text-[#e8e5dc] hover:bg-[#35322d]/80'
                    }`}
                  >
                    {a.symbol}
                  </button>
                ))}
              </div>
            </div>

            {/* QR Code & Address Display */}
            <div className="bg-black/55 p-6 rounded-2xl border border-white/10 text-center space-y-4">
              <div className="w-36 h-36 bg-white p-3 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                {/* Simulated QR Code Graphic */}
                <div className="w-full h-full border-2 border-slate-900 grid grid-cols-6 gap-1 p-1">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-xs ${
                        i % 2 === 0 || i % 5 === 0 ? 'bg-[#0a0805]' : 'bg-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-xs text-[#a09c8f] font-medium">
                    Your Personal {selectedAsset.name} ({selectedAsset.symbol}) Deposit Address
                  </p>
                  {copied && (
                    <span className="text-[10px] font-bold text-[#ccff00] bg-[#ccff00]/10 px-2 py-0.5 rounded-full border border-[#ccff00]/25">
                      Copied!
                    </span>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 p-3 bg-[#1c180d]/90 rounded-2xl border border-white/10 font-mono text-xs text-[#faf7f0]">
                  <span className="truncate pr-2 font-bold text-amber-400 text-center sm:text-left">{mockAddress}</span>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-2 shrink-0 border active:scale-95 ${
                      copied
                        ? 'bg-[#ccff00]/15 border-emerald-500 text-[#ccff00]'
                        : 'trust-gradient border-[#ccff00] hover:trust-gradient-hover shadow-md'
                    }`}
                    title="Copy deposit address"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#ccff00]" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Address</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-[#a09c8f] leading-relaxed text-center">
              Only send {selectedAsset.symbol} to this address. Sending any other asset may result in permanent loss.
            </p>

            <button
              onClick={() => setShowDepositModal(false)}
              className="w-full py-3 rounded-full bg-[#1c180d] hover:bg-[#35322d] text-[#e8e5dc] text-xs font-bold transition-all border border-white/10"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
