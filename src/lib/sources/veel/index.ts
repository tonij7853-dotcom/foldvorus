import { BaseSourceAdapter, AdapterSearchResult, CrawlResult } from '../base-adapter';
import { Pack, SourceId } from '../../types';

export class VeelAdapter extends BaseSourceAdapter {
  readonly sourceId: SourceId = 'veel';
  readonly name = 'Veel Scenepacks';
  readonly baseUrl = 'https://veelscp.com';
  readonly badgeName = 'Veel Scenepacks';
  readonly badgeColor = 'bg-pink-950/60 text-pink-300 border-pink-700/50';

  async searchSource(query: string, page = 1): Promise<AdapterSearchResult> {
    try {
      return { packs: [], totalEstimated: 0 };
    } catch (error) {
      console.error(`[Veel Adapter] Search failed for "${query}":`, error);
      return { packs: [], totalEstimated: 0 };
    }
  }

  async getPackMetadata(url: string): Promise<Partial<Pack> | null> {
    return null;
  }

  async crawlPublicPages(cursor?: string): Promise<CrawlResult> {
    return { packs: [], hasMore: false };
  }

  normalizeResult(rawData: any): Pack {
    const title = this.sanitizeString(rawData.title || rawData.name || 'Untitled Pack');
    const mediaTitle = this.sanitizeString(rawData.mediaTitle || rawData.movie || title.split(/[-–—:]/)[0] || title);
    
    return {
      id: `veel_${rawData.id || rawData.slug || Buffer.from(rawData.url || title).toString('base64').slice(0, 12)}`,
      sourceId: this.sourceId,
      externalId: String(rawData.id || rawData.slug || title),
      title,
      mediaTitle,
      mediaType: rawData.mediaType || 'movie',
      year: rawData.year ? parseInt(String(rawData.year), 10) : undefined,
      characterName: rawData.characterName ? this.sanitizeString(rawData.characterName) : undefined,
      actorName: rawData.actorName ? this.sanitizeString(rawData.actorName) : undefined,
      directorName: rawData.directorName ? this.sanitizeString(rawData.directorName) : undefined,
      creatorName: rawData.creatorName || rawData.uploader || 'Veel SCP',
      category: rawData.category || 'Movie Pack',
      quality: rawData.quality || (title.includes('4K') ? '4K' : '1080p'),
      codec: rawData.codec || (title.includes('HEVC') || title.includes('265') ? 'H.265 (HEVC)' : 'H.264'),
      description: this.sanitizeString(rawData.description || `High quality scenepack for ${title} from Veel SCP`),
      sourceUrl: this.normalizeUrl(rawData.url || `${this.baseUrl}/pack/${encodeURIComponent(title)}`),
      downloadPageUrl: rawData.downloadUrl ? this.normalizeUrl(rawData.downloadUrl) : undefined,
      thumbnailUrl: rawData.thumbnail || rawData.image || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=600&auto=format&fit=crop&q=80',
      popularity: rawData.views ? parseInt(String(rawData.views), 10) : 90,
      downloadCount: rawData.downloads ? parseInt(String(rawData.downloads), 10) : undefined,
      publishedAt: rawData.date || new Date().toISOString(),
      indexedAt: new Date().toISOString(),
      lastCheckedAt: new Date().toISOString(),
      isActive: true,
      tags: Array.isArray(rawData.tags) ? rawData.tags.map((t: string) => this.sanitizeString(t).toLowerCase()) : ['veel', 'scenepack', 'edit'],
      vibeTags: Array.isArray(rawData.vibeTags) ? rawData.vibeTags : [],
    };
  }
}
