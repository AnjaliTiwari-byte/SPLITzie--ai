import React, { useState } from 'react';
import { BillState, Friend } from '../types';
import { 
  Users, 
  Receipt, 
  Sparkles, 
  Plus, 
  X, 
  Percent, 
  Tag, 
  AlertCircle, 
  Utensils, 
  HelpCircle,
  Sliders,
  CheckCircle2,
  Crown,
  UserCheck
} from 'lucide-react';

interface BillFormProps {
  billState: BillState;
  onUpdateBillState: (newState: Partial<BillState>) => void;
  onCalculate: () => void;
  billInputRef: React.RefObject<HTMLInputElement | null>;
  peopleInputRef: React.RefObject<HTMLInputElement | null>;
  formError: string | null;
  onSetHighestPayer?: (friendId: string) => void;
  onUpdateFriend?: (friendId: string, updates: Partial<Friend>) => void;
}

const PRESET_OCCASIONS = [
  'Tech Fest Pizza Night 🍕',
  'Post-Hackathon Dinner 💻',
  'Hostel Weekend Hangout 🎸',
  'Farewell Party 🥂',
  'Project Celebration 🚀',
];

const PRESET_FOODS = [
  'Truffle Margherita Pizza',
  'Spicy Ramen Bowl',
  'Cheesy Loaded Nachos',
  'Craft Mocktails x4',
  'Garlic Breadsticks',
  'Chocolate Lava Cake',
];

