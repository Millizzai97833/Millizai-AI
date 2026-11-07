import React from 'react';
import { ArrowLeft, User, ExternalLink, Code2, ShieldCheck, Heart } from 'lucide-react';

interface Props {
  onBack: () => void;
}

export const AboutView: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="h-full flex flex-col bg-[#080c14] text-slate-100 overflow-y-auto custom-scrollbar p-3 space-y-3.5">
      {/* Top Bar */}
      <div className="flex items-center gap-2 pb-1 border-b border-slate-800">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xs font-bold text-white">About the Developer</h2>
          <p className="text-[10px] text-cyan-400">Architect & Technical Specifications</p>
        </div>
      </div>

      {/* Developer Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-[#161d33] to-[#0c1220] border border-purple-500/40 text-center space-y-2.5 relative overflow-hidden shadow-xl">
        <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-purple-600 via-blue-600 to-cyan-400 p-[2px] shadow-lg shadow-purple-500/30 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#090d16] flex items-center justify-center">
            <User className="w-8 h-8 text-cyan-400" />
          </div>
        </div>

        <div>
          <h3 className="text-base font-extrabold text-white">Shahab Millizai</h3>
          <p className="text-[11px] text-purple-300 font-medium">
            AI Engineer & Native Android Systems Developer
          </p>
        </div>

        <p className="text-[11px] text-slate-300 leading-relaxed text-left">
          Shahab Millizai developed Millizai AI to bring genuine, production-grade intelligence directly onto Android devices. 
          By bridging high-performance offline llama.cpp GGUF inference, mobile Stable Diffusion, and multilingual mastery 
          in Urdu (اردو), Pashto (پښتو), and English, Millizai AI guarantees privacy, speed, and linguistic equity.
        </p>
      </div>

      {/* Technical Specifications */}
      <div className="p-3.5 rounded-2xl bg-[#0f1728] border border-slate-800 space-y-2 text-xs">
        <h4 className="font-bold text-white flex items-center gap-1.5 text-xs">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          Android Technical Specifications
        </h4>

        <div className="space-y-1.5 pt-1 text-[11px]">
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Application Name</span>
            <span className="text-white font-semibold">Millizai AI</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Developer</span>
            <span className="text-cyan-400 font-semibold">Shahab Millizai</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Package Name</span>
            <span className="text-white font-mono text-[10px]">com.shahabmillizai.millizai</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Version</span>
            <span className="text-white font-semibold">1.0 (Build 1)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Target SDK / Compile SDK</span>
            <span className="text-white font-semibold">Android 36 (Java 17)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Minimum SDK</span>
            <span className="text-white font-semibold">Android 24 (7.0 Nougat+)</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">UI Architecture</span>
            <span className="text-white font-semibold">Jetpack Compose & Material 3</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-400">Local Database</span>
            <span className="text-white font-semibold">Room 2.6 (SQLite)</span>
          </div>
          <div className="flex justify-between py-1">
            <span className="text-slate-400">Inference Core</span>
            <span className="text-purple-300 font-semibold">llama.cpp JNI + OkHttp SSE</span>
          </div>
        </div>
      </div>

      {/* GitHub Official Repository */}
      <div className="p-3.5 rounded-2xl bg-[#0f1728] border border-slate-800 space-y-2">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-purple-400" />
          <h4 className="text-xs font-bold text-white">Official GitHub Repository</h4>
        </div>
        <p className="text-[10px] text-slate-400 font-mono break-all">
          https://github.com/Millizzai97833/Millizai-AI
        </p>

        <a
          href="https://github.com/Millizzai97833/Millizai-AI"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 w-full py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-purple-600/30 transition-all"
        >
          <span>Open Repository on GitHub</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      <div className="text-center pt-2 text-[10px] text-slate-500 flex items-center justify-center gap-1">
        <span>Engineered with passion by</span>
        <span className="text-purple-400 font-semibold">Shahab Millizai</span>
      </div>
    </div>
  );
};
