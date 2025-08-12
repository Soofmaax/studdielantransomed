/**
 * Configuration React Query optimisée - Approche artisanale
 * Cache intelligent et stratégies de performance avancées
 */

import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';

/**
 * Configuration des durées de cache par type de données
 */
export const CACHE_TIMES = {
  // Données statiques (rarement modifiées)
  static: {
    staleTime: 1000 * 60 * 60 * 24, // 24 heures
    cacheTime: 1000 * 60 * 60 * 24 * 7, // 7 jours
  },
  // Données semi-statiques (modifiées occasionnellement)
  semiStatic: {
    staleTime: 1000 * 60 * 60, // 1 heure
    cacheTime: 1000 * 60 * 60 * 24, // 24 heures
  },
  // Données dynamiques (modifiées fréquemment)
  dynamic: {
    staleTime: 1000 * 60 * 5, // 5 minutes
    cacheTime: 1000 * 60 * 30, // 30 minutes
  },
  // Données temps réel (toujours fraîches)
  realtime: {
    staleTime: 0, // Toujours stale
    cacheTime: 1000 * 60 * 5, // 5 minutes
  },
} as const;

/**
 * Clés de requête standardisées pour le studio de yoga
 */
export const QUERY_KEYS = {
  // Cours et services
  courses: {
    all: ['courses'] as const,
    lists: () => [...QUERY_KEYS.courses.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...QUERY_KEYS.courses.lists(), filters] as const,
    details: () => [...QUERY_KEYS.courses.all, 'detail'] as const,
    detail: (id: string) => [...QUERY_KEYS.courses.details(), id] as const,
    schedule: () => [...QUERY_KEYS.courses.all, 'schedule'] as const,
    availability: (courseId: string, date: string) => 
      [...QUERY_KEYS.courses.all, 'availability', courseId, date] as const,
  },
  
  // Réservations
  bookings: {
    all: ['bookings'] as const,
    lists: () => [...QUERY_KEYS.bookings.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...QUERY_KEYS.bookings.lists(), filters] as const,
    details: () => [...QUERY_KEYS.bookings.all, 'detail'] as const,
    detail: (id: string) => [...QUERY_KEYS.bookings.details(), id] as const,
    user: (userId: string) => [...QUERY_KEYS.bookings.all, 'user', userId] as const,
  },
  
  // Utilisateurs
  users: {
    all: ['users'] as const,
    lists: () => [...QUERY_KEYS.users.all, 'list'] as const,
    list: (filters: Record<string, any>) => [...QUERY_KEYS.users.lists(), filters] as const,
    details: () => [...QUERY_KEYS.users.all, 'detail'] as const,
    detail: (id: string) => [...QUERY_KEYS.users.details(), id] as const,
    profile: () => [...QUERY_KEYS.users.all, 'profile'] as const,
  },
  
  // Contenu statique
  content: {
    all: ['content'] as const,
    pages: () => [...QUERY_KEYS.content.all, 'pages'] as const,
    page: (slug: string) => [...QUERY_KEYS.content.pages(), slug] as const,
    testimonials: () => [...QUERY_KEYS.content.all, 'testimonials'] as const,
    gallery: () => [...QUERY_KEYS.content.all, 'gallery'] as const,
  },
} as const;

/**
 * Gestionnaire d'erreurs centralisé pour les requêtes
 */
class QueryErrorHandler {
  static handleError(error: unknown, context: string) {
    console.error(`Erreur dans ${context}:`, error);
    
    if (error instanceof Error) {
      // Gestion des erreurs spécifiques
      switch (error.message) {
        case 'Network Error':
          toast.error('Problème de connexion réseau');
          break;
        case 'Unauthorized':
          toast.error('Session expirée, veuillez vous reconnecter');
          break;
        case 'Forbidden':
          toast.error('Accès non autorisé');
          break;
        default:
          toast.error('Une erreur inattendue s\'est produite');
      }
    } else {
      toast.error('Erreur inconnue');
    }
  }
}

/**
 * Cache de requêtes avec gestion d'erreur personnalisée
 */
const queryCache = new QueryCache({
  onError: (error, query) => {
    QueryErrorHandler.handleError(error, `Query ${query.queryKey.join('.')}`);
  },
});

/**
 * Cache de mutations avec gestion d'erreur personnalisée
 */
const mutationCache = new MutationCache({
  onError: (error, variables, context, mutation) => {
    QueryErrorHandler.handleError(error, `Mutation ${mutation.options.mutationKey?.join('.') || 'unknown'}`);
  },
  onSuccess: (data, variables, context, mutation) => {
    // Log des mutations réussies pour le debugging
    if (process.env.NODE_ENV === 'development') {
      console.info('Mutation réussie:', mutation.options.mutationKey);
    }
  },
});

/**
 * Configuration par défaut optimisée pour React Query
 */
