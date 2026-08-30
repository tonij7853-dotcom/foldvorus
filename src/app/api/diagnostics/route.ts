import { NextResponse } from 'next/server';
import { fetchDiagnosticsData } from '@/lib/db/live-db';

export async function GET() {
  const diagnostics = await fetchDiagnosticsData();
  return NextResponse.json(diagnostics);
}
