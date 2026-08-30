import { QueryIntent, SearchMode } from '../types';
import { CONCEPT_DICTIONARY, COMMON_TYPOS } from './synonym-dictionary';

// Known entities for entity recognition
const KNOWN_ENTITIES: { name: string; type: 'media' | 'character' | 'actor'; canonical: string; year?: number }[] = [
  { name: 'cruella', type: 'media', canonical: 'Cruella', year: 2021 },
  { name: 'estella', type: 'character', canonical: 'Estella' },
  { name: 'baroness', type: 'character', canonical: 'Baroness von Hellman' },
  { name: 'spider-man', type: 'media', canonical: 'Spider-Man' },
  { name: 'spiderman', type: 'media', canonical: 'Spider-Man' },
  { name: 'peter parker', type: 'character', canonical: 'Peter Parker' },
  { name: 'the batman', type: 'media', canonical: 'The Batman', year: 2022 },
  { name: 'batman', type: 'media', canonical: 'The Batman' },
  { name: 'bruce wayne', type: 'character', canonical: 'Bruce Wayne' },
  { name: 'rue bennett', type: 'character', canonical: 'Rue Bennett' },
  { name: 'rue', type: 'character', canonical: 'Rue Bennett' },
  { name: 'jules vaughn', type: 'character', canonical: 'Jules Vaughn' },
  { name: 'euphoria', type: 'media', canonical: 'Euphoria' },
  { name: 'kendall roy', type: 'character', canonical: 'Kendall Roy' },
  { name: 'logan roy', type: 'character', canonical: 'Logan Roy' },
  { name: 'succession', type: 'media', canonical: 'Succession' },
  { name: 'interstellar', type: 'media', canonical: 'Interstellar', year: 2014 },
  { name: 'cooper', type: 'character', canonical: 'Joseph Cooper' },
  { name: 'murph', type: 'character', canonical: 'Murphy Cooper' },
  { name: 'oppenheimer', type: 'media', canonical: 'Oppenheimer', year: 2023 },
  { name: 'j. robert oppenheimer', type: 'character', canonical: 'J. Robert Oppenheimer' },
  { name: 'breaking bad', type: 'media', canonical: 'Breaking Bad' },
  { name: 'walter white', type: 'character', canonical: 'Walter White' },
  { name: 'jesse pinkman', type: 'character', canonical: 'Jesse Pinkman' },
  { name: 'stranger things', type: 'media', canonical: 'Stranger Things' },
  { name: 'eleven', type: 'character', canonical: 'Eleven' },
  { name: 'steve harrington', type: 'character', canonical: 'Steve Harrington' },
  { name: 'the last of us', type: 'media', canonical: 'The Last of Us' },
  { name: 'joel miller', type: 'character', canonical: 'Joel Miller' },
  { name: 'ellie', type: 'character', canonical: 'Ellie Williams' },
  { name: 'arcane', type: 'media', canonical: 'Arcane' },
  { name: 'jinx', type: 'character', canonical: 'Jinx / Powder' },
  { name: 'vi', type: 'character', canonical: 'Vi' },
  { name: 'peaky blinders', type: 'media', canonical: 'Peaky Blinders' },
  { name: 'thomas shelby', type: 'character', canonical: 'Thomas Shelby' },
  { name: 'la la land', type: 'media', canonical: 'La La Land', year: 2016 },
  { name: 'fight club', type: 'media', canonical: 'Fight Club', year: 1999 },
  { name: 'blade runner 2049', type: 'media', canonical: 'Blade Runner 2049', year: 2017 },
  { name: 'emma stone', type: 'actor', canonical: 'Emma Stone' },
  { name: 'zendaya', type: 'actor', canonical: 'Zendaya' },
  { name: 'cillian murphy', type: 'actor', canonical: 'Cillian Murphy' },
  { name: 'robert pattinson', type: 'actor', canonical: 'Robert Pattinson' },
  { name: 'timothee chalamet', type: 'actor', canonical: 'Timothée Chalamet' },
];

export function normalizeQueryString(raw: string): string {
  let cleaned = raw.toLowerCase().trim();
  for (const [typo, fix] of Object.entries(COMMON_TYPOS)) {
    const regex = new RegExp(`\\b${typo}\\b`, 'gi');
    cleaned = cleaned.replace(regex, fix);
  }
  return cleaned;
}

