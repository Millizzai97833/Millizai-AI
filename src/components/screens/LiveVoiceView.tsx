import React, { useState, useEffect, useRef } from 'react';
import { VoiceMode, VoicePersona, ComedyLevel, AppSettings, VoiceRecording } from '../../types';
import {
  VOICE_PERSONAS,
  liveVoiceManager,
  generateIntelligentSpokenReply,
  detectSpokenLanguage,
  DetectedLanguage
} from '../../services/voiceService';
import { VoiceOrb } from '../VoiceOrb';
import {
  ArrowLeft,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  PhoneOff,
  Hand,
  Sliders,
  Download,
  FileText,
  ShieldAlert,
  Sparkles,
  Radio,
  Globe,
  Wifi,
  WifiOff,
  Gauge,
  Volume1,
  UserCheck
} from 'lucide-react';

interface Props {
  mode: VoiceMode;
  settings: AppSettings;
  onSaveRecording?: (recording: VoiceRecording) => void;
  onBack: () => void;
}

const SUPPORTED_LANGUAGES = [
  { code: 'auto', name: 'Auto-Detect Language' },
  { code: 'en-US', name: 'English (US / UK)' },
  { code: 'ur-PK', name: 'Urdu (اردو / Pakistani)' },
  { code: 'ps-AF', name: 'Pashto (پښتو)' },
  { code: 'ar-SA', name: 'Arabic (العربية)' },
  { code: 'hi-IN', name: 'Hindi (हिन्दी)' },
  { code: 'es-ES', name: 'Spanish (Español)' },
  { code: 'fr-FR', name: 'French (Français)' },
  { code: 'de-DE', name: 'German (Deutsch)' },
  { code: 'zh-CN', name: 'Chinese (中文)' },
  { code: 'ja-JP', name: 'Japanese (日本語)' },
  { code: 'ko-KR', name: 'Korean (한국어)' }
];

