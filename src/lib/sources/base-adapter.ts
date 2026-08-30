import { Pack, Source, SourceId } from '../types';

export interface CrawlResult {
  packs: Partial<Pack>[];
  nextPageUrl?: string;
  hasMore: boolean;
  errors?: string[];
}

export interface AdapterSearchResult {
  packs: Partial<Pack>[];
  totalEstimated?: number;
}

export abstract class BaseSourceAdapter {
  abstract readonly sourceId: SourceId;
  abstract readonly name: string;
  abstract readonly baseUrl: string;
  abstract readonly badgeName: string;
  abstract readonly badgeColor: string;

  /**
   * Search the source using its public search interface or internal indexing endpoint.
   */
  abstract searchSource(query: string, page?: number): Promise<AdapterSearchResult>;

  /**
   * Fetch single pack metadata from a public page URL.
   */
  abstract getPackMetadata(url: string): Promise<Partial<Pack> | null>;

  /**
   * Crawl a batch of public pages respectfully (respecting robots.txt & rate limits).
   */
  abstract crawlPublicPages(cursor?: string): Promise<CrawlResult>;

  /**
   * Normalize raw scraped/API data into standard Pack structure.
   */
  abstract normalizeResult(rawData: any): Pack;

  /**
   * Helper to build standard source definition.
   */
  getSourceInfo(): Source {
    return {
      id: this.sourceId,
      name: this.name,
      baseUrl: this.baseUrl,
      badgeName: this.badgeName,
      badgeColor: this.badgeColor,
      enabled: true,
    };
  }

  /**
   * Sanitizer to avoid XSS and malformed URLs.
   */
  protected sanitizeString(input?: string): string {
    if (!input) return '';
    return input
      .replace(/<[^>]*>?/gm, '') // Strip HTML tags
      .replace(/\s+/g, ' ')
      .trim();
  }

  protected normalizeUrl(url?: string): string {
    if (!url) return '';
    try {
      const parsed = new URL(url, this.baseUrl);
      return parsed.toString();
    } catch {
      return url.trim();
    }
  }
}
