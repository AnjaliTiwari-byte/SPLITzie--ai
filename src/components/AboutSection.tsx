import React, { useState } from 'react';
import { ShieldCheck, Cpu, HeartHandshake, ChevronDown, ChevronUp, Sparkles, Terminal } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does SPlitZie guarantee zero dispute and penny-perfect accuracy?',
      a: 'SPlitZie uses an algorithmic Fair-Share Matrix. When total bills include taxes, tips, and fractional pennies, the engine distributes the residual cents in round-robin fashion so the sum of individual shares exactly equals the cardholder receipt without leftover cents.',
    },
    {
      q: 'Can we split unequal bills when someone only had a side salad?',
      a: 'Yes! Toggle to "Itemized / Candidate Profiles" mode. You can attach specific dishes (e.g. cocktails, special entrees) directly to the friends who enjoyed them, while common items like pizza or chips are shared equally.',
    },
    {
      q: 'What happens if a discount code or voucher makes the bill zero or negative?',
      a: 'Per our strict mathematical safety guidelines, the app detects if the net result is zero or negative. In that case, it flags "No Result Generated: Negative Value Detected" and blocks erroneous payment requests.',
    },
    {
      q: 'Why was this built for college tech festivals?',
      a: 'At hackathons and collegiate tech competitions, groups of 4 to 12 students frequently grab late-night pizza or celebratory dinners. Calculating tax, tips, and debt across different payment apps often takes 20 minutes of awkward debates. SPlitZie settles it in 5 seconds flat.',
    },
  ];

  return (
    <section id="about" className="py-12 sm:py-20 border-t border-indigo-950/80 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/70 border border-purple-500/30 text-xs font-mono text-purple-300">
            <Cpu className="w-3.5 h-3.5 text-purple-400" />
            <span>COLLEGE TECH FESTIVAL SHOWCASE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About SPlitZie
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            A frictionless bill settlement platform built to eliminate the awkwardness of post-dinner group calculations.
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel rounded-2xl p-6 border border-purple-500/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Zero-Dispute Protocol</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every candidate sees exactly what they owe, why, and which items contributed to their total. Absolute transparency for squads.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-cyan-500/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-900/60 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Dynamic AI Balancing</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Smart algorithms analyze group spending efficiency, highlight the primary payer, and provide tailored budget alternatives.
            </p>
          </div>

          <div className="glass-panel rounded-2xl p-6 border border-pink-500/20 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-pink-900/60 border border-pink-500/30 flex items-center justify-center text-pink-300">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Friendship Preservation</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Built-in WhatsApp reminder templates with respectful humor prevent delayed debts and keep collegiate friend squads intact.
            </p>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-4 pt-4">
          <h3 className="text-xl font-bold text-white text-center">Frequently Asked Questions</h3>
          <div className="space-y-3 max-w-3xl mx-auto">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="glass-panel rounded-2xl border border-slate-800 overflow-hidden transition-colors"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-purple-300 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-purple-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-8 text-center text-xs font-mono text-slate-500 border-t border-slate-900">
          <p>SPlitZie · A friends app! · Designed for College Technology Festivals & Dining Squads</p>
          <p className="text-[11px] text-slate-600 mt-1">Built with React, TypeScript & AI Logic</p>
        </div>
      </div>
    </section>
  );
};
