'use client';

import React from 'react';
import { Filter, RotateCcw, Check, Layers, Sparkles, Video, Disc } from 'lucide-react';
import { SearchFilterState, MediaType, QualityResolution, SourceId, CodecType } from '@/lib/types';

interface FilterSidebarProps {
  filters: SearchFilterState;
  onChange: (newFilters: SearchFilterState) => void;
  onReset: () => void;
  className?: string;
}

const MEDIA_TYPES: { id: MediaType; label: string }[] = [
  { id: 'movie', label: 'Movies' },
  { id: 'tv', label: 'TV Shows' },
  { id: 'anime', label: 'Anime & Animation' },
  { id: 'game', label: 'Games' },
  { id: 'sports', label: 'Sports' },
  { id: 'other', label: 'Other' },
];

const QUALITIES: QualityResolution[] = ['1080p', '4K', '720p'];

const SOURCES: { id: SourceId; label: string }[] = [
  { id: '411', label: '411 Scenepacks' },
  { id: 'veel', label: 'Veel SCP' },
  { id: 'editpacks', label: 'EditPacks' },
  { id: 'suits', label: 'SuitsTM' },
];

const CODECS: CodecType[] = ['H.264', 'H.265 (HEVC)', 'ProRes'];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  onReset,
  className = '',
}) => {
  const toggleMediaType = (type: MediaType) => {
    const current = filters.mediaTypes || [];
    const next = current.includes(type)
      ? current.filter((t) => t !== type)
      : [...current, type];
    onChange({ ...filters, mediaTypes: next });
  };

  const toggleQuality = (q: QualityResolution) => {
    const current = filters.qualities || [];
    const next = current.includes(q)
      ? current.filter((item) => item !== q)
      : [...current, q];
    onChange({ ...filters, qualities: next });
  };

  const toggleSource = (s: SourceId) => {
    const current = filters.sources || [];
    const next = current.includes(s)
      ? current.filter((item) => item !== s)
      : [...current, s];
    onChange({ ...filters, sources: next });
  };

  const toggleCodec = (c: CodecType) => {
    const current = filters.codec || [];
    const next = current.includes(c)
      ? current.filter((item) => item !== c)
      : [...current, c];
    onChange({ ...filters, codec: next });
  };

  const hasActiveFilters =
    (filters.mediaTypes && filters.mediaTypes.length > 0) ||
    (filters.qualities && filters.qualities.length > 0) ||
    (filters.sources && filters.sources.length > 0) ||
    (filters.codec && filters.codec.length > 0) ||
    filters.yearMin ||
    filters.yearMax;

  return (
    <aside className={`flex flex-col gap-6 p-4 sm:p-5 rounded-2xl bg-[#101219] border border-white/10 ${className}`}>
      {/* Top Title & Reset */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2 text-white font-bold text-sm">
          <Filter className="w-4 h-4 text-accent-400" />
          <span>Refine Results</span>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Sources Filter */}
      <div>
        <label className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-2.5 block flex items-center gap-1.5">
          <Layers className="w-3.5 h-3.5 text-accent-400" />
          <span>Source Platform</span>
        </label>
        <div className="flex flex-col gap-1.5">
          {SOURCES.map((source) => {
            const isSelected = filters.sources?.includes(source.id);
            return (
              <button
                key={source.id}
                onClick={() => toggleSource(source.id)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-accent-600/20 text-accent-300 border border-accent-500/40'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{source.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-accent-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Media Type Filter */}
      <div>
        <label className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-2.5 block flex items-center gap-1.5">
          <Video className="w-3.5 h-3.5 text-blue-400" />
          <span>Media Category</span>
        </label>
        <div className="flex flex-col gap-1.5">
          {MEDIA_TYPES.map((type) => {
            const isSelected = filters.mediaTypes?.includes(type.id);
            return (
              <button
                key={type.id}
                onClick={() => toggleMediaType(type.id)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{type.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-blue-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Resolution Quality Filter */}
      <div>
        <label className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-2.5 block flex items-center gap-1.5">
          <Disc className="w-3.5 h-3.5 text-emerald-400" />
          <span>Resolution</span>
        </label>
        <div className="flex flex-wrap gap-1.5">
          {QUALITIES.map((q) => {
            const isSelected = filters.qualities?.includes(q);
            return (
              <button
                key={q}
                onClick={() => toggleQuality(q)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                  isSelected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-white/10'
                }`}
              >
                {q}
              </button>
            );
          })}
        </div>
      </div>

      {/* Codec Filter */}
      <div>
        <label className="text-xs uppercase tracking-wider font-semibold text-gray-400 mb-2.5 block">
          Video Codec
        </label>
        <div className="flex flex-col gap-1.5">
          {CODECS.map((c) => {
            const isSelected = filters.codec?.includes(c);
            return (
              <button
                key={c}
                onClick={() => toggleCodec(c)}
                className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all ${
                  isSelected
                    ? 'bg-white/15 text-white border border-white/25'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{c}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
