import type { NextRequest } from 'next/server';
import { ApiErrorHandler } from '@/lib/api/error-handler';

/**
 * Enforces application/json content-type and bounded payload size.
 * Returns parsed JSON or throws an ApiError.
 */
export async function parseJson(request: NextRequest, maxBytes = 20_000) {
  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw ApiErrorHandler.badRequest('Content-Type doit être application/json');
  }

  const raw = await request.text();
  if (raw.length > maxBytes) {
    throw ApiErrorHandler.badRequest('Payload trop volumineux');
  }

  try {
    return JSON.parse(raw);
  } catch {
    throw ApiErrorHandler.badRequest('JSON invalide');
  }
}