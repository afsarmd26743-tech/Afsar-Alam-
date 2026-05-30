/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import TradingViewChart from './components/TradingViewChart';
import OrderBook from './components/OrderBook';
import PositionsPanel from './components/PositionsPanel';
import TradeHistory from './components/TradeHistory';
import RetailMetrics from './components/RetailMetrics';
import InstitutionalMetrics from './components/InstitutionalMetrics';
import SubPages from './components/SubPages';
import AlamAgent from './components/AlamAgent';
import { Position, Trade, MarketInstrument, Side } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isDark, setIsDark] = useState<boolean>(true); // Default to Institutional (Dark)
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTCUSD');
  const [balance, setBalance] = useState<number>(25000);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

  // Initial Markets Core Data
  const [instruments, setInstruments] = useState<MarketInstrument[]>([
    { symbol: 'BTCUSD', name: 'Bitcoin / US Dollar Spot', category: 'Crypto', price: 102500, change: 4.88, high: 107200, low: 99400, volume: '$32.4B', tvSymbol: 'BINANCE:BTCUSDT' },
    { symbol: 'EURUSD', name: 'Euro / US Dollar Spot', category: 'Forex', price: 1.08480, change: 2.41, high: 1.08900, low: 1.08100, volume: '$11.8B', tvSymbol: 'FX:EURUSD' },
    { symbol: 'XAUUSD', name: 'Gold / US Dollar Spot', category: 'Commodities', price: 2348.50, change: -0.32, high: 2362.40, low: 2341.00, volume: '$24.1B', tvSymbol: 'OANDA:XAUUSD' },
    { symbol: 'AAPL', name: 'Apple Inc. Common Stock', category: 'Stocks', price: 189.43, change: 1.65, high: 191.00, low: 187.50, volume: '$8.2B', tvSymbol: 'NASDAQ:AAPL' },
    { symbol: 'SPY', name: 'SPDR S&P 500 ETF Trust', category: 'Indices', price: 512.45, change: 0.72, high: 515.20, low: 509.40, volume: '$19.5B', tvSymbol: 'AMEX:SPY' },
  ]);

  // Initial Active Positions (Long, Short)
  const [positions, setPositions] = useState<Position[]>([
    { id: 'pos1', symbol: 'EURUSD', side: 'Long', size: 5.0, entryPrice: 1.08240, currentPrice: 1.08480, sl: 1.07900, tp: 1.09000, pnl: 1200, pnlPercent: 2.4, time: '12:14' },
    { id: 'pos2', symbol: 'BTCUSD', side: 'Short', size: 0.85, entryPrice: 106500, currentPrice: 102500, sl: 111000, tp: 98000, pnl: 3400, pnlPercent: 4.8, time: '14:26' },
  ]);

  // Initial Trade History executions ledger
  const [trades, setTrades] = useState<Trade[]>([
    { id: 'tr1', time: '10:30', symbol: 'BTCUSD', side: 'Buy', entryPrice: 105000, exitPrice: 106000, size: 1.0, pnl: 1000, status: 'Win' },
    { id: 'tr2', time: '08:15', symbol: 'EURUSD', side: 'Sell', entryPrice: 1.08500, exitPrice: 1.08200, size: 4.0, pnl: 1200, status: 'Win' },
    { id: 'tr3', time: '06:40', symbol: 'XAUUSD', side: 'Buy', entryPrice: 2345.50, exitPrice: 2341.20, size: 10.0, pnl: -430, status: 'Loss' },
  ]);

  // Custom balance helper
  const handleAdjustBalance = (delta: number) => {
    setBalance(prev => Math.max(100, prev + delta));
  };

  // Helper to open a position from Order ticket
  const handleOpenPosition = useCallback((
    symbol: string,
    side: Side,
    size: number,
    price: number,
    sl?: number,
    tp?: number
  ) => {
    const id = `pos_${Date.now()}`;
    const timeStr = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
    
    const newPos: Position = {
      id,
      symbol,
      side,
      size,
      entryPrice: price,
      currentPrice: price,
      sl,
      tp,
      pnl: 0,
      pnlPercent: 0,
      time: timeStr
    };

    setPositions(prev => [newPos, ...prev]);
  }, []);

  // Helper calculation to obtain a contract multiplier based on symbol rules
  const getMultiplier = (symbol: string) => {
    if (symbol.includes('BTC')) return 1; // 1 to 1 usd moves
    if (symbol.includes('EUR')) return 100000; // 1 standardized Lot is 100k
    if (symbol.includes('XAU')) return 100; // Gold contracts (100 oz per lot)
    return 100; // default standard contract
  };

  // Helper to close a position and settle ledger balance
  const handleClosePosition = useCallback((id: string) => {
    const targetPos = positions.find(p => p.id === id);
    if (!targetPos) return;

    // Filter position away
    setPositions(prev => prev.filter(p => p.id !== id));

    // Sweep profit to available balance
    setBalance(prev => prev + targetPos.pnl);

    // Create trade log
    const timeStr = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: false });
    const newTrade: Trade = {
      id: `tr_${Date.now()}`,
      time: timeStr,
      symbol: targetPos.symbol,
      side: targetPos.side === 'Long' ? 'Buy' : 'Sell',
      entryPrice: targetPos.entryPrice,
      exitPrice: targetPos.currentPrice,
      size: targetPos.size,
      pnl: targetPos.pnl,
      status: targetPos.pnl >= 0 ? 'Win' : 'Loss'
    };

    setTrades(prev => [newTrade, ...prev]);
  }, [positions]);

  // LIVE NETWORK TICK ACTION: Updates tickers and recalculates current open position prices & PnLs
  useEffect(() => {
    const tickInterval = setInterval(() => {
      // 1. Shift instruments slightly
      setInstruments(prev => 
        prev.map(inst => {
          const shiftPct = (Math.random() * 0.12 - 0.05) / 100; // shift -0.05% to +0.07%
          const updatedPrice = inst.price * (1 + shiftPct);
          return {
            ...inst,
            price: updatedPrice,
            high: Math.max(inst.high, updatedPrice),
            low: Math.min(inst.low, updatedPrice),
          };
        })
      );
    }, 1500);

    return () => clearInterval(tickInterval);
  }, []);

  // Sync position prices when instruments update
  useEffect(() => {
    setPositions(prevPositions => {
      const updated = prevPositions.map(pos => {
        const matchingInst = instruments.find(i => i.symbol === pos.symbol);
        if (!matchingInst) return pos;

        const currentPrice = matchingInst.price;
        const multiplier = getMultiplier(pos.symbol);

        // Recalculate P&L absolute and percentage
        const delta = pos.side === 'Long' 
          ? (currentPrice - pos.entryPrice) 
          : (pos.entryPrice - currentPrice);

        const pnl = delta * pos.size * multiplier;
        const pnlPercent = (delta / pos.entryPrice) * 100;

        return {
          ...pos,
          currentPrice,
          pnl,
          pnlPercent,
        };
      });

      return updated;
    });
  }, [instruments]);

  // Calculate dynamic aggregated portfolio indicators
  const openPositionsPnl = positions.reduce((sum, pos) => sum + pos.pnl, 0);
  const equity = balance + openPositionsPnl;
  const todayPnl = openPositionsPnl + 840; // Simulated performance return index offset
  const todayPnlPercent = (todayPnl / balance) * 100;
  
  const activeInstrumentPrice = instruments.find(i => i.symbol === selectedSymbol)?.price || 0;

  return (
    <div 
      className={`min-h-screen flex text-sm transition-all duration-300 font-sans ${
        isDark ? 'bg-[#0B1220] text-gray-200' : 'bg-gray-100 text-gray-800'
      }`}
    >
      {/* Mobile Drawer Overlay Backdrop */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      {/* 1. Left Drawer navigation rail */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        isDark={isDark} 
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* 2. Main content viewport section */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        {/* Header toolbar */}
        <Header 
          isDark={isDark} 
          setIsDark={setIsDark}
          selectedInstrument={selectedSymbol}
          setSelectedInstrument={setSelectedSymbol}
          instruments={instruments}
          retailBalance={balance}
          onToggleSidebar={() => setIsSidebarOpen(prevState => !prevState)}
        />

        {/* Dashboard Frame or Auxiliary pages inside central grid */}
        <main className="flex-1 px-6 py-6 overflow-y-auto custom-scrollbar">
          {activeTab === 'dashboard' ? (
            <div className="space-y-6">
              
              {/* Dynamic KPI block based on active Mode Selector */}
              {isDark ? (
                <InstitutionalMetrics 
                  isDark={isDark} 
                  onSymbolSelect={setSelectedSymbol} 
                />
              ) : (
                <RetailMetrics 
                  balance={balance}
                  equity={equity}
                  todayPnl={todayPnl}
                  todayPnlPercent={todayPnlPercent}
                  marginLevel={1450} 
                  isDark={isDark}
                />
              )}

              {/* Central Grid: TradingView Center vs Orderbook + Positions sidebar */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                
                {/* Center Chart area (8cols of 12) */}
                <div className="lg:col-span-8 space-y-5">
                  <TradingViewChart 
                    symbol={selectedSymbol}
                    isDark={isDark}
                    onSymbolSelect={setSelectedSymbol}
                    instruments={instruments}
                  />
                </div>

                {/* Right sidebars (4cols of 12) */}
                <div className="lg:col-span-4 space-y-5">
                  <OrderBook 
                    symbol={selectedSymbol}
                    isDark={isDark}
                    currentPrice={activeInstrumentPrice}
                  />

                  <PositionsPanel 
                    positions={positions}
                    isDark={isDark}
                    selectedInstrument={selectedSymbol}
                    currentPrice={activeInstrumentPrice}
                    onClosePosition={handleClosePosition}
                    onOpenPosition={handleOpenPosition}
                  />
                </div>

              </div>

              {/* Bottom Executions trade history log */}
              <div className="w-full">
                <TradeHistory 
                  trades={trades} 
                  isDark={isDark} 
                />
              </div>

            </div>
          ) : activeTab === 'alam-ai' ? (
            <AlamAgent 
              isDark={isDark}
              selectedSymbol={selectedSymbol}
              instruments={instruments}
              onOpenPosition={handleOpenPosition}
              onSymbolSelect={setSelectedSymbol}
              retailBalance={balance}
            />
          ) : (
            // Auxiliary internal subpages
            <SubPages 
              activeTab={activeTab}
              isDark={isDark}
              instruments={instruments}
              onSymbolSelect={setSelectedSymbol}
              retailBalance={balance}
              onAdjustBalance={handleAdjustBalance}
              onOpenPosition={handleOpenPosition}
            />
          )}
        </main>
      </div>

    </div>
  );
}
