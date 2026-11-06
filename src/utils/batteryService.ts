export interface BatteryState {
  level: number; // 0 to 100
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  isRealBattery: boolean;
}

export type BatteryEventCallback = (
  event: 'connected' | 'disconnected' | 'full' | 'low',
  state: BatteryState
) => void;

class BatteryManagerService {
  private state: BatteryState = {
    level: 78,
    charging: false,
    chargingTime: Infinity,
    dischargingTime: Infinity,
    isRealBattery: false,
  };

  private listeners: Set<BatteryEventCallback> = new Set();
  private stateChangeListeners: Set<(state: BatteryState) => void> = new Set();
  private nativeBattery: any = null;
  private hasReportedFull = false;
  private hasReportedLow = false;

  constructor() {
    this.initRealBattery();
  }

  private async initRealBattery() {
    if (typeof window !== 'undefined' && 'getBattery' in navigator) {
      try {
        const battery = await (navigator as any).getBattery();
        this.nativeBattery = battery;
        this.updateFromNative(battery);

        battery.addEventListener('chargingchange', () => {
          const wasCharging = this.state.charging;
          this.updateFromNative(battery);
          if (!wasCharging && battery.charging) {
            this.emitEvent('connected');
          } else if (wasCharging && !battery.charging) {
            this.emitEvent('disconnected');
          }
        });

        battery.addEventListener('levelchange', () => {
          this.updateFromNative(battery);
          this.checkThresholds();
        });
      } catch (e) {
        console.warn('Real battery API unavailable, using simulation fallback:', e);
      }
    }
  }

  private updateFromNative(battery: any) {
    this.state = {
      level: Math.round(battery.level * 100),
      charging: battery.charging,
      chargingTime: battery.chargingTime,
      dischargingTime: battery.dischargingTime,
      isRealBattery: true,
    };
    this.notifyState();
  }

  private checkThresholds() {
    if (this.state.level >= 100 && !this.hasReportedFull && this.state.charging) {
      this.hasReportedFull = true;
      this.emitEvent('full');
    } else if (this.state.level < 100) {
      this.hasReportedFull = false;
    }

    if (this.state.level <= 20 && !this.hasReportedLow && !this.state.charging) {
      this.hasReportedLow = true;
      this.emitEvent('low');
    } else if (this.state.level > 25) {
      this.hasReportedLow = false;
    }
  }

  private emitEvent(type: 'connected' | 'disconnected' | 'full' | 'low') {
    this.listeners.forEach((cb) => {
      try {
        cb(type, { ...this.state });
      } catch (err) {
        console.error('Error in battery event callback:', err);
      }
    });
  }

  private notifyState() {
    this.stateChangeListeners.forEach((cb) => {
      try {
        cb({ ...this.state });
      } catch (err) {
        console.error('Error in state listener:', err);
      }
    });
  }

  public getState(): BatteryState {
    return { ...this.state };
  }

  public onEvent(callback: BatteryEventCallback): () => void {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  public onStateChange(callback: (state: BatteryState) => void): () => void {
    this.stateChangeListeners.add(callback);
    callback({ ...this.state });
    return () => this.stateChangeListeners.delete(callback);
  }

  // Simulation Controls for testing on any phone / PC
  public simulateSetCharging(charging: boolean) {
    const wasCharging = this.state.charging;
    this.state.charging = charging;
    this.notifyState();
    if (!wasCharging && charging) {
      this.emitEvent('connected');
    } else if (wasCharging && !charging) {
      this.emitEvent('disconnected');
    }
  }

  public simulateSetLevel(newLevel: number) {
    const clamped = Math.max(1, Math.min(100, Math.round(newLevel)));
    this.state.level = clamped;
    this.notifyState();
    this.checkThresholds();
    if (clamped === 100) {
      this.emitEvent('full');
    } else if (clamped <= 20) {
      this.emitEvent('low');
    }
  }

  public triggerExplicitEvent(event: 'connected' | 'disconnected' | 'full' | 'low') {
    this.emitEvent(event);
  }
}

export const batteryService = new BatteryManagerService();
