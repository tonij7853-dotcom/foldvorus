import React from 'react';
import Link from 'next/link';
import { SearchBar } from '@/components/SearchBar';
import { VibeChips } from '@/components/VibeChips';
import { PackCard } from '@/components/PackCard';
import { SourceBadge } from '@/components/SourceBadge';
import { MOCK_PACKS, INITIAL_SOURCES } from '@/lib/db/mock-db';
import { TrendingUp, Sparkles, Film, User, Clock, ArrowRight, ShieldCheck } from 'lucide-react';
import { ScoredPack } from '@/lib/types';

export default function HomePage() {
  const trendingPacks: ScoredPack[] = MOCK_PACKS
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 6)
    .map(p => ({
      ...p,
      relevanceScore: 98,
      confidence: 'BEST MATCH',
      matchType: 'likely_pack',
      isExactSceneVerified: false,
      evidence: {
        type: 'metadata',
        text: 'Trending community download volume',
      },
      matchedConcepts: ['Trending on SceneFind'],
      matchReasons: ['High community download volume'],
    }));

  const recentPacks: ScoredPack[] = MOCK_PACKS
    .sort((a, b) => new Date(b.publishedAt || '').getTime() - new Date(a.publishedAt || '').getTime())
    .slice(0, 6)
    .map(p => ({
      ...p,
      relevanceScore: 92,
      confidence: 'BEST MATCH',
      matchType: 'likely_pack',
      isExactSceneVerified: false,
      evidence: {
        type: 'metadata',
        text: 'Freshly indexed from source',
      },
      matchedConcepts: ['Recently Indexed'],
      matchReasons: ['Freshly indexed from source'],
    }));

  const popularMovies = [
    { title: 'Cruella', count: 3, year: 2021, image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80', query: 'Cruella' },
    { title: 'The Batman', count: 2, year: 2022, image: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&q=80', query: 'The Batman' },
    { title: 'Euphoria', count: 2, year: 2019, image: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80', query: 'Euphoria' },
    { title: 'Interstellar', count: 1, year: 2014, image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80', query: 'Interstellar' },
    { title: 'Spider-Man', count: 1, year: 2021, image: 'https://images.unsplash.com/photo-1604200213928-ba3cf4fc8436?w=400&q=80', query: 'Spider-Man' },
    { title: 'Succession', count: 1, year: 2018, image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&q=80', query: 'Succession' },
  ];

  const popularCharacters = [
    { name: 'Estella / Cruella', media: 'Cruella', query: 'Estella' },
    { name: 'Bruce Wayne', media: 'The Batman', query: 'Bruce Wayne' },
    { name: 'Rue Bennett', media: 'Euphoria', query: 'Rue Bennett' },
    { name: 'Peter Parker', media: 'Spider-Man', query: 'Peter Parker' },
    { name: 'Kendall Roy', media: 'Succession', query: 'Kendall Roy' },
    { name: 'Jinx / Powder', media: 'Arcane', query: 'Jinx' },
    { name: 'Thomas Shelby', media: 'Peaky Blinders', query: 'Thomas Shelby' },
    { name: 'Joel Miller', media: 'The Last of Us', query: 'Joel Miller' },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* HERO SECTION */}
      <section className="relative w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-accent-600/10 blur-[130px] rounded-full pointer-events-none" />

        {/* Source Badges Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
          {INITIAL_SOURCES.map(source => (
            <SourceBadge key={source.id} sourceId={source.id} size="sm" />
          ))}
        </div>

        {/* Headline & Subheadline */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-3xl leading-[1.1] mb-4">
          Find the right <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent-400 via-indigo-300 to-purple-400">scenepack.</span>
        </h1>
        <p className="text-base sm:text-lg text-gray-400 max-w-2xl mb-8 leading-relaxed font-normal">
          Search movies, characters, or just describe the scene you need. We index packs across multiple websites in one unified place.
        </p>

        {/* Large Omni Search Bar */}
        <div className="w-full max-w-2xl mb-8">
          <SearchBar size="large" autoFocus={false} />
        </div>

        {/* Quick Vibe Discovery Chips */}
        <div className="w-full max-w-4xl">
          <VibeChips />
        </div>
      </section>

      {/* MAIN CONTENT CONTAINERS */}
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col gap-16 py-8">
        {/* TRENDING PACKS */}
        <section className="flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">Trending Packs</h2>
            </div>
            <Link
              href="/search?q=trending&mode=all"
              className="text-xs font-semibold text-accent-400 hover:text-accent-300 flex items-center gap-1 transition-colors"
            >
              <span>Explore All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {trendingPacks.map((pack) => (
              <PackCard key={pack.id} pack={pack} />
            ))}
          </div>
        </section>

        {/* POPULAR MOVIES & SHOWS */}
        <section className="flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Film className="w-5 h-5 text-blue-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">Popular Movies & TV Shows</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {popularMovies.map((item, idx) => (
              <Link
                key={idx}
                href={`/search?q=${encodeURIComponent(item.query)}&mode=exact`}
                className="group flex flex-col rounded-xl overflow-hidden bg-[#11131a] border border-white/5 hover:border-accent-500/50 transition-all duration-200"
              >
                <div className="aspect-[3/4] w-full overflow-hidden bg-gray-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-85 group-hover:opacity-100"
                  />
                </div>
                <div className="p-2.5 flex flex-col">
                  <span className="text-xs font-bold text-white group-hover:text-accent-300 truncate">
                    {item.title}
                  </span>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 mt-0.5">
                    <span>{item.year}</span>
                    <span className="text-accent-400">{item.count} packs</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* POPULAR CHARACTERS */}
        <section className="flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-purple-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">Popular Character Packs</h2>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {popularCharacters.map((char, idx) => (
              <Link
                key={idx}
                href={`/search?q=${encodeURIComponent(char.query)}&mode=exact`}
                className="flex items-center justify-between p-3.5 rounded-xl bg-[#11131a] border border-white/5 hover:border-accent-500/40 transition-all hover:bg-[#151722]"
              >
                <div className="flex flex-col truncate pr-2">
                  <span className="text-xs sm:text-sm font-bold text-white truncate">
                    {char.name}
                  </span>
                  <span className="text-[11px] text-gray-400 truncate">{char.media}</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
              </Link>
            ))}
          </div>
        </section>

        {/* RECENTLY INDEXED */}
        <section className="flex flex-col gap-5">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl font-bold text-white tracking-tight">Freshly Indexed Packs</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentPacks.map((pack) => (
              <PackCard key={pack.id} pack={pack} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
