/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Side = 'Long' | 'Short';
export type TradeSide = 'Buy' | 'Sell';
export type ImpactType = 'High' | 'Medium' | 'Low';

export interface Position {
  id: string;
  symbol: string;
  side: Side;
  size: number;
  entryPrice: number;
  currentPrice: number;
  sl?: number;
  tp?: number;
  pnl: number;
  pnlPercent: number;
  time: string;
}

export interface Trade {
  id: string;
  time: string;
  symbol: string;
  side: TradeSide;
  entryPrice: number;
  exitPrice: number;
  size: number;
  pnl: number;
  status: 'Win' | 'Loss';
}

export interface OrderBookItem {
  price: number;
  size: number;
  total: number;
}

export interface OrderBook {
  bids: OrderBookItem[];
  asks: OrderBookItem[];
}

export interface MarketInstrument {
  symbol: string;
  name: string;
  category: 'Forex' | 'Crypto' | 'Stocks' | 'Commodities' | 'Indices';
  price: number;
  change: number;
  high: number;
  low: number;
  volume: string;
  tvSymbol: string; // Symbol for TradingView widget, e.g., BINANCE:BTCUSDT
}

export interface EconomicEvent {
  id: string;
  time: string;
  currency: string;
  event: string;
  impact: ImpactType;
  forecast: string;
  previous: string;
}

export interface SentimentData {
  symbol: string;
  buyPercent: number;
  sellPercent: number;
  volume24h: string;
}

export interface CorrelationData {
  base: string;
  target: string;
  value: number; // -1.0 to 1.0
}

export interface RiskMetrics {
  leverageUsage: number; // e.g. 5 (as in 5x)
  maxLeverage: number; // e.g. 100
  portfolioExposurePercent: number; // cumulative exposure
  forexExposurePercent: number;
  cryptoExposurePercent: number;
  stocksExposurePercent: number;
  marginLevel: number; // e.g. 1250%
  freeMargin: number;
}
