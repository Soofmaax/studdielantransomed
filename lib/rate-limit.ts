import type { NextRequest } from 'next/server';

/**
 * Simple in-memory rate limiter (best-effort).
 * For production multi-instance/serverless use a shared store (Redis/Upstash).
 */
type Counter = { count: number; resetAt: number };
const store = new Map<string, Counter>();

export interface RateLimitOptions {
  windowMs: number; // e.g. 10 * 60 * 1000
  max: number;      // e.g. 60
  keyPrefix?: string;
}

function getClientIp(req: NextRequest): string {
  const xfwd = req.headers.get('x-forwarded-for');
  if (xfwd) {
    const parts = xfwd.split(',').map(s => s.trim());
    return parts[0] || 'unknown';
  }
  // NextRequest doesn't expose remote address; fallback to user-agent as weak key
  return req.headers.get('user-agent') || 'unknown';
}

export function rateLimit(req: NextRequest, options: RateLimitOptions) {
  const ip = getClientIp(req);
  const path = req.nextUrl.pathname;
  const key = `${options.keyPrefix || 'rl'}:${ip}:${path}`;

  const now = Date.now();
  const current = store.get(key);

  if (!current || current.resetAt < now) {
    store.set(key, { count: 1, resetAt: now + options.windowMs });
  } else {
    current.count += 1;
    store.set(key, current);
  }

  const entry = store.get(key)!;
  const remaining = Math.max(options.max - entry.count, 0);
  const blocked = entry.count > options.max;

  const headers: Record<string, string> = {
    'X-RateLimit-Limit': String(options.max),
    'X-RateLimit-Remaining': String(remaining),
    'X-RateLimit-Reset': String(Math.floor(entry.resetAt / 1000)),
  };

  let retryAfter: number | undefined;
  if (blocked) {
    retryAfter = Math.max(0, Math.ceil((entry.resetAt - now) / 1000));
    headers['Retry-After'] = String(retryAfter);
  }

  return { blocked, headers, retryAfter };
}