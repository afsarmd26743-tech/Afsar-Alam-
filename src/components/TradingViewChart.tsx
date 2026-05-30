/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  Settings, 
  Layers, 
  TrendingUp, 
  Clock, 
  Compass, 
  Eye, 
  Activity,
  Award
} from 'lucide-react';
import { motion } from 'motion/react';

interface TradingViewChartProps {
  symbol: string;
  isDark: boolean;
  onSymbolSelect: (symbol: string) => void;
  instruments: { symbol: string; name: string; category: string; price: number; change: number; tvSymbol: string }[];
}

export default function TradingViewChart({ symbol, isDark, onSymbolSelect, instruments }: TradingViewChartProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [timeframe, setTimeframe] = useState('60'); // '1', '5', '15', '60', '240', 'D'
  const containerRef = useRef<HTMLDivElement>(null);

  // Map our internal simplified symbols to official TradingView symbols
  const getTvSymbol = (sym: string) => {
    const inst = instruments.find(i => i.symbol === sym);
    return inst ? inst.tvSymbol : `BINANCE:${sym}T`;
  };

  const timeframes = [
    { label: '1m', value: '1' },
    { label: '5m', value: '5' },
    { label: '15m', value: '15' },
    { label: '1H', value: '60' },
    { label: '4H', value: '240' },
    { label: '1D', value: 'D' },
    { label: '1W', value: 'W' },
  ];

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error("Error enabling fullscreen mode:", err);
      });
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFSChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFSChange);
    return () => document.removeEventListener('fullscreenchange', handleFSChange);
  }, []);

  const activeTvSymbol = getTvSymbol(symbol);
  
  useEffect(() => {
    const containerId = 'tradingview-advanced-chart';
    const container = document.getElementById(containerId);
    if (!container) return;

    // Clear previous chart to avoid nested duplications
    container.innerHTML = '';

    const scriptId = 'tradingview-widget-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initWidget = () => {
      if (typeof window !== 'undefined' && (window as any).TradingView) {
        try {
          new (window as any).TradingView.widget({
            autosize: true,
            symbol: activeTvSymbol,
            interval: timeframe,
            timezone: "exchange",
            theme: isDark ? "dark" : "light",
            style: "1",
            locale: "en",
            enable_publishing: false,
            hide_side_toolbar: false, // MUST BE FALSE TO SHOW THE DRAWINGS MULTIPLE TOOLS ON THE LEFT SIDE!
            allow_symbol_change: false,
            withdateranges: true,
            container_id: containerId,
            studies: [],
            save_image: true,
            show_popup_button: false,
          });
        } catch (e) {
          console.error("Failed to initialize TradingView advanced widget:", e);
        }
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://s3.tradingview.com/tv.js';
      script.type = 'text/javascript';
      script.async = true;
      script.onload = initWidget;
      document.head.appendChild(script);
    } else {
      if ((window as any).TradingView) {
        initWidget();
      } else {
        script.addEventListener('load', initWidget);
      }
    }

    return () => {
      if (script) {
        script.removeEventListener('load', initWidget);
      }
    };
  }, [activeTvSymbol, timeframe, isDark]);

  return (
    <div 
      ref={containerRef}
      id="tradingview-chart-panel"
      className={`rounded-2xl border flex flex-col overflow-hidden transition-all duration-300 relative ${
        isFullscreen ? 'w-full h-screen p-4' : 'h-[460px] w-full'
      } ${
        isDark 
          ? 'bg-[#111827] border-gray-800' 
          : 'bg-white border-gray-200'
      }`}
    >
      {/* Chart Settings Header */}
      <div className={`flex items-center justify-between px-5 py-3 border-b ${
        isDark ? 'border-gray-800' : 'border-gray-250'
      }`}>
        {/* Symbol Indicator and Selector Pill */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-lg ${isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-blue-600/10 text-blue-600'}`}>
              <Activity className="h-4 w-4" />
            </span>
            <div className="leading-none">
              <span className="font-display font-semibold text-sm mr-2">{symbol}</span>
              <span className="text-[10px] uppercase font-mono opacity-50 block sm:inline">
                {instruments.find(i => i.symbol === symbol)?.category} Index
              </span>
            </div>
          </div>

          <div className={`hidden sm:flex items-center gap-1 p-0.5 rounded-lg border text-xs ${
            isDark ? 'bg-gray-900 border-gray-800' : 'bg-gray-50 border-gray-200'
          }`}>
            {timeframes.map((tf) => (
              <button
                key={tf.value}
                onClick={() => setTimeframe(tf.value)}
                className={`px-2 py-1 rounded-md font-mono text-[11px] transition-all ${
                  timeframe === tf.value
                    ? isDark
                      ? 'bg-gray-800 text-cyan-400 font-bold'
                      : 'bg-white text-blue-600 font-bold shadow-sm'
                    : 'text-gray-400 hover:text-inherit'
                }`}
              >
                {tf.label}
              </button>
            ))}
          </div>
        </div>

        {/* Technical Utilities and Watchlist shortcuts */}
        <div className="flex items-center gap-3">
          {/* Quick watchlist selectors in chart header for ease of trading! */}
          <div className="hidden md:flex items-center gap-1 border-r pr-3 border-inherit">
            {instruments.slice(0, 4).map((inst) => (
              <button
                key={inst.symbol}
                onClick={() => onSymbolSelect(inst.symbol)}
                className={`px-2 py-1 rounded text-[10px] font-mono transition-all font-semibold ${
                  symbol === inst.symbol
                    ? isDark
                      ? 'bg-cyan-950/40 text-cyan-400 border border-cyan-500/30'
                      : 'bg-blue-50 text-blue-600 border border-blue-200'
                    : isDark
                      ? 'text-gray-500 hover:text-gray-300'
                      : 'text-gray-500 hover:text-gray-950'
                }`}
              >
                {inst.symbol}
              </button>
            ))}
          </div>

          {/* Fullscreen Option */}
          <button
            id="chart-fullscreen-toggle"
            onClick={toggleFullscreen}
            className={`p-2 rounded-lg border transition-colors ${
              isDark
                ? 'hover:bg-gray-800 border-gray-800 text-gray-400 hover:text-white'
                : 'hover:bg-gray-50 border-gray-200 text-gray-500 hover:text-gray-950'
            }`}
            title="Toggle Fullscreen"
          >
            {isFullscreen ? <Minimize2 className="h-3.5 w-3.5" /> : <Maximize2 className="h-3.5 w-3.5" />}
          </button>
        </div>
      </div>

      {/* Chart Canvas Wrap */}
      <div className="flex-1 w-full bg-transparent relative min-h-[300px]">
        <div 
          id="tradingview-advanced-chart" 
          className="w-full h-full"
        />
        
        {/* Floating Mini Overlay (Prop Firm Badge) */}
        <div className={`absolute bottom-4 right-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-mono tracking-wide ${
          isDark 
            ? 'bg-slate-900/90 border-cyan-500/20 text-cyan-400' 
            : 'bg-white/90 border-blue-200 text-blue-600'
        }`}>
          <Award className="h-3.5 w-3.5" />
          <span>PORTFOLIO EDGE ENGINE V2</span>
        </div>
      </div>
    </div>
  );
}
