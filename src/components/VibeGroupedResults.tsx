'use client';

import React from 'react';
import { Sparkles, FolderHeart } from 'lucide-react';
import { ScoredPack } from '@/lib/types';
import { PackCard } from './PackCard';

interface VibeGroupedResultsProps {
  categories: {
    categoryName: string;
    description: string;
    results: ScoredPack[];
  }[];
}

export const VibeGroupedResults: React.FC<VibeGroupedResultsProps> = ({ categories }) => {
  return (
    <div className="flex flex-col gap-10">
      {categories.map((cat, idx) => (
        <section key={idx} className="flex flex-col gap-4">
          <div className="flex flex-col border-b border-white/10 pb-2">
            <div className="flex items-center gap-2">
              <FolderHeart className="w-4 h-4 text-accent-400" />
              <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                {cat.categoryName}
              </h2>
              <span className="text-xs px-2 py-0.5 rounded-full bg-accent-500/10 text-accent-300 border border-accent-500/20 font-mono font-semibold">
                {cat.results.length}
              </span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5">{cat.description}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {cat.results.map((pack) => (
              <PackCard key={pack.id} pack={pack} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};
