import React, { useState, useRef, useEffect } from 'react';
import { BillState, Friend } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { BillForm } from './components/BillForm';
import { AnalysisResults } from './components/AnalysisResults';
import { AlternativeRestaurants } from './components/AlternativeRestaurants';
import { AboutSection } from './components/AboutSection';
import { AIChatbot } from './components/AIChatbot';

const INITIAL_FRIENDS: Friend[] = [
  {
    id: 'friend-1',
    name: 'Alex',
    avatarSeed: 'alex',
    color: '#818cf8',
    shareAmount: 42.24,
    sharePercentage: 25,
    items: ['Truffle Margherita Pizza', 'Garlic Bread'],
    isPaid: true,
    isHighestPayer: true,
  },
  {
    id: 'friend-2',
    name: 'Devin',
    avatarSeed: 'devin',
    color: '#c084fc',
    shareAmount: 42.24,
    sharePercentage: 25,
    items: ['Truffle Margherita Pizza', 'Craft Mocktails x4'],
    isPaid: false,
  },
  {
    id: 'friend-3',
    name: 'Maya',
    avatarSeed: 'maya',
    color: '#38bdf8',
    shareAmount: 42.24,
    sharePercentage: 25,
    items: ['Cheesy Loaded Nachos', 'Craft Mocktails x4'],
    isPaid: false,
  },
  {
    id: 'friend-4',
    name: 'Rohan',
    avatarSeed: 'rohan',
    color: '#34d399',
    shareAmount: 42.24,
    sharePercentage: 25,
    items: ['Cheesy Loaded Nachos', 'Garlic Bread'],
    isPaid: false,
  },
];

