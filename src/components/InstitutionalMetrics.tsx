/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Zap, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  HelpCircle, 
  Compass, 
  BarChart3, 
  Calendar, 
  Flame, 
  Layers, 
  Gauge, 
  Dribbble, 
  AlertTriangle,
  Grid
} from 'lucide-react';
import { motion } from 'motion/react';
import { EconomicEvent, SentimentData, CorrelationData, RiskMetrics } from '../types';

interface InstitutionalMetricsProps {
  isDark: boolean;
  onSymbolSelect: (symbol: string) => void;
}

export default function InstitutionalMetrics({ isDark, onSymbolSelect }: InstitutionalMetricsProps) {
  // Advanced Quant State and Stats
  const metrics = {
    netProfit: 12.8,
    sharpeRatio: 2.31,
    winRate: 68,
    maxDrawdownLimit: -10.0,
    currentDrawdown: -3.4,
    profitFactor: 1.85,
    totalTrades: 341,
    avgWin: 1240,
    avgLoss: -680,
  };

  const riskMetrics = {
    leverageUsage: 14.5, // 14.5x leverage currently active
    maxLeverage: 100,
    portfolioExposurePercent: 50,
    forexExposurePercent: 32,
    cryptoExposurePercent: 18,
    stocksExposurePercent: 50,
  };

  const calendarEvents: EconomicEvent[] = [
    { id: 'ev1', time: '18:00', currency: 'USD', event: 'FOMC Meeting Minutes Release', impact: 'High', forecast: '5.25%', previous: '5.25%' },
    { id: 'ev2', time: '20:15', currency: 'EUR', event: 'ECB President Lagarde Speech', impact: 'High', forecast: '--', previous: '--' },
    { id: 'ev3', time: '21:30', currency: 'USD', event: 'Crude Oil Inventories Deviation', impact: 'Medium', forecast: '1.2M', previous: '-1.4M' },
    { id: 'ev4', time: '22:00', currency: 'GBP', event: 'BoE Gilt Buyback Auctions', impact: 'Low', forecast: '2.1B', previous: '2.1B' }
  ];

  const sentiments: SentimentData[] = [
    { symbol: 'BTCUSD', buyPercent: 74, sellPercent: 26, volume24h: '$32.4B' },
    { symbol: 'EURUSD', buyPercent: 42, sellPercent: 58, volume24h: '$11.8B' },
    { symbol: 'XAUUSD', buyPercent: 81, sellPercent: 19, volume24h: '$24.1B' },
    { symbol: 'AAPL', buyPercent: 63, sellPercent: 37, volume24h: '$8.2B' },
    { symbol: 'SPY', buyPercent: 51, sellPercent: 49, volume24h: '$19.5B' }
  ];

  const correlations: CorrelationData[] = [
    { base: 'BTCUSD', target: 'SPY', value: 0.85 },
    { base: 'XAUUSD', target: 'EURUSD', value: -0.92 },
    { base: 'EURUSD', target: 'USDX', value: -0.88 },
    { base: 'BTCUSD', target: 'XAUUSD', value: 0.41 }
  ];

  return (
    <div id="institutional-bento-grid" className="space-y-6 text-gray-200 select-none">
      
      {/* 4 Top High-Performance KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Net Profit */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-gray-800 bg-[#111827] p-4 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase opacity-50 tracking-wider">NET PROFIT INDEX</span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded leading-none">
              LIVE TARGET
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-display text-white">+{metrics.netProfit}%</span>
            <span className="text-xs text-emerald-400 font-mono font-bold">▲ Target REACHED</span>
          </div>
          <div className="w-full bg-gray-900 h-1.5 rounded-full mt-3 overflow-hidden">
            <div className="bg-cyan-450 h-full rounded-full" style={{ width: '84%' }} />
          </div>
          <p className="text-[9px] opacity-40 font-mono mt-1.5 leading-tight">
            Target threshold: +10.0% ($2,500.00 Net PnL)
          </p>
        </motion.div>

        {/* KPI 2: Sharpe Ratio */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl border border-gray-800 bg-[#111827] p-4 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase opacity-50 tracking-wider">SHARPE RATIO</span>
            <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded leading-none">
              QUANT RATING
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-display text-white">{metrics.sharpeRatio}</span>
            <span className="text-[10px] text-cyan-400 font-mono">EXCELLENT (RISK ADJ.)</span>
          </div>
          <p className="text-[9px] opacity-45 font-mono mt-4 leading-normal">
            Sharpe &gt; 2.0 indicates outstanding trade risk symmetry
          </p>
        </motion.div>

        {/* KPI 3: Win Rate */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-gray-800 bg-[#111827] p-4 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase opacity-50 tracking-wider">EDGE WIN RATE</span>
            <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded leading-none">
              STABLE
            </span>
          </div>
          <div className="flex items-baseline justify-between gap-1">
            <div>
              <span className="text-2xl font-bold font-display text-white">{metrics.winRate}%</span>
              <span className="text-[10px] block text-emerald-400 font-mono">{metrics.totalTrades} Executions</span>
            </div>
            {/* Minimal Circular win gauge */}
            <svg className="w-9 h-9 transform -rotate-90 text-gray-850" viewBox="0 0 36 36">
              <path className="stroke-current" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="stroke-emerald-400" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${metrics.winRate}, 100`} fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
          </div>
          <p className="text-[9px] opacity-40 font-mono mt-1 leading-normal">
            Pro ratio win/loss average allocation
          </p>
        </motion.div>

        {/* KPI 4: Max Drawdown Limit Tracker */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-gray-800 bg-[#111827] p-4 relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase opacity-50 tracking-wider">MAX DRAWDOWN SAFETY</span>
            <span className="text-[9px] font-mono text-red-400 bg-red-400/10 px-1.5 py-0.5 rounded leading-none font-bold">
              CRITICAL LIMIT: -6.0%
            </span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold font-display text-red-450">{metrics.currentDrawdown}%</span>
            <span className="text-[10px] text-gray-500 font-mono">Current Drawdown</span>
          </div>
          
          {/* Drawdown progress tracker */}
          <div className="w-full bg-gray-900 h-2 rounded-full mt-2.5 overflow-hidden flex relative">
            {/* Drawdown safety zone check */}
            <div className="bg-red-500 h-full rounded-l" style={{ width: '56.6%' }} /> {/* -3.4% represented over -6.0% limit */}
            {/* Line indicator indicating safety trigger */}
            <div className="absolute right-0 top-0 bottom-0 w-0.5 bg-red-500" />
          </div>
          <div className="flex justify-between items-center text-[8.5px] font-mono opacity-50 mt-1">
            <span>DRAWDOWN NOMINAL</span>
            <span>-6.0% CEILING limit</span>
          </div>
        </motion.div>

      </div>

      {/* Advanced Widgets Grid Layout (Economic, Sentiment, Matrix, Risk Engine) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Economic Calendar & Sentiment (Left Col, 7/12 area) */}
        <div className="lg:col-span-7 space-y-5">
          
          {/* Market Sentiment Heatmap Widget */}
          <div className="rounded-2xl border border-gray-800 bg-[#111827] p-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-gray-850 mb-3.5">
              <div className="flex items-center gap-2">
                <Flame className="h-4.5 w-4.5 text-orange-400" />
                <h3 className="font-display font-semibold text-xs tracking-wide">
                  Global Hedging Market Sentiment
                </h3>
              </div>
              <span className="text-[9.5px] font-mono opacity-50">Volume Weight Sentiment</span>
            </div>

            <div className="space-y-3.5">
              {sentiments.map((item) => (
                <div key={item.symbol} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <button
                      onClick={() => onSymbolSelect(item.symbol)}
                      className="font-bold cursor-pointer hover:text-cyan-400 uppercase text-gray-200"
                    >
                      {item.symbol}
                    </button>
                    <div className="flex gap-2 text-[10px] opacity-60 font-semibold">
                      <span className="text-emerald-400">Buyer: {item.buyPercent}%</span>
                      <span>•</span>
                      <span className="text-red-400">Seller: {item.sellPercent}%</span>
                    </div>
                  </div>
                  {/* Progress segment bar */}
                  <div className="h-3 w-full rounded-md bg-gray-950 overflow-hidden flex text-[9px] font-mono font-bold leading-none">
                    <div 
                      className="bg-emerald-500 flex items-center justify-start pl-2 text-white h-full" 
                      style={{ width: `${item.buyPercent}%` }}
                    >
                      <span>{item.buyPercent}%</span>
                    </div>
                    <div 
                      className="bg-red-500 h-full flex items-center justify-end pr-2 text-white" 
                      style={{ width: `${item.sellPercent}%` }}
                    >
                      <span>{item.sellPercent}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Economic Calendar Widget */}
          <div className="rounded-2xl border border-gray-800 bg-[#111827] p-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-gray-850 mb-3">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4.5 w-4.5 text-cyan-400" />
                <h3 className="font-display font-semibold text-xs tracking-wide">
                  Macro Economic Bulletins Feed
                </h3>
              </div>
              <span className="text-[9.5px] font-mono text-cyan-405">Impact Radar GMT-0</span>
            </div>

            <div className="divide-y divide-gray-805 space-y-2.5 max-h-[175px] overflow-y-auto custom-scrollbar">
              {calendarEvents.map((ev) => (
                <div key={ev.id} className="flex items-start justify-between py-2 text-xs first:pt-0 pb-0 last:border-b-0 border-inherit">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10.5px] font-semibold text-cyan-405">{ev.time}</span>
                      <span className="font-mono font-bold text-[10px] uppercase bg-gray-900 border border-gray-800 px-1 rounded">
                        {ev.currency}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded-[4px] text-[8.5px] font-mono font-bold leading-none ${
                        ev.impact === 'High' 
                          ? 'bg-red-955/30 text-red-400 border border-red-500/20 shadow-[0_0_8px_rgba(239,68,68,0.1)]' 
                          : ev.impact === 'Medium'
                            ? 'bg-amber-955/20 text-amber-500 border border-amber-550/20'
                            : 'bg-gray-800 text-gray-400 border border-transparent'
                      }`}>
                        {ev.impact} IMPACT
                      </span>
                    </div>
                    <span className="font-display font-medium text-gray-200 block text-xs">{ev.event}</span>
                  </div>

                  <div className="text-right font-mono text-[10px] flex items-center gap-2.5">
                    <div>
                      <span className="text-[8.5px] text-gray-500 block">Forecast</span>
                      <span className="text-gray-300 font-semibold">{ev.forecast}</span>
                    </div>
                    <div>
                      <span className="text-[8.5px] text-gray-500 block">Previous</span>
                      <span className="text-gray-400">{ev.previous}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Quant Ratios & Correlation Matrix (Right Col, 5/12 area) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* Institutional Risk Engine Detail */}
          <div className="rounded-2xl border border-gray-800 bg-[#111827] p-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-gray-850 mb-3.5">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-4.5 w-4.5 text-cyan-400" />
                <h3 className="font-display font-semibold text-xs tracking-wide">
                  Hedge Risk Exposure Engine
                </h3>
              </div>
              <span className="text-[9.5px] font-mono text-cyan-400">PROP ALLOC_V3</span>
            </div>

            <div className="space-y-4">
              
              {/* Exposure ratios stats */}
              <div className="grid grid-cols-3 gap-2 py-2 px-3 bg-gray-950 border border-gray-850 rounded-xl text-center text-xs font-mono">
                <div>
                  <span className="text-[8.5px] text-gray-500 block uppercase font-bold">Forex Ratio</span>
                  <span className="font-semibold text-cyan-400">{riskMetrics.forexExposurePercent}%</span>
                </div>
                <div>
                  <span className="text-[8.5px] text-gray-500 block uppercase font-bold">Crypto Ratio</span>
                  <span className="font-semibold text-amber-500">{riskMetrics.cryptoExposurePercent}%</span>
                </div>
                <div>
                  <span className="text-[8.5px] text-gray-500 block uppercase font-bold">Stocks Ratio</span>
                  <span className="font-semibold text-purple-400">{riskMetrics.stocksExposurePercent}%</span>
                </div>
              </div>

              {/* Leverage Usage Gauge progress */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-gray-400 font-medium">Leverage Margin Allocated</span>
                  <span className="font-bold text-white">
                    {riskMetrics.leverageUsage}x / {riskMetrics.maxLeverage}x
                  </span>
                </div>
                <div className="w-full bg-gray-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${riskMetrics.leverageUsage}%` }} />
                </div>
                <p className="text-[8.5px] font-mono opacity-40 leading-snug">
                  Safe limits: leverage &lt; 25x is highly recommended to protect prop drawer target bounds.
                </p>
              </div>

              {/* Profit Factor Gauge Dial details */}
              <div className="border-t border-gray-855 pt-3.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-gray-400 block uppercase">PROP PROFIT FACTOR</span>
                  <span className="text-xl font-bold font-mono text-white tracking-tight">1.85</span>
                </div>
                <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-1 rounded">
                  ▲ HIGHLY PROFITABLE
                </span>
              </div>

            </div>
          </div>

          {/* Asset Correlation Matrix Widget */}
          <div className="rounded-2xl border border-gray-800 bg-[#111827] p-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-gray-850 mb-3">
              <div className="flex items-center gap-1.5">
                <Grid className="h-4.5 w-4.5 text-purple-400" />
                <h3 className="font-display font-semibold text-xs tracking-wide">
                  Quant Multi-Asset Correlation
                </h3>
              </div>
              <span className="text-[9.5px] font-mono opacity-50">R-Squared Matrix</span>
            </div>

            <div className="space-y-2 font-mono text-xs">
              {correlations.map((c, idx) => {
                const isInverse = c.value < 0;
                return (
                  <div 
                    key={`corr-${idx}`} 
                    className="flex justify-between items-center p-2 rounded-lg bg-gray-950 border border-gray-900"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{c.base}</span>
                      <span className="text-[10px] opacity-45">↔</span>
                      <span className="text-gray-400">{c.target}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-[10.5px] font-bold ${
                        isInverse ? 'text-amber-500' : 'text-cyan-400'
                      }`}>
                        {c.value.toFixed(2)}
                      </span>
                      <span className="text-[9px] opacity-50 uppercase">
                        {isInverse ? 'Inverse' : 'Direct'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
