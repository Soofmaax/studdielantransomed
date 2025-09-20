/**
 * Configuration Next.js optimisée pour Netlify
 * Compatible avec le déploiement statique et les fonctions serverless
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration de base
  reactStrictMode: true,
  swcMinify: true,
  
  // Configuration pour Netlify (export statique)
  // NOTE : Si vous utilisez des API routes (comme pour Stripe), vous ne pouvez pas utiliser 'export'.
  // Je vais le commenter pour l'instant, car vos API routes en ont besoin.
  // output: 'export', 
  trailingSlash: true,
  
  // Configuration des images optimisées
  images: {
    // L'optimisation d'images de Next.js fonctionne avec le plugin Netlify,
    // donc 'unoptimized: true' n'est pas nécessaire.
    unoptimized: false, 
    
    // Formats supportés
    formats: ['image/avif', 'image/webp'],
    
    // Domaines autorisés pour les images externes
    domains: [
      'images.pexels.com',
      'images.unsplash.com',
    ],
  },

  // ====================================================================
  // == CORRECTION APPLIQUÉE ICI ==
  // On ajoute une configuration Webpack pour gérer les modules Node.js
  // ====================================================================
  webpack: (config, { isServer }) => {
    // Ne pas essayer de bundler 'fs' pour le navigateur.
    // Cela résout l'erreur "Module not found: Can't resolve 'fs'".
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    return config;
  },

  // Configuration des headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
    ];
  },

  // Configuration des redirections
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Configuration expérimentale (sans l'option dépréciée 'optimizeFonts')
  experimental: {
    // optimizeFonts: true, // Cette option est dépréciée
  },

  // Configuration du compilateur
  compiler: {
    // Supprimer les console.log en production
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // Configuration de TypeScript
  typescript: {
    ignoreBuildErrors: false,
  },

  // Configuration d'ESLint
  eslint: {
    ignoreDuringBuilds: false,
    // Restreindre explicitement le périmètre du lint au frontend
    dirs: ['app', 'components', 'hooks', 'lib', '__tests__', 'types'],
  },

  // Désactiver le header X-Powered-By
  poweredByHeader: false,
  
  // Configuration pour les pages statiques
  generateEtags: true, // 'true' est généralement mieux pour le cache
};

module.exports = nextConfig;
