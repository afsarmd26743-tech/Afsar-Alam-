/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  HelpCircle, 
  Settings, 
  Wallet, 
  Cpu, 
  BookOpen, 
  ShieldAlert, 
  BarChart3, 
  Briefcase, 
  Info, 
  Play, 
  RotateCcw, 
  Send,
  PlusCircle,
  PiggyBank,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SubPagesProps {
  activeTab: string;
  isDark: boolean;
  instruments: { symbol: string; name: string; category: string; price: number; change: number; high: number; low: number; volume: string }[];
  onSymbolSelect: (symbol: string) => void;
  retailBalance: number;
  onAdjustBalance: (delta: number) => void;
  onOpenPosition: (symbol: string, side: 'Long' | 'Short', size: number, price: number) => void;
}

export default function SubPages({ 
  activeTab, 
  isDark, 
  instruments, 
  onSymbolSelect,
  retailBalance,
  onAdjustBalance,
  onOpenPosition
}: SubPagesProps) {
  
  // Strategy Tester Simulator state
  const [testing, setTesting] = useState(false);
  const [backtestResult, setBacktestResult] = useState<any | null>(null);
  const [selectedTesterSymbol, setSelectedTesterSymbol] = useState('BTCUSD');
  const [selectedStrategy, setSelectedStrategy] = useState('MACD Cross');

  // Support Chat simulator state
  const [supportMessage, setSupportMessage] = useState('');
  const [supportChat, setSupportChat] = useState<{ sender: 'user' | 'agent'; text: string; time: string }[]>([
    { sender: 'agent', text: 'Hello Afsar Md! Welcome to alam.dev elite developer support desk. How can I assist you with your developer trading dashboard or account credentials today?', time: '16:49' }
  ]);

  // Wallet Funding state
  const [fundingAmount, setFundingAmount] = useState('1000');

  // Trigger simulated algorithm backtest
  const runStrategyBacktest = () => {
    setTesting(true);
    setBacktestResult(null);

    setTimeout(() => {
      setTesting(false);
      const isProfitable = Math.random() > 0.3;
      setBacktestResult({
        profitFactor: (Math.random() * 0.8 + (isProfitable ? 1.5 : 0.8)).toFixed(2),
        sharpeRatio: (Math.random() * 1.5 + (isProfitable ? 1.8 : 0.5)).toFixed(2),
        totalTradesCode: Math.floor(Math.random() * 300 + 100),
        winRatePercent: Math.floor(Math.random() * 25 + (isProfitable ? 55 : 35)),
        maxDrawdownTrack: (Math.random() * -3.5 - 1.2).toFixed(2),
        netReturn: (Math.random() * 25 * (isProfitable ? 1 : -0.5)).toFixed(2),
      });
    }, 1600);
  };

  const handleSendSupportMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;

    const userMsg = { sender: 'user' as const, text: supportMessage, time: '16:50' };
    setSupportChat(prev => [...prev, userMsg]);
    setSupportMessage('');

    // Simulated responsive support reply
    setTimeout(() => {
      let replyText = "Your message was logged under STP-support channel. Since we operate automatic prop firm execution logs, our risk engines have verified your safety margins to be in nominal standing. How else can we assist you?";
      if (supportMessage.toLowerCase().includes('payout') || supportMessage.toLowerCase().includes('withdraw')) {
        replyText = "Payout approvals clear instantly. Use your simulated 'Wallet' panel to sweeps tokens directly to ledger accounts safely!";
      } else if (supportMessage.toLowerCase().includes('drawdown') || supportMessage.toLowerCase().includes('limit')) {
        replyText = "The alam.dev maximum drawdown safety barrier is strictly capped. Keep leverage below 20x to prevent systemic risk closeouts.";
      }
      setSupportChat(prev => [...prev, { sender: 'agent' as const, text: replyText, time: '16:50' }]);
    }, 1000);
  };

  const handleFundWallet = (isDeposit: boolean) => {
    const amt = parseFloat(fundingAmount);
    if (isNaN(amt) || amt <= 0) return;
    onAdjustBalance(isDeposit ? amt : -amt);
    setFundingAmount('');
  };

  return (
    <div id="subpages-container" className="py-6 select-none">
      
      {/* 1. MARKETS PAGE */}
      {activeTab === 'markets' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display font-bold text-xl tracking-tight flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-cyan-400" />
              <span>Symmetric Markets Feed</span>
            </h2>
            <p className="text-xs opacity-50 font-mono">
              Live straight-through indices trading list with 24-hour analytics
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {instruments.map((inst) => {
              const changeIsPositive = inst.change >= 0;
              return (
                <div 
                  key={inst.symbol}
                  className={`rounded-xl border p-4.5 transition-all hover:-translate-y-0.5 hover:shadow-lg ${
                    isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold uppercase">{inst.symbol}</span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-mono font-semibold ${
                      changeIsPositive 
                        ? 'text-emerald-500 bg-emerald-500/10' 
                        : 'text-red-500 bg-red-500/10'
                    }`}>
                      {changeIsPositive ? '+' : ''}{inst.change.toFixed(2)}%
                    </span>
                  </div>
                  <h4 className="font-display font-semibold text-lg text-inherit mb-1">
                    ${inst.price.toLocaleString(undefined, { minimumFractionDigits: inst.symbol.includes('BTC') ? 2 : 4 })}
                  </h4>
                  <p className="text-[10px] opacity-45 uppercase font-mono block mb-3.5">
                    {inst.name} ({inst.category})
                  </p>

                  <div className="flex items-center justify-between text-[10px] font-mono opacity-60 border-t border-gray-500/10 pt-2.5">
                    <div>
                      <span>Vol: </span>
                      <strong className="text-inherit">{inst.volume}</strong>
                    </div>
                    <button
                      onClick={() => onSymbolSelect(inst.symbol)}
                      className={`text-[10px] font-semibold py-1 px-3.5 rounded border transition-colors ${
                        isDark 
                          ? 'border-gray-800 hover:border-cyan-400 hover:text-cyan-400' 
                          : 'border-gray-200 hover:border-blue-600 hover:text-blue-600'
                      }`}
                    >
                      Inspect Index
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. PORTFOLIO PAGE */}
      {activeTab === 'portfolio' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display font-bold text-xl tracking-tight flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-cyan-400" />
              <span>Asset Vault Portfolio Summary</span>
            </h2>
            <p className="text-xs opacity-50 font-mono">
              Prop firm funded custody ledger, allocations & performance audit logs
            </p>
          </div>

          {/* Performance Circle Core Matrix Widget Section */}
          <div className="space-y-3">
            <h3 className="font-display font-semibold text-xs tracking-wide uppercase opacity-75">
              🎯 Performance Circle Core Matrix
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              
              {/* Circle 1: Overall Performance Goal Progress */}
              <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] ${
                isDark ? 'bg-gray-900 border-gray-800/80 hover:border-cyan-500/20' : 'bg-white border-gray-200 shadow-sm'
              }`}>
                <span className="text-[10px] font-mono opacity-60 uppercase tracking-wider block mb-3.5">Overall Target</span>
                
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" stroke={isDark ? "#121b2a" : "#f1f5f9"} strokeWidth="7" fill="transparent" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="42" 
                      stroke="url(#overallGrad)" 
                      strokeWidth="7" 
                      strokeDasharray={`${2 * Math.PI * 42 * 0.964} 263.8`}
                      strokeLinecap="round" 
                      fill="transparent" 
                    />
                    <defs>
                      <linearGradient id="overallGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d5" />
                        <stop offset="100%" stopColor="#3b82f6" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-base font-bold font-mono text-cyan-400">96.4%</span>
                    <span className="text-[8px] font-mono opacity-55 uppercase">Target</span>
                  </div>
                </div>
                
                <div className="mt-4 leading-none text-center">
                  <span className="text-[10px] text-gray-500 font-mono block mb-1">Target PnL Met:</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">+$2,410.00</span>
                </div>
              </div>

              {/* Circle 2: Total Profit */}
              <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] ${
                isDark ? 'bg-gray-900 border-gray-800/80 hover:border-emerald-500/20' : 'bg-white border-gray-200 shadow-sm'
              }`}>
                <span className="text-[10px] font-mono opacity-60 uppercase tracking-wider block mb-3.5">Total Profit</span>
                
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" stroke={isDark ? "#121b2a" : "#f1f5f9"} strokeWidth="7" fill="transparent" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="42" 
                      stroke="url(#profitGrad)" 
                      strokeWidth="7" 
                      strokeDasharray={`${2 * Math.PI * 42 * 0.85} 263.8`}
                      strokeLinecap="round" 
                      fill="transparent" 
                    />
                    <defs>
                      <linearGradient id="profitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#059669" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-base font-bold font-mono text-emerald-400">$4.25K</span>
                    <span className="text-[8px] font-mono opacity-55 uppercase">Profit</span>
                  </div>
                </div>
                
                <div className="mt-4 leading-none text-center">
                  <span className="text-[10px] text-gray-500 font-mono block mb-1">Total Profits:</span>
                  <span className="text-sm font-bold text-emerald-400 font-mono">+$4,250.00</span>
                </div>
              </div>

              {/* Circle 3: Total Loss */}
              <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] ${
                isDark ? 'bg-gray-900 border-gray-800/80 hover:border-rose-500/20' : 'bg-white border-gray-200 shadow-sm'
              }`}>
                <span className="text-[10px] font-mono opacity-60 uppercase tracking-wider block mb-3.5">Total Loss</span>
                
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" stroke={isDark ? "#121b2a" : "#f1f5f9"} strokeWidth="7" fill="transparent" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="42" 
                      stroke="url(#lossGrad)" 
                      strokeWidth="7" 
                      strokeDasharray={`${2 * Math.PI * 42 * 0.736} 263.8`}
                      strokeLinecap="round" 
                      fill="transparent" 
                    />
                    <defs>
                      <linearGradient id="lossGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f43f5e" />
                        <stop offset="100%" stopColor="#b91c1c" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-base font-bold font-mono text-rose-450">-$1.84K</span>
                    <span className="text-[8px] font-mono opacity-55 uppercase">Drawdown</span>
                  </div>
                </div>
                
                <div className="mt-4 leading-none text-center">
                  <span className="text-[10px] text-gray-500 font-mono block mb-1">Max Risk Drawn:</span>
                  <span className="text-sm font-bold text-rose-400 font-mono">-$1,840.00</span>
                </div>
              </div>

              {/* Circle 4: Risk Reward (R:R) */}
              <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] ${
                isDark ? 'bg-gray-900 border-gray-800/80 hover:border-cyan-500/20' : 'bg-white border-gray-200 shadow-sm'
              }`}>
                <span className="text-[10px] font-mono opacity-60 uppercase tracking-wider block mb-3.5">Risk Reward</span>
                
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" stroke={isDark ? "#121b2a" : "#f1f5f9"} strokeWidth="7" fill="transparent" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="42" 
                      stroke="url(#rrGrad)" 
                      strokeWidth="7" 
                      strokeDasharray={`${2 * Math.PI * 42 * 0.77} 263.8`}
                      strokeLinecap="round" 
                      fill="transparent" 
                    />
                    <defs>
                      <linearGradient id="rrGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#0ea5e9" />
                        <stop offset="100%" stopColor="#6366f1" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-base font-bold font-mono text-cyan-300">2.31x</span>
                    <span className="text-[8px] font-mono opacity-55 uppercase">R:R Ratio</span>
                  </div>
                </div>
                
                <div className="mt-4 leading-none text-center">
                  <span className="text-[10px] text-gray-500 font-mono block mb-1">Calculated R:R:</span>
                  <span className="text-sm font-bold text-cyan-400 font-mono">1 : 2.31</span>
                </div>
              </div>

              {/* Circle 5: Average Trades */}
              <div className={`p-5 rounded-2xl border flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] ${
                isDark ? 'bg-gray-900 border-gray-800/80" hover:border-amber-500/20' : 'bg-white border-gray-200 shadow-sm'
              } col-span-2 sm:col-span-1`}>
                <span className="text-[10px] font-mono opacity-60 uppercase tracking-wider block mb-3.5">Win / Loss Ratio</span>
                
                <div className="relative w-24 h-24 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="42" stroke={isDark ? "#121b2a" : "#f1f5f9"} strokeWidth="7" fill="transparent" />
                    <circle 
                      cx="50" 
                      cy="50" 
                      r="42" 
                      stroke="url(#avgGrad)" 
                      strokeWidth="7" 
                      strokeDasharray={`${2 * Math.PI * 42 * 0.64} 263.8`}
                      strokeLinecap="round" 
                      fill="transparent" 
                    />
                    <defs>
                      <linearGradient id="avgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#d97706" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute flex flex-col items-center justify-center">
                    <span className="text-base font-bold font-mono text-amber-400">1.84</span>
                    <span className="text-[8px] font-mono opacity-55 uppercase">Profit Factor</span>
                  </div>
                </div>
                
                <div className="mt-4 leading-none text-center">
                  <span className="text-[10px] text-gray-500 font-mono block mb-1">Avg Win Size:</span>
                  <span className="text-sm font-bold text-amber-500 font-mono">+$340.50</span>
                </div>
              </div>

            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Allocation Ratios */}
            <div className={`rounded-xl border p-5 lg:col-span-5 ${
              isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
            }`}>
              <h3 className="font-display font-semibold text-xs tracking-wide uppercase mb-3 opacity-80">
                Fund Deployment Exposure Metrics
              </h3>
              
              <div className="space-y-4 text-xs font-mono">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span>Indices Allocation (Premium Stocks)</span>
                    <span>50%</span>
                  </div>
                  <div className="w-full bg-gray-950 h-2 rounded-full">
                    <div className="bg-purple-550 h-full rounded-full" style={{ width: '50%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span>Traditional Forex Margin</span>
                    <span>32%</span>
                  </div>
                  <div className="w-full bg-gray-950 h-2 rounded-full">
                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: '32%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span>Cryptocurrency Speculative Ledger</span>
                    <span>18%</span>
                  </div>
                  <div className="w-full bg-gray-950 h-2 rounded-full">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '18%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Account Specifications */}
            <div className={`rounded-xl border p-5 lg:col-span-7 ${
              isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
            }`}>
              <h3 className="font-display font-semibold text-xs tracking-wide uppercase mb-4 opacity-80">
                Prop Program Credentials
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-2.5 p-3 rounded-lg bg-gray-500/5">
                  <div className="flex justify-between opacity-70">
                    <span>Prop Stage:</span>
                    <strong className="text-inherit">Stage 2 Evaluation (Active)</strong>
                  </div>
                  <div className="flex justify-between opacity-70">
                    <span>Starting Balance:</span>
                    <strong className="text-inherit">$25,000.00 USD</strong>
                  </div>
                  <div className="flex justify-between opacity-70">
                    <span>Target Target Limit:</span>
                    <strong className="text-emerald-500">+$2,500.00 (10.0%)</strong>
                  </div>
                </div>

                <div className="space-y-2.5 p-3 rounded-lg bg-gray-500/5">
                  <div className="flex justify-between opacity-70">
                    <span>Max Relative Drawdown:</span>
                    <strong className="text-red-500">-6.0% ($1,500.00 Limit)</strong>
                  </div>
                  <div className="flex justify-between opacity-70">
                    <span>Leverage Capped:</span>
                    <strong className="text-inherit">1:100 Dynamic Standard</strong>
                  </div>
                  <div className="flex justify-between opacity-70">
                    <span>Symmetry Risk Audit:</span>
                    <strong className="text-emerald-500">PASSED EXCELLENT</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. PERFORMANCE PAGE */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display font-bold text-xl tracking-tight flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cyan-400" />
              <span>Symmetric Performance Analytics</span>
            </h2>
            <p className="text-xs opacity-50 font-mono">
              Detailed tracking scorecards, drawdown heatmaps, and return ratio metrics
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <span className="text-[10px] font-mono opacity-50 block uppercase">AVG WIN AMOUNT</span>
              <span className="text-xl font-bold font-mono text-emerald-500">$340.50</span>
              <p className="text-[9px] opacity-40 font-mono mt-1">Based on historical evaluations</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <span className="text-[10px] font-mono opacity-50 block uppercase">AVG LOSS AMOUNT</span>
              <span className="text-xl font-bold font-mono text-red-500">-$185.20</span>
              <p className="text-[9px] opacity-40 font-mono mt-1">Safe loss ratios maintained</p>
            </div>
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <span className="text-[10px] font-mono opacity-50 block uppercase">PROP RATING COEFFICIENT</span>
              <span className="text-xl font-bold font-mono text-cyan-400">AA+ Elite</span>
              <p className="text-[9px] opacity-40 font-mono mt-1">Consistency score calculated</p>
            </div>
          </div>

          {/* Detailed SVG Charts area */}
          <div className={`p-5 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
            <h3 className="font-display font-semibold text-xs mb-3 uppercase opacity-75">
              Net Returns Trajectory (Interactive Spark Log)
            </h3>
            <div className="h-44 w-full relative">
              {/* Complex dual-axis line curves simulating high-performance dashboards */}
              <svg className="w-full h-full" viewBox="0 0 1000 150" preserveAspectRatio="none">
                {/* Secondary limit line */}
                <line x1="0" y1="120" x2="1000" y2="120" stroke="rgba(239, 68, 68, 0.25)" strokeWidth="1.5" strokeDasharray="5,5" />
                <text x="10" y="115" fill="#EF4444" fontSize="10" fontFamily="monospace" opacity="0.6">Max Drawdown Target Risk Margin (-$1,500)</text>

                <path
                  d="M 0 100 Q 100 85, 200 95 T 400 60 T 600 75 T 800 30 T 1000 20"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="3"
                />
                
                <text x="940" y="45" fill="#10B981" fontSize="10" fontFamily="monospace" fontWeight="bold">+$2,410</text>
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* 4. RISK ANALYTICS PAGE */}
      {activeTab === 'risk' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display font-bold text-xl tracking-tight flex items-center gap-2">
              <ShieldAlert className="h-5 w-5 text-red-500" />
              <span>STP Exposure & Risk Engine Control</span>
            </h2>
            <p className="text-xs opacity-50 font-mono">
              Margin limits control ledger, leverage brackets, and systemic risk alerts
            </p>
          </div>

          <div className={`rounded-xl border p-5 ${
            isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-lg bg-red-500/10 text-red-500">
                <Info className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-inherit">Prop Safety Margin Checklist</h4>
                <p className="text-[10.5px] opacity-50 font-mono text-inherit">
                  Automated checks verified to ensure your prop funding program meets limits
                </p>
              </div>
            </div>

            <div className="divide-y divide-gray-500/10 space-y-3.5 text-xs font-mono">
              <div className="flex justify-between items-center py-2 first:pt-0">
                <span>Maximum Allowed Daily Drawdown Standard:</span>
                <span className="font-bold text-emerald-500">OK (-3.0% limit check passed)</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>Straight-Through Weekend Hedging Checks:</span>
                <span className="font-bold text-emerald-500">ENABLED (Auto Sweep protection Active)</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span>Maximum Exposure per Index Symbol:</span>
                <span className="font-bold text-yellow-405">WARNING (BTCUSD exposure near 20% limit)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. STRATEGY TESTER PAGE */}
      {activeTab === 'tester' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display font-bold text-xl tracking-tight flex items-center gap-2">
              <Cpu className="h-5 w-5 text-cyan-450" />
              <span>Backtest Strategy Engine Simulator</span>
            </h2>
            <p className="text-xs opacity-50 font-mono">
              Test advanced indicators (RSI, EMA, MACD) on historical datasets instantly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Strategy Input Ticket */}
            <div className={`p-4 rounded-xl border space-y-4 md:col-span-1 ${
              isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
            }`}>
              <h3 className="font-display font-semibold text-xs tracking-wide uppercase opacity-75">
                Strategy Setup
              </h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-mono block mb-1 opacity-60">Quant Spec:</label>
                  <select 
                    value={selectedStrategy} 
                    onChange={(e) => setSelectedStrategy(e.target.value)}
                    className={`w-full p-2 rounded border font-mono ${
                      isDark ? 'bg-gray-950 border-gray-800 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <option value="MACD Cross">MACD Exponential Cross</option>
                    <option value="RSI Divergence">RSI Divergence Mean Reversion</option>
                    <option value="Bollinger Squeeze">Bollinger Band Volatility Squeeze</option>
                    <option value="Trend Following Grid">Grid High-Frequency Trend Follow</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono block mb-1 opacity-60">Target Ticker:</label>
                  <select 
                    value={selectedTesterSymbol} 
                    onChange={(e) => setSelectedTesterSymbol(e.target.value)}
                    className={`w-full p-2 rounded border font-mono ${
                      isDark ? 'bg-gray-950 border-gray-800 text-white' : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    {instruments.map(i => (
                      <option key={i.symbol} value={i.symbol}>{i.symbol}</option>
                    ))}
                  </select>
                </div>

                <button
                  id="btn-run-tester-backtest"
                  onClick={runStrategyBacktest}
                  disabled={testing}
                  className={`w-full py-2 rounded text-xs font-bold font-display cursor-pointer tracking-wider flex items-center justify-center gap-1.5 transition-all ${
                    testing
                      ? 'bg-gray-400 text-gray-200'
                      : 'bg-cyan-500 hover:bg-cyan-600 text-white shadow-lg shadow-cyan-500/10'
                  }`}
                >
                  <Play className="h-3.5 w-3.5 fill-current" />
                  <span>{testing ? 'RUNNING BACKTEST...' : 'EXECUTE SIMULATION'}</span>
                </button>
              </div>
            </div>

            {/* Strategy Backtest results output details */}
            <div className={`p-4 rounded-xl border md:col-span-2 relative min-h-[220px] ${
              isDark ? 'bg-gray-900 border-gray-800 font-mono text-gray-200' : 'bg-white border-gray-200 text-gray-800'
            }`}>
              {testing ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-inherit rounded-xl">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-t-cyan-400 border-gray-800 mb-3" />
                  <span className="font-mono text-xs text-yellow-405">Latching historical market ticks...</span>
                  <p className="text-[10px] opacity-40 max-w-[280px] mt-1.5 leading-tight text-inherit">
                    Scanning cumulative trades indices across Coinbase FX and traditional stock grids over 2 years of past ticks data.
                  </p>
                </div>
              ) : backtestResult ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-gray-500/10 pb-2">
                    <h3 className="font-display font-semibold text-xs tracking-wide uppercase text-inherit">
                      Backtest Results Detail: {selectedStrategy} ({selectedTesterSymbol})
                    </h3>
                    <button 
                      onClick={() => setBacktestResult(null)}
                      className="text-[10px] opacity-50 hover:underline flex items-center gap-0.5 font-semibold"
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>Clear</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 text-center font-mono">
                    <div className="p-2.5 rounded bg-gray-500/5">
                      <span className="text-[9px] text-gray-500 block">PROFIT FACTOR</span>
                      <strong className="text-emerald-500 text-sm font-bold">{backtestResult.profitFactor}</strong>
                    </div>
                    <div className="p-2.5 rounded bg-gray-500/5">
                      <span className="text-[9px] text-gray-500 block">SHARPE RATIO</span>
                      <strong className="text-cyan-400 text-sm font-bold">{backtestResult.sharpeRatio}</strong>
                    </div>
                    <div className="p-2.5 rounded bg-gray-500/5">
                      <span className="text-[9px] text-gray-500 block font-semibold">EDGE WIN RATE</span>
                      <strong className="text-emerald-500 text-sm font-bold">{backtestResult.winRatePercent}%</strong>
                    </div>
                    <div className="p-2.5 rounded bg-gray-500/5">
                      <span className="text-[9px] text-gray-500 block">TOTAL TRADES</span>
                      <strong className="text-inherit text-sm font-bold">{backtestResult.totalTradesCode} runs</strong>
                    </div>
                    <div className="p-2.5 rounded bg-gray-500/5">
                      <span className="text-[9px] text-gray-500 block">MAX DRAWDOWN</span>
                      <strong className="text-red-500 text-sm font-bold">{backtestResult.maxDrawdownTrack}%</strong>
                    </div>
                    <div className="p-2.5 rounded bg-gray-500/5">
                      <span className="text-[9px] text-gray-500 block">NET COEF. RETURN</span>
                      <strong className={`text-sm font-bold ${parseFloat(backtestResult.netReturn) >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                        {parseFloat(backtestResult.netReturn) >= 0 ? '+' : ''}{backtestResult.netReturn}%
                      </strong>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-6 text-center h-full text-xs font-mono">
                  <div className="p-3.5 rounded-full mb-2 bg-gray-500/5 text-gray-500">
                    <Info className="h-5 w-5" />
                  </div>
                  <span>Strategy Backtester Passive</span>
                  <p className="text-[10px] opacity-40 max-w-[260px] text-center mt-1 text-inherit">
                    Select a quantitative execution paradigm on the left and run simulation metrics over live tickers.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. WALLET PAGE */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display font-bold text-xl tracking-tight flex items-center gap-2">
              <Wallet className="h-5 w-5 text-cyan-405" />
              <span>Simulated Wallet & Funding Cabin</span>
            </h2>
            <p className="text-xs opacity-50 font-mono">
              Manage prop balance testing, simulate deposits, credit sweeps, and evaluate withdrawals!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className={`p-5 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <h3 className="font-display font-semibold text-xs tracking-wide uppercase mb-3 opacity-80">
                Deposit / Withdraw Tokens Simulation
              </h3>
              
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="font-mono block mb-1 opacity-60">Funding Amount (USD):</label>
                  <input
                    id="wallet-funding-input"
                    type="number"
                    className={`w-full p-2 text-xs rounded border outline-none font-mono ${
                      isDark ? 'bg-gray-950 border-gray-800 text-white focus:border-cyan-400' : 'bg-gray-50 border-gray-200 focus:border-blue-600'
                    }`}
                    placeholder="Enter amount (e.g. 1000)"
                    value={fundingAmount}
                    onChange={(e) => setFundingAmount(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <button
                    id="btn-wallet-simulate-deposit"
                    onClick={() => handleFundWallet(true)}
                    className="py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-white font-bold cursor-pointer text-xs"
                  >
                    Simulate Deposit
                  </button>
                  <button
                    id="btn-wallet-simulate-withdraw"
                    onClick={() => handleFundWallet(false)}
                    className="py-2 rounded bg-red-500 hover:bg-red-600 text-white font-bold cursor-pointer text-xs"
                  >
                    Request Payout / Withdraw
                  </button>
                </div>
              </div>
            </div>

            {/* Simulated Balance Box information */}
            <div className={`p-5 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <h3 className="font-display font-semibold text-xs tracking-wide uppercase mb-3 opacity-80">
                Ledge Settlement Info
              </h3>
              <div className="space-y-3 text-xs font-mono">
                <div className="flex justify-between items-center bg-gray-500/5 p-2 rounded">
                  <span>Simulated Balance:</span>
                  <span className="font-bold text-lg text-cyan-405">${retailBalance.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <p className="text-[10px] opacity-40 leading-snug">
                  Sweeping payouts triggers evaluation standard checks. Make sure drawdown ratios do not violate -6% limits before triggering simulated withdrawals.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. TRADE JOURNAL */}
      {activeTab === 'journal' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display font-bold text-xl tracking-tight flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-cyan-400" />
              <span>Prop Trading Journal Log</span>
            </h2>
            <p className="text-xs opacity-50 font-mono">
              Interactive logging of strategy notes, performance triggers, and market insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <h4 className="font-bold border-b border-gray-500/10 pb-2 mb-2 text-inherit uppercase">Evaluation Milestone Alpha</h4>
              <p className="opacity-70 leading-relaxed mb-3">
                Identified excellent EURUSD correlation vectors matching high-volume Asian sessions. Risk levels managed gracefully below 2% risk margins.
              </p>
              <div className="flex justify-between text-[10px] opacity-50">
                <span>Created: 2026-05-30</span>
                <span>Category: Macro Strategy</span>
              </div>
            </div>

            <div className={`p-4 rounded-xl border ${isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
              <h4 className="font-bold border-b border-gray-500/10 pb-2 mb-2 text-inherit uppercase">BTC Speculative Close Action</h4>
              <p className="opacity-70 leading-relaxed mb-3">
                Bitcoin surged near 106,000 range. Locked in partial profits on key longs. Current drawdown healthy at nominal levels support thresholds.
              </p>
              <div className="flex justify-between text-[10px] opacity-50">
                <span>Created: 2026-05-29</span>
                <span>Category: Hedging Log</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 8. SETTINGS TAB */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display font-bold text-xl tracking-tight flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-400" />
              <span>Terminal & Profile Configurations</span>
            </h2>
            <p className="text-xs opacity-50 font-mono">
              Adjust program credentials, API keys mappings, and custom notifications checkboxes
            </p>
          </div>

          <div className={`p-5 rounded-xl border text-xs max-w-2xl ${
            isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <h3 className="font-display font-semibold uppercase text-xs opacity-85 mb-3.5 border-b border-inherit pb-2">
              Prop Trader Details
            </h3>
            
            <div className="space-y-3.5 font-mono text-inherit">
              <div className="flex justify-between items-center py-1">
                <span>Primary Username:</span>
                <span className="font-bold text-inherit">Afsar Md</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Contact Email:</span>
                <span className="font-bold">afsarmd26743@gmail.com</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Liquidity Broker:</span>
                <span className="font-bold text-cyan-400">alam.dev Straight-Through-Processing Gateway</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span>Risk Allocation Category:</span>
                <span className="font-bold text-emerald-500">Institutional Quant</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 9. SUPPORT TAB */}
      {activeTab === 'support' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-display font-bold text-xl tracking-tight flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-blue-500" />
              <span>Prop Support Helpdesk Desk</span>
            </h2>
            <p className="text-xs opacity-50 font-mono">
              Live automated trade ticket support, evaluation milestone queries
            </p>
          </div>

          {/* Interactive Chat window dashboard helper */}
          <div className={`rounded-xl border p-4 max-w-2xl flex flex-col h-[350px] ${
            isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200 shadow-md'
          }`}>
            {/* Conversation Flow */}
            <div className="flex-1 overflow-y-auto space-y-3 p-2 custom-scrollbar">
              {supportChat.map((chat, idx) => (
                <div 
                  key={idx}
                  className={`flex ${chat.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`p-3 rounded-2xl max-w-[80%] text-xs leading-relaxed ${
                    chat.sender === 'user'
                      ? isDark ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/20' : 'bg-blue-600 text-white'
                      : isDark ? 'bg-gray-950 text-gray-300' : 'bg-gray-100 text-gray-850'
                  }`}>
                    <span>{chat.text}</span>
                    <span className="block opacity-40 text-[9px] font-mono text-right mt-1">{chat.time}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Input send bar footer */}
            <form onSubmit={handleSendSupportMessage} className="mt-3.5 flex gap-2 border-t border-gray-500/10 pt-3">
              <input
                id="support-chat-input"
                type="text"
                className={`w-full p-2 text-xs rounded-lg border outline-none ${
                  isDark ? 'bg-gray-950 border-gray-800 text-white' : 'bg-gray-50 border-gray-200'
                }`}
                placeholder="Submit helpdesk queries (e.g., drawdown limit parameters info)..."
                value={supportMessage}
                onChange={(e) => setSupportMessage(e.target.value)}
              />
              <button
                id="btn-send-support-chat"
                type="submit"
                className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-transform active:scale-95 cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
