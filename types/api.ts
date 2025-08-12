/**
 * Types et interfaces pour les APIs - Approche artisanale
 * Élimination complète des types 'any' pour une sécurité de type maximale
 */

import { User, Course, Booking, Role, Level } from '@prisma/client';

// =============================================================================
// TYPES DE BASE ET UTILITAIRES
// =============================================================================

/**
 * Type utilitaire pour les réponses API standardisées
 */
export interface IApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  timestamp: string;
}

/**
 * Type utilitaire pour les erreurs API
 */
export interface IApiError {
  type: string;
  message: string;
  details?: Record<string, unknown>;
  statusCode: number;
}

/**
 * Interface d'erreur API étendue (compatible avec l'existant)
 */
export interface ApiError extends Error {
  response?: {
    data?: {
      message?: string;
    };
    status?: number;
  };
}

/**
 * Type utilitaire pour la pagination
 */
export interface IPaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Type utilitaire pour les réponses paginées
 */
export interface IPaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// =============================================================================
// INTERFACES UTILISATEUR
// =============================================================================

/**
 * Interface pour les données utilisateur publiques (sans informations sensibles)
 */
export interface IPublicUser {
  id: string;
  name: string | null;
  email: string;
  role: Role;
  createdAt: Date;
}

/**
 * Interface pour les données utilisateur complètes (admin uniquement)
 */
export interface IFullUser extends IPublicUser {
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
}

/**
 * Interface pour la création d'un utilisateur
 */
export interface ICreateUserRequest {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

/**
 * Interface pour la mise à jour d'un utilisateur
 */
export interface IUpdateUserRequest {
  name?: string;
  email?: string;
  role?: Role;
  isActive?: boolean;
}

/**
 * Interface pour la connexion utilisateur
 */
export interface ILoginRequest {
  email: string;
  password: string;
}

/**
 * Interface pour la réponse de connexion
 */
export interface ILoginResponse {
  user: IPublicUser;
  accessToken: string;
  refreshToken?: string;
  expiresAt: Date;
}

// =============================================================================
// INTERFACES COURS
// =============================================================================

/**
 * Interface pour les données de cours publiques
 */
export interface IPublicCourse {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  level: Level;
  capacity: number;
  imageUrl?: string;
  isActive: boolean;
}

/**
 * Interface pour les données de cours complètes (admin)
 */
export interface IFullCourse extends IPublicCourse {
  createdAt: Date;
  updatedAt: Date;
  bookingsCount?: number;
}

/**
 * Interface pour la création d'un cours
 */
export interface ICreateCourseRequest {
  title: string;
  description: string;
  price: number;
  duration: number;
  level: Level;
  capacity: number;
  imageUrl?: string;
  isActive?: boolean;
}

/**
 * Interface pour la mise à jour d'un cours
 */
export interface IUpdateCourseRequest {
  title?: string;
  description?: string;
  price?: number;
  duration?: number;
  level?: Level;
  capacity?: number;
  imageUrl?: string;
  isActive?: boolean;
}

// =============================================================================
// INTERFACES RÉSERVATIONS
// =============================================================================

/**
 * Statuts de réservation possibles
 */
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

/**
 * Statuts de paiement possibles
 */
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED' | 'REFUNDED';

/**
 * Interface pour les données de réservation publiques
 */
export interface IPublicBooking {
  id: string;
  courseId: string;
  userId: string;
  date: Date;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  amount: number;
  currency: string;
  createdAt: Date;
}

/**
 * Interface pour les données de réservation avec relations
 */
export interface IBookingWithRelations extends IPublicBooking {
  course: IPublicCourse;
  user: IPublicUser;
}

/**
 * Interface pour la création d'une réservation
 */
export interface ICreateBookingRequest {
  courseId: string;
  userId: string;
  date: string; // ISO string
}

/**
 * Interface pour la mise à jour d'une réservation
 */
export interface IUpdateBookingRequest {
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
  date?: string; // ISO string
}

// =============================================================================
// INTERFACES PAIEMENT STRIPE
// =============================================================================

/**
 * Interface pour la création d'une session de paiement
 */
export interface ICreateCheckoutSessionRequest {
  courseId: string;
  date: string; // ISO string
  userId: string;
}

/**
 * Interface pour la réponse de création de session
 */
export interface ICheckoutSessionResponse {
  sessionId: string;
  url: string | null;
}

/**
 * Interface pour les métadonnées de session Stripe
 */
export interface IStripeSessionMetadata {
  courseId: string;
  date: string;
  userId: string;
  bookingType: 'course_booking';
}

/**
 * Interface pour les données de webhook Stripe
 */
export interface IStripeWebhookData {
  eventType: string;
  eventId: string;
  sessionId?: string;
  paymentIntentId?: string;
  metadata?: IStripeSessionMetadata;
}

// =============================================================================
// INTERFACES AUTHENTIFICATION
// =============================================================================

/**
 * Interface pour les données de session utilisateur
 */
export interface IUserSession {
  id: string;
  email: string;
  name: string | null;
  role: Role;
  image?: string | null;
}

/**
 * Interface pour le contexte d'authentification
 */
export interface IAuthContext {
  user: IUserSession | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
}

// =============================================================================
// INTERFACES FORMULAIRES
// =============================================================================

/**
 * Interface pour le formulaire de contact
 */
export interface IContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Interface pour le formulaire de réservation
 */
export interface IBookingFormData {
  courseId: string;
  date: string;
  specialRequests?: string;
}

/**
 * Interface pour le formulaire de profil utilisateur
 */
export interface IProfileFormData {
  name: string;
  email: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// =============================================================================
// INTERFACES COMPOSANTS REACT
// =============================================================================

/**
 * Props de base pour tous les composants
 */
export interface IBaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Props pour les composants de chargement
 */
export interface ILoadingProps extends IBaseComponentProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'skeleton' | 'dots';
}

/**
 * Props pour les composants d'erreur
 */
export interface IErrorProps extends IBaseComponentProps {
  error: Error | string;
  retry?: () => void;
  showDetails?: boolean;
}

/**
 * Props pour les composants de modal
 */
export interface IModalProps extends IBaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

// =============================================================================
// TYPES UTILITAIRES AVANCÉS
// =============================================================================

/**
 * Type pour extraire les clés d'un objet qui sont des strings
 */
export type StringKeys<T> = {
  [K in keyof T]: T[K] extends string ? K : never;
}[keyof T];

/**
 * Type pour rendre certaines propriétés optionnelles
 */
export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/**
 * Type pour rendre certaines propriétés requises
 */
export type RequiredBy<T, K extends keyof T> = T & Required<Pick<T, K>>;

/**
 * Type pour les handlers d'événements React
 */
export type EventHandler<T = HTMLElement> = (event: React.SyntheticEvent<T>) => void;

/**
 * Type pour les handlers de formulaire
 */
export type FormHandler<T = HTMLFormElement> = (event: React.FormEvent<T>) => void;

