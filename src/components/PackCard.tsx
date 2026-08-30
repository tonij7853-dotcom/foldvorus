'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ExternalLink, 
  Bookmark, 
  Share2, 
  Sparkles, 
  Check, 
  Info, 
  Film, 
  User, 
  ShieldCheck, 
  HelpCircle,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { ScoredPack } from '@/lib/types';
import { SourceBadge } from './SourceBadge';
import { getDirectSourceUrl } from '@/lib/sources/url-builder';

interface PackCardProps {
  pack: ScoredPack;
  showMatchReasons?: boolean;
}

export const PackCard: React.FC<PackCardProps> = ({ pack, showMatchReasons = true }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('scenefind_favorites');
      if (saved) {
        const list: ScoredPack[] = JSON.parse(saved);
        setIsSaved(list.some(p => p.id === pack.id));
      }
    } catch {}
  }, [pack.id]);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const saved = localStorage.getItem('scenefind_favorites');
      let list: ScoredPack[] = saved ? JSON.parse(saved) : [];

      if (isSaved) {
        list = list.filter(p => p.id !== pack.id);
        setIsSaved(false);
      } else {
        list.push(pack);
        setIsSaved(true);
      }

      localStorage.setItem('scenefind_favorites', JSON.stringify(list));
      window.dispatchEvent(new Event('scenefind_favorites_updated'));
    } catch {}
  };

  const directUrl = getDirectSourceUrl(pack.sourceId, pack.mediaTitle, pack.characterName);

  const copyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(directUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderMatchTypeBadge = () => {
    if (pack.matchType === 'verified_scene' || pack.isExactSceneVerified) {
      return (
        <div className="relative group/badge inline-block">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1 shadow-sm shadow-emerald-950/40">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>Verified Scene</span>
          </span>
        </div>
      );
    }

    if (pack.matchType === 'likely_pack') {
      return (
        <div className="relative group/badge inline-block">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-500/20 text-blue-300 border border-blue-500/40 flex items-center gap-1 shadow-sm shadow-blue-950/40">
            <Layers className="w-3 h-3 text-blue-400" />
            <span>Likely Pack</span>
          </span>
        </div>
      );
    }

    return (
      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
        <Sparkles className="w-3 h-3 text-purple-400" />
        <span>Related</span>
      </span>
    );
  };

  return (
    <div className="group relative flex flex-col rounded-xl bg-[#11131a] border border-white/10 hover:border-accent-500/50 transition-all duration-200 overflow-hidden hover:shadow-xl hover:shadow-accent-950/20">
      {/* Thumbnail Area */}
      <div className="relative aspect-video w-full overflow-hidden bg-[#0d0e14]">
        <img
          src={pack.thumbnailUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&q=80'}
          alt={pack.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85 group-hover:opacity-100"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#11131a] via-transparent to-black/40" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
          <SourceBadge sourceId={pack.sourceId} />
          <div className="flex items-center gap-1.5">
            {renderMatchTypeBadge()}
            <button
              onClick={toggleFavorite}
              title={isSaved ? 'Remove from saved' : 'Save pack'}
              className={`p-1.5 rounded-lg backdrop-blur-md transition-all ${
                isSaved
                  ? 'bg-pink-500 text-white shadow-md'
                  : 'bg-black/50 text-gray-300 hover:text-white hover:bg-black/80'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5 fill-current" />
            </button>
          </div>
        </div>

        {/* Bottom Technical Spec Badges */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-[11px] font-mono font-medium">
          <div className="flex items-center gap-1.5">
            <span className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-gray-200 border border-white/10 font-bold">
              {pack.quality}
            </span>
            {pack.codec && (
              <span className="px-1.5 py-0.5 rounded bg-black/70 backdrop-blur-md text-gray-400 border border-white/10 text-[10px]">
                {pack.codec}
              </span>
            )}
          </div>

          {pack.relevanceScore !== undefined && (
            <span className="px-1.5 py-0.5 rounded bg-accent-950/80 backdrop-blur-md text-accent-300 border border-accent-500/30 text-[10px] font-sans font-semibold">
              {pack.relevanceScore}% match
            </span>
          )}
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between gap-3">
        <div>
          {/* Media Title & Year */}
          <div className="flex items-center gap-1.5 text-xs text-accent-400 font-semibold mb-1">
            <Film className="w-3 h-3 text-accent-400" />
            <span>{pack.mediaTitle}</span>
            {pack.year && <span className="text-gray-400 font-normal">({pack.year})</span>}
          </div>

          {/* Pack Title */}
          <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-accent-300 transition-colors line-clamp-1">
            {pack.title}
          </h3>

          {/* Character / Actor Info */}
          {(pack.characterName || pack.actorName) && (
            <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
              <User className="w-3 h-3 text-gray-400" />
              <span>{pack.characterName || 'Lead Character'}</span>
              {pack.actorName && (
                <span className="text-gray-400">· {pack.actorName}</span>
              )}
            </div>
          )}

          {/* EVIDENCE & MATCH REASONS SECTION */}
          {pack.matchType === 'verified_scene' && pack.evidence?.text ? (
            <div className="mt-2 text-[11px] bg-emerald-950/30 text-emerald-200 border border-emerald-500/30 p-2 rounded-lg flex flex-col gap-1">
              <div className="flex items-center gap-1 text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                <CheckCircle2 className="w-3 h-3" />
                <span>Evidence Confirmed</span>
              </div>
              <p className="line-clamp-2 leading-relaxed text-emerald-100/90 font-mono text-[10.5px]">
                &ldquo;{pack.evidence.text}&rdquo;
              </p>
            </div>
          ) : pack.matchType === 'likely_pack' ? (
            <div className="mt-2 text-[11px] bg-blue-950/25 text-blue-200 border border-blue-500/25 p-2 rounded-lg flex flex-col gap-1">
              <div className="flex items-center gap-1 text-blue-400 font-bold uppercase tracking-wider text-[10px]">
                <Layers className="w-3 h-3" />
                <span>Likely Pack Match</span>
              </div>
              <p className="line-clamp-2 leading-relaxed text-gray-300 text-[10.5px]">
                {pack.matchReasons?.[0] || `Relevant character/movie pack.`}
              </p>
              <span className="text-[10px] text-gray-400 italic">
                Exact scene has not been independently confirmed.
              </span>
            </div>
          ) : (
            showMatchReasons && pack.matchReasons && pack.matchReasons.length > 0 && (
              <div className="mt-2 text-[11px] text-gray-400 bg-white/5 p-2 rounded-lg border border-white/5 flex items-start gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent-400 flex-shrink-0 mt-0.5" />
                <p className="line-clamp-2 leading-relaxed">
                  {pack.matchReasons.join(' • ')}
                </p>
              </div>
            )
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-2.5">
            {pack.tags.slice(0, 3).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 text-gray-400 border border-white/5"
              >
                #{tag}
              </span>
            ))}
            {pack.tags.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 text-gray-400">
                +{pack.tags.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-white/5 flex items-center justify-between gap-2">
          <button
            onClick={copyLink}
            title="Copy original source link"
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 text-xs flex items-center gap-1 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
          </button>

          <Link
            href={`/pack/${pack.id}`}
            className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-medium transition-colors"
          >
            Details
          </Link>

          {/* IMPORTANT: Link directly to original source search / pack landing page */}
          <a
            href={directUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-600 hover:bg-accent-500 text-white font-semibold text-xs transition-all shadow-md shadow-accent-600/20 active:scale-95"
          >
            <span>Open Pack</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
