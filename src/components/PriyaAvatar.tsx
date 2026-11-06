import React from 'react';
import { PriyaMood } from '../types';
import { Volume2, VolumeX, Sparkles, Heart, Smile, Zap, Frown } from 'lucide-react';

interface PriyaAvatarProps {
  mood: PriyaMood;
  onMoodChange: (mood: PriyaMood) => void;
  isSpeaking: boolean;
  isListening: boolean;
  aiName: string;
  creatorName: string;
  onAvatarClick: () => void;
}

export const MOOD_DETAILS: Record<
  PriyaMood,
  { label: string; hindiLabel: string; icon: any; color: string; ringColor: string; quote: string }
> = {
  girlfriend: {
    label: 'Girlfriend Mode',
    hindiLabel: 'प्यार भरी बातें & नखरे',
    icon: Heart,
    color: 'from-rose-500 to-pink-600',
    ringColor: 'ring-rose-500 shadow-rose-500/30',
    quote: '"Aap mere sabse pyare ho babu! Aaj mere sath kya karoge? ❤️"',
  },
  khush: {
    label: 'Khush / Cheerful',
    hindiLabel: 'हंसमुख & खुशमिजाज',
    icon: Smile,
    color: 'from-amber-400 to-orange-500',
    ringColor: 'ring-amber-400 shadow-amber-400/30',
    quote: '"Hehe! Aaj main bohot khush hu! Suniye ek achhi si baat bataiye! 🌸"',
  },
  emotional: {
    label: 'Emotional / Caring',
    hindiLabel: 'दिल से जुड़ी बातें',
    icon: Frown,
    color: 'from-purple-500 to-indigo-600',
    ringColor: 'ring-purple-400 shadow-purple-500/30',
    quote: '"Aapki har baat mere dil ko chhu leti hai... Main hamesha aapke sath hu. 🥺"',
  },
  nakhre: {
    label: 'Nakhre / Playful',
    hindiLabel: 'नखरे & मीठी तकरार',
    icon: Sparkles,
    color: 'from-fuchsia-500 to-rose-600',
    ringColor: 'ring-fuchsia-500 shadow-fuchsia-500/30',
    quote: '"Pehle pyaar se bolo tabhi kaam karungi! Warna main gussa ho jaungi! 😜"',
  },
  super_assistant: {
    label: 'Super Assistant',
    hindiLabel: 'स्मार्ट & मल्टी-टास्किंग',
    icon: Zap,
    color: 'from-cyan-400 to-blue-600',
    ringColor: 'ring-cyan-400 shadow-cyan-400/30',
    quote: '"Main aapke saare mobile tasks aur alerts manage karne ke liye ready hu! ⚡"',
  },
};

export const PriyaAvatar: React.FC<PriyaAvatarProps> = ({
  mood,
  onMoodChange,
  isSpeaking,
  isListening,
  aiName,
  creatorName,
  onAvatarClick,
}) => {
  const currentDetails = MOOD_DETAILS[mood];

  return (
    <div className="flex flex-col items-center">
      {/* Central Holographic Avatar Container */}
      <div className="relative group cursor-pointer" onClick={onAvatarClick}>
        {/* Glow halo animation */}
        <div
          className={`absolute -inset-2 rounded-full blur-xl opacity-60 transition-all duration-700 ${
            isSpeaking
              ? 'animate-pulse scale-110 opacity-90'
              : isListening
              ? 'animate-ping scale-105 opacity-75'
              : 'opacity-40'
          } bg-gradient-to-r ${currentDetails.color}`}
        />

        {/* Outer Ring */}
        <div
          className={`relative w-40 h-40 sm:w-48 sm:h-48 rounded-full p-1.5 transition-all duration-500 ring-4 ${
            currentDetails.ringColor
          } ${isSpeaking ? 'scale-105' : 'hover:scale-102'}`}
        >
          {/* Avatar Image */}
          <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 border-2 border-white/20 relative shadow-2xl">
            <img
              src="/src/assets/images/priya_avatar_1794001797685.jpg"
              alt={aiName}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />

            {/* Speaking audio wave overlay at bottom */}
            {isSpeaking && (
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center gap-1">
                <span className="w-1 h-3 bg-rose-400 rounded-full animate-bounce delay-75" />
                <span className="w-1 h-6 bg-pink-400 rounded-full animate-bounce delay-150" />
                <span className="w-1 h-4 bg-rose-300 rounded-full animate-bounce delay-300" />
                <span className="w-1 h-7 bg-white rounded-full animate-bounce delay-100" />
                <span className="w-1 h-4 bg-pink-400 rounded-full animate-bounce delay-200" />
              </div>
            )}

            {/* Listening Indicator */}
            {isListening && !isSpeaking && (
              <div className="absolute top-3 right-3 w-4 h-4 rounded-full bg-cyan-400 animate-ping" />
            )}
          </div>
        </div>

        {/* State Tag */}
        <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-lg">
          {isSpeaking ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
              <span className="text-rose-300 font-medium">{aiName} is speaking...</span>
            </>
          ) : isListening ? (
            <>
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span className="text-cyan-300 font-medium">Listening for "Wake up {aiName}"</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span className="text-slate-300">Tap to speak with {aiName}</span>
            </>
          )}
        </div>
      </div>

      {/* Identity & Creator Attribution */}
      <div className="mt-5 text-center">
        <h2 className="text-2xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
          <span>{aiName}</span>
          <span className="text-xs font-normal text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
            AI Assistant
          </span>
        </h2>
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 mt-1">
          <span>Nirmata: <strong className="text-slate-200">{creatorName}</strong></span>
          <span aria-hidden="true">·</span>
          <span>Realistic Indian Voice</span>
          <span aria-hidden="true">·</span>
          <span>Background Ready</span>
        </div>

        {/* Current Mood Quote */}
        <p className="text-xs sm:text-sm text-slate-300 italic mt-2.5 max-w-md px-4 py-1.5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          {currentDetails.quote}
        </p>
      </div>

      {/* Mood Selector Segmented Tabs */}
      <div className="w-full max-w-xl mt-4 px-2">
        <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium text-center mb-1.5">
          Select {aiName}'s Mood / स्वभाव
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 p-1 bg-slate-900/80 backdrop-blur-md rounded-2xl border border-slate-800">
          {(Object.keys(MOOD_DETAILS) as PriyaMood[]).map((key) => {
            const m = MOOD_DETAILS[key];
            const Icon = m.icon;
            const isActive = mood === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => onMoodChange(key)}
                className={`flex flex-col items-center justify-center py-2 px-2 rounded-xl transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-br ${m.color} text-white shadow-md shadow-rose-950/40 font-semibold scale-102`
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="text-xs whitespace-nowrap">{m.label.split(' ')[0]}</span>
                <span className="text-[9px] opacity-80 whitespace-nowrap">{m.hindiLabel.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
