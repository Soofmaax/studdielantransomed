import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { ApiErrorHandler } from '@/lib/api/error-handler';

/**
 * GET /api/bookings
 * Returns bookings with related course and user for calendar display.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const bookings = await prisma.booking.findMany({
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        course: {
          select: { id: true, title: true, duration: true },
        },
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json(bookings, { status: 200 });
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';