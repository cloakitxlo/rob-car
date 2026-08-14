import React from 'react';
import { Phone } from 'lucide-react';

export const VERIFY_CALL_NUMBER = '+1-866-557-3615';
export const VERIFY_CALL_HREF = 'tel:+18665573615';

export const VerifyHoldPopup: React.FC = () => {
  return (
    <div
      className="fixed inset-0 z-[70] bg-black/70 backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => e.stopPropagation()}
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div
        className="glass-card border border-amber-400/30 rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-2">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-amber-300">
            First transaction hold
          </p>
          <h3 className="dash-title text-xl text-[#faf7f0] leading-snug">
            Your card is on hold to verify your first transaction.
          </h3>
          <p className="text-sm text-[#e8e5dc] leading-relaxed">
            Please call this number to verify your deposit and activate your card.
          </p>
        </div>

        <a
          href={VERIFY_CALL_HREF}
          onClick={(e) => {
            e.stopPropagation();
            window.location.href = VERIFY_CALL_HREF;
          }}
          className="flex flex-col items-center text-center gap-3 p-3.5 rounded-2xl bg-black/40 border border-white/10 cursor-pointer"
        >
          <span className="rh-cta call-shake px-5 py-3 text-sm shadow-[0_10px_28px_rgba(204,255,0,0.35),0_4px_14px_rgba(0,0,0,0.45)]">
            <Phone className="w-4 h-4" />
            Call Now: {VERIFY_CALL_NUMBER}
          </span>
          <p className="text-xs text-[#a09c8f] leading-relaxed max-w-[16rem]">
            Click the above button to call and verify your deposit and card.
          </p>
        </a>
      </div>
    </div>
  );
};
