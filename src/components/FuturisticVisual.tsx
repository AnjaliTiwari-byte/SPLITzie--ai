import React, { useState } from 'react';
import { Friend } from '../types';

interface Props {
  billAmount: number;
  peopleCount: number;
  currency: string;
  friends?: Friend[];
  highestPayerId?: string;
}

export const FuturisticVisual: React.FC<Props> = ({
  billAmount,
  peopleCount,
  currency,
  friends = [],
  highestPayerId,
}) => {
  const [activeNode, setActiveNode] = useState<number | null>(null);

  const highestPayer = friends.find((f) => f.id === highestPayerId) || friends[0];

  // Derive dynamic orbital nodes from the actual friends list
  const nodePositions = [
    { x: 200, y: 70 },
    { x: 318, y: 155 },
    { x: 295, y: 295 },
    { x: 105, y: 295 },
    { x: 82, y: 155 },
  ];

  const defaultNames = ['Alex', 'Devin', 'Maya', 'Rohan', 'Sam'];
  const displayFriends = friends.length > 0 ? friends.slice(0, 5) : [];

  const nodes = nodePositions.map((pos, idx) => {
    const friend = displayFriends[idx];
    const isHost = friend ? friend.id === highestPayer?.id : idx === 0;
    const name = friend ? friend.name : defaultNames[idx % defaultNames.length];
    const color = friend ? friend.color : ['#a855f7', '#38bdf8', '#818cf8', '#ec4899', '#34d399'][idx];
    const shareAmt = friend ? friend.shareAmount : (billAmount / (peopleCount || 4));

    return {
      id: idx,
      label: isHost ? `👑 ${name}` : name,
      name,
      x: pos.x,
      y: pos.y,
      role: isHost ? 'Lead Cardholder' : 'Squad Member',
      color,
      isHost,
      share: shareAmt > 0 ? shareAmt.toFixed(2) : '0.00',
    };
  });

  const perPerson = peopleCount > 0 && billAmount > 0 ? (billAmount / peopleCount).toFixed(2) : '24.50';

  return (
    <div className="relative w-full max-w-[490px] aspect-square mx-auto flex items-center justify-center select-none group">
      {/* Layer 1: Ambient volumetric glow */}
      <div className="absolute inset-0 bg-gradient-to-tr from-purple-600/25 via-indigo-600/20 to-cyan-500/25 rounded-full blur-3xl -z-10 animate-pulse pointer-events-none" />
      <div className="absolute w-80 h-80 bg-blue-600/15 rounded-full blur-2xl -z-10 pointer-events-none" />
      <div className="absolute w-48 h-48 bg-purple-500/20 rounded-full blur-xl -z-10 pointer-events-none" />

      {/* Layer 2: Master High-Fidelity SVG Circuit Canvas */}
      <svg className="w-full h-full drop-shadow-2xl" viewBox="0 0 400 400" fill="none">
        <defs>
          {/* Neon Gradients */}
          <linearGradient id="orbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#c084fc" stopOpacity="0.7" />
            <stop offset="40%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="70%" stopColor="#38bdf8" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.8" />
          </linearGradient>

          <linearGradient id="pulseRay" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#e879f9" stopOpacity="0.9" />
            <stop offset="50%" stopColor="#818cf8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.3" />
          </linearGradient>

          <radialGradient id="coreRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#1e1b4b" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#070b1e" stopOpacity="0.98" />
          </radialGradient>

          <radialGradient id="hostGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#d97706" stopOpacity="0.2" />
          </radialGradient>

          {/* Precision Neon Glow Filters */}
          <filter id="ultraGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4.5" result="blur1" />
            <feGaussianBlur stdDeviation="9" result="blur2" />
            <feMerge>
              <feMergeNode in="blur2" />
              <feMergeNode in="blur1" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="softGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Cybernetic Circuit Trace Lines (Background Geometry) */}
        <g stroke="rgba(99, 102, 241, 0.14)" strokeWidth="1" fill="none">
          <path d="M 40,200 H 120 L 150,170" />
          <path d="M 360,200 H 280 L 250,230" />
          <path d="M 200,40 V 110" />
          <path d="M 200,360 V 290" />
          <path d="M 70,80 L 110,120 H 150" />
          <path d="M 330,80 L 290,120 H 250" />
          <path d="M 70,320 L 110,280 H 150" />
          <path d="M 330,320 L 290,280 H 250" />
        </g>

        {/* Concentric Rotating Radar Rings */}
        <circle
          cx="200"
          cy="200"
          r="170"
          stroke="url(#orbitGrad)"
          strokeWidth="1.2"
          strokeDasharray="5 7"
          className="animate-[spin_45s_linear_infinite] origin-center opacity-70"
        />
        <circle
          cx="200"
          cy="200"
          r="135"
          stroke="rgba(168, 85, 247, 0.28)"
          strokeWidth="1.5"
          className="animate-[spin_30s_linear_infinite_reverse] origin-center"
        />
        <circle
          cx="200"
          cy="200"
          r="105"
          stroke="rgba(56, 189, 248, 0.35)"
          strokeWidth="1"
          strokeDasharray="3 4"
        />

        {/* Radar Degree Tick Marks */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => {
          const rad = (deg * Math.PI) / 180;
          const x1 = 200 + 164 * Math.cos(rad);
          const y1 = 200 + 164 * Math.sin(rad);
          const x2 = 200 + 176 * Math.cos(rad);
          const y2 = 200 + 176 * Math.sin(rad);
          return (
            <line
              key={`tick-${deg}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(147, 197, 253, 0.45)"
              strokeWidth="1.5"
            />
          );
        })}

        {/* Dynamic Transaction Rays with Dual Flying Data Photons */}
        {nodes.map((node) => {
          const isTargeted = activeNode === node.id;
          return (
            <g key={`ray-${node.id}`}>
              {/* Outer Glow Line */}
              <line
                x1="200"
                y1="200"
                x2={node.x}
                y2={node.y}
                stroke={node.isHost ? 'rgba(245, 158, 11, 0.45)' : 'url(#pulseRay)'}
                strokeWidth={isTargeted ? '3' : '1.5'}
                strokeDasharray={isTargeted ? 'none' : '4 3'}
                className="transition-all duration-300"
              />

              {/* Primary Flying Data Photon (Outbound) */}
              <circle r="3" fill={node.isHost ? '#fbbf24' : node.color} filter="url(#ultraGlow)">
                <animateMotion
                  path={`M200,200 L${node.x},${node.y}`}
                  dur="2.2s"
                  repeatCount="indefinite"
                  begin={`${node.id * 0.4}s`}
                />
              </circle>

              {/* Secondary Inbound Photon (Settlement Feedback) */}
              <circle r="2" fill="#38bdf8" filter="url(#softGlow)">
                <animateMotion
                  path={`M${node.x},${node.y} L200,200`}
                  dur="2.8s"
                  repeatCount="indefinite"
                  begin={`${node.id * 0.4 + 1.1}s`}
                />
              </circle>
            </g>
          );
        })}

        {/* Peer Friend Nodes (Faceted Futuristic Chips) */}
        {nodes.map((node) => {
          const isHovered = activeNode === node.id;
          return (
            <g
              key={`node-${node.id}`}
              className="cursor-pointer transition-transform duration-300 group/node"
              onMouseEnter={() => setActiveNode(node.id)}
              onMouseLeave={() => setActiveNode(null)}
            >
              {/* Host Ambient Beacon if Host */}
              {node.isHost && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="30"
                  fill="url(#hostGlow)"
                  className="animate-pulse"
                />
              )}

              {/* Outer Hex/Circular Frame */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isHovered ? 25 : node.isHost ? 23 : 19}
                fill="rgba(7, 11, 28, 0.92)"
                stroke={node.isHost ? '#f59e0b' : node.color}
                strokeWidth={isHovered ? 2.8 : node.isHost ? 2.4 : 1.8}
                filter="url(#ultraGlow)"
                className="transition-all duration-200"
              />

              {/* Inner Pulsing Core */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isHovered ? 9 : 7}
                fill={node.isHost ? '#fbbf24' : node.color}
                className="transition-all duration-200"
              />

              {/* Center Letter Initial */}
              <text
                x={node.x}
                y={node.y + 3.5}
                textAnchor="middle"
                className="text-[9px] font-black font-mono fill-slate-950 pointer-events-none select-none"
              >
                {node.name.charAt(0)}
              </text>

              {/* Dynamic Name & Host Badge */}
              <g transform={`translate(${node.x}, ${node.y + 34})`}>
                <rect
                  x="-38"
                  y="-11"
                  width="76"
                  height="16"
                  rx="8"
                  fill="rgba(5, 8, 22, 0.88)"
                  stroke={node.isHost ? 'rgba(245, 158, 11, 0.5)' : 'rgba(139, 92, 246, 0.3)'}
                  strokeWidth="1"
                />
                <text
                  x="0"
                  y="1"
                  textAnchor="middle"
                  className={`text-[9.5px] font-mono font-bold tracking-wider ${
                    node.isHost ? 'fill-amber-300' : 'fill-slate-200'
                  }`}
                >
                  {node.label}
                </text>
              </g>

              {/* Hover Floating Tooltip HUD */}
              {isHovered && (
                <g transform={`translate(${node.x}, ${node.y - 36})`} className="animate-fadeIn">
                  <rect
                    x="-55"
                    y="-16"
                    width="110"
                    height="24"
                    rx="6"
                    fill="rgba(4, 7, 20, 0.95)"
                    stroke={node.color}
                    strokeWidth="1.5"
                    filter="url(#softGlow)"
                  />
                  <text
                    x="0"
                    y="-5"
                    textAnchor="middle"
                    className="text-[8.5px] font-mono fill-purple-300 font-bold uppercase tracking-wider"
                  >
                    {node.role}
                  </text>
                  <text
                    x="0"
                    y="5"
                    textAnchor="middle"
                    className="text-[10px] font-mono fill-white font-extrabold"
                  >
                    {currency}{node.share}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Central Core Holographic Hub (Quantum Financial Engine) */}
        <g className="cursor-pointer group/core" onClick={() => setActiveNode(null)}>
          {/* Outer Rotating Energy Ring */}
          <circle
            cx="200"
            cy="200"
            r="54"
            fill="none"
            stroke="#a855f7"
            strokeWidth="1.5"
            strokeDasharray="8 4"
            className="animate-[spin_16s_linear_infinite] origin-center opacity-80"
          />
          <circle
            cx="200"
            cy="200"
            r="50"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="1"
            strokeDasharray="4 6"
            className="animate-[spin_10s_linear_infinite_reverse] origin-center opacity-70"
          />

          {/* Central Reactor Ball */}
          <circle
            cx="200"
            cy="200"
            r="44"
            fill="url(#coreRadial)"
            stroke="#c084fc"
            strokeWidth="2"
            filter="url(#ultraGlow)"
            className="group-hover/core:stroke-cyan-300 transition-colors duration-300"
          />

          {/* Glowing Inner Accents */}
          <circle cx="200" cy="200" r="34" fill="none" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="1" />

          {/* Center Text Readout */}
          <text
            x="200"
            y="190"
            textAnchor="middle"
            className="text-[10px] font-mono fill-purple-300 font-extrabold uppercase tracking-widest"
          >
            SPlitZie AI
          </text>
          <text
            x="200"
            y="210"
            textAnchor="middle"
            className="text-[14px] font-mono font-black fill-cyan-300 tabular-nums drop-shadow-md"
          >
            {currency}{perPerson}
          </text>
          <text
            x="200"
            y="223"
            textAnchor="middle"
            className="text-[8px] font-mono fill-slate-400 tracking-widest uppercase font-semibold"
          >
            FAIR SHARE
          </text>
        </g>
      </svg>

      {/* Futuristic Floating Corner HUD Telemetry Badges */}
      <div className="absolute top-2 left-2 px-3.5 py-1.5 rounded-xl glass-panel text-[11px] font-mono text-cyan-300 flex items-center gap-2 border border-cyan-500/30 shadow-xl backdrop-blur-xl">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
        <span className="font-bold tracking-wider">HOST: {highestPayer?.name.toUpperCase()}</span>
      </div>

      <div className="absolute bottom-2 right-2 px-3.5 py-1.5 rounded-xl glass-panel text-[11px] font-mono text-purple-300 flex items-center gap-2 border border-purple-500/30 shadow-xl backdrop-blur-xl">
        <span className="w-2 h-2 rounded-full bg-emerald-400" />
        <span className="font-semibold tracking-wider">ZERO DISPUTE // ACTIVE</span>
      </div>
    </div>
  );
};
