import React, { useState } from 'react';
import { Restaurant, BillState } from '../types';
import { 
  Sparkles, 
  MapPin, 
  Percent, 
  TrendingDown, 
  Tag, 
  ExternalLink, 
  X, 
  Utensils, 
  ArrowRight,
  CheckCircle,
  Navigation
} from 'lucide-react';

// Import the generated images
import cyberBitesImg from '../assets/images/cyber_bites_bistro_1791094670857.jpg';
import quantumLoungeImg from '../assets/images/quantum_lounge_diner_1791094429969.jpg';
import byteBrewImg from '../assets/images/byte_brew_cafe_1791094443685.jpg';

interface AlternativeRestaurantsProps {
  billState: BillState;
}

export const AlternativeRestaurants: React.FC<AlternativeRestaurantsProps> = ({ billState }) => {
  const [selectedRestaurant, setSelectedRestaurant] = useState<Restaurant | null>(null);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // 3 Recommended Restaurants as requested
  const restaurants: Restaurant[] = [
    {
      id: 'rest-a',
      name: 'CyberBites Neon Bistro',
      matchPercentage: 96,
      location: 'Tech Park North, 4th Cross Avenue',
      distance: '0.4 miles away (6 min walk)',
      avgPerPerson: 14,
      savingsPercent: 32,
      cuisine: 'Cyber Gourmet & Fusion Bowls',
      image: cyberBitesImg,
      discountCode: 'TECHFEST30',
      popularItems: ['Hacker Truffle Burger', 'Cyber Cold Brew Float', 'Quantum Curly Fries', 'Spicy Kimchi Bao'],
      tagline: 'High-tech collegiate vibe with giant shared platters built for student budgets.',
    },
    {
      id: 'rest-b',
      name: 'The Quantum Lounge & Diner',
      matchPercentage: 91,
      location: 'College Avenue, University Square',
      distance: '0.8 miles away (10 min walk)',
      avgPerPerson: 18,
      savingsPercent: 24,
      cuisine: 'Woodfire Pizzas & Craft Sodas',
      image: quantumLoungeImg,
      discountCode: 'QUANTUM20',
      popularItems: ['Monster 20" Pepperoni Matrix', 'Loaded Cheddar Nachos', 'Nitro Berry Lemonade'],
      tagline: 'Cozy booths with neon ambient lighting and automatic split QR bill pay at each table.',
    },
    {
      id: 'rest-c',
      name: 'Byte & Brew College Cafe',
      matchPercentage: 88,
      location: 'Campus Plaza, Block B Ground Floor',
      distance: '0.2 miles away (3 min walk)',
      avgPerPerson: 9.5,
      savingsPercent: 46,
      cuisine: 'Student Wraps & Espresso Lounge',
      image: byteBrewImg,
      discountCode: 'CAMPUSBYTE',
      popularItems: ['Midnight Cheesy Melt', 'Overnight Espresso Shake', 'Crispy Falafel Roll', 'Choco Brownie Sundae'],
      tagline: 'The ultimate late-night hackathon hangout. Pocket-friendly combos with free campus Wi-Fi.',
    },
  ];

  const currentTotal = billState.billAmount > 0 ? billState.billAmount : 120;
  const currentPerPerson = billState.peopleCount > 0 ? currentTotal / billState.peopleCount : 24;

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <section id="alternatives" className="py-12 sm:py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <TrendingDown className="w-3.5 h-3.5" />
            <span>AI BUDGET OPTIMIZER</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Alternative Options for Lesser Bills
          </h2>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Enjoyed dinner but found the bill a bit steep? Here are 3 student-favorite culinary spots matched to your group&apos;s taste with significantly lighter tabs.
          </p>
        </div>

        {/* 3 Restaurant Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {restaurants.map((rest, index) => {
            const letter = String.fromCharCode(65 + index); // A, B, C
            const estimatedGroupCost = rest.avgPerPerson * billState.peopleCount;
            const estimatedSavings = Math.max(0, currentTotal - estimatedGroupCost);

            return (
              <div
                key={rest.id}
                onClick={() => setSelectedRestaurant(rest)}
                className="glass-panel tech-bracket-card hologram-shimmer rounded-3xl overflow-hidden border border-purple-500/25 hover:border-cyan-400/60 transition-all duration-300 flex flex-col justify-between cursor-pointer group shadow-2xl hover:-translate-y-1.5 hover:shadow-cyan-950/30"
              >
                {/* Image Banner with Match % Overlay */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-900">
                  <img
                    src={rest.image}
                    alt={rest.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#050814] via-[#050814]/40 to-transparent" />

                  {/* Match Percentage Chip */}
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-slate-950/85 border border-cyan-400/40 backdrop-blur-md flex items-center gap-1.5 shadow-lg">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      {rest.matchPercentage}% MATCH
                    </span>
                  </div>

                  {/* Restaurant Identifier Tag */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-purple-950/80 border border-purple-500/40 backdrop-blur-md">
                    <span className="text-[11px] font-mono font-bold text-purple-300">
                      Restaurant {letter}
                    </span>
                  </div>

                  {/* Distance pill at bottom of image */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1 text-[11px] font-mono text-slate-300 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>{rest.distance}</span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="text-[11px] font-mono text-purple-400 uppercase tracking-wider">
                      {rest.cuisine}
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {rest.name}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2">
                      {rest.tagline}
                    </p>
                  </div>

                  {/* Location as required by prompt */}
                  <div className="text-xs text-slate-400 flex items-start gap-1.5 pt-1 border-t border-slate-800/80">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <span className="truncate">{rest.location}</span>
                  </div>

                  {/* Price & Savings Metrics */}
                  <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/90 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] font-mono text-slate-400">ESTIMATED / PERSON</div>
                      <div className="text-base font-extrabold font-mono text-white tabular-nums">
                        ~{billState.currency}{rest.avgPerPerson.toFixed(2)}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] font-mono text-emerald-400">POTENTIAL SAVINGS</div>
                      <div className="text-sm font-bold font-mono text-emerald-400 tabular-nums">
                        Save ~{rest.savingsPercent}%
                      </div>
                    </div>
                  </div>

                  {/* Interactive Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRestaurant(rest);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-purple-900/40 text-purple-300 hover:text-white border border-purple-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer group-hover:border-purple-400"
                  >
                    <span>View Student Deals & Menu</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* MODAL FOR SELECTED RESTAURANT */}
        {selectedRestaurant && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-xl glass-panel-elevated rounded-3xl border border-purple-400/40 p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedRestaurant(null)}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white rounded-full bg-slate-900/80 border border-slate-700 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Header */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2.5 py-0.5 rounded-full border border-cyan-500/40 font-bold">
                    {selectedRestaurant.matchPercentage}% MATCH
                  </span>
                  <span className="text-xs font-mono text-purple-300">
                    {selectedRestaurant.distance}
                  </span>
                </div>
                <h3 className="text-2xl font-black text-white">{selectedRestaurant.name}</h3>
                <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{selectedRestaurant.location}</span>
                </p>
              </div>

              {/* Comparative Savings Simulation */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/60 to-indigo-950/60 border border-purple-500/30 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-purple-300">Tonight&apos;s Current Per-Person Average:</span>
                  <span className="text-slate-300 font-semibold">{billState.currency}{currentPerPerson.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-cyan-300">{selectedRestaurant.name} Estimate:</span>
                  <span className="text-cyan-300 font-bold">{billState.currency}{selectedRestaurant.avgPerPerson.toFixed(2)}</span>
                </div>
                <div className="pt-2 border-t border-purple-800/40 flex justify-between items-center">
                  <span className="text-xs text-white font-medium">Estimated Group Savings ({billState.peopleCount} Friends):</span>
                  <span className="text-sm font-extrabold font-mono text-emerald-400">
                    +{billState.currency}{Math.max(0, (currentPerPerson - selectedRestaurant.avgPerPerson) * billState.peopleCount).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Popular Menu Items */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-mono uppercase tracking-wider text-purple-300 font-semibold flex items-center gap-1.5">
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Student Favorite Dishes</span>
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {selectedRestaurant.popularItems.map((dish, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-200 flex items-center gap-2"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                      <span>{dish}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Student Coupon Code */}
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="text-[10px] font-mono text-slate-400">EXCLUSIVE TECH FEST CODE</div>
                  <div className="text-sm font-bold font-mono text-purple-300">
                    {selectedRestaurant.discountCode}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopyCode(selectedRestaurant.discountCode)}
                  className="px-3 py-1.5 rounded-lg bg-purple-900/70 hover:bg-purple-800 text-purple-200 text-xs font-mono border border-purple-500/40 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedCode === selectedRestaurant.discountCode ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Tag className="w-3.5 h-3.5" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRestaurant(null)}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg hover:from-purple-500 hover:to-indigo-500 transition-all cursor-pointer"
                >
                  Save Spot for Next Dinner Outing
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
