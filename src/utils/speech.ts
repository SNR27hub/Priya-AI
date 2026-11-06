import { PriyaMood, VoiceSettings } from '../types';

let currentUtterance: SpeechSynthesisUtterance | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

// Pre-load voices on startup
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
  loadVoices();
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

export function getAllAvailableVoices(): SpeechSynthesisVoice[] {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return [];
  if (cachedVoices.length === 0) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
  return cachedVoices;
}

// Find the best available female voice, prioritizing realistic Indian Hindi / English natural voices
export function getBestFemaleVoice(preferredName?: string): SpeechSynthesisVoice | null {
  const voices = getAllAvailableVoices();
  if (!voices || voices.length === 0) return null;

  // 0. If user specifically selected a preferred voice name
  if (preferredName) {
    const matched = voices.find((v) => v.name === preferredName);
    if (matched) return matched;
  }

  // 1. Check for Microsoft Natural Online Swara / Neerja / Madhur (top tier realism)
  const naturalIndian = voices.find(
    (v) =>
      (v.lang.toLowerCase().includes('hi') || v.lang.toLowerCase().includes('en-in')) &&
      v.name.toLowerCase().includes('natural')
  );
  if (naturalIndian) return naturalIndian;

  // 2. Hindi female voices (Google हिन्दी, Lekha, Swara, Kalpana)
  const hindiFemale = voices.find(
    (v) =>
      (v.lang.toLowerCase().includes('hi-in') || v.lang.toLowerCase().includes('hi')) &&
      (v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('google') ||
        v.name.toLowerCase().includes('swara') ||
        v.name.toLowerCase().includes('lekha') ||
        v.name.toLowerCase().includes('kalpana') ||
        v.name.toLowerCase().includes('priya') ||
        v.name.toLowerCase().includes('india'))
  );
  if (hindiFemale) return hindiFemale;

  // 3. Any Hindi voice
  const anyHindi = voices.find((v) => v.lang.toLowerCase().includes('hi'));
  if (anyHindi) return anyHindi;

  // 4. Indian English Female voice (e.g. Google Indian English, Heera, Veena, Neerja)
  const indianFemale = voices.find(
    (v) =>
      v.lang.toLowerCase().includes('en-in') &&
      (v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('google') ||
        v.name.toLowerCase().includes('heera') ||
        v.name.toLowerCase().includes('veena') ||
        v.name.toLowerCase().includes('neerja'))
  );
  if (indianFemale) return indianFemale;

  const anyIndianEn = voices.find((v) => v.lang.toLowerCase().includes('en-in'));
  if (anyIndianEn) return anyIndianEn;

  // 5. Pleasant natural female voices (Samantha, Victoria, Karen, Zira)
  const femaleVoice = voices.find(
    (v) =>
      v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('natural') ||
      v.name.toLowerCase().includes('samantha') ||
      v.name.toLowerCase().includes('zira') ||
      v.name.toLowerCase().includes('karen') ||
      v.name.toLowerCase().includes('victoria')
  );
  if (femaleVoice) return femaleVoice;

  return voices[0] || null;
}

