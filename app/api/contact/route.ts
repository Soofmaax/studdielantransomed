import { NextRequest, NextResponse } from 'next/server';

import { ApiErrorHandler, ErrorType } from '@/lib/api/error-handler';
import { sendEmail, sendTelegramMessage } from '@/lib/notifications';
import { contactFormSchema } from '@/lib/validations/contact';
import { rateLimit } from '@/lib/rate-limit';
import { parseJson } from '@/lib/security';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Best-effort rate limiting: 10 req / 10 min / IP
    const rl = rateLimit(request, { windowMs: 10 * 60 * 1000, max: 10, keyPrefix: 'contact' });
    if (rl.blocked) {
      const headers = new Headers(rl.headers);
      return NextResponse.json(
        { type: ErrorType.RATE_LIMIT, message: 'Trop de requêtes' },
        { status: 429, headers }
      );
    }

    // Strict JSON parsing with content-type enforcement and size bound
    const body = await parseJson(request, 20_000);
    const data = contactFormSchema.parse(body);

    // Notify via Telegram (if configured) and send email
    await sendTelegramMessage(
      [
        '📩 Nouveau message de contact',
        `Nom: ${data.name}`,
        `Email: ${data.email}`,
        `Sujet: ${data.subject}`,
        `Message: ${data.message}`,
      ].join('\n')
    );

    const toEmail = process.env.FROM_EMAIL || 'demo@example.com';
    await sendEmail({
      to: toEmail,
      subject: `Nouveau message de contact – ${data.subject}`,
      html: `
        <p><strong>Nom:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Sujet:</strong> ${data.subject}</p>
        <p><strong>Message:</strong><br/>${data.message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    const response = NextResponse.json(
      {
        success: true,
        message: 'Message envoyé',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );

    // Attach rate limit headers for transparency
    Object.entries(rl.headers).forEach(([k, v]) => response.headers.set(k, v));

    return response;
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';