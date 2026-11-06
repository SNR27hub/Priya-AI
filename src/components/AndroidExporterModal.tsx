import React, { useState } from 'react';
import {
  ANDROID_FILES,
  GITHUB_WORKFLOW_FILE,
  GITHUB_PUSH_COMMANDS,
  CodeFileTemplate,
} from '../utils/androidCodeTemplates';
import {
  X,
  Copy,
  Check,
  Download,
  Github,
  Sparkles,
  Smartphone,
  CheckCircle2,
  ArrowRight,
  FileCode,
  Terminal,
  ExternalLink,
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

  const [activeTab, setActiveTab] = useState<'github_guide' | 'workflow' | 'source_files'>('github_guide');
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

  const handleDownloadAllBundle = () => {
    let bundle = `# ========================================================\n# Priya AI - Complete GitHub Auto-Release Repository Bundle\n# Creator: ${creatorName}\n# ========================================================\n\n`;
    ANDROID_FILES.forEach((f) => {
      bundle += `\n\n# --------------------------------------------------------\n# FILE: ${f.path}\n# DESC: ${f.description}\n# --------------------------------------------------------\n\n${f.content}\n`;
    });
    const blob = new Blob([bundle], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `priya-ai-github-auto-release-bundle.txt`;
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
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <span>GitHub 1-Click APK Auto-Release</span>
                <span className="text-[10px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  Zero Termux · 100% Cloud Auto-Build
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                GitHub cloud automatically compiles your code and releases <strong>PriyaAI-v1.0-release.apk</strong> directly!
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
            onClick={() => setActiveTab('github_guide')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'github_guide'
                ? 'border-emerald-500 text-emerald-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>1. GitHub Auto-Release Guide (Kaise Hoga)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('workflow')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'workflow'
                ? 'border-blue-500 text-blue-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Github className="w-3.5 h-3.5 text-blue-400" />
            <span>2. GitHub Workflow (.github/workflows/build-apk.yml)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('source_files')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'source_files'
                ? 'border-purple-500 text-purple-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-purple-400" />
            <span>3. Android Kotlin & Gradle Files ({ANDROID_FILES.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* TAB 1: GITHUB GUIDE */}
          {activeTab === 'github_guide' && (
            <div className="space-y-5">
              {/* How it works banner */}
              <div className="bg-gradient-to-r from-emerald-950/40 to-slate-900 border border-emerald-500/30 p-5 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>GitHub Khud APK Kaise Banakar Release Karega?</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Aapko phone ya computer par koi compiler, Termux ya heavy software chalane ki <strong>bilkul jarurat nahi hai</strong>!
                  Humne aapke project me GitHub Actions workflow file <code>.github/workflows/build-apk.yml</code> bana di hai.
                </p>

                {/* Flow Diagram */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">Step 1</span>
                    <div className="font-semibold text-xs text-white">GitHub Repo me Push</div>
                    <p className="text-[10px] text-slate-400">Ye code apne GitHub repository me daalein</p>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-emerald-400">Step 2 (Automatic)</span>
                    <div className="font-semibold text-xs text-emerald-300">GitHub Actions Compile</div>
                    <p className="text-[10px] text-slate-400">GitHub Cloud 1-2 minute me APK compile karke sign karega</p>
                  </div>

                  <div className="bg-slate-950/80 p-3 rounded-xl border border-emerald-500/40 text-center space-y-1">
                    <span className="text-[10px] uppercase font-bold text-rose-400">Step 3 (Ready!)</span>
                    <div className="font-semibold text-xs text-rose-300">Direct Download APK</div>
                    <p className="text-[10px] text-slate-400">GitHub Releases page par direct download link mil jayegi</p>
                  </div>
                </div>
              </div>

              {/* Step-by-Step Instructions */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-emerald-400" />
                    <span>GitHub me Push Karne ke 1-Click Commands:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopy(GITHUB_PUSH_COMMANDS, 'push_commands')}
                    className="flex items-center gap-1 text-xs text-emerald-300 hover:text-white bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 px-3 py-1 rounded-xl transition-all"
                  >
                    {copiedKey === 'push_commands' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'push_commands' ? 'Copied Commands!' : 'Copy Commands'}</span>
                  </button>
                </div>

                <pre className="text-[11px] font-mono bg-slate-900 text-emerald-300 p-4 rounded-xl overflow-x-auto max-h-56 whitespace-pre-wrap border border-slate-800">
                  {GITHUB_PUSH_COMMANDS}
                </pre>
              </div>

              {/* Where to download APK */}
              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-rose-400" />
                  <span>GitHub se APK kahan se download hoga?</span>
                </h4>
                <p className="text-xs text-slate-300">
                  Jaise hi aap push karenge:
                </p>
                <ul className="list-disc list-inside text-xs text-slate-400 space-y-1 pl-1">
                  <li>Apne GitHub repo me <strong>"Releases"</strong> tab par jayein. Wahan <code>PriyaAI-v1.0-release.apk</code> direct mil jayega!</li>
                  <li>Ya repo me <strong>"Actions"</strong> tab par jayein &rarr; Latest build par click karein &rarr; <strong>"PriyaAI-APK"</strong> artifact download karein.</li>
                </ul>
              </div>

              {/* Download Bundle Button */}
              <div className="flex items-center justify-between p-4 bg-slate-950/90 rounded-2xl border border-slate-800">
                <div>
                  <div className="text-xs font-semibold text-white">Full Android & GitHub Project Bundle</div>
                  <div className="text-[11px] text-slate-400">Download all files ready to upload to GitHub</div>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadAllBundle}
                  className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-rose-950/40 transition-all active:scale-95"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Repository Files</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: GITHUB ACTIONS WORKFLOW */}
          {activeTab === 'workflow' && (
            <div className="space-y-4">
              <div className="bg-blue-950/20 border border-blue-500/30 p-4 rounded-2xl text-xs text-slate-300 space-y-2">
                <h4 className="font-semibold text-blue-400 flex items-center gap-2">
                  <Github className="w-4 h-4" /> Ye Workflow GitHub Actions ko Direct APK Banane Ko Bolta Hai:
                </h4>
                <p className="leading-relaxed">
                  Is workflow file me Android SDK 34, JDK 17, auto keystore signing aur official GitHub Release creation set hai.
                  Ye file aapke project ke andar <code>.github/workflows/build-apk.yml</code> par already created hai!
                </p>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-blue-400">.github/workflows/build-apk.yml</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(GITHUB_WORKFLOW_FILE.content, 'workflow_code')}
                    className="flex items-center gap-1 text-xs text-blue-300 hover:text-white bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 px-3 py-1 rounded-xl transition-all"
                  >
                    {copiedKey === 'workflow_code' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'workflow_code' ? 'Copied YAML!' : 'Copy Workflow File'}</span>
                  </button>
                </div>
                <pre className="text-[11px] font-mono bg-slate-900 text-slate-200 p-4 rounded-xl overflow-x-auto max-h-[380px] whitespace-pre-wrap border border-slate-800">
                  {GITHUB_WORKFLOW_FILE.content}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: SOURCE CODE FILES */}
          {activeTab === 'source_files' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1.5 md:col-span-1">
                <div className="text-xs font-medium text-slate-400 mb-2">Project Files:</div>
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
                  onClick={handleDownloadAllBundle}
                  className="w-full mt-3 flex items-center justify-center gap-2 p-2.5 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-950/50 transition-all"
                >
                  <Download className="w-4 h-4" />
                  <span>Download All Files Bundle</span>
                </button>
              </div>

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
            Nirmata: <strong className="text-white">{creatorName}</strong> · Direct GitHub APK Auto-Release
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
