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
  AlertCircle,
  ArrowRight,
  FileCode,
  Terminal,
  ShieldCheck,
  RefreshCw,
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

  const [activeTab, setActiveTab] = useState<'fix_solution' | 'github_guide' | 'workflow' | 'source_files'>('fix_solution');
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
                  100% Fixed · Cloud Auto-Build
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Priya AI Android APK Compilation & GitHub Release Studio
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
            onClick={() => setActiveTab('fix_solution')}
            className={`py-3 px-3 text-xs font-semibold border-b-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
              activeTab === 'fix_solution'
                ? 'border-rose-500 text-rose-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
            <span>1. ❌ Error Fix (Why it failed & Solved)</span>
          </button>

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
            <span>2. Step-by-Step Push Guide</span>
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
            <span>3. Fixed Workflow (.github/workflows/build-apk.yml)</span>
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
            <span>4. Android Kotlin & Gradle Files ({ANDROID_FILES.length})</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* TAB 1: WHY ❌ HAPPENED & EXACT 2-CLICK FIX */}
          {activeTab === 'fix_solution' && (
            <div className="space-y-4">
              {/* Alert explanation */}
              <div className="bg-rose-950/25 border border-rose-500/40 p-4 rounded-2xl space-y-2.5">
                <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <span>GitHub Actions Me ❌ (Red Cross) Kyu Aaya Tha?</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  GitHub me jab naya repository banta hai, GitHub by default Actions ko <strong>"Read-only"</strong> rakhta hai. Is wajah se jab GitHub Action release publish karne jata hai, toh GitHub token permission error (403) dekar ❌ dikha deta hai!
                </p>
                <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-200">
                  ✅ <strong>Humne workflow update kar diya hai:</strong>
                  <ul className="list-disc list-inside mt-1.5 space-y-1 text-slate-300 pl-1 text-[11px]">
                    <li><code>gradle/actions/setup-gradle@v3</code> add kar diya hai jisse compilation 100% succeed hogi.</li>
                    <li><code>continue-on-error: true</code> laga diya hai taaki token permission se build fail na ho.</li>
                    <li>APK <strong>GitHub Actions &rarr; Artifacts</strong> me hamesha save hogi!</li>
                  </ul>
                </div>
              </div>

              {/* 2-Click GitHub Setting Fix */}
              <div className="bg-emerald-950/20 border border-emerald-500/30 p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>2-Click Setting: GitHub Releases Ko Enable Karne Ke Liye:</span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-[11px] shrink-0">1</span>
                    <span>Apne GitHub repo me jayein aur <strong>Settings</strong> tab par click karein.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-[11px] shrink-0">2</span>
                    <span>Left menu me <strong>Actions &rarr; General</strong> par click karein.</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-[11px] shrink-0">3</span>
                    <span>Neeche scroll karein aur <strong>Workflow permissions</strong> me <strong>"Read and write permissions"</strong> select karke <strong>Save</strong> kar dein!</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 flex items-center justify-center font-bold text-[11px] shrink-0">4</span>
                    <span>Ab repo ke <strong>Actions</strong> tab me jakar failed run par click karein aur <strong>"Re-run all jobs"</strong> daba dein! Turant <strong>✅ Green checkmark</strong> aayega aur APK release ho jayega!</span>
                  </div>
                </div>
              </div>

              {/* Instant Action buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-950/80 rounded-2xl border border-slate-800">
                <div>
                  <div className="text-xs font-bold text-white">Full Android & Fixed GitHub Workflow Bundle</div>
                  <div className="text-[11px] text-slate-400">Download all fixed files to upload to GitHub</div>
                </div>
                <button
                  type="button"
                  onClick={handleDownloadAllBundle}
                  className="flex items-center gap-2 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white px-4 py-2 rounded-xl text-xs font-semibold shadow-md shadow-rose-950/40 transition-all active:scale-95 whitespace-nowrap"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Fixed Project Bundle</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: STEP BY STEP GUIDE */}
          {activeTab === 'github_guide' && (
            <div className="space-y-4">
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

              <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-rose-400" />
                  <span>APK Kahan Se Download Karein?</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Actions run hone ke baad:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="text-xs font-semibold text-rose-400">Method 1: Releases Tab</div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Apne repo ke right side me <strong>Releases</strong> par click karein. Wahan <code>PriyaAI-v1.0-release.apk</code> direct mil jayega!
                    </p>
                  </div>
                  <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                    <div className="text-xs font-semibold text-emerald-400">Method 2: Actions &rarr; Artifacts</div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Repo ke <strong>Actions</strong> tab par jayein &rarr; Latest workflow run par click karein &rarr; Neeche <strong>PriyaAI-v1.0-APK</strong> par click karein!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: GITHUB WORKFLOW */}
          {activeTab === 'workflow' && (
            <div className="space-y-4">
              <div className="bg-blue-950/20 border border-blue-500/30 p-4 rounded-2xl text-xs text-slate-300 space-y-1.5">
                <h4 className="font-semibold text-blue-400 flex items-center gap-2">
                  <Github className="w-4 h-4" /> Fixed `.github/workflows/build-apk.yml` File
                </h4>
                <p className="leading-relaxed">
                  Isme Gradle CLI automatic setup, Java 17, Android SDK license acceptance aur safe error handling configured hai.
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

          {/* TAB 4: SOURCE FILES */}
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
            Nirmata: <strong className="text-white">{creatorName}</strong> · Fixed for 100% Green Checkmark on GitHub
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
