'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SearchX, Sparkles, Lightbulb, ArrowRight } from 'lucide-react';

interface EmptyStateProps {
  query: string;
  relatedThemes?: string[];
  suggestedQueries?: string[];
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  query,
  relatedThemes = [],
  suggestedQueries = [],
}) => {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl bg-[#11131a] border border-white/10 max-w-2xl mx-auto my-8">
      <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-gray-400">
        <SearchX className="w-7 h-7" />
      </div>

      <h3 className="text-lg sm:text-xl font-bold text-white mb-2">
        No exact scenepack confirmed for &ldquo;{query}&rdquo;
      </h3>

      <p className="text-sm text-gray-400 max-w-md mb-6 leading-relaxed">
        We index verified public packs across 411, Veel, EditPacks, and Suits. Try broadening your description or explore these suggested themes:
      </p>

      {/* Suggested Themes */}
      {relatedThemes.length > 0 && (
        <div className="w-full flex flex-col items-center gap-2 mb-6">
          <div className="flex items-center gap-1.5 text-xs text-accent-400 font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Related Scene Themes</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {relatedThemes.map((theme, i) => (
              <button
                key={i}
                onClick={() => router.push(`/search?q=${encodeURIComponent(theme)}&mode=vibe`)}
                className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-200 hover:text-white transition-colors flex items-center gap-1"
              >
                <span>{theme}</span>
                <ArrowRight className="w-3 h-3 text-accent-400" />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Suggested Queries */}
      {suggestedQueries.length > 0 && (
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-gray-400 font-semibold uppercase tracking-wider">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>Popular Editor Searches</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {suggestedQueries.map((sQuery, i) => (
              <button
                key={i}
                onClick={() => router.push(`/search?q=${encodeURIComponent(sQuery)}&mode=all`)}
                className="px-3 py-1 rounded-full bg-accent-500/10 hover:bg-accent-500/20 text-accent-300 border border-accent-500/20 text-xs transition-colors"
              >
                {sQuery}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
