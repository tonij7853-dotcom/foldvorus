'use client';

import React from 'react';
import { Download, ExternalLink, HardDrive, CheckCircle2, ShieldCheck, Loader2 } from 'lucide-react';
import { DownloadTarget } from '@/lib/download/types';

interface DownloadButtonProps {
  target?: DownloadTarget | null;
  loading?: boolean;
  packId?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showMetadata?: boolean;
}

export const DownloadButton: React.FC<DownloadButtonProps> = ({
  target,
  loading = false,
  packId,
  className = '',
  size = 'md',
  showMetadata = false
}) => {
  if (loading) {
    return (
      <button
        disabled
        className={`inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 text-gray-300 font-bold opacity-60 cursor-not-allowed ${
          size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-4 text-base' : 'px-4 py-2.5 text-sm'
        } ${className}`}
      >
        <Loader2 className="w-4 h-4 animate-spin text-accent-400" />
        <span>Resolving...</span>
      </button>
    );
  }

  // Fast redirect URL route or direct destination
  const destinationUrl = packId 
    ? `/download/${encodeURIComponent(packId)}` 
    : (target?.resolvedUrl || target?.originalUrl || '#');

  // CASE A: Direct Official Download Available
  if (target?.canDirectDownload && target?.directDownloadUrl) {
    return (
      <div className="flex flex-col gap-1.5">
        <a
          href={target.directDownloadUrl}
          download={target.filename || true}
          className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold transition-all shadow-md shadow-emerald-600/20 group ${
            size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-4 text-base' : 'px-4 py-2.5 text-sm'
          } ${className}`}
        >
          <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          <span>Download</span>
        </a>
        {showMetadata && target.fileSize && (
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-accent-400" />
            {target.fileSize} • Direct Fast Download
          </span>
        )}
      </div>
    );
  }

  // CASE B: Official File Page Available (Patrins / Cloud / File Host)
  if (target && (target.resolvedUrl || target.sharePageUrl)) {
    const url = target.resolvedUrl || target.sharePageUrl || target.originalUrl;
    return (
      <div className="flex flex-col gap-1.5">
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-600 via-indigo-600 to-purple-600 hover:from-accent-500 hover:via-indigo-500 hover:to-purple-500 text-white font-bold transition-all shadow-md shadow-accent-600/20 group ${
            size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-4 text-base' : 'px-4 py-2.5 text-sm'
          } ${className}`}
        >
          <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          <span>Download</span>
          <ExternalLink className="w-3.5 h-3.5 text-gray-300 opacity-70 group-hover:opacity-100 transition-opacity" />
        </a>
        {showMetadata && (
          <span className="text-[10px] text-gray-400 flex items-center gap-1">
            {target.fileSize && <span>{target.fileSize} • </span>}
            <span>Hosted on {target.host || target.provider}</span>
          </span>
        )}
      </div>
    );
  }

  // CASE C: Unresolved / Source Link Fallback
  return (
    <a
      href={destinationUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold transition-all border border-white/10 ${
        size === 'sm' ? 'px-3 py-1.5 text-xs' : size === 'lg' ? 'px-6 py-4 text-base' : 'px-4 py-2.5 text-sm'
      } ${className}`}
    >
      <Download className="w-4 h-4 text-gray-300" />
      <span>Get Download</span>
    </a>
  );
};
