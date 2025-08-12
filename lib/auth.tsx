/**
 * Provider d'authentification React - Approche artisanale
 * Gestion d'état optimisée avec typage strict et performance
 */

'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import { Session } from 'next-auth';

import { IAuthContext, IUserSession } from '@/types/api';

/**
 * Interface pour les options de connexion
 */
interface ISignInOptions {
  email: string;
  password: string;
  redirect?: boolean;
  callbackUrl?: string;
}

/**
 * Interface pour les options de déconnexion
 */
interface ISignOutOptions {
  callbackUrl?: string;
  redirect?: boolean;
}

/**
 * Contexte d'authentification avec valeurs par défaut sécurisées
 */
const AuthContext = createContext<IAuthContext>({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  login: async () => {
    throw new Error('AuthProvider non initialisé');
  },
  logout: async () => {
    throw new Error('AuthProvider non initialisé');
  },
  refreshSession: async () => {
    throw new Error('AuthProvider non initialisé');
  },
});

/**
 * Hook personnalisé pour accéder au contexte d'authentification
 * Inclut une vérification de sécurité pour s'assurer que le provider est initialisé
 */
export function useAuth(): IAuthContext {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  
  return context;
}

/**
 * Utilitaires pour la transformation des données de session
 */
class SessionUtils {
  /**
   * Transforme une session NextAuth en données utilisateur typées
   * @param session - Session NextAuth
   * @returns Données utilisateur ou null
   */
  static transformSessionToUser(session: Session | null): IUserSession | null {
    if (!session?.user) return null;

    return {
      id: session.user.id || '',
      email: session.user.email || '',
      name: session.user.name || null,
      role: session.user.role || 'CLIENT',
      image: session.user.image || null,
    };
  }

  /**
   * Valide qu'une session contient les données minimales requises
   * @param session - Session à valider
   * @returns true si la session est valide
   */
  static isValidSession(session: Session | null): boolean {
    return !!(
      session?.user?.id &&
      session?.user?.email &&
      session?.user?.role
    );
  }
}

/**
 * Props du composant AuthProvider
 */
interface IAuthProviderProps {
  children: React.ReactNode;
}

/**
 * Provider d'authentification avec gestion d'état optimisée
 * 
 * Fonctionnalités :
 * - Gestion automatique de l'état de session
 * - Mémoisation pour éviter les re-renders inutiles
 * - Gestion d'erreur robuste
 * - Typage strict TypeScript
 * - Logging pour le debugging
 */
export function AuthProvider({ children }: IAuthProviderProps): JSX.Element {
  const { data: session, status, update } = useSession();
  const [error, setError] = useState<string | null>(null);

  // État dérivé mémorisé pour optimiser les performances
  const user = useMemo(() => {
    if (status === 'loading') return null;
    return SessionUtils.transformSessionToUser(session);
  }, [session, status]);

  const isLoading = useMemo(() => status === 'loading', [status]);
  
  const isAuthenticated = useMemo(() => {
    return SessionUtils.isValidSession(session);
  }, [session]);

  /**
   * Fonction de connexion avec gestion d'erreur améliorée
   */
  const login = useCallback(async (email: string, password: string): Promise<void> => {
    try {
      setError(null);

      // Validation des paramètres
      if (!email?.trim() || !password?.trim()) {
        throw new Error('Email et mot de passe requis');
      }

      const options: ISignInOptions = {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      };

      const result = await signIn('credentials', options);

      if (result?.error) {
        // Gestion des erreurs spécifiques
        switch (result.error) {
          case 'CredentialsSignin':
            throw new Error('Email ou mot de passe incorrect');
          case 'AccessDenied':
            throw new Error('Accès refusé - compte désactivé');
          default:
            throw new Error('Erreur de connexion - veuillez réessayer');
        }
      }

      if (!result?.ok) {
        throw new Error('Échec de la connexion');
      }

      // Log de succès (sans données sensibles)
      console.info('Connexion réussie pour:', email);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de connexion inconnue';
      setError(errorMessage);
      
      // Log d'erreur (sans données sensibles)
      console.error('Erreur de connexion:', errorMessage);
      
      throw error;
    }
  }, []);

  /**
   * Fonction de déconnexion avec options personnalisables
   */
  const logout = useCallback(async (options?: ISignOutOptions): Promise<void> => {
    try {
      setError(null);

      const signOutOptions = {
        redirect: options?.redirect ?? true,
        callbackUrl: options?.callbackUrl ?? '/',
      };

      await signOut(signOutOptions);

      console.info('Déconnexion réussie');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de déconnexion';
      setError(errorMessage);
      console.error('Erreur de déconnexion:', errorMessage);
      throw error;
    }
  }, []);

  /**
   * Fonction pour rafraîchir la session
   */
  const refreshSession = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      await update();
      console.info('Session rafraîchie');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erreur de rafraîchissement';
      setError(errorMessage);
      console.error('Erreur de rafraîchissement de session:', errorMessage);
      throw error;
    }
  }, [update]);

  /**
   * Effet pour gérer les changements d'état de session
   */
  useEffect(() => {
    if (status === 'authenticated' && !SessionUtils.isValidSession(session)) {
      console.warn('Session invalide détectée, déconnexion automatique');
      logout({ redirect: false });
    }
  }, [session, status, logout]);

  /**
   * Effet pour nettoyer les erreurs lors des changements de session
   */
  useEffect(() => {
    if (status !== 'loading') {
      setError(null);
    }
  }, [status]);

  /**
   * Valeur du contexte mémorisée pour optimiser les performances
   */
  const contextValue = useMemo<IAuthContext>(() => ({
    user,
    isLoading,
    isAuthenticated,
    login,
    logout,
    refreshSession,
  }), [user, isLoading, isAuthenticated, login, logout, refreshSession]);

  /**
   * Logging pour le debugging en développement
   */
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.debug('AuthProvider state:', {
        status,
        isAuthenticated,
        userId: user?.id,
        userRole: user?.role,
        error,
      });
    }
  }, [status, isAuthenticated, user, error]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook pour vérifier les permissions utilisateur
 */
export function usePermissions() {
  const { user, isAuthenticated } = useAuth();

  return useMemo(() => ({
    isAuthenticated,
    isAdmin: user?.role === 'ADMIN',
    isClient: user?.role === 'CLIENT',
    hasRole: (role: string) => user?.role === role,
    canAccess: (requiredRole?: string) => {
      if (!requiredRole) return isAuthenticated;
      return isAuthenticated && user?.role === requiredRole;
    },
  }), [user, isAuthenticated]);
}

/**
 * Hook pour les actions d'authentification avec état de chargement
 */
export function useAuthActions() {
  const { login, logout, refreshSession } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogin = useCallback(async (email: string, password: string) => {
    setIsLoggingIn(true);
    try {
      await login(email, password);
    } finally {
      setIsLoggingIn(false);
    }
  }, [login]);

  const handleLogout = useCallback(async (options?: ISignOutOptions) => {
    setIsLoggingOut(true);
    try {
      await logout(options);
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout]);

  return {
    login: handleLogin,
    logout: handleLogout,
    refreshSession,
    isLoggingIn,
    isLoggingOut,
  };
}

