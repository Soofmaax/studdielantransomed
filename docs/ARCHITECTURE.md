# Architecture Technique — Studio Élan

Objectif: permettre de relire le code dans 12 mois et le comprendre rapidement grâce à une documentation claire, des types stricts, et des composants simples.

Sommaire
- Vue d’ensemble
- Frontend (Next.js App Router)
- Backend applicatif (API Next.js)
- Authentification (NextAuth)
- Base de données (Prisma + PostgreSQL)
- Paiements (Stripe)
- Sécurité (CSP, validation, rate limiting)
- Observabilité (Sentry)
- Dossier `lib/` et conventions

Vue d’ensemble
- Monorepo frontend avec API Next.js intégrée.
- NestJS existe sous `src/` mais la stratégie recommandée est d’unifier côté Next.js (API Routes) pour simplifier.
- Flux clefs: Authentification → Réservation → Paiement → Webhook Stripe → Confirmation.

Frontend (Next.js 14, App Router)
- Dossier `app/`:
  - `app/page.tsx`: page d’accueil.
  - `app/admin/**`: pages d’administration.
  - `app/reservation/**`: pages de réservation (success/cancel).
  - `app/api/**`: API Routes.
- Providers:
  - `components/Providers.tsx` initialise Query Client, thème, et auth.
- UI:
  - `components/ui/**` pour éléments UI (boutons, toasts, etc.)
- Tests UI:
  - `components/sections/__tests__/**` via Testing Library.

Backend applicatif (API Next.js)
- API Routes sous `app/api/**`:
  - `courses` (GET/POST, PUT/DELETE via `[id]`).
  - `bookings` (GET/POST, `[id]` GET/PUT).
  - `contact` (POST).
  - `create-checkout-session` (POST).
  - `webhook` (POST).
  - `notifications/**` (rappels).
  - `health`, `ready` (GET).
- Convention:
  - Validation d’entrée via Zod (lib/validations/**).
  - Sécurisation via withAuth/withAdminAuth (lib/api/auth-middleware.ts).
  - Gestion des erreurs via ApiErrorHandler (lib/api/error-handler.ts).
  - Accès DB via Prisma singleton (lib/prisma.ts).
  - Vitesse: endpoints pensés pour être stateless et déterministes.

Authentification (NextAuth)
- Config fichier: `lib/auth/next-auth.config.ts`
- Adapter: PrismaAdapter (utilisateurs en DB).
- Provider: Credentials (email+password).
- Sessions: JWT (callbacks pour ajouter `id` et `role` dans token → session).
- Événements: `signIn` met à jour `lastLogin`.

Base de données (Prisma + PostgreSQL)
- Prisma schema sous `prisma/schema.prisma`.
- Indexes sur Booking:
  - `@@index([courseId, date])`
  - `@@index([userId, date])`
- Prisma singleton (`lib/prisma.ts`) pour éviter les fuites de connexions en serverless.
- Seed (`prisma/seed.js`):
  - Admin et client de démo (email/mot de passe).
  - Cours de démo.

Paiements (Stripe)
- Mode démo (par défaut): `STRIPE_DEMO_MODE=1`
  - `create-checkout-session` retourne des URLs Stripe simulées.
  - `webhook` accepte un payload de démo.
- Mode live:
  - `STRIPE_DEMO_MODE=0` + `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
  - Aucune recréation de route nécessaire.

Sécurité
- CSP en middleware, ajustée pour compatibilité et durcissement progressif (nonce/strict-dynamic).
- Validation JSON stricte: `lib/security.ts::parseJson()` impose Content-Type + taille maximale + JSON valide.
- Rate limiting: `lib/rate-limit.ts` (best-effort en mémoire) avec `X-RateLimit-*`.
- Erreurs normalisées: `ApiErrorHandler` (Zod/Prisma/Stripe/autres).
- Auth: middleware `withAuth` et `withAdminAuth` garantissent session et rôle.

Observabilité (Sentry)
- `lib/sentry.ts` + init dans `app/layout.tsx`.
- Capture minimale dans `ApiErrorHandler`.

Dossier lib/ et conventions
- `lib/api/**`: middlewares API, helpers de cours, gestion d’erreurs.
- `lib/validations/**`: schémas Zod.
- `lib/auth/**`: configuration NextAuth.
- `lib/rate-limit.ts`: limitation de requêtes.
- `lib/security.ts`: parsers sûrs.
- Conventions:
  - Types stricts (TypeScript): éviter `any`, préférer `unknown` + garde de type, ou des interfaces claires.
  - Noms explicites, fonctions courtes, comportements déterministes.
  - Imports ordonnés (externes, internes, utilitaires).