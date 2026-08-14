import React, { useState } from 'react';
import { SecurityLog } from '../types';
import { INITIAL_SECURITY_LOGS } from '../data/mockData';
import { ShieldCheck, Fingerprint, Activity } from 'lucide-react';

interface SecurityCenterProps {
  onToggleFreeze: () => void;
  isFrozen: boolean;
}

export const SecurityCenter: React.FC<SecurityCenterProps> = ({ onToggleFreeze, isFrozen }) => {
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);
  const [antiPhishingCode, setAntiPhishingCode] = useState('APEX-2026-X9');
  const [isEditingCode, setIsEditingCode] = useState(false);
  const [logs] = useState<SecurityLog[]>(INITIAL_SECURITY_LOGS);
  const [codeSaved, setCodeSaved] = useState(false);

  const handleSaveCode = () => {
    setIsEditingCode(false);
    setCodeSaved(true);
    setTimeout(() => setCodeSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="glass-card border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-[#ccff00] text-xs font-semibold uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Decentralized Security Vault</span>
          </div>
          <h2 className="dash-title text-xl text-[#faf7f0]">Security & Anti-Phishing Controls</h2>
          <p className="text-xs text-[#a09c8f] font-medium mt-0.5">
            Manage hardware biometric verification, security logs, and emergency card controls.
          </p>
        </div>

        <button
          onClick={onToggleFreeze}
          className={`px-5 py-2.5 rounded-full text-xs font-semibold border transition-all active:scale-95 shadow-md ${
            isFrozen
              ? 'bg-[#ccff00]/15 text-[#ccff00] border-[#ccff00]/40 hover:bg-[#ccff00]/20'
              : 'bg-[#ff5000]/15 text-[#ff5000] border-[#ff5000]/40 hover:bg-rose-500/30'
          }`}
        >
          {isFrozen ? 'Emergency Unlock Card' : 'Emergency Lock Card'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Anti-Phishing Code & Biometrics */}
        <div className="glass-card border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5">
          <h3 className="font-semibold text-base text-[#faf7f0] border-b border-white/10 pb-3">
            Authentication Policies
          </h3>

          {/* Biometric 2FA */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-black/40 border border-white/5">
            <div className="flex items-center gap-3.5">
              <div className="p-2.5 rounded-xl bg-[#1c180d] text-[#ccff00] border border-white/10">
                <Fingerprint className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-[#faf7f0]">Biometric Face ID / Touch ID</p>
                <p className="text-[11px] text-[#a09c8f] font-medium mt-0.5">Require hardware key for card transactions</p>
              </div>
            </div>
            <button
              onClick={() => setBiometricsEnabled(!biometricsEnabled)}
              className={`w-12 h-6 rounded-full p-1 transition-colors ${
                biometricsEnabled ? 'bg-[#ccff00]' : 'bg-[#35322d]'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  biometricsEnabled ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Anti-Phishing Code */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-[#faf7f0]">Anti-Phishing Security Code</p>
                <p className="text-[11px] text-[#a09c8f] font-medium mt-0.5">Verified code embedded in all official notifications</p>
              </div>
              <button
                onClick={() => setIsEditingCode(!isEditingCode)}
                className="text-xs text-[#ccff00] hover:underline font-bold"
              >
                {isEditingCode ? 'Cancel' : 'Edit Code'}
              </button>
            </div>

            {isEditingCode ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={antiPhishingCode}
                  onChange={(e) => setAntiPhishingCode(e.target.value)}
                  className="flex-1 glass-input rounded-xl px-3.5 py-2 text-xs font-mono focus:outline-none"
                />
                <button
                  onClick={handleSaveCode}
                  className="px-4 py-2 rounded-full trust-gradient font-semibold text-xs transition-all shadow-md"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center bg-[#1c180d]/80 p-3 rounded-xl border border-white/10 font-mono text-xs text-[#ccff00] font-semibold">
                <span>{antiPhishingCode}</span>
                {codeSaved && <span className="text-[#ccff00] text-[10px] font-bold">Updated!</span>}
              </div>
            )}
          </div>
        </div>

        {/* Security Audit Trail */}
        <div className="glass-card border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h3 className="font-semibold text-base text-[#faf7f0] flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#ccff00]" />
              <span>Real-Time Audit Trail</span>
            </h3>
            <span className="text-[10px] font-mono text-[#ccff00] bg-[#ccff00]/10 px-2.5 py-0.5 rounded-full border border-[#ccff00]/25 font-bold">
              Live Audited
            </span>
          </div>

          <div className="space-y-2.5">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-2xl bg-black/40 border border-white/5 text-xs font-mono space-y-1 hover:border-white/10 transition-all"
              >
                <div className="flex justify-between text-[#faf7f0] font-semibold">
                  <span>{log.event}</span>
                  <span className="text-[10px] text-[#a09c8f] font-medium">{log.timestamp}</span>
                </div>
                <div className="flex justify-between text-[11px] text-[#a09c8f]">
                  <span>Device: {log.device}</span>
                  <span>IP: {log.ipAddress}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
