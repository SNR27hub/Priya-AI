import React, { useState } from 'react';
import {
  MessageCircle,
  Phone,
  PhoneCall,
  PhoneOff,
  Youtube,
  Bell,
  Send,
  Play,
  CheckCircle,
  Sparkles,
  ExternalLink,
  Volume2,
} from 'lucide-react';
import { MobileNotification } from '../types';

interface PhoneSimulatorProps {
  aiName: string;
  onSpeak: (text: string) => void;
  onSendWhatsApp: (recipient: string, message: string) => void;
  onPlaySong: (songTitle: string) => void;
  currentSong: string | null;
  notifications: MobileNotification[];
  onLearnFromNotification: (notif: MobileNotification) => void;
}

export const PhoneSimulator: React.FC<PhoneSimulatorProps> = ({
  aiName,
  onSpeak,
  onSendWhatsApp,
  onPlaySong,
  currentSong,
  notifications,
  onLearnFromNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'whatsapp' | 'call' | 'youtube' | 'notifications'>('whatsapp');

  // WhatsApp form state
  const [waRecipient, setWaRecipient] = useState('Rahul (Friend)');
  const [waPhone, setWaPhone] = useState('+919876543210');
  const [waMessage, setWaMessage] = useState('Bhai main 10 minute me pahuch raha hu!');
  const [waSentSuccess, setWaSentSuccess] = useState(false);

  // Call simulator state
  const [callerName, setCallerName] = useState('Rahul');
  const [isCalling, setIsCalling] = useState(false);
  const [callStatus, setCallStatus] = useState<'idle' | 'ringing' | 'connected' | 'ended'>('idle');

  // YouTube search state
  const [songQuery, setSongQuery] = useState('Arijit Singh Romantic Mashup');

  // Trigger Incoming Call Simulation
  const triggerIncomingCall = () => {
    setIsCalling(true);
    setCallStatus('ringing');
    const announceText = `Suno! ${callerName} ka call aa raha hai. Kya main call uthau ya cut karu?`;
    onSpeak(announceText);
  };

  const handleAcceptCall = () => {
    setCallStatus('connected');
    onSpeak(`Call connect ho gaya hai. Aap ${callerName} se baat kar sakte hain.`);
  };

  const handleRejectCall = () => {
    setCallStatus('ended');
    setIsCalling(false);
    onSpeak(`Theek hai, maine ${callerName} ka call cut kar diya hai.`);
    setTimeout(() => setCallStatus('idle'), 2000);
  };

  // Trigger WhatsApp send
  const handleWhatsAppSend = () => {
    setWaSentSuccess(true);
    const speech = `Maine WhatsApp par ${waRecipient} ke liye message ready kar diya hai: "${waMessage}"! Accessibility service se auto-send open ho raha hai.`;
    onSpeak(speech);
    onSendWhatsApp(waRecipient, waMessage);

    // Open WhatsApp link if phone is present
    const cleanNumber = waPhone.replace(/\D/g, '');
    const encodedMsg = encodeURIComponent(waMessage);
    const waUrl = cleanNumber ? `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodedMsg}` : `https://api.whatsapp.com/send?text=${encodedMsg}`;
    
    // Open in new tab or trigger simulation
    try {
      window.open(waUrl, '_blank', 'noopener,noreferrer');
    } catch (e) {
      // Allowed popup fallback
    }

    setTimeout(() => setWaSentSuccess(false), 4000);
  };

  return (
    <div className="bg-slate-900/80 backdrop-blur-md border border-slate-800 rounded-3xl p-5 shadow-xl">
      {/* Phone Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <h3 className="font-semibold text-white text-sm sm:text-base">
            Mobile Agent Sandbox (फ़ोन ऑटोमेशन)
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-rose-300 bg-rose-500/10 px-2.5 py-1 rounded-full border border-rose-500/20">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Real Mobile Tasks</span>
        </div>
      </div>

      {/* Tabs for Agent features */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950/80 rounded-2xl border border-slate-800 my-4">
        <button
          type="button"
          onClick={() => setActiveTab('whatsapp')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'whatsapp'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-850'
          }`}
        >
          <MessageCircle className="w-4 h-4 text-emerald-300" />
          <span className="hidden sm:inline">WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('call')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'call'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <PhoneCall className="w-4 h-4 text-blue-300" />
          <span className="hidden sm:inline">Call Announce</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('youtube')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'youtube'
              ? 'bg-rose-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Youtube className="w-4 h-4 text-rose-300" />
          <span className="hidden sm:inline">Music Player</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('notifications')}
          className={`flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl text-xs font-medium transition-all ${
            activeTab === 'notifications'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Bell className="w-4 h-4 text-purple-300" />
          <span className="hidden sm:inline">Notifications</span>
        </button>
      </div>

      {/* Tab 1: WhatsApp Automation */}
      {activeTab === 'whatsapp' && (
        <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-emerald-400 flex items-center gap-1.5">
              <MessageCircle className="w-4 h-4" /> WhatsApp Auto-Sender
            </span>
            <span className="text-slate-400 text-[11px]">Accessibility Touch Simulated</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Recipient Name / Contact</label>
              <input
                type="text"
                value={waRecipient}
                onChange={(e) => setWaRecipient(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                placeholder="Rahul"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Mobile / WhatsApp Number (Optional)</label>
              <input
                type="text"
                value={waPhone}
                onChange={(e) => setWaPhone(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                placeholder="+91..."
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] text-slate-400 block mb-1">Message Content to Send</label>
            <textarea
              rows={2}
              value={waMessage}
              onChange={(e) => setWaMessage(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 resize-none"
              placeholder="What to send..."
            />
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-slate-400">
              Voice trigger: <em>"{aiName}, WhatsApp par {waRecipient} ko bolo..."</em>
            </span>
            <button
              type="button"
              onClick={handleWhatsAppSend}
              className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-emerald-900/30 transition-all active:scale-95"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send via {aiName}</span>
            </button>
          </div>

          {waSentSuccess && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-2.5 text-xs text-emerald-300 flex items-center justify-between animate-fadeIn">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                Message queued! Direct WhatsApp opened in new window.
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Incoming Call Announcer */}
      {activeTab === 'call' && (
        <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-blue-400 flex items-center gap-1.5">
              <PhoneCall className="w-4 h-4" /> Incoming Call Announcer & Screen
            </span>
            <span className="text-slate-400 text-[11px]">Real Caller Name Voice Announcement</span>
          </div>

          {callStatus === 'idle' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={callerName}
                  onChange={(e) => setCallerName(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter Caller Name (e.g. Rahul, Maa, Office)"
                />
                <button
                  type="button"
                  onClick={triggerIncomingCall}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-blue-900/30 transition-all flex items-center gap-1.5 whitespace-nowrap"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Simulate Incoming Call</span>
                </button>
              </div>

              <div className="text-[11px] text-slate-400 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
                💡 <strong>Voice Commands:</strong> Jab call aayegi, {aiName} bolega "Shankar ji! {callerName} ka call aa raha hai...". Aap bol sakte hain <strong>"Call uthao"</strong> ya <strong>"Call cut karo"</strong>!
              </div>
            </div>
          )}

          {callStatus === 'ringing' && (
            <div className="p-4 bg-gradient-to-b from-blue-950/60 to-slate-900 rounded-2xl border border-blue-500/40 text-center space-y-3 animate-pulse">
              <div className="w-14 h-14 rounded-full bg-blue-500/20 border-2 border-blue-400 mx-auto flex items-center justify-center">
                <Phone className="w-7 h-7 text-blue-400 animate-bounce" />
              </div>
              <div>
                <div className="text-lg font-bold text-white">{callerName}</div>
                <div className="text-xs text-blue-300">Incoming Call · {aiName} is announcing...</div>
              </div>

              <div className="flex items-center justify-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={handleRejectCall}
                  className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-rose-950/50"
                >
                  <PhoneOff className="w-4 h-4" />
                  <span>Cut Karo (Reject)</span>
                </button>
                <button
                  type="button"
                  onClick={handleAcceptCall}
                  className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-lg shadow-emerald-950/50"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call Uthao (Accept)</span>
                </button>
              </div>
            </div>
          )}

          {callStatus === 'connected' && (
            <div className="p-4 bg-slate-900 rounded-2xl border border-emerald-500/40 text-center space-y-3">
              <div className="text-emerald-400 font-semibold text-sm">Call Connected with {callerName}</div>
              <div className="text-xs font-mono text-slate-400">00:14 · Microphone Active</div>
              <button
                type="button"
                onClick={handleRejectCall}
                className="bg-rose-600 hover:bg-rose-500 text-white px-5 py-2 rounded-xl text-xs font-semibold"
              >
                End Call
              </button>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: YouTube Music Player */}
      {activeTab === 'youtube' && (
        <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-rose-400 flex items-center gap-1.5">
              <Youtube className="w-4 h-4" /> YouTube Song Player Agent
            </span>
            <span className="text-slate-400 text-[11px]">Instant Voice Song Trigger</span>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={songQuery}
              onChange={(e) => setSongQuery(e.target.value)}
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-500"
              placeholder="Search Hindi song or singer..."
            />
            <button
              type="button"
              onClick={() => onPlaySong(songQuery)}
              className="bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-rose-900/30 transition-all flex items-center gap-1.5 whitespace-nowrap"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Play Song</span>
            </button>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5">
            {['Romantic Hindi Mashup', 'Arijit Singh Best', 'Lofi Bollywood Chill', 'Party Hindi Songs'].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setSongQuery(preset);
                  onPlaySong(preset);
                }}
                className="text-[11px] bg-slate-800/80 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg transition-colors border border-slate-700"
              >
                🎵 {preset}
              </button>
            ))}
          </div>

          {/* Player Display */}
          {currentSong && (
            <div className="mt-3 bg-slate-900/90 rounded-2xl p-3 border border-rose-500/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-rose-300 flex items-center gap-1.5">
                  <Play className="w-3.5 h-3.5 animate-pulse text-rose-400" /> Now Playing: {currentSong}
                </span>
                <span className="text-[10px] text-slate-400">YouTube Audio Stream</span>
              </div>
              <div className="w-full aspect-video rounded-xl overflow-hidden bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(
                    currentSong
                  )}&autoplay=1`}
                  title="YouTube Music Player"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Notifications Interceptor & Learner */}
      {activeTab === 'notifications' && (
        <div className="space-y-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/60">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-purple-400 flex items-center gap-1.5">
              <Bell className="w-4 h-4" /> Notification Interceptor & AI Learner
            </span>
            <span className="text-slate-400 text-[11px]">{notifications.length} Unread</span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 hover:border-purple-500/40 transition-colors"
              >
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="font-semibold text-white flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-purple-400" />
                    {notif.appName}: {notif.title}
                  </span>
                  <span className="text-[10px] text-slate-400">{notif.timestamp}</span>
                </div>
                <p className="text-xs text-slate-300 mb-2">{notif.message}</p>
                <div className="flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => onSpeak(`${notif.appName} se notification: ${notif.title}. ${notif.message}`)}
                    className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white bg-slate-800 px-2 py-1 rounded-lg"
                  >
                    <Volume2 className="w-3 h-3" /> Speak Out
                  </button>
                  <button
                    type="button"
                    onClick={() => onLearnFromNotification(notif)}
                    className="flex items-center gap-1 text-[11px] text-purple-300 hover:text-purple-200 bg-purple-500/20 border border-purple-500/30 px-2.5 py-1 rounded-lg"
                  >
                    <Sparkles className="w-3 h-3" /> Train Auto-Reply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