/**
 * Multi-Query Generation Engine:
 * Transforms natural language requests into rich multi-query variations
 * for deep candidate discovery across databases, plot summaries, and source metadata.
 */
export function generateMultiQueries(normalizedQuery: string, intent: Partial<QueryIntent>): string[] {
  const variations = new Set<string>();
  variations.add(normalizedQuery);

  // 1. Mother/Parent murder reveal variations
  if (
    (normalizedQuery.includes('kill') || normalizedQuery.includes('murder') || normalizedQuery.includes('dead')) &&
    (normalizedQuery.includes('mother') || normalizedQuery.includes('mom') || normalizedQuery.includes('parent') || normalizedQuery.includes('father'))
  ) {
    variations.add("discovers mother's killer");
    variations.add("mother murder reveal");
    variations.add("truth about mother's death");
    variations.add("parent death revelation");
    variations.add("female revenge mother");
    variations.add("family murder secret");
    variations.add("discovers who murdered parent");
    variations.add("confronting parent killer");
  }

  // 2. Friend / Family Betrayal variations
  if (normalizedQuery.includes('betray') || normalizedQuery.includes('backstab') || (normalizedQuery.includes('friend') && normalizedQuery.includes('lied'))) {
    variations.add("friend betrayal revelation");
    variations.add("discovers best friend betrayed");
    variations.add("confronting the traitor");
    variations.add("broken trust friendship");
    variations.add("secret betrayal revealed");
  }

  // 3. Crying alone / bathroom / bedroom breakdown
  if (normalizedQuery.includes('crying') || normalizedQuery.includes('tears') || normalizedQuery.includes('breakdown')) {
    variations.add("girl crying alone in bathroom");
    variations.add("emotional breakdown bedroom");
    variations.add("grief and tears after loss");
    variations.add("crying after losing someone");
    variations.add("sitting alone crying");
  }

  // 4. Badass / villain entrance / aura
  if (normalizedQuery.includes('badass') || normalizedQuery.includes('entrance') || (normalizedQuery.includes('walk') && normalizedQuery.includes('night'))) {
    variations.add("slow motion badass entrance");
    variations.add("confident walking scene");
    variations.add("villain slow smile");
    variations.add("main character entrance aura");
    variations.add("walking through city at night");
  }

  // 5. Romance / eye contact without talking
  if (normalizedQuery.includes('staring') || normalizedQuery.includes('eye contact') || normalizedQuery.includes('look at each other')) {
    variations.add("romantic eye contact without talking");
    variations.add("character staring at someone they love");
    variations.add("unspoken romantic tension stare");
    variations.add("bittersweet look goodbye");
  }

  // 6. Screaming in rain / despair
  if (normalizedQuery.includes('rain') || (normalizedQuery.includes('scream') && normalizedQuery.includes('despair'))) {
    variations.add("guy screaming in the rain");
    variations.add("screaming in despair grief");
    variations.add("rainstorm breakdown confession");
  }

  // 7. Rich dinner argument
  if (normalizedQuery.includes('dinner') || (normalizedQuery.includes('rich') && normalizedQuery.includes('argu'))) {
    variations.add("rich people arguing at dinner");
    variations.add("family dinner screaming match");
    variations.add("luxury corporate betrayal dinner");
  }

  // 8. Covered in blood / fight aftermath
  if (normalizedQuery.includes('blood') || normalizedQuery.includes('covered in blood')) {
    variations.add("girl covered in blood revenge");
    variations.add("fight aftermath covered in blood");
    variations.add("badass bloody walk");
  }

  // 9. Lyric matching expansions
  if (intent.isLyricOrQuote) {
    variations.add("nostalgic sad memories edit");
    variations.add("heartbreak montage clips");
    variations.add("lonely reflection sad edit");
  }

  // Add entity combinations
  if (intent.mediaTitle) {
    variations.add(`${intent.mediaTitle} scene pack`);
    variations.add(`${intent.mediaTitle} 4K`);
  }
  if (intent.character) {
    variations.add(`${intent.character} scenes`);
  }

  return Array.from(variations);
}

