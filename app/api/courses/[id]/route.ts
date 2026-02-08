import { NextResponse, NextRequest } from 'next/server';

import { withAdminAuth } from '@/lib/api/auth-middleware';
import { ApiErrorHandler, ErrorType } from '@/lib/api/error-handler';
import db from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { parseJson } from '@/lib/security';
import { updateCourseSchema } from '@/lib/validations/course';

type Params = { params: { id: string } };

/**
 * PUT /api/courses/:id
 * Updates a course (admin only).
 */
export const PUT = withAdminAuth(async (request: NextRequest, _auth, { params }: Params): Promise<NextResponse> => {
  try {
    // Best-effort rate limiting: 60 req / 10 min / IP
    const rl = rateLimit(request, { windowMs: 10 * 60 * 1000, max: 60, keyPrefix: 'courses-admin' });
    if (rl.blocked) {
      const headers = new Headers(rl.headers);
      return NextResponse.json(
        { type: ErrorType.RATE_LIMIT, message: 'Trop de requêtes' },
        { status: 429, headers }
      );
    }

    const { id } = params;
    if (!id) {
      throw ApiErrorHandler.badRequest('ID de cours requis');
    }

    const body = await parseJson(request, 20_000);
    const data = updateCourseSchema.parse(body);

    const course = await db.course.update({
      where: { id },
      data,
    });

    const response = NextResponse.json(course, { status: 200 });
    Object.entries(rl.headers).forEach(([k, v]) => response.headers.set(k, v));

    return response;
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
});

/**
 * DELETE /api/courses/:id
 * Deletes a course (admin only).
 */
export const DELETE = withAdminAuth(async (request: NextRequest, _auth, { params }: Params): Promise<NextResponse> => {
  try {
    // Best-effort rate limiting: 60 req / 10 min / IP
    const rl = rateLimit(request, { windowMs: 10 * 60 * 1000, max: 60, keyPrefix: 'courses-admin' });
    if (rl.blocked) {
      const headers = new Headers(rl.headers);
      return NextResponse.json(
        { type: ErrorType.RATE_LIMIT, message: 'Trop de requêtes' },
        { status: 429, headers }
      );
    }

    const { id } = params;
    if (!id) {
      throw ApiErrorHandler.badRequest('ID de cours requis');
    }

    await db.course.delete({ where: { id } });

    const response = NextResponse.json({ success: true }, { status: 200 });
    Object.entries(rl.headers).forEach(([k, v]) => response.headers.set(k, v));

    return response;
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';