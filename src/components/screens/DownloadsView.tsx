import React, { useState } from 'react';
import { GgufModel } from '../../types';
import {
  ArrowLeft,
  Download,
  FolderOpen,
  Trash2,
  CheckCircle,
  HardDrive,
  Cpu,
  Plus
} from 'lucide-react';

interface Props {
  models: GgufModel[];
  onSelectModel: (id: string) => void;
  onImportCustom: (customModel: GgufModel) => void;
  onDeleteModel: (id: string) => void;
  onBack: () => void;
}

export const DownloadsView: React.FC<Props> = ({
  models,
  onSelectModel,
  onImportCustom,
  onDeleteModel,
  onBack
}) => {
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const downloadedModels = models.filter((m) => m.isDownloaded);

  const handleSimulateDownload = (m: GgufModel) => {
    setDownloadingId(m.id);
    setProgress(10);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloadingId(null);
          m.isDownloaded = true;
          onSelectModel(m.id);
          return 100;
        }
        return prev + 15;
      });
    }, 400);
  };

  const handleImportFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.gguf,.bin';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const custom: GgufModel = {
          id: `custom-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          family: 'Custom GGUF',
          fileName: file.name,
          sizeBytes: file.size || 800000000,
          sizeDisplay: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          ramRequiredMb: Math.round((file.size / (1024 * 1024)) * 1.3),
          quantization: 'Imported Q4',
          parameterSize: 'Custom',
          description: 'Imported from local Android device storage via Storage Access Framework (SAF).',
          isDownloaded: true,
          isSelected: true,
          downloadUrl: '',
          contextLength: 2048
        };
        onImportCustom(custom);
        alert(`Successfully imported: ${file.name}`);
      }
    };
    input.click();
  };

  return (
    <div className="h-full flex flex-col bg-[#080c14] text-slate-100 overflow-y-auto custom-scrollbar p-3 space-y-3.5">
      {/* Top Bar */}
      <div className="flex items-center gap-2 pb-1 border-b border-slate-800">
        <button onClick={onBack} className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-300">
          <ArrowLeft className="w-4 h-4" />
        </button>
        <div>
          <h2 className="text-xs font-bold text-white">Model Downloads & SAF</h2>
          <p className="text-[10px] text-cyan-400">GGUF File Management & Storage</p>
        </div>
      </div>

      {/* Storage Gauge Card */}
      <div className="p-3.5 rounded-2xl bg-[#0f1728] border border-slate-800 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white">Internal Device Storage</span>
          </div>
          <span className="text-[11px] text-slate-400">24.6 GB Available</span>
        </div>

        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 w-1/4" />
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400">
          <span>Used by Millizai: 1.2 GB</span>
          <span>Max Model Space: 18 GB</span>
        </div>
      </div>

      {/* Import .gguf from storage button */}
      <button
        onClick={handleImportFile}
        className="w-full py-2.5 rounded-xl bg-[#131b2e] border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-sm"
      >
        <FolderOpen className="w-4 h-4" />
        Import .GGUF File from Device Storage
      </button>

      {/* Installed Models List */}
      <div className="space-y-2 pt-1">
        <h3 className="text-xs font-bold text-slate-300">
          Installed Models ({downloadedModels.length})
        </h3>

        {downloadedModels.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 border border-dashed border-slate-800 rounded-2xl">
            No GGUF models installed yet. Go to Model Library or import a .gguf file.
          </div>
        ) : (
          downloadedModels.map((m) => (
            <div
              key={m.id}
              onClick={() => onSelectModel(m.id)}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                m.isSelected
                  ? 'bg-purple-950/40 border-purple-500/60 shadow-md shadow-purple-950/30'
                  : 'bg-[#0f1728] border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      m.isSelected ? 'border-cyan-400 bg-cyan-400' : 'border-slate-600'
                    }`}
                  >
                    {m.isSelected && <div className="w-1.5 h-1.5 rounded-full bg-black" />}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                      {m.name}
                      {m.isSelected && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-normal">
                          Active Model
                        </span>
                      )}
                    </h4>
                    <span className="text-[10px] text-slate-400">
                      {m.sizeDisplay} • {m.quantization} • Context: {m.contextLength}
                    </span>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm(`Delete ${m.name} to free storage?`)) {
                      onDeleteModel(m.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  title="Delete Model"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Available to Download queue */}
      <div className="space-y-2 pt-2">
        <h3 className="text-xs font-bold text-slate-300">Available to Download</h3>
        {models
          .filter((m) => !m.isDownloaded)
          .map((m) => (
            <div
              key={m.id}
              className="p-3 rounded-2xl bg-[#0f1728] border border-slate-800 flex items-center justify-between text-xs"
            >
              <div>
                <h4 className="font-semibold text-white">{m.name}</h4>
                <p className="text-[10px] text-slate-400">{m.sizeDisplay} • ~{m.ramRequiredMb} MB RAM</p>
                {downloadingId === m.id && (
                  <div className="w-36 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
                    <div
                      className="h-full bg-cyan-400 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                )}
              </div>

              {downloadingId === m.id ? (
                <span className="text-[10px] text-cyan-400 font-mono">{progress}%</span>
              ) : (
                <button
                  onClick={() => handleSimulateDownload(m)}
                  className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-purple-900/50 text-slate-300 hover:text-white border border-slate-700 text-[10px] font-bold flex items-center gap-1"
                >
                  <Download className="w-3 h-3" /> Get
                </button>
              )}
            </div>
          ))}
      </div>
    </div>
  );
};
