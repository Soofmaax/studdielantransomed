import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

import { ApiErrorHandler } from '@/lib/api/error-handler';
import { withAuth } from '@/lib/api/auth-middleware';
import { createCheckoutSessionSchema, ICreateCheckoutSessionRequest } from '@/lib/validations/checkout';

// Stripe initialisation en mode "optionnel" pour permettre une démo sans clés
const stripeKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeKey
  ? new Stripe(stripeKey, { apiVersion: '2023-10-16', typescript: true })
  : null;

const prisma = new PrismaClient();

/**
 * Interface pour les données du cours récupérées de la base de données
 */
interface ICourseData {
  id: string;
  title: string;
  description: string;
  price: number; // Le type ici est bien 'number'
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
    const courseFromDb = await prisma.course.findUnique({
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

    if (!courseFromDb) {
      throw ApiErrorHandler.notFound(`Cours avec l'ID ${courseId} introuvable`);
    }

    return {
      ...courseFromDb,
      price: courseFromDb.price.toNumber(),
    };
  }

  /**
   * Vérifie la disponibilité du cours à la date demandée
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
   * Crée une session de paiement Stripe réelle
   */
  private static async createStripeSession(
    data: ICreateCheckoutSessionRequest,
    course: ICourseData
  ): Promise<Stripe.Checkout.Session> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || '';
    if (!baseUrl) {
      throw new Error('Aucune URL de base fournie (NEXT_PUBLIC_BASE_URL ou NEXTAUTH_URL)');
    }
    if (!stripe) {
      throw new Error('Stripe non configuré');
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
            unit_amount: Math.round(course.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${baseUrl}/reservation/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/reservation/cancel`,
      metadata: {
        courseId: data.courseId,
        date: data.date,
        userId: data.userId,
        bookingType: 'course_booking',
      },
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60,
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
   * Mode démo: renvoie une session factice sans Stripe
   */
  private static async createDemoSession(
    data: ICreateCheckoutSessionRequest
  ): Promise<{ sessionId: string; url: string | null }> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXTAUTH_URL || '';
    const sessionId = `demo_${Date.now()}`;
    const successUrl = baseUrl ? `${baseUrl}/reservation/success?session_id=${sessionId}&demo=1` : null;

    // On peut marquer une réservation PENDING ici si souhaité, mais pour la démo
    // on retourne simplement une URL de succès afin de simuler le flux.
    return { sessionId, url: successUrl };
  }

  /**
   * Traite la création d'une session de paiement
   */
  static async createSession(
    data: ICreateCheckoutSessionRequest,
    userId: string
  ): Promise<{ sessionId: string; url: string | null }> {
    if (data.userId !== userId) {
      throw ApiErrorHandler.forbidden('Vous ne pouvez réserver que pour vous-même');
    }

    const course = await this.getCourseData(data.courseId);
    await this.checkAvailability(data.courseId, data.date);

    // Si Stripe n'est pas configuré, on passe en mode démo
    if (!stripe) {
      return this.createDemoSession(data);
    }

    const session = await this.createStripeSession(data, course);
    return { sessionId: session.id, url: session.url };
  }
}

/**
 * Handler POST pour créer une session de paiement
 */
async function handleCreateCheckoutSession(
  request: NextRequest,
  auth: { user: { id: string } }
): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = createCheckoutSessionSchema.parse(body);

    const result = await CheckoutSessionService.createSession(validatedData, auth.user.id);

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: stripe ? 'Session de paiement créée avec succès' : 'Mode démo: session simulée',
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
 * Configuration de la route
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
