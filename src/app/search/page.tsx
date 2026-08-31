'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchBar } from '@/components/SearchBar';
import { PackCard } from '@/components/PackCard';
import { GroupedPackCard } from '@/components/GroupedPackCard';
import { VibeGroupedResults } from '@/components/VibeGroupedResults';
import { FilterSidebar } from '@/components/FilterSidebar';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { EmptyState } from '@/components/EmptyState';
import { 
  SearchMode, 
  SearchResponse, 
  SearchFilterState, 
  MatchType 
} from '@/lib/types';
import { 
  Sparkles, 
  Filter, 
  Layers, 
  Grid, 
  FolderHeart, 
  SlidersHorizontal, 
  X, 
  Clock, 
  CheckCircle2, 
  Tag,
  Info,
  ShieldCheck,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const query = searchParams.get('q') || '';
  const mode = (searchParams.get('mode') || 'all') as SearchMode;

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<SearchResponse | null>(null);
  const [filters, setFilters] = useState<SearchFilterState>({});
  const [viewMode, setViewMode] = useState<'cards' | 'grouped' | 'vibe'>('cards');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [showEvidenceLegend, setShowEvidenceLegend] = useState(false);
  const [matchTypeFilter, setMatchTypeFilter] = useState<'all' | MatchType>('all');

  useEffect(() => {
    if (!query) {
      setLoading(false);
      setData(null);
      return;
    }

    let isMounted = true;
    setLoading(true);

    const params = new URLSearchParams();
    params.set('q', query);
    params.set('mode', mode);

    if (matchTypeFilter !== 'all') params.set('matchType', matchTypeFilter);
    if (filters.mediaTypes?.length) params.set('mediaTypes', filters.mediaTypes.join(','));
    if (filters.qualities?.length) params.set('qualities', filters.qualities.join(','));
    if (filters.sources?.length) params.set('sources', filters.sources.join(','));
    if (filters.codec?.length) params.set('codecs', filters.codec.join(','));
    if (filters.yearMin) params.set('yearMin', String(filters.yearMin));
    if (filters.yearMax) params.set('yearMax', String(filters.yearMax));

    fetch(`/api/search?${params.toString()}`)
      .then((res) => res.json())
      .then((resData: SearchResponse) => {
        if (isMounted) {
          setData(resData);
          setLoading(false);
          if (resData.vibeCategories && resData.vibeCategories.length > 1 && mode === 'vibe') {
            setViewMode('vibe');
          }
        }
      })
      .catch((err) => {
        console.error('Search fetch error:', err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [query, mode, filters, matchTypeFilter]);

  const handleSearchSubmit = (newQuery: string, newMode: SearchMode) => {
    router.push(`/search?q=${encodeURIComponent(newQuery)}&mode=${newMode}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col gap-6">
      {/* Top Search Bar & Controls */}
      <div className="w-full bg-[#0d0f16]/90 p-4 sm:p-5 rounded-2xl border border-white/10 shadow-lg">
        <SearchBar
          initialQuery={query}
          initialMode={mode}
          size="compact"
          onSearch={handleSearchSubmit}
        />
      </div>

      {/* Production Error Banner if Live Index is unreachable */}
      {data?.error && (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/40 text-red-200 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div className="text-xs">
            <span className="font-bold block text-sm text-red-300">Live Index Unavailable</span>
            {data.error}
          </div>
        </div>
      )}

      {/* Query Understanding & Multi-Query Generations Banner */}
      {data?.intent && (
        <div className="bg-[#12141d] p-4 rounded-xl border border-white/5 flex flex-col gap-2.5 text-xs">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                <span>Intent:</span>
              </span>

              {data.intent.mediaTitle && (
                <span className="px-2 py-0.5 rounded bg-blue-500/15 text-blue-300 border border-blue-500/30 font-medium">
                  {data.intent.mediaTitle}
                </span>
              )}
              {data.intent.character && (
                <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 font-medium">
                  Character: {data.intent.character}
                </span>
              )}
              {data.intent.emotions.slice(0, 2).map((e, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-pink-500/15 text-pink-300 border border-pink-500/30">
                  {e}
                </span>
              ))}
              {data.intent.events.slice(0, 2).map((ev, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                  {ev}
                </span>
              ))}
              {data.intent.tropes.slice(0, 2).map((tr, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                  {tr}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 text-gray-400 text-[11px] flex-shrink-0">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3 text-accent-400" />
                {data.searchLatencyMs} ms
              </span>
              <button
                onClick={() => setShowEvidenceLegend(!showEvidenceLegend)}
                className="flex items-center gap-1 text-accent-300 hover:text-white bg-white/5 px-2 py-0.5 rounded transition-colors"
              >
                <HelpCircle className="w-3 h-3" />
                <span>Evidence Guide</span>
              </button>
            </div>
          </div>

          {/* Multi-query expansions line */}
          {data.intent.multiQueries && data.intent.multiQueries.length > 1 && (
            <div className="flex items-center gap-2 text-[11px] text-gray-400 overflow-x-auto pt-1.5 border-t border-white/5">
              <span className="text-gray-400 font-medium whitespace-nowrap">Multi-query variants:</span>
              <div className="flex items-center gap-1.5">
                {data.intent.multiQueries.slice(0, 4).map((mq, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/5 whitespace-nowrap font-mono text-[10px]">
                    &ldquo;{mq}&rdquo;
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Evidence Explanation Tooltip / Modal */}
          {showEvidenceLegend && (
            <div className="mt-2 p-3 rounded-lg bg-[#0d0e14] border border-white/10 flex flex-col gap-2 text-xs">
              <div className="font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>SceneFind Evidence & Match Types</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] text-gray-300">
                <div className="p-2 rounded bg-emerald-950/20 border border-emerald-500/20">
                  <span className="font-bold text-emerald-400 block mb-0.5">● VERIFIED SCENE MATCH</span>
                  Source metadata, title, description, or scene label specifically confirms the requested scene is present in this pack.
                </div>
                <div className="p-2 rounded bg-blue-950/20 border border-blue-500/20">
                  <span className="font-bold text-blue-400 block mb-0.5">● LIKELY PACK MATCH</span>
                  The pack is strongly associated with the requested movie or character, but the exact scene has not been independently verified.
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Results Layout with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block lg:col-span-1 sticky top-20">
          <FilterSidebar
            filters={filters}
            onChange={setFilters}
            onReset={() => setFilters({})}
          />
        </div>

        {/* Results Area */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Direct Outbound Search Bridge to 10,000+ Live Packs */}
          {query && query.trim() !== 'trending' && query.trim() !== 'all' && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/30 via-purple-950/20 to-pink-950/30 border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex flex-col gap-0.5">
                <span className="font-semibold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent-400" />
                  Search &ldquo;{query}&rdquo; Across 10,000+ External Library Packs
                </span>
                <span className="text-gray-400 text-[11px]">
                  Can&apos;t find an exact clip? Open direct search on the 4 live source databases:
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5">
                <a
                  href={`https://scenepacks.com/?search=${encodeURIComponent(query)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-md bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 transition-all font-medium text-[11px]"
                >
                  411 (5.8k+) ↗
                </a>
                <a
                  href={`https://veelscp.com/?s=${encodeURIComponent(query)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-md bg-pink-600/20 hover:bg-pink-600 text-pink-300 hover:text-white border border-pink-500/30 transition-all font-medium text-[11px]"
                >
                  Veel (3.1k+) ↗
                </a>
                <a
                  href={`https://editpacks.org/?s=${encodeURIComponent(query)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-md bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 transition-all font-medium text-[11px]"
                >
                  EditPacks (1.6k+) ↗
                </a>
                <a
                  href={`https://suitstmscenepacks.com/?s=${encodeURIComponent(query)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 rounded-md bg-amber-600/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 transition-all font-medium text-[11px]"
                >
                  Suits™ ↗
                </a>
              </div>
            </div>
          )}

          {/* Header Bar with Match Type Filters and View Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-xs font-semibold text-gray-300 border border-white/10"
              >
                <SlidersHorizontal className="w-3.5 h-3.5 text-accent-400" />
                <span>Filters</span>
              </button>

              {/* Match Type Quick Filter Tabs */}
              <div className="flex items-center gap-1 bg-[#12141c] p-0.5 rounded-lg border border-white/10 text-xs">
                <button
                  onClick={() => setMatchTypeFilter('all')}
                  className={`px-2.5 py-1 rounded-md font-medium transition-all ${
                    matchTypeFilter === 'all'
                      ? 'bg-white/15 text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  All ({data?.totalResults || 0})
                </button>
                {data && data.verifiedSceneCount > 0 && (
                  <button
                    onClick={() => setMatchTypeFilter('verified_scene')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                      matchTypeFilter === 'verified_scene'
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-emerald-400 hover:text-emerald-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified ({data.verifiedSceneCount})</span>
                  </button>
                )}
                {data && data.likelyPackCount > 0 && (
                  <button
                    onClick={() => setMatchTypeFilter('likely_pack')}
                    className={`px-2.5 py-1 rounded-md font-medium transition-all flex items-center gap-1 ${
                      matchTypeFilter === 'likely_pack'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-blue-400 hover:text-blue-300'
                    }`}
                  >
                    <span>Likely ({data.likelyPackCount})</span>
                  </button>
                )}
              </div>
            </div>

            {/* View Mode Switcher */}
            {data && data.results.length > 0 && (
              <div className="flex items-center gap-1 bg-[#12141c] p-1 rounded-xl border border-white/10 text-xs">
                <button
                  onClick={() => setViewMode('cards')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                    viewMode === 'cards'
                      ? 'bg-accent-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Grid className="w-3.5 h-3.5" />
                  <span>All Packs</span>
                </button>

                <button
                  onClick={() => setViewMode('grouped')}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                    viewMode === 'grouped'
                      ? 'bg-accent-600 text-white shadow-sm'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Grouped</span>
                </button>

                {data.vibeCategories && data.vibeCategories.length > 1 && (
                  <button
                    onClick={() => setViewMode('vibe')}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition-all ${
                      viewMode === 'vibe'
                        ? 'bg-accent-600 text-white shadow-sm'
                        : 'text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <FolderHeart className="w-3.5 h-3.5" />
                    <span>Vibe Clusters</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Body Content */}
          {loading ? (
            <LoadingSkeleton />
          ) : !data || data.results.length === 0 ? (
            <EmptyState
              query={query}
              relatedThemes={data?.relatedThemes}
              suggestedQueries={data?.suggestedQueries}
            />
          ) : viewMode === 'vibe' && data.vibeCategories ? (
            <VibeGroupedResults categories={data.vibeCategories} />
          ) : viewMode === 'grouped' ? (
            <div className="flex flex-col gap-4">
              {data.groupedResults.map((group, idx) => (
                <GroupedPackCard key={idx} group={group} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {data.results.map((pack) => (
                <PackCard key={pack.id} pack={pack} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-8"><LoadingSkeleton /></div>}>
      <SearchContent />
    </Suspense>
  );
}
