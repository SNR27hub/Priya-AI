import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  PriyaMood,
  BatteryAlertSettings,
  VoiceSettings,
  AppSettings,
  ChatMessage,
  LearnedSkill,
  MobileNotification,
} from './types';
import { batteryService, BatteryState } from './utils/batteryService';
import { speakPriya, stopPriyaSpeech, createSpeechListener, SpeechRecognitionController } from './utils/speech';
import { PriyaAvatar } from './components/PriyaAvatar';
import { BatteryAlertsCard } from './components/BatteryAlertsCard';
import { PhoneSimulator } from './components/PhoneSimulator';
import { VoiceChatConsole } from './components/VoiceChatConsole';
import { BatterySettingsModal } from './components/BatterySettingsModal';
import { AndroidExporterModal } from './components/AndroidExporterModal';
import { TrainingMemoryModal } from './components/TrainingMemoryModal';
import { SettingsModal } from './components/SettingsModal';
import { FloatingOverlayBubble } from './components/FloatingOverlayBubble';
import { ScreenOffSimulator } from './components/ScreenOffSimulator';
import {
  Smartphone,
  BatteryCharging,
  Sliders,
  Sparkles,
  Terminal,
  Volume2,
  Mic,
  Moon,
  Layers,
  Heart,
  Github,
} from 'lucide-react';

