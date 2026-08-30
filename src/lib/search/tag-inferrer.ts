import { Pack } from '../types';
import { CONCEPT_DICTIONARY } from './synonym-dictionary';

export interface InferredTags {
  emotions: string[];
  events: string[];
  visuals: string[];
  relationships: string[];
  editVibes: string[];
  tropes: string[];
  allTags: string[];
}

export function inferPackTags(pack: Partial<Pack>): InferredTags {
  const textBlob = [
    pack.title || '',
    pack.mediaTitle || '',
    pack.characterName || '',
    pack.actorName || '',
    pack.description || '',
    pack.category || '',
    ...(pack.tags || []),
    ...(pack.vibeTags || [])
  ].join(' ').toLowerCase();

  const emotions = new Set<string>();
  const events = new Set<string>();
  const visuals = new Set<string>();
  const relationships = new Set<string>();
  const editVibes = new Set<string>();
  const tropes = new Set<string>();

  for (const [key, concept] of Object.entries(CONCEPT_DICTIONARY)) {
    let matched = false;
    if (textBlob.includes(concept.canonical)) {
      matched = true;
    } else {
      for (const syn of concept.synonyms) {
        if (textBlob.includes(syn)) {
          matched = true;
          break;
        }
      }
    }

    if (matched) {
      switch (concept.category) {
        case 'emotion':
          emotions.add(concept.canonical);
          break;
        case 'event':
          events.add(concept.canonical);
          break;
        case 'visual':
          visuals.add(concept.canonical);
          break;
        case 'relationship':
          relationships.add(concept.canonical);
          break;
        case 'editVibe':
          editVibes.add(concept.canonical);
          break;
        case 'trope':
        case 'character':
          tropes.add(concept.canonical);
          break;
      }
    }
  }

  const allTags = Array.from(new Set([
    ...Array.from(emotions),
    ...Array.from(events),
    ...Array.from(visuals),
    ...Array.from(relationships),
    ...Array.from(editVibes),
    ...Array.from(tropes),
    ...(pack.tags || [])
  ]));

  return {
    emotions: Array.from(emotions),
    events: Array.from(events),
    visuals: Array.from(visuals),
    relationships: Array.from(relationships),
    editVibes: Array.from(editVibes),
    tropes: Array.from(tropes),
    allTags,
  };
}
