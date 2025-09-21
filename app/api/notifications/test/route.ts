import { NextResponse } from 'next/server';
import { sendTelegramMessage, sendEmail } from '@/lib/notifications';

export async function POST() {
  // Basic smoke test for notifications setup
  const tg = await sendTelegramMessage('🔔 Test notification Telegram – configuration OK');
  const em = await sendEmail({
    to: process.env.FROM_EMAIL || 'demo@example.com',
    subject: 'Test notification email – configuration OK',
    html: '<p>La configuration des emails semble correcte (ou fallback console).</p>',
  });

  return NextResponse.json({
    ok: tg.ok && em.ok,
    telegram: tg,
    email: em,
  });
}