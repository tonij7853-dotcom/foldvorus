import { 
  Pack, 
  ScoredPack, 
  QueryIntent, 
  ConfidenceLevel, 
  GroupedMediaPacks, 
  SearchFilterState, 
  MatchType 
} from '../types';
import { cosineSimilarity, generateLocalEmbedding } from './vector-search';
import { evaluateSceneEvidence } from './evidence-engine';

export function calculatePackRelevance(pack: Pack, intent: QueryIntent): ScoredPack {
  let score = 0;
  const matchReasons: string[] = [];
  const matchedConcepts: string[] = [];

  const rawQuery = intent.rawQuery.toLowerCase().trim();
  const normQuery = intent.normalizedQuery.toLowerCase().trim();
  const mediaTitleLower = (pack.mediaTitle || '').toLowerCase();
  const titleLower = (pack.title || '').toLowerCase();
  const characterLower = (pack.characterName || '').toLowerCase();
  const actorLower = (pack.actorName || '').toLowerCase();
  const descLower = (pack.description || '').toLowerCase();
  const allPackTags = [...(pack.tags || []), ...(pack.vibeTags || [])].map(t => t.toLowerCase());

  const isExactMode = intent.detectedMode === 'exact' || intent.searchMode === 'exact';

  // 0. SPECIAL HANDLING FOR EXPLORE / TRENDING / ALL BROWSING
  const isBrowseAll = !rawQuery || rawQuery === 'trending' || rawQuery === 'all' || rawQuery === 'explore' || rawQuery === 'scenepacks' || rawQuery === 'packs';
  if (isBrowseAll) {
    score = pack.popularity || 85;
    matchReasons.push('Trending Community Scenepack');
    matchedConcepts.push('Trending');
    return {
      ...pack,
      relevanceScore: Math.min(100, Math.round(score)),
      confidence: 'BEST MATCH',
      matchType: 'likely_pack',
      evidence: { type: 'metadata', text: 'Trending on SceneFind' },
      isExactSceneVerified: false,
      matchedConcepts: ['Trending'],
      matchReasons: ['Trending Community Scenepack'],
      groupCategory: pack.category || 'POPULAR PACKS',
    };
  }

  // 0.5 CATEGORY QUICK-SEARCH HANDLING
  if (normQuery === 'movie' || normQuery === 'movies') {
    if (pack.mediaType === 'movie') {
      score += 60;
      matchReasons.push('Category: Movie Scenepacks');
      matchedConcepts.push('Movies');
    }
  } else if (normQuery === 'tv' || normQuery === 'series' || normQuery === 'shows' || normQuery === 'tv shows') {
    if (pack.mediaType === 'tv') {
      score += 60;
      matchReasons.push('Category: TV Series');
      matchedConcepts.push('TV Series');
    }
  } else if (normQuery === 'anime' || normQuery === 'manga' || normQuery === 'animation') {
    if (pack.mediaType === 'anime' || (pack.category && pack.category.toLowerCase().includes('anim'))) {
      score += 60;
      matchReasons.push('Category: Anime & Animation');
      matchedConcepts.push('Anime');
    }
  } else if (normQuery === '4k' || normQuery === '4k cinema' || normQuery === 'hdr' || normQuery === 'raw 4k') {
    if (pack.quality === '4K') {
      score += 60;
      matchReasons.push('Category: 4K Cinema');
      matchedConcepts.push('4K');
    }
  } else if (normQuery === 'game' || normQuery === 'games' || normQuery === '3d') {
    if (pack.mediaType === 'game' || (pack.category && pack.category.toLowerCase().includes('game'))) {
      score += 60;
      matchReasons.push('Category: Games & 3D');
      matchedConcepts.push('Games');
    }
  } else if (normQuery === 'sports' || normQuery === 'athlete' || normQuery === 'football') {
    if (pack.mediaType === 'sports' || (pack.category && pack.category.toLowerCase().includes('sport'))) {
      score += 60;
      matchReasons.push('Category: Sports');
      matchedConcepts.push('Sports');
    }
  }

  // 1. EVALUATE DIRECT EVIDENCE FIRST
  const evidenceAssessment = evaluateSceneEvidence(pack, intent);

  // 2. EXACT TITLE / CHARACTER MATCH (Weight: Up to 50 pts)
  if (mediaTitleLower === normQuery || titleLower === normQuery) {
    const pts = isExactMode ? 50 : 25;
    score += pts;
    matchReasons.push('Exact title match');
    matchedConcepts.push(pack.mediaTitle);
  } else if (mediaTitleLower.includes(normQuery) || normQuery.includes(mediaTitleLower)) {
    const pts = isExactMode ? 35 : 18;
    score += pts;
    matchReasons.push('Title containment match');
    matchedConcepts.push(pack.mediaTitle);
  }

  // Multi-query title matching
  for (const mq of intent.multiQueries) {
    if (mq.length > 3 && (mediaTitleLower.includes(mq) || titleLower.includes(mq))) {
      score += 15;
      break;
    }
  }

  // 3. CHARACTER & ACTOR MATCH (Weight: Up to 35 pts)
  if (characterLower && (characterLower === normQuery || normQuery.includes(characterLower) || (intent.character && characterLower.includes(intent.character.toLowerCase())))) {
    score += 35;
    matchReasons.push(`Character match (${pack.characterName})`);
    matchedConcepts.push(pack.characterName!);
  }

  if (actorLower && (actorLower === normQuery || normQuery.includes(actorLower) || (intent.actor && actorLower.includes(intent.actor.toLowerCase())))) {
    score += 25;
    matchReasons.push(`Actor match (${pack.actorName})`);
    matchedConcepts.push(pack.actorName!);
  }

  // 4. VERIFIED SCENE EVIDENCE BOOST (Weight: +35 pts)
  if (evidenceAssessment.isExactSceneVerified) {
    score += 35;
    matchReasons.push(evidenceAssessment.whyMatchedSummary);
  } else if (evidenceAssessment.matchType === 'likely_pack') {
    score += 15;
    matchReasons.push(evidenceAssessment.whyMatchedSummary);
  }

  // 5. CONCEPT & TAG OVERLAP (Weight: Up to 25 pts)
  let tagMatches = 0;
  const queryConcepts = [
    ...intent.emotions,
    ...intent.events,
    ...intent.visuals,
    ...intent.tropes,
    ...intent.editVibes,
    ...intent.expandedKeywords
  ];

  for (const concept of queryConcepts) {
    const conceptLower = concept.toLowerCase();
    if (allPackTags.some(t => t.includes(conceptLower) || conceptLower.includes(t)) ||
        descLower.includes(conceptLower) ||
        titleLower.includes(conceptLower)) {
      tagMatches++;
      matchedConcepts.push(concept);
    }
  }

  if (tagMatches > 0) {
    const tagWeight = isExactMode ? 10 : 25;
    const tagScore = Math.min(tagWeight, tagMatches * (isExactMode ? 3 : 5));
    score += tagScore;
    matchReasons.push(`${tagMatches} scene vibe & concept tags matched`);
  }

  // 6. VECTOR EMBEDDING SIMILARITY (Weight: Up to 15 pts)
  if (pack.embedding && pack.embedding.length > 0) {
    const queryVec = generateLocalEmbedding(`${intent.normalizedQuery} ${queryConcepts.join(' ')}`);
    const similarity = cosineSimilarity(queryVec, pack.embedding);
    if (similarity > 0.3) {
      const vecScore = Math.round(similarity * 15);
      score += vecScore;
      matchReasons.push(`Semantic concept similarity (${Math.round(similarity * 100)}%)`);
    }
  }

  // 7. METADATA QUALITY & FRESHNESS BONUS
  if (pack.quality === '4K') score += 4;
  else if (pack.quality === '1080p') score += 2;
  if (pack.thumbnailUrl && !pack.thumbnailUrl.includes('placeholder')) score += 2;
  if (pack.popularity && pack.popularity > 80) score += 2;

  // Confidence assignment
  let confidence: ConfidenceLevel = 'RELATED';
  if (evidenceAssessment.isExactSceneVerified || score >= 50 || (isExactMode && score >= 35)) {
    confidence = 'BEST MATCH';
  } else if (score >= 22) {
    confidence = 'LIKELY MATCH';
  } else {
    confidence = 'RELATED';
  }

  // Group Category
  let groupCategory = 'RELATED SCENES';
  if (matchedConcepts.some(c => /grief|funeral|loss|mourn/i.test(c))) groupCategory = 'GRIEF / LOSS';
  else if (matchedConcepts.some(c => /breakup|heartbreak|reject/i.test(c))) groupCategory = 'BREAKUPS';
  else if (matchedConcepts.some(c => /betray|backstab|traitor/i.test(c))) groupCategory = 'BETRAYAL';
  else if (matchedConcepts.some(c => /revenge|avenge|vendetta/i.test(c))) groupCategory = 'REVENGE';
  else if (matchedConcepts.some(c => /villain|evil|mastermind/i.test(c))) groupCategory = 'VILLAIN MOMENTS';
  else if (matchedConcepts.some(c => /badass|walk|slow motion|entrance|aura/i.test(c))) groupCategory = 'CONFIDENCE & ENTRANCES';
  else if (matchedConcepts.some(c => /lonely|alone|night/i.test(c))) groupCategory = 'LONELINESS & NIGHT';
  else if (matchedConcepts.some(c => /romance|kiss|love|tension|staring/i.test(c))) groupCategory = 'ROMANTIC TENSION';
  else if (matchedConcepts.some(c => /reunion|hug|return/i.test(c))) groupCategory = 'EMOTIONAL REUNIONS';
  else if (matchedConcepts.some(c => /fight|action|combat|blood/i.test(c))) groupCategory = 'FIGHTS & ACTION';
  else if (matchedConcepts.some(c => /mother|father|family|daughter|son|dinner/i.test(c))) groupCategory = 'FAMILY DYNAMICS';

  return {
    ...pack,
    relevanceScore: Math.min(100, Math.round(score)),
    confidence,
    matchType: evidenceAssessment.matchType,
    evidence: evidenceAssessment.evidence,
    isExactSceneVerified: evidenceAssessment.isExactSceneVerified,
    matchedConcepts: Array.from(new Set(matchedConcepts)),
    matchReasons: Array.from(new Set(matchReasons)),
    groupCategory,
  };
}

