import React from 'react';
import { GgufModel } from '../../types';
import { ArrowLeft, HardDrive, Download, Check, ShieldCheck, Cpu } from 'lucide-react';

interface Props {
  models: GgufModel[];
  onDownload: (model: GgufModel) => void;
  onBack: () => void;
}

export const ModelLibraryView: React.FC<Props> = ({ models, onDownload, onBack }) => {
  return (
    <div className="h-full flex flex-col bg-[#080c14] text-slate-100 overflow-y-auto custom-scrollbar p-3 space-y-3.5">
      {/* Top Bar */}
      <div className="flex items-center gap-2 pb-1 border-b border-slate-800">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xs font-bold text-white">AI Model Library</h2>
          <p className="text-[10px] text-cyan-400">Curated Mobile GGUF & Diffusion Models</p>
        </div>
      </div>

      {/* Info Notice */}
      <div className="p-3 rounded-2xl bg-[#12192c] border border-purple-500/30 flex items-start gap-2.5">
        <Cpu className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
        <div className="text-[11px] text-slate-300 space-y-1">
          <p className="font-semibold text-white">100% Offline Private Execution</p>
          <p className="text-[10px] text-slate-400 leading-normal">
            Models download directly into your Android device sandbox. No conversation data, prompts, or generated tokens ever leave your phone.
          </p>
        </div>
      </div>

      {/* Models List */}
      <div className="space-y-2.5">
        {models.map((m) => (
          <div
            key={m.id}
            className="p-3 rounded-2xl bg-[#0e1424] border border-slate-800 hover:border-slate-700 space-y-2 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-xs font-bold text-white">{m.name}</h3>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">
                    {m.quantization}
                  </span>
                </div>
                <span className="text-[10px] text-cyan-400 font-medium">{m.family} • {m.parameterSize}</span>
              </div>

              <span className="text-xs font-bold text-slate-200">{m.sizeDisplay}</span>
            </div>

            <p className="text-[11px] text-slate-400 leading-relaxed">{m.description}</p>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-[10px]">
              <div className="text-slate-500">
                <span>RAM required: </span>
                <span className="text-slate-300 font-semibold">~{m.ramRequiredMb} MB</span>
              </div>

              {m.isDownloaded ? (
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 font-bold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Installed
                </span>
              ) : (
                <button
                  onClick={() => onDownload(m)}
                  className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center gap-1 shadow-sm"
                >
                  <Download className="w-3 h-3" /> Download
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
