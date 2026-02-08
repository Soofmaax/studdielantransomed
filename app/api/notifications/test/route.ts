import { NextRequest, NextResponse } from 'next/server';

import { ApiErrorHandler, ErrorType } from '@/lib/api/error-handler';
import { sendTelegramMessage, sendEmail } from '@/lib/notifications';
import { rateLimit } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
  try {
    // Best-effort rate limiting: 5 req / 10 min / IP
    const rl = rateLimit(request, { windowMs: 10 * 60 * 1000, max: 5, keyPrefix: 'notifications-test' });
    if (rl.blocked) {
      const headers = new Headers(rl.headers);
      return NextResponse.json(
        { type: ErrorType.RATE_LIMIT, message: 'Trop de requêtes' },
        { status: 429, headers }
      );
    }

    const secret = process.env.NOTIFICATIONS_TEST_SECRET;
    if (!secret) {
      throw ApiErrorHandler.forbidden('Route de test des notifications désactivée');
    }

    const headerSecret = request.headers.get('x-notifications-test-secret');
    if (headerSecret !== secret) {
      throw ApiErrorHandler.forbidden('Accès interdit à la route de test des notifications');
    }

    // Basic smoke test for notifications setup
    const tg = await sendTelegramMessage('🔔 Test notification Telegram – configuration OK');
    const em = await sendEmail({
      to: process.env.FROM_EMAIL || 'demo@example.com',
      subject: 'Test notification email – configuration OK',
      html: '<p>La configuration des emails semble correcte (ou fallback console).</p>',
    });

    const response = NextResponse.json({
      ok: tg.ok && em.ok,
      telegram: tg,
      email: em,
    });
    Object.entries(rl.headers).forEach(([k, v]) => response.headers.set(k, v));

    return response;
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
}