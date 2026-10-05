import React, { useState } from 'react';
import { Sparkles, Menu, X, Bot, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  onStartAnalysis: () => void;
  onOpenChat: () => void;
  activeSection: string;
  onOpenCostDashboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onStartAnalysis,
  onOpenChat,
  activeSection,
  onOpenCostDashboard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    if (id === 'cost-dashboard' && onOpenCostDashboard) {
      onOpenCostDashboard();
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-[#050814]/80 border-b border-indigo-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault();
              scrollTo('home');
            }}
            className="group flex items-center gap-2.5 text-slate-100 hover:text-white transition-colors"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 p-0.5 shadow-md shadow-purple-500/20 group-hover:shadow-purple-500/40 transition-shadow">
              <div className="w-full h-full bg-[#070b1c] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-purple-300 bg-clip-text text-transparent">
                SPlitZie
              </span>
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 font-semibold -mt-1">
                A friends app!
              </span>
            </div>
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
          <button
            onClick={() => scrollTo('home')}
            className={`transition-colors hover:text-purple-300 cursor-pointer ${
              activeSection === 'home' ? 'text-purple-400 font-semibold' : ''
            }`}
          >
            Home
          </button>
          <button
            onClick={() => scrollTo('analyze')}
            className={`transition-colors hover:text-purple-300 cursor-pointer ${
              activeSection === 'analyze' ? 'text-purple-400 font-semibold' : ''
            }`}
          >
            Analyze
          </button>
          <button
            onClick={() => scrollTo('cost-dashboard')}
            className={`transition-colors hover:text-purple-300 cursor-pointer ${
              activeSection === 'cost-dashboard' ? 'text-purple-400 font-semibold' : ''
            }`}
          >
            COST dashboard
          </button>
          <button
            onClick={() => scrollTo('alternatives')}
            className={`transition-colors hover:text-purple-300 cursor-pointer ${
              activeSection === 'alternatives' ? 'text-purple-400 font-semibold' : ''
            }`}
          >
            Budget Alternatives
          </button>
          <button
            onClick={() => scrollTo('about')}
            className={`transition-colors hover:text-purple-300 cursor-pointer ${
              activeSection === 'about' ? 'text-purple-400 font-semibold' : ''
            }`}
          >
            About
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="hidden sm:flex items-center gap-3">
          <button
            onClick={onOpenChat}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-900/80 hover:bg-slate-800/90 border border-slate-700/60 rounded-xl transition-all hover:text-white"
            title="Open AI Bill Assistant"
          >
            <Bot className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-mono">AI Assistant</span>
          </button>

          <button
            onClick={onStartAnalysis}
            className="glow-btn px-5 py-2 text-xs sm:text-sm font-semibold text-white rounded-xl shadow-lg cursor-pointer flex items-center gap-2 border border-purple-400/30"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Start Analysis</span>
          </button>
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={onStartAnalysis}
            className="glow-btn px-3 py-1.5 text-xs font-semibold text-white rounded-lg shadow-md border border-purple-400/30"
          >
            Analyze
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900/60 border border-slate-800"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-indigo-950/80 bg-[#070b1e]/95 px-4 pt-3 pb-5 space-y-3">
          <button
            onClick={() => scrollTo('home')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-purple-300"
          >
            Home
          </button>
          <button
            onClick={() => scrollTo('analyze')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-purple-300"
          >
            Analyze
          </button>
          <button
            onClick={() => scrollTo('cost-dashboard')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-purple-300"
          >
            COST dashboard
          </button>
          <button
            onClick={() => scrollTo('alternatives')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-purple-300"
          >
            Budget Alternatives
          </button>
          <button
            onClick={() => scrollTo('about')}
            className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-purple-300"
          >
            About
          </button>
          <div className="pt-2 flex items-center justify-between border-t border-slate-800/60">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenChat();
              }}
              className="flex items-center gap-2 py-2 text-xs font-mono text-purple-300"
            >
              <Bot className="w-4 h-4 text-purple-400" />
              SPlitZie AI Assistant
            </button>
            <div className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              Zero Dispute
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
