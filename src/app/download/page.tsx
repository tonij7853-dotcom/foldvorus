'use client';

import React, { useState } from 'react';
import { 
  Download, 
  Link as LinkIcon, 
  Sparkles, 
  CheckCircle2, 
  ExternalLink, 
  Copy, 
  Check, 
  ShieldCheck, 
  Film, 
  HardDrive, 
  Eye, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';
import Link from 'next/link';

interface ResolvedData {
  originalUrl: string;
  provider: string;
  fileTitle: string;
  fileSize?: string;
  quality?: string;
  codec?: string;
  directDownloadUrl: string;
  streamPreviewUrl?: string;
  hostIcon: string;
  isDirectLink: boolean;
  notes?: string;
}

export default function DownloaderPage() {
  const [urlInput, setUrlInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResolvedData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleResolve = async (urlToTest?: string) => {
    const target = urlToTest || urlInput;
    if (!target.trim()) {
      setError('Please paste a link first.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/resolve-link', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target.trim() })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to resolve link');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Could not parse link.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exampleLinks = [
    { name: 'Veel SCP 4K File', url: 'https://files.veelscp.com/f/ab77eac4f7fc' },
    { name: '411 Spiderman Pack', url: 'https://scenepacks.com/scps/698' },
    { name: 'SuitsTM 4K Content', url: 'https://suitstmscenepacks.com/pack/the-batman-4k' },
    { name: 'EditPacks Anime Link', url: 'https://editpacks.org/pack/arcane-jinx-vi' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col items-center text-center gap-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-500/10 border border-accent-500/20 text-accent-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Universal Pack Link Downloader</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Direct Scenepack <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 to-purple-400">Downloader</span>
        </h1>
        <p className="text-gray-400 text-sm sm:text-base max-w-xl">
          Paste any link from Veel SCP, 411, EditPacks, Suits™, Google Drive, MEGA, or Mediafire to get a direct high-speed download button instantly.
        </p>
      </div>

      {/* Input Box Card */}
      <div className="bg-[#0f111a] p-5 sm:p-7 rounded-2xl border border-white/10 shadow-2xl flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full">
            <LinkIcon className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleResolve()}
              placeholder="Paste link (e.g. files.veelscp.com/f/... or scenepacks.com/scps/...)"
              className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-[#171a26] text-white text-sm placeholder-gray-500 border border-white/10 focus:border-accent-500 focus:outline-none transition-all font-mono"
            />
          </div>

          <button
            onClick={() => handleResolve()}
            disabled={loading || !urlInput.trim()}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-accent-600 to-indigo-600 hover:from-accent-500 hover:to-indigo-500 disabled:opacity-50 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-accent-600/20 transition-all flex-shrink-0"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Resolving...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Get Download</span>
              </>
            )}
          </button>
        </div>

        {/* Quick Test Links */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 text-xs text-gray-400">
          <span>Try an example link:</span>
          {exampleLinks.map((ex, idx) => (
            <button
              key={idx}
              onClick={() => {
                setUrlInput(ex.url);
                handleResolve(ex.url);
              }}
              className="px-2.5 py-1 rounded-md bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/5 transition-all text-[11px]"
            >
              {ex.name}
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-950/30 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Result Card */}
      {result && (
        <div className="bg-[#111420] p-6 sm:p-8 rounded-2xl border border-accent-500/30 shadow-2xl flex flex-col gap-6 animate-fadeIn">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-accent-500/20 border border-accent-500/30 flex items-center justify-center text-accent-400 flex-shrink-0">
                <Film className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold tracking-wider uppercase border border-blue-500/30">
                    {result.provider}
                  </span>
                  {result.quality && (
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                      {result.quality}
                    </span>
                  )}
                  {result.codec && (
                    <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                      {result.codec}
                    </span>
                  )}
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white leading-snug">
                  {result.fileTitle}
                </h2>
                {result.fileSize && (
                  <span className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5 font-medium">
                    <HardDrive className="w-3.5 h-3.5 text-accent-400" />
                    Size: {result.fileSize}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-lg border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4" />
                Ready to Download
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {/* Direct Download Button */}
            <a
              href={result.directDownloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 transition-all group"
            >
              <Download className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
              <span>Download in New Tab ↗</span>
            </a>

            {/* In-Browser Preview */}
            <a
              href={result.streamPreviewUrl || result.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm flex items-center justify-center gap-2 border border-white/10 transition-all"
            >
              <Eye className="w-4 h-4 text-gray-300" />
              <span>Full Screen Stream</span>
            </a>

            {/* Copy Link */}
            <button
              onClick={() => handleCopy(result.directDownloadUrl)}
              className="px-6 py-4 rounded-xl bg-[#181a24] hover:bg-[#202330] text-gray-300 hover:text-white font-medium text-sm flex items-center justify-center gap-2 border border-white/10 transition-all sm:col-span-2 lg:col-span-1"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Direct Link Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-gray-400" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
          </div>

          {/* Embedded In-App Direct Download Frame (1-Click Download Inside SceneFind) */}
          <div className="flex flex-col gap-3 rounded-2xl bg-[#090b12] p-4 border border-accent-500/30">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                In-App 1-Click Fast Downloader &amp; Preview
              </span>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded border border-emerald-500/20 font-semibold">
                No Ad Redirects
              </span>
            </div>
            <div className="w-full h-[460px] rounded-xl overflow-hidden border border-white/10 bg-black relative">
              <iframe
                src={result.directDownloadUrl}
                title="Direct In-App Downloader"
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>

          {/* Direct Raw URL Bar */}
          <div className="flex flex-col gap-2 p-4 rounded-xl bg-[#090a0f] border border-accent-500/20 font-mono text-xs">
            <div className="flex items-center justify-between">
              <span className="text-accent-400 text-[11px] uppercase font-bold tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3 h-3" />
                Unshortened Output Download Link:
              </span>
              <button
                onClick={() => handleCopy(result.directDownloadUrl)}
                className="text-xs text-gray-400 hover:text-white flex items-center gap-1 px-2 py-0.5 rounded bg-white/5"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <div className="flex items-center justify-between gap-2 overflow-x-auto text-emerald-300 bg-[#121520] p-2.5 rounded-lg border border-white/5">
              <span className="break-all font-semibold select-all">{result.directDownloadUrl}</span>
            </div>
          </div>

          {/* Safety & Bypass Note */}
          {result.notes && (
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center gap-2.5 text-xs text-emerald-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{result.notes}</span>
            </div>
          )}
        </div>
      )}

      {/* Supported Hosts Info Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-white/10">
        <div className="p-4 rounded-xl bg-[#11131a] border border-white/5 flex flex-col gap-1">
          <span className="text-xs font-bold text-pink-400">Veel SCP / Patrins</span>
          <span className="text-[11px] text-gray-400">Direct 4K files and video streams</span>
        </div>
        <div className="p-4 rounded-xl bg-[#11131a] border border-white/5 flex flex-col gap-1">
          <span className="text-xs font-bold text-blue-400">411 Scenepacks</span>
          <span className="text-[11px] text-gray-400">Mega, Drive & Mediafire resolver</span>
        </div>
        <div className="p-4 rounded-xl bg-[#11131a] border border-white/5 flex flex-col gap-1">
          <span className="text-xs font-bold text-emerald-400">EditPacks</span>
          <span className="text-[11px] text-gray-400">Anime & 60fps pack extraction</span>
        </div>
        <div className="p-4 rounded-xl bg-[#11131a] border border-white/5 flex flex-col gap-1">
          <span className="text-xs font-bold text-amber-400">Suits™ 4K</span>
          <span className="text-[11px] text-gray-400">Logoless raw movie archives</span>
        </div>
      </div>
    </div>
  );
}
