import React, { useEffect, useState } from 'react';
import { VoiceMode } from '../types';
import { Mic, Volume2, Sparkles, MicOff, Radio, Cpu } from 'lucide-react';

interface Props {
  state: 'listening' | 'speaking' | 'thinking' | 'idle';
  isMuted: boolean;
  mode: VoiceMode;
  personaName?: string;
  detectedLanguage?: string;
  isOnline?: boolean;
  amplitude?: number; // 0 to 100
  onClick?: () => void;
}

export const VoiceOrb: React.FC<Props> = ({
  state,
  isMuted,
  mode,
  personaName = 'Zayn (Prime Male)',
  detectedLanguage = 'English / Auto',
  isOnline = true,
  amplitude = 0,
  onClick
}) => {
  const [waveHeights, setWaveHeights] = useState<number[]>([15, 25, 45, 30, 60, 40, 20]);

  // Sync live audio waveform spectrum bars
  useEffect(() => {
    const interval = setInterval(() => {
      if (state === 'speaking' || (state === 'listening' && !isMuted)) {
        const factor = state === 'speaking' ? 0.95 : 0.55;
        setWaveHeights([
          Math.floor(Math.random() * 35 * factor) + 15,
          Math.floor(Math.random() * 65 * factor) + 20,
          Math.floor(Math.random() * 95 * factor) + 25,
          Math.floor(Math.random() * 100 * factor) + 30,
          Math.floor(Math.random() * 85 * factor) + 25,
          Math.floor(Math.random() * 55 * factor) + 20,
          Math.floor(Math.random() * 35 * factor) + 15
        ]);
      } else {
        setWaveHeights([10, 14, 18, 16, 14, 12, 10]);
      }
    }, 80);
    return () => clearInterval(interval);
  }, [state, isMuted]);

  const modeTheme = {
    general: {
      primaryGradient: 'from-blue-600 via-indigo-600 to-cyan-400',
      auraColor: 'bg-blue-600/30',
      ringColor: 'border-cyan-400/50',
      activeColor: 'text-cyan-300'
    },
    palmistry: {
      primaryGradient: 'from-purple-600 via-indigo-600 to-emerald-400',
      auraColor: 'bg-purple-600/30',
      ringColor: 'border-emerald-400/50',
      activeColor: 'text-emerald-300'
    },
    mental_comedy: {
      primaryGradient: 'from-amber-500 via-orange-600 to-red-600',
      auraColor: 'bg-amber-500/35',
      ringColor: 'border-amber-400/60',
      activeColor: 'text-amber-300'
    },
    mature_18: {
      primaryGradient: 'from-rose-600 via-pink-600 to-purple-800',
      auraColor: 'bg-rose-600/35',
      ringColor: 'border-rose-400/60',
      activeColor: 'text-rose-300'
    }
  }[mode];

  return (
    <div
      onClick={onClick}
      className="relative flex flex-col items-center justify-center cursor-pointer select-none py-3"
      title="Click to interrupt or interact with Voice AI"
    >
      {/* Outer Atmospheric Pulsing Halo */}
      <div
        className={`absolute w-56 h-56 rounded-full ${modeTheme.auraColor} blur-3xl transition-transform duration-700 pointer-events-none ${
          state === 'speaking'
            ? 'scale-125 opacity-100 animate-pulse'
            : state === 'listening'
            ? 'scale-105 opacity-80'
            : 'scale-90 opacity-40'
        }`}
      />

      {/* Dynamic Soundwave Rings during speech */}
      {state === 'speaking' && (
        <>
          <div className="absolute w-44 h-44 rounded-full border border-blue-400/30 animate-ping" style={{ animationDuration: '1.8s' }} />
          <div className="absolute w-52 h-52 rounded-full border border-cyan-400/20 animate-ping delay-300" style={{ animationDuration: '2.4s' }} />
        </>
      )}

      {/* Main 3D Spherical Male Voice Orb */}
      <div
        className={`relative w-36 h-36 rounded-full bg-gradient-to-tr ${modeTheme.primaryGradient} p-[3px] shadow-2xl transition-all duration-500 ${
          state === 'speaking' ? 'scale-110 shadow-blue-500/50' : 'scale-100'
        }`}
      >
        <div className="w-full h-full rounded-full bg-[#080d1a] flex flex-col items-center justify-center relative overflow-hidden backdrop-blur-xl">
          {/* Inner Light Flare */}
          <div className="absolute -top-6 -left-6 w-20 h-20 bg-white/20 rounded-full blur-xl pointer-events-none" />

          {/* Central Voice Icon & Audio Frequency Spectrum */}
          <div className="z-10 flex flex-col items-center justify-center">
            {isMuted ? (
              <MicOff className="w-8 h-8 text-red-400 animate-bounce" />
            ) : state === 'speaking' ? (
              <Volume2 className="w-8 h-8 text-cyan-300 animate-pulse" />
            ) : state === 'thinking' ? (
              <Sparkles className="w-8 h-8 text-amber-300 animate-spin" style={{ animationDuration: '3s' }} />
            ) : (
              <Mic className="w-8 h-8 text-blue-400" />
            )}

            {/* Live Audio Waveform Bars */}
            <div className="flex items-center gap-1 mt-2.5 h-6">
              {waveHeights.map((h, i) => (
                <div
                  key={i}
                  className={`w-1 rounded-full transition-all duration-700 ${
                    isMuted
                      ? 'bg-red-400'
                      : state === 'speaking'
                      ? 'bg-cyan-300'
                      : state === 'thinking'
                      ? 'bg-amber-400'
                      : 'bg-blue-400'
                  }`}
                  style={{ height: `${isMuted ? 6 : h}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Status & Active Male Voice Indicator */}
      <div className="mt-3.5 flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 text-[11px] font-semibold text-white shadow-lg">
          <span
            className={`w-2 h-2 rounded-full ${
              isMuted
                ? 'bg-red-400'
                : state === 'speaking'
                ? 'bg-cyan-400 animate-ping'
                : state === 'thinking'
                ? 'bg-amber-400 animate-pulse'
                : 'bg-emerald-400 animate-pulse'
            }`}
          />
          <span>
            {isMuted
              ? 'Microphone Muted'
              : state === 'speaking'
              ? `${personaName} is Speaking...`
              : state === 'thinking'
              ? 'Thinking & Processing...'
              : 'Listening continuously...'}
          </span>
        </div>

        {/* Engine and Language Badge */}
        <div className="flex items-center gap-1.5 text-[9px]">
          <span className="px-2 py-0.5 rounded-full bg-blue-950/80 border border-blue-800 text-blue-300 font-medium flex items-center gap-1">
            <Radio className="w-2.5 h-2.5 text-blue-400" />
            {isOnline ? 'Neural Male Voice' : 'Offline GGUF Engine'}
          </span>
          <span className="px-2 py-0.5 rounded-full bg-purple-950/80 border border-purple-800 text-purple-300 font-medium">
            {detectedLanguage}
          </span>
        </div>
      </div>
    </div>
  );
};
