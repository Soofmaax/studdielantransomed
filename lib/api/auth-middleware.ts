import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { User } from '@prisma/client';

import { ApiErrorHandler } from './error-handler';
import { authOptions } from '../auth';

/**
 * Interface pour l'utilisateur authentifié dans le contexte API
 */
export interface IAuthenticatedUser {
  id: string;
  email: string;
  name: string | null;
  role: 'ADMIN' | 'CLIENT';
}

/**
 * Résultat de l'authentification
 */
export interface IAuthResult {
  user: IAuthenticatedUser;
  session: {
    id: string;
    expires: Date;
  };
}

/**
 * Middleware d'authentification pour les API routes
 * Vérifie la session NextAuth et retourne les informations utilisateur
 */
export class AuthMiddleware {
  /**
   * Vérifie l'authentification de l'utilisateur
   * @param request - Requête Next.js
   * @returns Informations utilisateur ou lance une erreur
   */
  static async authenticate(request: NextRequest): Promise<IAuthResult> {
    try {
      const session = await getServerSession(authOptions);

      if (!session?.user) {
        throw ApiErrorHandler.unauthorized('Session invalide ou expirée');
      }

      // Validation et transformation sécurisée des données utilisateur
      const user = this.validateAndTransformUser(session.user);

      return {
        user,
        session: {
          id: session.user.id,
          expires: new Date(session.expires),
        },
      };
    } catch (error) {
      if (error instanceof Error && error.message.includes('Session')) {
        throw error;
      }
      throw ApiErrorHandler.unauthorized('Erreur d\'authentification');
    }
  }

  /**
   * Vérifie que l'utilisateur a le rôle administrateur
   * @param request - Requête Next.js
   * @returns Informations utilisateur admin ou lance une erreur
   */
  static async requireAdmin(request: NextRequest): Promise<IAuthResult> {
    const authResult = await this.authenticate(request);

    if (authResult.user.role !== 'ADMIN') {
      throw ApiErrorHandler.forbidden('Droits administrateur requis');
    }

    return authResult;
  }

  /**
   * Vérifie que l'utilisateur accède à ses propres données
   * @param request - Requête Next.js
   * @param resourceUserId - ID de l'utilisateur propriétaire de la ressource
   * @returns Informations utilisateur ou lance une erreur
   */
  static async requireOwnershipOrAdmin(
    request: NextRequest,
    resourceUserId: string
  ): Promise<IAuthResult> {
    const authResult = await this.authenticate(request);

    const isOwner = authResult.user.id === resourceUserId;
    const isAdmin = authResult.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      throw ApiErrorHandler.forbidden('Accès interdit à cette ressource');
    }

    return authResult;
  }

  /**
   * Valide et transforme les données utilisateur de la session
   * @param sessionUser - Données utilisateur de la session
   * @returns Utilisateur validé et typé
   */
  private static validateAndTransformUser(sessionUser: any): IAuthenticatedUser {
    // Validation stricte des données utilisateur
    if (!sessionUser.id || typeof sessionUser.id !== 'string') {
      throw new Error('ID utilisateur invalide');
    }

    if (!sessionUser.email || typeof sessionUser.email !== 'string') {
      throw new Error('Email utilisateur invalide');
    }

    if (!sessionUser.role || !['ADMIN', 'CLIENT'].includes(sessionUser.role)) {
      throw new Error('Rôle utilisateur invalide');
    }

    return {
      id: sessionUser.id,
      email: sessionUser.email,
      name: sessionUser.name || null,
      role: sessionUser.role as 'ADMIN' | 'CLIENT',
    };
  }
}

/**
 * Décorateur pour sécuriser une API route avec authentification
 * @param handler - Handler de l'API route
 * @returns Handler sécurisé avec authentification
 */
export function withAuth<T extends any[]>(
  handler: (request: NextRequest, auth: IAuthResult, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    try {
      const auth = await AuthMiddleware.authenticate(request);
      return await handler(request, auth, ...args);
    } catch (error) {
      return ApiErrorHandler.handle(error);
    }
  };
}

/**
 * Décorateur pour sécuriser une API route avec droits administrateur
 * @param handler - Handler de l'API route
 * @returns Handler sécurisé avec vérification admin
 */
export function withAdminAuth<T extends any[]>(
  handler: (request: NextRequest, auth: IAuthResult, ...args: T) => Promise<Response>
) {
  return async (request: NextRequest, ...args: T): Promise<Response> => {
    try {
      const auth = await AuthMiddleware.requireAdmin(request);
      return await handler(request, auth, ...args);
    } catch (error) {
      return ApiErrorHandler.handle(error);
    }
  };
}

