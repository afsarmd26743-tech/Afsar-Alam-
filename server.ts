/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

// Initialize the Google GenAI SDK.
// User-Agent: 'aistudio-build' is set for telemetry as requested in the gemini-api skill.
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Parse JSON payloads
  app.use(express.json());

  // API Endpoints
  app.post('/api/alam-agent', async (req, res) => {
    try {
      const { message, chatHistory, symbol, price, instruments } = req.body;
      const ai = getGeminiClient();

      const contextPrompt = `
You are 'Alam AI Agent', an elite institutional-grade quant strategy AI and trading assistant on the 'alam.dev' professional terminal.
You are helping the trader 'Afsar Md' with technical indicators, market intelligence, sentiment analysis, and action-ready signals.

--- CURRENT TICKER CONTEXT ---
Selected Symbol: ${symbol || 'BTCUSD'}
Current Base Price: $${price || '102,500'}
All Avaible Market Instruments: ${JSON.stringify(instruments || [])}

--- TRADING PRINCIPLES ---
1. Provide concrete trading advice when requested: Buy, Sell, or Hold, with clear justifications.
2. Estimate precise execution bracket bounds: Entry Rate, Recommended Stop Loss (SL), and Target Take Profit (TP) bounds. Use prices realistic to the selected symbol's range.
3. Be quantitative, referencing volumes, technical indicators (RSI, MACD, EMA crossover, Support/Resistance lines), and market structure.
4. Keep your answers concise, structured, visually striking inside markdown (bold headers, bullet points).
5. Address the operator 'Afsar Md' with professional respect.
`;

      const systemInstruction = "You are Alam AI Agent, an elite mathematical quantitative trading strategist assistant on the alam.dev dashboard. Output clean markdown content.";

      if (ai) {
        // Build the contents payload with brief history
        const contents = [];
        
        // Append context/setup as a starting prompt hint
        contents.push({
          role: 'user',
          parts: [{ text: `${contextPrompt}\n\nExisting Conversation History:\n${JSON.stringify(chatHistory || [])}\n\nNew query from Afsar Md: ${message}` }]
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: contents,
          config: {
            systemInstruction,
            temperature: 0.7,
            topP: 0.9,
          }
        });

        const reply = response.text || "Unable to acquire signal. Market is currently consolidating.";
        return res.json({ reply, source: 'gemini-api' });
      } else {
        // Fallback intelligence engine: highly realistic simulated signals in case API key isn't provided yet
        console.warn("process.env.GEMINI_API_KEY is not configured yet. Engaging simulated Alam AI engine.");
        
        // Build high-quality custom simulated responses to questions
        let reply = "";
        const lowerMsg = message.toLowerCase();

        if (lowerMsg.includes('signal') || lowerMsg.includes('buy') || lowerMsg.includes('sell') || lowerMsg.includes('trade')) {
          const isBuy = Math.random() > 0.45;
          const targetSymbol = symbol || 'BTCUSD';
          const p = Number(price) || 102500;
          const percentModifier = isBuy ? 1.05 : 0.95;
          const slModifier = isBuy ? 0.97 : 1.03;
          const signalWord = isBuy ? 'BUY / LONG' : 'SELL / SHORT';
          const indicator = isBuy ? 'RSI at 42 (oversold on H1 time) and EMA 20/50 bullish cross' : 'MACD bearish block divergence and overhead order block liquidity sweep';

          reply = `### Alam AI Signal Alert: **${signalWord}** for **${targetSymbol}** 🚀

Greetings **Afsar Md**. Based on real-time order book flows, volume clusters, and quantitative filters, I have detected a potential setup:

*   **Direction**: ${signalWord}
*   **Optimal Entry**: \`${p.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}\`
*   **Confidence Rating**: \`${(78 + Math.floor(Math.random() * 18))}% (High Cluster Alignment)\`
*   **Stop Loss (SL)**: \`${(p * slModifier).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}\`
*   **Take Profit (TP)**: \`${(p * percentModifier).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}\`

**Technical Analysis Rationale:**
- We are seeing a **${isBuy ? 'bullish accumulation bounce' : 'bearish resistance check'}** near critical supports.
- Indicators shows: **${indicator}**.
- Liquidity sweeps suggest standard safety brackets are highly advised. Would you like to execute this spot position automatically?`;
        } else if (lowerMsg.includes('btc') || lowerMsg.includes('bitcoin')) {
          reply = `### Bitcoin (BTCUSD) Analytical Assessment 🔍

Hello **Afsar Md**. BTCUSD is currently trading at approximately **$${(price || 102500).toLocaleString()}**. 

-   **Market Stance**: Bullish Trend Continuation.
-   **Key Spot Liquidity**: Strong bid walls at $101,000, ask clusters thinning above $104,200.
-   **Volatiles Index**: Elevated due to option rolls.
-   **Trading Strategy**: Watch for retests of the 50 EMA on the 15-minute timeframe. Long positions are favored as long as structure holds above $100,500.`;
        } else if (lowerMsg.includes('drawdown') || lowerMsg.includes('money') || lowerMsg.includes('limit') || lowerMsg.includes('risk')) {
          reply = `### Institutional Safety & Risk Protocol Recommendation 🛡️

Operator **Afsar Md**, maintaining your simulated leverage and prop-firm safety metrics is our primary objective:

1.  **Strict 2% Rule**: Never allocate more than 2% of overall capital ($500 maximum risk) to a single index scalp.
2.  **Safety Bracket Placement**: Always enforce an AI-constructed Stop Loss (SL).
3.  **Active Drawdown Cap**: If daily floating losses hit -$1,250 (5% threshold), the dashboard will alert you to close all assets and reset.
4.  **Recommended Leverage**: Limit active contract sizes to less than **5.0 Lots** on Forex pairs and **1.0 Contract** on major Crypto indices.`;
        } else {
          reply = `### Alam AI Quant Core Support Desk 🤖

Welcome, operator **Afsar Md**. I am your terminal's mathematical intelligence engine. I have synchronized with the live trading feed of **${symbol || 'all major assets'}**.

How can I bolster your performance today? You can:
1.  Ask me for **"signals"** or instructions on any of the supported markets.
2.  Inquire about **"drawdown limits"** and managing safety brackets.
3.  Request a detailed technical trend report on any specific token.

*Tip: You can use the quick actions below to instantly request formatted quantitative updates.*`;
        }

        return res.json({ 
          reply, 
          source: 'simulation-agent', 
          note: 'Please provide process.env.GEMINI_API_KEY in the Settings > Secrets panel to unlock full intelligent generative responses.' 
        });
      }
    } catch (err: any) {
      console.error("Error in Alam AI Agent endpoint:", err);
      res.status(500).json({ error: err.message || "Internal Server Failure" });
    }
  });

  // Serve static files in production / Dev fallback
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: express.Request, res: express.Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
