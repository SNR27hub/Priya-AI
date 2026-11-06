import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, PriyaMood } from '../types';
import { Send, Mic, MicOff, Volume2, Sparkles, Heart, SlidersHorizontal } from 'lucide-react';
import { getAllAvailableVoices } from '../utils/speech';

interface VoiceChatConsoleProps {
  messages: ChatMessage[];
  onSendMessage: (text: string) => void;
  isListening: boolean;
  onToggleMic: () => void;
  isSpeaking: boolean;
  onStopSpeech: () => void;
  onReplaySpeech: (text: string, mood?: PriyaMood) => void;
  aiName: string;
  creatorName: string;
  selectedVoice: string;
  onSelectVoice: (voiceName: string) => void;
}

export const VoiceChatConsole: React.FC<VoiceChatConsoleProps> = ({
  messages,
  onSendMessage,
  isListening,
  onToggleMic,
  isSpeaking,
  onStopSpeech,
  onReplaySpeech,
  aiName,
  creatorName,
  selectedVoice,
  onSelectVoice,
}) => {
  const [inputText, setInputText] = useState('');
  const [showVoicePicker, setShowVoicePicker] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const list = getAllAvailableVoices();
    setVoices(list);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        setVoices(getAllAvailableVoices());
      };
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const quickPrompts = [
    'Tumhe kisne banaya hai?',
    'Battery kitni percent hai?',
    'Mujhse pyaar karti ho?',
    'Romantic gana bajao',
    'Thoda nakhra dikhao na!',
    'Mera WhatsApp message bhejo',
  ];

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl flex flex-col h-[520px] shadow-xl overflow-hidden">
      {/* Console Header */}
      <div className="flex items-center justify-between p-3.5 border-b border-slate-800 bg-slate-950/60">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
          <h3 className="font-semibold text-white text-xs sm:text-sm flex items-center gap-1.5">
            <span>{aiName} Voice Dialogue</span>
            <span className="text-[10px] text-slate-400 font-normal">· Hindi / Hinglish</span>
          </h3>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Voice Picker Toggle */}
          <button
            type="button"
            onClick={() => setShowVoicePicker(!showVoicePicker)}
            className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 px-2.5 py-1 rounded-xl transition-colors"
            title="Choose Indian / Hindi Voice"
          >
            <SlidersHorizontal className="w-3 h-3 text-rose-400" />
            <span>Voice Selector</span>
          </button>

          {isSpeaking && (
            <button
              type="button"
              onClick={onStopSpeech}
              className="flex items-center gap-1 text-xs text-rose-300 hover:text-white bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 px-2.5 py-1 rounded-xl transition-colors"
            >
              <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
              <span>Mute</span>
            </button>
          )}
        </div>
      </div>

      {/* Voice Picker Dropdown Bar */}
      {showVoicePicker && (
        <div className="bg-slate-950/95 border-b border-slate-800 p-2.5 px-4 flex items-center justify-between gap-3 text-xs animate-fadeIn">
          <span className="text-slate-400 text-[11px] whitespace-nowrap">Aawaz Chuniye:</span>
          <select
            value={selectedVoice}
            onChange={(e) => {
              onSelectVoice(e.target.value);
              onReplaySpeech('Haanji, sun rahi hu! Yeh meri nayi voice hai.');
            }}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white focus:outline-none"
          >
            <option value="">Default Best Indian Female (Auto-Selected)</option>
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar indicator */}
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold overflow-hidden shadow-sm ${
                  isUser
                    ? 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                    : 'bg-rose-500/20 border border-rose-500/40 text-rose-300'
                }`}
              >
                {isUser ? (
                  'You'
                ) : (
                  <img
                    src="/src/assets/images/priya_avatar_1794001797685.jpg"
                    alt={aiName}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                )}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[82%] sm:max-w-[75%] rounded-2xl px-4 py-2.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                  isUser
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-950/80 border border-slate-800 text-slate-100 rounded-tl-none'
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-[10px] font-medium opacity-60">
                    {isUser ? 'You' : aiName}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="text-[9px] opacity-40 font-mono">{msg.timestamp}</span>
                    {!isUser && (
                      <button
                        type="button"
                        onClick={() => onReplaySpeech(msg.text, msg.mood)}
                        className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
                        title="Replay Voice"
                      >
                        <Volume2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Voice Chips */}
      <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 overflow-x-auto flex items-center gap-1.5 no-scrollbar">
        <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold shrink-0">
          Try:
        </span>
        {quickPrompts.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onSendMessage(p)}
            className="text-[11px] whitespace-nowrap bg-slate-800/70 hover:bg-slate-700/80 text-slate-300 hover:text-white px-2.5 py-1 rounded-xl transition-colors border border-slate-700/60"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-t border-slate-800 bg-slate-950/90 flex items-center gap-2"
      >
        <button
          type="button"
          onClick={onToggleMic}
          className={`p-2.5 rounded-2xl transition-all shadow-md ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse shadow-rose-950/50'
              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
          }`}
          title={isListening ? 'Stop Mic' : 'Start Mic Voice Input'}
        >
          {isListening ? <Mic className="w-4 h-4 text-white" /> : <MicOff className="w-4 h-4" />}
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={`Speak or type in Hindi/English (e.g. "Tumhe kisne banaya?")...`}
          className="flex-1 bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-500"
        />

        <button
          type="submit"
          disabled={!inputText.trim()}
          className="p-2.5 rounded-2xl bg-rose-600 hover:bg-rose-500 disabled:opacity-40 text-white transition-all shadow-md shadow-rose-950/40 active:scale-95"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
