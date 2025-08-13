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
  output: 'export',
  trailingSlash: true,
  
  // Configuration des images optimisées
  images: {
    // Désactiver l'optimisation d'images pour l'export statique
    unoptimized: true,
    
    // Formats supportés
    formats: ['image/avif', 'image/webp'],
    
    // Domaines autorisés pour les images externes
    domains: [
      'images.pexels.com',
      'images.unsplash.com',
    ],
  },

  // Configuration des headers de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
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

  // Configuration expérimentale
  experimental: {
    // Optimisations des fonts
    optimizeFonts: true,
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
    dirs: ['app', 'components', 'lib'],
  },

  // Désactiver le header X-Powered-By
  poweredByHeader: false,
  
  // Configuration pour les pages statiques
  generateEtags: false,
};

module.exports = nextConfig;

