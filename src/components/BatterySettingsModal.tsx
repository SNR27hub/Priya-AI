import React, { useState } from 'react';
import { BatteryAlertSettings } from '../types';
import { X, Volume2, Save, RotateCcw, Zap, Plug, CheckCircle2, BatteryWarning } from 'lucide-react';

interface BatterySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: BatteryAlertSettings;
  onSave: (newSettings: BatteryAlertSettings) => void;
  onTestVoice: (text: string) => void;
  aiName: string;
}

export const BatterySettingsModal: React.FC<BatterySettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  onTestVoice,
  aiName,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<BatteryAlertSettings>({ ...settings });
  const [savedBadge, setSavedBadge] = useState(false);

  const handleSave = () => {
    onSave(formData);
    setSavedBadge(true);
    setTimeout(() => {
      setSavedBadge(false);
      onClose();
    }, 800);
  };

  const handleResetDefaults = () => {
    const defaults: BatteryAlertSettings = {
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
    };
    setFormData(defaults);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/60">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" />
              <span>Battery & Charger Voice Alerts Customizer</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Customize exactly what {aiName} will speak for every battery event
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Section 1: Charger Connected */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-semibold text-emerald-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.alertOnConnected}
                  onChange={(e) => setFormData({ ...formData, alertOnConnected: e.target.checked })}
                  className="rounded text-emerald-500 focus:ring-emerald-400 bg-slate-900 border-slate-700 w-4 h-4"
                />
                <Zap className="w-4 h-4" />
                <span>Charger Plugged Alert (चार्जर लगने पर)</span>
              </label>

              <button
                type="button"
                onClick={() => onTestVoice(formData.connectedText)}
                className="flex items-center gap-1 text-xs text-emerald-300 hover:text-emerald-200 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-lg border border-emerald-500/20"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Voice</span>
              </button>
            </div>

            <textarea
              rows={2}
              value={formData.connectedText}
              onChange={(e) => setFormData({ ...formData, connectedText: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
              placeholder="What Priya should say when charger is plugged..."
            />
          </div>

          {/* Section 2: Charger Disconnected */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-semibold text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.alertOnDisconnected}
                  onChange={(e) => setFormData({ ...formData, alertOnDisconnected: e.target.checked })}
                  className="rounded text-slate-500 focus:ring-slate-400 bg-slate-900 border-slate-700 w-4 h-4"
                />
                <Plug className="w-4 h-4 text-slate-400" />
                <span>Charger Unplugged Alert (चार्जर हटाने पर)</span>
              </label>

              <button
                type="button"
                onClick={() =>
                  onTestVoice(formData.disconnectedText.replace('{percent}', '78'))
                }
                className="flex items-center gap-1 text-xs text-slate-300 hover:text-white bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Voice</span>
              </button>
            </div>

            <textarea
              rows={2}
              value={formData.disconnectedText}
              onChange={(e) => setFormData({ ...formData, disconnectedText: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-slate-500 resize-none"
              placeholder="What Priya should say when charger is removed..."
            />
            <span className="text-[10px] text-slate-500 block">
              Tip: Use <code>{'{percent}'}</code> in the text to speak live percentage (e.g. 78%).
            </span>
          </div>

          {/* Section 3: Battery Full Alert */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-semibold text-teal-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.alertOnFull}
                  onChange={(e) => setFormData({ ...formData, alertOnFull: e.target.checked })}
                  className="rounded text-teal-500 focus:ring-teal-400 bg-slate-900 border-slate-700 w-4 h-4"
                />
                <CheckCircle2 className="w-4 h-4" />
                <span>Battery 100% Full Alert (फुल चार्ज होने पर)</span>
              </label>

              <button
                type="button"
                onClick={() => onTestVoice(formData.fullText)}
                className="flex items-center gap-1 text-xs text-teal-300 hover:text-teal-200 bg-teal-500/10 hover:bg-teal-500/20 px-2.5 py-1 rounded-lg border border-teal-500/20"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Voice</span>
              </button>
            </div>

            <textarea
              rows={2}
              value={formData.fullText}
              onChange={(e) => setFormData({ ...formData, fullText: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500 resize-none"
              placeholder="Full charge alert text..."
            />
          </div>

          {/* Section 4: Low Battery Alert */}
          <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 space-y-3">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-semibold text-rose-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.alertOnLow}
                  onChange={(e) => setFormData({ ...formData, alertOnLow: e.target.checked })}
                  className="rounded text-rose-500 focus:ring-rose-400 bg-slate-900 border-slate-700 w-4 h-4"
                />
                <BatteryWarning className="w-4 h-4" />
                <span>Low Battery Warning (बैटरी लो होने पर)</span>
              </label>

              <button
                type="button"
                onClick={() =>
                  onTestVoice(formData.lowText.replace('{percent}', String(formData.lowThreshold)))
                }
                className="flex items-center gap-1 text-xs text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 px-2.5 py-1 rounded-lg border border-rose-500/20"
              >
                <Volume2 className="w-3.5 h-3.5" />
                <span>Test Voice</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="text-xs text-slate-400">
                Trigger Threshold: <strong className="text-rose-400 font-mono">{formData.lowThreshold}%</strong>
              </span>
              <input
                type="range"
                min="10"
                max="30"
                step="5"
                value={formData.lowThreshold}
                onChange={(e) => setFormData({ ...formData, lowThreshold: Number(e.target.value) })}
                className="w-48 accent-rose-500"
              />
            </div>

            <textarea
              rows={2}
              value={formData.lowText}
              onChange={(e) => setFormData({ ...formData, lowText: e.target.value })}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
              placeholder="Low battery warning text..."
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-3 py-2 rounded-xl hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <div className="flex items-center gap-2">
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
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-lg shadow-emerald-950/40 transition-all active:scale-95"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savedBadge ? 'Saved!' : 'Save Voice Alerts'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
