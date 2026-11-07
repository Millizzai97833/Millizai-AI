import React, { useState } from 'react';
import { AppSettings, GgufModel, GeneratedImage, Conversation } from './types';
import { AndroidSimulator } from './components/AndroidSimulator';
import { SourceCodeViewer } from './components/SourceCodeViewer';
import { GithubBuildGuide } from './components/GithubBuildGuide';
import { downloadAndroidProjectZip } from './services/zipExporter';
import {
  Smartphone,
  Code2,
  Workflow,
  Download,
  ExternalLink,
  Bot,
  Maximize2,
  Minimize2,
  Sparkles
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'github'>('simulator');
  const [isExpandedPhone, setIsExpandedPhone] = useState(false);
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  // App Settings State
  const [settings, setSettings] = useState<AppSettings>({
    onlineEndpoint: 'https://api.openai.com/v1',
    onlineApiKey: '',
    onlineModel: 'gpt-4o-mini',
    imageEndpoint: 'https://image.pollinations.ai/prompt',
    isOfflineMode: false,
    temperature: 0.7,
    systemPrompt:
      'You are Millizai AI, a powerful, helpful, and courteous artificial intelligence assistant created by Shahab Millizai. You assist users with general knowledge, multilingual chat (English, Urdu, Pashto), coding, and writing.',
    selectedLanguage: 'en',
    theme: 'dark',
    voiceSpeed: 1.0,
    voicePitch: 0.95,
    voiceVolume: 1.0,
    voiceLanguage: 'auto',
    selectedVoiceId: 'zayn_male'
  });

  // Local Models State (Room & GGUF)
  const [models, setModels] = useState<GgufModel[]>([
    {
      id: 'llama-3.2-1b-q4',
      name: 'Llama 3.2 1B Instruct',
      family: 'Meta AI',
      fileName: 'Llama-3.2-1B-Instruct-Q4_K_M.gguf',
      sizeBytes: 817889280,
      sizeDisplay: '780 MB',
      ramRequiredMb: 1200,
      quantization: 'Q4_K_M',
      parameterSize: '1.2B',
      description: 'Ultra-fast token throughput tailored for Android ARM64 processors.',
      isDownloaded: true,
      isSelected: true,
      downloadUrl: 'https://huggingface.co/bartowski/Llama-3.2-1B-Instruct-GGUF/resolve/main/Llama-3.2-1B-Instruct-Q4_K_M.gguf',
      contextLength: 4096
    },
    {
      id: 'qwen2.5-0.5b-q4',
      name: 'Qwen 2.5 0.5B Instruct',
      family: 'Alibaba Cloud',
      fileName: 'qwen2.5-0.5b-instruct-q4_k_m.gguf',
      sizeBytes: 440401920,
      sizeDisplay: '420 MB',
      ramRequiredMb: 650,
      quantization: 'Q4_K_M',
      parameterSize: '0.5B',
      description: 'Extremely lightweight, runs seamlessly on budget devices with under 3GB RAM.',
      isDownloaded: false,
      isSelected: false,
      downloadUrl: 'https://huggingface.co/Qwen/Qwen2.5-0.5B-Instruct-GGUF/resolve/main/qwen2.5-0.5b-instruct-q4_k_m.gguf',
      contextLength: 2048
    },
    {
      id: 'gemma-2-2b-q4',
      name: 'Gemma 2 2B IT',
      family: 'Google DeepMind',
      fileName: 'gemma-2-2b-it-Q4_K_M.gguf',
      sizeBytes: 1503238550,
      sizeDisplay: '1.4 GB',
      ramRequiredMb: 2200,
      quantization: 'Q4_K_M',
      parameterSize: '2.6B',
      description: 'High logical reasoning and comprehensive multilingual linguistic capabilities.',
      isDownloaded: false,
      isSelected: false,
      downloadUrl: 'https://huggingface.co/bartowski/gemma-2-2b-it-GGUF/resolve/main/gemma-2-2b-it-Q4_K_M.gguf',
      contextLength: 4096
    },
    {
      id: 'sd-turbo-mobile-q4',
      name: 'Stable Diffusion Turbo Mobile',
      family: 'Stability AI',
      fileName: 'sd-turbo.safetensors',
      sizeBytes: 1717986918,
      sizeDisplay: '1.6 GB',
      ramRequiredMb: 2600,
      quantization: 'Q4 UNet',
      parameterSize: '1-Step',
      description: 'Mobile-adapted latent diffusion model for fast on-device text-to-image synthesis.',
      isDownloaded: false,
      isSelected: false,
      downloadUrl: 'https://huggingface.co/stabilityai/sd-turbo/resolve/main/sd-turbo.safetensors',
      contextLength: 77
    }
  ]);

  // Gallery Images State
  const [gallery, setGallery] = useState<GeneratedImage[]>([
    {
      id: 'sample-1',
      prompt: 'Cybernetic Bengal tiger with electric cyan and purple neon aura in a rain-soaked futuristic metropolis, 8k render, unreal engine 5 cinematic',
      url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      width: 512,
      height: 512,
      seed: 849201,
      steps: 25,
      createdAt: Date.now() - 3600000,
      mode: 'online'
    },
    {
      id: 'sample-2',
      prompt: 'Shahab Millizai holographic research laboratory with neural quantum core and high-tech Android development consoles',
      url: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=600&auto=format&fit=crop&q=80',
      width: 512,
      height: 512,
      seed: 521948,
      steps: 30,
      createdAt: Date.now() - 7200000,
      mode: 'online'
    }
  ]);

  // Room Conversation History State
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 'conv-1',
      title: 'Android Jetpack Compose Room Architecture',
      mode: 'offline',
      modelName: 'Llama 3.2 1B Instruct',
      updatedAt: Date.now() - 1000 * 60 * 45,
      messages: [
        {
          id: 'm1',
          conversationId: 'conv-1',
          role: 'user',
          content: 'How does Millizai AI configure Room SQLite encryption?',
          timestamp: Date.now() - 1000 * 60 * 45
        },
        {
          id: 'm2',
          conversationId: 'conv-1',
          role: 'assistant',
          content: 'Millizai AI leverages AndroidX Room with SQLCipher integration, storing conversation records and GGUF model registry entries safely inside the sandboxed app directory.',
          timestamp: Date.now() - 1000 * 60 * 44
        }
      ]
    },
    {
      id: 'conv-2',
      title: 'اردو شاعری اور شاہاب ملیزئی کی سوانح',
      mode: 'online',
      modelName: 'OpenAI GPT-4o Mini',
      updatedAt: Date.now() - 1000 * 60 * 180,
      messages: [
        {
          id: 'm3',
          conversationId: 'conv-2',
          role: 'user',
          content: 'اردو میں شاہاب ملیزئی کا تعارف پیش کریں',
          timestamp: Date.now() - 1000 * 60 * 180
        },
        {
          id: 'm4',
          conversationId: 'conv-2',
          role: 'assistant',
          content: 'شاہاب ملیزئی ایک مایہ ناز اینڈرائیڈ ڈویلپر اور اے آئی انجینئر ہیں جنہوں نے ملیزئی اے آئی کی بنیاد رکھی۔ اس کا مقصد خطے کی زبانوں کے ساتھ ساتھ آف لائن ماڈلز کو عام کرنا ہے۔',
          timestamp: Date.now() - 1000 * 60 * 179
        }
      ]
    }
  ]);

  const handleDownloadZip = async () => {
    setIsDownloadingZip(true);
    await downloadAndroidProjectZip();
    setIsDownloadingZip(false);
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#050811] text-slate-100 overflow-hidden font-sans">
      {/* Top Header Bar */}
      <header className="h-14 px-4 md:px-6 bg-[#090d19]/90 border-b border-slate-800/80 backdrop-blur-md flex items-center justify-between shrink-0 z-50">
        {/* Brand & Developer */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 via-blue-600 to-cyan-400 p-[1.5px] shadow-lg shadow-purple-600/30 flex items-center justify-center">
            <div className="w-full h-full rounded-[10px] bg-[#0c1220] flex items-center justify-center">
              <Bot className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold tracking-wide text-white">MILLIZAI AI</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-900/60 border border-purple-600/50 text-purple-300 font-bold">
                v1.0 (Build 1)
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Developed by <span className="text-cyan-400 font-semibold">Shahab Millizai</span> • Native Android
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="hidden md:flex items-center bg-[#0d1322] border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('simulator')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'simulator'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            Android App (11 Screens)
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'code'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            Android Source Files
          </button>

          <button
            onClick={() => setActiveTab('github')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'github'
                ? 'bg-purple-600 text-white shadow-md shadow-purple-600/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            GitHub APK Build
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadZip}
            disabled={isDownloadingZip}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold shadow-md shadow-purple-600/25 flex items-center gap-1.5 transition-all"
            title="Download Complete Android Studio Project as ZIP"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isDownloadingZip ? 'Zipping...' : 'Download Project (.ZIP)'}</span>
          </button>

          <a
            href="https://github.com/Millizzai97833/Millizai-AI"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-xl bg-[#0f1728] border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white transition-colors"
            title="Open GitHub Repository"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </header>

      {/* Mobile Tab Bar */}
      <div className="md:hidden flex items-center justify-around bg-[#0c1220] border-b border-slate-800 p-1.5 shrink-0 text-xs">
        <button
          onClick={() => setActiveTab('simulator')}
          className={`px-3 py-1 rounded-lg ${activeTab === 'simulator' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'}`}
        >
          📱 Simulator
        </button>
        <button
          onClick={() => setActiveTab('code')}
          className={`px-3 py-1 rounded-lg ${activeTab === 'code' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'}`}
        >
          💻 Source Files
        </button>
        <button
          onClick={() => setActiveTab('github')}
          className={`px-3 py-1 rounded-lg ${activeTab === 'github' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400'}`}
        >
          🚀 APK Build
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden relative flex">
        {activeTab === 'simulator' && (
          <div className="w-full h-full flex flex-col md:flex-row items-center justify-center p-3 md:p-6 overflow-hidden relative">
            {/* Ambient Background Aura */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Quick Toggle Phone Frame Mode */}
            <div className="absolute top-3 right-4 z-40 hidden md:flex items-center gap-2">
              <button
                onClick={() => setIsExpandedPhone(!isExpandedPhone)}
                className="px-2.5 py-1 rounded-lg bg-[#0d1424] border border-slate-800 text-[11px] text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                {isExpandedPhone ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                <span>{isExpandedPhone ? 'Compact Phone Frame' : 'Expanded Studio View'}</span>
              </button>
            </div>

            {/* The Actual Android Simulator Phone Component */}
            <div className={`h-full ${isExpandedPhone ? 'w-full max-w-4xl' : 'w-auto'} flex items-center justify-center`}>
              <AndroidSimulator
                settings={settings}
                onUpdateSettings={setSettings}
                models={models}
                onUpdateModels={setModels}
                gallery={gallery}
                onAddImage={(img) => setGallery((prev) => [img, ...prev])}
                conversations={conversations}
                onUpdateConversations={setConversations}
                isExpandedView={isExpandedPhone}
              />
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="w-full h-full p-3 md:p-6">
            <SourceCodeViewer />
          </div>
        )}

        {activeTab === 'github' && (
          <div className="w-full h-full p-2 md:p-6 overflow-hidden">
            <GithubBuildGuide />
          </div>
        )}
      </main>
    </div>
  );
}
