import { NextRequest, NextResponse } from 'next/server';
import { MOCK_PACKS } from '@/lib/db/mock-db';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const pack = MOCK_PACKS.find(p => p.id === id);

  if (!pack) {
    return NextResponse.json({ error: 'Pack not found' }, { status: 404 });
  }

  // Find alternative packs for the same movie/character across other sources
  const alternatives = MOCK_PACKS.filter(
    p => p.id !== id && p.mediaTitle.toLowerCase() === pack.mediaTitle.toLowerCase()
  );

  return NextResponse.json({
    pack,
    alternatives,
  });
}
