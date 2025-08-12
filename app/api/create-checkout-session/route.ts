import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

import { createCheckoutSessionSchema, ICreateCheckoutSessionRequest } from '@/lib/validations/checkout';
import { ApiErrorHandler } from '@/lib/api/error-handler';
import { withAuth } from '@/lib/api/auth-middleware';

// Initialisation sécurisée de Stripe avec validation des variables d'environnement
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

const prisma = new PrismaClient();

/**
 * Interface pour les données du cours récupérées de la base de données
 */
interface ICourseData {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  capacity: number;
  level: string;
}

/**
 * Service de gestion des sessions de paiement Stripe
 * Applique une approche artisanale avec validation stricte et gestion d'erreur robuste
 */
class CheckoutSessionService {
  /**
   * Récupère les données du cours depuis la base de données
   * @param courseId - Identifiant du cours
   * @returns Données du cours ou lance une erreur si introuvable
   */
  private static async getCourseData(courseId: string): Promise<ICourseData> {
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        duration: true,
        capacity: true,
        level: true,
      },
    });

    if (!course) {
      throw ApiErrorHandler.notFound(`Cours avec l'ID ${courseId} introuvable`);
    }

    return course;
  }

  /**
   * Vérifie la disponibilité du cours à la date demandée
   * @param courseId - Identifiant du cours
   * @param date - Date de la séance
   * @returns true si disponible, lance une erreur sinon
   */
  private static async checkAvailability(courseId: string, date: string): Promise<boolean> {
    const bookingCount = await prisma.booking.count({
      where: {
        courseId,
        date: new Date(date),
        status: {
          in: ['CONFIRMED', 'PENDING'],
        },
      },
    });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { capacity: true },
    });

    if (!course) {
      throw ApiErrorHandler.notFound('Cours introuvable');
    }

    if (bookingCount >= course.capacity) {
      throw ApiErrorHandler.conflict('Ce cours est complet pour cette date');
    }

    return true;
  }

  /**
   * Crée une session de paiement Stripe sécurisée
   * @param data - Données de la requête validées
   * @param course - Données du cours
   * @returns Session Stripe créée
   */
  private static async createStripeSession(
    data: ICreateCheckoutSessionRequest,
    course: ICourseData
  ): Promise<Stripe.Checkout.Session> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    
    if (!baseUrl) {
      throw new Error('NEXT_PUBLIC_BASE_URL non configurée');
    }

    return await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: `${course.title} - Séance de ${course.duration} minutes`,
              description: course.description,
              metadata: {
                courseId: course.id,
                level: course.level,
              },
            },
            unit_amount: Math.round(course.price * 100), // Prix en centimes
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/reservation/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/reservation?cancelled=true`,
      metadata: {
        courseId: data.courseId,
        date: data.date,
        userId: data.userId,
        bookingType: 'course_booking',
      },
      expires_at: Math.floor(Date.now() / 1000) + (30 * 60), // Expire dans 30 minutes
      billing_address_collection: 'required',
      customer_creation: 'always',
      payment_intent_data: {
        metadata: {
          courseId: data.courseId,
          userId: data.userId,
        },
      },
    });
  }

  /**
   * Traite la création d'une session de paiement
   * @param data - Données de la requête validées
   * @param userId - ID de l'utilisateur authentifié
   * @returns Réponse avec l'ID de la session
   */
  static async createSession(
    data: ICreateCheckoutSessionRequest,
    userId: string
  ): Promise<{ sessionId: string; url: string | null }> {
    // Vérification que l'utilisateur réserve pour lui-même (sécurité)
    if (data.userId !== userId) {
      throw ApiErrorHandler.forbidden('Vous ne pouvez réserver que pour vous-même');
    }

    // Récupération des données du cours
    const course = await this.getCourseData(data.courseId);

    // Vérification de la disponibilité
    await this.checkAvailability(data.courseId, data.date);

    // Création de la session Stripe
    const session = await this.createStripeSession(data, course);

    return {
      sessionId: session.id,
      url: session.url,
    };
  }
}

/**
 * Handler POST pour créer une session de paiement Stripe
 * Applique une validation stricte et une sécurité renforcée
 */
async function handleCreateCheckoutSession(
  request: NextRequest,
  auth: { user: { id: string } }
): Promise<NextResponse> {
  try {
    // Parsing et validation des données de la requête
    const body = await request.json();
    const validatedData = createCheckoutSessionSchema.parse(body);

    // Création de la session de paiement
    const result = await CheckoutSessionService.createSession(validatedData, auth.user.id);

    // Réponse avec les données de la session
    return NextResponse.json(
      {
        success: true,
        data: result,
        message: 'Session de paiement créée avec succès',
      },
      { status: 201 }
    );
  } catch (error) {
    return ApiErrorHandler.handle(error);
  }
}

/**
 * Export de la route POST sécurisée avec authentification
 */
export const POST = withAuth(handleCreateCheckoutSession);

/**
 * Configuration de la route pour optimiser les performances
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

