import { NextResponse, NextRequest } from 'next/server';

import prisma from '@/lib/prisma';
import { withAdminAuth } from '@/lib/api/auth-middleware';
import { ApiErrorHandler } from '@/lib/api/error-handler';

type Params = { params: { id: string } };

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

    await prisma.course.delete({ where: { id } });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
});

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';