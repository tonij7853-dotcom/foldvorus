'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Loader2, Download, ExternalLink, ShieldCheck, Film, HardDrive } from 'lucide-react';
import { DownloadTarget } from '@/lib/download/types';

export default function FastDownloadRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const packId = params?.packId as string;

  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState<DownloadTarget | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!packId) return;

    let isMounted = true;

    fetch(`/api/resolve-download?packId=${encodeURIComponent(packId)}`)
      .then((res) => res.json())
      .then((data: DownloadTarget) => {
        if (!isMounted) return;
        setTarget(data);
        setLoading(false);

        // Immediate fast redirect if resolved URL is available
        const destination = data.resolvedUrl || data.sharePageUrl || data.originalUrl;
        if (destination && destination !== '#') {
          // Trigger instant redirect
          window.location.href = destination;
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        console.error('Redirect resolve error:', err);
        setError(err.message || 'Failed to prepare download.');
        setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [packId, router]);

  const destination = target?.resolvedUrl || target?.sharePageUrl || target?.originalUrl;

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="w-full max-w-md bg-[#0f111a] p-8 rounded-2xl border border-white/10 shadow-2xl flex flex-col items-center gap-6">
        {loading ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-accent-500/20 border border-accent-500/30 flex items-center justify-center text-accent-400">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h1 className="text-xl font-bold text-white">Preparing download...</h1>
              <p className="text-xs text-gray-400">Connecting to authorized file provider</p>
            </div>
          </>
        ) : error ? (
          <>
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <Film className="w-8 h-8" />
            </div>
            <div className="flex flex-col gap-1.5">
              <h1 className="text-xl font-bold text-white">Could not prepare download</h1>
              <p className="text-xs text-red-300">{error}</p>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Download className="w-8 h-8 animate-bounce" />
            </div>
            <div className="flex flex-col gap-2">
              <h1 className="text-xl font-bold text-white">Redirecting to file page...</h1>
              {target?.filename && (
                <span className="text-xs font-semibold text-gray-300 bg-white/5 px-3 py-1 rounded-lg">
                  {target.filename}
                </span>
              )}
              {target?.fileSize && (
                <span className="text-[11px] text-gray-400 flex items-center justify-center gap-1">
                  <HardDrive className="w-3.5 h-3.5 text-accent-400" />
                  Size: {target.fileSize}
                </span>
              )}
            </div>

            {destination && (
              <a
                href={destination}
                className="w-full py-3.5 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-accent-600/30 transition-all"
              >
                <span>Click here if not redirected automatically</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </>
        )}

        <div className="flex items-center gap-1.5 text-[11px] text-gray-500 pt-3 border-t border-white/5">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
          <span>Verified Safe Link Resolution</span>
        </div>
      </div>
    </div>
  );
}