export const LiveVoiceView: React.FC<Props> = ({
  mode,
  settings,
  onSaveRecording,
  onBack
}) => {
  // Voice Persona (defaults to Zayn - Premium Natural Male or mode-specific male)
  const defaultPersonaForMode = () => {
    if (mode === 'palmistry') {
      return VOICE_PERSONAS.find((p) => p.id === 'rehan_calm_male') || VOICE_PERSONAS[0];
    }
    if (mode === 'mental_comedy') {
      return VOICE_PERSONAS.find((p) => p.id === 'hamza_comedy_male') || VOICE_PERSONAS[0];
    }
    if (mode === 'mature_18') {
      return VOICE_PERSONAS.find((p) => p.id === 'farhan_mature_male') || VOICE_PERSONAS[0];
    }
    return VOICE_PERSONAS.find((p) => p.id === settings.selectedVoiceId) ||
      VOICE_PERSONAS.find((p) => p.id === 'zayn_male') ||
      VOICE_PERSONAS[0];
  };

  const [selectedPersona, setSelectedPersona] = useState<VoicePersona>(defaultPersonaForMode());
  const [voiceSpeed, setVoiceSpeed] = useState<number>(settings.voiceSpeed || 1.0);
  const [voicePitch, setVoicePitch] = useState<number>(settings.voicePitch || 0.95);
  const [voiceVolume, setVoiceVolume] = useState<number>(settings.voiceVolume ?? 1.0);
  const [selectedLanguage, setSelectedLanguage] = useState<string>(settings.voiceLanguage || 'auto');
  const [isOfflineEngine, setIsOfflineEngine] = useState<boolean>(settings.isOfflineMode || false);

  const [comedyLevel, setComedyLevel] = useState<ComedyLevel>(2);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);

  // Live session states: 'listening' | 'speaking' | 'thinking' | 'idle'
  const [voiceState, setVoiceState] = useState<'listening' | 'speaking' | 'thinking' | 'idle'>('listening');
  const [liveTranscript, setLiveTranscript] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string }>>([]);
  const [currentUserSpeech, setCurrentUserSpeech] = useState('');
  const [lastDetectedLang, setLastDetectedLang] = useState<DetectedLanguage>({
    code: 'en-US',
    name: 'English',
    nativeName: 'English',
    isRtl: false
  });
  const [sessionStartTime] = useState<number>(Date.now());
  const [isAgeVerified, setIsAgeVerified] = useState(mode !== 'mature_18');
  const [showAgeModal, setShowAgeModal] = useState(mode === 'mature_18');
  const [showControlsDrawer, setShowControlsDrawer] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  const transcriptEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [liveTranscript, currentUserSpeech]);

  // Synchronize persona, rate, pitch, and language with LiveVoiceManager
  useEffect(() => {
    liveVoiceManager.setPersona(selectedPersona);
    liveVoiceManager.setSpeed(voiceSpeed);
    liveVoiceManager.setPitch(voicePitch);
    liveVoiceManager.setVolume(voiceVolume);
    liveVoiceManager.setManualLanguage(selectedLanguage);

    if (isAgeVerified) {
      const initialGreeting = getInitialGreeting(mode, selectedPersona, comedyLevel);
      setLiveTranscript([
        {
          role: 'assistant',
          text: initialGreeting,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      if (isSpeakerOn) {
        setVoiceState('speaking');
        liveVoiceManager.speak(
          initialGreeting,
          () => setVoiceState('speaking'),
          () => {
            setVoiceState('listening');
            startLiveMicListener();
          },
          { pitch: voicePitch, speed: voiceSpeed, volume: voiceVolume }
        );
      } else {
        startLiveMicListener();
      }
    }

    return () => {
      liveVoiceManager.cleanup();
    };
  }, [mode, isAgeVerified]);

  const startLiveMicListener = () => {
    liveVoiceManager.startListening(
      (transcriptionText, isFinal) => {
        setCurrentUserSpeech(transcriptionText);

        // Real-time language detection while user speaks
        const detected = detectSpokenLanguage(transcriptionText);
        setLastDetectedLang(detected);

        if (isFinal && transcriptionText.trim().length > 0) {
          handleUserQuery(transcriptionText.trim());
        }
      },
      () => {
        // Immediate Barge-in! When user starts speaking while AI is speaking
        setVoiceState('listening');
      }
    );
  };

  const handleUserQuery = async (query: string) => {
    setCurrentUserSpeech('');
    setLiveTranscript((prev) => [
      ...prev,
      {
        role: 'user',
        text: query,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);

    setVoiceState('thinking');

    // Conversational context memory
    const history = liveTranscript.map((t) => ({ role: t.role, text: t.text }));

    // Simulate natural speech processing latency (~600ms)
    setTimeout(() => {
      const { reply, detectedLang } = generateIntelligentSpokenReply(
        mode,
        query,
        comedyLevel,
        history
      );
      setLastDetectedLang(detectedLang);

      setLiveTranscript((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);

      if (isSpeakerOn && !isMuted) {
        setVoiceState('speaking');
        liveVoiceManager.speak(
          reply,
          () => setVoiceState('speaking'),
          () => {
            setVoiceState('listening');
            startLiveMicListener();
          },
          {
            pitch: voicePitch,
            speed: voiceSpeed,
            volume: voiceVolume,
            langCode: detectedLang.code
          }
        );
      } else {
        setVoiceState('listening');
      }
    }, 600);
  };

  // Immediate Interruption / Barge-In
  const handleInterrupt = () => {
    liveVoiceManager.interrupt();
    setVoiceState('listening');
    startLiveMicListener();
  };

  const handleToggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    liveVoiceManager.setMute(nextMute);
    if (!nextMute) {
      setVoiceState('listening');
      startLiveMicListener();
    }
  };

  const handleToggleSpeaker = () => {
    const nextSpeaker = !isSpeakerOn;
    setIsSpeakerOn(nextSpeaker);
    if (!nextSpeaker) {
      liveVoiceManager.interrupt();
      setVoiceState('listening');
    }
  };

  const handleSelectPersona = (p: VoicePersona) => {
    setSelectedPersona(p);
    liveVoiceManager.setPersona(p);
    setVoicePitch(p.pitch);
    // Play a brief sample utterance so the user immediately hears the male voice
    liveVoiceManager.speak(
      p.samplePhrase || `Hello, I'm ${p.name}.`,
      undefined,
      undefined,
      { pitch: p.pitch, speed: voiceSpeed, volume: voiceVolume, langCode: p.langCode }
    );
  };

  const handleSpeedChange = (newSpeed: number) => {
    setVoiceSpeed(newSpeed);
    liveVoiceManager.setSpeed(newSpeed);
  };

  const handlePitchChange = (newPitch: number) => {
    setVoicePitch(newPitch);
    liveVoiceManager.setPitch(newPitch);
  };

  const handleVolumeChange = (newVol: number) => {
    setVoiceVolume(newVol);
    liveVoiceManager.setVolume(newVol);
  };

  const handleLanguageChange = (newLang: string) => {
    setSelectedLanguage(newLang);
    liveVoiceManager.setManualLanguage(newLang);
  };

  // Export recording as realistic WAV audio
  const handleExportWav = () => {
    const duration = Math.max(3, Math.round((Date.now() - sessionStartTime) / 1000));
    const allSpeech = liveTranscript.map((t) => t.text).join(' ');
    const blob = liveVoiceManager.generateWavAudioBlob(duration, allSpeech);
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `Millizai-${mode}-MaleVoice-${Date.now()}.wav`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    setExportNotice('WAV Audio recording exported successfully!');
    setTimeout(() => setExportNotice(null), 3000);

    if (onSaveRecording) {
      onSaveRecording({
        id: `rec-${Date.now()}`,
        title: `${mode.toUpperCase()} Live Session (${selectedPersona.name})`,
        mode,
        durationSeconds: duration,
        transcript: liveTranscript.map((t) => `${t.role.toUpperCase()}: ${t.text}`).join('\n\n'),
        audioBlobUrl: url,
        createdAt: Date.now(),
        language: lastDetectedLang.code
      });
    }
  };

  // Export transcript as text file
  const handleExportTxt = () => {
    const fullText =
      `# Millizai AI Live Voice Session\n` +
      `Developer: Shahab Millizai\n` +
      `Voice Mode: ${mode}\n` +
      `Male Voice Persona: ${selectedPersona.name} (${selectedPersona.accent})\n` +
      `Engine: ${isOfflineEngine ? 'Offline GGUF / ONNX' : 'Neural Streaming Voice'}\n` +
      `Date: ${new Date().toLocaleString()}\n\n` +
      `--- TRANSCRIPT ---\n\n` +
      liveTranscript.map((t) => `[${t.time}] ${t.role.toUpperCase()}:\n${t.text}\n`).join('\n');

    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Millizai-${mode}-Transcript-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);

    setExportNotice('Transcript saved as TXT file!');
    setTimeout(() => setExportNotice(null), 3000);
  };

  const modeHeaders = {
    general: { title: 'General Live AI Voice', subtitle: 'Natural male companion with hands-free conversation' },
    mental_comedy: { title: 'Mental Comedy Voice', subtitle: 'Playful male roasting, sarcastic banter & Urdu jugat' },
    mature_18: { title: '18+ Mature Voice Lounge', subtitle: 'Age-gated confident male conversation & romance' },
    palmistry: { title: 'Palmistry Voice Master', subtitle: 'Calm male palm wisdom with spoken Q&A' }
  }[mode];

  return (
    <div className="h-full flex flex-col bg-[#060a14] text-slate-100 overflow-hidden relative select-none">
      {/* 18+ Age Verification Modal */}
      {showAgeModal && !isAgeVerified && (
        <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-xs w-full bg-[#101726] border border-rose-500/50 rounded-3xl p-5 text-center space-y-3 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 mx-auto flex items-center justify-center">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">18+ Mature Lounge</h3>
            <p className="text-xs text-slate-300 leading-relaxed text-left">
              This mode features Farhan, a confident, mature male AI companion for adult relationship discussions, romance, flirting, and deep life topics. Exclusively for adults aged 18 and older.
            </p>
            <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-[11px] text-slate-400 text-left">
              • Consensual mature dialogue only.<br />
              • Content involving minors is strictly forbidden.
            </div>
            <div className="pt-2 flex flex-col gap-2">
              <button
                onClick={() => {
                  setIsAgeVerified(true);
                  setShowAgeModal(false);
                }}
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-lg shadow-rose-600/30"
              >
                I am 18 or Older — Enter Lounge
              </button>
              <button
                onClick={onBack}
                className="w-full py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-semibold"
              >
                Exit to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Top Header */}
      <div className="px-3 py-2 bg-[#0b1120] border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="text-xs font-bold text-white">{modeHeaders.title}</h2>
              <span className="flex items-center gap-1 text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 font-bold">
                <Radio className="w-2.5 h-2.5 text-emerald-400 animate-pulse" /> LIVE
              </span>
            </div>
            <p className="text-[10px] text-cyan-400 truncate max-w-[210px]">{modeHeaders.subtitle}</p>
          </div>
        </div>

        {/* Voice Customization Drawer Toggle */}
        <button
          onClick={() => setShowControlsDrawer(!showControlsDrawer)}
          className="px-2 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold flex items-center gap-1 border border-slate-700"
          title="Voice Controls (Persona, Pitch, Speed, Language)"
        >
          <Sliders className="w-3 h-3 text-cyan-400" />
          <span className="truncate max-w-[70px]">{selectedPersona.name.split(' ')[0]}</span>
        </button>
      </div>

      {/* Engine & Language Status Strip */}
      <div className="px-3 py-1 bg-[#0d1424] border-b border-slate-800/80 flex items-center justify-between text-[10px]">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsOfflineEngine(!isOfflineEngine)}
            className={`flex items-center gap-1 px-1.5 py-0.5 rounded font-semibold transition-colors ${
              isOfflineEngine
                ? 'bg-amber-950/70 text-amber-300 border border-amber-800'
                : 'bg-blue-950/70 text-blue-300 border border-blue-800'
            }`}
            title="Toggle between Neural Online Voice and Offline GGUF/Device engine"
          >
            {isOfflineEngine ? <WifiOff className="w-3 h-3 text-amber-400" /> : <Wifi className="w-3 h-3 text-cyan-400" />}
            <span>{isOfflineEngine ? 'Offline GGUF' : 'Neural Male Voice'}</span>
          </button>

          <span className="text-slate-400 flex items-center gap-1">
            <Globe className="w-3 h-3 text-purple-400" />
            <span>{lastDetectedLang.nativeName || lastDetectedLang.name}</span>
          </span>
        </div>

        <div className="flex items-center gap-1.5 text-slate-400">
          <span>{voiceSpeed}x</span>
          <span>•</span>
          <span>Pitch {(voicePitch * 100).toFixed(0)}%</span>
        </div>
      </div>

      {/* Export Toast Notification */}
      {exportNotice && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-40 px-3 py-1.5 rounded-full bg-cyan-600 text-white text-[11px] font-bold shadow-xl animate-fade-in flex items-center gap-1.5">
          <Sparkles className="w-3 h-3" />
          {exportNotice}
        </div>
      )}

      {/* Mental Comedy 4-Level Selector (Only visible in mental_comedy mode) */}
      {mode === 'mental_comedy' && (
        <div className="px-3 py-1.5 bg-[#0e172a] border-b border-slate-800 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 font-medium text-[10px]">Roast Intensity:</span>
          <div className="flex items-center gap-1">
            {([1, 2, 3, 4] as const).map((lvl) => {
              const labels = ['Friendly', 'Sarcastic', 'Savage', 'Unhinged'];
              return (
                <button
                  key={lvl}
                  onClick={() => setComedyLevel(lvl)}
                  className={`px-2 py-0.5 rounded-md text-[10px] font-bold border transition-colors ${
                    comedyLevel === lvl
                      ? 'bg-amber-500 border-amber-300 text-black shadow-sm'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                  }`}
                >
                  {labels[lvl - 1]}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Central Animated Glowing Voice Orb */}
      <div className="flex-1 flex flex-col items-center justify-center p-2 relative">
        <VoiceOrb
          state={voiceState}
          isMuted={isMuted}
          mode={mode}
          personaName={selectedPersona.name}
          detectedLanguage={lastDetectedLang.name}
          isOnline={!isOfflineEngine}
          onClick={handleInterrupt}
        />

        {/* Real-time User Speech Transcription Bubble */}
        {currentUserSpeech && (
          <div className="mt-2 px-3.5 py-1 rounded-full bg-blue-900/50 border border-cyan-500/50 text-xs text-cyan-200 max-w-[85%] truncate text-center animate-pulse shadow-lg">
            "{currentUserSpeech}"
          </div>
        )}
      </div>

      {/* Live Conversation Transcript Drawer */}
      <div className="h-44 bg-[#090e1c] border-t border-slate-800 flex flex-col p-2.5">
        <div className="flex items-center justify-between pb-1 text-[11px] border-b border-slate-800/80">
          <span className="font-bold text-slate-300 text-[10px] uppercase tracking-wider flex items-center gap-1">
            <Radio className="w-2.5 h-2.5 text-cyan-400" />
            Spoken Dialogue ({liveTranscript.length})
          </span>
          <div className="flex items-center gap-1 text-[10px]">
            <button
              onClick={handleExportWav}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 font-semibold flex items-center gap-1"
              title="Export Conversation as WAV Audio"
            >
              <Download className="w-2.5 h-2.5" /> WAV Audio
            </button>
            <button
              onClick={handleExportTxt}
              className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-purple-300 font-semibold flex items-center gap-1"
              title="Download Transcript as Text"
            >
              <FileText className="w-2.5 h-2.5" /> TXT
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pt-1 space-y-2 text-xs">
          {liveTranscript.map((entry, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${entry.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[88%] rounded-xl p-2 text-[11px] leading-relaxed ${
                  entry.role === 'user'
                    ? 'bg-blue-950/70 text-white border border-blue-700/50 rounded-br-none shadow-sm'
                    : 'bg-[#121a2e] text-slate-200 border border-slate-800 rounded-bl-none shadow-sm'
                }`}
              >
                <div className="flex items-center gap-1 text-[9px] opacity-70 mb-0.5">
                  <span className="font-bold">{entry.role === 'user' ? 'You' : selectedPersona.name.split(' ')[0]}</span>
                  <span>• {entry.time}</span>
                </div>
                <div>{entry.text}</div>
              </div>
            </div>
          ))}
          <div ref={transcriptEndRef} />
        </div>
      </div>

      {/* Call Controls Bar (Mute, Interrupt, Speaker, End) */}
      <div className="p-3 bg-[#0c1222] border-t border-slate-800 flex items-center justify-around shrink-0">
        {/* Mute Button */}
        <button
          onClick={handleToggleMute}
          className={`p-3 rounded-full border transition-all ${
            isMuted
              ? 'bg-red-600 border-red-500 text-white shadow-lg shadow-red-600/30'
              : 'bg-[#131b2e] border-slate-700 text-slate-300 hover:text-white'
          }`}
          title={isMuted ? 'Unmute Microphone' : 'Mute Microphone'}
        >
          {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Interrupt / Barge-In Button */}
        <button
          onClick={handleInterrupt}
          className="px-4 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-1.5 transition-all"
          title="Interrupt AI speaking immediately"
        >
          <Hand className="w-4 h-4" />
          <span>Interrupt AI</span>
        </button>

        {/* Speaker Button */}
        <button
          onClick={handleToggleSpeaker}
          className={`p-3 rounded-full border transition-all ${
            isSpeakerOn
              ? 'bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-600/30'
              : 'bg-[#131b2e] border-slate-700 text-slate-400'
          }`}
          title={isSpeakerOn ? 'Turn Off Speaker' : 'Turn On Speaker'}
        >
          {isSpeakerOn ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
        </button>

        {/* End Call Button */}
        <button
          onClick={() => {
            liveVoiceManager.cleanup();
            onBack();
          }}
          className="p-3 rounded-full bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/40 transition-all"
          title="End Live Voice Call"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>

      {/* Voice Customization Drawer (Male Voices, Pitch, Speed, Volume, Language) */}
      {showControlsDrawer && (
        <div className="absolute inset-x-0 bottom-0 z-40 bg-[#0c1326] border-t border-cyan-500/50 rounded-t-3xl p-4 shadow-2xl max-h-[85%] overflow-y-auto custom-scrollbar animate-slide-up">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-cyan-400" />
              Male AI Voice Engine Settings
            </h3>
            <button
              onClick={() => setShowControlsDrawer(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
          </div>

          {/* Language Selector */}
          <div className="py-2.5 border-b border-slate-800 space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3 h-3 text-cyan-400" />
              Spoken Language Detection
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className="w-full bg-[#12192c] border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>

          {/* Voice Pitch Control (Deep / High Male Voice) */}
          <div className="py-2.5 border-b border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1">
                <Gauge className="w-3 h-3 text-purple-400" />
                Voice Pitch: {(voicePitch * 100).toFixed(0)}%
              </span>
              <span className="text-cyan-400 font-bold text-[11px]">
                {voicePitch < 0.9 ? 'Deeper Male' : voicePitch > 1.05 ? 'Higher Male' : 'Natural Medium'}
              </span>
            </div>
            <input
              type="range"
              min="0.7"
              max="1.3"
              step="0.05"
              value={voicePitch}
              onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>

          {/* Speaking Speed Control */}
          <div className="py-2.5 border-b border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300">Speaking Speed: {voiceSpeed}x</span>
              <span className="text-cyan-400 font-bold text-[11px]">
                {voiceSpeed > 1 ? 'Faster' : voiceSpeed < 1 ? 'Slower' : 'Normal Pace'}
              </span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.75"
              step="0.25"
              value={voiceSpeed}
              onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
              className="w-full accent-cyan-500"
            />
          </div>

          {/* Volume Control */}
          <div className="py-2.5 border-b border-slate-800 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-300 flex items-center gap-1">
                <Volume1 className="w-3 h-3 text-emerald-400" />
                Volume: {Math.round(voiceVolume * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1.0"
              step="0.05"
              value={voiceVolume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          {/* Available Voices Grid (Male Priority) */}
          <div className="py-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Select Male Voice Companion ({VOICE_PERSONAS.length})
              </span>
              <span className="text-[9px] text-cyan-400">Click to preview</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {VOICE_PERSONAS.map((persona) => (
                <button
                  key={persona.id}
                  onClick={() => handleSelectPersona(persona)}
                  className={`p-2.5 rounded-xl text-left border transition-all ${
                    selectedPersona.id === persona.id
                      ? 'bg-blue-950/70 border-cyan-400 text-white shadow-md ring-1 ring-cyan-400/50'
                      : 'bg-[#101728] border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold block truncate max-w-[100px]">{persona.name}</span>
                    <span className={`text-[8px] px-1 py-0.2 rounded font-bold ${
                      persona.gender === 'male' ? 'bg-blue-900/80 text-blue-200' : 'bg-purple-900/80 text-purple-200'
                    }`}>
                      {persona.gender.toUpperCase()}
                    </span>
                  </div>
                  <span className="text-[10px] text-cyan-400 block mt-0.5 truncate">{persona.accent}</span>
                  <p className="text-[9px] text-slate-400 mt-1 line-clamp-1">{persona.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function getInitialGreeting(mode: VoiceMode, persona: VoicePersona, comedyLevel: ComedyLevel): string {
  switch (mode) {
    case 'general':
      if (persona.langCode === 'ur-PK') {
        return "سلام! میں طارق ہوں۔ ملیزئی لائیو وائس سسٹم میں آپ کو خوش آمدید کہتا ہوں۔ آپ اردو یا انگلش میں قدرتی انداز میں بات کر سکتے ہیں، اور جب چاہیں مجھے بیچ میں روک سکتے ہیں۔";
      }
      if (persona.langCode === 'ps-AF') {
        return "سلامونه او نېکې هیلې! زه زلمی یم. تاسو کولی شئ په پښتو یا انګلیسي ژبه کې هر وخت زما سره خبرې وکړئ او پوښتنې وکړئ.";
      }
      return `Hello! I am ${persona.name.split(' ')[0]}, your male companion in Millizai AI. Continuous listening is active through your microphone. You can speak naturally in English, Urdu, Pashto, or any language, and feel free to interrupt me whenever you'd like.`;

    case 'mental_comedy':
      if (comedyLevel === 4) {
        return "YOOOO! You turned on UNHINGED MODE! Prepare yourself, because I am not holding back! What ridiculous thoughts are in your brain today?";
      }
      if (comedyLevel === 3) {
        return "Welcome to Savage Comedy! Drop your best lines, but be ready—I roast back with zero mercy!";
      }
      return "Hey there! Hamza's comedy mic is live! What's on your mind? Let's have some real banter!";

    case 'mature_18':
      return "Welcome to the 18+ Mature Lounge. I'm Farhan. We can speak openly and honestly about relationships, life depth, romance, and mature questions with adult authenticity. What shall we explore?";

    case 'palmistry':
      return "Greetings. I am Rehan, your Palmistry Voice Master. Hand analysis reflects ancient wisdom and human personality. What question shall we consult the lines about?";
  }
}
