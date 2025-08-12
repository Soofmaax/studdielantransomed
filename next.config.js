/**
 * Configuration Next.js optimisée - Approche artisanale
 * Performance maximale avec bundle splitting et optimisations avancées
 */

const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration de base
  reactStrictMode: true,
  swcMinify: true,
  
  // Configuration des images optimisées
  images: {
    // Formats supportés par ordre de préférence
    formats: ['image/avif', 'image/webp'],
    
    // Tailles d'images prédéfinies pour l'optimisation
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // Domaines autorisés pour les images externes
    domains: [
      'images.pexels.com',
      'images.unsplash.com',
      'localhost',
    ],
    
    // Configuration de qualité par défaut
    quality: 85,
    
    // Optimisations avancées
    minimumCacheTTL: 31536000, // 1 an
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // Configuration des headers de sécurité et performance
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          // Sécurité
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
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
          
          // Performance
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
        ],
      },
      {
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, must-revalidate'
          },
          {
            key: 'Access-Control-Allow-Credentials',
            value: 'true'
          },
          {
            key: 'Access-Control-Allow-Origin',
            value: process.env.NODE_ENV === 'production' ? 'https://studio-elan.fr' : '*'
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT'
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
          },
        ],
      },
    ];
  },

  // Configuration du bundle splitting
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Optimisations de production uniquement
    if (!dev && !isServer) {
      // Bundle splitting avancé
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          // Vendor chunks séparés
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            priority: 10,
            reuseExistingChunk: true,
          },
          
          // React et React-DOM dans un chunk séparé
          react: {
            test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
            name: 'react',
            priority: 20,
            reuseExistingChunk: true,
          },
          
          // Next.js dans un chunk séparé
          next: {
            test: /[\\/]node_modules[\\/]next[\\/]/,
            name: 'next',
            priority: 20,
            reuseExistingChunk: true,
          },
          
          // Bibliothèques UI (Tailwind, Lucide, etc.)
          ui: {
            test: /[\\/]node_modules[\\/](lucide-react|@headlessui|@tailwindcss)[\\/]/,
            name: 'ui',
            priority: 15,
            reuseExistingChunk: true,
          },
          
          // Bibliothèques de données (React Query, Prisma, etc.)
          data: {
            test: /[\\/]node_modules[\\/](@tanstack|@prisma|zod)[\\/]/,
            name: 'data',
            priority: 15,
            reuseExistingChunk: true,
          },
          
          // Bibliothèques d'authentification
          auth: {
            test: /[\\/]node_modules[\\/](next-auth|bcrypt)[\\/]/,
            name: 'auth',
            priority: 15,
            reuseExistingChunk: true,
          },
          
          // Composants communs de l'application
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      };

      // Optimisation des modules
      config.optimization.moduleIds = 'deterministic';
      config.optimization.chunkIds = 'deterministic';
    }

    // Alias pour les imports
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname),
      '@/components': path.resolve(__dirname, 'components'),
      '@/lib': path.resolve(__dirname, 'lib'),
      '@/types': path.resolve(__dirname, 'types'),
      '@/hooks': path.resolve(__dirname, 'hooks'),
      '@/utils': path.resolve(__dirname, 'utils'),
    };

    // Plugin pour analyser le bundle (développement uniquement)
    if (dev && process.env.ANALYZE === 'true') {
      try {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'server',
            analyzerPort: 8888,
            openAnalyzer: true,
          })
        );
      } catch (e) {
        console.warn('Bundle analyzer not available');
      }
    }

    return config;
  },

  // Configuration de la compression
  compress: true,
  
  // Configuration des redirections
  async redirects() {
    return [
      // Redirections SEO
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
    
    // Optimisations CSS
    optimizeCss: true,
    
    // Server Components
    serverComponentsExternalPackages: ['@prisma/client'],
    
    // Scroll restoration
    scrollRestoration: true,
  },

  // Configuration du compilateur
  compiler: {
    // Supprimer les console.log en production
    removeConsole: process.env.NODE_ENV === 'production',
    
    // Optimisations React
    reactRemoveProperties: process.env.NODE_ENV === 'production',
  },

  // Configuration de l'output
  output: 'standalone',
  
  // Configuration du serveur de développement
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: 'bottom-right',
  },

  // Configuration de TypeScript
  typescript: {
    // Ignorer les erreurs TypeScript en production (à utiliser avec précaution)
    ignoreBuildErrors: false,
  },

  // Configuration d'ESLint
  eslint: {
    // Ignorer les erreurs ESLint en production (à utiliser avec précaution)
    ignoreDuringBuilds: false,
    dirs: ['pages', 'components', 'lib', 'app'],
  },

  // Configuration des pages statiques
  trailingSlash: false,
  
  // Configuration de la génération statique
  generateEtags: true,
  
  // Configuration des extensions de pages
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],

  // Désactiver le header X-Powered-By
  poweredByHeader: false,
};

// Configuration conditionnelle selon l'environnement
if (process.env.NODE_ENV === 'production') {
  // Optimisations de production supplémentaires
  nextConfig.generateEtags = true;
}

// Configuration pour l'analyse du bundle
if (process.env.ANALYZE === 'true') {
  try {
    const withBundleAnalyzer = require('@next/bundle-analyzer')({
      enabled: true,
    });
    module.exports = withBundleAnalyzer(nextConfig);
  } catch (e) {
    console.warn('Bundle analyzer not available, using default config');
    module.exports = nextConfig;
  }
} else {
  module.exports = nextConfig;
}

