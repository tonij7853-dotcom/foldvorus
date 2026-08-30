'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bookmark, Trash2, ArrowLeft, Download, ExternalLink } from 'lucide-react';
import { ScoredPack } from '@/lib/types';
import { PackCard } from '@/components/PackCard';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<ScoredPack[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('scenefind_favorites');
      if (saved) {
        setFavorites(JSON.parse(saved));
      }
    } catch {}
  }, []);

  const clearAll = () => {
    if (window.confirm('Clear all saved scenepacks?')) {
      localStorage.removeItem('scenefind_favorites');
      setFavorites([]);
      window.dispatchEvent(new Event('scenefind_favorites_updated'));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <Bookmark className="w-6 h-6 text-pink-400 fill-current" />
              <span>Saved Scenepacks</span>
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Locally saved scenepacks for quick access while video editing.
            </p>
          </div>
        </div>

        {favorites.length > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear All</span>
          </button>
        )}
      </div>

      {/* Content */}
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-gray-400">
            <Bookmark className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">No saved scenepacks yet</h3>
          <p className="text-xs text-gray-400 mb-6 leading-relaxed">
            Click the bookmark icon on any scenepack card to save it for your video editing workflow.
          </p>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl bg-accent-600 hover:bg-accent-500 text-white text-xs font-bold transition-all shadow-md shadow-accent-600/30"
          >
            Search Scenepacks
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((pack) => (
            <PackCard key={pack.id} pack={pack} />
          ))}
        </div>
      )}
    </div>
  );
}
