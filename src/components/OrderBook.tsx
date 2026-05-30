/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RefreshCw, TrendingDown, TrendingUp } from 'lucide-react';

interface OrderBookProps {
  symbol: string;
  isDark: boolean;
  currentPrice: number;
}

interface OrderItem {
  price: number;
  size: number;
  total: number;
}

export default function OrderBook({ symbol, isDark, currentPrice }: OrderBookProps) {
  const [bids, setBids] = useState<OrderItem[]>([]);
  const [asks, setAsks] = useState<OrderItem[]>([]);
  const [spread, setSpread] = useState(0);
  const [spreadPercent, setSpreadPercent] = useState(0);
  const [lastDirection, setLastDirection] = useState<'up' | 'down'>('up');

  // Initialize and update order book based on selected symbol price
  useEffect(() => {
    if (!currentPrice) return;

    // Generate static sensible increments
    const pipSize = currentPrice * 0.0001; // Scale steps appropriately for BTC vs EURUSD
    const tickCount = 7;

    const generateAsks = () => {
      let accum = 0;
      const list: OrderItem[] = [];
      for (let i = 1; i <= tickCount; i++) {
        const p = currentPrice + (i * pipSize) + (Math.random() * pipSize * 0.1);
        const s = Math.random() * (symbol.includes('BTC') ? 1.5 : 240);
        accum += s;
        list.push({ price: p, size: s, total: accum });
      }
      // Revert asks so highest price is at top
      return list.reverse();
    };

    const generateBids = () => {
      let accum = 0;
      const list: OrderItem[] = [];
      for (let i = 1; i <= tickCount; i++) {
        const p = currentPrice - (i * pipSize) - (Math.random() * pipSize * 0.1);
        const s = Math.random() * (symbol.includes('BTC') ? 1.5 : 240);
        accum += s;
        list.push({ price: p, size: s, total: accum });
      }
      return list;
    };

    setAsks(generateAsks());
    setBids(generateBids());

  }, [symbol, currentPrice]);

  // Handle high frequency tick mutations simulating WebSockets
  useEffect(() => {
    const handleTicker = setInterval(() => {
      if (bids.length === 0 || asks.length === 0) return;

      // Randomly update bids or asks slightly
      const mutateAsks = [...asks];
      const mutateBids = [...bids];

      // Mutate ask
      const rAskIdx = Math.floor(Math.random() * asks.length);
      mutateAsks[rAskIdx] = {
        ...mutateAsks[rAskIdx],
        size: Math.max(0.01, mutateAsks[rAskIdx].size + (Math.random() - 0.5) * (symbol.includes('BTC') ? 0.1 : 12))
      };

      // Mutate bid
      const rBidIdx = Math.floor(Math.random() * bids.length);
      mutateBids[rBidIdx] = {
        ...mutateBids[rBidIdx],
        size: Math.max(0.01, mutateBids[rBidIdx].size + (Math.random() - 0.5) * (symbol.includes('BTC') ? 0.1 : 12))
      };

      // Recalculate totals
      let askAccum = 0;
      // Revert and go asc to calculate cumulative totals for asks
      const sortedAsksDesc = [...mutateAsks].reverse();
      const recalculatedAsks = sortedAsksDesc.map(item => {
        askAccum += item.size;
        return { ...item, total: askAccum };
      }).reverse();

      let bidAccum = 0;
      const recalculatedBids = mutateBids.map(item => {
        bidAccum += item.size;
        return { ...item, total: bidAccum };
      });

      // Spread
      const topBid = recalculatedBids[0]?.price || 0;
      const topAsk = recalculatedAsks[recalculatedAsks.length - 1]?.price || 0;
      const sp = Math.abs(topAsk - topBid);
      const spPercent = (sp / currentPrice) * 100;

      setAsks(recalculatedAsks);
      setBids(recalculatedBids);
      setSpread(sp);
      setSpreadPercent(spPercent);
      setLastDirection(Math.random() > 0.5 ? 'up' : 'down');

    }, 700);

    return () => clearInterval(handleTicker);
  }, [bids, asks, symbol, currentPrice]);

  // Max cumulative size to compute horizontal fill ratios
  const maxTotal = Math.max(
    asks.length > 0 ? asks[0].total : 1,
    bids.length > 0 ? bids[bids.length - 1].total : 1
  );

  return (
    <div 
      id="orderbook-container"
      className={`rounded-2xl border p-4 flex flex-col h-[325px] overflow-hidden select-none transition-all duration-300 ${
        isDark 
          ? 'bg-[#111827] border-gray-800' 
          : 'bg-white border-gray-200'
      }`}
    >
      {/* Title Header */}
      <div className="flex items-center justify-between pb-2 border-b border-inherit mb-3">
        <h3 className="font-display font-semibold text-xs tracking-wide">
          Live Order Book
        </h3>
        <span className="text-[9px] font-mono opacity-50 bg-gray-150 p-1 rounded uppercase tracking-wider scale-90">
          WS Stream Active
        </span>
      </div>

      {/* Grid Table Columns */}
      <div className="grid grid-cols-3 text-[10px] uppercase font-mono opacity-50 font-bold pb-1.5 px-1">
        <span>Price</span>
        <span className="text-right">Size</span>
        <span className="text-right">Total ({symbol.includes('BTC') ? 'BTC' : 'LOT'})</span>
      </div>

      {/* Order Book Depth Layout Container */}
      <div className="flex-1 flex flex-col justify-between overflow-y-auto text-xs font-mono">
        
        {/* ASKS (Sells) - Render is DESC to keep matching OrderBook styles (highest asks on top) */}
        <div className="space-y-[2px]">
          {asks.slice(0, 5).map((ask, idx) => {
            const widthPct = Math.min(100, (ask.total / maxTotal) * 100);
            return (
              <div 
                key={`ask-${idx}`}
                className="relative grid grid-cols-3 items-center py-0.5 px-1 hover:bg-gray-150/5 cursor-pointer rounded"
              >
                {/* Horizontal Depth Tint */}
                <div 
                  className={`absolute right-0 top-0 bottom-0 pointer-events-none transition-all duration-300 opacity-[0.06] ${
                    isDark ? 'bg-red-500' : 'bg-red-600'
                  }`}
                  style={{ width: `${widthPct}%` }}
                />
                
                {/* Ask Price */}
                <span className="text-red-500 font-medium">
                  {ask.price.toLocaleString(undefined, { 
                    minimumFractionDigits: symbol.includes('BTC') ? 2 : 5,
                    maximumFractionDigits: symbol.includes('BTC') ? 2 : 5
                  })}
                </span>
                
                {/* Size */}
                <span className="text-right opacity-80">
                  {ask.size.toFixed(symbol.includes('BTC') ? 3 : 1)}
                </span>
                
                {/* Cumulative total */}
                <span className="text-right opacity-50">
                  {ask.total.toFixed(symbol.includes('BTC') ? 2 : 1)}
                </span>
              </div>
            );
          })}
        </div>

        {/* SPREAD DIVIDER CARD */}
        <div className={`py-1 my-1.5 border-y flex items-center justify-between px-2 text-xs select-none ${
          isDark ? 'border-gray-800 bg-gray-900/40' : 'border-gray-200 bg-gray-50'
        }`}>
          <div className="flex items-center gap-1.5 font-bold">
            {lastDirection === 'up' ? (
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
            ) : (
              <TrendingDown className="h-3.5 w-3.5 text-red-500 shrink-0" />
            )}
            <span className={lastDirection === 'up' ? 'text-emerald-500' : 'text-red-500'}>
              {currentPrice.toLocaleString(undefined, { 
                minimumFractionDigits: symbol.includes('BTC') ? 2 : 4,
                maximumFractionDigits: symbol.includes('BTC') ? 2 : 4
              })}
            </span>
          </div>

          <div className="text-[10px] text-right font-mono opacity-55">
            <span>Spread: </span>
            <span className="font-semibold text-inherit">
              {spread.toLocaleString(undefined, { 
                maximumFractionDigits: symbol.includes('BTC') ? 2 : 5
              })} ({spreadPercent.toFixed(3)}%)
            </span>
          </div>
        </div>

        {/* BIDS (Buys) */}
        <div className="space-y-[2px]">
          {bids.slice(0, 5).map((bid, idx) => {
            const widthPct = Math.min(100, (bid.total / maxTotal) * 100);
            return (
              <div 
                key={`bid-${idx}`}
                className="relative grid grid-cols-3 items-center py-0.5 px-1 hover:bg-gray-150/5 cursor-pointer rounded"
              >
                {/* Horizontal Depth Tint */}
                <div 
                  className={`absolute right-0 top-0 bottom-0 pointer-events-none transition-all duration-300 opacity-[0.06] ${
                    isDark ? 'bg-emerald-500' : 'bg-emerald-600'
                  }`}
                  style={{ width: `${widthPct}%` }}
                />
                
                {/* Bid Price */}
                <span className="text-emerald-500 font-medium font-semibold">
                  {bid.price.toLocaleString(undefined, { 
                    minimumFractionDigits: symbol.includes('BTC') ? 2 : 5,
                    maximumFractionDigits: symbol.includes('BTC') ? 2 : 5
                  })}
                </span>
                
                {/* Size */}
                <span className="text-right opacity-80">
                  {bid.size.toFixed(symbol.includes('BTC') ? 3 : 1)}
                </span>
                
                {/* Cumulative total */}
                <span className="text-right opacity-50">
                  {bid.total.toFixed(symbol.includes('BTC') ? 2 : 1)}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
