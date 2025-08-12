/**
 * Configuration NextAuth.js - Approche artisanale
 * Sécurité renforcée et expérience utilisateur optimisée
 */

import { NextAuthOptions, User, Session } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { z } from 'zod';

import { IUserSession } from '@/types/api';

// Initialisation Prisma avec gestion d'erreur
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

/**
 * Schéma de validation pour les credentials de connexion
 */
const loginSchema = z.object({
  email: z
    .string()
    .email('Format d\'email invalide')
    .min(1, 'Email requis'),
  password: z
    .string()
    .min(1, 'Mot de passe requis')
    .max(100, 'Mot de passe trop long'),
});

/**
 * Service d'authentification avec validation stricte
 */
class AuthService {
  /**
   * Authentifie un utilisateur avec email et mot de passe
   * @param credentials - Identifiants de connexion
   * @returns Utilisateur authentifié ou null
   */
  static async authenticateUser(credentials: Record<string, string>): Promise<User | null> {
    try {
      // Validation des données d'entrée
      const validatedCredentials = loginSchema.parse(credentials);
      
      // Recherche de l'utilisateur dans la base de données
      const user = await prisma.user.findUnique({
        where: { 
          email: validatedCredentials.email.toLowerCase().trim(),
        },
        select: {
          id: true,
          email: true,
          name: true,
          password: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
        },
      });

      // Vérification de l'existence de l'utilisateur
      if (!user) {
        console.warn(`Tentative de connexion avec email inexistant: ${validatedCredentials.email}`);
        return null;
      }

      // Vérification que le compte est actif
      if (!user.isActive) {
        console.warn(`Tentative de connexion avec compte désactivé: ${user.email}`);
        return null;
      }

      // Vérification du mot de passe
      const isPasswordValid = await bcrypt.compare(validatedCredentials.password, user.password);
      if (!isPasswordValid) {
        console.warn(`Tentative de connexion avec mot de passe incorrect: ${user.email}`);
        return null;
      }

      // Mise à jour de la date de dernière connexion
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLoginAt: new Date() },
      });

      // Log de connexion réussie (sans données sensibles)
      console.info(`Connexion réussie pour l'utilisateur: ${user.email}`);

      // Retour des données utilisateur (sans le mot de passe)
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: null, // Peut être étendu plus tard
      };
    } catch (error) {
      console.error('Erreur lors de l\'authentification:', error);
      return null;
    }
  }

  /**
   * Enrichit les données de session avec les informations utilisateur
   * @param token - Token JWT
   * @returns Données utilisateur enrichies
   */
  static async enrichUserSession(token: JWT): Promise<IUserSession | null> {
    try {
      if (!token.sub) return null;

      const user = await prisma.user.findUnique({
        where: { id: token.sub },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          isActive: true,
        },
      });

      if (!user || !user.isActive) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        image: token.picture || null,
      };
    } catch (error) {
      console.error('Erreur lors de l\'enrichissement de session:', error);
      return null;
    }
  }
}

/**
 * Configuration NextAuth avec sécurité renforcée
 */
export const authOptions: NextAuthOptions = {
  // Adaptateur Prisma pour la persistance des sessions
  adapter: PrismaAdapter(prisma),

  // Providers d'authentification
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Email et mot de passe',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'votre@email.com',
        },
        password: {
          label: 'Mot de passe',
          type: 'password',
          placeholder: 'Votre mot de passe',
        },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        return await AuthService.authenticateUser(credentials);
      },
    }),
  ],

  // Configuration des sessions
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 jours
    updateAge: 24 * 60 * 60, // Mise à jour quotidienne
  },

  // Configuration JWT
  jwt: {
    maxAge: 7 * 24 * 60 * 60, // 7 jours
    secret: process.env.NEXTAUTH_SECRET,
  },

  // Pages personnalisées
  pages: {
    signIn: '/login',
    signOut: '/logout',
    error: '/auth/error',
    verifyRequest: '/auth/verify-request',
    newUser: '/auth/new-user',
  },

  // Callbacks pour personnaliser le comportement
  callbacks: {
    /**
     * Callback JWT - Enrichit le token avec les données utilisateur
     */
    async jwt({ token, user, account }) {
      // Lors de la première connexion
      if (user && account) {
        token.role = user.role;
        token.isActive = true;
      }

      // Vérification périodique de l'état de l'utilisateur
      if (token.sub && Date.now() - (token.lastCheck || 0) > 60 * 60 * 1000) { // 1 heure
        const currentUser = await AuthService.enrichUserSession(token);
        if (!currentUser) {
          // Utilisateur désactivé ou supprimé
          return {};
        }
        token.role = currentUser.role;
        token.lastCheck = Date.now();
      }

      return token;
    },

    /**
     * Callback Session - Formate les données de session
     */
    async session({ session, token }): Promise<Session> {
      if (token.sub) {
        const userSession = await AuthService.enrichUserSession(token);
        
        if (userSession) {
          session.user = {
            ...session.user,
            id: userSession.id,
            role: userSession.role,
          };
        } else {
          // Session invalide
          return {} as Session;
        }
      }

      return session;
    },

    /**
     * Callback de redirection - Sécurise les redirections
     */
    async redirect({ url, baseUrl }) {
      // Permet les redirections vers le même domaine
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      
      // Permet les redirections vers le domaine de base
      if (new URL(url).origin === baseUrl) return url;
      
      // Redirection par défaut
      return baseUrl;
    },
  },

  // Événements pour le logging et la sécurité
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.info(`Connexion réussie:`, {
        userId: user.id,
        email: user.email,
        provider: account?.provider,
        isNewUser,
        timestamp: new Date().toISOString(),
      });
    },

    async signOut({ token }) {
      console.info(`Déconnexion:`, {
        userId: token?.sub,
        timestamp: new Date().toISOString(),
      });
    },

    async createUser({ user }) {
      console.info(`Nouvel utilisateur créé:`, {
        userId: user.id,
        email: user.email,
        timestamp: new Date().toISOString(),
      });
    },
  },

  // Configuration de debug (uniquement en développement)
  debug: process.env.NODE_ENV === 'development',

  // Configuration de sécurité
  useSecureCookies: process.env.NODE_ENV === 'production',
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 7 * 24 * 60 * 60, // 7 jours
      },
    },
  },
};

/**
 * Utilitaires d'authentification pour les composants
 */
export class AuthUtils {
  /**
   * Vérifie si l'utilisateur a un rôle spécifique
   * @param session - Session utilisateur
   * @param role - Rôle requis
   * @returns true si l'utilisateur a le rôle
   */
  static hasRole(session: Session | null, role: string): boolean {
    return session?.user?.role === role;
  }

  /**
   * Vérifie si l'utilisateur est administrateur
   * @param session - Session utilisateur
   * @returns true si l'utilisateur est admin
   */
  static isAdmin(session: Session | null): boolean {
    return this.hasRole(session, 'ADMIN');
  }

  /**
   * Vérifie si l'utilisateur est authentifié
   * @param session - Session utilisateur
   * @returns true si l'utilisateur est authentifié
   */
  static isAuthenticated(session: Session | null): boolean {
    return !!session?.user?.id;
  }

  /**
   * Obtient l'ID de l'utilisateur depuis la session
   * @param session - Session utilisateur
   * @returns ID utilisateur ou null
   */
  static getUserId(session: Session | null): string | null {
    return session?.user?.id || null;
  }
}

