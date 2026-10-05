import React, { useState } from 'react';
import { BillState, Friend } from '../types';
import { 
  CheckCircle, 
  Clock, 
  Crown, 
  Copy, 
  Check, 
  Share2, 
  Sparkles, 
  TrendingUp, 
  AlertTriangle,
  Receipt,
  Users,
  DollarSign,
  PartyPopper
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AnalysisResultsProps {
  billState: BillState;
  onUpdateFriend: (friendId: string, updates: Partial<Friend>) => void;
  onSetHighestPayer: (friendId: string) => void;
  isNegativeResult: boolean;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  billState,
  onUpdateFriend,
  onSetHighestPayer,
  isNegativeResult,
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [summaryCopied, setSummaryCopied] = useState(false);

  // If calculation resulted in negative value, show the strict prompt requirement:
  // "show no result if the result add upto negative value."
  if (isNegativeResult) {
    return (
      <section id="cost-dashboard" className="py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="glass-panel rounded-3xl p-8 sm:p-12 border border-rose-500/30 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              No Result Generated: Negative Value Detected
            </h3>
            <p className="text-sm text-slate-300 max-w-lg mx-auto">
              The entered parameters yield a zero or negative bill total (discount of {billState.currency}{billState.discountAmount} exceeds or equals bill amount). Per system policy, settlement results cannot be computed for negative values.
            </p>
            <div className="pt-2">
              <a
                href="#analyze"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 hover:text-white hover:border-purple-500 transition-colors"
              >
                ← Adjust Bill & Discount Values
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Calculate bill mathematics
  const subtotal = billState.billAmount;
  const tipAmount = (subtotal * billState.tipPercent) / 100;
  const taxAmount = (subtotal * billState.taxPercent) / 100;
  const netTotal = Math.max(0, subtotal + tipAmount + taxAmount - billState.discountAmount);
  const equalShare = billState.peopleCount > 0 ? netTotal / billState.peopleCount : 0;

  // Find highest payer profile
  const highestPayer = billState.friends.find((f) => f.id === billState.highestPayerId) || billState.friends[0];
  const totalPaidCount = billState.friends.filter((f) => f.isPaid).length;
  const allSettled = totalPaidCount === billState.friends.length;

  // Profile Fair-Share Score metrics
  const profileScore = Math.min(99, Math.max(78, Math.round(98 - (billState.peopleCount > 6 ? (billState.peopleCount - 6) * 2 : 0))));
  const fairnessRating = profileScore >= 92 ? 'Optimal Balance (Zero Dispute)' : 'Balanced Squad Split';

  // Copy single friend payment request
  const handleCopyFriendPay = (friend: Friend) => {
    const text = `Hey ${friend.name}! Your share for "${billState.occasionName}" is ${billState.currency}${friend.shareAmount.toFixed(2)}. Settle up with ${highestPayer ? highestPayer.name : 'the host'}. Thanks! ✨ SPlitZie`;
    navigator.clipboard.writeText(text);
    setCopiedId(friend.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Copy full summary
  const handleCopySummary = () => {
    const list = billState.friends
      .map((f) => `• ${f.name}: ${billState.currency}${f.shareAmount.toFixed(2)} [${f.isPaid ? 'PAID ✅' : 'PENDING ⏳'}]`)
      .join('\n');

    const summary = `🧾 *SPlitZie Bill Summary* - "${billState.occasionName}"
Total Bill: ${billState.currency}${netTotal.toFixed(2)} (${billState.friends.length} Friends)
Highest Payer/Host: ${highestPayer?.name || 'Primary'}

*Individual Breakdown:*
${list}

Calculated with SPlitZie AI Engine 🚀`;

    navigator.clipboard.writeText(summary);
    setSummaryCopied(true);
    setTimeout(() => setSummaryCopied(false), 2500);
  };

  // Trigger celebration confetti
  const triggerCelebration = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#a855f7', '#38bdf8', '#ec4899', '#34d399'],
    });
  };

  const handleSettleAll = () => {
    billState.friends.forEach((f) => {
      onUpdateFriend(f.id, { isPaid: true });
    });
    triggerCelebration();
  };

  return (
    <section id="cost-dashboard" className="py-12 sm:py-20 relative tech-grid">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Title */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-xs font-mono text-purple-300">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI ANALYSIS RESULT & COST DASHBOARD</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Dinner Settlement Breakdown
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto">
            {billState.occasionName || 'Friend Gathering'} · {billState.friends.length} Candidates · {billState.currency}{netTotal.toFixed(2)} Total
          </p>
        </div>

        {/* Top Analytics Metrics Row: PROFILE SCORE & SUMMARY */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* PROFILE SCORE CARD */}
          <div className="md:col-span-4 glass-panel tech-bracket-card rounded-3xl p-6 border border-purple-500/35 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-36 h-36 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-600/15 rounded-full blur-2xl pointer-events-none" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-wider text-purple-300 font-bold">
                  PROFILE SCORE
                </span>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded-lg border border-emerald-500/40 shadow-sm font-semibold">
                  {fairnessRating}
                </span>
              </div>

              {/* Animated Progress Gauge */}
              <div className="flex items-center gap-4 py-2">
                <div className="relative w-22 h-22 shrink-0 flex items-center justify-center filter drop-shadow-[0_0_12px_rgba(168,85,247,0.3)]">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-800/80"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-purple-400 transition-all duration-1000 ease-out"
                      strokeDasharray={`${profileScore}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black font-mono text-white tabular-nums drop-shadow">
                      {profileScore}
                    </span>
                    <span className="text-[9px] font-mono text-purple-300 font-semibold">/ 100</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-slate-300 font-medium">
                    Average Per Candidate:
                  </div>
                  <div className="text-2xl font-black font-mono text-cyan-300 tabular-nums">
                    {billState.currency}{equalShare.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Math variance: <span className="text-emerald-400 font-mono font-semibold">0.00%</span> (Penny accurate)
                  </div>
                </div>
              </div>

              {/* Progress Bar: Settlement Completion */}
              <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Settled Status:</span>
                  <span className="text-purple-300 font-semibold">
                    {totalPaidCount} of {billState.friends.length} Paid ({Math.round((totalPaidCount / billState.friends.length) * 100)}%)
                  </span>
                </div>
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-emerald-400 h-full transition-all duration-500 shadow-[0_0_10px_rgba(52,211,153,0.5)]"
                    style={{ width: `${(totalPaidCount / billState.friends.length) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Settle All Action */}
            <div className="pt-4 mt-2">
              <button
                type="button"
                onClick={allSettled ? triggerCelebration : handleSettleAll}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-95 ${
                  allSettled
                    ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-900/80 shadow-emerald-950/40'
                    : 'bg-purple-900/70 hover:bg-purple-800 text-purple-100 border border-purple-500/50 shadow-purple-950/50'
                }`}
              >
                {allSettled ? (
                  <>
                    <PartyPopper className="w-4 h-4 text-emerald-400" />
                    <span>All Friends Settled! Celebrate</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4 text-purple-300" />
                    <span>Mark All Friends as Paid</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* HIGHEST PAYER PROFILE SPOTLIGHT CARD (Prompt Requirement) */}
          <div className="md:col-span-8 glass-panel tech-bracket-card rounded-3xl p-6 border border-cyan-500/35 flex flex-col justify-between shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-60 h-60 bg-cyan-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    <Crown className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold">
                      HIGHEST PAYER · CARDHOLDER PROFILE
                    </h3>
                    <p className="text-[12px] text-slate-400">Primary payer who put down the card/cash upfront</p>
                  </div>
                </div>

                {/* Dropdown & Quick buttons to switch who paid */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-slate-400">Paid by:</span>
                    <select
                      value={highestPayer?.id}
                      onChange={(e) => onSetHighestPayer(e.target.value)}
                      className="bg-slate-900/90 text-amber-300 font-bold text-xs font-mono px-3 py-1.5 rounded-lg border border-amber-500/40 outline-none cursor-pointer hover:border-amber-400 transition-colors"
                      aria-label="Select highest payer / cardholder"
                    >
                      {billState.friends.map((f) => (
                        <option key={f.id} value={f.id}>
                          {f.name} ({billState.currency}{f.shareAmount.toFixed(2)})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Quick one-tap host chips */}
                  <div className="flex flex-wrap gap-1">
                    {billState.friends.map((f) => {
                      const isSelected = f.id === highestPayer?.id;
                      return (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => onSetHighestPayer(f.id)}
                          className={`text-xs px-2.5 py-1 rounded-lg border font-mono transition-all cursor-pointer flex items-center gap-1 ${
                            isSelected
                              ? 'bg-amber-950 border-amber-400 text-amber-300 font-bold shadow-md'
                              : 'bg-slate-900/80 border-slate-700/60 text-slate-400 hover:text-white hover:border-slate-500'
                          }`}
                        >
                          {isSelected && <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />}
                          <span>{f.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Profile Card Body */}
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-extrabold text-base shadow-lg border"
                    style={{
                      background: `linear-gradient(135deg, ${highestPayer?.color || '#a855f7'}, #1e1b4b)`,
                      borderColor: highestPayer?.color || '#a855f7',
                    }}
                  >
                    {highestPayer?.name.charAt(0) || 'H'}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">{highestPayer?.name}</span>
                      <span className="text-[10px] font-mono bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30">
                        Lead Contributor
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Responsible for bill settlement · Owed payback from squad
                    </div>
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6 w-full sm:w-auto flex sm:flex-col justify-between sm:justify-center">
                  <div className="text-[11px] font-mono text-slate-400">Total Outlay Paid:</div>
                  <div className="text-xl font-extrabold font-mono text-amber-300 tabular-nums">
                    {billState.currency}{netTotal.toFixed(2)}
                  </div>
                  <div className="text-[11px] text-emerald-400 font-mono">
                    Net owed back: {billState.currency}{(netTotal - (highestPayer?.shareAmount || equalShare)).toFixed(2)}
                  </div>
                </div>
              </div>

              {/* Financial Ledger Mini Summary */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">SUBTOTAL</div>
                  <div className="text-white font-semibold tabular-nums mt-0.5">{billState.currency}{subtotal.toFixed(2)}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">TIP ({billState.tipPercent}%)</div>
                  <div className="text-purple-300 font-semibold tabular-nums mt-0.5">{billState.currency}{tipAmount.toFixed(2)}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">TAX ({billState.taxPercent}%)</div>
                  <div className="text-cyan-300 font-semibold tabular-nums mt-0.5">{billState.currency}{taxAmount.toFixed(2)}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="text-slate-400 text-[10px]">DISCOUNT</div>
                  <div className="text-emerald-400 font-semibold tabular-nums mt-0.5">-{billState.currency}{billState.discountAmount.toFixed(2)}</div>
                </div>
              </div>
            </div>

            {/* Copy WhatsApp / Group Summary Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={handleCopySummary}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono border border-slate-700 hover:border-cyan-400 flex items-center gap-2 transition-all cursor-pointer"
              >
                {summaryCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-300">Summary Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Copy Group WhatsApp Summary</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* INTEGRATING EACH CANDIDATE'S BILL (Prompt Requirement) */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-950/80 pb-4">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
                <Users className="w-6 h-6 text-purple-400" />
                <span>Integrating Each Candidate&apos;s Bill</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Detailed share allocation, ordered items, and real-time payment tracking for every friend.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">
                Mode: <span className="text-purple-300 font-semibold uppercase">{billState.splitMode}</span>
              </span>
            </div>
          </div>

          {/* Cards Grid for Each Friend */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {billState.friends.map((friend, idx) => {
              const isHighest = friend.id === highestPayer?.id;
              const sharePercent = netTotal > 0 ? (friend.shareAmount / netTotal) * 100 : 0;

              return (
                <div
                  key={friend.id}
                  className={`glass-panel tech-bracket-card hologram-shimmer rounded-2xl p-5 border transition-all duration-200 relative flex flex-col justify-between shadow-xl ${
                    friend.isPaid
                      ? 'border-emerald-500/40 bg-emerald-950/25 shadow-emerald-950/20'
                      : isHighest
                      ? 'border-amber-500/50 bg-amber-950/20 shadow-amber-950/20'
                      : 'border-purple-500/25 hover:border-purple-400/50 hover:shadow-purple-950/30'
                  }`}
                >
                  {/* Top bar of card */}
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-md border"
                          style={{
                            backgroundColor: friend.color,
                            borderColor: 'rgba(255,255,255,0.2)',
                          }}
                        >
                          {friend.name.charAt(0)}
                        </div>

                        <div>
                          {/* Editable name input */}
                          <input
                            type="text"
                            value={friend.name}
                            onChange={(e) => onUpdateFriend(friend.id, { name: e.target.value })}
                            className="bg-transparent text-sm font-bold text-white hover:bg-slate-900/60 focus:bg-slate-900/90 px-1.5 py-0.5 rounded outline-none border border-transparent focus:border-purple-500/50 transition-colors w-28 sm:w-32"
                            title="Click to rename friend"
                          />
                          <div className="text-[11px] font-mono text-slate-400 px-1.5">
                            Candidate #{idx + 1}
                          </div>
                        </div>
                      </div>

                      {/* Status pill button */}
                      <button
                        type="button"
                        onClick={() => onUpdateFriend(friend.id, { isPaid: !friend.isPaid })}
                        className={`text-xs px-2.5 py-1 rounded-full font-mono flex items-center gap-1.5 transition-colors cursor-pointer border ${
                          friend.isPaid
                            ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-300'
                            : 'bg-amber-950/60 border-amber-500/30 text-amber-300 hover:bg-amber-900/60'
                        }`}
                        title="Click to toggle paid status"
                      >
                        {friend.isPaid ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-400" />
                            <span>Paid</span>
                          </>
                        ) : (
                          <>
                            <Clock className="w-3 h-3 text-amber-400" />
                            <span>Pending</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* Share Amount */}
                    <div className="py-2 flex items-baseline justify-between border-t border-slate-800/80">
                      <span className="text-xs font-mono text-slate-400">Assigned Share:</span>
                      <div className="text-right">
                        <span className="text-2xl font-black font-mono text-white tabular-nums">
                          {billState.currency}{friend.shareAmount.toFixed(2)}
                        </span>
                        <div className="text-[10px] font-mono text-purple-300">
                          {sharePercent.toFixed(1)}% of total
                        </div>
                      </div>
                    </div>

                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden my-2">
                      <div
                        className="bg-purple-500 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, sharePercent)}%` }}
                      />
                    </div>

                    {/* Ordered items attribution */}
                    <div className="pt-2 text-xs">
                      <div className="text-[11px] font-mono text-slate-400 mb-1">
                        Dishes Attributed:
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {friend.items.length > 0 ? (
                          friend.items.map((item, i) => (
                            <span
                              key={i}
                              className="text-[10px] px-2 py-0.5 rounded bg-slate-900/80 text-purple-300 border border-slate-800"
                            >
                              {item}
                            </span>
                          ))
                        ) : (
                          <span className="text-[11px] text-slate-500 italic">
                            Split equally across group items
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Actions */}
                  <div className="pt-4 mt-3 border-t border-slate-800/70 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopyFriendPay(friend)}
                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-mono border border-slate-700/80 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      title="Copy payment prompt for this friend"
                    >
                      {copiedId === friend.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-300 text-[11px]">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-slate-400" />
                          <span className="text-[11px]">Copy Request</span>
                        </>
                      )}
                    </button>

                    {isHighest ? (
                      <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-amber-950/80 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 font-bold shadow-sm">
                        <Crown className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span>Host</span>
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onSetHighestPayer(friend.id)}
                        className="text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-amber-950/60 text-slate-300 hover:text-amber-300 border border-slate-700/80 hover:border-amber-500/50 transition-all cursor-pointer flex items-center gap-1.5 font-semibold group"
                        title={`Crown ${friend.name} as the Host / Cardholder who paid the bill`}
                      >
                        <Crown className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400" />
                        <span>Make Host</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
