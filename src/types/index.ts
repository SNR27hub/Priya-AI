export type PriyaMood = 'girlfriend' | 'khush' | 'emotional' | 'nakhre' | 'super_assistant';

export interface BatteryAlertSettings {
  alertOnConnected: boolean;
  connectedText: string;
  alertOnDisconnected: boolean;
  disconnectedText: string;
  alertOnFull: boolean;
  fullThreshold: number;
  fullText: string;
  alertOnLow: boolean;
  lowThreshold: number;
  lowText: string;
  voiceVolume: number;
}

export interface VoiceSettings {
  pitch: number;
  rate: number;
  volume: number;
  preferredVoice: string;
  autoSpeak: boolean;
}

export interface AppSettings {
  aiName: string;
  creatorName: string;
  wakeWord: string;
  isWakeWordActive: boolean;
  floatingOverlayActive: boolean;
  customApiKey: string;
  screenOffSimulation: boolean;
  userNickname: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'priya' | 'system';
  text: string;
  timestamp: string;
  mood?: PriyaMood;
  actionTag?: string;
  actionDetails?: any;
}

export interface LearnedSkill {
  id: string;
  trigger: string;
  response: string;
  category: 'custom' | 'notification' | 'action';
  createdAt: string;
}

export interface MobileNotification {
  id: string;
  appName: 'WhatsApp' | 'Phone' | 'Battery' | 'YouTube' | 'System';
  title: string;
  message: string;
  timestamp: string;
  sender?: string;
  isRead: boolean;
}

export interface ActiveCallState {
  isRinging: boolean;
  callerName: string;
  callerNumber: string;
  callDuration: number;
  isConnected: boolean;
}
