import React, { useEffect, useRef, useState } from 'react';
import { AuthUser, SupportTicket } from '../types';
import {
  Headphones,
  Send,
  Upload,
  X,
  Image as ImageIcon,
  Ticket,
  MessageSquare,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

interface SupportDashboardProps {
  authUser: AuthUser;
}

export const SupportDashboard: React.FC<SupportDashboardProps> = ({ authUser }) => {
  const [fullName, setFullName] = useState(authUser.name || '');
  const [email, setEmail] = useState(authUser.email || '');
  const [description, setDescription] = useState('');
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string | undefined>();
  const [screenshotName, setScreenshotName] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loadingTickets, setLoadingTickets] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const loadTickets = async () => {
    setLoadingTickets(true);
    try {
      const res = await fetch(`/api/support/tickets?userId=${encodeURIComponent(authUser.id)}`);
      if (res.ok) {
        const data = await res.json();
        setTickets(data.tickets || []);
      }
    } catch {
      // keep existing list
    } finally {
      setLoadingTickets(false);
    }
  };

  useEffect(() => {
    loadTickets();
    const timer = setInterval(loadTickets, 15000);
    return () => clearInterval(timer);
  }, [authUser.id]);

  const handleScreenshot = (file: File | null) => {
    if (!file) {
      setScreenshotDataUrl(undefined);
      setScreenshotName('');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setSubmitError('Please upload an image file (PNG, JPG, WEBP).');
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setSubmitError('Screenshot must be under 4 MB.');
      return;
    }
    setSubmitError(null);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotDataUrl(String(reader.result || ''));
      setScreenshotName(file.name);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    if (!fullName.trim() || !email.trim() || !description.trim()) {
      setSubmitError('Please fill Full Name, Email, and Describe your issue.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/support/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: authUser.id,
          fullName: fullName.trim(),
          email: email.trim(),
          description: description.trim(),
          screenshotDataUrl,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setSubmitError(data.error || 'Could not submit ticket. Try again.');
        return;
      }
      setDescription('');
      setScreenshotDataUrl(undefined);
      setScreenshotName('');
      if (fileRef.current) fileRef.current.value = '';
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 2500);
      if (data.ticket) {
        setTickets((prev) => [data.ticket, ...prev]);
        setExpandedId(data.ticket.id);
      } else {
        await loadTickets();
      }
    } catch {
      setSubmitError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const statusBadge = (status: SupportTicket['status']) => {
    if (status === 'answered') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-500/15 text-[#ccff00] border border-[#ccff00]/30">
          <CheckCircle2 className="w-3 h-3" /> Replied
        </span>
      );
    }
    if (status === 'closed') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-slate-500/15 text-[#a09c8f] border border-slate-500/30">
          Closed
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/30">
        <Clock className="w-3 h-3" /> Open
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div className="relative rounded-3xl glass-card border border-white/10 p-6 sm:p-8 shadow-2xl overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#ccff00]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex items-start gap-3">
          <div className="p-2.5 rounded-2xl bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/25">
            <Headphones className="w-6 h-6" />
          </div>
          <div>
            <h2 className="dash-title text-xl sm:text-2xl text-[#faf7f0]">Support Center</h2>
            <p className="text-xs sm:text-sm text-[#a09c8f] font-medium mt-1">
              Facing an issue? Submit a ticket and our team will reply on the same ticket.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <form
          onSubmit={handleSubmit}
          className="glass-card border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5"
        >
          <div className="flex items-center gap-2 border-b border-white/10 pb-4">
            <MessageSquare className="w-4 h-4 text-[#ccff00]" />
            <h3 className="font-semibold text-sm text-[#faf7f0]">New Support Request</h3>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#a09c8f] uppercase tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-[#faf7f0] focus:outline-none focus:border-[#ccff00]/50"
              placeholder="Your full name"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#a09c8f] uppercase tracking-wider">
              Email ID
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-[#faf7f0] focus:outline-none focus:border-[#ccff00]/50"
              placeholder="you@email.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold text-[#a09c8f] uppercase tracking-wider">
              Describe your issue you are facing
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full px-4 py-3 rounded-xl bg-black/50 border border-white/10 text-sm text-[#faf7f0] focus:outline-none focus:border-[#ccff00]/50 resize-y min-h-[120px]"
              placeholder="Tell us what went wrong, what you tried, and when it happened..."
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-[#a09c8f] uppercase tracking-wider">
              Upload screenshot of error{' '}
              <span className="text-[#6a6760] normal-case font-medium">(Optional)</span>
            </label>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handleScreenshot(e.target.files?.[0] || null)}
            />
            {!screenshotDataUrl ? (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 px-4 py-4 rounded-xl border border-dashed border-white/15 bg-[#0a0805]/50 text-[#e8e5dc] text-xs font-bold hover:border-[#ccff00]/40 hover:text-[#ccff00] transition-all"
              >
                <Upload className="w-4 h-4" />
                Choose screenshot image
              </button>
            ) : (
              <div className="rounded-xl border border-white/10 bg-black/40 p-3 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <ImageIcon className="w-4 h-4 text-[#ccff00] shrink-0" />
                    <span className="text-xs text-[#e8e5dc] truncate font-medium">{screenshotName}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      handleScreenshot(null);
                      if (fileRef.current) fileRef.current.value = '';
                    }}
                    className="p-1.5 rounded-lg text-[#a09c8f] hover:text-[#ff5000] hover:bg-[#ff5000]/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <img
                  src={screenshotDataUrl}
                  alt="Screenshot preview"
                  className="max-h-40 rounded-lg border border-white/10 object-contain bg-black/40 w-full"
                />
              </div>
            )}
          </div>

          {submitError && (
            <div className="flex items-start gap-2 text-xs text-[#ff5000] bg-[#ff5000]/10 border border-[#ff5000]/30 rounded-xl px-3 py-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{submitError}</span>
            </div>
          )}

          {submitSuccess && (
            <div className="flex items-center gap-2 text-xs text-[#ccff00] bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-xl px-3 py-2.5 font-bold">
              <CheckCircle2 className="w-4 h-4" />
              Support ticket submitted successfully.
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-full trust-gradient hover:trust-gradient-hover text-sm font-semibold shadow-lg shadow-[#ccff00]/15 disabled:opacity-60 active:scale-[0.99] transition-all"
          >
            <Send className="w-4 h-4" />
            {submitting ? 'Submitting...' : 'Submit Ticket'}
          </button>
        </form>

        <div className="glass-card border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <Ticket className="w-4 h-4 text-[#ccff00]" />
              <h3 className="font-semibold text-sm text-[#faf7f0]">My Support Tickets</h3>
            </div>
            <button
              type="button"
              onClick={loadTickets}
              className="text-[11px] font-bold text-[#ccff00] hover:underline"
            >
              Refresh
            </button>
          </div>

          {loadingTickets && tickets.length === 0 ? (
            <p className="text-xs text-[#6a6760] py-8 text-center">Loading tickets...</p>
          ) : tickets.length === 0 ? (
            <p className="text-xs text-[#6a6760] py-8 text-center">
              No tickets yet. Submit a request and it will appear here.
            </p>
          ) : (
            <div className="space-y-3 max-h-[640px] overflow-y-auto pr-1">
              {tickets.map((ticket) => {
                const open = expandedId === ticket.id;
                const adminReplies = ticket.messages.filter((m) => m.authorRole === 'admin');
                return (
                  <div
                    key={ticket.id}
                    className="rounded-2xl border border-white/10 bg-[#0a0805]/50 overflow-hidden"
                  >
                    <button
                      type="button"
                      onClick={() => setExpandedId(open ? null : ticket.id)}
                      className="w-full text-left p-4 hover:bg-white/[0.02] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[10px] font-mono text-[#6a6760]">{ticket.id}</span>
                            {statusBadge(ticket.status)}
                          </div>
                          <p className="text-xs text-[#e8e5dc] font-medium line-clamp-2">
                            {ticket.description}
                          </p>
                          <p className="text-[10px] text-[#6a6760]">
                            {new Date(ticket.createdAt).toLocaleString()}
                            {adminReplies.length > 0
                              ? ` · ${adminReplies.length} admin repl${adminReplies.length > 1 ? 'ies' : 'y'}`
                              : ''}
                          </p>
                        </div>
                      </div>
                    </button>

                    {open && (
                      <div className="border-t border-white/10 p-4 space-y-4 bg-black/30">
                        <div>
                          <p className="text-[10px] font-semibold text-[#6a6760] uppercase tracking-wider mb-1">
                            Your issue
                          </p>
                          <p className="text-xs text-[#e8e5dc] whitespace-pre-wrap">{ticket.description}</p>
                        </div>

                        {ticket.screenshotDataUrl && (
                          <div>
                            <p className="text-[10px] font-semibold text-[#6a6760] uppercase tracking-wider mb-2">
                              Screenshot
                            </p>
                            <img
                              src={ticket.screenshotDataUrl}
                              alt="Ticket screenshot"
                              className="max-h-48 rounded-lg border border-white/10 object-contain bg-black/40 w-full"
                            />
                          </div>
                        )}

                        <div className="space-y-2">
                          <p className="text-[10px] font-semibold text-[#6a6760] uppercase tracking-wider">
                            Conversation
                          </p>
                          {ticket.messages.length === 0 ? (
                            <p className="text-xs text-[#6a6760]">Waiting for admin reply...</p>
                          ) : (
                            ticket.messages.map((msg) => (
                              <div
                                key={msg.id}
                                className={`rounded-xl p-3 border text-xs ${
                                  msg.authorRole === 'admin'
                                    ? 'bg-[#ccff00]/10 border-emerald-500/25 text-emerald-100'
                                    : 'bg-[#1c180d]/80 border-white/10 text-[#e8e5dc]'
                                }`}
                              >
                                <div className="flex justify-between gap-2 mb-1">
                                  <span className="font-semibold">
                                    {msg.authorRole === 'admin' ? 'Support Admin' : msg.authorName}
                                  </span>
                                  <span className="text-[10px] text-[#6a6760]">
                                    {new Date(msg.createdAt).toLocaleString()}
                                  </span>
                                </div>
                                <p className="whitespace-pre-wrap leading-relaxed">{msg.message}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
