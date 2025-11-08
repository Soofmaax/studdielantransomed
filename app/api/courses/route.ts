import { NextResponse } from 'next/server';

import prisma from '@/lib/prisma';
import { ApiErrorHandler } from '@/lib/api/error-handler';

/**
 * GET /api/courses
 * Returns the list of courses for the admin page.
 */
export async function GET(): Promise<NextResponse> {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(courses, { status: 200 });
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';