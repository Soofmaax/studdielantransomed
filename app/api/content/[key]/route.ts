import { NextRequest, NextResponse } from 'next/server';

import { withAdminAuth } from '@/lib/api/auth-middleware';
import { ApiErrorHandler } from '@/lib/api/error-handler';
import db from '@/lib/prisma';
import { DEFAULT_CONTENT, isValidContentKey } from '@/lib/content/defaults';
import type { ContentKey } from '@/lib/content/defaults';

type Params = { params: { key: string } };

/**
 * GET /api/content/:key
 * Récupère le contenu d'une page pour l'interface d'administration.
 */
export const GET = withAdminAuth(
  async (_request: NextRequest, _auth, { params }: Params): Promise<NextResponse> => {
    try {
      const { key } = params;

      if (!isValidContentKey(key)) {
        throw ApiErrorHandler.notFound('Clé de contenu inconnue');
      }

      const contentKey = key as ContentKey;

      const block = await db.contentBlock.findUnique({
        where: { key: contentKey },
      });

      const data = block?.data ?? DEFAULT_CONTENT[contentKey];

      return NextResponse.json(
        {
          key: contentKey,
          data,
        },
        { status: 200 }
      );
    } catch (error) {
      return ApiErrorHandler.handle(error);
    }
  }
);

/**
 * PUT /api/content/:key
 * Met à jour le contenu d'une page (admin uniquement).
 */
export const PUT = withAdminAuth(
  async (request: NextRequest, _auth, { params }: Params): Promise<NextResponse> => {
    try {
      const { key } = params;

      if (!isValidContentKey(key)) {
        throw ApiErrorHandler.notFound('Clé de contenu inconnue');
      }

      const contentKey = key as ContentKey;

      const body = await request.json();

      const block = await db.contentBlock.upsert({
        where: { key: contentKey },
        update: {
          data: body,
        },
        create: {
          key: contentKey,
          data: body,
        },
      });

      return NextResponse.json(
        {
          key: contentKey,
          data: block.data,
        },
        { status: 200 }
      );
    } catch (error) {
      return ApiErrorHandler.handle(error);
    }
  }
);

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';