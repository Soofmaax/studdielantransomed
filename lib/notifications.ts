// Lightweight notification service for demo use (no external deps required)
// - Telegram (preferred for demo): uses Telegram Bot API via fetch
// - Email: falls back to console unless RESEND_API_KEY is set (optional path)

type TelegramConfig = {
  botToken: string;
  chatId: string;
};

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
  from?: string;
};

function getTelegramConfig(): TelegramConfig | null {
  const botToken = process.env.TELEGRAM_BOT_TOKEN || '';
  const chatId = process.env.TELEGRAM_CHAT_ID || '';
  if (!botToken || !chatId) return null;
  return { botToken, chatId };
}

export async function sendTelegramMessage(text: string): Promise<{ ok: boolean; error?: string }> {
  const cfg = getTelegramConfig();
  if (!cfg) {
    // Graceful fallback for demo
    console.info('[notifications] Telegram not configured, message would be:', text);
    return { ok: true };
  }

  try {
    const url = `https://api.telegram.org/bot${cfg.botToken}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: cfg.chatId, text, parse_mode: 'HTML' }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { ok: false, error: `Telegram error: ${res.status} ${body}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// Optional: Email via Resend if available; otherwise console fallback
export async function sendEmail({ to, subject, html, from }: EmailPayload): Promise<{ ok: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY || '';
  const fromEmail = from || process.env.RESEND_FROM_EMAIL || process.env.FROM_EMAIL || 'no-reply@demo.local';

  if (!apiKey) {
    console.info('[notifications] Email (fallback):', { to, subject, html });
    return { ok: true };
  }

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to,
        subject,
        html,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { ok: false, error: `Resend error: ${res.status} ${body}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}

// Helpers for booking lifecycle (demo)
export async function notifyBookingCreated(params: {
  courseTitle: string;
  date: string;
  clientName: string;
  clientEmail: string;
}) {
  const { courseTitle, date, clientName, clientEmail } = params;

  const telegramText =
    `✅ Nouvelle réservation\n` +
    `Cours: ${courseTitle}\n` +
    `Quand: ${date}\n` +
    `Client: ${clientName} (${clientEmail})`;

  await sendTelegramMessage(telegramText);

  await sendEmail({
    to: clientEmail,
    subject: `Confirmation de réservation – ${courseTitle}`,
    html: `
      <p>Bonjour ${clientName},</p>
      <p>Votre réservation pour <strong>${courseTitle}</strong> le <strong>${date}</strong> est confirmée.</p>
      <p>Merci et à bientôt !</p>
    `,
  });
}

export async function notifyBookingReminder(params: {
  courseTitle: string;
  date: string;
  clientName: string;
  clientEmail: string;
}) {
  const { courseTitle, date, clientName, clientEmail } = params;

  const telegramText =
    `⏰ Rappel de cours\n` +
    `Cours: ${courseTitle}\n` +
    `Quand: ${date}\n` +
    `Client: ${clientName}`;

  await sendTelegramMessage(telegramText);

  await sendEmail({
    to: clientEmail,
    subject: `Rappel – ${courseTitle} aujourd'hui`,
    html: `
      <p>Bonjour ${clientName},</p>
      <p>Petit rappel: votre cours <strong>${courseTitle}</strong> a lieu aujourd'hui le <strong>${date}</strong>.</p>
      <p>À tout de suite !</p>
    `,
  });
}