export const BillForm: React.FC<BillFormProps> = ({
  billState,
  onUpdateBillState,
  onCalculate,
  billInputRef,
  peopleInputRef,
  formError,
  onSetHighestPayer,
  onUpdateFriend,
}) => {
  const [newFoodItem, setNewFoodItem] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [peopleInputStr, setPeopleInputStr] = useState<string>(String(billState.peopleCount));
  const [billInputStr, setBillInputStr] = useState<string>(
    billState.billAmount > 0 ? String(billState.billAmount) : ''
  );

  // Sync state when props change externally
  React.useEffect(() => {
    setPeopleInputStr(String(billState.peopleCount));
  }, [billState.peopleCount]);

  React.useEffect(() => {
    setBillInputStr(billState.billAmount > 0 ? String(billState.billAmount) : '');
  }, [billState.billAmount]);

  // Add food item tag
  const handleAddFoodItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFoodItem.trim()) return;
    if (!billState.foodItems.includes(newFoodItem.trim())) {
      onUpdateBillState({
        foodItems: [...billState.foodItems, newFoodItem.trim()],
      });
    }
    setNewFoodItem('');
  };

  const handleRemoveFoodItem = (itemToRemove: string) => {
    onUpdateBillState({
      foodItems: billState.foodItems.filter((item) => item !== itemToRemove),
    });
  };

  const handleAddPresetFood = (item: string) => {
    if (!billState.foodItems.includes(item)) {
      onUpdateBillState({
        foodItems: [...billState.foodItems, item],
      });
    }
  };

  // Change people count
  const handlePeopleChange = (newCount: number) => {
    const validCount = Math.max(1, Math.min(50, newCount));
    setPeopleInputStr(String(validCount));

    // Calculate current net total to set fair share on new friends immediately
    const subtotal = billState.billAmount;
    const tip = (subtotal * billState.tipPercent) / 100;
    const tax = (subtotal * billState.taxPercent) / 100;
    const netTotal = Math.max(0, subtotal + tip + tax - billState.discountAmount);
    const perPerson = validCount > 0 ? netTotal / validCount : 0;
    
    // Adjust friends array
    let updatedFriends = [...billState.friends];
    if (validCount > updatedFriends.length) {
      const colors = ['#818cf8', '#c084fc', '#38bdf8', '#34d399', '#f472b6', '#fbbf24', '#22d3ee', '#a78bfa'];
      for (let i = updatedFriends.length; i < validCount; i++) {
        updatedFriends.push({
          id: `friend-${i + 1}`,
          name: `Friend ${i + 1}`,
          avatarSeed: `friend_${i + 1}`,
          color: colors[i % colors.length],
          shareAmount: perPerson,
          sharePercentage: (1 / validCount) * 100,
          items: [],
          isPaid: false,
        });
      }
    } else if (validCount < updatedFriends.length) {
      updatedFriends = updatedFriends.slice(0, validCount);
    }

    // Rebalance all existing friends' shares in equal mode
    if (billState.splitMode === 'equal') {
      updatedFriends = updatedFriends.map((f) => ({
        ...f,
        shareAmount: perPerson,
        sharePercentage: (1 / validCount) * 100,
      }));
    }

    onUpdateBillState({
      peopleCount: validCount,
      friends: updatedFriends,
    });
  };

  return (
    <section id="analyze" className="py-12 sm:py-16 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center space-y-3 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-950/70 border border-indigo-500/30 text-xs font-mono text-cyan-300">
            <span>STEP 1: EXPENSE PARAMETERS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Configure Your Dinner Bill
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Input the occasion, total bill amount, number of friends, and dishes ordered. Our algorithm will balance the split with precision.
          </p>
        </div>

        {/* Glass Card Container */}
        <div className="glass-panel-elevated tech-bracket-card rounded-3xl p-6 sm:p-10 border border-purple-500/30 shadow-2xl relative overflow-hidden">
          {/* Subtle neon glow orbs */}
          <div className="absolute -top-24 -right-24 w-72 h-72 bg-purple-600/20 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-600/15 rounded-full blur-[90px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

          {/* Validation Error Banner */}
          {formError && (
            <div className="mb-8 p-4 rounded-2xl bg-rose-950/70 border border-rose-500/40 text-rose-200 flex items-start gap-3 shadow-lg">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold">Calculation Blocked</h4>
                <p className="text-xs text-rose-300 mt-0.5">{formError}</p>
              </div>
            </div>
          )}

          <div className="space-y-8">
            {/* Occasion Name */}
            <div className="space-y-3">
              <label htmlFor="occasion-name" className="block text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold">
                Occasion / Gathering Name
              </label>
              <div className="relative">
                <input
                  id="occasion-name"
                  type="text"
                  value={billState.occasionName}
                  onChange={(e) => onUpdateBillState({ occasionName: e.target.value })}
                  placeholder="e.g. Tech Fest Dinner, Hackathon Finals Feast..."
                  className="w-full glass-input px-4 py-3.5 rounded-xl text-white placeholder-slate-500 text-sm font-medium"
                />
              </div>

              {/* Preset occasion suggestions */}
              <div className="flex flex-wrap gap-2 pt-1">
                <span className="text-[11px] font-mono text-slate-400 py-1">Quick pick:</span>
                {PRESET_OCCASIONS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => onUpdateBillState({ occasionName: preset })}
                    className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                      billState.occasionName === preset
                        ? 'bg-purple-900/60 border-purple-400 text-white font-medium shadow-sm'
                        : 'bg-slate-900/40 border-slate-700/60 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Bill Amount & Currency & Number of People Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Bill Amount */}
              <div className="md:col-span-7 space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="bill-amount" className="text-xs font-mono uppercase tracking-wider text-cyan-300 font-semibold flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5" />
                    <span>Total Bill Amount</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">Must be positive</span>
                </div>

                <div className="flex rounded-xl overflow-hidden glass-input focus-within:ring-2 focus-within:ring-cyan-500/50">
                  {/* Currency selector */}
                  <select
                    value={billState.currency}
                    onChange={(e) => onUpdateBillState({ currency: e.target.value })}
                    className="bg-slate-900/80 px-3 py-3.5 text-cyan-300 font-mono text-sm border-r border-slate-700/60 outline-none cursor-pointer"
                    aria-label="Select currency"
                  >
                    <option value="$">$ USD</option>
                    <option value="₹">₹ INR</option>
                    <option value="€">€ EUR</option>
                    <option value="£">£ GBP</option>
                  </select>

                  <input
                    id="bill-amount"
                    ref={billInputRef}
                    type="text"
                    inputMode="decimal"
                    value={billInputStr}
                    onFocus={(e) => e.target.select()}
                    onChange={(e) => {
                      const raw = e.target.value;
                      // Allow numbers and single decimal point
                      if (/^[0-9]*\.?[0-9]*$/.test(raw)) {
                        setBillInputStr(raw);
                        const val = parseFloat(raw);
                        onUpdateBillState({ billAmount: isNaN(val) ? 0 : val });
                      }
                    }}
                    onBlur={() => {
                      if (billInputStr === '' || parseFloat(billInputStr) <= 0) {
                        setBillInputStr('');
                        onUpdateBillState({ billAmount: 0 });
                      } else {
                        const val = parseFloat(billInputStr);
                        setBillInputStr(String(val));
                        onUpdateBillState({ billAmount: val });
                      }
                    }}
                    placeholder="0.00"
                    className="w-full bg-transparent px-4 py-3.5 text-white placeholder-slate-500 text-lg font-mono font-semibold outline-none tabular-nums"
                  />
                </div>

                {/* Quick preset bill amounts */}
                <div className="flex flex-wrap gap-2 text-xs font-mono text-slate-300">
                  <span className="text-[11px] text-slate-500 py-1">Quick fill:</span>
                  {[50, 100, 150, 200, 300].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setBillInputStr(String(amt));
                        onUpdateBillState({ billAmount: amt });
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-900/70 hover:bg-purple-900/40 text-slate-300 hover:text-white border border-slate-700/60 text-[11px] cursor-pointer transition-all"
                    >
                      {billState.currency}{amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Number of People */}
              <div className="md:col-span-5 space-y-3">
                <div className="flex items-center justify-between">
                  <label htmlFor="people-count" className="text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    <span>Number of Friends</span>
                  </label>
                  <span className="text-xs font-mono text-purple-300 font-bold bg-purple-950/70 px-2 py-0.5 rounded border border-purple-500/30">
                    {billState.peopleCount} {billState.peopleCount === 1 ? 'Friend' : 'Friends'}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handlePeopleChange(billState.peopleCount - 1)}
                    disabled={billState.peopleCount <= 1}
                    className="w-12 h-12 rounded-xl bg-slate-900/90 hover:bg-purple-900/60 active:bg-purple-800 text-white font-bold border border-slate-700/80 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer transition-all text-xl shadow-md"
                    aria-label="Decrease friend count"
                  >
                    -
                  </button>

                  <div className="flex-1 glass-input rounded-xl flex items-center justify-center h-12 px-2 focus-within:ring-2 focus-within:ring-purple-500/60">
                    <input
                      id="people-count"
                      ref={peopleInputRef}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={peopleInputStr}
                      onFocus={(e) => e.target.select()}
                      onChange={(e) => {
                        const raw = e.target.value.replace(/[^0-9]/g, '');
                        setPeopleInputStr(raw);
                        if (raw !== '') {
                          const num = parseInt(raw, 10);
                          if (!isNaN(num) && num >= 1) {
                            handlePeopleChange(Math.min(50, num));
                          }
                        }
                      }}
                      onBlur={() => {
                        if (!peopleInputStr || parseInt(peopleInputStr, 10) < 1) {
                          setPeopleInputStr('1');
                          handlePeopleChange(1);
                        } else {
                          const num = Math.min(50, Math.max(1, parseInt(peopleInputStr, 10)));
                          setPeopleInputStr(String(num));
                          handlePeopleChange(num);
                        }
                      }}
                      className="w-full text-center bg-transparent font-mono text-xl sm:text-2xl font-black text-white outline-none tabular-nums"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => handlePeopleChange(billState.peopleCount + 1)}
                    disabled={billState.peopleCount >= 50}
                    className="w-12 h-12 rounded-xl bg-slate-900/90 hover:bg-purple-900/60 active:bg-purple-800 text-white font-bold border border-slate-700/80 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer transition-all text-xl shadow-md"
                    aria-label="Increase friend count"
                  >
                    +
                  </button>
                </div>

                {/* Range Slider for fast adjustment */}
                <div className="pt-1 px-1">
                  <input
                    type="range"
                    min="1"
                    max="20"
                    value={Math.min(20, billState.peopleCount)}
                    onChange={(e) => handlePeopleChange(parseInt(e.target.value, 10))}
                    className="w-full accent-purple-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
                    aria-label="Slider for friend count"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 pt-0.5">
                    <span>1</span>
                    <span>5</span>
                    <span>10</span>
                    <span>15</span>
                    <span>20+</span>
                  </div>
                </div>

                {/* Quick group sizes */}
                <div className="flex flex-wrap gap-1.5 text-[11px] font-mono pt-1">
                  {[2, 3, 4, 5, 6, 8, 10, 12].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => handlePeopleChange(count)}
                      className={`flex-1 min-w-[32px] py-1 rounded-lg text-center transition-all cursor-pointer border ${
                        billState.peopleCount === count
                          ? 'bg-purple-600 border-purple-400 text-white font-bold shadow-md'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                      }`}
                    >
                      {count}p
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Host / Primary Cardholder Selection */}
            <div className="space-y-3 pt-2 p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <label className="text-xs font-mono uppercase tracking-wider text-amber-300 font-semibold flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Who is Paying the Bill Upfront? (Host / Cardholder)</span>
                </label>
                <span className="text-[11px] font-mono text-amber-400/80">
                  Click any friend to crown them host or edit their name
                </span>
              </div>

              {/* Friends list chips with Host Crown & Rename */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {billState.friends.map((friend) => {
                  const isHost = friend.id === billState.highestPayerId;
                  return (
                    <div
                      key={friend.id}
                      onClick={() => onSetHighestPayer && onSetHighestPayer(friend.id)}
                      className={`p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                        isHost
                          ? 'bg-amber-950/80 border-amber-400 text-white shadow-lg ring-1 ring-amber-400/50'
                          : 'bg-slate-900/70 border-slate-800 text-slate-300 hover:border-slate-600'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <div
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-sm"
                          style={{ backgroundColor: friend.color }}
                        >
                          {friend.name.charAt(0)}
                        </div>

                        <input
                          type="text"
                          value={friend.name}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => onUpdateFriend && onUpdateFriend(friend.id, { name: e.target.value })}
                          className="bg-transparent text-xs font-bold text-white outline-none border-b border-transparent hover:border-slate-500 focus:border-amber-400 w-full truncate"
                          title="Click to rename this person"
                        />
                      </div>

                      {isHost ? (
                        <div className="flex items-center gap-1 shrink-0 text-amber-400">
                          <Crown className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="text-[10px] font-mono font-bold">HOST</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSetHighestPayer) onSetHighestPayer(friend.id);
                          }}
                          className="text-[10px] font-mono text-slate-400 hover:text-amber-300 hover:bg-slate-800 px-1.5 py-0.5 rounded transition-colors shrink-0"
                        >
                          Set
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Food items ordered (as requested in prompt) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono uppercase tracking-wider text-pink-300 font-semibold flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Food & Beverage Items Ordered</span>
                </label>
                <span className="text-[11px] font-mono text-slate-400">
                  {billState.foodItems.length} items tagged
                </span>
              </div>

              {/* Food tag input form */}
              <form onSubmit={handleAddFoodItem} className="flex gap-2">
                <input
                  type="text"
                  value={newFoodItem}
                  onChange={(e) => setNewFoodItem(e.target.value)}
                  placeholder="Type an item (e.g. Garlic Pizza, Ramen, Sodas) & press Enter..."
                  className="flex-1 glass-input px-4 py-2.5 rounded-xl text-white placeholder-slate-500 text-xs sm:text-sm font-medium"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-purple-900/80 hover:bg-purple-800 text-purple-200 hover:text-white rounded-xl text-xs font-semibold border border-purple-500/40 flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Item</span>
                </button>
              </form>

              {/* Tag Cloud */}
              {billState.foodItems.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {billState.foodItems.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-950/70 border border-indigo-700/40 text-xs text-indigo-200 shadow-sm"
                    >
                      <span>{item}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveFoodItem(item)}
                        className="text-indigo-400 hover:text-rose-300 transition-colors ml-0.5"
                        title="Remove item"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}

              {/* Common dish suggestions */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] font-mono text-slate-400 py-0.5">Popular dishes:</span>
                {PRESET_FOODS.map((dish) => (
                  <button
                    key={dish}
                    type="button"
                    onClick={() => handleAddPresetFood(dish)}
                    disabled={billState.foodItems.includes(dish)}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-slate-900/60 hover:bg-slate-800 text-slate-300 disabled:opacity-40 border border-slate-800 transition-colors"
                  >
                    + {dish}
                  </button>
                ))}
              </div>
            </div>

            {/* Toggle Advanced Adjustments: Tip, Tax, Discount */}
            <div className="pt-2 border-t border-indigo-950/80">
              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 text-xs font-mono text-purple-300 hover:text-purple-200 cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>{showAdvanced ? 'Hide' : 'Show'} Tip, Tax & Discount Options</span>
                <span className="text-[10px] text-slate-400">
                  (Tip: {billState.tipPercent}%, Tax: {billState.taxPercent}%, Discount: {billState.currency}{billState.discountAmount})
                </span>
              </button>

              {showAdvanced && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-4 mt-3 p-4 rounded-2xl bg-slate-950/50 border border-slate-800/80">
                  {/* Tip */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
                      <span>Tip Rate</span>
                      <span className="text-purple-400 font-bold">{billState.tipPercent}%</span>
                    </label>
                    <div className="flex gap-1">
                      {[0, 10, 15, 18, 20].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => onUpdateBillState({ tipPercent: t })}
                          className={`flex-1 py-1 text-xs rounded font-mono ${
                            billState.tipPercent === t
                              ? 'bg-purple-600 text-white font-bold'
                              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {t}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Tax */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
                      <span>Local Tax</span>
                      <span className="text-cyan-400 font-bold">{billState.taxPercent}%</span>
                    </label>
                    <div className="flex gap-1">
                      {[0, 5, 8.5, 12].map((tx) => (
                        <button
                          key={tx}
                          type="button"
                          onClick={() => onUpdateBillState({ taxPercent: tx })}
                          className={`flex-1 py-1 text-xs rounded font-mono ${
                            billState.taxPercent === tx
                              ? 'bg-cyan-600 text-white font-bold'
                              : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          {tx}%
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Discount / Voucher */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono text-slate-300 flex items-center justify-between">
                      <span>Discount / Voucher</span>
                      <span className="text-emerald-400 font-bold">
                        {billState.currency}{billState.discountAmount}
                      </span>
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min="0"
                        value={billState.discountAmount === 0 ? '' : billState.discountAmount}
                        onChange={(e) => {
                          const val = parseFloat(e.target.value);
                          onUpdateBillState({ discountAmount: isNaN(val) ? 0 : val });
                        }}
                        placeholder="0.00"
                        className="w-full glass-input px-3 py-1.5 rounded-lg text-white font-mono text-xs tabular-nums"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Split Mode Selector */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-indigo-950/40 border border-indigo-900/50">
              <div>
                <h4 className="text-sm font-semibold text-white">Split Methodology</h4>
                <p className="text-xs text-slate-300">
                  {billState.splitMode === 'equal'
                    ? 'Everyone pays an exact proportional share equally.'
                    : 'Personalize exact items and individual portions for each friend.'}
                </p>
              </div>

              <div className="flex p-1 bg-slate-900/90 rounded-xl border border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={() => onUpdateBillState({ splitMode: 'equal' })}
                  className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    billState.splitMode === 'equal'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Equal Split
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateBillState({ splitMode: 'custom' })}
                  className={`px-4 py-1.5 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                    billState.splitMode === 'custom'
                      ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Itemized / Candidate Profiles
                </button>
              </div>
            </div>

            {/* MAIN ACTION BUTTON: "Analyze My bill" / "split the cost" */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
              <button
                type="button"
                onClick={onCalculate}
                className="w-full sm:flex-1 glow-btn py-4 px-8 rounded-2xl text-white font-extrabold text-base tracking-wide flex items-center justify-center gap-3 shadow-2xl cursor-pointer border border-purple-400/40 group"
              >
                <Sparkles className="w-5 h-5 text-purple-200 group-hover:rotate-12 transition-transform" />
                <span>Analyze My Bill & Split the Cost</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
