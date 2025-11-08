import { NextRequest, NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { ApiErrorHandler } from '@/lib/api/error-handler';

type Params = { params: { id: string } };

/**
 * GET /api/bookings/:id
 * Returns a single booking with relations.
 */
export async function GET(_req: NextRequest, { params }: Params): Promise<NextResponse> {
  try {
    const { id } = params;
    if (!id) {
      throw ApiErrorHandler.badRequest('ID de réservation requis');
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true, duration: true } },
      },
    });

    if (!booking) {
      throw ApiErrorHandler.notFound('Réservation introuvable');
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';