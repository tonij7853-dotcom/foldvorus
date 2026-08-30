import { NextRequest, NextResponse } from 'next/server';
import { executeSearch } from '@/lib/search/search-service';
import { SearchMode, SearchFilterState } from '@/lib/types';

export const dynamic = 'force-dynamic';

// Simple in-memory token bucket rate-limiter
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 60; // 60 requests per minute
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return true;
  }

  entry.count++;
  return false;
}

export async function GET(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || '127.0.0.1';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: 'Too many requests. Please slow down.' },
        { status: 429 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || '').trim();
    const mode = (searchParams.get('mode') || 'all') as SearchMode;

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required.' },
        { status: 400 }
      );
    }

    // Parse filters
    const mediaTypes = searchParams.get('mediaTypes')?.split(',') as any;
    const qualities = searchParams.get('qualities')?.split(',') as any;
    const sources = searchParams.get('sources')?.split(',') as any;
    const codecs = searchParams.get('codecs')?.split(',') as any;
    const moods = searchParams.get('moods')?.split(',');
    const yearMin = searchParams.get('yearMin') ? parseInt(searchParams.get('yearMin')!, 10) : undefined;
    const yearMax = searchParams.get('yearMax') ? parseInt(searchParams.get('yearMax')!, 10) : undefined;
    const character = searchParams.get('character') || undefined;
    const actor = searchParams.get('actor') || undefined;

    const filters: SearchFilterState = {
      mediaTypes: mediaTypes?.filter(Boolean),
      qualities: qualities?.filter(Boolean),
      sources: sources?.filter(Boolean),
      codec: codecs?.filter(Boolean),
      moods: moods?.filter(Boolean),
      yearMin,
      yearMax,
      character,
      actor,
    };

    const result = await executeSearch(query, mode, filters);

    return NextResponse.json(result);
  } catch (error) {
    console.error('[API /api/search] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error while executing search.' },
      { status: 500 }
    );
  }
}
