import { NextRequest, NextResponse } from 'next/server';

import { withAuth } from '@/lib/api/auth-middleware';
import { ApiErrorHandler, ErrorType } from '@/lib/api/error-handler';
import db from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { parseJson } from '@/lib/security';
import { createBookingSchema } from '@/lib/validations/booking';

/**
 * GET /api/bookings
 * Returns bookings with related course and user for calendar display.
 * - Utilisateur non admin: ne renvoie que ses propres réservations
 * - Admin: renvoie toutes les réservations
 */
export const GET = withAuth(async (request: NextRequest, auth): Promise<NextResponse> => {
  try {
    // Best-effort rate limiting: 120 req / 10 min / IP
    const rl = rateLimit(request, { windowMs: 10 * 60 * 1000, max: 120, keyPrefix: 'bookings' });
    if (rl.blocked) {
      const headers = new Headers(rl.headers);
      return NextResponse.json(
        { type: ErrorType.RATE_LIMIT, message: 'Trop de requêtes' },
        { status: 429, headers }
      );
    }

    const isAdmin = auth.user.role === 'ADMIN';
    const where = isAdmin ? {} : { userId: auth.user.id };

    const bookings = await db.booking.findMany({
      where,
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

    const response = NextResponse.json(bookings, { status: 200 });
    Object.entries(rl.headers).forEach(([k, v]) => response.headers.set(k, v));

    return response;
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
});

/**
 * POST /api/bookings
 * Creates a booking (auth required) with capacity checks.
 */
export const POST = withAuth(async (request: NextRequest, auth): Promise<NextResponse> => {
  try {
    // Best-effort rate limiting: 60 req / 10 min / IP
    const rl = rateLimit(request, { windowMs: 10 * 60 * 1000, max: 60, keyPrefix: 'bookings-create' });
    if (rl.blocked) {
      const headers = new Headers(rl.headers);
      return NextResponse.json(
        { type: ErrorType.RATE_LIMIT, message: 'Trop de requêtes' },
        { status: 429, headers }
      );
    }

    const body = await parseJson(request, 20_000);
    const data = createBookingSchema.parse(body);

    const course = await db.course.findUnique({
      where: { id: data.courseId },
      select: { capacity: true },
    });

    if (!course) {
      throw ApiErrorHandler.notFound('Cours introuvable');
    }

    const date = new Date(data.date);

    const existingCount = await db.booking.count({
      where: {
        courseId: data.courseId,
        date,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    if (existingCount >= course.capacity) {
      throw ApiErrorHandler.conflict('Ce cours est complet pour cette date');
    }

    // Option: prevent duplicate booking by same user at same date/course
    const duplicate = await db.booking.findFirst({
      where: {
        courseId: data.courseId,
        userId: auth.user.id,
        date,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    if (duplicate) {
      throw ApiErrorHandler.conflict('Vous avez déjà une réservation pour ce créneau');
    }

    const booking = await db.booking.create({
      data: {
        userId: auth.user.id,
        courseId: data.courseId,
        date,
        status: 'PENDING',
      },
    });

    const response = NextResponse.json(booking, { status: 201 });
    Object.entries(rl.headers).forEach(([k, v]) => response.headers.set(k, v));

    return response;
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';