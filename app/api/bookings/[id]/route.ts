import { NextRequest, NextResponse } from 'next/server';

import { withAuth, withAdminAuth } from '@/lib/api/auth-middleware';
import { ApiErrorHandler, ErrorType } from '@/lib/api/error-handler';
import db from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { parseJson } from '@/lib/security';
import { updateBookingSchema } from '@/lib/validations/booking';

type Params = { params: { id: string } };

/**
 * GET /api/bookings/:id
 * Returns a single booking with relations.
 * - Utilisateur non admin: ne peut accéder qu'à ses propres réservations
 * - Admin: peut accéder à toutes les réservations
 */
export const GET = withAuth(async (_req: NextRequest, auth, { params }: Params): Promise<NextResponse> => {
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

    const isOwner = booking.user.id === auth.user.id;
    const isAdmin = auth.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw ApiErrorHandler.forbidden('Accès interdit à cette réservation');
    }

    return NextResponse.json(booking, { status: 200 });
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
});

/**
 * PUT /api/bookings/:id
 * Updates booking fields (admin only).
 */
export const PUT = withAdminAuth(async (request: NextRequest, _auth, { params }: Params): Promise<NextResponse> => {
  try {
    const rl = rateLimit(request, { windowMs: 10 * 60 * 1000, max: 60, keyPrefix: 'bookings-admin' });
    if (rl.blocked) {
      const headers = new Headers(rl.headers);
      return NextResponse.json(
        { type: ErrorType.RATE_LIMIT, message: 'Trop de requêtes' },
        { status: 429, headers }
      );
    }

    const { id } = params;
    if (!id) {
      throw ApiErrorHandler.badRequest('ID de réservation requis');
    }

    const body = await parseJson(request, 20_000);
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

    const response = NextResponse.json(booking, { status: 200 });
    Object.entries(rl.headers).forEach(([k, v]) => response.headers.set(k, v));

    return response;
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';