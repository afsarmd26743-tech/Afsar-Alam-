/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Sparkles, 
  Send, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  Cpu, 
  ChevronRight, 
  CornerDownRight, 
  Layers, 
  HelpCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { MarketInstrument, Side } from '../types';

interface AlamAgentProps {
  isDark: boolean;
  selectedSymbol: string;
  instruments: MarketInstrument[];
  onOpenPosition: (symbol: string, side: Side, size: number, price: number, sl?: number, tp?: number) => void;
  onSymbolSelect: (symbol: string) => void;
  retailBalance: number;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  time: string;
  source?: 'gemini-api' | 'simulation-agent';
}

export default function AlamAgent({ 
  isDark, 
  selectedSymbol, 
  instruments, 
  onOpenPosition, 
  onSymbolSelect,
  retailBalance 
}: AlamAgentProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { 
      id: 'msg_welcome', 
      sender: 'agent', 
      text: `### Alam AI Quant Core Active 👋

Hello **Afsar Md**! I am your real-time **Alam AI Market Analysis Agent**. I have loaded indicators for **${selectedSymbol}** and the active indices. 

I can:
-   Generate live technical signals (**BUY / SELL**) with calculated target brackets.
-   Answer complex trading strategy, option flow, and risk limit questions.
-   Instantly load the active signals into the execution ledger.

Ask me a question or use the **Quick Analysis** recommendations on the left to start!`, 
      time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
      source: 'simulation-agent'
    }
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [signalSymbol, setSignalSymbol] = useState(selectedSymbol);
  const [isMaximized, setIsMaximized] = useState(false);
  const [mobileActiveView, setMobileActiveView] = useState<'chat' | 'hud'>('chat');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Synchronize internal symbol switcher with app root
  useEffect(() => {
    if (selectedSymbol) {
      setSignalSymbol(selectedSymbol);
    }
  }, [selectedSymbol]);

  // Scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Formats text custom markdown for headers, lists, code, and symbols
  const renderFormattedMessage = (text: string) => {
    const lines = text.split('\n');
    return (
      <div className="space-y-2.5 text-[14.5px] sm:text-[15.5px] leading-relaxed tracking-normal select-text font-sans">
        {lines.map((line, index) => {
          // Headers
          if (line.startsWith('### ')) {
            return (
              <h4 key={index} className="font-display font-bold text-base sm:text-[17px] text-cyan-400 mt-4 pb-1.5 border-b border-gray-800/30">
                {line.replace('### ', '')}
              </h4>
            );
          }
          if (line.startsWith('## ')) {
            return (
              <h3 key={index} className="font-display font-extrabold text-lg sm:text-[19px] text-cyan-400 mt-5 pb-1.5 border-b border-gray-800/50">
                {line.replace('## ', '')}
              </h3>
            );
          }
          if (line.startsWith('# ')) {
            return (
              <h2 key={index} className="font-display font-black text-xl sm:text-[21px] text-cyan-400 mt-6">
                {line.replace('# ', '')}
              </h2>
            );
          }

          // Bullet points
          if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
            const cleanLine = line.trim().substring(2);
            return (
              <div key={index} className="flex items-start gap-1.5 pl-2 mt-1">
                <span className="text-cyan-400 font-bold shrink-0 mt-1">•</span>
                <span className="text-gray-200">{parseInlineMarkdown(cleanLine)}</span>
              </div>
            );
          }

          // Numbered lists
          if (/^\d+\.\s/.test(line.trim())) {
            const matchList = line.trim().match(/^(\d+)\.\s(.*)/);
            if (matchList) {
              return (
                <div key={index} className="flex items-start gap-2 pl-2 mt-1">
                  <span className="text-cyan-400 font-mono text-xs sm:text-sm font-bold shrink-0 mt-0.5">{matchList[1]}.</span>
                  <span className="text-gray-200">{parseInlineMarkdown(matchList[2])}</span>
                </div>
              );
            }
          }

          // Regular line
          if (line.trim() === '') return <div key={index} className="h-2" />;
          return <p key={index} className="text-gray-200">{parseInlineMarkdown(line)}</p>;
        })}
      </div>
    );
  };

  const parseInlineMarkdown = (text: string) => {
    // Basic inline parser for **bold** and `code`
    const parts = [];
    let currentIdx = 0;

    const regex = /(\*\*|`)(.*?)\1/g;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Append preceding normal text
      if (match.index > currentIdx) {
        parts.push(text.substring(currentIdx, match.index));
      }

      const style = match[1];
      const content = match[2];

      if (style === '**') {
        const isBuy = content.includes('BUY') || content.includes('LONG');
        const isSell = content.includes('SELL') || content.includes('SHORT');
        const color = isBuy ? 'text-emerald-400 font-bold' : isSell ? 'text-rose-400 font-bold' : 'text-white font-bold';
        parts.push(<strong key={match.index} className={color}>{content}</strong>);
      } else if (style === '`') {
        parts.push(
          <code key={match.index} className="px-1.5 py-0.5 rounded font-mono text-xs bg-gray-950 text-cyan-400 border border-cyan-500/10">
            {content}
          </code>
        );
      }

      currentIdx = regex.lastIndex;
    }

    if (currentIdx < text.length) {
      parts.push(text.substring(currentIdx));
    }

    return parts.length > 0 ? parts : text;
  };

  // Triggers API pipeline
  const sendMessage = async (customPrompt?: string) => {
    const promptToSend = customPrompt || inputVal;
    if (!promptToSend.trim()) return;

    if (!customPrompt) setInputVal('');

    const userMsgId = `user_${Date.now()}`;
    const formattedUserMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: promptToSend,
      time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, formattedUserMsg]);
    setIsTyping(true);

    const activeInst = instruments.find(i => i.symbol === signalSymbol) || instruments[0];
    const historyPayload = messages.slice(-10).map(m => ({
      sender: m.sender,
      text: m.text
    }));

    try {
      const response = await fetch('/api/alam-agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: promptToSend,
          status: 'live',
          symbol: signalSymbol,
          price: activeInst.price,
          instruments: instruments,
          chatHistory: historyPayload
        })
      });

      if (!response.ok) {
        throw new Error('API server unreachable');
      }

      const data = await response.json();
      
      const agentMsg: ChatMessage = {
        id: `agent_${Date.now()}`,
        sender: 'agent',
        text: data.reply,
        time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }),
        source: data.source
      };

      setMessages(prev => [...prev, agentMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: `err_${Date.now()}`,
        sender: 'agent',
        text: `### System Error ⚠️\n\nI was unable to establish connection with the Alam.dev Express backend. Please make sure that standard container endpoints are initialized properly.`,
        time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  // Quick Action triggers
  const handleQuickAction = (topic: string) => {
    let actionPrompt = '';
    if (topic === 'btc_analysis') {
      actionPrompt = `Analyze current ${signalSymbol} trend and provide detailed live signals.`;
    } else if (topic === 'scalp_signal') {
      actionPrompt = `Provide a high-frequency high-conviction scalp trade recommendation for ${signalSymbol}.`;
    } else if (topic === 'drawdown') {
      actionPrompt = "Provide guidelines about safeguarding my profit drawdown and managing daily risks.";
    } else if (topic === 'all_markets') {
      actionPrompt = "Give me a broad summary across all forex, commodities and stock indices.";
    }
    sendMessage(actionPrompt);
  };

  const handleInstrumentSelect = (sym: string) => {
    setSignalSymbol(sym);
    onSymbolSelect(sym);
  };

  // Local helper variables to display active prediction metrics in the left HUD sidebar
  const currentInst = instruments.find(i => i.symbol === signalSymbol) || instruments[0];
  const isBtcSymbol = signalSymbol.includes('BTC');
  
  // Deterministic signal generation to show in the Signal HUD block
  const getSimulatedSignalDetails = () => {
    const hash = signalSymbol.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) + (isDark ? 9 : 3);
    const isBuy = hash % 2 === 0;
    const direction = isBuy ? 'BUY' : 'SELL';
    const confidence = 80 + (hash % 19);
    
    // Target levels based on active instrument price
    const entry = currentInst.price;
    const range = entry * 0.04; // 4% range
    const takeProfit = isBuy ? entry + (range * 0.8) : entry - (range * 0.8);
    const stopLoss = isBuy ? entry - (range * 0.4) : entry + (range * 0.4);

    return {
      direction,
      confidence,
      entry,
      takeProfit,
      stopLoss,
      rsi: 38 + (hash % 30),
      macd: isBuy ? 'Bullish Histogram Expansion' : 'Bearish Divergence Block'
    };
  };

  const HUD = getSimulatedSignalDetails();

  // Instantly opens position helper on simulator
  const handleExecuteAISignal = () => {
    const side = HUD.direction === 'BUY' ? 'Long' : 'Short';
    const size = isBtcSymbol ? 0.5 : 2.5; // reasonable size
    onOpenPosition(
      signalSymbol,
      side,
      size,
      HUD.entry,
      HUD.stopLoss,
      HUD.takeProfit
    );

    // Create custom success prompt inside the chat
    const alertMsg: ChatMessage = {
      id: `alert_${Date.now()}`,
      sender: 'agent',
      text: `### Signal Position Initiated! 🟢\n\nI have successfully loaded your AI quantitative bracket position into the active simulator ledger.\n- **Asset**: \`${signalSymbol}\`\n- **Type**: \`${side}\`\n- **Size**: \`${size} Lots\`\n- **Entry Rate**: \`${HUD.entry.toLocaleString()}\`\n- **Target (TP)**: \`${HUD.takeProfit.toLocaleString()}\`\n- **Safety (SL)**: \`${HUD.stopLoss.toLocaleString()}\`\n\nYou can track this live in your Positions drawer. Let me know if you need protective bracket adjustment formulas!`,
      time: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, alertMsg]);
  };

  return (
    <div className="flex flex-col gap-4 h-[calc(100vh-120px)] min-h-[650px] sm:min-h-[720px] lg:min-h-[760px] w-full transition-all duration-500 ease-in-out">
      
      {/* Mobile View Toggle Segmented capsule control header */}
      <div className="flex lg:hidden p-1 rounded-xl bg-gray-950/40 border border-gray-800/20 mb-1 w-full select-none shrink-0">
        <button
          onClick={() => setMobileActiveView('chat')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileActiveView === 'chat'
              ? isDark
                ? 'bg-gradient-to-br from-[#122c42] to-[#0c1f32] text-cyan-400 border border-cyan-500/30'
                : 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Bot className="h-4 w-4" />
          <span>💬 Chat Client Terminal</span>
        </button>
        <button
          onClick={() => setMobileActiveView('hud')}
          className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
            mobileActiveView === 'hud'
              ? isDark
                ? 'bg-gradient-to-br from-[#122c42] to-[#0c1f32] text-cyan-400 border border-cyan-500/30'
                : 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-white'
          }`}
        >
          <Cpu className="h-4 w-4" />
          <span>📊 Market Signals & Actions</span>
        </button>
      </div>

      <div id="alam-agent-tab" className="flex flex-col lg:flex-row gap-6 flex-grow flex-1 min-h-0 w-full overflow-hidden transition-all duration-500 ease-in-out">
      
        {/* 1. Left Side: Market Intel HUD */}
        {!isMaximized && (
          <div className={`w-full lg:w-[350px] xl:w-[380px] shrink-0 flex-col gap-5 h-full overflow-y-auto pr-1 transition-all duration-500 ease-in-out ${
            mobileActiveView === 'hud' ? 'flex' : 'hidden lg:flex'
          }`}>
          
          {/* Signal HUD Header */}
          <div className={`p-5 rounded-2xl border ${
            isDark ? 'bg-[#0f172a] border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center gap-2 mb-4">
              <span className="p-1 rounded bg-amber-500/10 text-amber-500">
                <Cpu className="h-4 w-4" />
              </span>
              <h3 className="font-display font-semibold text-sm">Automated Signals</h3>
            </div>

            {/* Symbol Selector Pill Bar */}
            <div className="flex flex-wrap gap-1.5 mb-4 border-b border-gray-800/15 pb-4">
              {instruments.map(inst => (
                <button
                  key={inst.symbol}
                  onClick={() => handleInstrumentSelect(inst.symbol)}
                  className={`px-2.5 py-1 rounded text-xs transition-all font-mono font-bold ${
                    signalSymbol === inst.symbol
                      ? isDark 
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40' 
                        : 'bg-blue-600 text-white'
                      : isDark 
                        ? 'bg-gray-900 border border-transparent text-gray-400 hover:text-white hover:bg-gray-800' 
                        : 'bg-gray-100 border border-gray-200 text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {inst.symbol}
                </button>
              ))}
            </div>

            {/* Core Analytics parameters */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Current Market Price:</span>
                <span className="font-mono text-sm font-bold text-white">
                  ${currentInst.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                </span>
              </div>

              {/* Glowing signal direction marker */}
              <div className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                HUD.direction === 'BUY'
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
                  : 'bg-rose-500/5 border-rose-500/20 text-rose-400'
              }`}>
                <div>
                  <span className="text-[10px] font-mono tracking-wider opacity-60 block uppercase">Alam Agent Signal</span>
                  <span className="text-lg font-extrabold font-display leading-tight">{HUD.direction}</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono tracking-wider opacity-60 block uppercase">Signal Confidence</span>
                  <span className="text-lg font-bold font-mono">{HUD.confidence}%</span>
                </div>
              </div>

              {/* Target Brackets Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3 rounded-lg border leading-tight ${isDark ? 'bg-gray-950/40 border-gray-800/70' : 'bg-gray-50'}`}>
                  <span className="text-[10px] text-gray-400 uppercase block font-mono">Take Profit (TP)</span>
                  <span className="font-mono font-bold text-emerald-400 text-xs mt-1 block">
                    ${HUD.takeProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                  </span>
                </div>
                <div className={`p-3 rounded-lg border leading-tight ${isDark ? 'bg-gray-950/40 border-gray-800/70' : 'bg-gray-50'}`}>
                  <span className="text-[10px] text-gray-400 uppercase block font-mono">Stop Loss (SL)</span>
                  <span className="font-mono font-bold text-rose-400 text-xs mt-1 block">
                    ${HUD.stopLoss.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                  </span>
                </div>
              </div>

              {/* Technical metrics */}
              <div className={`p-3.5 rounded-xl text-xs space-y-2 border ${isDark ? 'bg-black/20 border-gray-900' : 'bg-gray-50 border-gray-200'}`}>
                <div className="flex justify-between">
                  <span className="text-gray-400">RSI Indicator:</span>
                  <span className={`font-mono font-bold ${HUD.rsi > 70 ? 'text-rose-400' : HUD.rsi < 40 ? 'text-emerald-400' : 'text-cyan-400'}`}>{HUD.rsi}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">MACD Histogram:</span>
                  <span className="font-mono font-semibold text-white text-[11px] truncate max-w-[150px]">{HUD.macd}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Current Volume:</span>
                  <span className="font-mono text-gray-300">{currentInst.volume}</span>
                </div>
              </div>

              {/* Execute trigger */}
              <button
                onClick={handleExecuteAISignal}
                className={`w-full py-2.5 rounded-xl font-bold transition-all text-xs active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 shadow-lg ${
                  HUD.direction === 'BUY'
                    ? 'bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-500 hover:to-green-400 text-white'
                    : 'bg-gradient-to-r from-rose-600 to-pink-500 hover:from-rose-500 hover:to-pink-400 text-white'
                }`}
              >
                <ArrowUpRight className="h-4 w-4" />
                Open AI-Recommended {HUD.direction} Position
              </button>
            </div>
          </div>

          {/* Quick Intel Recommendations Panel */}
          <div className={`p-5 rounded-2xl border flex-1 flex flex-col justify-between ${
            isDark ? 'bg-[#0f172a]/70 border-gray-800' : 'bg-white border-gray-200'
          }`}>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="p-1 rounded bg-cyan-500/10 text-cyan-400">
                  <Sparkles className="h-4 w-4" />
                </span>
                <h4 className="font-display font-semibold text-sm">Quick AI Actions</h4>
              </div>
              <p className="text-xs text-gray-400 mb-4 font-sans">
                Tap a card below to trigger deep technical analysis and auto-generate trading signals:
              </p>

              <div className="space-y-2.5">
                <button
                  onClick={() => handleQuickAction('btc_analysis')}
                  className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all group ${
                    isDark ? 'bg-gray-900/40 border-gray-800 hover:bg-gray-800/40 hover:border-cyan-500/30' : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-blue-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Cpu className="h-3.5 w-3.5 text-cyan-400 block shrink-0" />
                    <span className="text-xs font-medium font-sans">Check {signalSymbol} Trends</span>
                  </div>
                  <ChevronRight className="h-3 w-3 text-gray-500 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => handleQuickAction('scalp_signal')}
                  className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all group ${
                    isDark ? 'bg-gray-900/40 border-gray-800 hover:bg-gray-800/40 hover:border-cyan-500/30' : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-blue-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3.5 w-3.5 text-emerald-400 block shrink-0" />
                    <span className="text-xs font-medium font-sans">Get High-Risk Scalp Setup</span>
                  </div>
                  <ChevronRight className="h-3 w-3 text-gray-500 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => handleQuickAction('drawdown')}
                  className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all group ${
                    isDark ? 'bg-gray-900/40 border-gray-800 hover:bg-gray-800/40 hover:border-cyan-500/30' : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-blue-600'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="h-3.5 w-3.5 text-rose-400 block shrink-0" />
                    <span className="text-xs font-medium font-sans">Drawdown Limits Check</span>
                  </div>
                  <ChevronRight className="h-3 w-3 text-gray-500 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-800/20 text-[10px] text-gray-500 flex items-center gap-1.5 font-mono">
              <Clock className="h-3.5 w-3.5" />
              <span>LAST ESTIMATE SYSTEM SYNC: JUST NOW</span>
            </div>
          </div>

        </div>
      )}

      {/* 2. Right Side: Interactive AI Terminal console */}
      <div className={`flex-1 flex-grow ${
        mobileActiveView === 'chat' ? 'flex' : 'hidden lg:flex'
      } flex flex-col h-full rounded-2xl border overflow-hidden bg-slate-950/20 border-gray-800/60 relative transition-all duration-500 ease-in-out`}>
        
        {/* Terminal Header */}
        <div className={`px-5 py-4 flex items-center justify-between border-b ${
          isDark ? 'bg-gray-900/40 border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center relative ${
              isDark ? 'bg-cyan-500/10 text-cyan-400' : 'bg-blue-600/10 text-blue-600'
            }`}>
              <Bot className="h-5 w-5" />
              <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border border-inherit ring-2 ring-emerald-500/20 animate-pulse"></span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="font-sans font-bold text-sm text-white leading-none">Alam AI Quant Core</h4>
                <span className="px-1.5 py-0.5 rounded text-[8.5px] font-mono tracking-widest uppercase font-bold bg-cyan-950/40 border border-cyan-500/20 text-cyan-400">
                  GENAI v3.5
                </span>
              </div>
              <p className="text-[10px] text-gray-500 font-mono mt-1">OPERATOR IN SESSION: AFSAR MD</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-gray-500 hidden sm:block mr-1">STATUS: ONLINE_SYNC</span>
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className={`p-2.5 rounded-xl border transition-all flex items-center gap-2 cursor-pointer text-xs font-bold ${
                isDark 
                  ? 'bg-gray-900 border-gray-800 text-cyan-400 hover:bg-gray-800 hover:text-cyan-300' 
                  : 'bg-gray-100 border-gray-200 text-blue-600 hover:bg-gray-50 hover:text-blue-500'
              }`}
              title={isMaximized ? "Show side panels" : "Maximize chat reading width"}
            >
              {isMaximized ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              <span>{isMaximized ? "Normal View" : "Large Screen Mode"}</span>
            </button>
          </div>
        </div>

        {/* Console messages log */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
          {messages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex items-start gap-3.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {/* Avatar for agent */}
              {msg.sender === 'agent' && (
                <div className="h-8.5 w-8.5 rounded-lg flex items-center justify-center bg-gray-950 border border-cyan-500/15 shrink-0 mt-1">
                  <Bot className="h-4.5 w-4.5 text-cyan-400" />
                </div>
              )}

              {/* Msg Content */}
              <div className={`max-w-[94%] sm:max-w-[85%] rounded-2xl p-5 relative ${
                msg.sender === 'user'
                  ? 'bg-gradient-to-br from-cyan-900/40 to-cyan-950/40 border border-cyan-500/30 text-gray-100 rounded-tr-none'
                  : isDark
                    ? 'bg-[#0f172a] border border-gray-800 text-gray-200 rounded-tl-none'
                    : 'bg-white border border-gray-200 text-gray-700 rounded-tl-none'
              }`}>
                {/* Visual marker of the reply mode */}
                {msg.sender === 'agent' && (
                  <div className="absolute top-2.5 right-4 flex items-center gap-1 opacity-50 font-mono text-[9px] tracking-wider">
                    {msg.source === 'gemini-api' ? 'GEMINI' : 'AI ENGINE'}
                  </div>
                )}

                {msg.sender === 'agent' ? (
                  renderFormattedMessage(msg.text)
                ) : (
                  <p className="text-[14.5px] sm:text-base leading-relaxed white-space-pre-wrap">{msg.text}</p>
                )}
                
                <span className="text-[10px] opacity-40 block text-right mt-2.5 font-mono">{msg.time}</span>
              </div>
            </div>
          ))}

          {/* Typing state indicator */}
          {isTyping && (
            <div className="flex items-start gap-4">
              <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-gray-950 border border-cyan-500/15 shrink-0">
                <Bot className="h-4 w-4 text-cyan-400" />
              </div>
              <div className={`rounded-xl p-3.5 border ${
                isDark ? 'bg-gray-900/60 border-gray-800' : 'bg-gray-100/60 border-gray-200'
              }`}>
                <div className="flex items-center gap-1.5 px-1">
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="h-2 w-2 rounded-full bg-cyan-400 animate-bounce" />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input submission footer */}
        <div className={`p-4 border-t ${
          isDark ? 'bg-[#0a0f1d] border-gray-800' : 'bg-white border-gray-200'
        }`}>
          <div className="relative flex items-center w-full">
            <input
              type="text"
              id="alam-agent-chat-input"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder={`Ask about Option sweeps, ${signalSymbol} targets or risk safeguards...`}
              disabled={isTyping}
              className={`w-full py-3.5 pl-4 pr-14 rounded-xl border text-sm font-sans transition-all outline-none ${
                isDark 
                  ? 'bg-gray-950/60 border-gray-800 text-white focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/20' 
                  : 'bg-gray-50 border-gray-200 text-gray-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/20'
              } disabled:opacity-40`}
            />

            <button
              id="alam-agent-send-button"
              disabled={!inputVal.trim() || isTyping}
              onClick={() => sendMessage()}
              className={`absolute right-2 p-2.5 rounded-lg font-bold text-white transition-all transform active:scale-95 disabled:scale-100 disabled:opacity-30 cursor-pointer flex items-center justify-center ${
                isDark
                  ? 'bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400'
              }`}
              title="Send Message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>

      </div>

    </div>
  </div>
  );
}
