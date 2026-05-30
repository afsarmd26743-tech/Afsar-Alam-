/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Briefcase, 
  Layers, 
  BarChart3, 
  ShieldAlert, 
  BookOpen, 
  Cpu, 
  Wallet, 
  Settings, 
  HelpCircle,
  TrendingDown,
  Activity,
  X,
  Bot,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDark: boolean;
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function Sidebar({ activeTab, setActiveTab, isDark, isOpen, onClose }: SidebarProps) {
  const sections = [
    {
      title: 'Main',
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'markets', label: 'Markets', icon: TrendingUp },
        { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
        { id: 'positions', label: 'Positions', icon: Layers },
      ]
    },
    {
      title: 'Analytics',
      items: [
        { id: 'alam-ai', label: 'Alam AI Agent', icon: Bot },
        { id: 'performance', label: 'Performance', icon: BarChart3 },
        { id: 'risk', label: 'Risk Analytics', icon: ShieldAlert },
        { id: 'journal', label: 'Trade Journal', icon: BookOpen },
        { id: 'tester', label: 'Strategy Tester', icon: Cpu },
      ]
    },
    {
      title: 'Account',
      items: [
        { id: 'wallet', label: 'Wallet', icon: Wallet },
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'support', label: 'Support', icon: HelpCircle },
      ]
    }
  ];

  return (
    <aside 
      id="sidebar-container"
      className={`fixed inset-y-0 left-0 z-50 lg:relative lg:z-0 w-64 flex flex-col border-r h-full transition-all duration-300 transform ${
        isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'
      } ${
        isDark 
          ? 'bg-[#111827] border-gray-800 text-gray-200' 
          : 'bg-[#F8F9FC] border-gray-200 text-gray-700'
      }`}
    >
      {/* Brand Header */}
      <div className="p-5 flex flex-col gap-2.5 border-b border-inherit select-none relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Logo element: </> resembling the brand image */}
            <div className={`h-10 w-10 rounded-lg flex items-center justify-center font-mono text-base select-none shrink-0 transition-all ${
              isDark 
                ? 'bg-[#0C1322] border border-cyan-500/20 shadow-[0_0_15px_rgba(56,189,248,0.2)]' 
                : 'bg-white border border-gray-200 shadow-sm'
            }`}>
              <span className={isDark ? 'text-[#38bdf8] font-bold' : 'text-blue-600 font-bold'}>&lt;</span>
              <span className="text-[#2563eb] mx-[0.5px] font-black">/</span>
              <span className={isDark ? 'text-[#38bdf8] font-bold' : 'text-blue-600 font-bold'}>&gt;</span>
            </div>
            <div>
              <h1 className="font-sans font-bold text-xl tracking-tight leading-none">
                <span className={isDark ? 'text-white' : 'text-gray-900'}>alam</span>
                <span className={isDark ? 'text-[#38bdf8]' : 'text-blue-600'}>.dev</span>
              </h1>
            </div>
          </div>

          {/* Close button - visually highlighted on mobile */}
          <button
            id="sidebar-close-button"
            onClick={onClose}
            title="Close Menu"
            className="lg:hidden p-2 rounded-lg border border-red-500/40 bg-red-500/10 text-red-500 hover:bg-red-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          >
            <X className="h-4.5 w-4.5 stroke-[2.5]" />
          </button>
        </div>
        <div>
          <span className={`text-[8.5px] font-sans font-semibold tracking-wider uppercase block ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            THE DEVELOPER'S TRADING DASHBOARD
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-7 custom-scrollbar select-none">
        {sections.map((section) => (
          <div key={section.title} className="space-y-2">
            <h3 className={`px-3 text-[11px] font-mono uppercase tracking-widest ${
              isDark ? 'text-gray-500' : 'text-gray-400'
            }`}>
              {section.title}
            </h3>
            <nav className="space-y-1">
              {section.items.map((item) => {
                const IconComponent = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    id={`sidebar-item-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                      isActive
                        ? isDark 
                          ? 'text-cyan-400 bg-cyan-950/20' 
                          : 'text-blue-600 bg-blue-50'
                        : isDark
                          ? 'text-gray-400 hover:text-white hover:bg-gray-800/40'
                          : 'text-gray-600 hover:text-gray-950 hover:bg-gray-100'
                    }`}
                  >
                    {/* Animated current selection indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeIndicator"
                        className={`absolute left-0 top-2 bottom-2 w-1 rounded-r-md ${
                          isDark ? 'bg-cyan-400' : 'bg-blue-600'
                        }`}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    <IconComponent className={`h-4.5 w-4.5 transition-transform duration-200 group-hover:scale-105 ${
                      isActive 
                        ? 'stroke-[2]' 
                        : 'opacity-70 group-hover:opacity-100'
                    }`} />
                    
                    <span className="truncate flex-1 text-left">{item.label}</span>
                    {item.id === 'alam-ai' && (
                      <span className={`text-[8px] tracking-widest font-mono font-extrabold px-1.5 py-0.5 rounded-full select-none ${
                        isActive
                          ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
                          : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/10'
                      }`}>
                        AI
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>
        ))}
      </div>

      {/* Status Footer */}
      <div className="p-4 border-t border-inherit">
        <div className={`p-3 rounded-xl flex items-center justify-between text-xs ${
          isDark ? 'bg-gray-900/40' : 'bg-gray-100/60'
        }`}>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-gray-500">NETWORK OK</span>
          </div>
          <span className={`font-mono text-[10px] ${isDark ? 'text-cyan-500' : 'text-blue-600'}`}>
            V2.4_LIVE
          </span>
        </div>
      </div>
    </aside>
  );
}
