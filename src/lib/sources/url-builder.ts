import { SourceId } from '../types';

/**
 * Builds direct, verified links to original source websites based on live site structures.
 */
export function getDirectSourceUrl(
  sourceId: SourceId, 
  mediaTitle: string, 
  characterName?: string, 
  externalId?: string
): string {
  const query = characterName ? `${mediaTitle} ${characterName}` : mediaTitle;
  const encoded = encodeURIComponent(query);

  switch (sourceId) {
    case '411':
      // 411 Scenepacks (scenepacks.com)
      if (externalId && /^\d+$/.test(externalId)) {
        return `https://scenepacks.com/scps/${externalId}`;
      }
      return `https://scenepacks.com/?search=${encoded}`;

    case 'veel':
      // Veel Scenepacks (veelscp.com)
      return `https://veelscp.com/?s=${encodeURIComponent(mediaTitle)}`;

    case 'editpacks':
      // EditPacks (editpacks.org)
      return `https://editpacks.org/?s=${encodeURIComponent(mediaTitle)}`;

    case 'suits':
      // SuitsTM (suitstmscenepacks.com)
      if (externalId && externalId.includes('-')) {
        return `https://suitstmscenepacks.com/content/${externalId}`;
      }
      return `https://suitstmscenepacks.com/?s=${encodeURIComponent(mediaTitle)}`;

    default:
      return 'https://scenepacks.com/';
  }
}
