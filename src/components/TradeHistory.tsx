/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Download, 
  Play, 
  ArrowUpDown, 
  Search, 
  Filter,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  X,
  PlayCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Trade, TradeSide } from '../types';

interface TradeHistoryProps {
  trades: Trade[];
  isDark: boolean;
}

type SortField = 'time' | 'symbol' | 'side' | 'pnl' | 'size';

export default function TradeHistory({ trades, isDark }: TradeHistoryProps) {
  const [search, setSearch] = useState('');
  const [sideFilter, setSideFilter] = useState<'All' | 'Buy' | 'Sell'>('All');
  const [sortField, setSortField] = useState<SortField>('time');
  const [sortAsc, setSortAsc] = useState(false);
  const [replayTrade, setReplayTrade] = useState<Trade | null>(null);
  const [replaySteps, setReplaySteps] = useState<string[]>([]);
  const [replayProgress, setReplayProgress] = useState(0);
  const [replayTimer, setReplayTimer] = useState<NodeJS.Timeout | null>(null);

  // Sorting handler
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  // Filter and sort trades
  const filteredTrades = trades
    .filter(t => {
      const matchSearch = t.symbol.toLowerCase().includes(search.toLowerCase());
      const matchSide = sideFilter === 'All' || t.side === sideFilter;
      return matchSearch && matchSide;
    })
    .sort((a, b) => {
      let valA: any = a[sortField];
      let valB: any = b[sortField];

      if (sortField === 'time') {
        const timeA = new Date(`2026-05-30T${a.time}:00Z`).getTime();
        const timeB = new Date(`2026-05-30T${b.time}:00Z`).getTime();
        valA = timeA;
        valB = timeB;
      }

      if (valA < valB) return sortAsc ? -1 : 1;
      if (valA > valB) return sortAsc ? 1 : -1;
      return 0;
    });

  // Export to actual CSV File download
  const handleExportCSV = () => {
    if (trades.length === 0) return;
    
    const headers = ['Time', 'Symbol', 'Side', 'Size', 'Entry Price', 'Exit Price', 'P&L', 'Status'];
    const rows = trades.map(t => [
      t.time,
      t.symbol,
      t.side,
      t.size,
      t.entryPrice,
      t.exitPrice,
      t.pnl,
      t.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `prop_firm_trade_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Start simulated trade execution replay
  const startReplay = (trade: Trade) => {
    if (replayTimer) clearInterval(replayTimer);
    
    setReplayTrade(trade);
    setReplayProgress(0);

    const steps = [
      `[info] STAGE 1: Routing ${trade.side} order for ${trade.size} units on ${trade.symbol}`,
      `[info] STAGE 2: Prime liquidity sweep matching global darkpools...`,
      `[fill] ORDER FILLED: Price level filled exactly at: $${trade.entryPrice.toLocaleString()}`,
      `[active] POSITION COMMITTED: Tracking real-time tick spread variance...`,
      `[active] TICK - Margin coverage verified: Leverage standard checked @ 1:100`,
      `[active] TICK - Delta hedge aligned, assessing maximum drawdowns...`,
      `[info] STAGE 3: Take-Profit / Stop-Loss safety brackets adjusted`,
      `[exit] EXIT EXECUTED: Position closed at target price level: $${trade.exitPrice.toLocaleString()}`,
      `[close] SETTLED: Profit balance calculated and swept to ledger`,
      `[pnl] RESULT: Trade concluded with ${trade.pnl >= 0 ? '+' : ''}$${trade.pnl.toLocaleString()} (${trade.status})`
    ];
    setReplaySteps(steps);

    let progress = 0;
    const interval = setInterval(() => {
      progress += 1;
      setReplayProgress(progress);
      if (progress >= steps.length) {
        clearInterval(interval);
      }
    }, 1100);

    setReplayTimer(interval);
  };

  const closeReplay = () => {
    if (replayTimer) clearInterval(replayTimer);
    setReplayTrade(null);
    setReplaySteps([]);
  };

  return (
    <div 
      id="trade-history-panel"
      className={`rounded-2xl border p-5 flex flex-col transition-all duration-300 relative ${
        isDark 
          ? 'bg-[#111827] border-gray-800' 
          : 'bg-white border-gray-200 shadow-sm'
      }`}
    >
      {/* Header and filters of table */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-inherit mb-4">
        <div>
          <h3 className="font-display font-bold text-sm tracking-tight">
            Executions Ledger / Trade Journal
          </h3>
          <p className="text-[10px] opacity-50 font-mono">
            Direct STP (Straight-Through Processing) Prop Firm Feed
          </p>
        </div>

        {/* Filters Panel Row */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Search */}
          <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs ${
            isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
          }`}>
            <Search className="h-3.5 w-3.5 text-gray-400" />
            <input
              id="trade-search-input"
              type="text"
              placeholder="Search ticker..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent border-0 outline-none text-[11px] w-24 text-inherit"
            />
          </div>

          {/* Side Filter */}
          <div className="flex rounded-lg overflow-hidden border border-inherit text-[11px] font-semibold">
            {['All', 'Buy', 'Sell'].map((label) => (
              <button
                key={label}
                id={`trade-filter-side-${label.toLowerCase()}`}
                onClick={() => setSideFilter(label as any)}
                className={`px-3 py-1.5 border-r last:border-0 border-inherit transition-all ${
                  sideFilter === label
                    ? isDark ? 'bg-gray-800 text-cyan-400' : 'bg-blue-50 text-blue-600'
                    : 'text-gray-400 hover:text-inherit'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* CSV Export Button */}
          <button
            id="export-csv-button"
            onClick={handleExportCSV}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-all border ${
              isDark 
                ? 'bg-gray-950/20 border-gray-800 text-gray-300 hover:bg-gray-800 hover:text-white' 
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-950'
            }`}
          >
            <Download className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Trades Table Render */}
      <div className="overflow-x-auto select-none">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className={`border-b text-[10px] opacity-60 font-mono uppercase tracking-wider ${
              isDark ? 'border-gray-800' : 'border-gray-250'
            }`}>
              <th className="pb-2.5 font-bold cursor-pointer hover:opacity-100" onClick={() => handleSort('time')}>
                <div className="flex items-center gap-1">
                  <span>Time</span>
                  <ArrowUpDown className="h-2.5 w-2.5" />
                </div>
              </th>
              <th className="pb-2.5 font-bold cursor-pointer hover:opacity-100" onClick={() => handleSort('symbol')}>
                <div className="flex items-center gap-1">
                  <span>Symbol</span>
                  <ArrowUpDown className="h-2.5 w-2.5" />
                </div>
              </th>
              <th className="pb-2.5 font-bold cursor-pointer hover:opacity-100" onClick={() => handleSort('side')}>
                <div className="flex items-center gap-1">
                  <span>Side</span>
                  <ArrowUpDown className="h-2.5 w-2.5" />
                </div>
              </th>
              <th className="pb-2.5 font-bold cursor-pointer hover:opacity-100 text-right" onClick={() => handleSort('size')}>
                <div className="flex items-center gap-1 justify-end">
                  <span>Size</span>
                  <ArrowUpDown className="h-2.5 w-2.5" />
                </div>
              </th>
              <th className="pb-2.5 font-bold text-right">Entry</th>
              <th className="pb-2.5 font-bold text-right font-semibold">Exit</th>
              <th className="pb-2.5 font-bold cursor-pointer hover:opacity-100 text-right" onClick={() => handleSort('pnl')}>
                <div className="flex items-center gap-1 justify-end">
                  <span>P&L</span>
                  <ArrowUpDown className="h-2.5 w-2.5" />
                </div>
              </th>
              <th className="pb-2.5 font-bold text-center">Status</th>
              <th className="pb-2.5 font-bold text-center">Replay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-inherit text-[11px] font-mono">
            {filteredTrades.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-8 text-center opacity-40">
                  No execution logs match the selected filter query.
                </td>
              </tr>
            ) : (
              filteredTrades.map((trade) => {
                const isPnlPositive = trade.pnl >= 0;
                return (
                  <tr 
                    key={trade.id} 
                    className={`transition-colors border-b last:border-0 ${
                      isDark 
                        ? 'border-gray-805/40 hover:bg-gray-900/30' 
                        : 'border-gray-150 hover:bg-gray-50/50'
                    }`}
                  >
                    <td className="py-2.5 opacity-70 flex items-center gap-1.5">
                      <Clock className="h-3 w-3 opacity-60 text-gray-500" />
                      <span>{trade.time}</span>
                    </td>
                    <td className="py-2.5 font-bold font-sans tracking-tight text-inherit uppercase">
                      {trade.symbol}
                    </td>
                    <td className="py-2.5">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold tracking-wide ${
                        trade.side === 'Buy'
                          ? 'text-emerald-500 bg-emerald-500/10'
                          : 'text-red-500 bg-red-500/10'
                      }`}>
                        {trade.side.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-2.5 text-right font-semibold opacity-85">
                      {trade.size} {trade.symbol.includes('BTC') ? 'BTC' : 'LOT'}
                    </td>
                    <td className="py-2.5 text-right opacity-80 select-all">
                      ${trade.entryPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 text-right opacity-80 select-all">
                      ${trade.exitPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className={`py-2.5 text-right font-bold ${
                      isPnlPositive ? 'text-emerald-500' : 'text-red-500'
                    }`}>
                      {isPnlPositive ? '+' : ''}${trade.pnl.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="py-2.5 text-center">
                      <span className={`inline-flex items-center gap-1 text-[9px] font-semibold py-0.5 px-2 rounded-full ${
                        trade.status === 'Win'
                          ? 'bg-emerald-550/10 text-emerald-500'
                          : 'bg-red-500/10 text-red-500'
                      }`}>
                        {trade.status === 'Win' ? (
                          <CheckCircle2 className="h-2.5 w-2.5" />
                        ) : (
                          <XCircle className="h-2.5 w-2.5" />
                        )}
                        <span>{trade.status}</span>
                      </span>
                    </td>
                    <td className="py-2.5 text-center">
                      <button
                        id={`btn-replay-trade-${trade.id}`}
                        onClick={() => startReplay(trade)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          isDark
                            ? 'hover:bg-cyan-500/15 border-gray-800 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/30'
                            : 'hover:bg-blue-50 border-gray-200 text-gray-500 hover:text-blue-600 hover:border-blue-300'
                        }`}
                        title="Replay Execution Ticks"
                      >
                        <Play className="h-2.5 w-2.5 stroke-[2.5]" />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Trade execution terminal replay slider */}
      <AnimatePresence>
        {replayTrade && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className={`w-full max-w-lg rounded-2xl border p-5 shadow-2xl relative ${
                isDark ? 'bg-[#111827] border-gray-805 text-white' : 'bg-slate-900 border-none text-white'
              }`}
            >
              <button
                id="btn-close-replay-modal"
                onClick={closeReplay}
                className="absolute top-4 right-4 p-1.5 rounded-md text-gray-400 hover:text-white hover:bg-gray-800/80 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-2.5 mb-4 pb-2 border-b border-gray-800">
                <Terminal className="h-4.5 w-4.5 text-cyan-400 animate-pulse" />
                <h4 className="font-display font-semibold text-sm">
                  STP Execution Replay Terminal: <span className="text-cyan-400 font-mono font-bold">{replayTrade.symbol}</span>
                </h4>
              </div>

              {/* Console log layout output */}
              <div className="bg-black/50 border border-gray-800 rounded-xl p-4 h-64 overflow-y-auto font-mono text-[10.5px] space-y-1.5 leading-relaxed custom-scrollbar">
                {replaySteps.slice(0, replayProgress).map((step, idx) => {
                  let colorClass = 'text-gray-300';
                  if (step.includes('[fill]')) colorClass = 'text-emerald-400 font-semibold';
                  if (step.includes('[exit]') || step.includes('[pnl]')) colorClass = 'text-cyan-400 font-semibold';
                  if (step.includes('[close]')) colorClass = 'text-yellow-400';
                  
                  return (
                    <div key={idx} className={colorClass}>
                      <span>{step}</span>
                    </div>
                  );
                })}
                {replayProgress < replaySteps.length && (
                  <div className="text-cyan-400/85 animate-pulse text-[10px] flex items-center gap-1">
                    <span className="inline-block bg-cyan-400 h-2 w-1.5 mr-1" />
                    <span>Latching live liquidity pools...</span>
                  </div>
                )}
              </div>

              {/* Progress and status */}
              <div className="mt-4 flex items-center justify-between text-xs font-mono">
                <span className="opacity-50 text-[10px]">
                  STEP {Math.min(replayProgress, replaySteps.length)} OF {replaySteps.length} COMPLETE
                </span>
                <span className={`font-semibold ${replayProgress >= replaySteps.length ? 'text-emerald-400' : 'text-yellow-400/85'}`}>
                  {replayProgress >= replaySteps.length ? 'REPLAY COMPLETE' : 'STREAMING...'}
                </span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
