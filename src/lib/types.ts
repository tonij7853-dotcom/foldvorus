export type SourceId = '411' | 'veel' | 'editpacks' | 'suits';

export type MediaType = 'movie' | 'tv' | 'game' | 'anime' | 'sports' | 'other';

export type SearchMode = 'all' | 'exact' | 'vibe';

export type QualityResolution = '720p' | '1080p' | '1440p' | '4K' | 'Unknown';

export type CodecType = 'H.264' | 'H.265 (HEVC)' | 'ProRes' | 'AV1' | 'Other' | 'Unknown';

export type ConfidenceLevel = 'BEST MATCH' | 'LIKELY MATCH' | 'RELATED';

export type MatchType = 'verified_scene' | 'likely_pack' | 'related';

export type EvidenceType = 
  | 'source_title'
  | 'source_description'
  | 'filename'
  | 'scene_label'
  | 'timestamp'
  | 'metadata'
  | 'semantic_inference';

export interface EvidenceInfo {
  type: EvidenceType;
  text?: string;
  sourceUrl?: string;
  confidence?: number;
  matchedTokens?: string[];
}

export interface Source {
  id: SourceId;
  name: string;
  baseUrl: string;
  badgeName: string;
  badgeColor: string;
  enabled: boolean;
  lastCrawledAt?: string;
  packCount?: number;
}

export interface Pack {
  id: string;
  sourceId: SourceId;
  externalId: string;
  title: string;
  mediaTitle: string;
  mediaType: MediaType;
  year?: number;
  characterName?: string;
  actorName?: string;
  directorName?: string;
  creatorName?: string; // Scenepack maker / uploader
  category?: string;
  quality: QualityResolution;
  codec?: CodecType;
  description?: string;
  sourceUrl: string;       // Original source page (NO direct video re-host)
  downloadPageUrl?: string; // Original download button / mega / drive link page
  thumbnailUrl?: string;
  popularity?: number;     // 0 - 100 or download count
  downloadCount?: number;
  publishedAt?: string;
  indexedAt: string;
  lastCheckedAt?: string;
  isActive: boolean;
  tags: string[];
  vibeTags?: string[];     // Emotion, event, visual setting, tropes
  embedding?: number[];    // Open-source embedding vector (384-dim for MiniLM)
  verifiedScenes?: string[]; // Specifically labeled scenes in pack metadata
}

export interface QueryIntent {
  rawQuery: string;
  normalizedQuery: string;
  searchMode: SearchMode;
  detectedMode: SearchMode;
  mediaTitle?: string;
  character?: string;
  actor?: string;
  year?: number;
  gender?: 'female' | 'male' | 'non-binary';
  emotions: string[];
  events: string[];
  visuals: string[];
  relationships: string[];
  tropes: string[];
  editVibes: string[];
  genres: string[];
  expandedKeywords: string[];
  expandedSearchPhrases: string[];
  multiQueries: string[];  // Multi-query generated search variants
  isLyricOrQuote: boolean;
  confidenceScore: number;
}

export interface ScoredPack extends Pack {
  relevanceScore: number;
  confidence: ConfidenceLevel;
  matchType: MatchType;
  evidence: EvidenceInfo;
  isExactSceneVerified: boolean;
  matchedConcepts: string[];
  matchReasons: string[];
  groupCategory?: string; // Grouping category for broad vibe searches (e.g. "GRIEF / LOSS", "BREAKUPS")
}

export interface GroupedMediaPacks {
  mediaTitle: string;
  year?: number;
  mediaType: MediaType;
  thumbnailUrl?: string;
  characterCount: number;
  totalPacks: number;
  availableSources: SourceId[];
  bestPack: ScoredPack;
  packs: ScoredPack[];
}

export interface SearchFilterState {
  mediaTypes?: MediaType[];
  yearMin?: number;
  yearMax?: number;
  qualities?: QualityResolution[];
  sources?: SourceId[];
  character?: string;
  actor?: string;
  creator?: string;
  codec?: CodecType[];
  moods?: string[];
  genres?: string[];
  matchType?: MatchType;
}

export interface SearchResponse {
  query: string;
  searchMode: SearchMode;
  intent: QueryIntent;
  totalResults: number;
  results: ScoredPack[];
  groupedResults: GroupedMediaPacks[];
  vibeCategories?: {
    categoryName: string;
    description: string;
    results: ScoredPack[];
  }[];
  relatedThemes: string[];
  suggestedQueries: string[];
  searchLatencyMs: number;
  sourcesSearched: SourceId[];
  hasExactMatches: boolean;
  verifiedSceneCount: number;
  likelyPackCount: number;
  isLiveIndex: boolean;
  error?: string;
}

export interface DiagnosticsData {
  totalIndexedPacks: number;
  packsPerSource: Record<SourceId, number>;
  lastCrawlTimes: Record<SourceId, string>;
  activeSources: Source[];
  inactiveLinksCount: number;
  duplicateGroupCount: number;
  averageSearchLatencyMs: number;
  failedCrawlPages: { url: string; source: SourceId; error: string; timestamp: string }[];
  tagCount: number;
  isLiveIndex: boolean;
}

export interface BenchmarkItem {
  id: string;
  query: string;
  category: 'exact_title' | 'character' | 'actor' | 'plot_event' | 'emotion' | 'visual' | 'vibe' | 'typo' | 'lyric';
  relevantTitles: string[];
  relevantCharacters?: string[];
  expectedConcepts: string[];
  mustVerifyScene?: boolean;
}

export interface RetrievalMetrics {
  totalQueries: number;
  precisionAt5: number;
  recallAt10: number;
  mrr: number; // Mean Reciprocal Rank
  ndcgAt10: number; // Normalized Discounted Cumulative Gain @ 10
  verifiedScenePrecision: number;
  categoryScores: Record<string, { p5: number; mrr: number; count: number }>;
}
