'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Film, ChevronDown, ChevronUp, ExternalLink, Sparkles, Layers } from 'lucide-react';
import { GroupedMediaPacks } from '@/lib/types';
import { SourceBadge } from './SourceBadge';

interface GroupedPackCardProps {
  group: GroupedMediaPacks;
}

export const GroupedPackCard: React.FC<GroupedPackCardProps> = ({ group }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-xl bg-[#11131a] border border-white/10 overflow-hidden transition-all duration-200 hover:border-accent-500/40">
      {/* Header Summary */}
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-gray-900 border border-white/10">
            <img
              src={group.thumbnailUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=200&q=80'}
              alt={group.mediaTitle}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-white">
                {group.mediaTitle}
              </h3>
              {group.year && (
                <span className="text-xs text-gray-400 font-mono">({group.year})</span>
              )}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-accent-400 font-medium flex items-center gap-1">
                <Layers className="w-3 h-3" />
                {group.totalPacks} {group.totalPacks === 1 ? 'pack' : 'packs'} available
              </span>
              <span className="text-gray-400 text-xs">across</span>
              <div className="flex items-center gap-1">
                {group.availableSources.map((sourceId) => (
                  <SourceBadge key={sourceId} sourceId={sourceId} size="sm" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Toggle Expand / View All button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white border border-white/10 transition-colors w-full sm:w-auto justify-center"
        >
          <span>{isExpanded ? 'Hide Packs' : `View All ${group.totalPacks} Packs`}</span>
          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Expanded Packs Grid */}
      {isExpanded && (
        <div className="px-4 pb-4 sm:px-5 sm:pb-5 border-t border-white/5 pt-4 bg-black/20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {group.packs.map((pack) => (
              <div
                key={pack.id}
                className="p-3 rounded-lg bg-[#141722] border border-white/5 hover:border-accent-500/30 transition-all flex flex-col justify-between gap-2"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <SourceBadge sourceId={pack.sourceId} size="sm" />
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/50 text-gray-300 border border-white/10">
                      {pack.quality}
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-white line-clamp-1">{pack.title}</h4>
                  {pack.characterName && (
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      Character: <span className="text-gray-200">{pack.characterName}</span>
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-white/5 mt-1">
                  <span className="text-[10px] text-accent-300 font-medium">
                    {pack.relevanceScore}% match
                  </span>
                  <a
                    href={pack.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1 rounded bg-accent-600 hover:bg-accent-500 text-white text-[11px] font-semibold transition-colors"
                  >
                    <span>Open on {pack.sourceId.toUpperCase()}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
