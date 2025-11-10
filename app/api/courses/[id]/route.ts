import { NextResponse, NextRequest } from 'next/server';

import { withAdminAuth } from '@/lib/api/auth-middleware';
import { ApiErrorHandler } from '@/lib/api/error-handler';
import { updateCourseSchema } from '@/lib/validations/course';
import db from '@/lib/prisma';

type Params = { params: { id: string } };

/**
 * PUT /api/courses/:id
 * Updates a course (admin only).
 */
export const PUT = withAdminAuth(async (request: NextRequest, _auth, { params }: Params): Promise<NextResponse> => {
  try {
    const { id } = params;
    if (!id) {
      throw ApiErrorHandler.badRequest('ID de cours requis');
    }

    const body = await request.json();
    const data = updateCourseSchema.parse(body);

    const course = await db.course.update({
      where: { id },
      data,
    });

    return NextResponse.json(course, { status: 200 });
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
    const { id } = params;
    if (!id) {
      throw ApiErrorHandler.badRequest('ID de cours requis');
    }

    await db.course.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';