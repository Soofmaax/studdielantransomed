import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';

/**
 * Types d'erreurs standardisés pour une gestion cohérente
 */
export enum ErrorType {
  VALIDATION = 'VALIDATION_ERROR',
  AUTHENTICATION = 'AUTHENTICATION_ERROR',
  AUTHORIZATION = 'AUTHORIZATION_ERROR',
  NOT_FOUND = 'NOT_FOUND_ERROR',
  CONFLICT = 'CONFLICT_ERROR',
  RATE_LIMIT = 'RATE_LIMIT_ERROR',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE_ERROR',
  INTERNAL = 'INTERNAL_SERVER_ERROR',
}

/**
 * Interface pour les erreurs API standardisées
 */
export interface IApiError {
  type: ErrorType;
  message: string;
  details?: unknown;
  statusCode: number;
}

/**
 * Classe d'erreur personnalisée pour les APIs
 */
export class ApiError extends Error implements IApiError {
  public readonly type: ErrorType;
  public readonly statusCode: number;
  public readonly details?: unknown;

  constructor(type: ErrorType, message: string, statusCode: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.type = type;
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Gestionnaire d'erreurs centralisé pour les API routes
 * Transforme toutes les erreurs en réponses HTTP standardisées
 */
export class ApiErrorHandler {
  /**
   * Traite une erreur et retourne une réponse NextResponse appropriée
   */
  static handle(error: unknown): NextResponse {
    // Log de l'erreur pour le debugging (sans exposer de données sensibles)
    console.error('API Error:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString(),
    });

    // Erreur de validation Zod
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          type: ErrorType.VALIDATION,
          message: 'Données invalides',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    // Erreur Prisma (base de données)
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      switch (error.code) {
        case 'P2002':
          return NextResponse.json(
            {
              type: ErrorType.CONFLICT,
              message: 'Cette ressource existe déjà',
              details: { field: error.meta?.target },
            },
            { status: 409 }
          );
        case 'P2025':
          return NextResponse.json(
            {
              type: ErrorType.NOT_FOUND,
              message: 'Ressource introuvable',
            },
            { status: 404 }
          );
        default:
          return NextResponse.json(
            {
              type: ErrorType.INTERNAL,
              message: 'Erreur de base de données',
            },
            { status: 500 }
          );
      }
    }

    // Erreur API personnalisée
    if (error instanceof ApiError) {
      return NextResponse.json(
        {
          type: error.type,
          message: error.message,
          details: error.details,
        },
        { status: error.statusCode }
      );
    }

    // Erreur Stripe
    if (error && typeof error === 'object' && 'type' in error) {
      const stripeError = error as { type: string; message: string };
      if (stripeError.type?.startsWith('Stripe')) {
        return NextResponse.json(
          {
            type: ErrorType.EXTERNAL_SERVICE,
            message: 'Erreur lors du traitement du paiement',
            details: { service: 'Stripe' },
          },
          { status: 502 }
        );
      }
    }

    // Erreur générique
    return NextResponse.json(
      {
        type: ErrorType.INTERNAL,
        message: 'Une erreur interne s\'est produite',
      },
      { status: 500 }
    );
  }

  /**
   * Crée une erreur d'authentification
   */
  static unauthorized(message = 'Authentification requise'): ApiError {
    return new ApiError(ErrorType.AUTHENTICATION, message, 401);
  }

  /**
   * Crée une erreur d'autorisation
   */
  static forbidden(message = 'Accès interdit'): ApiError {
    return new ApiError(ErrorType.AUTHORIZATION, message, 403);
  }

  /**
   * Crée une erreur de ressource non trouvée
   */
  static notFound(message = 'Ressource introuvable'): ApiError {
    return new ApiError(ErrorType.NOT_FOUND, message, 404);
  }

  /**
   * Crée une erreur de conflit
   */
  static conflict(message = 'Conflit de ressource'): ApiError {
    return new ApiError(ErrorType.CONFLICT, message, 409);
  }

  /**
   * Crée une erreur de rate limiting
   */
  static rateLimited(message = 'Trop de requêtes'): ApiError {
    return new ApiError(ErrorType.RATE_LIMIT, message, 429);
  }
}

