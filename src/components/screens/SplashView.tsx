import React, { useEffect } from 'react';
import { Sparkles, Bot } from 'lucide-react';

interface Props {
  onComplete: () => void;
}

export const SplashView: React.FC<Props> = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-[#080c14] text-white p-6 relative overflow-hidden select-none">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 w-72 h-72 bg-blue-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Futuristic Emblem */}
      <div className="relative mb-6 animate-pulse">
        <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-purple-600 via-blue-600 to-cyan-400 p-[2px] shadow-lg shadow-purple-500/30 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#0d121f] flex items-center justify-center">
            <Bot className="w-12 h-12 text-cyan-400" />
          </div>
        </div>
        <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-purple-400 animate-spin" style={{ animationDuration: '6s' }} />
      </div>

      <h1 className="text-3xl font-extrabold tracking-wider bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent">
        MILLIZAI AI
      </h1>

      <p className="text-xs uppercase tracking-widest text-cyan-400/80 font-medium mt-1">
        Next-Generation Native AI Assistant
      </p>

      <div className="mt-4 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-slate-400">
        Developed by <span className="text-purple-300 font-semibold">Shahab Millizai</span>
      </div>

      <div className="mt-12 flex flex-col items-center gap-2">
        <div className="w-36 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 animate-[pulse_1s_infinite] w-full" />
        </div>
        <span className="text-[10px] text-slate-500 font-mono">Initializing GGUF & Neural Core...</span>
      </div>
    </div>
  );
};
