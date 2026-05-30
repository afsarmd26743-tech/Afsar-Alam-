/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  User, 
  ChevronDown, 
  Sparkles, 
  ShieldAlert, 
  TrendingUp, 
  Briefcase,
  AlertTriangle,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  isDark: boolean;
  setIsDark: (dark: boolean) => void;
  selectedInstrument: string;
  setSelectedInstrument: (symbol: string) => void;
  instruments: { symbol: string; name: string; category: string; price: number }[];
  retailBalance: number;
  onToggleSidebar: () => void;
}

export default function Header({ 
  isDark, 
  setIsDark, 
  selectedInstrument, 
  setSelectedInstrument, 
  instruments,
  retailBalance,
  onToggleSidebar
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifications = [
    { id: 1, title: 'Margin Call Safety Alert Check', type: 'info', desc: 'Margin status healthy at 1,450%', time: 'Just now' },
    { id: 2, title: 'High-Impact Economic Release', type: 'warning', desc: 'US Core PCE Price Index in 4 Hours', time: '10m ago' },
    { id: 3, title: 'Prop Target Approaching', type: 'success', desc: 'Current Profit is +8.4% towards $+10% goal', time: '1h ago' }
  ];

  const filteredInstruments = instruments.filter(inst => 
    inst.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inst.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header 
      id="header-bar"
      className={`h-16 border-b flex items-center justify-between px-4 sm:px-6 transition-colors duration-300 relative z-30 ${
        isDark 
          ? 'bg-[#111827] border-gray-800 text-white' 
          : 'bg-white border-gray-200 text-gray-800'
      }`}
    >
      {/* Selection search / Command Pallet */}
      <div className="flex items-center gap-2 relative max-w-[200px] xs:max-w-[280px] sm:max-w-sm md:max-w-md lg:w-96 flex-1">
        {/* Hamburger menu for mobile */}
        <button
          id="mobile-sidebar-toggle"
          onClick={onToggleSidebar}
          title="Open Menu"
          className={`lg:hidden p-1.5 rounded-lg border transition-colors shrink-0 flex items-center justify-center ${
            isDark 
              ? 'border-gray-800 text-gray-400 hover:text-white hover:bg-gray-800' 
              : 'border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Menu className="h-4.5 w-4.5 stroke-[2]" />
        </button>

        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border w-full transition-all ${
          isDark 
            ? 'bg-gray-900/60 border-gray-800 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/15' 
            : 'bg-gray-50 border-gray-200 focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600/15'
        }`}>
          <Search className="h-4 w-4 text-gray-400" />
          <input
            id="search-ticker-input"
            type="text"
            placeholder="Search symbols (e.g. BTCUSD, EURUSD)..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearchDropdown(true);
            }}
            onFocus={() => setShowSearchDropdown(true)}
            className="bg-transparent border-0 outline-none text-xs w-full text-inherit placeholder:text-gray-400"
          />
        </div>

        {/* Dropdown for search results */}
        <AnimatePresence>
          {showSearchDropdown && searchQuery && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setShowSearchDropdown(false)}
              />
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className={`absolute left-0 top-11 w-full rounded-xl border p-2 shadow-xl z-50 overflow-hidden ${
                  isDark 
                    ? 'bg-[#111827] border-gray-800 text-gray-200' 
                    : 'bg-white border-gray-200 text-gray-800'
                }`}
              >
                <div className="text-[10px] font-mono tracking-wider opacity-50 px-3 py-1 uppercase">
                  Matching Instruments
                </div>
                {filteredInstruments.length === 0 ? (
                  <div className="text-xs opacity-50 px-3 py-2">No symbols match "{searchQuery}"</div>
                ) : (
                  filteredInstruments.map((inst) => (
                    <button
                      key={inst.symbol}
                      id={`search-item-${inst.symbol}`}
                      onClick={() => {
                        setSelectedInstrument(inst.symbol);
                        setSearchQuery('');
                        setShowSearchDropdown(false);
                      }}
                      className={`relative w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors ${
                        isDark 
                          ? 'hover:bg-gray-850 hover:text-cyan-400' 
                          : 'hover:bg-gray-100 hover:text-blue-600'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-semibold">{inst.symbol}</span>
                        <span className="opacity-50 text-[10px]">{inst.name}</span>
                      </div>
                      <span className="font-mono">${inst.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </button>
                  ))
                )}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Center Instrument Mini Details */}
      <div className="hidden lg:flex items-center gap-6">
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] font-mono opacity-50 uppercase tracking-widest block">Active Terminal</span>
            <span className="text-sm font-semibold font-display tracking-tight text-inherit">
              {selectedInstrument}
            </span>
          </div>
          <div className={`h-8 w-[1px] ${isDark ? 'bg-gray-850' : 'bg-gray-200'}`} />
          <div className="text-left font-mono">
            <span className="text-[10px] opacity-50 uppercase tracking-widest block">Last Execution Price</span>
            <span className={`text-sm font-bold ${
              isDark ? 'text-cyan-400' : 'text-blue-600'
            }`}>
              ${(instruments.find(i => i.symbol === selectedInstrument)?.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Operations Panel (Modes Toggle & Profiles) */}
      <div className="flex items-center gap-4">
        
        {/* Toggle Mode Control - Premium Visual Pill Selector */}
        <div className={`p-1 rounded-xl flex items-center gap-1 ${
          isDark ? 'bg-gray-900 border border-gray-800' : 'bg-gray-100'
        }`}>
          <button
            id="toggle-mode-retail"
            onClick={() => setIsDark(false)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
              !isDark
                ? 'bg-white text-blue-600 shadow-md transform scale-102 font-bold'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            <TrendingUp className="h-3.5 w-3.5" />
            <span>Retail</span>
          </button>
          
          <button
            id="toggle-mode-institutional"
            onClick={() => setIsDark(true)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
              isDark
                ? 'bg-gray-800 text-cyan-400 shadow-[0_0_12px_rgba(0,229,255,0.2)] font-bold'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Institutional</span>
          </button>
        </div>

        <div className={`h-6 w-[1px] ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`} />

        {/* Notifications Tray */}
        <div className="relative">
          <button
            id="notifications-bell-button"
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-lg border transition-colors relative ${
              isDark
                ? 'hover:bg-gray-800 border-gray-850 text-gray-400 hover:text-white'
                : 'hover:bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-950'
            }`}
          >
            <Bell className="h-4.5 w-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-transparent animate-pulse" />
          </button>

          {/* Notifications Dropdown Drawer */}
          <AnimatePresence>
            {showNotifications && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowNotifications(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 15, scale: 0.95 }}
                  className={`absolute right-0 top-11 w-80 rounded-xl border shadow-2xl p-4 z-50 text-xs ${
                    isDark 
                      ? 'bg-[#111827] border-gray-805 text-white shadow-cyan-950/20' 
                      : 'bg-white border-gray-250 text-gray-805'
                  }`}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-inherit mb-3">
                    <span className="font-semibold tracking-tight text-sm">System Bulletins</span>
                    <button 
                      onClick={() => setShowNotifications(false)}
                      className="text-xs opacity-50 hover:opacity-100"
                    >
                      Clear all
                    </button>
                  </div>
                  <div className="space-y-3">
                    {notifications.map(n => (
                      <div key={n.id} className="space-y-1">
                        <div className="flex items-start gap-1.5">
                          {n.type === 'warning' ? (
                            <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                          ) : (
                            <ShieldAlert className="h-3.5 w-3.5 text-blue-500 shrink-0 mt-0.5" />
                          )}
                          <div>
                            <span className="font-medium block leading-snug">{n.title}</span>
                            <span className="opacity-60 text-[10px] block leading-tight">{n.desc}</span>
                          </div>
                        </div>
                        <span className="font-mono text-[9px] opacity-40 block text-right">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Profile Card */}
        <div className={`flex items-center gap-3 pl-2 border-l ${
          isDark ? 'border-gray-800' : 'border-gray-200'
        }`}>
          <div className={`p-2 rounded-full relative overflow-hidden flex items-center justify-center ${
            isDark ? 'bg-cyan-950/40 text-cyan-400' : 'bg-blue-50 text-blue-600'
          }`}>
            <User className="h-4.5 w-4.5" />
          </div>
          <div className="hidden md:block text-left">
            <span className="text-xs font-semibold block leading-tight text-inherit">Afsar Md</span>
            <span className="text-[9px] font-mono opacity-50 block tracking-tight uppercase leading-none">
              PROP TRADER • LVL 3
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
