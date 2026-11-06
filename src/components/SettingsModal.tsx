import React, { useState } from 'react';
import { AppSettings, VoiceSettings } from '../types';
import { X, Settings, Volume2, Save, Key, Sparkles, User, Mic } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  appSettings: AppSettings;
  voiceSettings: VoiceSettings;
  onSave: (appSettings: AppSettings, voiceSettings: VoiceSettings) => void;
  onTestVoice: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  appSettings,
  voiceSettings,
  onSave,
  onTestVoice,
}) => {
  if (!isOpen) return null;

  const [localApp, setLocalApp] = useState<AppSettings>({ ...appSettings });
  const [localVoice, setLocalVoice] = useState<VoiceSettings>({ ...voiceSettings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onSave(localApp, localVoice);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-slate-200">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                {localApp.aiName} AI Core Settings
              </h2>
              <p className="text-xs text-slate-400">
                AI identity, creator attribution, wake-word & voice parameters
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Identity Settings */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
            <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-rose-400" />
              <span>Assistant Identity & Creator</span>
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400 block mb-1">AI Assistant Name</label>
                <input
                  type="text"
                  value={localApp.aiName}
                  onChange={(e) => setLocalApp({ ...localApp, aiName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-semibold"
                />
              </div>

              <div>
                <label className="text-[11px] text-slate-400 block mb-1">
                  Creator Name (Nirmata)
                </label>
                <input
                  type="text"
                  value={localApp.creatorName}
                  onChange={(e) => setLocalApp({ ...localApp, creatorName: e.target.value })}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 font-semibold text-emerald-400"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Aapka Nickname (What {localApp.aiName} calls you in Girlfriend mode)
              </label>
              <input
                type="text"
                value={localApp.userNickname}
                onChange={(e) => setLocalApp({ ...localApp, userNickname: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                placeholder="Babu, Jaan, Shankar ji, etc."
              />
            </div>

            <div className="text-[11px] text-slate-400 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
              📌 <strong>Nirmata Rule:</strong> Jab bhi koi puchega "Tumhe kisne banaya hai?", {localApp.aiName} bolega: <em>"Mujhe banane wale vyakti {localApp.creatorName} hain! {localApp.creatorName} ne mujhe banaya hai."</em>
            </div>
          </div>

          {/* Wake Word Settings */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
            <span className="text-xs font-semibold text-cyan-300 flex items-center gap-1.5">
              <Mic className="w-4 h-4 text-cyan-400" />
              <span>Voice Wake Word</span>
            </span>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Custom Wake-Up Phrase (बोलने पर एक्टिव होगा)
              </label>
              <input
                type="text"
                value={localApp.wakeWord}
                onChange={(e) => setLocalApp({ ...localApp, wakeWord: e.target.value })}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                placeholder="Wake up Priya"
              />
            </div>
          </div>

          {/* Voice Tuning */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-purple-300 flex items-center gap-1.5">
                <Volume2 className="w-4 h-4 text-purple-400" />
                <span>Indian Female Voice Modulation</span>
              </span>
              <button
                type="button"
                onClick={onTestVoice}
                className="flex items-center gap-1 text-[11px] text-purple-300 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 px-2.5 py-1 rounded-lg transition-colors"
              >
                <Volume2 className="w-3 h-3" />
                <span>Test Voice</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Voice Pitch (आवाज़ का सुरीलापन): {localVoice.pitch.toFixed(2)}x</span>
                  <span>Sweet & Feminine</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.5"
                  step="0.05"
                  value={localVoice.pitch}
                  onChange={(e) => setLocalVoice({ ...localVoice, pitch: parseFloat(e.target.value) })}
                  className="w-full accent-rose-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                  <span>Speech Rate (बोलने की गति): {localVoice.rate.toFixed(2)}x</span>
                  <span>Natural Speed</span>
                </div>
                <input
                  type="range"
                  min="0.7"
                  max="1.4"
                  step="0.05"
                  value={localVoice.rate}
                  onChange={(e) => setLocalVoice({ ...localVoice, rate: parseFloat(e.target.value) })}
                  className="w-full accent-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Gemini AI Key Option */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-2">
            <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
              <Key className="w-4 h-4 text-amber-400" />
              <span>Gemini AI Engine (Optional Custom Key)</span>
            </span>
            <p className="text-[11px] text-slate-400">
              Priya uses server-side Gemini 3.8 Flash automatically with offline Hindi/Hinglish intelligence fallback. If you have your own Gemini key, you can optionally paste it here:
            </p>
            <input
              type="password"
              value={localApp.customApiKey}
              onChange={(e) => setLocalApp({ ...localApp, customApiKey: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
              placeholder="AIzaSy... (Leave empty for default server engine)"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 rounded-xl shadow-lg shadow-rose-950/40 transition-all active:scale-95"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savedSuccess ? 'Saved!' : 'Save Settings'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
