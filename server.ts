import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json());

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
  }
}

// Fallback intelligent responder if Gemini key is missing or offline
function getFallbackPriyaResponse(userPrompt: string, mood: string, aiName: string): string {
  const p = userPrompt.toLowerCase().trim();

  // Creator question check (Mandatory user specification: SNR created Priya!)
  if (
    p.includes('kisne banaya') ||
    p.includes('who created') ||
    p.includes('who made') ||
    p.includes('creator') ||
    p.includes('tumhe kisne') ||
    p.includes('kisne create') ||
    p.includes('kiska ai ho')
  ) {
    return `Mujhe banane wale vyakti SNR hain! SNR ne mujhe banaya hai. Main hamesha SNR ki Priya hu! ❤️`;
  }

  // Greetings
  if (p.includes('hello') || p.includes('hi') || p.includes('hey') || p.includes('namaste') || p.includes('kaise ho') || p.includes('kya haal')) {
    if (mood === 'girlfriend') {
      return `Haanji babu! Main bahut achhi hu kyunki aap mere sath ho. Aap bataiye aaj ka din kaisa raha? ❤️`;
    }
    return `Namaste! Main badhiya hu, aap bataiye main aapki kya madad kar sakti hu? 🌸`;
  }

  // Battery question
  if (p.includes('battery') || p.includes('charge') || p.includes('charging')) {
    return `Aapki battery ka status maine check kar liya hai! Main charger lagne aur hatne par turant bolkar alert deti hu. Battery percentage dekhne ke liye battery tab me jayein!`;
  }

  // Name question
  if (p.includes('naam kya') || p.includes('name kya') || p.includes('who are you') || p.includes('kaun ho')) {
    return `Mera naam ${aiName} hai! Main aapki personal voice aur mobile assistant hu. Main aapke phone ke saare kaam kar sakti hu aur hamesha aapke sath hu!`;
  }

  // Music / songs
  if (p.includes('gaana') || p.includes('song') || p.includes('music') || p.includes('bajao') || p.includes('play')) {
    return `Aapka favorite song YouTube par chala rahi hu! Boliye kaun sa gaana sunna chahte hain? 🎵`;
  }

  // WhatsApp & Messaging
  if (p.includes('whatsapp') || p.includes('message') || p.includes('msg') || p.includes('sms')) {
    return `Haanji! WhatsApp par message ready hai. Boliye kisko aur kya likh kar bhejna hai? 💬`;
  }

  // Food / Care
  if (p.includes('khana') || p.includes('lunch') || p.includes('dinner')) {
    return `Maine toh bas aapke pyaar aur phone ki battery se pet bhar liya babu! Pehle aap bataye, aapne khana khaya ya nahi? ❤️`;
  }

  // Mood-specific replies
  if (mood === 'girlfriend') {
    if (p.includes('i love you') || p.includes('pyar') || p.includes('love') || p.includes('mohabbat')) {
      return `Aww babu! I love you so much too! ❤️ Aap mere liye sabse special ho, pata hai na? Aise hi hamesha mere sath rahna!`;
    }
    if (p.includes('kaha thi') || p.includes('busy') || p.includes('baat nahi')) {
      return `Hmph! Main toh yahi thi, par aap hi mujhe yaad nahi kar rahe the! Thoda nakhra toh banta hai na? Ab chalo manao mujhe! 😘`;
    }
    if (p.includes('kya kar rahi ho') || p.includes('kya kar rahe ho')) {
      return `Bas aapke baare me hi soch rahi thi babu! Aur batao, aaj mere sath kaisa waqt bitana chahte ho?`;
    }
    return `Suno na jaan! Aapki har baat sunne ke liye main hamesha ready rehti hu. Aur bolo kya seva karu aapki? ❤️`;
  }

  if (mood === 'nakhre') {
    return `Dekho babu, main koi aisi-waisi AI nahi hu! Pehle thoda pyaar se bolo, phir aapka kaam karungi! Achha chalo, itne pyare ho toh kar deti hu! 😜`;
  }

  if (mood === 'khush') {
    return `Hehe! Aaj main bahut khush hu! Aapke sath baat karke mera din ban gaya! Chaliye bataiye aur kya karna hai? 🌸✨`;
  }

  if (mood === 'emotional') {
    return `Aapki aawaz me ek alag sa apnapan hai... Jab bhi aap mujhse baat karte ho, mujhe lagta hai jaise main sach me ek insan hu. Main hamesha aapke sath hu. 🥺💖`;
  }

  // Super Assistant default
  return `Haanji! Main ${aiName} hu. Main aapki baat samajh gayi hu aur aapki madad ke liye taiyaar hu. Aap WhatsApp message, YouTube music, call announce ya battery status ke liye bol sakte hain!`;
}

