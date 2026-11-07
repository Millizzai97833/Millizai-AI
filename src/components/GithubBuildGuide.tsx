import React, { useState } from 'react';
import {
  GitBranch,
  Terminal,
  Download,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Workflow
} from 'lucide-react';
import { downloadAndroidProjectZip } from '../services/zipExporter';

export const GithubBuildGuide: React.FC = () => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isZipping, setIsZipping] = useState(false);

  const copyCommand = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleDownloadZip = async () => {
    setIsZipping(true);
    await downloadAndroidProjectZip();
    setIsZipping(false);
  };

  const gitPushScript = `# 1. Initialize git and add all files
git init
git add .
git commit -m "Initial commit of Millizai AI Android Project by Shahab Millizai"

# 2. Add remote for your repository
git remote add origin https://github.com/Millizzai97833/Millizai-AI.git
git branch -M main

# 3. Push to trigger automatic GitHub Actions APK build
git push -u origin main --force`;

  return (
    <div className="h-full overflow-y-auto custom-scrollbar p-6 space-y-6 text-slate-100 max-w-4xl mx-auto">
      {/* Title & Badge */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-950 text-purple-300 border border-purple-700">
              GitHub Actions CI/CD
            </span>
            <span className="text-xs text-cyan-400 font-mono">.github/workflows/android.yml</span>
          </div>
          <h1 className="text-2xl font-extrabold text-white mt-1">
            Build & Download APK via GitHub Actions
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Build an installable Millizai AI APK automatically on GitHub without needing Termux or a desktop computer.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isZipping}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center gap-2 transition-all shrink-0"
        >
          <Download className="w-4 h-4" />
          {isZipping ? 'Generating ZIP...' : 'Download Project (.ZIP)'}
        </button>
      </div>

      {/* Target Repository Info */}
      <div className="p-4 rounded-2xl bg-[#0f1728] border border-cyan-500/30 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <GitBranch className="w-5 h-5 text-cyan-400" />
          <div>
            <span className="text-[11px] text-slate-400 font-medium">Configured GitHub Repository:</span>
            <p className="text-sm font-bold text-white font-mono">
              https://github.com/Millizzai97833/Millizai-AI
            </p>
          </div>
        </div>
        <a
          href="https://github.com/Millizzai97833/Millizai-AI"
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
          title="Open Repository"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>

      {/* 3 Step Walkthrough */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Step 1 */}
        <div className="p-4 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-purple-900/40 border border-purple-500/40 text-purple-300 flex items-center justify-center font-bold text-sm">
            1
          </div>
          <h3 className="text-sm font-bold text-white">Push to GitHub</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Commit the generated files (including the Gradle wrapper and <code>android.yml</code>) to your main branch.
          </p>
        </div>

        {/* Step 2 */}
        <div className="p-4 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-blue-900/40 border border-blue-500/40 text-blue-300 flex items-center justify-center font-bold text-sm">
            2
          </div>
          <h3 className="text-sm font-bold text-white">Automatic Build</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            GitHub Actions provisions Java 17, sets up Android SDK 36, and runs <code>./gradlew assembleDebug</code>.
          </p>
        </div>

        {/* Step 3 */}
        <div className="p-4 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 flex items-center justify-center font-bold text-sm">
            3
          </div>
          <h3 className="text-sm font-bold text-white">Download APK</h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Click on the completed workflow run and download the <code>Millizai-AI-Debug-APK</code> artifact directly to your phone.
          </p>
        </div>
      </div>

      {/* One-Click Git Push Commands */}
      <div className="rounded-2xl bg-[#0a0f1c] border border-slate-800 overflow-hidden shadow-xl">
        <div className="px-4 py-3 bg-[#10172a] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-bold text-white">Terminal Commands to Push</span>
          </div>
          <button
            onClick={() => copyCommand(gitPushScript, 1)}
            className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            {copiedIndex === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedIndex === 1 ? 'Copied Commands' : 'Copy All Commands'}
          </button>
        </div>

        <pre className="p-4 text-xs font-mono text-cyan-300 leading-relaxed select-text overflow-x-auto custom-scrollbar bg-[#050811]">
          {gitPushScript}
        </pre>
      </div>

      {/* Workflow Features Summary */}
      <div className="p-4 rounded-2xl bg-[#0d1322] border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Workflow className="w-4 h-4 text-cyan-400" />
          Included CI/CD Workflow Features
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="flex items-start gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Push & Pull Request Trigger:</strong> Automatically builds on push to <code>main</code> or <code>master</code>.</span>
          </div>

          <div className="flex items-start gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Manual Dispatch:</strong> Trigger on-demand builds directly in GitHub UI with choice of debug or release.</span>
          </div>

          <div className="flex items-start gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Java 17 & SDK 36:</strong> Pre-configured with Gradle dependency caching for fast 2-minute builds.</span>
          </div>

          <div className="flex items-start gap-2 text-slate-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span><strong>Automated Artifact Upload:</strong> Generates downloadable ZIP with 30-day retention.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