export function parseQueryIntent(rawQuery: string, requestedMode: SearchMode = 'all'): QueryIntent {
  const normalized = normalizeQueryString(rawQuery);
  const words = normalized.split(/\s+/).filter(Boolean);

  let detectedMode: SearchMode = 'vibe';
  let mediaTitle: string | undefined;
  let character: string | undefined;
  let actor: string | undefined;
  let year: number | undefined;
  let gender: 'female' | 'male' | 'non-binary' | undefined;

  const emotions = new Set<string>();
  const events = new Set<string>();
  const visuals = new Set<string>();
  const relationships = new Set<string>();
  const tropes = new Set<string>();
  const editVibes = new Set<string>();
  const genres = new Set<string>();
  const expandedKeywords = new Set<string>();
  const expandedSearchPhrases = new Set<string>();

  // Check for year
  const yearMatch = normalized.match(/\b(19\d{2}|20\d{2})\b/);
  if (yearMatch) {
    year = parseInt(yearMatch[1], 10);
  }

  // Detect gender
  if (/\b(girl|woman|she|her|female|mother|mom|sister|daughter|lady)\b/.test(normalized)) {
    gender = 'female';
    expandedKeywords.add('female');
  } else if (/\b(guy|man|he|him|male|father|dad|brother|son|boy)\b/.test(normalized)) {
    gender = 'male';
    expandedKeywords.add('male');
  }

  // Lyric or quote detection
  const isLyricOrQuote = 
    normalized.includes('lyrics:') || 
    normalized.includes('match these lyrics') || 
    normalized.includes('i still see you') || 
    normalized.startsWith('i wish ') || 
    normalized.startsWith('when you ') ||
    (normalized.includes('"') && words.length > 4);

  // Check exact entities
  let entityFound = false;
  for (const entity of KNOWN_ENTITIES) {
    const regex = new RegExp(`\\b${entity.name}\\b`, 'i');
    if (regex.test(normalized)) {
      entityFound = true;
      if (entity.type === 'media' && !mediaTitle) {
        mediaTitle = entity.canonical;
        if (entity.year && !year) year = entity.year;
      } else if (entity.type === 'character' && !character) {
        character = entity.canonical;
      } else if (entity.type === 'actor' && !actor) {
        actor = entity.canonical;
      }
    }
  }

  const naturalLanguageIndicators = [
    'find me', 'clips', 'scene', 'scenes', 'someone', 'girl', 'guy', 'after', 
    'because', 'who', 'their', 'when', 'that would work', 'like', 'in the rain',
    'looking at', 'reveals', 'realizes', 'realises', 'walking', 'crying', 'sad edit',
    'covered in', 'staring at', 'arguing at', 'discovers', 'finds out', 'lyrics'
  ];
  const hasNaturalIndicator = naturalLanguageIndicators.some(ind => normalized.includes(ind));

  if (!hasNaturalIndicator && entityFound && words.length <= 4) {
    detectedMode = 'exact';
  } else if (requestedMode === 'exact') {
    detectedMode = 'exact';
  } else {
    detectedMode = 'vibe';
  }

  // Concept dictionary matching
  for (const [key, concept] of Object.entries(CONCEPT_DICTIONARY)) {
    let matched = false;
    if (normalized.includes(concept.canonical)) matched = true;
    if (!matched) {
      for (const syn of concept.synonyms) {
        if (normalized.includes(syn)) {
          matched = true;
          break;
        }
      }
    }

    if (matched) {
      concept.expandedTags.forEach(t => expandedKeywords.add(t));
      switch (concept.category) {
        case 'emotion': emotions.add(concept.canonical); break;
        case 'event': events.add(concept.canonical); break;
        case 'visual': visuals.add(concept.canonical); break;
        case 'relationship': relationships.add(concept.canonical); break;
        case 'trope': tropes.add(concept.canonical); break;
        case 'editVibe': editVibes.add(concept.canonical); break;
        case 'character': tropes.add(concept.canonical); break;
        case 'genre': genres.add(concept.canonical); break;
      }
      concept.suggestedThemes.forEach(theme => expandedSearchPhrases.add(theme));
    }
  }

  // Universal Search-Anything Scene Concepts Extractions
  // 1. Mother / Parent murder reveal
  if (
    (normalized.includes('killed') || normalized.includes('murder') || normalized.includes('dead')) &&
    (normalized.includes('mother') || normalized.includes('mom') || normalized.includes('parent') || normalized.includes('father'))
  ) {
    events.add('murder discovery');
    tropes.add('revenge');
    tropes.add('family secret');
    emotions.add('grief');
    emotions.add('shock');
    emotions.add('betrayal');
    expandedKeywords.add('mother');
    expandedKeywords.add('revenge');
    expandedKeywords.add('discovery');
    expandedKeywords.add('realization');
    expandedKeywords.add('betrayal');
    expandedKeywords.add('murder');
    expandedKeywords.add('grief');
  }

  // 2. Girl crying in bathroom / bedroom
  if (normalized.includes('bathroom') || normalized.includes('bedroom')) {
    visuals.add('interior');
    if (normalized.includes('crying') || normalized.includes('breakdown')) {
      events.add('panic attack');
      emotions.add('sadness');
      emotions.add('loneliness');
    }
  }

  // 3. Staring at someone you love / romantic eye contact
  if (normalized.includes('staring') || normalized.includes('eye contact') || (normalized.includes('look') && normalized.includes('love'))) {
    relationships.add('romance');
    emotions.add('romance');
    tropes.add('unspoken love');
    expandedKeywords.add('eye contact');
    expandedKeywords.add('romantic tension');
  }

  // 4. Rich people arguing at dinner
  if (normalized.includes('dinner') || (normalized.includes('rich') && normalized.includes('argu'))) {
    events.add('argument');
    visuals.add('party');
    tropes.add('family conflict');
    expandedKeywords.add('luxury');
    expandedKeywords.add('screaming match');
  }

  // 5. Covered in blood
  if (normalized.includes('blood') || normalized.includes('covered in blood')) {
    visuals.add('blood');
    tropes.add('badass');
    editVibes.add('velocity');
    expandedKeywords.add('blood');
    expandedKeywords.add('violent revenge');
  }

  // 6. Emotional clips & sad edits
  if (normalized.includes('emotional') || normalized.includes('sad clips') || normalized.includes('sad edit')) {
    emotions.add('sadness');
    emotions.add('grief');
    emotions.add('heartbreak');
    editVibes.add('sad edit');
    ['crying', 'grief', 'loss', 'heartbreak', 'goodbye', 'death', 'loneliness', 'regret', 'betrayal', 'reunion', 'confession'].forEach(k => expandedKeywords.add(k));
  }

  // 7. Confident entrance & badass walk
  if (normalized.includes('entrance') || normalized.includes('confident') || normalized.includes('badass')) {
    emotions.add('confidence');
    tropes.add('badass');
    visuals.add('walking');
    editVibes.add('velocity');
    ['badass', 'slow motion', 'walking', 'entrance', 'power', 'aura'].forEach(k => expandedKeywords.add(k));
  }

  // Stop word removal for general keywords
  const stopWords = new Set(['find', 'me', 'clips', 'scene', 'scenes', 'a', 'an', 'the', 'for', 'that', 'would', 'work', 'with', 'in', 'on', 'at', 'after', 'who', 'their', 'someone', 'of', 'and', 'to']);
  words.forEach(w => {
    if (!stopWords.has(w) && w.length > 2) {
      expandedKeywords.add(w);
    }
  });

  const intentPartial: Partial<QueryIntent> = {
    normalizedQuery: normalized,
    mediaTitle,
    character,
    actor,
    isLyricOrQuote,
  };

  const multiQueries = generateMultiQueries(normalized, intentPartial);

  return {
    rawQuery,
    normalizedQuery: normalized,
    searchMode: requestedMode,
    detectedMode,
    mediaTitle,
    character,
    actor,
    year,
    gender,
    emotions: Array.from(emotions),
    events: Array.from(events),
    visuals: Array.from(visuals),
    relationships: Array.from(relationships),
    tropes: Array.from(tropes),
    editVibes: Array.from(editVibes),
    genres: Array.from(genres),
    expandedKeywords: Array.from(expandedKeywords),
    expandedSearchPhrases: Array.from(expandedSearchPhrases),
    multiQueries,
    isLyricOrQuote,
    confidenceScore: detectedMode === 'exact' ? 0.95 : 0.85,
  };
}
