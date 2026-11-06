import React, { useState, useEffect } from 'react';
import { Mic, Power, BatteryCharging, Battery } from 'lucide-react';
import { BatteryState } from '../utils/batteryService';

interface ScreenOffSimulatorProps {
  isActive: boolean;
  onWakeUp: () => void;
  aiName: string;
  batteryState: BatteryState;
  isListening: boolean;
}

export const ScreenOffSimulator: React.FC<ScreenOffSimulatorProps> = ({
  isActive,
  onWakeUp,
  aiName,
  batteryState,
  isListening,
}) => {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!isActive) return null;

  return (
    <div
      onClick={onWakeUp}
      className="fixed inset-0 z-50 bg-black text-slate-400 flex flex-col items-center justify-between p-8 select-none cursor-pointer animate-fadeIn font-mono"
    >
      {/* Top Status */}
      <div className="w-full flex items-center justify-between text-xs text-slate-500">
        <span>Always-On Display (AMOLED Simulator)</span>
        <div className="flex items-center gap-1.5">
          {batteryState.charging ? (
            <BatteryCharging className="w-4 h-4 text-emerald-500 animate-pulse" />
          ) : (
            <Battery className="w-4 h-4" />
          )}
          <span>{batteryState.level}%</span>
        </div>
      </div>

      {/* Center Clock & Priya Voice Pulse */}
      <div className="text-center space-y-4">
        <div className="text-5xl sm:text-6xl font-light text-slate-300 tracking-wider">
          {currentTime || '12:00'}
        </div>
        <div className="text-xs text-slate-500">
          Screen is Locked / Phone Band Hai
        </div>

        {/* Priya Background Listener Animation */}
        <div className="pt-6 flex flex-col items-center">
          <div className="relative">
            <div className="absolute -inset-3 rounded-full bg-cyan-500/20 animate-ping" />
            <div className="relative w-16 h-16 rounded-full bg-slate-900 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <Mic className="w-7 h-7 animate-pulse" />
            </div>
          </div>
          <div className="mt-4 text-xs text-cyan-400 font-sans font-medium">
            🎤 24/7 Background Voice Active
          </div>
          <div className="text-[11px] text-slate-500 font-sans mt-1">
            Boliye <strong>"Wake up {aiName}"</strong> ya screen par tap karein
          </div>
        </div>
      </div>

      {/* Bottom Wake Button */}
      <div className="w-full text-center">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onWakeUp();
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-sans text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <Power className="w-4 h-4 text-rose-400" />
          <span>Screen Unlock / Wapas Jayein</span>
        </button>
      </div>
    </div>
  );
};
