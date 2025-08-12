import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { randomBytes } from 'crypto';

/**
 * Configuration des routes protégées et publiques
 */
const ROUTE_CONFIG = {
  // Routes nécessitant une authentification
  protected: ['/admin', '/dashboard', '/profile', '/bookings'],
  
  // Routes publiques (pas de redirection même si non authentifié)
  public: ['/', '/about', '/services', '/contact', '/login', '/register'],
  
  // Routes API exclues du middleware de redirection
  apiExclusions: ['/api/auth', '/api/webhook'],
} as const;

/**
 * Générateur de nonce cryptographiquement sécurisé pour CSP
 */
function generateNonce(): string {
  return randomBytes(16).toString('base64');
}

/**
 * Service de gestion des headers de sécurité
 * Applique les meilleures pratiques de sécurité web
 */
class SecurityHeadersService {
  /**
   * Génère une Content Security Policy stricte avec nonces
   * @param nonce - Nonce généré pour cette requête
   * @returns Politique CSP complète
   */
  private static generateCSP(nonce: string): string {
    const cspDirectives = [
      // Sources par défaut : uniquement le domaine actuel
      "default-src 'self'",
      
      // Scripts : domaine + nonce + domaines externes nécessaires
      `script-src 'self' 'nonce-${nonce}' https://js.stripe.com https://www.googletagmanager.com`,
      
      // Styles : domaine + nonce + fonts Google
      `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
      
      // Images : domaine + data URLs + domaines externes optimisés
      "img-src 'self' data: blob: https://images.unsplash.com https://res.cloudinary.com",
      
      // Fonts : domaine + Google Fonts
      "font-src 'self' https://fonts.gstatic.com",
      
      // Connexions : domaine + APIs externes nécessaires
      "connect-src 'self' https://api.stripe.com https://www.google-analytics.com",
      
      // Frames : uniquement Stripe pour les paiements
      "frame-src https://js.stripe.com https://hooks.stripe.com",
      
      // Objets : aucun (sécurité renforcée)
      "object-src 'none'",
      
      // Base URI : uniquement le domaine actuel
      "base-uri 'self'",
      
      // Formulaires : uniquement le domaine actuel
      "form-action 'self'",
      
      // Upgrade des requêtes HTTP vers HTTPS
      "upgrade-insecure-requests",
      
      // Bloque le contenu mixte
      "block-all-mixed-content",
    ];

    return cspDirectives.join('; ');
  }

  /**
   * Applique tous les headers de sécurité recommandés
   * @param response - Réponse Next.js
   * @param nonce - Nonce pour CSP
   */
  static applySecurityHeaders(response: NextResponse, nonce: string): void {
    // Content Security Policy stricte
    response.headers.set('Content-Security-Policy', this.generateCSP(nonce));
    
    // Protection contre le clickjacking
    response.headers.set('X-Frame-Options', 'DENY');
    
    // Prévention du MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');
    
    // Protection XSS intégrée au navigateur
    response.headers.set('X-XSS-Protection', '1; mode=block');
    
    // Politique de référent stricte
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // Permissions Policy (anciennement Feature Policy)
    response.headers.set(
      'Permissions-Policy',
      'camera=(), microphone=(), geolocation=(), payment=(self)'
    );
    
    // HSTS (HTTP Strict Transport Security) - uniquement en production HTTPS
    if (process.env.NODE_ENV === 'production') {
      response.headers.set(
        'Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
      );
    }
    
    // Désactiver les informations du serveur
    response.headers.set('Server', '');
    
    // Cross-Origin Embedder Policy
    response.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
    
    // Cross-Origin Opener Policy
    response.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    
    // Cross-Origin Resource Policy
    response.headers.set('Cross-Origin-Resource-Policy', 'same-origin');
    
    // Ajouter le nonce aux headers pour utilisation côté client
    response.headers.set('X-Nonce', nonce);
  }
}

/**
 * Service de gestion de l'authentification et des routes
 */
class AuthenticationService {
  /**
   * Vérifie si une route nécessite une authentification
   * @param pathname - Chemin de la requête
   * @returns true si la route est protégée
   */
  static isProtectedRoute(pathname: string): boolean {
    return ROUTE_CONFIG.protected.some(route => pathname.startsWith(route));
  }

  /**
   * Vérifie si une route API doit être exclue du middleware d'auth
   * @param pathname - Chemin de la requête
   * @returns true si la route doit être exclue
   */
  static isApiExclusion(pathname: string): boolean {
    return ROUTE_CONFIG.apiExclusions.some(route => pathname.startsWith(route));
  }

  /**
   * Gère la redirection des utilisateurs non authentifiés
   * @param request - Requête Next.js
   * @param token - Token d'authentification
   * @returns Réponse de redirection ou null
   */
  static async handleAuthRedirection(
    request: NextRequest,
    token: any
  ): Promise<NextResponse | null> {
    const { pathname } = request.nextUrl;

    // Ignorer les routes API d'authentification et webhooks
    if (pathname.startsWith('/api') && this.isApiExclusion(pathname)) {
      return null;
    }

    // Redirection des routes protégées pour les utilisateurs non authentifiés
    if (this.isProtectedRoute(pathname) && !token) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Redirection des utilisateurs authentifiés depuis la page de login
    if (pathname === '/login' && token) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return null;
  }
}

/**
 * Middleware principal de sécurité et d'authentification
 * Applique une approche artisanale avec sécurité renforcée
 */
export async function middleware(request: NextRequest): Promise<NextResponse> {
  try {
    // Génération d'un nonce unique pour cette requête
    const nonce = generateNonce();

    // Vérification du token d'authentification
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    // Gestion de l'authentification et des redirections
    const authRedirect = await AuthenticationService.handleAuthRedirection(request, token);
    if (authRedirect) {
      // Appliquer les headers de sécurité même sur les redirections
      SecurityHeadersService.applySecurityHeaders(authRedirect, nonce);
      return authRedirect;
    }

    // Création de la réponse avec headers personnalisés
    const response = NextResponse.next({
      request: {
        headers: new Headers(request.headers),
      },
    });

    // Application des headers de sécurité
    SecurityHeadersService.applySecurityHeaders(response, nonce);

    // Ajout d'informations de debugging en développement
    if (process.env.NODE_ENV === 'development') {
      response.headers.set('X-Debug-Route', request.nextUrl.pathname);
      response.headers.set('X-Debug-Authenticated', token ? 'true' : 'false');
    }

    return response;
  } catch (error) {
    // Log de l'erreur sans exposer de détails sensibles
    console.error('Erreur middleware:', {
      pathname: request.nextUrl.pathname,
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Erreur inconnue',
    });

    // Réponse d'erreur sécurisée
    return new NextResponse('Erreur interne', { status: 500 });
  }
}

/**
 * Configuration du middleware
 * Exclut les fichiers statiques et certaines routes API
 */
export const config = {
  matcher: [
    /*
     * Matcher pour toutes les routes sauf :
     * - API routes d'authentification Next-Auth
     * - Fichiers statiques (_next/static)
     * - Images (_next/image)
     * - Favicon et autres assets
     * - Fichiers avec extensions
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
};

