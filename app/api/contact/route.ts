import { NextRequest, NextResponse } from 'next/server';

import { ApiErrorHandler } from '@/lib/api/error-handler';
import { sendEmail, sendTelegramMessage } from '@/lib/notifications';
import { contactFormSchema } from '@/lib/validations/contact';

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json();
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

    return NextResponse.json(
      {
        success: true,
        message: 'Message envoyé',
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';