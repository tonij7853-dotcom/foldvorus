import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { MOCK_PACKS } from '@/lib/db/mock-db';
import { SourceBadge } from '@/components/SourceBadge';
import { PackCard } from '@/components/PackCard';
import { 
  ArrowLeft, 
  ExternalLink, 
  Film, 
  User, 
  Clapperboard, 
  Disc, 
  ShieldAlert, 
  Calendar, 
  Sparkles, 
  Tag, 
  Share2 
} from 'lucide-react';
import { ScoredPack } from '@/lib/types';

interface PackPageProps {
  params: { id: string };
}

export default function PackDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const pack = MOCK_PACKS.find((p) => p.id === id);

  if (!pack) {
    notFound();
  }

  // Find alternative packs across other sources
  const alternatives: ScoredPack[] = MOCK_PACKS
    .filter((p) => p.id !== id && p.mediaTitle.toLowerCase() === pack.mediaTitle.toLowerCase())
    .map((p) => ({
      ...p,
      relevanceScore: 90,
      confidence: 'BEST MATCH',
      matchType: 'likely_pack',
      isExactSceneVerified: false,
      evidence: {
        type: 'metadata',
        text: `Alternative pack on ${p.sourceId.toUpperCase()}`,
      },
      matchedConcepts: ['Alternative Source'],
      matchReasons: [`Available on ${p.sourceId.toUpperCase()}`],
    }));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-10">
      {/* Back Button */}
      <div>
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Search</span>
        </Link>
      </div>

      {/* Main Details Card */}
      <div className="rounded-2xl bg-[#11131a] border border-white/10 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-8 p-6 sm:p-8">
        {/* Left: Thumbnail & Badges */}
        <div className="flex flex-col gap-4">
          <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black/40 border border-white/10">
            <img
              src={pack.thumbnailUrl || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&q=80'}
              alt={pack.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3">
              <SourceBadge sourceId={pack.sourceId} size="md" />
            </div>
            <div className="absolute bottom-3 left-3 flex gap-2">
              <span className="px-2 py-1 rounded bg-black/80 backdrop-blur-md text-xs font-mono font-bold text-white border border-white/10">
                {pack.quality}
              </span>
              {pack.codec && (
                <span className="px-2 py-1 rounded bg-black/80 backdrop-blur-md text-xs font-mono text-gray-300 border border-white/10">
                  {pack.codec}
                </span>
              )}
            </div>
          </div>

          {/* Legal Compliance Notice */}
          <div className="p-3.5 rounded-xl bg-blue-950/20 border border-blue-500/20 flex items-start gap-2.5 text-xs text-blue-200">
            <ShieldAlert className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              SceneFind is a metadata search engine. We do not store or host video files. Clicking &ldquo;Open Pack&rdquo; redirects you directly to the verified original source page.
            </p>
          </div>
        </div>

        {/* Right: Metadata & Action Buttons */}
        <div className="flex flex-col justify-between gap-6">
          <div className="flex flex-col gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-accent-400 font-semibold mb-1">
                <Film className="w-3.5 h-3.5" />
                <span>{pack.mediaTitle}</span>
                {pack.year && <span className="text-gray-400">({pack.year})</span>}
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {pack.title}
              </h1>
            </div>

            {/* Description */}
            {pack.description && (
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed bg-white/5 p-3.5 rounded-xl border border-white/5">
                {pack.description}
              </p>
            )}

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              {pack.characterName && (
                <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
                  <span className="text-gray-400 block text-[11px]">Character:</span>
                  <span className="font-semibold text-white">{pack.characterName}</span>
                </div>
              )}

              {pack.actorName && (
                <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
                  <span className="text-gray-400 block text-[11px]">Actor:</span>
                  <span className="font-semibold text-white">{pack.actorName}</span>
                </div>
              )}

              {pack.creatorName && (
                <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
                  <span className="text-gray-400 block text-[11px]">Pack Creator:</span>
                  <span className="font-semibold text-white">{pack.creatorName}</span>
                </div>
              )}

              <div className="p-2.5 rounded-lg bg-black/30 border border-white/5">
                <span className="text-gray-400 block text-[11px]">Media Category:</span>
                <span className="font-semibold text-white capitalize">{pack.mediaType}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5 mt-1">
              {pack.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-white/5 text-gray-400 border border-white/5 text-[11px]"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Direct Outbound Link Button */}
          <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
            <a
              href={pack.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-accent-600 hover:bg-accent-500 text-white font-bold text-sm shadow-lg shadow-accent-600/30 transition-all active:scale-95"
            >
              <span>Open Pack on {pack.sourceId.toUpperCase()}</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            {pack.downloadPageUrl && (
              <a
                href={pack.downloadPageUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs transition-colors"
              >
                <span>Direct Download Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Alternative Packs Across Other Sources */}
      {alternatives.length > 0 && (
        <section className="flex flex-col gap-4">
          <div className="flex items-center gap-2 border-b border-white/10 pb-2">
            <Sparkles className="w-4 h-4 text-accent-400" />
            <h2 className="text-base sm:text-lg font-bold text-white">
              Alternative Scenepacks for &ldquo;{pack.mediaTitle}&rdquo;
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {alternatives.map((altPack) => (
              <PackCard key={altPack.id} pack={altPack} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
