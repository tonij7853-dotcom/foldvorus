'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Film, Bookmark, Sparkles, Activity, Search, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const [favCount, setFavCount] = useState<number>(0);

  useEffect(() => {
    const updateFavCount = () => {
      try {
        const saved = localStorage.getItem('scenefind_favorites');
        if (saved) {
          const list = JSON.parse(saved);
          setFavCount(Array.isArray(list) ? list.length : 0);
        } else {
          setFavCount(0);
        }
      } catch {
        setFavCount(0);
      }
    };

    updateFavCount();
    window.addEventListener('storage', updateFavCount);
    window.addEventListener('scenefind_favorites_updated', updateFavCount);

    return () => {
      window.removeEventListener('storage', updateFavCount);
      window.removeEventListener('scenefind_favorites_updated', updateFavCount);
    };
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#0a0b0e]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-accent-600 to-indigo-500 flex items-center justify-center shadow-md shadow-accent-600/20 group-hover:scale-105 transition-transform duration-200">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              Scene<span className="text-accent-400">Find</span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-accent-500/10 text-accent-400 border border-accent-500/20">
                Beta
              </span>
            </span>
          </div>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            href="/search?q=emotional+clips&mode=vibe"
            className="hidden md:flex items-center gap-1.5 text-xs font-medium text-gray-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent-400" />
            Discover Vibes
          </Link>

          <Link
            href="/favorites"
            className="flex items-center gap-1.5 text-xs font-medium text-gray-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-white/5 transition-colors relative"
          >
            <Bookmark className="w-3.5 h-3.5 text-pink-400" />
            <span>Saved</span>
            {favCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-pink-500/20 text-pink-300 text-[10px] font-bold border border-pink-500/30">
                {favCount}
              </span>
            )}
          </Link>

          <Link
            href="/debug"
            className="flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors"
            title="System Diagnostics & Adapter Crawler Status"
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Diagnostics</span>
          </Link>

          <div className="hidden lg:flex items-center gap-1 text-[11px] text-gray-400 border-l border-white/10 pl-3">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span>Direct Indexing</span>
          </div>
        </div>
      </div>
    </header>
  );
};
