import { PriyaMood, VoiceSettings } from '../types';

let currentUtterance: SpeechSynthesisUtterance | null = null;

// Find best available female voice, prioritizing Hindi or Indian English
export function getBestFemaleVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  // 1. Check for Hindi female voices
  const hindiVoice = voices.find(
    (v) =>
      (v.lang.toLowerCase().includes('hi-in') || v.lang.toLowerCase().includes('hi')) &&
      (v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('lekha') ||
        v.name.toLowerCase().includes('priya') ||
        v.name.toLowerCase().includes('kalpana') ||
        v.name.toLowerCase().includes('swara'))
  );
  if (hindiVoice) return hindiVoice;

  // 2. Any Hindi voice
  const anyHindi = voices.find((v) => v.lang.toLowerCase().includes('hi'));
  if (anyHindi) return anyHindi;

  // 3. Indian English Female voice (e.g. Heera, Veena, Neerja, Google Indian English)
  const indianFemale = voices.find(
    (v) =>
      v.lang.toLowerCase().includes('en-in') &&
      (v.name.toLowerCase().includes('female') ||
        v.name.toLowerCase().includes('heera') ||
        v.name.toLowerCase().includes('veena') ||
        v.name.toLowerCase().includes('neerja') ||
        v.name.toLowerCase().includes('google'))
  );
  if (indianFemale) return indianFemale;

  const anyIndianEn = voices.find((v) => v.lang.toLowerCase().includes('en-in'));
  if (anyIndianEn) return anyIndianEn;

  // 4. Any English female voice
  const femaleVoice = voices.find(
    (v) =>
      v.name.toLowerCase().includes('female') ||
      v.name.toLowerCase().includes('zira') ||
      v.name.toLowerCase().includes('samantha') ||
      v.name.toLowerCase().includes('karen') ||
      v.name.toLowerCase().includes('victoria') ||
      v.name.toLowerCase().includes('natural')
  );
  if (femaleVoice) return femaleVoice;

  return voices[0] || null;
}

// Speak function with emotional modulation
export function speakPriya(
  text: string,
  mood: PriyaMood = 'girlfriend',
  settings?: Partial<VoiceSettings>,
  onEnd?: () => void,
  onStart?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('SpeechSynthesis not supported in this environment');
    if (onEnd) onEnd();
    return false;
  }

  try {
    window.speechSynthesis.cancel();

    // Clean text of emojis and symbols for smoother speech
    const cleanText = text
      .replace(/[❤️💖💕😘😜🥺🌸✨⚡👑🥰😍]/g, '')
      .replace(/\*+/g, '')
      .trim();

    if (!cleanText) {
      if (onEnd) onEnd();
      return false;
    }

    const utterance = new SpeechSynthesisUtterance(cleanText);
    currentUtterance = utterance;

    const voice = getBestFemaleVoice();
    if (voice) {
      utterance.voice = voice;
    }

    // Mood-specific pitch and speed tuning
    let pitchMultiplier = 1.0;
    let rateMultiplier = 1.0;

    switch (mood) {
      case 'girlfriend':
        pitchMultiplier = 1.15;
        rateMultiplier = 0.96;
        break;
      case 'nakhre':
        pitchMultiplier = 1.25;
        rateMultiplier = 1.08;
        break;
      case 'khush':
        pitchMultiplier = 1.18;
        rateMultiplier = 1.05;
        break;
      case 'emotional':
        pitchMultiplier = 0.95;
        rateMultiplier = 0.88;
        break;
      case 'super_assistant':
        pitchMultiplier = 1.02;
        rateMultiplier = 1.02;
        break;
    }

    const basePitch = settings?.pitch ?? 1.0;
    const baseRate = settings?.rate ?? 1.0;
    const baseVolume = settings?.volume ?? 1.0;

    utterance.pitch = Math.min(2.0, Math.max(0.5, basePitch * pitchMultiplier));
    utterance.rate = Math.min(2.0, Math.max(0.5, baseRate * rateMultiplier));
    utterance.volume = Math.min(1.0, Math.max(0.0, baseVolume));

    utterance.onstart = () => {
      if (onStart) onStart();
    };

    utterance.onend = () => {
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      console.warn('Speech error:', e);
      currentUtterance = null;
      if (onEnd) onEnd();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('Error invoking speech synthesis:', err);
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
    recognition.lang = 'hi-IN'; // Also recognizes Hinglish well

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
      // Do not crash on non-fatal speech errors like 'no-speech'
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
          } catch (e) {
            // Already started or busy
          }
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
      } catch (e) {
        // Recognition might be running
      }
    },
    stop: () => {
      isListening = false;
      clearTimeout(restartTimeout);
      try {
        recognition?.stop();
      } catch (e) {
        // Safe ignore
      }
    },
    isSupported: Boolean(SpeechRecognition),
  };
}
