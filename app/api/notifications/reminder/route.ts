import { NextRequest, NextResponse } from 'next/server';

import { withAdminAuth } from '@/lib/api/auth-middleware';
import { ApiErrorHandler, ErrorType } from '@/lib/api/error-handler';
import { notifyBookingReminder } from '@/lib/notifications';
import db from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { parseJson } from '@/lib/security';

export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    // Best-effort rate limiting: 20 req / 10 min / IP
    const rl = rateLimit(request, { windowMs: 10 * 60 * 1000, max: 20, keyPrefix: 'notifications-reminder' });
    if (rl.blocked) {
      const headers = new Headers(rl.headers);
      return NextResponse.json(
        { type: ErrorType.RATE_LIMIT, message: 'Trop de requêtes' },
        { status: 429, headers }
      );
    }

    const body = await parseJson(request, 20_000);
    const { bookingId } = body as { bookingId?: unknown };

    if (!bookingId || typeof bookingId !== 'string') {
      throw ApiErrorHandler.badRequest('bookingId requis');
    }

    const booking = await db.booking.findUnique({
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

    const response = NextResponse.json({ ok: true });
    Object.entries(rl.headers).forEach(([k, v]) => response.headers.set(k, v));

    return response;
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';