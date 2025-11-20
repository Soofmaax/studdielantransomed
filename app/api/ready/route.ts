import { NextResponse } from 'next/server';

import db from '@/lib/prisma';

export async function GET(): Promise<NextResponse> {
  try {
    // Simple DB check; avoid heavy queries
    await db.$queryRaw`SELECT 1`;

    return NextResponse.json({
      status: 'ready',
      db: 'ok',
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({
      status: 'degraded',
      db: 'error',
      timestamp: new Date().toISOString(),
    }, { status: 503 });
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';