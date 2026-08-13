import React, { useState } from 'react';
import { CryptoAsset } from '../types';
import { Zap, Check } from 'lucide-react';

interface SwapModalProps {
  assets: CryptoAsset[];
  onClose: () => void;
  onConfirmTopup: (assetId: string, amountUsd: number) => Promise<boolean>;
}

export const SwapModal: React.FC<SwapModalProps> = ({
  assets,
  onClose,
  onConfirmTopup,
}) => {
  const [selectedAsset, setSelectedAsset] = useState<CryptoAsset>(
    assets.find((a) => a.symbol.includes('USDT')) || assets[0]
  );
  const [topupAmountUsd, setTopupAmountUsd] = useState<string>('250');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const numericUsd = Number(topupAmountUsd) || 0;
  const cryptoNeeded = selectedAsset.priceUsd > 0 ? numericUsd / selectedAsset.priceUsd : 0;
  const isInsufficient = cryptoNeeded > selectedAsset.balance;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (numericUsd <= 0) {
      setErrorMsg('Please enter a valid top-up amount.');
      return;
    }
    if (isInsufficient) {
      setErrorMsg(`Insufficient ${selectedAsset.symbol} balance.`);
      return;
    }

    setErrorMsg(null);
    setLoading(true);

    try {
      const ok = await onConfirmTopup(selectedAsset.id, numericUsd);
      if (ok) {
        setSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1800);
      } else {
        setErrorMsg('Top-up failed. Please check your network and balance.');
      }
    } catch (err) {
      setErrorMsg('Unexpected error during card top-up.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/55 backdrop-blur-md flex items-center justify-center p-4">
      <div className="glass-card border border-white/10 rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex justify-between items-center border-b border-white/10 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/25">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="dash-title text-base text-[#faf7f0]">Top Up Card Balance</h3>
          </div>
          <button onClick={onClose} className="text-[#a09c8f] hover:text-white text-sm font-bold">
            ✕
          </button>
        </div>

        {success ? (
          <div className="text-center py-6 space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] flex items-center justify-center mx-auto">
              <Check className="w-6 h-6 text-[#ccff00]" />
            </div>
            <h4 className="text-base font-semibold text-[#faf7f0]">Card Balance Reloaded!</h4>
            <p className="text-xs text-[#a09c8f] font-medium">
              Added ${numericUsd.toFixed(2)} USD to your card from {cryptoNeeded.toFixed(4)} {selectedAsset.symbol}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Asset Selection */}
            <div>
              <label className="text-xs font-semibold text-[#e8e5dc] uppercase tracking-wider block mb-2">
                Source Crypto Asset
              </label>
              <div className="grid grid-cols-3 gap-2">
                {assets.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => setSelectedAsset(a)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedAsset.id === a.id
                        ? 'bg-[#ccff00]/10 border-[#ccff00] text-[#ccff00] font-bold shadow-md'
                        : 'bg-[#1c180d]/60 border-white/5 text-[#e8e5dc] hover:bg-[#35322d]'
                    }`}
                  >
                    <div className="font-semibold text-xs">{a.symbol}</div>
                    <div className="text-[10px] text-[#a09c8f] font-mono mt-0.5">
                      {a.balance.toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input USD Amount */}
            <div className="bg-black/55 p-4 rounded-2xl border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#a09c8f] font-bold">Top-up Amount (USD)</span>
                <span className="text-[#a09c8f] font-mono text-[11px]">
                  Rate: 1 {selectedAsset.symbol} = ${selectedAsset.priceUsd.toLocaleString()}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-2xl font-semibold text-[#faf7f0] font-mono">$</span>
                <input
                  type="number"
                  value={topupAmountUsd}
                  onChange={(e) => setTopupAmountUsd(e.target.value)}
                  placeholder="250"
                  className="w-full bg-transparent font-mono text-2xl font-semibold text-[#ccff00] focus:outline-none"
                />
              </div>

              {/* Quick preset buttons */}
              <div className="flex gap-2 pt-2 border-t border-white/5">
                {['50', '100', '250', '500', '1000'].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setTopupAmountUsd(preset)}
                    className="px-2.5 py-1 rounded-lg bg-[#1c180d] hover:bg-[#35322d] text-[#e8e5dc] text-xs font-mono font-bold border border-white/10"
                  >
                    ${preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Crypto Deduction Calculation */}
            <div className="bg-black/30 p-3.5 rounded-2xl border border-white/5 text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-[#a09c8f]">
                <span>Crypto Deducted:</span>
                <span className="text-[#faf7f0] font-bold">
                  {cryptoNeeded.toFixed(6)} {selectedAsset.symbol}
                </span>
              </div>
              <div className="flex justify-between text-[#a09c8f]">
                <span>Network FX Markup:</span>
                <span className="text-[#ccff00] font-bold">0.00% (Zero Fee)</span>
              </div>
            </div>

            {errorMsg && (
              <p className="text-xs text-[#ff5000] bg-[#ff5000]/10 p-3 rounded-xl border border-rose-500/20 font-bold">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || isInsufficient}
              className={`w-full py-3.5 rounded-full font-semibold text-xs transition-all shadow-lg ${
                isInsufficient
                  ? 'bg-[#1c180d] text-[#6a6760] border border-white/5 cursor-not-allowed'
                  : 'trust-gradient shadow-[#ccff00]/15 active:scale-95'
              }`}
            >
              {loading
                ? 'Processing Transaction...'
                : isInsufficient
                ? `Insufficient ${selectedAsset.symbol}`
                : `Confirm $${numericUsd.toFixed(2)} Top-up`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
