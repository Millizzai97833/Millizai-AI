import React, { useState } from 'react';
import { ANDROID_PROJECT_FILES, ProjectFile } from '../data/androidFiles';
import { FileCode, Copy, Check, Download, Folder } from 'lucide-react';
import { downloadAndroidProjectZip } from '../services/zipExporter';

export const SourceCodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<ProjectFile>(ANDROID_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    setDownloading(true);
    await downloadAndroidProjectZip();
    setDownloading(false);
  };

  return (
    <div className="h-full flex flex-col md:flex-row bg-[#080c14] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* File Tree Sidebar */}
      <div className="w-full md:w-72 bg-[#0c1220] border-r border-slate-800 p-3 flex flex-col shrink-0">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Folder className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-white">Project Structure</span>
          </div>
          <button
            onClick={handleDownloadZip}
            disabled={downloading}
            className="px-2 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[10px] font-bold flex items-center gap-1 shadow-sm transition-all"
          >
            <Download className="w-3 h-3" />
            {downloading ? 'Zipping...' : 'Download ZIP'}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar pt-2 space-y-1">
          {ANDROID_PROJECT_FILES.map((file) => (
            <button
              key={file.path}
              onClick={() => setSelectedFile(file)}
              className={`w-full text-left px-2.5 py-2 rounded-xl text-[11px] font-mono flex items-center gap-2 transition-all ${
                selectedFile.path === file.path
                  ? 'bg-purple-900/40 text-purple-200 border border-purple-500/50'
                  : 'text-slate-400 hover:bg-slate-850 hover:text-slate-200'
              }`}
            >
              <FileCode className={`w-3.5 h-3.5 shrink-0 ${
                file.category === 'kotlin' ? 'text-purple-400' :
                file.category === 'workflow' ? 'text-amber-400' :
                file.category === 'config' ? 'text-cyan-400' : 'text-emerald-400'
              }`} />
              <span className="truncate">{file.path}</span>
            </button>
          ))}
        </div>

        <div className="pt-2 text-[10px] text-slate-500 border-t border-slate-800">
          Total files: {ANDROID_PROJECT_FILES.length} • Kotlin + Gradle + Room
        </div>
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 flex flex-col bg-[#05070d] overflow-hidden">
        {/* Editor Top Bar */}
        <div className="px-4 py-2.5 bg-[#0a0f1d] border-b border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-slate-500 font-mono text-[11px]">File:</span>
            <span className="text-cyan-300 font-mono text-[11px] font-bold truncate">
              {selectedFile.path}
            </span>
          </div>

          <button
            onClick={handleCopy}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-semibold flex items-center gap-1.5 transition-colors shrink-0"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copied to Clipboard' : 'Copy Code'}
          </button>
        </div>

        {/* Code Block with Line Numbers */}
        <div className="flex-1 overflow-auto custom-scrollbar p-4 font-mono text-xs text-slate-300 select-text bg-[#03060c]">
          <pre className="whitespace-pre">{selectedFile.content}</pre>
        </div>
      </div>
    </div>
  );
};
