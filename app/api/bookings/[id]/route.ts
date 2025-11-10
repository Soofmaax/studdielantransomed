import { NextRequest, NextResponse } from 'next/server';

import { ApiErrorHandler } from '@/lib/api/error-handler';
import { withAdminAuth } from '@/lib/api/auth-middleware';
import { updateBookingSchema } from '@/lib/validations/booking';
import db from '@/lib/prisma';

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

    const booking = await db.booking.findUnique({
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

/**
 * PUT /api/bookings/:id
 * Updates booking fields (admin only).
 */
export const PUT = withAdminAuth(async (request: NextRequest, _auth, { params }: Params): Promise<NextResponse> => {
  try {
    const { id } = params;
    if (!id) {
      throw ApiErrorHandler.badRequest('ID de réservation requis');
    }

    const body = await request.json();
    const data = updateBookingSchema.parse(body);

    const updateData: any = { ...data };
    if (data.amount !== undefined) {
      updateData.amount = data.amount;
    }
    if (data.date !== undefined) {
      updateData.date = new Date(data.date);
    }

    const booking = await db.booking.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';