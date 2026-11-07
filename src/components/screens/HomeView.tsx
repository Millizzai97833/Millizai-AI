import React from 'react';
import { ScreenId, AppSettings } from '../../types';
import {
  MessageSquare,
  Image as ImageIcon,
  PenTool,
  Code2,
  HardDrive,
  Download,
  History,
  Settings,
  User,
  Zap,
  Cpu,
  Globe,
  Mic,
  Eye,
  Laugh,
  Flame,
  Radio,
  Sparkles,
  Video,
  Film
} from 'lucide-react';

interface Props {
  settings: AppSettings;
  activeModelName: string;
  onNavigate: (screen: ScreenId) => void;
  onToggleOffline: () => void;
}

export const HomeView: React.FC<Props> = ({
  settings,
  activeModelName,
  onNavigate,
  onToggleOffline
}) => {
  return (
    <div className="h-full flex flex-col bg-[#080c14] text-slate-100 overflow-y-auto custom-scrollbar p-3.5 space-y-4">
      {/* Top Bar */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-blue-600 to-cyan-400 p-[1.5px] shadow-md shadow-purple-500/20">
            <div className="w-full h-full rounded-[10px] bg-[#0c1220] flex items-center justify-center">
              <Zap className="w-4 h-4 text-cyan-400" />
            </div>
          </div>
          <div>
            <h1 className="text-sm font-extrabold text-white leading-tight">Millizai AI</h1>
            <p className="text-[10px] text-slate-400 font-medium">by Shahab Millizai</p>
          </div>
        </div>

        {/* Online / Offline Switch Badge */}
        <button
          onClick={onToggleOffline}
          className={`px-3 py-1 rounded-full text-[10px] font-bold flex items-center gap-1.5 transition-all border ${
            settings.isOfflineMode
              ? 'bg-blue-950/80 border-blue-500/50 text-blue-300 shadow-sm shadow-blue-500/30'
              : 'bg-emerald-950/80 border-emerald-500/50 text-emerald-300 shadow-sm shadow-emerald-500/30'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${settings.isOfflineMode ? 'bg-cyan-400 animate-pulse' : 'bg-emerald-400'}`} />
          {settings.isOfflineMode ? 'OFFLINE GGUF' : 'ONLINE API'}
        </button>
      </div>

      {/* System Status Hero Card */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#12192c] to-[#0c101c] border border-purple-500/30 shadow-lg relative overflow-hidden">
        <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-purple-600/10 rounded-full blur-2xl" />
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[9px] font-bold tracking-wider text-purple-400 uppercase">
              Live AI Inference Engine
            </span>
            <h3 className="text-xs font-bold text-white mt-0.5">
              {settings.isOfflineMode ? `Local GGUF: ${activeModelName}` : 'Online: Self-Hosted / OpenAI SSE'}
            </h3>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {settings.isOfflineMode
                ? 'Zero network latency • 100% private llama.cpp inference'
                : `Endpoint: ${settings.onlineEndpoint.replace(/^https?:\/\//, '').slice(0, 24)}...`}
            </p>
          </div>
          <Cpu className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
        </div>

        {/* Quick Resource Bar */}
        <div className="mt-2.5 pt-2.5 border-t border-slate-800/80 grid grid-cols-3 gap-2 text-center text-[10px]">
          <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[9px]">RAM Free</span>
            <span className="text-cyan-300 font-bold">2.4 GB</span>
          </div>
          <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[9px]">GGUF Quant</span>
            <span className="text-purple-300 font-bold">Q4_K_M</span>
          </div>
          <div className="bg-slate-900/60 p-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[9px]">Voice Engine</span>
            <span className="text-emerald-300 font-bold">VAD Active</span>
          </div>
        </div>
      </div>

      {/* 4 Dedicated Live AI Voice Cards */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
            Live Voice Systems
          </h2>
          <span className="text-[9px] text-purple-400 font-bold">2-Way Spoken VAD</span>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: General Voice Chat */}
          <button
            onClick={() => onNavigate('voice-general')}
            className="p-3 rounded-2xl bg-gradient-to-br from-[#16122c] to-[#0d1020] border border-purple-500/40 hover:border-purple-400 text-left transition-all shadow-md group relative overflow-hidden"
          >
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Mic className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1">
              General Voice Chat
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
              Natural spoken chat with real-time interruption (barge-in)
            </p>
          </button>

          {/* Card 2: Palmistry Voice Master */}
          <button
            onClick={() => onNavigate('palmistry-voice')}
            className="p-3 rounded-2xl bg-gradient-to-br from-[#0e1d28] to-[#0a1420] border border-cyan-500/40 hover:border-cyan-400 text-left transition-all shadow-md group relative overflow-hidden"
          >
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Eye className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Palmistry Master</h4>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
              Palm scanning, spoken readings & follow-up Q&A
            </p>
          </button>

          {/* Card 3: Mental Comedy Voice */}
          <button
            onClick={() => onNavigate('mental-comedy')}
            className="p-3 rounded-2xl bg-gradient-to-br from-[#24170a] to-[#140e06] border border-amber-500/40 hover:border-amber-400 text-left transition-all shadow-md group relative overflow-hidden"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Laugh className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">Mental Comedy</h4>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
              4-level roast machine, sarcasm & unhinged jokes
            </p>
          </button>

          {/* Card 4: 18+ Mature Voice Chat */}
          <button
            onClick={() => onNavigate('mature-18')}
            className="p-3 rounded-2xl bg-gradient-to-br from-[#280c1d] to-[#160810] border border-rose-500/40 hover:border-rose-400 text-left transition-all shadow-md group relative overflow-hidden"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
              <Flame className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-white">18+ Mature Voice</h4>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">
              Age-gated romantic & adult relationship lounge
            </p>
          </button>
        </div>
      </div>

      {/* Multilingual Quick Badges */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 text-[10px] custom-scrollbar">
        <span className="text-slate-400 text-[10px] flex items-center gap-1 shrink-0">
          <Globe className="w-3 h-3 text-cyan-400" /> Languages:
        </span>
        <span className="px-2 py-0.5 rounded-md bg-purple-950/60 border border-purple-800/50 text-purple-300">
          English
        </span>
        <span className="px-2 py-0.5 rounded-md bg-emerald-950/60 border border-emerald-800/50 text-emerald-300 font-urdu" dir="rtl">
          اردو
        </span>
        <span className="px-2 py-0.5 rounded-md bg-blue-950/60 border border-blue-800/50 text-blue-300 font-pashto" dir="rtl">
          پښتو
        </span>
        <span className="px-2 py-0.5 rounded-md bg-sky-950/60 border border-sky-800/50 text-sky-300">
          한국어
        </span>
        <span className="px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-800/50 text-amber-300">
          中文
        </span>
        <span className="px-2 py-0.5 rounded-md bg-red-950/60 border border-red-800/50 text-red-300">
          日本語
        </span>
      </div>

      {/* AI Workspaces (Chat, Image, Writer, Coder) */}
      <div className="space-y-1.5 pt-1">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">AI Workspaces</h2>
        <div className="grid grid-cols-2 gap-2.5">
          {/* AI Chat */}
          <button
            onClick={() => onNavigate('chat')}
            className="p-3 rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-purple-500/40 text-left transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center mb-1.5">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-white">AI Chat</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Dual online & offline GGUF</p>
          </button>

          {/* AI Image Generator */}
          <button
            onClick={() => onNavigate('image')}
            className="p-3 rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-emerald-500/40 text-left transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-1.5">
              <ImageIcon className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-white">Image Gen</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Diffusion text to image</p>
          </button>

          {/* AI Video Studio */}
          <button
            onClick={() => onNavigate('video-studio')}
            className="p-3 rounded-2xl bg-gradient-to-br from-[#121936] to-[#0d1428] border border-cyan-500/40 hover:border-cyan-400 text-left transition-all shadow-md group relative overflow-hidden"
          >
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center mb-1.5 group-hover:scale-105 transition-transform">
              <Video className="w-3.5 h-3.5" />
            </div>
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white">Video Studio</h4>
              <span className="text-[8px] px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">ONLINE</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-0.5">Text & image to video, stories</p>
          </button>

          {/* AI Writing Assistant */}
          <button
            onClick={() => onNavigate('writing')}
            className="p-3 rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-purple-500/40 text-left transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center mb-1.5">
              <PenTool className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-white">AI Writer</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Emails, essays & poetry</p>
          </button>

          {/* AI Coding Assistant */}
          <button
            onClick={() => onNavigate('coding')}
            className="p-3 rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-amber-500/40 text-left transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center mb-1.5">
              <Code2 className="w-3.5 h-3.5" />
            </div>
            <h4 className="text-xs font-bold text-white">AI Coder</h4>
            <p className="text-[10px] text-slate-400 mt-0.5">Kotlin, Python, C++, SQL</p>
          </button>
        </div>
      </div>

      {/* Model & Utilities List */}
      <div className="space-y-1.5 pt-1">
        <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Storage & Device Settings</h2>
        <div className="space-y-2">
          <button
            onClick={() => onNavigate('models')}
            className="w-full p-2.5 rounded-xl bg-[#0f1728] border border-slate-800/80 hover:border-cyan-500/40 flex items-center justify-between text-left text-xs"
          >
            <div className="flex items-center gap-2.5">
              <HardDrive className="w-4 h-4 text-cyan-400" />
              <div>
                <span className="font-semibold text-slate-200 block">AI Model Library</span>
                <span className="text-[10px] text-slate-400">Llama 3.2 1B, Qwen 2.5 0.5B, SD-Turbo</span>
              </div>
            </div>
            <span className="text-[10px] text-purple-400 font-semibold">GGUF →</span>
          </button>

          <button
            onClick={() => onNavigate('downloads')}
            className="w-full p-2.5 rounded-xl bg-[#0f1728] border border-slate-800/80 hover:border-cyan-500/40 flex items-center justify-between text-left text-xs"
          >
            <div className="flex items-center gap-2.5">
              <Download className="w-4 h-4 text-purple-400" />
              <div>
                <span className="font-semibold text-slate-200 block">Model Downloads & SAF</span>
                <span className="text-[10px] text-slate-400">Manage internal storage & import .gguf files</span>
              </div>
            </div>
            <span className="text-[10px] text-cyan-400 font-semibold">SAF →</span>
          </button>

          <button
            onClick={() => onNavigate('history')}
            className="w-full p-2.5 rounded-xl bg-[#0f1728] border border-slate-800/80 hover:border-cyan-500/40 flex items-center justify-between text-left text-xs"
          >
            <div className="flex items-center gap-2.5">
              <History className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-semibold text-slate-200 block">Chat History & Logs</span>
                <span className="text-[10px] text-slate-400">Room SQLite database conversations</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">Saved →</span>
          </button>

          <button
            onClick={() => onNavigate('settings')}
            className="w-full p-2.5 rounded-xl bg-[#0f1728] border border-slate-800/80 hover:border-cyan-500/40 flex items-center justify-between text-left text-xs"
          >
            <div className="flex items-center gap-2.5">
              <Settings className="w-4 h-4 text-amber-400" />
              <div>
                <span className="font-semibold text-slate-200 block">Settings</span>
                <span className="text-[10px] text-slate-400">Configure server URLs, API keys & speech</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold">Config →</span>
          </button>

          <button
            onClick={() => onNavigate('about')}
            className="w-full p-2.5 rounded-xl bg-gradient-to-r from-purple-950/40 to-blue-950/40 border border-purple-800/40 hover:border-purple-500/60 flex items-center justify-between text-left text-xs"
          >
            <div className="flex items-center gap-2.5">
              <User className="w-4 h-4 text-purple-300" />
              <div>
                <span className="font-semibold text-purple-200 block">About Shahab Millizai</span>
                <span className="text-[10px] text-slate-400">Lead AI engineer & GitHub repository</span>
              </div>
            </div>
            <span className="text-[10px] text-purple-300 font-semibold">Bio →</span>
          </button>
        </div>
      </div>
    </div>
  );
};
