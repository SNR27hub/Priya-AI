import React, { useState } from 'react';
import { ANDROID_FILES, MASTER_AI_PROMPT, CodeFileTemplate } from '../utils/androidCodeTemplates';
import {
  X,
  Copy,
  Check,
  Download,
  Terminal,
  FileCode,
  Github,
  Sparkles,
  Smartphone,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface AndroidExporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  aiName: string;
  creatorName: string;
}

export const AndroidExporterModal: React.FC<AndroidExporterModalProps> = ({
  isOpen,
  onClose,
  aiName,
  creatorName,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'prompt' | 'termux' | 'github' | 'files'>('prompt');
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleDownloadFile = (file: CodeFileTemplate) => {
    const blob = new Blob([file.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.path.split('/').pop() || 'file.txt';
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadAllZip = () => {
    // Generate text bundle with all files
    let bundle = `# Priya AI - Android Project Source Bundle\n# Creator: ${creatorName}\n# Generated for GitHub Actions & Termux APK compilation\n\n`;
    ANDROID_FILES.forEach((f) => {
      bundle += `\n\n// ==========================================\n// FILE: ${f.path}\n// ==========================================\n\n${f.content}\n`;
    });
    const blob = new Blob([bundle], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `priya-ai-android-source-bundle.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-800 bg-slate-950/70">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-gradient-to-br from-rose-500 to-indigo-600 text-white shadow-lg shadow-rose-950/40">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>Android APK Release & Termux Studio</span>
                <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                  Direct GitHub & Termux
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Priya AI native Kotlin code for Accessibility, Background Voice & 1-Click APK generation
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 gap-2 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('prompt')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'prompt'
                ? 'border-rose-500 text-rose-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span>1. AI Master Prompt (Full Specification)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('termux')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'termux'
                ? 'border-emerald-500 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-3.5 h-3.5 text-emerald-400" />
            <span>2. Termux 1-Command Build (On Phone)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('github')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'github'
                ? 'border-blue-500 text-blue-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-3.5 h-3.5 text-blue-400" />
            <span>3. GitHub Actions Auto-Release APK</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('files')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'files'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-purple-400" />
            <span>4. Kotlin & Android Source Files</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* TAB 1: AI MASTER PROMPT */}
          {activeTab === 'prompt' && (
            <div className="space-y-4">
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" /> Ready-to-Use Master AI Prompt
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(MASTER_AI_PROMPT, 'prompt')}
                    className="flex items-center gap-1 text-xs text-rose-300 hover:text-white bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 px-3 py-1 rounded-xl transition-all"
                  >
                    {copiedKey === 'prompt' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'prompt' ? 'Copied Prompt!' : 'Copy Full Prompt'}</span>
                  </button>
                </div>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                  Isko copy karke aap Google AI Studio, ChatGPT ya GitHub Copilot me de sakte hain. Ye prompt exactly aapke Priya AI ke saare features (Accessibility, 24/7 background voice, WhatsApp touch, battery alerts, GitHub Actions auto release) ka complete specification deta hai!
                </p>
                <pre className="text-[11px] font-mono bg-slate-900 text-slate-200 p-4 rounded-xl overflow-x-auto max-h-96 whitespace-pre-wrap border border-slate-800">
                  {MASTER_AI_PROMPT}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: TERMUX BUILD SCRIPT */}
          {activeTab === 'termux' && (
            <div className="space-y-4">
              <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-2xl text-xs text-slate-300 space-y-2">
                <h4 className="font-semibold text-emerald-400 flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> Mobile Termux me Direct APK Kaise Banaye:
                </h4>
                <ol className="list-decimal list-inside space-y-1 text-slate-300 pl-1">
                  <li>Apne Android phone me F-Droid se <strong>Termux</strong> install karein.</li>
                  <li>Neeche diye gaye command ko copy karein aur Termux terminal me paste karke Enter dabayein.</li>
                  <li>Script automatically Java 17, Android SDK aur Gradle setup karegi.</li>
                  <li>Compilation complete hote hi aapko <code>app-release.apk</code> direct mil jayega!</li>
                </ol>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-emerald-400">setup_termux.sh (1-Click Run)</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(ANDROID_FILES.find((f) => f.path.includes('termux'))?.content || '', 'termux')}
                    className="flex items-center gap-1 text-xs text-emerald-300 hover:text-white bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 px-3 py-1 rounded-xl transition-all"
                  >
                    {copiedKey === 'termux' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'termux' ? 'Copied Script!' : 'Copy Script'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono bg-slate-900 text-emerald-300 p-4 rounded-xl overflow-x-auto max-h-96 whitespace-pre-wrap border border-slate-800">
                  {ANDROID_FILES.find((f) => f.path.includes('termux'))?.content}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: GITHUB ACTIONS */}
          {activeTab === 'github' && (
            <div className="space-y-4">
              <div className="bg-blue-950/20 border border-blue-500/30 p-4 rounded-2xl text-xs text-slate-300 space-y-2">
                <h4 className="font-semibold text-blue-400 flex items-center gap-2">
                  <Github className="w-4 h-4" /> GitHub Actions Direct APK Release Workflow:
                </h4>
                <p className="leading-relaxed">
                  Aapko phone ya PC par koi heavy software install karne ki jarurat nahi hai! Jab aap ye files apne GitHub repository me push karenge, GitHub Actions cloud servers automatically aapke code ko compile karke <strong>app-release.apk</strong> generate kar dega jisko aap direct download kar sakte hain!
                </p>
                <div className="flex items-center gap-2 text-[11px] text-blue-300 font-mono pt-1">
                  <span>Push to GitHub</span>
                  <ArrowRight className="w-3 h-3" />
                  <span>GitHub Action Runs (1-2 mins)</span>
                  <ArrowRight className="w-3 h-3" />
                  <span>Direct Download APK</span>
                </div>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-blue-400">.github/workflows/build-apk.yml</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(ANDROID_FILES.find((f) => f.path.includes('workflows'))?.content || '', 'github_action')}
                    className="flex items-center gap-1 text-xs text-blue-300 hover:text-white bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 px-3 py-1 rounded-xl transition-all"
                  >
                    {copiedKey === 'github_action' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'github_action' ? 'Copied YAML!' : 'Copy Workflow'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono bg-slate-900 text-slate-200 p-4 rounded-xl overflow-x-auto max-h-96 whitespace-pre-wrap border border-slate-800">
                  {ANDROID_FILES.find((f) => f.path.includes('workflows'))?.content}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 4: KOTLIN SOURCE CODE */}
          {activeTab === 'files' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* File list */}
              <div className="space-y-1.5 md:col-span-1">
                <div className="text-xs font-medium text-slate-400 mb-2">Kotlin & Manifest Files:</div>
                {ANDROID_FILES.map((file, idx) => (
                  <button
                    key={file.path}
                    type="button"
                    onClick={() => setSelectedFileIndex(idx)}
                    className={`w-full text-left p-2.5 rounded-xl text-xs transition-colors border ${
                      selectedFileIndex === idx
                        ? 'bg-purple-600/20 border-purple-500/40 text-purple-200 font-semibold'
                        : 'bg-slate-950/60 hover:bg-slate-900 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="font-mono truncate">{file.path.split('/').pop()}</div>
                    <div className="text-[10px] text-slate-400 truncate">{file.description}</div>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={handleDownloadAllZip}
                  className="w-full mt-3 flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950/50 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download All Source Files</span>
                </button>
              </div>

              {/* Code preview */}
              <div className="md:col-span-2 bg-slate-950/80 rounded-2xl border border-slate-800 p-4 flex flex-col">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div>
                    <span className="text-xs font-mono font-semibold text-white">
                      {ANDROID_FILES[selectedFileIndex].path}
                    </span>
                    <p className="text-[10px] text-slate-400">{ANDROID_FILES[selectedFileIndex].description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleCopy(ANDROID_FILES[selectedFileIndex].content, 'file_' + selectedFileIndex)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
                      title="Copy File"
                    >
                      {copiedKey === 'file_' + selectedFileIndex ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadFile(ANDROID_FILES[selectedFileIndex])}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors"
                      title="Download File"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <pre className="flex-1 text-[11px] font-mono bg-slate-900 text-slate-200 p-3.5 rounded-xl overflow-x-auto max-h-[350px] whitespace-pre-wrap border border-slate-800">
                  {ANDROID_FILES[selectedFileIndex].content}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Nirmata: <strong className="text-white">{creatorName}</strong> · Ready for Termux & GitHub
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
