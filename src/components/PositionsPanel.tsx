/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Layers, 
  TrendingUp, 
  TrendingDown, 
  PlusCircle, 
  ArrowUpRight, 
  ArrowDownRight,
  Calculator,
  Zap,
  DollarSign
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Position, Side, TradeSide } from '../types';

interface PositionsPanelProps {
  positions: Position[];
  isDark: boolean;
  selectedInstrument: string;
  currentPrice: number;
  onClosePosition: (id: string) => void;
  onOpenPosition: (symbol: string, side: Side, size: number, price: number, sl?: number, tp?: number) => void;
}

export default function PositionsPanel({
  positions,
  isDark,
  selectedInstrument,
  currentPrice,
  onClosePosition,
  onOpenPosition,
}: PositionsPanelProps) {
  const [activeTab, setActiveTab] = useState<'positions' | 'order-ticket'>('positions');
  
  // Order ticket state
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const [lotSize, setLotSize] = useState<number>(selectedInstrument.includes('BTC') ? 0.25 : 1.0);
  const [stopLoss, setStopLoss] = useState<string>('');
  const [takeProfit, setTakeProfit] = useState<string>('');

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPrice || lotSize <= 0) return;

    const parsedSl = stopLoss ? parseFloat(stopLoss) : undefined;
    const parsedTp = takeProfit ? parseFloat(takeProfit) : undefined;

    // A "Buy" is a Long position, a "Sell" is a Short position.
    const positionSide: Side = tradeType === 'buy' ? 'Long' : 'Short';
    
    onOpenPosition(
      selectedInstrument,
      positionSide,
      lotSize,
      currentPrice,
      parsedSl,
      parsedTp
    );

    // Reset inputs
    setStopLoss('');
    setTakeProfit('');
    setActiveTab('positions'); // Switch back to view positions
  };

  const setPercentSL = (pct: number) => {
    if (!currentPrice) return;
    const diff = currentPrice * (pct / 100);
    const slVal = tradeType === 'buy' ? currentPrice - diff : currentPrice + diff;
    setStopLoss(slVal.toFixed(selectedInstrument.includes('BTC') ? 2 : 5));
  };

  const setPercentTP = (pct: number) => {
    if (!currentPrice) return;
    const diff = currentPrice * (pct / 100);
    const tpVal = tradeType === 'buy' ? currentPrice + diff : currentPrice - diff;
    setTakeProfit(tpVal.toFixed(selectedInstrument.includes('BTC') ? 2 : 5));
  };

  return (
    <div 
      id="positions-panel-wrapper"
      className={`rounded-2xl border flex flex-col h-[405px] overflow-hidden transition-all duration-300 ${
        isDark 
          ? 'bg-[#111827] border-gray-800' 
          : 'bg-white border-gray-200 shadow-sm'
      }`}
    >
      {/* Tab select menu */}
      <div className={`flex items-center justify-between border-b px-4 py-2 bg-inherit`}>
        <div className="flex gap-2.5">
          <button
            id="positions-tab-button"
            onClick={() => setActiveTab('positions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-display tracking-tight transition-all relative ${
              activeTab === 'positions'
                ? isDark ? 'text-cyan-400 bg-gray-900 border border-gray-800' : 'text-blue-600 bg-gray-100'
                : 'text-gray-400 hover:text-inherit'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              <span>Positions ({positions.length})</span>
            </div>
          </button>

          <button
            id="orderticket-tab-button"
            onClick={() => setActiveTab('order-ticket')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-display tracking-tight transition-all relative ${
              activeTab === 'order-ticket'
                ? isDark ? 'text-cyan-400 bg-gray-900 border border-gray-800' : 'text-blue-600 bg-gray-100'
                : 'text-gray-400 hover:text-inherit'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Zap className="h-3.5 w-3.5" />
              <span>Place Order</span>
            </div>
          </button>
        </div>

        <span className="text-[10px] font-mono opacity-50 uppercase hidden md:inline">
          Asset: {selectedInstrument}
        </span>
      </div>

      {/* Content Container */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <AnimatePresence mode="wait">
          {activeTab === 'positions' ? (
            <motion.div
              key="positions-view"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-3"
            >
              {positions.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center h-[280px]">
                  <div className={`p-3 rounded-full mb-3 ${
                    isDark ? 'bg-gray-905/60 text-gray-700' : 'bg-gray-50 text-gray-400'
                  }`}>
                    <Layers className="h-7 w-7 stroke-[1.5]" />
                  </div>
                  <h4 className="text-xs font-semibold mb-1 opacity-75">No Open Commitments</h4>
                  <p className="text-[10px] opacity-50 max-w-[210px]">
                    Use the 'Place Order' ticket to trigger new trades on active indices.
                  </p>
                </div>
              ) : (
                positions.map((pos) => {
                  const isProfit = pos.pnl >= 0;
                  return (
                    <motion.div
                      key={pos.id}
                      layoutId={`position-card-${pos.id}`}
                      className={`p-3 rounded-xl border relative transition-all overflow-hidden ${
                        isDark 
                          ? 'bg-[#111827] border-gray-800 hover:border-gray-700' 
                          : 'bg-white border-gray-200 hover:shadow-md'
                      }`}
                    >
                      {/* Close Position Trigger */}
                      <button
                        id={`btn-close-pos-${pos.id}`}
                        onClick={() => onClosePosition(pos.id)}
                        className={`absolute top-2.5 right-2.5 p-1 rounded-md transition-colors ${
                          isDark 
                            ? 'hover:bg-gray-850 text-gray-500 hover:text-white' 
                            : 'hover:bg-gray-100 text-gray-400 hover:text-gray-950'
                        }`}
                        title="Close Position at Market Price"
                      >
                        <X className="h-3 w-3" />
                      </button>

                      {/* Top Header Row of Item */}
                      <div className="flex items-center gap-2 mb-2 pr-6">
                        <span className="font-mono font-bold text-xs uppercase text-inherit">
                          {pos.symbol}
                        </span>
                        
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase flex items-center gap-0.5 ${
                          pos.side === 'Long'
                            ? isDark ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : isDark ? 'bg-red-950/40 text-red-400 border border-red-500/20' : 'bg-red-50 text-red-700 border border-red-200'
                        }`}>
                          {pos.side === 'Long' ? (
                            <>
                              <ArrowUpRight className="h-2.5 w-2.5" />
                              <span>BUY</span>
                            </>
                          ) : (
                            <>
                              <ArrowDownRight className="h-2.5 w-2.5" />
                              <span>SELL</span>
                            </>
                          )}
                        </span>

                        <span className="font-mono text-[10px] opacity-60">
                          {pos.size} {pos.symbol.includes('BTC') ? 'BTC' : 'LOTs'}
                        </span>
                      </div>

                      {/* Main Metrics Block: Entry, Current, P&L */}
                      <div className="grid grid-cols-3 gap-2 py-1 bg-gray-500/5 rounded-lg px-2 text-center text-[11px] font-mono">
                        <div>
                          <span className="text-[9px] opacity-50 block uppercase">Entry</span>
                          <span className="font-semibold select-all">
                            {pos.entryPrice.toLocaleString(undefined, { 
                              minimumFractionDigits: pos.symbol.includes('BTC') ? 1 : 4 
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] opacity-50 block uppercase">Market Price</span>
                          <span className="font-semibold text-inherit select-all">
                            {pos.currentPrice.toLocaleString(undefined, { 
                              minimumFractionDigits: pos.symbol.includes('BTC') ? 1 : 4 
                            })}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] opacity-50 block uppercase">Target P&L</span>
                          <span className={`font-bold ${
                            isProfit ? 'text-emerald-500' : 'text-red-500'
                          }`}>
                            {isProfit ? '+' : ''}${pos.pnl.toLocaleString(undefined, { minimumFractionDigits: 1 })}
                          </span>
                        </div>
                      </div>

                      {/* Bottom row: SL, TP, percentage */}
                      <div className="flex items-center justify-between mt-2.5 text-[10px] font-mono">
                        <div className="flex gap-3 text-gray-500">
                          <span>SL: <strong className="text-inherit font-semibold">{pos.sl ? pos.sl.toLocaleString(undefined, { maximumFractionDigits: 4 }) : 'None'}</strong></span>
                          <span>TP: <strong className="text-inherit font-semibold">{pos.tp ? pos.tp.toLocaleString(undefined, { maximumFractionDigits: 4 }) : 'None'}</strong></span>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          isProfit 
                            ? 'text-emerald-500 bg-emerald-500/10' 
                            : 'text-red-500 bg-red-500/10'
                        }`}>
                          {isProfit ? '▲' : '▼'} {pos.pnlPercent.toFixed(2)}%
                        </span>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </motion.div>
          ) : (
            // ORDER TICKET FORM
            <motion.div
              key="order-ticket-view"
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="space-y-4"
            >
              <form onSubmit={handlePlaceOrder} className="space-y-3">
                {/* Side Selector Button */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="btn-orderticket-buy"
                    type="button"
                    onClick={() => setTradeType('buy')}
                    className={`py-2 rounded-xl text-center text-xs font-semibold font-display tracking-tight transition-all border ${
                      tradeType === 'buy'
                        ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/10 font-bold'
                        : isDark ? 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white' : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span>Buy / Long</span>
                    </div>
                  </button>
                  <button
                    id="btn-orderticket-sell"
                    type="button"
                    onClick={() => setTradeType('sell')}
                    className={`py-2 rounded-xl text-center text-xs font-semibold font-display tracking-tight transition-all border ${
                      tradeType === 'sell'
                        ? 'bg-red-500 text-white border-red-650 shadow-md shadow-red-500/10 font-bold'
                        : isDark ? 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white' : 'bg-gray-50 border-gray-200 text-gray-600'
                    }`}
                  >
                    <div className="flex items-center justify-center gap-1.5">
                      <TrendingDown className="h-3.5 w-3.5" />
                      <span>Sell / Short</span>
                    </div>
                  </button>
                </div>

                {/* Amount Size selector */}
                <div>
                  <div className="flex justify-between items-center mb-1 text-[10px] font-mono uppercase font-bold opacity-60">
                    <span>Position Size</span>
                    <span>Available Leverage ~1:100</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <input
                      id="order-size-input"
                      type="number"
                      step={selectedInstrument.includes('BTC') ? '0.01' : '0.1'}
                      min="0.01"
                      className={`w-full text-xs font-mono p-2 rounded-lg border outline-none ${
                        isDark 
                          ? 'bg-gray-900 border-gray-800 focus:border-cyan-400' 
                          : 'bg-gray-50 border-gray-200 focus:border-blue-600'
                      }`}
                      value={lotSize}
                      onChange={(e) => setLotSize(parseFloat(e.target.value) || 0)}
                      required
                    />
                    <span className="text-[10px] font-mono font-bold opacity-60 shrink-0 w-12 text-center">
                      {selectedInstrument.includes('BTC') ? 'BTC' : 'LOTs'}
                    </span>
                  </div>
                </div>

                {/* Stop Loss (SL) */}
                <div>
                  <div className="flex justify-between items-center mb-1 text-[10px] font-mono uppercase font-bold opacity-60">
                    <span>Stop Loss (SL Price)</span>
                    <div className="flex gap-1.5 text-[9px] lowercase opacity-75">
                      <button type="button" onClick={() => setPercentSL(1.5)} className="hover:underline">1.5% SL</button>
                      <span>•</span>
                      <button type="button" onClick={() => setPercentSL(3.0)} className="hover:underline">3% SL</button>
                    </div>
                  </div>
                  <input
                    id="order-sl-input"
                    type="text"
                    placeholder="Auto calculate or enter price"
                    className={`w-full text-xs font-mono p-2 rounded-lg border outline-none ${
                      isDark 
                        ? 'bg-gray-900 border-gray-800 focus:border-cyan-400' 
                        : 'bg-gray-50 border-gray-200 focus:border-blue-600'
                    }`}
                    value={stopLoss}
                    onChange={(e) => setStopLoss(e.target.value)}
                  />
                </div>

                {/* Take Profit (TP) */}
                <div>
                  <div className="flex justify-between items-center mb-1 text-[10px] font-mono uppercase font-bold opacity-60">
                    <span>Take Profit (TP Price)</span>
                    <div className="flex gap-1.5 text-[9px] lowercase opacity-75">
                      <button type="button" onClick={() => setPercentTP(3.0)} className="hover:underline">3% TP</button>
                      <span>•</span>
                      <button type="button" onClick={() => setPercentTP(6.0)} className="hover:underline">6% TP</button>
                    </div>
                  </div>
                  <input
                    id="order-tp-input"
                    type="text"
                    placeholder="Auto calculate or enter price"
                    className={`w-full text-xs font-mono p-2 rounded-lg border outline-none ${
                      isDark 
                        ? 'bg-gray-900 border-gray-800 focus:border-cyan-400' 
                        : 'bg-gray-50 border-gray-200 focus:border-blue-600'
                    }`}
                    value={takeProfit}
                    onChange={(e) => setTakeProfit(e.target.value)}
                  />
                </div>

                <button
                  id="btn-place-sim-order"
                  type="submit"
                  className={`w-full py-2.5 rounded-xl text-center text-xs font-bold tracking-wider font-display transition-all duration-300 flex items-center justify-center gap-2 border cursor-pointer mt-4 ${
                    tradeType === 'buy'
                      ? 'bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-600 hover:shadow-lg hover:shadow-emerald-500/10'
                      : 'bg-red-500 hover:bg-red-600 text-white border-red-600 hover:shadow-lg hover:shadow-red-500/10'
                  }`}
                >
                  <DollarSign className="h-4 w-4" />
                  <span>EXECUTE MARKET {tradeType.toUpperCase()}</span>
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
