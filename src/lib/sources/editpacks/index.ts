import { BaseSourceAdapter, AdapterSearchResult, CrawlResult } from '../base-adapter';
import { Pack, SourceId } from '../../types';

export class EditPacksAdapter extends BaseSourceAdapter {
  readonly sourceId: SourceId = 'editpacks';
  readonly name = 'EditPacks';
  readonly baseUrl = 'https://editpacks.org';
  readonly badgeName = 'EditPacks';
  readonly badgeColor = 'bg-emerald-950/60 text-emerald-300 border-emerald-700/50';

  async searchSource(query: string, page = 1): Promise<AdapterSearchResult> {
    return { packs: [], totalEstimated: 0 };
  }

  async getPackMetadata(url: string): Promise<Partial<Pack> | null> {
    return null;
  }

  async crawlPublicPages(cursor?: string): Promise<CrawlResult> {
    return { packs: [], hasMore: false };
  }

  normalizeResult(rawData: any): Pack {
    const title = this.sanitizeString(rawData.title || rawData.name || 'Untitled Pack');
    const mediaTitle = this.sanitizeString(rawData.mediaTitle || title.split(/[-–—:]/)[0] || title);

    return {
      id: `editpacks_${rawData.id || rawData.slug || Buffer.from(rawData.url || title).toString('base64').slice(0, 12)}`,
      sourceId: this.sourceId,
      externalId: String(rawData.id || rawData.slug || title),
      title,
      mediaTitle,
      mediaType: rawData.mediaType || 'movie',
      year: rawData.year ? parseInt(String(rawData.year), 10) : undefined,
      characterName: rawData.characterName ? this.sanitizeString(rawData.characterName) : undefined,
      actorName: rawData.actorName ? this.sanitizeString(rawData.actorName) : undefined,
      directorName: rawData.directorName ? this.sanitizeString(rawData.directorName) : undefined,
      creatorName: rawData.creatorName || rawData.uploader || 'EditPacks Archive',
      category: rawData.category || 'Movie Pack',
      quality: rawData.quality || (title.includes('4K') ? '4K' : '1080p'),
      codec: rawData.codec || 'H.264',
      description: this.sanitizeString(rawData.description || `Scenepack for ${title} from EditPacks.org`),
      sourceUrl: this.normalizeUrl(rawData.url || `${this.baseUrl}/pack/${encodeURIComponent(title)}`),
      downloadPageUrl: rawData.downloadUrl ? this.normalizeUrl(rawData.downloadUrl) : undefined,
      thumbnailUrl: rawData.thumbnail || rawData.image || 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=600&auto=format&fit=crop&q=80',
      popularity: rawData.views ? parseInt(String(rawData.views), 10) : 75,
      downloadCount: rawData.downloads ? parseInt(String(rawData.downloads), 10) : undefined,
      publishedAt: rawData.date || new Date().toISOString(),
      indexedAt: new Date().toISOString(),
      lastCheckedAt: new Date().toISOString(),
      isActive: true,
      tags: Array.isArray(rawData.tags) ? rawData.tags.map((t: string) => this.sanitizeString(t).toLowerCase()) : ['editpacks', 'scenepack'],
      vibeTags: Array.isArray(rawData.vibeTags) ? rawData.vibeTags : [],
    };
  }
}
