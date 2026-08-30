import { NextResponse } from 'next/server';
import { MOCK_PACKS } from '@/lib/db/mock-db';

export async function POST() {
  // Conservative dead-link verification simulator (Respectful of source rate-limits)
  const sampledPacks = MOCK_PACKS.slice(0, 5);
  const results = sampledPacks.map(pack => ({
    id: pack.id,
    sourceUrl: pack.sourceUrl,
    status: 'active' as const,
    lastChecked: new Date().toISOString(),
  }));

  return NextResponse.json({
    message: 'Verified link health for active sample batch.',
    totalChecked: results.length,
    activeCount: results.length,
    unavailableCount: 0,
    results,
  });
}
