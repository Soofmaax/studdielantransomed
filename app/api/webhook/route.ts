import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

import { ApiErrorHandler } from '@/lib/api/error-handler';

// Initialisation sécurisée de Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
  typescript: true,
});

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
  /**
   * Valide et extrait les métadonnées de la session Stripe
   * @param metadata - Métadonnées brutes de Stripe
   * @returns Métadonnées validées
   */
  private static validateSessionMetadata(
    metadata: Stripe.Metadata | null
  ): IValidatedSessionMetadata {
    if (!metadata) {
      throw new Error('Métadonnées de session manquantes');
    }

    const { courseId, date, userId, bookingType } = metadata;

    // Validation stricte des métadonnées
    if (!courseId || typeof courseId !== 'string') {
      throw new Error('ID de cours invalide dans les métadonnées');
    }

    if (!date || typeof date !== 'string') {
      throw new Error('Date invalide dans les métadonnées');
    }

    if (!userId || typeof userId !== 'string') {
      throw new Error('ID utilisateur invalide dans les métadonnées');
    }

    if (bookingType !== 'course_booking') {
      throw new Error('Type de réservation invalide');
    }

    // Validation du format de date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error('Format de date invalide');
    }

    return { courseId, date, userId, bookingType };
  }

  /**
   * Crée une réservation confirmée dans la base de données
   * @param metadata - Métadonnées validées de la session
   * @param session - Session Stripe complète
   * @returns Réservation créée
   */
  private static async createConfirmedBooking(
    metadata: IValidatedSessionMetadata,
    session: Stripe.Checkout.Session
  ) {
    // Vérification que le cours existe toujours
    const course = await prisma.course.findUnique({
      where: { id: metadata.courseId },
      select: { id: true, title: true, capacity: true },
    });

    if (!course) {
      throw new Error(`Cours ${metadata.courseId} introuvable`);
    }

    // Vérification que l'utilisateur existe
    const user = await prisma.user.findUnique({
      where: { id: metadata.userId },
      select: { id: true, email: true, name: true },
    });

    if (!user) {
      throw new Error(`Utilisateur ${metadata.userId} introuvable`);
    }

    // Vérification de la disponibilité (protection contre les réservations multiples)
    const existingBooking = await prisma.booking.findFirst({
      where: {
        courseId: metadata.courseId,
        userId: metadata.userId,
        date: new Date(metadata.date),
        status: {
          in: ['CONFIRMED', 'PENDING'],
        },
      },
    });

    if (existingBooking) {
      console.warn(`Réservation déjà existante pour l'utilisateur ${metadata.userId}`);
      return existingBooking;
    }

    // Création de la réservation avec transaction pour garantir la cohérence
    const booking = await prisma.$transaction(async (tx) => {
      // Vérification finale de la capacité
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

      // Création de la réservation
      return await tx.booking.create({
        data: {
          courseId: metadata.courseId,
          userId: metadata.userId,
          date: new Date(metadata.date),
          status: 'CONFIRMED',
          paymentId: session.payment_intent as string,
          paymentStatus: 'PAID',
          amount: session.amount_total ? session.amount_total / 100 : 0,
          currency: session.currency || 'eur',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        include: {
          course: {
            select: { title: true, duration: true },
          },
          user: {
            select: { name: true, email: true },
          },
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

  /**
   * Traite l'événement de session de paiement complétée
   * @param session - Session Stripe complétée
   */
  static async handleCheckoutSessionCompleted(session: Stripe.Checkout.Session): Promise<void> {
    try {
      // Validation des métadonnées
      const metadata = this.validateSessionMetadata(session.metadata);

      // Création de la réservation
      await this.createConfirmedBooking(metadata, session);

      console.info(`Webhook traité avec succès pour la session ${session.id}`);
    } catch (error) {
      console.error(`Erreur lors du traitement du webhook pour la session ${session.id}:`, error);
      throw error;
    }
  }

  /**
   * Traite l'événement d'échec de paiement
   * @param session - Session Stripe échouée
   */
  static async handlePaymentFailed(session: Stripe.Checkout.Session): Promise<void> {
    console.warn(`Paiement échoué pour la session ${session.id}`, {
      metadata: session.metadata,
      customerEmail: session.customer_email,
    });

    // Ici on pourrait implémenter une logique de notification à l'utilisateur
    // ou de nettoyage des réservations temporaires
  }
}

/**
 * Handler POST pour les webhooks Stripe
 * Vérifie la signature et traite les événements de manière sécurisée
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // Récupération du body brut et de la signature
    const body = await request.text();
    const signature = headers().get('stripe-signature');

    if (!signature) {
      throw ApiErrorHandler.unauthorized('Signature Stripe manquante');
    }

    // Vérification de la configuration des secrets
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET non configuré');
    }

    // Vérification de la signature Stripe
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error) {
      console.error('Erreur de vérification de signature Stripe:', error);
      throw ApiErrorHandler.unauthorized('Signature Stripe invalide');
    }

    // Traitement des événements selon leur type
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        await StripeWebhookService.handleCheckoutSessionCompleted(session);
        break;
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.info(`Session expirée: ${session.id}`);
        // Ici on pourrait nettoyer les réservations temporaires
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

    // Réponse de succès pour Stripe
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
    // Log détaillé pour le debugging
    console.error('Erreur webhook Stripe:', {
      error: error instanceof Error ? error.message : 'Erreur inconnue',
      timestamp: new Date().toISOString(),
    });

    return ApiErrorHandler.handle(error);
  }
}

/**
 * Configuration de la route pour optimiser les performances
 */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