// Speak function with realistic human-like Indian cadence
export function speakPriya(
  text: string,
  mood: PriyaMood = 'girlfriend',
  settings?: Partial<VoiceSettings>,
  onEnd?: () => void,
  onStart?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onEnd) onEnd();
    return false;
  }

  try {
    window.speechSynthesis.cancel();

    // Clean text of emojis and symbols
    let cleanText = text
      .replace(/[❤️💖💕😘😜🥺🌸✨⚡👑🥰😍🤝🎉🔥]/g, '')
      .replace(/\*+/g, '')
      .replace(/#+/g, '')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return false;
    }

    // Add natural breathing micro-pauses for human rhythm
    cleanText = cleanText
      .replace(/([,;])\s*/g, '$1 ')
      .replace(/([.!?])\s*/g, '$1 ');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    currentUtterance = utterance;

    const voice = getBestFemaleVoice(settings?.preferredVoice);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang || 'hi-IN';
    }

    // Natural human pitch and rate tuning (avoiding robotic squeaks)
    let pitchMultiplier = 1.0;
    let rateMultiplier = 1.0;

    switch (mood) {
      case 'girlfriend':
        // Warm, intimate, affectionate human tone
        pitchMultiplier = 1.06;
        rateMultiplier = 0.98;
        break;
      case 'nakhre':
        // Playful, slightly higher with lively tempo
        pitchMultiplier = 1.12;
        rateMultiplier = 1.02;
        break;
      case 'khush':
        // Cheerful, smiling and expressive
        pitchMultiplier = 1.08;
        rateMultiplier = 1.02;
        break;
      case 'emotional':
        // Gentle, soft-spoken and tender
        pitchMultiplier = 0.97;
        rateMultiplier = 0.92;
        break;
      case 'super_assistant':
        // Crisp, clear and confident
        pitchMultiplier = 1.02;
        rateMultiplier = 1.02;
        break;
    }

    const basePitch = settings?.pitch ?? 1.0;
    const baseRate = settings?.rate ?? 1.0;
    const baseVolume = settings?.volume ?? 1.0;

    utterance.pitch = Math.min(1.6, Math.max(0.7, basePitch * pitchMultiplier));
    utterance.rate = Math.min(1.4, Math.max(0.7, baseRate * rateMultiplier));
    utterance.volume = Math.min(1.0, Math.max(0.0, baseVolume));

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Error in speakPriya:', err);
    if (onEnd) onEnd();
    return false;
  }
}

export function stopPriyaSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

// Continuous Wake-word and Speech Recognition Manager
export interface SpeechRecognitionController {
  start: () => void;
  stop: () => void;
  isSupported: boolean;
}

export function createSpeechListener(
  onCommand: (transcript: string) => void,
  onWakeWordDetected: (transcript: string) => void,
  wakeWord = 'Wake up Priya',
  aiName = 'Priya'
): SpeechRecognitionController {
  if (typeof window === 'undefined') {
    return { start: () => {}, stop: () => {}, isSupported: false };
  }

  const SpeechRecognition =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return { start: () => {}, stop: () => {}, isSupported: false };
  }

  let recognition: any = null;
  let isListening = false;
  let restartTimeout: any = null;

  try {
    recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'hi-IN';

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        }
      }

      if (finalTranscript.trim()) {
        const lower = finalTranscript.toLowerCase().trim();
        const wakeLower = wakeWord.toLowerCase();
        const nameLower = aiName.toLowerCase();

        // Check for wake word trigger
        if (
          lower.includes(wakeLower) ||
          lower.includes(`wake up ${nameLower}`) ||
          lower.includes(`hey ${nameLower}`) ||
          lower.includes(`ok ${nameLower}`) ||
          lower.includes(`suno ${nameLower}`) ||
          (lower.startsWith(nameLower) && lower.length < nameLower.length + 5)
        ) {
          onWakeWordDetected(finalTranscript.trim());
        } else {
          onCommand(finalTranscript.trim());
        }
      }
    };

    recognition.onerror = (e: any) => {
      if (e.error !== 'no-speech' && e.error !== 'aborted') {
        console.warn('Speech recognition warning:', e.error);
      }
    };

    recognition.onend = () => {
      if (isListening) {
        clearTimeout(restartTimeout);
        restartTimeout = setTimeout(() => {
          try {
            if (isListening) recognition.start();
          } catch (e) {}
        }, 300);
      }
    };
  } catch (err) {
    console.error('Speech recognition setup error:', err);
  }

  return {
    start: () => {
      isListening = true;
      try {
        recognition?.start();
      } catch (e) {}
    },
    stop: () => {
      isListening = false;
      clearTimeout(restartTimeout);
      try {
        recognition?.stop();
      } catch (e) {}
    },
    isSupported: Boolean(SpeechRecognition),
  };
}
