import React, { useState, useRef, useEffect } from 'react';
import { BillState, ChatMessage, ChatAction, Friend } from '../types';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  Copy, 
  Check, 
  Maximize2, 
  Minimize2, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  Dices, 
  ShieldAlert, 
  ArrowRight, 
  Zap, 
  PartyPopper,
  MessageCircle,
  HelpCircle,
  TrendingDown,
  DollarSign
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AIChatbotProps {
  billState: BillState;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  onUpdateBillState: (updates: Partial<BillState>) => void;
  onUpdateFriend: (friendId: string, updates: Partial<Friend>) => void;
  onSettleAll: () => void;
}

type ToneType = 'banter' | 'polite' | 'cyberpunk' | 'direct';

export const AIChatbot: React.FC<AIChatbotProps> = ({
  billState,
  isOpen,
  onClose,
  onOpen,
  onUpdateBillState,
  onUpdateFriend,
  onSettleAll,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedTone, setSelectedTone] = useState<ToneType>('banter');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [copiedMsgId, setCopiedMsgId] = useState<string | null>(null);
  const [actionDoneId, setActionDoneId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'reminders' | 'splits' | 'hacks' | 'roulette'>('all');
  const [rouletteWinner, setRouletteWinner] = useState<Friend | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Compute live bill context
  const subtotal = billState.billAmount;
  const tipAmount = (subtotal * billState.tipPercent) / 100;
  const taxAmount = (subtotal * billState.taxPercent) / 100;
  const netTotal = Math.max(0, subtotal + tipAmount + taxAmount - billState.discountAmount);
  const count = billState.peopleCount > 0 ? billState.peopleCount : 4;
  const share = (netTotal / count).toFixed(2);
  const highestPayer = billState.friends.find((f) => f.id === billState.highestPayerId) || billState.friends[0];
  const hostName = highestPayer?.name || 'the host';
  const unsettledFriends = billState.friends.filter((f) => !f.isPaid);

  // Initialize initial message on first mount
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'init-msg',
          sender: 'ai',
          text: `👋 Hey squad! I'm **SPlitZie AI**, your intelligent dinner settlement co-pilot.

I'm linked live to your **"${billState.occasionName}"** bill (${billState.currency}${netTotal.toFixed(2)} for ${count} friends, **${billState.currency}${share}** each).

What can I do for you right now?
• 📢 **Generate funny / polite WhatsApp reminders** for friends who haven't paid
• ⚖️ **Calculate complex splits** (drinks vs food, late arrivals, non-veg)
• 🎲 **Roll Tip Roulette** to randomly pick who covers the tip
• 💡 **Suggest student budget spots** to save money next time!`,
          timestamp: 'Just now',
          quickReplies: [
            'Generate funny WhatsApp reminder',
            'Who hasn\'t paid yet?',
            'How to split drinks separately?',
            'Roll Tip Roulette 🎲',
          ],
          actions: [
            {
              id: 'act-tip15',
              label: 'Set Tip to 15%',
              actionType: 'set_tip',
              payload: 15,
            },
            {
              id: 'act-roulette',
              label: '🎲 Spin Who Pays Tip',
              actionType: 'roll_tip_roulette',
            },
          ],
        },
      ]);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  // Voice speech synthesis
  const speakText = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;
    try {
      window.speechSynthesis.cancel();
      // Strip markdown asterisks and emojis for speech clarity
      const clean = text.replace(/[*#_`~]/g, '').replace(/[\u{1F600}-\u{1F64F}]/gu, '');
      const utterance = new SpeechSynthesisUtterance(clean.slice(0, 240));
      utterance.rate = 1.05;
      utterance.pitch = 1.0;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech synthesis failed or blocked by browser
    }
  };

  // Execute direct actions in applet
  const handleExecuteAction = (action: ChatAction) => {
    setActionDoneId(action.id);
    setTimeout(() => setActionDoneId(null), 2500);

    if (action.actionType === 'set_tip') {
      onUpdateBillState({ tipPercent: action.payload });
      const confirmMsg: ChatMessage = {
        id: `act-res-${Date.now()}`,
        sender: 'ai',
        text: `✅ Tip successfully set to **${action.payload}%**! Grand total is now **${billState.currency}${((subtotal * (1 + action.payload / 100 + billState.taxPercent / 100)) - billState.discountAmount).toFixed(2)}**.`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, confirmMsg]);
    } else if (action.actionType === 'mark_paid') {
      onUpdateFriend(action.payload, { isPaid: true });
      const friendObj = billState.friends.find((f) => f.id === action.payload);
      const confirmMsg: ChatMessage = {
        id: `act-res-${Date.now()}`,
        sender: 'ai',
        text: `🎉 Marked **${friendObj?.name || 'Friend'}** as PAID!`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, confirmMsg]);
    } else if (action.actionType === 'settle_all') {
      onSettleAll();
      const confirmMsg: ChatMessage = {
        id: `act-res-${Date.now()}`,
        sender: 'ai',
        text: `🚀 **All debts settled!** Every friend has paid up. Bill is completely closed.`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, confirmMsg]);
    } else if (action.actionType === 'add_food') {
      if (!billState.foodItems.includes(action.payload)) {
        onUpdateBillState({ foodItems: [...billState.foodItems, action.payload] });
      }
      const confirmMsg: ChatMessage = {
        id: `act-res-${Date.now()}`,
        sender: 'ai',
        text: `🍽️ Added **"${action.payload}"** to your ordered items list!`,
        timestamp: 'Just now',
      };
      setMessages((prev) => [...prev, confirmMsg]);
    } else if (action.actionType === 'roll_tip_roulette') {
      handleRollRoulette();
    }
  };

  // Spin Tip Roulette
  const handleRollRoulette = () => {
    if (billState.friends.length === 0) return;
    setIsSpinning(true);

    let counter = 0;
    const interval = setInterval(() => {
      const randomFriend = billState.friends[Math.floor(Math.random() * billState.friends.length)];
      setRouletteWinner(randomFriend);
      counter++;
      if (counter > 14) {
        clearInterval(interval);
        setIsSpinning(false);
        const finalWinner = billState.friends[Math.floor(Math.random() * billState.friends.length)];
        setRouletteWinner(finalWinner);
        confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 } });

        const rouletteMsg: ChatMessage = {
          id: `roulette-${Date.now()}`,
          sender: 'ai',
          text: `🎲 **TIP ROULETTE RESULT:**
🎯 **${finalWinner.name}** was chosen by the AI destiny matrix to cover tonight's tip (${billState.currency}${tipAmount.toFixed(2)})!

All other friends, buy ${finalWinner.name} a round of coffee tomorrow! ☕`,
          timestamp: 'Just now',
          quickReplies: ['Roll again! 🎲', 'Craft reminder for others'],
        };
        setMessages((prev) => [...prev, rouletteMsg]);
      }
    }, 90);
  };

  // Local semantic fallback generator with deep college-tailored intelligence
  const generateLocalResponse = (q: string): { text: string; actions?: ChatAction[] } => {
    const query = q.toLowerCase();

    // 1. WhatsApp Reminders
    if (query.includes('reminder') || query.includes('whatsapp') || query.includes('message') || query.includes('text') || query.includes('lazy')) {
      const namesList = unsettledFriends.map((f) => f.name).join(', ') || 'everyone';

      if (selectedTone === 'banter') {
        return {
          text: `Here is your **Meme & Banter WhatsApp Reminder** for ${namesList}:

"🚨 *URGENT SQUAD DISPATCH* 🍕
Dear ${namesList},
The food is digested, the hackathon slides are submitted, but your debt of *${billState.currency}${share}* to ${hostName} remains active in the blockchain of life! 😂
Please UPI/Venmo ${hostName} before they have to wash dishes at the restaurant kitchen!
Total: ${billState.currency}${share} | Occasion: "${billState.occasionName}"
Pay now or face 100 bugs in your next git push! 🐛✨"`,
          actions: [
            { id: 'act-copy1', label: '📋 Copy Banter Message', actionType: 'copy_text' },
            { id: 'act-settle-all', label: 'Mark All Settled', actionType: 'settle_all' },
          ],
        };
      } else if (selectedTone === 'cyberpunk') {
        return {
          text: `Here is your **Cyberpunk Tech Fest Reminder**:

"⚡ *PROTOCOL 404: UNSETTLED NODE TRANSACTION* ⚡
Target Nodes: ${namesList}
Host Gateway: ${hostName}
Amount Due: *${billState.currency}${share}*
Timestamp: Post-${billState.occasionName} Settlement
Please execute funds transfer immediately to clear peer-to-peer ledger invariants.
Zero-dispute handshake pending: [Venmo/UPI: ${highestPayer?.name || 'host'}] 🚀"`,
          actions: [{ id: 'act-copy2', label: '📋 Copy Cyber Message', actionType: 'copy_text' }],
        };
      } else if (selectedTone === 'direct') {
        return {
          text: `Here is a **Direct / Fast Venmo-Ready Reminder**:

"${billState.occasionName} Split: *${billState.currency}${share}* per person.
Please transfer to ${hostName} when you get a second. Thanks! 💸"`,
          actions: [{ id: 'act-copy3', label: '📋 Copy Direct Text', actionType: 'copy_text' }],
        };
      } else {
        // Polite
        return {
          text: `Here is your **Polite & Courteous Reminder**:

"Hey everyone! Hope you all had a wonderful time celebrating "${billState.occasionName}".
The final bill breakdown is *${billState.currency}${share}* each.
Whenever convenient today, please transfer your portion to ${hostName}.
Thank you all for coming! ✨"`,
          actions: [{ id: 'act-copy4', label: '📋 Copy Polite Text', actionType: 'copy_text' }],
        };
      }
    }

    // 2. Who owes / Unsettled status
    if (query.includes('who owes') || query.includes('paid') || query.includes('unsettled') || query.includes('pending') || query.includes('status')) {
      if (unsettledFriends.length === 0) {
        return {
          text: `🎉 **Good news! Every single candidate has paid!**
All ${count} friends in "${billState.occasionName}" are settled up with ${hostName}. Zero outstanding debts.`,
        };
      }

      const pendingRows = unsettledFriends
        .map((f) => `• **${f.name}**: owes **${billState.currency}${f.shareAmount.toFixed(2)}**`)
        .join('\n');

      return {
        text: `⏳ **Pending Settlement Status:**
${pendingRows}

Total pending for ${hostName}: **${billState.currency}${(unsettledFriends.reduce((acc, f) => acc + f.shareAmount, 0)).toFixed(2)}**.`,
        actions: unsettledFriends.slice(0, 2).map((f) => ({
          id: `act-pay-${f.id}`,
          label: `Mark ${f.name} Paid`,
          actionType: 'mark_paid',
          payload: f.id,
        })),
      };
    }

    // 3. Splitting drinks vs food
    if (query.includes('drinks') || query.includes('alcohol') || query.includes('mocktail') || query.includes('vegan') || query.includes('separate')) {
      return {
        text: `📊 **How to Fairly Split Drinks or Special Orders:**

1. **Step 1:** Separate the drink/cocktail items into their own subtotal.
2. **Step 2:** Only the friends who had drinks split that subtotal equally.
3. **Step 3:** The common food items (pizza, loaded nachos, fries, etc.) are split among all **${count}** friends.
4. **Step 4:** Switch to **"Itemized / Candidate Profiles"** mode in the form above and assign the exact dishes to each friend. SPlitZie calculates the exact tax & tip proportion automatically!`,
        actions: [
          {
            id: 'act-itemized',
            label: 'Add "Loaded Truffle Fries"',
            actionType: 'add_food',
            payload: 'Loaded Truffle Fries',
          },
        ],
      };
    }

    // 4. Tip advice
    if (query.includes('tip') || query.includes('gratuity') || query.includes('service')) {
      return {
        text: `💡 **College Squad Tipping Guide for ${count} People:**

• **10% (Budget / Casual)**: +${billState.currency}${(subtotal * 0.1).toFixed(2)} (+${billState.currency}${((subtotal * 0.1) / count).toFixed(2)}/person). Good for counters or food halls.
• **12% (Standard Current)**: +${billState.currency}${(subtotal * 0.12).toFixed(2)} (+${billState.currency}${((subtotal * 0.12) / count).toFixed(2)}/person). Balanced for sit-down casual dinners.
• **15% (Solid Friendly Service)**: +${billState.currency}${(subtotal * 0.15).toFixed(2)} (+${billState.currency}${((subtotal * 0.15) / count).toFixed(2)}/person). Standard for friendly waitstaff.
• **18-20% (Large Squad Table)**: +${billState.currency}${(subtotal * 0.2).toFixed(2)}. Best if they split separate plates or tolerated hackathon chaos!`,
        actions: [
          { id: 'act-tip10', label: 'Set 10%', actionType: 'set_tip', payload: 10 },
          { id: 'act-tip15', label: 'Set 15%', actionType: 'set_tip', payload: 15 },
          { id: 'act-tip18', label: 'Set 18%', actionType: 'set_tip', payload: 18 },
        ],
      };
    }

    // 5. Budget Alternatives
    if (query.includes('cheap') || query.includes('budget') || query.includes('alternative') || query.includes('lesser') || query.includes('save')) {
      return {
        text: `💰 **Best Budget Spot Matches for Your Squad:**

1. **Byte & Brew College Cafe**: ~$9.50/person (**Save ~46%**). Only 0.2 miles away in Campus Plaza. Great late-night study combos.
2. **CyberBites Neon Bistro**: ~$14.00/person (**Save ~32%**). Tech Park North. Massive shared burgers & kimchi bowls.
3. **The Quantum Lounge**: ~$18.00/person (**Save ~24%**). 20" pizza matrices that feed 4 for the price of 2!

Use coupon code **TECHFEST30** or **CAMPUSBYTE** in the Alternative Restaurants section below!`,
      };
    }

    // 6. Tip roulette
    if (query.includes('roulette') || query.includes('game') || query.includes('wheel') || query.includes('dice') || query.includes('random')) {
      return {
        text: `🎲 **Tip Roulette Activated!**
Ready to let fate decide who covers the ${billState.currency}${tipAmount.toFixed(2)} tip or buys the dessert? Click the button below to spin!`,
        actions: [
          { id: 'act-roulette-run', label: '🎲 Spin Who Pays Tip', actionType: 'roll_tip_roulette' },
        ],
      };
    }

    // Default intelligent answer
    return {
      text: `Got it! For your **"${billState.occasionName}"** gathering:
• **Total Bill:** ${billState.currency}${netTotal.toFixed(2)}
• **Per Person:** ${billState.currency}${share}
• **Primary Host:** ${hostName}
• **Outstanding:** ${unsettledFriends.length} friends pending

Need me to generate a payment reminder, test a custom split scenario, or roll the Tip Roulette?`,
      actions: [
        { id: 'act-remind-default', label: 'Generate WhatsApp Reminder', actionType: 'copy_text' },
        { id: 'act-spin-default', label: '🎲 Roll Tip Roulette', actionType: 'roll_tip_roulette' },
      ],
    };
  };

  // Main Send Function (with Server-side Gemini API call + fallback)
  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: 'Now',
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    try {
      // 1. Attempt Server-side Gemini API call via /api/chat
      const billContext = {
        occasionName: billState.occasionName,
        billAmount: billState.billAmount,
        currency: billState.currency,
        peopleCount: billState.peopleCount,
        tipPercent: billState.tipPercent,
        taxPercent: billState.taxPercent,
        discountAmount: billState.discountAmount,
        netTotal: netTotal.toFixed(2),
        sharePerPerson: share,
        highestPayerName: hostName,
        friendsList: billState.friends.map((f) => `${f.name} (${billState.currency}${f.shareAmount.toFixed(2)}, ${f.isPaid ? 'Paid' : 'Unpaid'})`).join(', '),
        foodItems: billState.foodItems.join(', '),
      };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          billContext,
          tone: selectedTone,
        }),
      });

      const data = await res.json();

      if (!data.useLocal && data.reply) {
        // Real Gemini Response
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.reply,
          timestamp: 'Just now',
          quickReplies: ['Generate funny WhatsApp reminder', 'Who hasn\'t paid yet?', 'Roll Tip Roulette 🎲'],
          actions: [
            { id: `act-t15-${Date.now()}`, label: 'Set Tip to 15%', actionType: 'set_tip', payload: 15 },
            { id: `act-roul-${Date.now()}`, label: '🎲 Spin Who Pays Tip', actionType: 'roll_tip_roulette' },
          ],
        };
        setMessages((prev) => [...prev, aiMsg]);
        speakText(data.reply);
      } else {
        // Local Intelligent Semantic Engine Fallback
        const local = generateLocalResponse(text);
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: local.text,
          timestamp: 'Just now',
          quickReplies: ['Who hasn\'t paid yet?', 'Roll Tip Roulette 🎲', 'Best budget spots nearby'],
          actions: local.actions,
        };
        setMessages((prev) => [...prev, aiMsg]);
        speakText(local.text);
      }
    } catch (err) {
      // Offline fallback
      const local = generateLocalResponse(text);
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: local.text,
        timestamp: 'Just now',
        actions: local.actions,
      };
      setMessages((prev) => [...prev, aiMsg]);
      speakText(local.text);
    } finally {
      setIsTyping(false);
    }
  };

  const handleCopyMessage = (msgId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMsgId(msgId);
    setTimeout(() => setCopiedMsgId(null), 2000);
  };

  const handleClearHistory = () => {
    setMessages([
      {
        id: 'reset-msg',
        sender: 'ai',
        text: `Chat reset! 🔄 I'm ready for new bill calculations or WhatsApp reminder templates for "${billState.occasionName}".`,
        timestamp: 'Just now',
        quickReplies: ['Generate funny WhatsApp reminder', 'Who hasn\'t paid?', 'Roll Tip Roulette 🎲'],
      },
    ]);
  };

  return (
    <>
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={onOpen}
          className="fixed bottom-5 right-5 z-40 px-4 py-3 rounded-2xl glow-btn text-white shadow-2xl flex items-center gap-2.5 border border-purple-400/40 cursor-pointer group hover:scale-105 transition-all"
          aria-label="Open SPlitZie AI Assistant"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-purple-200 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-cyan-400" />
          </div>
          <div className="flex flex-col text-left">
            <span className="font-mono text-xs font-extrabold tracking-wider text-white">
              SPlitZie AI
            </span>
            <span className="text-[10px] text-purple-300 font-mono -mt-0.5">
              Expense Co-Pilot
            </span>
          </div>
        </button>
      )}

      {/* Chat Window Modal */}
      {isOpen && (
        <div
          className={`fixed z-50 transition-all duration-300 glass-panel-elevated rounded-3xl border border-purple-400/30 shadow-2xl flex flex-col overflow-hidden animate-fadeIn ${
            isExpanded
              ? 'bottom-2 right-2 left-2 top-2 sm:bottom-4 sm:right-4 sm:left-auto sm:top-4 sm:w-[680px] sm:h-[92vh]'
              : 'bottom-4 right-4 w-[94vw] sm:w-[460px] h-[640px] max-h-[88vh]'
          }`}
        >
          {/* Header */}
          <div className="px-4 py-3 bg-slate-950/90 border-b border-indigo-950 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-indigo-600 to-cyan-400 p-0.5 shadow-md">
                <div className="w-full h-full bg-[#070b1e] rounded-[10px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-purple-300" />
                </div>
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <span>SPlitZie AI Co-Pilot</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </h4>
                <p className="text-[10px] font-mono text-purple-300">
                  College Tech Fest Expense Agent · Powered by Gemini
                </p>
              </div>
            </div>

            {/* Header controls: Voice, Clear, Expand, Close */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setVoiceEnabled(!voiceEnabled)}
                className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                  voiceEnabled ? 'text-cyan-400 hover:bg-slate-800' : 'text-slate-500 hover:bg-slate-800'
                }`}
                title={voiceEnabled ? 'Voice Read-Aloud: ON' : 'Voice Read-Aloud: OFF'}
              >
                {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              <button
                type="button"
                onClick={handleClearHistory}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                title="Reset conversation"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer hidden sm:block"
                title={isExpanded ? 'Minimize Window' : 'Expand Window'}
              >
                {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Mini Live Bill HUD Banner at top of chat */}
          <div className="px-4 py-2 bg-gradient-to-r from-purple-950/80 via-slate-900/90 to-indigo-950/80 border-b border-purple-900/40 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-2 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shrink-0" />
              <span className="text-slate-300 truncate font-semibold">
                {billState.occasionName}
              </span>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-slate-400 text-[11px]">Total: <strong className="text-white">{billState.currency}{netTotal.toFixed(2)}</strong></span>
              <span className="text-cyan-300 font-bold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-500/30">
                {billState.currency}{share}/p
              </span>
            </div>
          </div>

          {/* Tone Selector & Category Bar */}
          <div className="px-3 py-1.5 bg-slate-950/95 border-b border-indigo-950 flex items-center justify-between gap-1 overflow-x-auto">
            <div className="flex items-center gap-1 shrink-0">
              <span className="text-[10px] font-mono text-slate-500 uppercase mr-1">Tone:</span>
              {(['banter', 'polite', 'cyberpunk', 'direct'] as ToneType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTone(t)}
                  className={`text-[10px] font-mono px-2 py-0.5 rounded transition-all cursor-pointer capitalize ${
                    selectedTone === t
                      ? 'bg-purple-600 text-white font-bold shadow-sm'
                      : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleRollRoulette}
              disabled={isSpinning}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 hover:bg-amber-900/80 text-amber-300 border border-amber-500/30 flex items-center gap-1 shrink-0 cursor-pointer transition-colors"
            >
              <Dices className={`w-3 h-3 ${isSpinning ? 'animate-spin' : ''}`} />
              <span>Tip Roulette</span>
            </button>
          </div>

          {/* Messages Container */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 tech-grid">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-br-none shadow-lg font-medium'
                      : 'bg-slate-900/95 text-slate-200 border border-slate-700/70 rounded-bl-none shadow-xl whitespace-pre-line'
                  }`}
                >
                  {msg.text}

                  {/* Action Buttons embedded inside message */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="pt-3 mt-3 border-t border-slate-800 flex flex-wrap gap-2">
                      {msg.actions.map((act) => (
                        <button
                          key={act.id}
                          type="button"
                          onClick={() => {
                            if (act.actionType === 'copy_text') {
                              handleCopyMessage(msg.id, msg.text);
                            } else {
                              handleExecuteAction(act);
                            }
                          }}
                          className={`text-[11px] font-mono px-2.5 py-1.5 rounded-lg border flex items-center gap-1.5 transition-all cursor-pointer ${
                            actionDoneId === act.id
                              ? 'bg-emerald-950 text-emerald-300 border-emerald-500/50'
                              : 'bg-indigo-950/80 hover:bg-purple-900/60 text-purple-200 border-purple-500/40 hover:border-purple-400'
                          }`}
                        >
                          {actionDoneId === act.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span>Done!</span>
                            </>
                          ) : (
                            <>
                              <Zap className="w-3 h-3 text-cyan-400" />
                              <span>{act.label}</span>
                            </>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer bar for AI messages: Copy & Voice */}
                {msg.sender === 'ai' && (
                  <div className="flex items-center gap-3 mt-1 px-1">
                    <button
                      type="button"
                      onClick={() => handleCopyMessage(msg.id, msg.text)}
                      className="text-[10px] font-mono text-slate-400 hover:text-purple-300 flex items-center gap-1 py-0.5 transition-colors cursor-pointer"
                    >
                      {copiedMsgId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-300 font-semibold">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => speakText(msg.text)}
                      className="text-[10px] font-mono text-slate-400 hover:text-cyan-300 flex items-center gap-1 py-0.5 transition-colors cursor-pointer"
                      title="Read message aloud"
                    >
                      <Volume2 className="w-3 h-3" />
                      <span>Speak</span>
                    </button>

                    <span className="text-[9px] text-slate-500 font-mono">· {msg.timestamp}</span>
                  </div>
                )}

                {/* Quick replies */}
                {msg.quickReplies && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {msg.quickReplies.map((reply) => (
                      <button
                        key={reply}
                        type="button"
                        onClick={() => handleSend(reply)}
                        className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-950/70 hover:bg-purple-900/60 text-purple-300 border border-purple-800/50 hover:border-purple-400 transition-colors text-left cursor-pointer"
                      >
                        ⚡ {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 w-28">
                <span className="w-2 h-2 rounded-full bg-purple-400 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-pink-400 animate-bounce [animation-delay:0.4s]" />
                <span className="text-[10px] font-mono text-slate-400 ml-1">Thinking...</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Shortcuts Bar above input */}
          <div className="px-3 py-1.5 bg-slate-950/90 border-t border-slate-900 flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] font-mono text-slate-500 shrink-0">Prompts:</span>
            {[
              'Generate funny WhatsApp reminder',
              'Who owes the most?',
              'How to split drinks?',
              'Recommend student spots',
            ].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handleSend(p)}
                className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 shrink-0 cursor-pointer transition-colors"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-3 bg-slate-950 border-t border-indigo-950/80">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask SPlitZie AI (e.g. funny reminder, tip math, split drinks)..."
                className="flex-1 glass-input px-3.5 py-2.5 rounded-xl text-white placeholder-slate-500 text-xs font-medium outline-none focus:border-purple-400"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-2.5 rounded-xl glow-btn text-white disabled:opacity-40 transition-opacity cursor-pointer border border-purple-400/40"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
