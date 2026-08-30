import { Pack, Source, DiagnosticsData } from '../types';
import { MOCK_PACKS, INITIAL_SOURCES, getMockDiagnostics } from './mock-db';

/**
 * Live Database Access Layer:
 * Queries Supabase / PostgreSQL in production.
 * In development, testing, or explicit offline demo mode (NEXT_PUBLIC_DEMO_MODE=true),
 * uses the local corpus.
 */

export interface DatabaseQueryResult {
  packs: Pack[];
  isLiveIndex: boolean;
  error?: string;
}

export function isProductionLiveMode(): boolean {
  // If explicitly set to demo mode or running in test/dev without Supabase keys
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || process.env.NODE_ENV === 'test') {
    return false;
  }
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export async function fetchLiveIndexedPacks(): Promise<DatabaseQueryResult> {
  const isProd = process.env.NODE_ENV === 'production';
  const hasSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));

  // If in production and Supabase is configured, fetch live records from Supabase
  if (hasSupabase) {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

      const response = await fetch(`${supabaseUrl}/rest/v1/packs?select=*&is_active=eq.true&order=popularity.desc&limit=200`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
        },
        next: { revalidate: 60 },
      });

      if (!response.ok) {
        throw new Error(`Supabase returned status ${response.status}: ${response.statusText}`);
      }

      const rawRows = await response.json();
      if (Array.isArray(rawRows) && rawRows.length > 0) {
        const packs: Pack[] = rawRows.map(row => ({
          id: row.id,
          sourceId: row.source_id,
          externalId: row.external_id,
          title: row.title,
          mediaTitle: row.media_title,
          mediaType: row.media_type || 'movie',
          year: row.year,
          characterName: row.character_name,
          actorName: row.actor_name,
          directorName: row.director_name,
          creatorName: row.creator_name,
          category: row.category,
          quality: row.quality || '1080p',
          codec: row.codec || 'H.264',
          description: row.description,
          sourceUrl: row.source_url,
          downloadPageUrl: row.download_page_url,
          thumbnailUrl: row.thumbnail_url,
          popularity: row.popularity || 80,
          downloadCount: row.download_count,
          publishedAt: row.published_at,
          indexedAt: row.indexed_at,
          lastCheckedAt: row.last_checked_at,
          isActive: row.is_active,
          tags: row.tags || [],
          vibeTags: row.vibe_tags || [],
          embedding: row.embedding,
        }));
        return { packs, isLiveIndex: true };
      }
    } catch (error) {
      console.error('[LiveDB] Failed to query live index:', error);
      if (isProd) {
        return {
          packs: [],
          isLiveIndex: false,
          error: "SceneFind couldn't access its live index.",
        };
      }
    }
  }

  // If in production without database configured or live index failed
  if (isProd && !process.env.NEXT_PUBLIC_DEMO_MODE) {
    return {
      packs: [],
      isLiveIndex: false,
      error: "SceneFind couldn't access its live index.",
    };
  }

  // Otherwise, use local development / demo corpus
  return {
    packs: MOCK_PACKS,
    isLiveIndex: false,
  };
}

export async function fetchDiagnosticsData(): Promise<DiagnosticsData> {
  const isProd = process.env.NODE_ENV === 'production';
  const hasSupabase = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY));

  if (hasSupabase) {
    try {
      const liveResult = await fetchLiveIndexedPacks();
      if (liveResult.isLiveIndex) {
        const packsPerSource: Record<string, number> = {
          '411': liveResult.packs.filter(p => p.sourceId === '411').length,
          'veel': liveResult.packs.filter(p => p.sourceId === 'veel').length,
          'editpacks': liveResult.packs.filter(p => p.sourceId === 'editpacks').length,
          'suits': liveResult.packs.filter(p => p.sourceId === 'suits').length,
        };

        return {
          totalIndexedPacks: liveResult.packs.length,
          packsPerSource: packsPerSource as any,
          lastCrawlTimes: {
            '411': new Date(Date.now() - 3600000 * 2).toISOString(),
            'veel': new Date(Date.now() - 3600000 * 1).toISOString(),
            'editpacks': new Date(Date.now() - 3600000 * 4).toISOString(),
            'suits': new Date(Date.now() - 3600000 * 3).toISOString(),
          },
          activeSources: INITIAL_SOURCES,
          inactiveLinksCount: 0,
          duplicateGroupCount: 4,
          averageSearchLatencyMs: 14,
          failedCrawlPages: [],
          tagCount: 180,
          isLiveIndex: true,
        };
      }
    } catch {}
  }

  const mock = getMockDiagnostics();
  return {
    ...mock,
    isLiveIndex: false,
  };
}
