import { NextRequest, NextResponse } from 'next/server';

import { withAdminAuth } from '@/lib/api/auth-middleware';
import { ApiErrorHandler, ErrorType } from '@/lib/api/error-handler';
import db from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { parseJson } from '@/lib/security';
import { createCourseSchema } from '@/lib/validations/course';

/**
 * GET /api/courses
 * Returns the list of courses for the admin page.
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    // Best-effort rate limiting: 120 req / 10 min / IP
    const rl = rateLimit(request, { windowMs: 10 * 60 * 1000, max: 120, keyPrefix: 'courses' });
    if (rl.blocked) {
      const headers = new Headers(rl.headers);
      return NextResponse.json(
        { type: ErrorType.RATE_LIMIT, message: 'Trop de requêtes' },
        { status: 429, headers }
      );
    }

    const courses = await db.course.findMany({
      orderBy: { createdAt: 'desc' },
    });

    const response = NextResponse.json(courses, { status: 200 });
    Object.entries(rl.headers).forEach(([k, v]) => response.headers.set(k, v));

    return response;
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
}

/**
 * POST /api/courses
 * Creates a new course (admin only).
 */
export const POST = withAdminAuth(async (request: NextRequest): Promise<NextResponse> => {
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

    const body = await parseJson(request, 20_000);
    const data = createCourseSchema.parse(body);

    const course = await db.course.create({
      data,
    });

    const response = NextResponse.json(course, { status: 201 });
    Object.entries(rl.headers).forEach(([k, v]) => response.headers.set(k, v));

    return response;
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';