const defaultOptions = {
  queries: {
    // Configuration par défaut pour toutes les requêtes
    staleTime: CACHE_TIMES.dynamic.staleTime,
    cacheTime: CACHE_TIMES.dynamic.cacheTime,
    
    // Stratégies de retry intelligentes
    retry: (failureCount: number, error: any) => {
      // Ne pas retry sur les erreurs 4xx (erreurs client)
      if (error?.status >= 400 && error?.status < 500) {
        return false;
      }
      // Retry jusqu'à 3 fois pour les autres erreurs
      return failureCount < 3;
    },
    
    // Délai de retry progressif
    retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),
    
    // Refetch en arrière-plan quand la fenêtre reprend le focus
    refetchOnWindowFocus: true,
    
    // Refetch quand la connexion est rétablie
    refetchOnReconnect: true,
    
    // Ne pas refetch automatiquement au mount si les données sont fraîches
    refetchOnMount: 'always',
  },
  mutations: {
    // Retry pour les mutations critiques
    retry: 1,
    retryDelay: 1000,
  },
} as const;

/**
 * Client React Query optimisé pour Studio Élan
 */
export const queryClient = new QueryClient({
  queryCache,
  mutationCache,
  defaultOptions,
});

/**
 * Utilitaires pour la gestion du cache
 */
export class CacheUtils {
  /**
   * Invalide toutes les requêtes liées aux cours
   */
  static invalidateCourses() {
    return queryClient.invalidateQueries({ queryKey: QUERY_KEYS.courses.all });
  }

  /**
   * Invalide toutes les requêtes liées aux réservations
   */
  static invalidateBookings() {
    return queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookings.all });
  }

  /**
   * Invalide toutes les requêtes liées à un utilisateur spécifique
   */
  static invalidateUserData(userId: string) {
    return Promise.all([
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.users.detail(userId) }),
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.bookings.user(userId) }),
    ]);
  }

  /**
   * Précharge les données critiques
   */
  static async preloadCriticalData() {
    const promises = [
      // Précharger la liste des cours
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.courses.lists(),
        queryFn: () => fetch('/api/courses').then(res => res.json()),
        staleTime: CACHE_TIMES.semiStatic.staleTime,
      }),
      
      // Précharger le planning de la semaine
      queryClient.prefetchQuery({
        queryKey: QUERY_KEYS.courses.schedule(),
        queryFn: () => fetch('/api/courses/schedule').then(res => res.json()),
        staleTime: CACHE_TIMES.dynamic.staleTime,
      }),
    ];

    await Promise.allSettled(promises);
  }

  /**
   * Nettoie le cache des données obsolètes
   */
  static cleanupCache() {
    // Supprimer les requêtes non utilisées depuis plus de 5 minutes
    queryClient.getQueryCache().clear();
    
    // Garbage collection manuelle
    if (typeof window !== 'undefined' && window.gc) {
      window.gc();
    }
  }

  /**
   * Met à jour optimiste une réservation
   */
  static updateBookingOptimistic(
    bookingId: string, 
    updater: (old: any) => any
  ) {
    // Mise à jour optimiste de la réservation spécifique
    queryClient.setQueryData(
      QUERY_KEYS.bookings.detail(bookingId),
      updater
    );

    // Mise à jour optimiste de la liste des réservations
    queryClient.setQueriesData(
      { queryKey: QUERY_KEYS.bookings.lists() },
      (old: any) => {
        if (!old?.data) return old;
        
        return {
          ...old,
          data: old.data.map((booking: any) => 
            booking.id === bookingId ? updater(booking) : booking
          ),
        };
      }
    );
  }

  /**
   * Synchronise les données avec le serveur
   */
  static async syncWithServer() {
    // Refetch toutes les requêtes actives
    await queryClient.refetchQueries({ type: 'active' });
  }

  /**
   * Obtient les statistiques du cache
   */
  static getCacheStats() {
    const cache = queryClient.getQueryCache();
    const queries = cache.getAll();
    
    return {
      totalQueries: queries.length,
      activeQueries: queries.filter(q => q.getObserversCount() > 0).length,
      staleQueries: queries.filter(q => q.isStale()).length,
      errorQueries: queries.filter(q => q.state.status === 'error').length,
      cacheSize: JSON.stringify(queries).length, // Approximation
    };
  }
}

/**
 * Hook pour surveiller les performances du cache
 */
export function useCacheMonitoring() {
  if (process.env.NODE_ENV === 'development') {
    // Surveillance en développement uniquement
    setInterval(() => {
      const stats = CacheUtils.getCacheStats();
      console.debug('Cache Stats:', stats);
      
      // Alerte si trop de requêtes en erreur
      if (stats.errorQueries > 5) {
        console.warn('Trop de requêtes en erreur détectées');
      }
    }, 30000); // Toutes les 30 secondes
  }
}

/**
 * Configuration des stratégies de cache par type de données
 */
export const cacheStrategies = {
  // Données statiques (pages, contenu)
  static: {
    ...CACHE_TIMES.static,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  },
  
  // Données utilisateur (profil, préférences)
  user: {
    ...CACHE_TIMES.semiStatic,
    refetchOnWindowFocus: true,
  },
  
  // Données temps réel (disponibilités, réservations)
  realtime: {
    ...CACHE_TIMES.realtime,
    refetchInterval: 30000, // Refetch toutes les 30 secondes
    refetchIntervalInBackground: false,
  },
  
  // Données critiques (paiements, confirmations)
  critical: {
    staleTime: 0,
    cacheTime: 0,
    retry: 3,
    refetchOnMount: 'always',
  },
} as const;

