import { NextRequest, NextResponse } from 'next/server';

import { withAuth } from '@/lib/api/auth-middleware';
import { ApiErrorHandler } from '@/lib/api/error-handler';
import db from '@/lib/prisma';
import { createBookingSchema } from '@/lib/validations/booking';

/**
 * GET /api/bookings
 * Returns bookings with related course and user for calendar display.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const bookings = await db.booking.findMany({
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

/**
 * POST /api/bookings
 * Creates a booking (auth required) with capacity checks.
 */
export const POST = withAuth(async (request: NextRequest, auth): Promise<NextResponse> => {
  try {
    const body = await request.json();
    const data = createBookingSchema.parse(body);

    if (data.userId !== auth.user.id) {
      throw ApiErrorHandler.forbidden('Vous ne pouvez créer qu\'une réservation pour vous-même');
    }

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
        userId: data.userId,
        date,
        status: { in: ['PENDING', 'CONFIRMED'] },
      },
    });

    if (duplicate) {
      throw ApiErrorHandler.conflict('Vous avez déjà une réservation pour ce créneau');
    }

    const booking = await db.booking.create({
      data: {
        userId: data.userId,
        courseId: data.courseId,
        date,
        status: 'PENDING',
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';