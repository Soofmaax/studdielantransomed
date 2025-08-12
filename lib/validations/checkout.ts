import { z } from 'zod';

/**
 * Schéma de validation pour la création d'une session de paiement Stripe
 * Applique une validation stricte pour garantir l'intégrité des données
 */
export const createCheckoutSessionSchema = z.object({
  courseId: z
    .string()
    .uuid('L\'ID du cours doit être un UUID valide')
    .describe('Identifiant unique du cours à réserver'),
  
  date: z
    .string()
    .datetime('La date doit être au format ISO 8601')
    .refine(
      date => new Date(date) > new Date(),
      'La date de réservation doit être dans le futur'
    )
    .describe('Date et heure de la séance à réserver'),
  
  userId: z
    .string()
    .uuid('L\'ID utilisateur doit être un UUID valide')
    .describe('Identifiant unique de l\'utilisateur effectuant la réservation'),
});

/**
 * Type TypeScript inféré du schéma de validation
 */
export type ICreateCheckoutSessionRequest = z.infer<typeof createCheckoutSessionSchema>;

/**
 * Schéma de validation pour la réponse de création de session
 */
export const checkoutSessionResponseSchema = z.object({
  sessionId: z
    .string()
    .min(1, 'L\'ID de session ne peut pas être vide')
    .describe('Identifiant de la session Stripe créée'),
  
  url: z
    .string()
    .url('L\'URL de redirection doit être valide')
    .optional()
    .describe('URL de redirection vers Stripe Checkout'),
});

/**
 * Type TypeScript pour la réponse de création de session
 */
export type ICheckoutSessionResponse = z.infer<typeof checkoutSessionResponseSchema>;