export default function App() {
  // 1. Core State
  const [mood, setMood] = useState<PriyaMood>('girlfriend');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [isScreenOff, setIsScreenOff] = useState(false);
  const [floatingOverlayVisible, setFloatingOverlayVisible] = useState(true);

  // 2. Modals
  const [isBatteryModalOpen, setIsBatteryModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isAndroidModalOpen, setIsAndroidModalOpen] = useState(false);
  const [isTrainingModalOpen, setIsTrainingModalOpen] = useState(false);

  // 3. App Settings (SNR Creator Specification)
  const [appSettings, setAppSettings] = useState<AppSettings>({
    aiName: 'Priya',
    creatorName: 'SNR',
    wakeWord: 'Wake up Priya',
    isWakeWordActive: true,
    floatingOverlayActive: true,
    customApiKey: '',
    screenOffSimulation: false,
    userNickname: 'Babu',
  });

  // 4. Voice Settings
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    pitch: 1.1,
    rate: 1.0,
    volume: 1.0,
    preferredVoice: '',
    autoSpeak: true,
  });

  // 5. Battery Alert Settings
  const [batterySettings, setBatterySettings] = useState<BatteryAlertSettings>({
    alertOnConnected: true,
    connectedText: 'Aha! Charger lag gaya hai. Phone ab charge ho raha hai!',
    alertOnDisconnected: true,
    disconnectedText: 'Charger hata diya gaya hai. Battery abhi {percent}% bachi hai.',
    alertOnFull: true,
    fullThreshold: 100,
    fullText: 'Battery full 100% charge ho chuki hai! Kripya charger nikal lijiye.',
    alertOnLow: true,
    lowThreshold: 20,
    lowText: 'Warning! Battery bahut kam hai, sirf {percent}% bachi hai. Please phone charge par lagaiye!',
    voiceVolume: 1.0,
  });

  // 6. Battery State
  const [batteryState, setBatteryState] = useState<BatteryState>(batteryService.getState());

  // 7. Chat Messages
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'priya',
      text: 'Namaste babu! Haanji, main sun rahi hu, boliye kya seva karu aapki? ❤️',
      timestamp: 'Just now',
      mood: 'girlfriend',
    },
  ]);

  // 8. Learned Skills / Memory
  const [skills, setSkills] = useState<LearnedSkill[]>([
    {
      id: 'skill-1',
      trigger: 'Tumhe kisne banaya hai?',
      response: 'Mujhe banane wale vyakti SNR hain! SNR ne mujhe banaya hai. Main hamesha SNR ki Priya hu! ❤️',
      category: 'custom',
      createdAt: 'Default',
    },
    {
      id: 'skill-2',
      trigger: 'Mera favorite gaana kaunsa hai?',
      response: 'Aapka favorite gaana Arijit Singh ka romantic track hai! Kya main baja du?',
      category: 'custom',
      createdAt: 'Default',
    },
  ]);

  // 9. Simulated Notifications
  const [notifications, setNotifications] = useState<MobileNotification[]>([
    {
      id: 'notif-1',
      appName: 'WhatsApp',
      title: 'Rahul (Friend)',
      message: 'Bhai sham ko milte hain coffee shop par?',
      timestamp: '5 min ago',
      isRead: false,
    },
    {
      id: 'notif-2',
      appName: 'Battery',
      title: 'Power Connected',
      message: 'Fast charging started · 78%',
      timestamp: '12 min ago',
      isRead: true,
    },
    {
      id: 'notif-3',
      appName: 'Phone',
      title: 'Missed Call',
      message: 'Call from Mom (2 missed calls)',
      timestamp: '25 min ago',
      isRead: false,
    },
  ]);

  const speechControllerRef = useRef<SpeechRecognitionController | null>(null);

  // Speak helper
  const handleSpeak = (text: string, customMood?: PriyaMood) => {
    setIsSpeaking(true);
    speakPriya(
      text,
      customMood || mood,
      voiceSettings,
      () => setIsSpeaking(false),
      () => setIsSpeaking(true)
    );
  };

  // Battery event bindings
  useEffect(() => {
    const unsubState = batteryService.onStateChange((state) => {
      setBatteryState(state);
    });

    const unsubEvent = batteryService.onEvent((event, state) => {
      if (event === 'connected' && batterySettings.alertOnConnected) {
        handleSpeak(batterySettings.connectedText);
      } else if (event === 'disconnected' && batterySettings.alertOnDisconnected) {
        const text = batterySettings.disconnectedText.replace('{percent}', String(state.level));
        handleSpeak(text);
      } else if (event === 'full' && batterySettings.alertOnFull) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        handleSpeak(batterySettings.fullText);
      } else if (event === 'low' && batterySettings.alertOnLow) {
        const text = batterySettings.lowText.replace('{percent}', String(state.level));
        handleSpeak(text);
      }
    });

    return () => {
      unsubState();
      unsubEvent();
    };
  }, [batterySettings, mood, voiceSettings]);

  // Process user input (Speech or Text)
  const processUserInput = async (text: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);

    const lower = text.toLowerCase().trim();

    // 1. Check custom learned skills first
    const matchedSkill = skills.find((s) => lower.includes(s.trigger.toLowerCase()));
    if (matchedSkill) {
      handlePriyaReply(matchedSkill.response);
      return;
    }

    // 2. Creator Question (SNR specification)
    if (
      lower.includes('kisne banaya') ||
      lower.includes('who created') ||
      lower.includes('who made') ||
      lower.includes('creator') ||
      lower.includes('tumhe kisne')
    ) {
      const reply = `Mujhe banane wale vyakti ${appSettings.creatorName} hain! ${appSettings.creatorName} ne mujhe banaya hai. Main hamesha unki Priya hu! ❤️`;
      handlePriyaReply(reply);
      return;
    }

    // 3. Battery Query
    if (lower.includes('battery') || lower.includes('kitni percent') || lower.includes('charge kitna')) {
      const chargeText = batteryState.charging ? 'aur charger laga hua hai' : 'aur charger hata hua hai';
      const reply = `Aapki phone battery abhi ${batteryState.level}% hai ${chargeText}. Main battery alerts ke liye active hu!`;
      handlePriyaReply(reply);
      return;
    }

    // 4. Music Query
    if (lower.includes('gana') || lower.includes('song') || lower.includes('music') || lower.includes('bajao')) {
      const songName = text.replace(/(gana|song|music|bajao|mere liye|play)/gi, '').trim() || 'Arijit Singh Romantic Mashup';
      setCurrentSong(songName);
      const reply = `Zaroor ${appSettings.userNickname}! Aapke liye "${songName}" baja rahi hu, enjoy kijiye! 🎵`;
      handlePriyaReply(reply);
      return;
    }

    // 5. Query Backend / Gemini Chat
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: text,
          mood,
          aiName: appSettings.aiName,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        handlePriyaReply(data.reply);
      } else {
        fallbackLocalNLP(lower);
      }
    } catch (e) {
      fallbackLocalNLP(lower);
    }
  };

  const fallbackLocalNLP = (lower: string) => {
    let reply = `Haanji ${appSettings.userNickname}! Maine aapki baat sun li hai. Main aapke phone ke saare tasks karne ke liye ready hu!`;
    if (mood === 'girlfriend') {
      reply = `Aww ${appSettings.userNickname}! Aapke sath baat karke mera dil khush ho jata hai. Aur batao kya haal hain? ❤️`;
    } else if (mood === 'nakhre') {
      reply = `Dekho babu, itne nakhre toh har pyari ladki karti hai! Par aapka kaam main hamesha karungi! 😜`;
    }
    handlePriyaReply(reply);
  };

  const handlePriyaReply = (reply: string) => {
    const priyaMsg: ChatMessage = {
      id: `priya-${Date.now()}`,
      sender: 'priya',
      text: reply,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mood,
    };
    setMessages((prev) => [...prev, priyaMsg]);
    handleSpeak(reply);
  };

  // Initialize Speech Recognition & Wake Word
  useEffect(() => {
    const controller = createSpeechListener(
      (transcript) => {
        processUserInput(transcript);
      },
      (wakeTranscript) => {
        // Wake-word detected!
        if (isScreenOff) {
          setIsScreenOff(false);
        }
        const greetings = [
          `Haanji ${appSettings.userNickname}! Sun rahi hu, bataiye kya kaam hai? ❤️`,
          `Suno na! Main sun rahi hu, boliye kya order hai aapka? ✨`,
          `Haanji babu! Sun rahi hu, boliye? 🌸`,
        ];
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        handlePriyaReply(randomGreeting);
      },
      appSettings.wakeWord,
      appSettings.aiName
    );

    speechControllerRef.current = controller;
    if (appSettings.isWakeWordActive) {
      controller.start();
      setIsListening(true);
    }

    return () => {
      controller.stop();
    };
  }, [appSettings.wakeWord, appSettings.aiName, appSettings.isWakeWordActive, isScreenOff, mood]);

  const toggleMic = () => {
    if (isListening) {
      speechControllerRef.current?.stop();
      setIsListening(false);
    } else {
      speechControllerRef.current?.start();
      setIsListening(true);
    }
  };

  // Stop current voice
  const stopSpeech = () => {
    stopPriyaSpeech();
    setIsSpeaking(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-rose-500/30 selection:text-rose-200">
      {/* 1. TOP BAR CONTRACT */}
      <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-8">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-2 whitespace-nowrap shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-500 to-indigo-600 p-0.5 shadow-md shadow-rose-950/40">
            <img
              src="/src/assets/images/priya_avatar_1794001797685.jpg"
              alt={appSettings.aiName}
              className="w-full h-full object-cover rounded-[10px]"
              referrerPolicy="no-referrer"
            />
          </div>
          <div>
            <span className="text-base sm:text-lg font-bold tracking-tight text-white">
              {appSettings.aiName} AI
            </span>
            <span className="text-[10px] text-slate-400 block -mt-1">
              Voice & Mobile Assistant
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (Single-line whitespace-nowrap) */}
        <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-400">
          <button
            type="button"
            onClick={() => setIsBatteryModalOpen(true)}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <BatteryCharging className="w-3.5 h-3.5 text-emerald-400" />
            <span>Battery Alerts ({batteryState.level}%)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsTrainingModalOpen(true)}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Brain & Training</span>
          </button>

          <button
            type="button"
            onClick={() => setIsScreenOff(true)}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 text-slate-400"
            title="Simulate phone locked/screen off wake-word test"
          >
            <Moon className="w-3.5 h-3.5 text-amber-400" />
            <span>Screen-Off Test</span>
          </button>

          <button
            type="button"
            onClick={() => setIsSettingsModalOpen(true)}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span>Settings</span>
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (Direct GitHub Auto-Release APK) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsAndroidModalOpen(true)}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 rounded-xl shadow-lg shadow-rose-950/40 transition-all active:scale-95 whitespace-nowrap shrink-0"
          >
            <Github className="w-4 h-4" />
            <span>GitHub Auto-Release APK</span>
          </button>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Hero & Priya Holographic Persona */}
        <section className="bg-gradient-to-b from-slate-900/60 to-slate-950/80 rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
          {/* Subtle Cyber Glow Backdrop */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          <PriyaAvatar
            mood={mood}
            onMoodChange={(newMood) => {
              setMood(newMood);
              const moodGreetings: Record<PriyaMood, string> = {
                girlfriend: `Aapne mujhe Girlfriend mode me switch kiya hai babu! Ab main poore pyaar aur nakhre se baat karungi! ❤️`,
                khush: `Hehe! Khush mood active! Chaliye koi mast si baat karte hain! 🌸`,
                emotional: `Main emotional mode me hu... Dil ki baatein sunne ke liye taiyaar hu. 🥺`,
                nakhre: `Achha ji! Nakhre mode on! Ab thoda manao mujhe tab kaam karungi! 😜`,
                super_assistant: `Super Assistant mode active! Saare mobile tasks aur notifications ke liye taiyaar hu! ⚡`,
              };
              handleSpeak(moodGreetings[newMood], newMood);
            }}
            isSpeaking={isSpeaking}
            isListening={isListening}
            aiName={appSettings.aiName}
            creatorName={appSettings.creatorName}
            onAvatarClick={() => {
              handleSpeak(
                `Haanji ${appSettings.userNickname}! Sun rahi hu, boliye kya seva karu aapki? ❤️`
              );
            }}
          />
        </section>

        {/* 2-Column Split: Mobile Agent Sandbox & Voice Dialogue Console */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Left Column: Mobile Agent Sandbox & Battery Alerts */}
          <div className="space-y-6">
            <BatteryAlertsCard
              batteryState={batteryState}
              batterySettings={batterySettings}
              aiName={appSettings.aiName}
              onOpenSettings={() => setIsBatteryModalOpen(true)}
              onSimulatePlug={() => batteryService.simulateSetCharging(true)}
              onSimulateUnplug={() => batteryService.simulateSetCharging(false)}
              onSimulateFull={() => batteryService.simulateSetLevel(100)}
              onSimulateLow={() => batteryService.simulateSetLevel(batterySettings.lowThreshold)}
              onAskBattery={() => {
                const chargeStatus = batteryState.charging ? 'aur charger laga hua hai' : 'aur charger hata hua hai';
                handleSpeak(`Aapki battery abhi ${batteryState.level}% hai ${chargeStatus}!`);
              }}
            />

            <PhoneSimulator
              aiName={appSettings.aiName}
              onSpeak={handleSpeak}
              onSendWhatsApp={(recipient, msg) => {
                const text = `WhatsApp message for ${recipient}: ${msg}`;
                setMessages((prev) => [
                  ...prev,
                  {
                    id: `wa-${Date.now()}`,
                    sender: 'priya',
                    text: `✅ WhatsApp task executed: Message to ${recipient} sent!`,
                    timestamp: 'Just now',
                    mood,
                  },
                ]);
              }}
              onPlaySong={(song) => {
                setCurrentSong(song);
                handleSpeak(`Aapke liye "${song}" baja rahi hu, suniye! 🎵`);
              }}
              currentSong={currentSong}
              notifications={notifications}
              onLearnFromNotification={(notif) => {
                // Auto create new skill from notification
                const newSkill: LearnedSkill = {
                  id: `skill-${Date.now()}`,
                  trigger: `Reply to ${notif.title}`,
                  response: `Haanji, maine ${notif.title} ka notification padh liya hai. Main unhe reply bhej rahi hu!`,
                  category: 'notification',
                  createdAt: 'Just now',
                };
                setSkills((prev) => [newSkill, ...prev]);
                handleSpeak(`Maine "${notif.title}" se seekh kar naya auto-reply yaad kar liya hai!`);
              }}
            />
          </div>

          {/* Right Column: Voice Dialogue Console */}
          <div>
            <VoiceChatConsole
              messages={messages}
              onSendMessage={processUserInput}
              isListening={isListening}
              onToggleMic={toggleMic}
              isSpeaking={isSpeaking}
              onStopSpeech={stopSpeech}
              onReplaySpeech={handleSpeak}
              aiName={appSettings.aiName}
              creatorName={appSettings.creatorName}
              selectedVoice={voiceSettings.preferredVoice}
              onSelectVoice={(voiceName) =>
                setVoiceSettings((prev) => ({ ...prev, preferredVoice: voiceName }))
              }
            />

            {/* Quick Action Bar below console */}
            <div className="mt-3 flex items-center justify-between text-xs text-slate-400 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Wake word: <strong>"{appSettings.wakeWord}"</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsScreenOff(true)}
                  className="hover:text-white transition-colors"
                >
                  Test Screen Off Mode
                </button>
                <span aria-hidden="true">·</span>
                <button
                  type="button"
                  onClick={() => setIsAndroidModalOpen(true)}
                  className="text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1"
                >
                  <Github className="w-3.5 h-3.5" />
                  <span>GitHub Auto-Release APK</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Priya Overlay Bubble (Simulates Android System Alert Window) */}
      <FloatingOverlayBubble
        isVisible={floatingOverlayVisible}
        isSpeaking={isSpeaking}
        isListening={isListening}
        mood={mood}
        aiName={appSettings.aiName}
        onClick={() => {
          handleSpeak(`Haanji ${appSettings.userNickname}! Floating overlay se Priya sun rahi hai. Boliye! ❤️`);
        }}
        onClose={() => setFloatingOverlayVisible(false)}
      />

      {/* Screen Off / Locked Phone Simulator */}
      <ScreenOffSimulator
        isActive={isScreenOff}
        onWakeUp={() => {
          setIsScreenOff(false);
          handleSpeak(`Screen on ho gayi hai ${appSettings.userNickname}! Priya aapke sath hai.`);
        }}
        aiName={appSettings.aiName}
        batteryState={batteryState}
        isListening={isListening}
      />

      {/* Modals */}
      <BatterySettingsModal
        isOpen={isBatteryModalOpen}
        onClose={() => setIsBatteryModalOpen(false)}
        settings={batterySettings}
        onSave={(newSettings) => setBatterySettings(newSettings)}
        onTestVoice={handleSpeak}
        aiName={appSettings.aiName}
      />

      <AndroidExporterModal
        isOpen={isAndroidModalOpen}
        onClose={() => setIsAndroidModalOpen(false)}
        aiName={appSettings.aiName}
        creatorName={appSettings.creatorName}
      />

      <TrainingMemoryModal
        isOpen={isTrainingModalOpen}
        onClose={() => setIsTrainingModalOpen(false)}
        skills={skills}
        onAddSkill={(newSkill) => {
          const created: LearnedSkill = {
            ...newSkill,
            id: `skill-${Date.now()}`,
            createdAt: 'Just now',
          };
          setSkills((prev) => [created, ...prev]);
        }}
        onDeleteSkill={(id) => {
          setSkills((prev) => prev.filter((s) => s.id !== id));
        }}
        onTestVoice={handleSpeak}
        aiName={appSettings.aiName}
      />

      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        appSettings={appSettings}
        voiceSettings={voiceSettings}
        onSave={(newApp, newVoice) => {
          setAppSettings(newApp);
          setVoiceSettings(newVoice);
        }}
        onTestVoice={() => {
          handleSpeak(
            `Haanji ${appSettings.userNickname}! Yeh meri realistic voice test hai, main bilkul theek se sun rahi hu!`
          );
        }}
      />
    </div>
  );
}
