import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

app.post('/api/chat', async (req, res) => {
  const { message, billContext, tone, history } = req.body;

  if (!ai || !process.env.GEMINI_API_KEY) {
    return res.json({ useLocal: true, reason: 'no_api_key' });
  }

  try {
    const systemPrompt = `You are "SPlitZie AI", an intelligent, witty, helpful college technology festival bill settlement assistant.
You help college friends, tech fest squads, and roommates settle dinner bills fairly and smoothly with zero drama.
Selected Tone: ${tone || 'witty, collegiate, and polite'}.

Current Live Bill Context:
- Occasion: "${billContext?.occasionName || 'Friend Dinner'}"
- Subtotal: ${billContext?.currency || '$'}${billContext?.billAmount || 0}
- Squad Size: ${billContext?.peopleCount || 4} friends
- Tip: ${billContext?.tipPercent || 0}%, Tax: ${billContext?.taxPercent || 0}%, Discount: ${billContext?.currency || '$'}${billContext?.discountAmount || 0}
- Net Grand Total: ${billContext?.currency || '$'}${billContext?.netTotal || 0}
- Per Person Share: ${billContext?.currency || '$'}${billContext?.sharePerPerson || 0}
- Host / Cardholder: ${billContext?.highestPayerName || 'Alex'}
- Friends & Status: ${billContext?.friendsList || 'All friends'}
- Food Ordered: ${billContext?.foodItems || 'Shared dinner dishes'}

Guidelines:
- Give concise, ultra-helpful, formatted responses (bullet points, bold highlights).
- If the user asks for reminders, provide realistic, copyable message templates with emojis and payment placeholders.
- If the user asks about splitting (e.g. non-drinkers vs drinkers, vegan dishes, late arrivals), calculate the exact math step-by-step.
- Keep the collegiate tech fest spirit: energetic, friendly, mathematically sharp, and dispute-free!`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: message,
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.7,
      },
    });

    const reply = response.text || '';
    return res.json({ reply, useLocal: false });
  } catch (error: any) {
    console.error('Gemini server error:', error);
    return res.json({ useLocal: true, error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist/index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`SPlitZie full-stack server running on port ${PORT}`);
  });
}

startServer();
