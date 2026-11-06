import React from 'react';
import { Volume2, Mic, Sparkles } from 'lucide-react';
import { PriyaMood } from '../types';

interface FloatingOverlayBubbleProps {
  isVisible: boolean;
  isSpeaking: boolean;
  isListening: boolean;
  mood: PriyaMood;
  aiName: string;
  onClick: () => void;
  onClose: () => void;
}

export const FloatingOverlayBubble: React.FC<FloatingOverlayBubbleProps> = ({
  isVisible,
  isSpeaking,
  isListening,
  mood,
  aiName,
  onClick,
  onClose,
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2 select-none group">
      {/* Speech tooltip */}
      <div
        onClick={onClick}
        className="cursor-pointer bg-slate-900/95 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-2xl shadow-xl text-xs text-white max-w-[200px] truncate hidden sm:block animate-fadeIn hover:border-rose-500/50 transition-colors"
      >
        {isSpeaking ? (
          <span className="text-rose-300 flex items-center gap-1.5 font-medium">
            <Volume2 className="w-3.5 h-3.5 animate-pulse text-rose-400" />
            {aiName} is speaking...
          </span>
        ) : isListening ? (
          <span className="text-cyan-300 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            Listening...
          </span>
        ) : (
          <span className="text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-rose-400" />
            Tap {aiName} Overlay
          </span>
        )}
      </div>

      {/* Floating Head Avatar */}
      <div className="relative cursor-pointer" onClick={onClick}>
        {/* Glow */}
        <div
          className={`absolute -inset-1 rounded-full blur-md transition-all ${
            isSpeaking
              ? 'bg-rose-500 opacity-90 animate-pulse'
              : isListening
              ? 'bg-cyan-500 opacity-90 animate-ping'
              : 'bg-rose-500/50 opacity-50 group-hover:opacity-80'
          }`}
        />

        <div className="relative w-14 h-14 rounded-full ring-2 ring-white/30 overflow-hidden shadow-2xl bg-slate-900">
          <img
            src="/src/assets/images/priya_avatar_1794001797685.jpg"
            alt={aiName}
            className="w-full h-full object-cover object-top"
            referrerPolicy="no-referrer"
          />

          {isSpeaking && (
            <div className="absolute inset-0 bg-rose-950/40 flex items-center justify-center">
              <Volume2 className="w-5 h-5 text-white animate-pulse" />
            </div>
          )}

          {isListening && !isSpeaking && (
            <div className="absolute inset-0 bg-cyan-950/40 flex items-center justify-center">
              <Mic className="w-5 h-5 text-cyan-300 animate-bounce" />
            </div>
          )}
        </div>

        {/* Small close button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-slate-800 text-slate-400 hover:text-white border border-slate-700 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity"
          title="Hide Overlay"
        >
          &times;
        </button>
      </div>
    </div>
  );
};
