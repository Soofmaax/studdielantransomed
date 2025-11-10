import { NextRequest, NextResponse } from 'next/server';

import { ApiErrorHandler } from '@/lib/api/error-handler';
import { withAdminAuth } from '@/lib/api/auth-middleware';
import { createCourseSchema } from '@/lib/validations/course';
import db from '@/lib/prisma';

/**
 * GET /api/courses
 * Returns the list of courses for the admin page.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const courses = await db.course.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
}

/**
 * POST /api/courses
 * Creates a new course (admin only).
 */
export const POST = withAdminAuth(async (request: NextRequest) => {
  try {
    const body = await request.json();
    const data = createCourseSchema.parse(body);

    const course = await db.course.create({
      data,
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';