export default function App() {
  const [billState, setBillState] = useState<BillState>({
    occasionName: 'Tech Fest Pizza Feast 🍕',
    billAmount: 148.5,
    peopleCount: 4,
    tipPercent: 12,
    taxPercent: 8.5,
    discountAmount: 10,
    currency: '$',
    foodItems: [
      'Truffle Margherita Pizza',
      'Cheesy Loaded Nachos',
      'Craft Mocktails x4',
      'Garlic Bread',
    ],
    friends: INITIAL_FRIENDS,
    splitMode: 'equal',
    highestPayerId: 'friend-1',
  });

  const [hasCalculated, setHasCalculated] = useState(true);
  const [isNegativeResult, setIsNegativeResult] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  const billInputRef = useRef<HTMLInputElement | null>(null);
  const peopleInputRef = useRef<HTMLInputElement | null>(null);

  // Partial update helper with real-time math synchronization
  const handleUpdateBillState = (updates: Partial<BillState>) => {
    setBillState((prev) => {
      const next = { ...prev, ...updates };
      const subtotal = next.billAmount;
      const tip = (subtotal * next.tipPercent) / 100;
      const tax = (subtotal * next.taxPercent) / 100;
      const netTotal = subtotal + tip + tax - next.discountAmount;

      if (netTotal <= 0) {
        setIsNegativeResult(true);
      } else {
        setIsNegativeResult(false);
        if (next.splitMode === 'equal' && next.friends.length > 0) {
          const perPerson = netTotal / next.friends.length;
          next.friends = next.friends.map((f) => ({
            ...f,
            shareAmount: perPerson,
            sharePercentage: (1 / next.friends.length) * 100,
          }));
        }
      }
      return next;
    });
    setFormError(null);
  };

  // Update specific friend
  const handleUpdateFriend = (friendId: string, updates: Partial<Friend>) => {
    setBillState((prev) => ({
      ...prev,
      friends: prev.friends.map((f) => (f.id === friendId ? { ...f, ...updates } : f)),
    }));
  };

  // Set who is the highest payer / primary cardholder
  const handleSetHighestPayer = (friendId: string) => {
    setBillState((prev) => ({
      ...prev,
      highestPayerId: friendId,
      friends: prev.friends.map((f) => ({
        ...f,
        isHighestPayer: f.id === friendId,
        isPaid: f.id === friendId ? true : f.isPaid,
      })),
    }));
  };

  // Perform Calculation & Analysis
  const handleCalculate = () => {
    // 1. Validation
    if (isNaN(billState.billAmount) || billState.billAmount <= 0) {
      setFormError('Please enter a valid bill amount greater than zero.');
      setIsNegativeResult(true);
      return;
    }

    if (billState.peopleCount <= 0) {
      setFormError('Number of friends must be at least 1.');
      setIsNegativeResult(true);
      return;
    }

    // Mathematical check
    const subtotal = billState.billAmount;
    const tip = (subtotal * billState.tipPercent) / 100;
    const tax = (subtotal * billState.taxPercent) / 100;
    const netTotal = subtotal + tip + tax - billState.discountAmount;

    // Strict prompt requirement: "show no result if the result add upto negative value."
    if (netTotal <= 0) {
      setIsNegativeResult(true);
      setHasCalculated(true);
      setFormError(
        `Total adds up to a negative or zero value (${billState.currency}${netTotal.toFixed(
          2
        )}). Discount cannot exceed total bill.`
      );
      const target = document.getElementById('cost-dashboard');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
      return;
    }

    setIsNegativeResult(false);
    setFormError(null);

    // Distribute equal or customized split
    const count = billState.friends.length;
    const perPerson = netTotal / count;

    const updatedFriends = billState.friends.map((friend) => {
      const share = billState.splitMode === 'equal' ? perPerson : (friend.shareAmount > 0 ? friend.shareAmount : perPerson);
      return {
        ...friend,
        shareAmount: share,
        sharePercentage: (share / netTotal) * 100,
      };
    });

    setBillState((prev) => ({
      ...prev,
      friends: updatedFriends,
    }));

    setHasCalculated(true);

    // Smooth scroll to cost dashboard
    setTimeout(() => {
      const target = document.getElementById('cost-dashboard');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100);
  };

  // Settle all friends
  const handleSettleAll = () => {
    setBillState((prev) => ({
      ...prev,
      friends: prev.friends.map((f) => ({ ...f, isPaid: true })),
    }));
  };

  // Jump directly to Cost Dashboard
  const handleOpenCostDashboard = () => {
    setHasCalculated(true);
    const target = document.getElementById('cost-dashboard');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Quick jump actions from Hero
  const handleFocusPeople = () => {
    const el = document.getElementById('people-count');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus();
      (el as HTMLInputElement).select();
    } else {
      document.getElementById('analyze')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleFocusBill = () => {
    const el = document.getElementById('bill-amount');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.focus();
      (el as HTMLInputElement).select();
    } else {
      document.getElementById('analyze')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Observe active section for navbar highlight
  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'analyze', 'cost-dashboard', 'alternatives', 'about'];
      const scrollPos = window.scrollY + 200;

      for (const sec of sections) {
        const el = document.getElementById(sec);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sec);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#050814] text-slate-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-purple-200">
      {/* Top Navigation */}
      <Navbar
        onStartAnalysis={() => {
          const el = document.getElementById('analyze');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenCostDashboard={handleOpenCostDashboard}
        onOpenChat={() => setIsChatOpen(true)}
        activeSection={activeSection}
      />

      {/* Main Content Body */}
      <main className="flex-1">
        {/* 1. HERO SECTION */}
        <HeroSection
          billAmount={billState.billAmount}
          peopleCount={billState.peopleCount}
          currency={billState.currency}
          friends={billState.friends}
          highestPayerId={billState.highestPayerId}
          onFocusPeople={handleFocusPeople}
          onFocusBill={handleFocusBill}
          onSplitCost={handleCalculate}
        />

        {/* 2. ATTRACTIVE CONFIGURATION FORM */}
        <BillForm
          billState={billState}
          onUpdateBillState={handleUpdateBillState}
          onCalculate={handleCalculate}
          billInputRef={billInputRef}
          peopleInputRef={peopleInputRef}
          formError={formError}
          onSetHighestPayer={handleSetHighestPayer}
          onUpdateFriend={handleUpdateFriend}
        />

        {/* 3. AI ANALYSIS RESULT & COST DASHBOARD */}
        {hasCalculated && (
          <AnalysisResults
            billState={billState}
            onUpdateFriend={handleUpdateFriend}
            onSetHighestPayer={handleSetHighestPayer}
            isNegativeResult={isNegativeResult}
          />
        )}

        {/* 4. ALTERNATIVE OPTIONS FOR LESSER BILLS (3 Recommended Restaurant Cards) */}
        <AlternativeRestaurants billState={billState} />

        {/* 5. ABOUT SECTION & COLLEGE TECH FEST SHOWCASE */}
        <AboutSection />
      </main>

      {/* 6. FUNCTIONAL AI CHATBOT (SPlitZie AI) */}
      <AIChatbot
        billState={billState}
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onOpen={() => setIsChatOpen(true)}
        onUpdateBillState={handleUpdateBillState}
        onUpdateFriend={handleUpdateFriend}
        onSettleAll={handleSettleAll}
      />
    </div>
  );
}
