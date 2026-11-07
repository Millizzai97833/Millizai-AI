import React, { useState } from 'react';
import { AppSettings } from '../../types';
import { ArrowLeft, Save, Eye, EyeOff, CheckCircle2 } from 'lucide-react';

interface Props {
  settings: AppSettings;
  onSave: (updated: AppSettings) => void;
  onBack: () => void;
}

export const SettingsView: React.FC<Props> = ({ settings, onSave, onBack }) => {
  const [endpoint, setEndpoint] = useState(settings.onlineEndpoint);
  const [apiKey, setApiKey] = useState(settings.onlineApiKey);
  const [showKey, setShowKey] = useState(false);
  const [model, setModel] = useState(settings.onlineModel);
  const [imgEndpoint, setImgEndpoint] = useState(settings.imageEndpoint);
  const [isOffline, setIsOffline] = useState(settings.isOfflineMode);
  const [temp, setTemp] = useState(settings.temperature);
  const [sysPrompt, setSysPrompt] = useState(settings.systemPrompt);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onSave({
      ...settings,
      onlineEndpoint: endpoint,
      onlineApiKey: apiKey,
      onlineModel: model,
      imageEndpoint: imgEndpoint,
      isOfflineMode: isOffline,
      temperature: temp,
      systemPrompt: sysPrompt
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="h-full flex flex-col bg-[#080c14] text-slate-100 overflow-y-auto custom-scrollbar p-3 space-y-3.5">
      {/* Top Bar */}
      <div className="flex items-center gap-2 pb-1 border-b border-slate-800">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xs font-bold text-white">Application Settings</h2>
          <p className="text-[10px] text-cyan-400">Endpoints, DataStore & Local Storage</p>
        </div>
      </div>

      {/* Online Server Config */}
      <div className="p-3 rounded-2xl bg-[#0f1728] border border-slate-800 space-y-2.5">
        <h3 className="text-xs font-bold text-white">Online Inference Server (OpenAI Compatible)</h3>
        <p className="text-[10px] text-slate-400">
          Connect your self-hosted Ollama, vLLM, LM Studio, or OpenAI. No hardcoded paid keys.
        </p>

        <div>
          <label className="text-[10px] font-semibold text-slate-400">Server Endpoint URL</label>
          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            className="w-full mt-1 bg-[#131b2e] border border-slate-700 focus:border-purple-500 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none"
            placeholder="https://api.openai.com/v1"
          />
        </div>

        <div>
          <label className="text-[10px] font-semibold text-slate-400">API Key (Stored locally)</label>
          <div className="relative mt-1">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-[#131b2e] border border-slate-700 focus:border-purple-500 rounded-xl px-2.5 py-1.5 pr-8 text-xs text-white outline-none"
              placeholder="sk-..."
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-2 top-2 text-slate-400 hover:text-white"
            >
              {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        <div>
          <label className="text-[10px] font-semibold text-slate-400">Model Name Identifier</label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="w-full mt-1 bg-[#131b2e] border border-slate-700 focus:border-purple-500 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none"
            placeholder="gpt-4o-mini or llama3.2"
          />
        </div>
      </div>

      {/* Diffusion Image Server */}
      <div className="p-3 rounded-2xl bg-[#0f1728] border border-slate-800 space-y-2">
        <h3 className="text-xs font-bold text-white">AI Image Generation Server</h3>
        <input
          type="text"
          value={imgEndpoint}
          onChange={(e) => setImgEndpoint(e.target.value)}
          className="w-full mt-1 bg-[#131b2e] border border-slate-700 focus:border-blue-500 rounded-xl px-2.5 py-1.5 text-xs text-white outline-none"
          placeholder="https://image.pollinations.ai/prompt"
        />
      </div>

      {/* Offline Default Switch */}
      <div className="p-3 rounded-2xl bg-[#0f1728] border border-slate-800 flex items-center justify-between text-xs">
        <div>
          <span className="font-bold text-white block">Default to Offline GGUF Mode</span>
          <span className="text-[10px] text-slate-400">Execute on-device llama.cpp inference by default</span>
        </div>
        <input
          type="checkbox"
          checked={isOffline}
          onChange={(e) => setIsOffline(e.target.checked)}
          className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
        />
      </div>

      {/* Temperature */}
      <div className="p-3 rounded-2xl bg-[#0f1728] border border-slate-800 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-white">Creativity Temperature: {temp.toFixed(2)}</span>
          <span className="text-[10px] text-cyan-400">{temp < 0.5 ? 'Deterministic' : 'Creative'}</span>
        </div>
        <input
          type="range"
          min="0"
          max="1.2"
          step="0.05"
          value={temp}
          onChange={(e) => setTemp(parseFloat(e.target.value))}
          className="w-full accent-purple-500"
        />
      </div>

      {/* System Prompt */}
      <div>
        <label className="text-[11px] font-bold text-slate-300">System Instruction Prompt</label>
        <textarea
          value={sysPrompt}
          onChange={(e) => setSysPrompt(e.target.value)}
          rows={3}
          className="w-full mt-1 bg-[#12192c] border border-slate-700 focus:border-purple-500 rounded-xl p-2.5 text-xs text-white outline-none resize-none"
        />
      </div>

      {/* Save Button */}
      <button
        onClick={handleSave}
        className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30 flex items-center justify-center gap-2 transition-all"
      >
        {saved ? <CheckCircle2 className="w-4 h-4 text-emerald-300" /> : <Save className="w-4 h-4" />}
        {saved ? 'Preferences Saved to DataStore!' : 'Save Settings'}
      </button>
    </div>
  );
};