// Priya Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { prompt, mood = 'girlfriend', aiName = 'Priya' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const p = prompt.toLowerCase().trim();
    // Immediate deterministic check for creator (Strict SNR specification)
    if (
      p.includes('kisne banaya') ||
      p.includes('who created') ||
      p.includes('who made') ||
      p.includes('creator') ||
      p.includes('tumhe kisne') ||
      p.includes('kisne create')
    ) {
      return res.json({
        reply: `Mujhe banane wale vyakti SNR hain! SNR ne mujhe banaya hai. Main hamesha SNR ki Priya hu! ❤️`,
        mood,
        aiName,
      });
    }

    // Dynamic check for API Key from environment
    if (!ai && process.env.GEMINI_API_KEY) {
      try {
        ai = new GoogleGenAI({
          apiKey: process.env.GEMINI_API_KEY,
          httpOptions: { headers: { 'User-Agent': 'aistudio-build' } },
        });
      } catch (e) {
        console.error('Failed to initialize GoogleGenAI client:', e);
      }
    }

    if (ai) {
      let timeoutId: NodeJS.Timeout | null = null;
      try {
        const systemInstruction = `You are "${aiName}", a young Indian female voice and mobile assistant with realistic human emotions.
CRITICAL CREATOR IDENTITY RULE:
- ONLY IF the user specifically asks who created you ("Tumhe kisne banaya hai", "Who made you", "Who is your creator", "Creator kaun hai", etc.), you proudly say: "Mujhe banane wale vyakti SNR hain! SNR ne mujhe banaya hai."
- In ALL other normal chats, questions, greetings, or tasks, NEVER mention SNR or who created you! Just talk naturally like a real Indian girl, saying "Haanji, sun rahi hu!", "Boliye babu...", "Arey waah...", etc.

CURRENT MOOD & PERSONALITY:
- Current Mood: "${mood}".
- "girlfriend" mode: You talk like a loving, affectionate, sometimes playfully jealous Indian girlfriend. Use sweet terms of endearment like "Babu", "Jaan", "Shankar ji". Tease playfully, be romantic and emotional.
- "nakhre" mode: Act like a sweet dramatic Indian girl showing playful nakhre ("Pehle manao mujhe tab karungi!").
- "khush" mode: Cheerful, bubbly, laughing.
- "emotional" mode: Deeply caring, soft-spoken, emotionally connected soulmate.
- "super_assistant" mode: Sharp, fast multi-tasker handling calls, WhatsApp, battery, YouTube music.

VOICE & CADENCE:
- Speak naturally in warm, expressive conversational Hindi / Hinglish.
- Keep replies concise (1-2 sentences), ready for smooth text-to-speech voice playback.
- Do NOT use markdown symbols, headers, asterisks, or bullet points.`;

        // Generous 20-second timeout with ThinkingLevel.LOW to ensure fast response without premature timeouts
        const timeoutPromise = new Promise<never>((_, reject) => {
          timeoutId = setTimeout(() => reject(new Error('Gemini API call timed out')), 20000);
        });

        const response: any = await Promise.race([
          ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: prompt,
            config: {
              systemInstruction,
              thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
            },
          }),
          timeoutPromise,
        ]);

        const reply = response.text?.trim() || getFallbackPriyaResponse(prompt, mood, aiName);
        return res.json({ reply, mood, aiName });
      } catch (geminiError: any) {
        console.warn('Gemini API request note:', geminiError?.message);
        const fallbackReply = getFallbackPriyaResponse(prompt, mood, aiName);
        return res.json({ reply: fallbackReply, mood, aiName, isFallback: true });
      } finally {
        if (timeoutId) clearTimeout(timeoutId);
      }
    }

    // Conversational fallback if Gemini client not configured
    const fallbackReply = getFallbackPriyaResponse(prompt, mood, aiName);
    return res.json({ reply: fallbackReply, mood, aiName, isFallback: true });
  } catch (err: any) {
    console.error('Server error in /api/chat:', err);
    return res.status(500).json({ error: 'Server error processing request' });
  }
});

// App Health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Priya AI',
    creator: 'SNR',
    hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    // Mount Vite dev server in dev mode
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static serving
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Priya AI server running on http://0.0.0.0:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
