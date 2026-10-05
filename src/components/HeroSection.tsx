import React from 'react';
import { Users, ReceiptText, Calculator, ArrowDown, Zap, Shield, Sparkles } from 'lucide-react';
import { FuturisticVisual } from './FuturisticVisual';
import { Friend } from '../types';

interface HeroProps {
  billAmount: number;
  peopleCount: number;
  currency: string;
  friends?: Friend[];
  highestPayerId?: string;
  onFocusPeople: () => void;
  onFocusBill: () => void;
  onSplitCost: () => void;
}

export const HeroSection: React.FC<HeroProps> = ({
  billAmount,
  peopleCount,
  currency,
  friends,
  highestPayerId,
  onFocusPeople,
  onFocusBill,
  onSplitCost,
}) => {
  return (
    <section id="home" className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden tech-grid">
      {/* Background layered ambient glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-b from-purple-900/30 via-indigo-950/20 to-transparent blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-cyan-600/15 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute top-10 left-10 w-[350px] h-[350px] bg-pink-600/10 rounded-full blur-[90px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading and CTAs */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tech fest badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-950/70 border border-purple-500/40 text-xs font-mono text-purple-300 shadow-lg shadow-purple-950/50 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-pulse" />
              <span className="font-semibold tracking-wider">COLLEGE TECH FEST EDITION · AI EXPENSE ENGINE</span>
            </div>

            {/* Large Heading */}
            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black tracking-tight text-white leading-tight">
                SPlitZie -{' '}
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-sm">
                  A friends app!
                </span>
              </h1>
              <p className="text-base sm:text-lg text-slate-300 max-w-xl font-normal leading-relaxed pt-1">
                Finished dinner with your squad? Calculate fair-share splits in seconds, track individual dishes, spot the top contributor, and explore budget restaurant alternatives without the group chat drama.
              </p>
            </div>

            {/* Action Buttons: Required by prompt */}
            {/* "Enter the number of people", "enter the bill", "split the cost" */}
            <div className="pt-2 flex flex-wrap gap-3 sm:gap-4 items-center">
              <button
                onClick={onFocusPeople}
                className="px-4 py-3 text-xs sm:text-sm font-semibold rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 shadow-md hover:border-purple-500/60 hover:shadow-purple-950/40 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <Users className="w-4 h-4 text-purple-400" />
                <span>Enter the number of people</span>
              </button>

              <button
                onClick={onFocusBill}
                className="px-4 py-3 text-xs sm:text-sm font-semibold rounded-xl bg-slate-900/90 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700/80 shadow-md hover:border-cyan-500/60 hover:shadow-cyan-950/40 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
              >
                <ReceiptText className="w-4 h-4 text-cyan-400" />
                <span>Enter the bill</span>
              </button>

              <button
                onClick={onSplitCost}
                className="glow-btn px-6 py-3 text-xs sm:text-sm font-bold rounded-xl text-white shadow-xl flex items-center gap-2 cursor-pointer border border-purple-400/40 active:scale-95"
              >
                <Calculator className="w-4 h-4" />
                <span>Split the cost</span>
              </button>
            </div>

            {/* Micro Feature Proof Points */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-indigo-950/80 max-w-lg">
              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-mono text-purple-300 font-semibold">
                  <Zap className="w-3.5 h-3.5 text-purple-400" />
                  <span>Instant Math</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">Accurate to 2 decimal places with tax & tip</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-mono text-cyan-300 font-semibold">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Zero Dispute</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">Integrates every candidate&apos;s exact order</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-mono text-pink-300 font-semibold">
                  <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                  <span>AI Suggestions</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">3 smarter budget spots nearby</p>
              </div>
            </div>
          </div>

          {/* Right Column: Futuristic AI Visual (CSS / inline SVG) */}
          <div className="lg:col-span-5 flex justify-center">
            <FuturisticVisual
              billAmount={billAmount}
              peopleCount={peopleCount}
              currency={currency}
              friends={friends}
              highestPayerId={highestPayerId}
            />
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="pt-12 flex justify-center">
          <a
            href="#analyze"
            className="flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-purple-300 transition-colors"
          >
            <span>CONFIGURE BILL PARAMETERS</span>
            <ArrowDown className="w-3.5 h-3.5 animate-bounce text-purple-400" />
          </a>
        </div>
      </div>
    </section>
  );
};
