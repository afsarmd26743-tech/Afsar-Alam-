/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShieldCheck, 
  Clock, 
  HelpCircle,
  Activity
} from 'lucide-react';
import { motion } from 'motion/react';

interface RetailMetricsProps {
  balance: number;
  equity: number;
  todayPnl: number;
  todayPnlPercent: number;
  marginLevel: number;
  isDark: boolean;
}

export default function RetailMetrics({
  balance,
  equity,
  todayPnl,
  todayPnlPercent,
  marginLevel,
  isDark,
}: RetailMetricsProps) {
  const isPnlPositive = todayPnl >= 0;

  const cards = [
    {
      id: "retail-balance-card",
      label: "Live Balance",
      value: `$${balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: DollarSign,
      desc: "Simulated available ledger balance",
      color: "text-blue-600 bg-blue-50"
    },
    {
      id: "retail-equity-card",
      label: "Account Equity",
      value: `$${equity.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: ShieldCheck,
      desc: "Balance + real-time open positions P&L",
      color: "text-emerald-600 bg-emerald-50"
    },
    {
      id: "retail-pnl-card",
      label: "Today's Return",
      value: `${isPnlPositive ? '+' : ''}$${todayPnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}`,
      icon: isPnlPositive ? TrendingUp : TrendingDown,
      desc: `${todayPnlPercent.toFixed(2)}% net change from yesterday`,
      color: isPnlPositive ? "text-emerald-600 bg-emerald-50" : "text-rose-600 bg-rose-50"
    },
    {
      id: "retail-margin-card",
      label: "Margin Level (Safety)",
      value: `${marginLevel.toFixed(0)}%`,
      icon: Activity,
      desc: marginLevel > 500 ? "Highly Secure Status" : "Reduce exposure risk",
      color: "text-indigo-605 bg-indigo-50"
    }
  ];

  return (
    <div id="retail-metrics-wrapper" className="space-y-6 select-none">
      
      {/* Top Cards Bar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              id={card.id}
              key={card.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className={`rounded-2xl border p-5 transition-shadow hover:shadow-md ${
                isDark 
                  ? 'bg-[#111827] border-gray-805 text-white' 
                  : 'bg-white border-gray-200 text-gray-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-mono uppercase tracking-wider opacity-60">
                  {card.label}
                </span>
                <div className={`p-2 rounded-xl text-xs font-bold leading-none ${
                  isDark ? 'bg-gray-800 text-gray-200' : card.color
                }`}>
                  <Icon className="h-4 w-4" />
                </div>
              </div>
              
              <h3 className="font-display font-bold text-xl sm:text-2xl tracking-tight mb-1 select-all">
                {card.value}
              </h3>
              
              <p className="text-[10px] opacity-50 font-mono tracking-tight leading-tight">
                {card.desc}
              </p>
            </motion.div>
          );
        })}
      </div>

      {/* Account Performance graph section for retail users */}
      <div className={`p-5 rounded-2xl border ${
        isDark ? 'bg-[#111827] border-gray-805 text-white' : 'bg-white border-gray-200 text-gray-800'
      }`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h4 className="font-display font-semibold text-xs tracking-wide uppercase opacity-75">
              Prop Account Growth Performance
            </h4>
            <p className="text-[10px] opacity-45 col-span-2 font-mono">
              Live automated performance trajectory log
            </p>
          </div>
          <span className="text-[10.5px] font-mono opacity-50 flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>Last updated: just now</span>
          </span>
        </div>

        {/* Minimal clean SVG performance growth chart */}
        <div className="h-28 w-full mt-2 relative select-none">
          <svg className="w-full h-full" viewBox="0 0 1000 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="retailGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2962FF" stopOpacity="0.15" />
                <stop offset="100%" stopColor="#2962FF" stopOpacity="0.0" />
              </linearGradient>
            </defs>
            {/* Outline Path */}
            <path
              d="M 0 85 Q 150 78, 300 62 T 600 48 T 800 22 T 1000 12"
              fill="none"
              stroke="#2962FF"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            {/* Fill Area Path */}
            <path
              d="M 0 85 Q 150 78, 300 62 T 600 48 T 800 22 T 1000 12 L 1000 100 L 0 100 Z"
              fill="url(#retailGradient)"
            />
            
            {/* Points highlight sparkles */}
            <circle cx="300" cy="62" r="5" fill="#2962FF" stroke="white" strokeWidth="2" />
            <circle cx="600" cy="48" r="5" fill="#2962FF" stroke="white" strokeWidth="2" />
            <circle cx="1000" cy="12" r="6" fill="#10B981" stroke="white" strokeWidth="2.5" />
          </svg>
          
          {/* Label Overlays */}
          <div className="absolute top-2 right-4 text-center">
            <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 rounded py-0.5 px-2">
              All-Time High Reached (+12.8% Total Net Return)
            </span>
          </div>
        </div>

        {/* Legend stats brief */}
        <div className="grid grid-cols-3 gap-4 border-t border-gray-500/10 mt-4 pt-3 text-center text-xs font-mono text-gray-500">
          <div>
            <span className="text-[10px] block opacity-60">Cumulative Trades</span>
            <span className="font-semibold text-inherit">154 Executions</span>
          </div>
          <div>
            <span className="text-[10px] block opacity-60">Avg Profit Target Progress</span>
            <span className="font-semibold text-emerald-500">84.2% Passed</span>
          </div>
          <div>
            <span className="text-[10px] block opacity-60">Safety Margin Remaining</span>
            <span className="font-semibold text-blue-600">$5,450.00 Limit</span>
          </div>
        </div>

      </div>

    </div>
  );
}
