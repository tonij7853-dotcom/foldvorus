import { NextRequest, NextResponse } from 'next/server';
import { resolveDownloadTarget } from '@/lib/download/resolver';
import { MOCK_PACKS } from '@/lib/db/mock-db';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const packId = searchParams.get('packId');
    const url = searchParams.get('url');

    let targetUrl = url;

    if (packId && !targetUrl) {
      const pack = MOCK_PACKS.find(p => p.id === packId || p.externalId === packId);
      if (pack) {
        targetUrl = pack.downloadPageUrl || pack.sourceUrl;
      }
    }

    if (!targetUrl) {
      return NextResponse.json({ error: 'Missing packId or url parameter.' }, { status: 400 });
    }

    const result = await resolveDownloadTarget(targetUrl, packId || undefined);
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Resolution failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { url, packId, forceFresh } = await req.json();

    if (!url && !packId) {
      return NextResponse.json({ error: 'Please provide a valid URL or pack ID.' }, { status: 400 });
    }

    let targetUrl = url;
    if (packId && !targetUrl) {
      const pack = MOCK_PACKS.find(p => p.id === packId || p.externalId === packId);
      if (pack) {
        targetUrl = pack.downloadPageUrl || pack.sourceUrl;
      }
    }

    const result = await resolveDownloadTarget(targetUrl, packId, { forceFresh: !!forceFresh });
    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Resolution failed' }, { status: 500 });
  }
}
