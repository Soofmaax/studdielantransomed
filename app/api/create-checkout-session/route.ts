import { NextRequest } from 'next/server';
import Stripe from 'stripe';

import { withAuth } from '@/lib/api/auth-middleware';
import { ApiErrorHandler } from '@/lib/api/error-handler';
import db from '@/lib/prisma';
import { rateLimit } from '@/lib/rate-limit';
import { parseJson } from '@/lib/security';
import { createCheckoutSessionSchema, ICreateCheckoutSessionRequest } from '@/lib/validations/checkout';

// Stripe initialisation en mode "optionnel" pour permettre une démo sans clés
const stripeKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeKey
  ? new Stripe(stripeKey, { apiVersion: '2023-10-16', typescript: true })
  : null;

// Mode démo Stripe (par défaut activé pour le showcase). 
// Mettez STRIPE_DEMO_MODE=0 + STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET pour passer en "live".
const STRIPE_DEMO_MODE = (process.env.STRIPE_DEMO_MODE || '1') === '1';

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
    const courseFromDb = await db.course.findUnique({
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
    const bookingCount = await db.booking.count({
      where: {
        courseId,
        date: new Date(date),
        status: {
          in: ['CONFIRMED', 'PENDING'],
        },
      },
    });

    const course = await db.course.findUnique({
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
   * Pour aligner les tests e2e, on renvoie une URL Stripe simulée.
   */
  private static async createDemoSession(
    data: ICreateCheckoutSessionRequest
  ): Promise<{ sessionId: string; url: string | null }> {
    const sessionId = `demo_${Date.now()}`;
    const simulatedStripeUrl = `https://checkout.stripe.com/pay/${sessionId}`;
    return { sessionId, url: simulatedStripeUrl };
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

    // Mode démo forcé (showcase) si STRIPE_DEMO_MODE=1
    if (STRIPE_DEMO_MODE) {
      return this.createDemoSession(data);
    }

    if (!stripe) {
      throw new Error('Stripe non configuré (désactivez STRIPE_DEMO_MODE ou ajoutez vos clés)');
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
): Promise<Response> {
  try {
    // Best-effort rate limiting: 60 req / 10 min / IP
    const rl = rateLimit(request, { windowMs: 10 * 60 * 1000, max: 60, keyPrefix: 'checkout' });
    if (rl.blocked) {
      const headers = new Headers({ 'content-type': 'application/json' });
      Object.entries(rl.headers).forEach(([k, v]) => headers.set(k, v));
      return new Response(JSON.stringify({ type: 'RATE_LIMIT_ERROR', message: 'Trop de requêtes' }), {
        status: 429,
        headers,
      });
    }

    // Strict JSON parsing and validation
    const raw = await parseJson(request, 20_000);
    const validatedData = createCheckoutSessionSchema.parse(raw);

    const result = await CheckoutSessionService.createSession(validatedData, auth.user.id);

    const headers = new Headers({ 'content-type': 'application/json' });
    Object.entries(rl.headers).forEach(([k, v]) => headers.set(k, v));

    return new Response(
      JSON.stringify({
        success: true,
        data: result,
        message: STRIPE_DEMO_MODE ? 'Mode démo: session simulée' : 'Session de paiement créée avec succès',
      }),
      { status: 201, headers }
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
