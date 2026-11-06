import React, { useState } from 'react';
import { LearnedSkill } from '../types';
import { X, Plus, Trash2, Volume2, Sparkles, BookOpen, Check } from 'lucide-react';

interface TrainingMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: LearnedSkill[];
  onAddSkill: (skill: Omit<LearnedSkill, 'id' | 'createdAt'>) => void;
  onDeleteSkill: (id: string) => void;
  onTestVoice: (text: string) => void;
  aiName: string;
}

export const TrainingMemoryModal: React.FC<TrainingMemoryModalProps> = ({
  isOpen,
  onClose,
  skills,
  onAddSkill,
  onDeleteSkill,
  onTestVoice,
  aiName,
}) => {
  if (!isOpen) return null;

  const [trigger, setTrigger] = useState('');
  const [response, setResponse] = useState('');
  const [category, setCategory] = useState<'custom' | 'notification' | 'action'>('custom');
  const [addedNotice, setAddedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trigger.trim() || !response.trim()) return;

    onAddSkill({
      trigger: trigger.trim(),
      response: response.trim(),
      category,
    });

    setTrigger('');
    setResponse('');
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/70">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-rose-400" />
              <span>{aiName} AI Brain & Memory Training (सिखाएं)</span>
            </h2>
            <p className="text-xs text-slate-400">
              Train {aiName} on custom questions, triggers, Hinglish phrases and automatic replies
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

        {/* Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Add Training Form */}
          <form onSubmit={handleSubmit} className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800 space-y-3">
            <div className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
              <Plus className="w-4 h-4 text-rose-400" />
              <span>Nayi Baat Sikhayein (Add Custom Q&A / Trigger)</span>
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Jab aap ya koi bole (Trigger Phrase / Question):
              </label>
              <input
                type="text"
                value={trigger}
                onChange={(e) => setTrigger(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
                placeholder='Jaise: "Tumhe kisne banaya?" ya "Mera favorite gaana kaunsa hai?"'
                required
              />
            </div>

            <div>
              <label className="text-[11px] text-slate-400 block mb-1">
                Toh {aiName} ye bole (Response to Speak):
              </label>
              <textarea
                rows={2}
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500 resize-none"
                placeholder='Jaise: "Mujhe banane wale vyakti SNR hain! SNR ne mujhe banaya hai."'
                required
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] text-slate-400">Category:</span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="bg-slate-900 border border-slate-800 rounded-lg px-2 py-1 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="custom">Custom Q&A</option>
                  <option value="notification">Notification Auto-Reply</option>
                  <option value="action">Device Action</option>
                </select>
              </div>

              <button
                type="submit"
                className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-rose-950/40 transition-all active:scale-95"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Sikhayein (Save Rule)</span>
              </button>
            </div>

            {addedNotice && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 p-2 rounded-xl text-xs flex items-center gap-1.5 animate-fadeIn">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{aiName} ne ye naya rule yaad kar liya hai!</span>
              </div>
            )}
          </form>

          {/* Existing Rules List */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-purple-400" />
                <span>Learned Memory & Custom Rules ({skills.length})</span>
              </span>
              <span className="text-[11px] text-slate-500">Auto-matched during conversation</span>
            </div>

            <div className="space-y-2">
              {skills.map((skill) => (
                <div
                  key={skill.id}
                  className="bg-slate-950/50 border border-slate-800 hover:border-slate-700 rounded-2xl p-3.5 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                        <span>🗣️ "{skill.trigger}"</span>
                        <span className="text-[9px] uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {skill.category}
                        </span>
                      </div>
                      <div className="text-xs text-slate-200 pl-4 border-l-2 border-rose-500/30 italic">
                        "{skill.response}"
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => onTestVoice(skill.response)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800"
                        title="Hear Response"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => onDeleteSkill(skill.id)}
                        className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20"
                        title="Delete Rule"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Training is saved locally and synced with {aiName}'s brain
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
