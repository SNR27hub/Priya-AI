import React from 'react';
import { BatteryState } from '../utils/batteryService';
import { BatteryAlertSettings } from '../types';
import { BatteryCharging, Battery, BatteryWarning, Zap, Plug, Sliders, Volume2 } from 'lucide-react';

interface BatteryAlertsCardProps {
  batteryState: BatteryState;
  batterySettings: BatteryAlertSettings;
  aiName: string;
  onOpenSettings: () => void;
  onSimulatePlug: () => void;
  onSimulateUnplug: () => void;
  onSimulateFull: () => void;
  onSimulateLow: () => void;
  onAskBattery: () => void;
}

export const BatteryAlertsCard: React.FC<BatteryAlertsCardProps> = ({
  batteryState,
  batterySettings,
  aiName,
  onOpenSettings,
  onSimulatePlug,
  onSimulateUnplug,
  onSimulateFull,
  onSimulateLow,
  onAskBattery,
}) => {
  const isCharging = batteryState.charging;
  const level = batteryState.level;

  const getBatteryColor = () => {
    if (isCharging) return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    if (level <= 20) return 'text-rose-400 bg-rose-500/10 border-rose-500/30';
    if (level <= 40) return 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
  };

  const getBarColor = () => {
    if (isCharging) return 'bg-gradient-to-r from-emerald-500 to-teal-400';
    if (level <= 20) return 'bg-gradient-to-r from-rose-600 to-red-400';
    if (level <= 40) return 'bg-gradient-to-r from-amber-500 to-yellow-400';
    return 'bg-gradient-to-r from-emerald-500 to-teal-400';
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-5 shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl border ${getBatteryColor()}`}>
            {isCharging ? (
              <BatteryCharging className="w-5 h-5 animate-pulse" />
            ) : level <= 20 ? (
              <BatteryWarning className="w-5 h-5 text-rose-400" />
            ) : (
              <Battery className="w-5 h-5" />
            )}
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm sm:text-base flex items-center gap-2">
              <span>Battery & Charger Voice Alerts</span>
              {isCharging && (
                <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Charging Active
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              {batteryState.isRealBattery ? 'Connected to Device Battery' : 'Interactive Battery Simulator'}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenSettings}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 transition-colors"
          title="Customize What Priya Speaks"
        >
          <Sliders className="w-3.5 h-3.5 text-rose-400" />
          <span>Alert Settings</span>
        </button>
      </div>

      {/* Battery Gauge Display */}
      <div className="mt-4 bg-slate-950/60 rounded-2xl p-4 border border-slate-800/60">
        <div className="flex items-end justify-between mb-2">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-mono tracking-tight text-white">{level}%</span>
            <span className="text-xs text-slate-400">
              {isCharging ? 'Charger Plugged In (चार्जिंग चालू)' : 'On Battery (चार्जर हटा हुआ)'}
            </span>
          </div>

          <button
            type="button"
            onClick={onAskBattery}
            className="flex items-center gap-1 text-xs text-rose-300 hover:text-rose-200 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 px-2.5 py-1 rounded-lg transition-colors"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Poocho: % kitna hai?</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
            style={{ width: `${level}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 mt-2">
          <span>0% Empty</span>
          <span>Alert at &le;{batterySettings.lowThreshold}%</span>
          <span>Full Alert at {batterySettings.fullThreshold}%</span>
        </div>
      </div>

      {/* Simulator Test Triggers */}
      <div className="mt-4">
        <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium mb-2 flex items-center justify-between">
          <span>Voice Alerts Simulator (Test Any Phone Alert)</span>
          <span className="text-rose-400 font-normal lowercase">{aiName} will speak instantly</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {/* Charger Plugged */}
          <button
            type="button"
            onClick={onSimulatePlug}
            className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl text-xs font-medium border transition-all ${
              isCharging
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-800/60 hover:bg-slate-700/60 border-slate-700 text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span>Plug Charger ⚡</span>
          </button>

          {/* Charger Unplugged */}
          <button
            type="button"
            onClick={onSimulateUnplug}
            className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl text-xs font-medium border transition-all ${
              !isCharging
                ? 'bg-slate-800 border-slate-600 text-slate-100'
                : 'bg-slate-800/60 hover:bg-slate-700/60 border-slate-700 text-slate-200'
            }`}
          >
            <Plug className="w-3.5 h-3.5 text-slate-400" />
            <span>Unplug 🔌</span>
          </button>

          {/* Full Battery 100% */}
          <button
            type="button"
            onClick={onSimulateFull}
            className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl text-xs font-medium bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-200 transition-all hover:border-emerald-500/40"
          >
            <span className="text-emerald-400 font-mono font-bold">100%</span>
            <span>Full Charge 💯</span>
          </button>

          {/* Low Battery */}
          <button
            type="button"
            onClick={onSimulateLow}
            className="flex items-center justify-center gap-1.5 p-2.5 rounded-xl text-xs font-medium bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-200 transition-all hover:border-rose-500/40"
          >
            <BatteryWarning className="w-3.5 h-3.5 text-rose-400" />
            <span>Low Battery ({batterySettings.lowThreshold}%)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
