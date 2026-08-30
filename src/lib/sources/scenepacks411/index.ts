import { BaseSourceAdapter, AdapterSearchResult, CrawlResult } from '../base-adapter';
import { Pack, SourceId } from '../../types';

export class Scenepacks411Adapter extends BaseSourceAdapter {
  readonly sourceId: SourceId = '411';
  readonly name = '411 Scenepacks';
  readonly baseUrl = 'https://scenepacks.com';
  readonly badgeName = '411 Scenepacks';
  readonly badgeColor = 'bg-blue-900/60 text-blue-300 border-blue-700/50';

  async searchSource(query: string, page = 1): Promise<AdapterSearchResult> {
    try {
      // In production crawler, calls public search endpoint / search page with query
      // Normalizes and returns matching items
      return {
        packs: [],
        totalEstimated: 0,
      };
    } catch (error) {
      console.error(`[411 Adapter] Search failed for query "${query}":`, error);
      return { packs: [], totalEstimated: 0 };
    }
  }

  async getPackMetadata(url: string): Promise<Partial<Pack> | null> {
    try {
      // In production crawler, loads public page and extracts Open Graph / schema / text metadata
      return null;
    } catch (error) {
      console.error(`[411 Adapter] Failed to get metadata for ${url}:`, error);
      return null;
    }
  }

  async crawlPublicPages(cursor?: string): Promise<CrawlResult> {
    try {
      // Respectful cursor/pagination crawl
      return {
        packs: [],
        hasMore: false,
      };
    } catch (error) {
      return {
        packs: [],
        hasMore: false,
        errors: [(error as Error).message],
      };
    }
  }

  normalizeResult(rawData: any): Pack {
    const title = this.sanitizeString(rawData.title || rawData.name || 'Untitled Pack');
    const mediaTitle = this.sanitizeString(rawData.mediaTitle || rawData.movie || title.split(/[-–—:]/)[0] || title);
    const characterName = rawData.characterName || (title.toLowerCase().includes(' - ') ? title.split(' - ')[1] : undefined);
    
    return {
      id: `411_${rawData.id || rawData.slug || Buffer.from(rawData.url || title).toString('base64').slice(0, 12)}`,
      sourceId: this.sourceId,
      externalId: String(rawData.id || rawData.slug || title),
      title,
      mediaTitle,
      mediaType: rawData.mediaType || 'movie',
      year: rawData.year ? parseInt(String(rawData.year), 10) : undefined,
      characterName: characterName ? this.sanitizeString(characterName) : undefined,
      actorName: rawData.actorName ? this.sanitizeString(rawData.actorName) : undefined,
      directorName: rawData.directorName ? this.sanitizeString(rawData.directorName) : undefined,
      creatorName: rawData.creatorName || rawData.uploader || '411 Community',
      category: rawData.category || 'Movie Pack',
      quality: rawData.quality || (title.includes('4K') ? '4K' : title.includes('1080') ? '1080p' : '1080p'),
      codec: rawData.codec || (title.includes('265') || title.includes('HEVC') ? 'H.265 (HEVC)' : 'H.264'),
      description: this.sanitizeString(rawData.description || `Scenepack for ${mediaTitle} on 411 Scenepacks`),
      sourceUrl: this.normalizeUrl(rawData.url || `${this.baseUrl}/pack/${encodeURIComponent(title)}`),
      downloadPageUrl: rawData.downloadUrl ? this.normalizeUrl(rawData.downloadUrl) : undefined,
      thumbnailUrl: rawData.thumbnail || rawData.image || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=600&auto=format&fit=crop&q=80',
      popularity: rawData.views ? parseInt(String(rawData.views), 10) : 85,
      downloadCount: rawData.downloads ? parseInt(String(rawData.downloads), 10) : undefined,
      publishedAt: rawData.date || new Date().toISOString(),
      indexedAt: new Date().toISOString(),
      lastCheckedAt: new Date().toISOString(),
      isActive: true,
      tags: Array.isArray(rawData.tags) ? rawData.tags.map((t: string) => this.sanitizeString(t).toLowerCase()) : ['movie', 'scenepack', 'edit'],
      vibeTags: Array.isArray(rawData.vibeTags) ? rawData.vibeTags : [],
    };
  }
}
