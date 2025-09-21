import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

import { ApiErrorHandler } from '@/lib/api/error-handler';

// Stripe initialisation optionnelle (permet un mode démo sans clés)
const stripeKey = process.env.STRIPE_SECRET_KEY || '';
const stripe = stripeKey
  ? new Stripe(stripeKey, { apiVersion: '2023-10-16', typescript: true })
  : null;

const prisma = new PrismaClient();

/**
 * Interface pour les métadonnées de session Stripe validées
 */
interface IValidatedSessionMetadata {
  courseId: string;
  date: string;
  userId: string;
  bookingType: string;
}

/**
 * Service de gestion des webhooks Stripe
 * Traite les événements de paiement avec une approche artisanale
 */
class StripeWebhookService {
  private static validateSessionMetadata(metadata: Stripe.Metadata | null): IValidatedSessionMetadata {
    if (!metadata) {
      throw new Error('Métadonnées de session manquantes');
    }

    const { courseId, date, userId, bookingType } = metadata;

    if (!courseId || typeof courseId !== 'string') throw new Error('ID de cours invalide dans les métadonnées');
    if (!date || typeof date !== 'string') throw new Error('Date invalide dans les métadonnées');
    if (!userId || typeof userId !== 'string') throw new Error('ID utilisateur invalide dans les métadonnées');
    if (bookingType !== 'course_booking') throw new Error('Type de réservation invalide');

    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) throw new Error('Format de date invalide');

    return { courseId, date, userId, bookingType };
  }

  private static async createConfirmedBooking(
    metadata: IValidatedSessionMetadata,
    session: { id: string; payment_intent?: string | null; amount_total?: number | null; currency?: string | null }
  ) {
    const course = await prisma.course.findUnique({
      where: { id: metadata.courseId },
      select: { id: true, title: true, capacity: true },
    });
    if (!course) throw new Error(`Cours ${metadata.courseId} introuvable`);

    const user = await prisma.user.findUnique({
      where: { id: metadata.userId },
      select: { id: true, email: true, name: true },
    });
    if (!user) throw new Error(`Utilisateur ${metadata.userId} introuvable`);

    const existingBooking = await prisma.booking.findFirst({
      where: {
        courseId: metadata.courseId,
        userId: metadata.userId,
        date: new Date(metadata.date),
        status: { in: ['CONFIRMED', 'PENDING'] },
      },
    });
    if (existingBooking) {
      console.warn(`Réservation déjà existante pour l'utilisateur ${metadata.userId}`);
      return existingBooking;
    }

    const booking = await prisma.$transaction(async (tx) => {
      const bookingCount = await tx.booking.count({
        where: {
          courseId: metadata.courseId,
          date: new Date(metadata.date),
          status: 'CONFIRMED',
        },
      });
      if (bookingCount >= course.capacity) {
        throw new Error('Cours complet - capacité dépassée');
      }

      return await tx.booking.create({
        data: {
          courseId: metadata.courseId,
          userId: metadata.userId,
          date: new Date(metadata.date),
          status: 'CONFIRMED',
          stripePaymentIntentId: (session.payment_intent as string) || `demo_${session.id}`,
          paymentStatus: 'PAID',
          amount: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency || 'eur',
        },
        include: {
          course: { select: { title: true, duration: true } },
          user: { select: { name: true, email: true } },
        },
      });
    });

    console.info(`Réservation créée avec succès:`, {
      bookingId: booking.id,
      courseTitle: booking.course.title,
      userEmail: booking.user.email,
      date: booking.date,
    });

    return booking;
  }

  static async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
    const metadata = this.validateSessionMetadata(session.metadata);
    await this.createConfirmedBooking(metadata, session);
    console.info(`Webhook traité avec succès pour la session ${session.id}`);
  }
}

/**
 * Handler POST pour les webhooks Stripe
 * - Si Stripe est configuré: vérifie la signature et traite l'événement
 * - Sinon: accepte des payloads de démo (JSON) pour simuler la confirmation
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const stripeSignature = headers().get('stripe-signature');
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

    if (!stripe || !webhookSecret) {
      // Mode démo: on s'attend à un JSON avec { metadata: {courseId,date,userId,bookingType}, sessionId }
      const body = await request.json().catch(() => ({}));
      const metadata = body?.metadata as Stripe.Metadata | null;

      // Façon simple de simuler la confirmation
      if (metadata) {
        await StripeWebhookService['createConfirmedBooking'].call(StripeWebhookService, StripeWebhookService['validateSessionMetadata'](metadata), {
          id: body.sessionId || `demo_${Date.now()}`,
          payment_intent: null,
          amount_total: null,
          currency: 'eur',
        });
        return NextResponse.json({ received: true, eventType: 'demo.checkout.session.completed' }, { status: 200 });
      }

      // Sinon on ack sans action
      return NextResponse.json({ received: true, eventType: 'demo' }, { status: 200 });
    }

    // Mode réel Stripe
    const rawBody = await request.text();
    if (!stripeSignature) {
      throw ApiErrorHandler.unauthorized('Signature Stripe manquante');
    }

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(rawBody, stripeSignature, webhookSecret);
    } catch (error) {
      console.error('Erreur de vérification de signature Stripe:', error);
      throw ApiErrorHandler.unauthorized('Signature Stripe invalide');
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await StripeWebhookService.handleCheckoutSessionCompleted(session);
        break;
      }
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.info(`Session expirée: ${session.id}`);
        break;
      }
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.warn(`Paiement échoué: ${paymentIntent.id}`);
        break;
      }
      default:
        console.info(`Événement Stripe non traité: ${event.type}`);
    }

    return NextResponse.json(
      {
        received: true,
        eventType: event.type,
        eventId: event.id,
        timestamp: new Date().toISOString(),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur webhook Stripe:', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      timestamp: new Date().toISOString(),
    });
    return ApiErrorHandler.handle(error);
  }
}

/**
 * Configuration de la route
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
