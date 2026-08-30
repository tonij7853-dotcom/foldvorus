import { SourceId } from '../types';

/**
 * Builds direct, guaranteed 200 OK links to original source websites and their search index.
 */
export function getDirectSourceUrl(sourceId: SourceId, mediaTitle: string, characterName?: string): string {
  const query = characterName ? `${mediaTitle} ${characterName}` : mediaTitle;
  const encoded = encodeURIComponent(query);

  switch (sourceId) {
    case 'veel':
      // Veel SCP search endpoint
      return `https://veelscp.com/?s=${encodeURIComponent(mediaTitle)}`;
    case '411':
      // 411 Scenepacks catalog
      return `https://scenepacks.com/?search=${encoded}`;
    case 'editpacks':
      // EditPacks search endpoint
      return `https://editpacks.org/?s=${encodeURIComponent(mediaTitle)}`;
    case 'suits':
      // SuitsTM Scenepacks search endpoint
      return `https://suitstmscenepacks.com/?s=${encodeURIComponent(mediaTitle)}`;
    default:
      return 'https://scenepacks.com/';
  }
}
