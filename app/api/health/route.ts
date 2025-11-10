import { NextResponse } from 'next/server';

export async function GET(): Promise<NextResponse> {
  return NextResponse.json({
    status: 'ok',
    service: 'studio-elan',
    timestamp: new Date().toISOString(),
  });
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';