export function filterPacks(packs: Pack[], filters?: SearchFilterState): Pack[] {
  if (!filters) return packs;

  return packs.filter((pack) => {
    // Match Type Filter
    if (filters.matchType) {
      // Checked dynamically after scoring or in search service
    }

    // Media Type filter
    if (filters.mediaTypes && filters.mediaTypes.length > 0) {
      if (!filters.mediaTypes.includes(pack.mediaType)) return false;
    }

    // Source filter
    if (filters.sources && filters.sources.length > 0) {
      if (!filters.sources.includes(pack.sourceId)) return false;
    }

    // Quality filter
    if (filters.qualities && filters.qualities.length > 0) {
      if (!filters.qualities.includes(pack.quality)) return false;
    }

    // Year min/max
    if (filters.yearMin && pack.year && pack.year < filters.yearMin) return false;
    if (filters.yearMax && pack.year && pack.year > filters.yearMax) return false;

    // Codec filter
    if (filters.codec && filters.codec.length > 0) {
      if (!pack.codec || !filters.codec.includes(pack.codec)) return false;
    }

    // Mood / Vibe filter
    if (filters.moods && filters.moods.length > 0) {
      const allTags = [...(pack.tags || []), ...(pack.vibeTags || [])].map(t => t.toLowerCase());
      const hasMood = filters.moods.some(m => allTags.includes(m.toLowerCase()));
      if (!hasMood) return false;
    }

    // Character filter
    if (filters.character && pack.characterName) {
      if (!pack.characterName.toLowerCase().includes(filters.character.toLowerCase())) return false;
    }

    // Actor filter
    if (filters.actor && pack.actorName) {
      if (!pack.actorName.toLowerCase().includes(filters.actor.toLowerCase())) return false;
    }

    return true;
  });
}

export function deduplicateAndGroup(scoredPacks: ScoredPack[]): GroupedMediaPacks[] {
  const groups: Record<string, ScoredPack[]> = {};

  for (const pack of scoredPacks) {
    const key = `${pack.mediaTitle}_${pack.year || 'unknown'}`.toLowerCase();
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(pack);
  }

  const result: GroupedMediaPacks[] = [];

  for (const key in groups) {
    const packs = groups[key].sort((a, b) => b.relevanceScore - a.relevanceScore);
    const bestPack = packs[0];
    const uniqueCharacters = new Set(packs.map(p => p.characterName).filter(Boolean));
    const uniqueSources = Array.from(new Set(packs.map(p => p.sourceId)));

    result.push({
      mediaTitle: bestPack.mediaTitle,
      year: bestPack.year,
      mediaType: bestPack.mediaType,
      thumbnailUrl: bestPack.thumbnailUrl,
      characterCount: uniqueCharacters.size,
      totalPacks: packs.length,
      availableSources: uniqueSources,
      bestPack,
      packs,
    });
  }

  return result.sort((a, b) => b.bestPack.relevanceScore - a.bestPack.relevanceScore);
}
