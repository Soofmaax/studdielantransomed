import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

import { withAdminAuth } from '@/lib/api/auth-middleware';
import { ApiErrorHandler } from '@/lib/api/error-handler';
import { notifyBookingReminder } from '@/lib/notifications';

const prisma = new PrismaClient();

export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const { bookingId } = await request.json();

    if (!bookingId || typeof bookingId !== 'string') {
      throw ApiErrorHandler.badRequest('bookingId requis');
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        course: { select: { title: true } },
        user: { select: { name: true, email: true } },
      },
    });

    if (!booking) {
      throw ApiErrorHandler.notFound('Réservation introuvable');
    }

    await notifyBookingReminder({
      courseTitle: booking.course.title,
      date: booking.date.toISOString(),
      clientName: booking.user.name || 'Client',
      clientEmail: booking.user.email,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';