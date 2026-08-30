import { 
  SearchMode, 
  SearchFilterState, 
  SearchResponse, 
  ScoredPack, 
  GroupedMediaPacks, 
  Pack 
} from '../types';
import { parseQueryIntent } from './query-parser';
import { calculatePackRelevance, filterPacks, deduplicateAndGroup } from './ranking-engine';
import { fetchLiveIndexedPacks } from '../db/live-db';
import { discoverCandidateMedia } from './candidate-discovery';

// In-memory cache for repeated searches to ensure ultra-low search latency
const searchCache = new Map<string, { timestamp: number; response: SearchResponse }>();
const CACHE_TTL_MS = 60 * 1000;

export async function executeSearch(
  query: string, 
  mode: SearchMode = 'all', 
  filters?: SearchFilterState
): Promise<SearchResponse> {
  const startTime = Date.now();
  const cacheKey = JSON.stringify({ query: query.trim().toLowerCase(), mode, filters });

  if (searchCache.has(cacheKey)) {
    const cached = searchCache.get(cacheKey)!;
    if (Date.now() - cached.timestamp < CACHE_TTL_MS) {
      return {
        ...cached.response,
        searchLatencyMs: Math.max(1, Date.now() - startTime),
      };
    }
  }

  // 1. STAGE 1 & 2: UNIVERSAL QUERY UNDERSTANDING & MULTI-QUERY EXPANSION
  const intent = parseQueryIntent(query, mode);

  // 2. STAGE 3: DYNAMIC CANDIDATE DISCOVERY
  const candidateMatches = await discoverCandidateMedia(intent);

  // 3. STAGE 4: RETRIEVE FROM LIVE / ACTIVE DATABASE
  const dbResult = await fetchLiveIndexedPacks();
  
  if (dbResult.error) {
    return {
      query,
      searchMode: mode,
      intent,
      totalResults: 0,
      results: [],
      groupedResults: [],
      relatedThemes: [],
      suggestedQueries: [],
      searchLatencyMs: Math.max(1, Date.now() - startTime),
      sourcesSearched: ['411', 'veel', 'editpacks', 'suits'],
      hasExactMatches: false,
      verifiedSceneCount: 0,
      likelyPackCount: 0,
      isLiveIndex: dbResult.isLiveIndex,
      error: dbResult.error,
    };
  }

  // Filter base pool by UI filters
  const activePool = filterPacks(dbResult.packs, filters);

  // 4. STAGE 5: SEMANTIC & MULTI-FACTOR RANKING WITH EVIDENCE EVALUATION
  let scoredList: ScoredPack[] = activePool.map(pack => calculatePackRelevance(pack, intent));

  // If MatchType filter was specified in UI
  if (filters?.matchType) {
    scoredList = scoredList.filter(p => p.matchType === filters.matchType);
  }

  // Sort by relevance score descending (verified scenes will rank highest)
  scoredList.sort((a, b) => b.relevanceScore - a.relevanceScore);

  let meaningfulResults = scoredList.filter(p => p.relevanceScore >= 12);

  // STAGE 7: FALLBACK / GRACEFUL BROADER RESULTS
  let hasExactMatches = meaningfulResults.some(p => p.confidence === 'BEST MATCH');
  
  if (meaningfulResults.length === 0 && !filters?.matchType) {
    meaningfulResults = scoredList.slice(0, 6).map(p => ({
      ...p,
      confidence: 'RELATED' as const,
      matchType: 'related' as const,
      matchReasons: ['Suggested based on related editing popularity & genre'],
    }));
  }

  // Count verified scenes vs likely packs
  const verifiedSceneCount = meaningfulResults.filter(p => p.matchType === 'verified_scene').length;
  const likelyPackCount = meaningfulResults.filter(p => p.matchType === 'likely_pack').length;

  // Deduplicate and group under movies/shows
  const groupedResults = deduplicateAndGroup(meaningfulResults);

  // VIBE RESULT GROUPING
  const categoryMap: Record<string, ScoredPack[]> = {};
  for (const pack of meaningfulResults) {
    const cat = pack.groupCategory || 'RELATED SCENES';
    if (!categoryMap[cat]) categoryMap[cat] = [];
    categoryMap[cat].push(pack);
  }

  const vibeCategories = Object.keys(categoryMap).length > 1 
    ? Object.entries(categoryMap).map(([categoryName, results]) => ({
        categoryName,
        description: `Curated packs matching "${categoryName.toLowerCase()}" vibe`,
        results,
      }))
    : undefined;

  // Extract related themes for suggestions
  const relatedThemes = Array.from(new Set([
    ...intent.expandedSearchPhrases,
    ...intent.emotions.map(e => `${e} scenes`),
    ...intent.tropes.map(t => `${t} edit clips`),
  ])).slice(0, 5);

  const suggestedQueries = [
    intent.mediaTitle ? `${intent.mediaTitle} 4K` : undefined,
    intent.character ? `${intent.character} emotional` : undefined,
    'someone finds out who killed their mother',
    'sad breakup scenes',
    'screaming in the rain',
    'confident entrance scene',
    'rich people arguing at dinner',
  ].filter(Boolean) as string[];

  const searchLatencyMs = Math.max(1, Date.now() - startTime);

  const response: SearchResponse = {
    query,
    searchMode: mode,
    intent,
    totalResults: meaningfulResults.length,
    results: meaningfulResults,
    groupedResults,
    vibeCategories,
    relatedThemes,
    suggestedQueries: suggestedQueries.slice(0, 4),
    searchLatencyMs,
    sourcesSearched: ['411', 'veel', 'editpacks', 'suits'],
    hasExactMatches,
    verifiedSceneCount,
    likelyPackCount,
    isLiveIndex: dbResult.isLiveIndex,
  };

  searchCache.set(cacheKey, { timestamp: Date.now(), response });
  return response;
}
