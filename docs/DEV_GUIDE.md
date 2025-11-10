# Guide Développeur — Studio Élan

Objectif: rendre la lecture et l’évolution du code simples et agréables, sur 12 mois et plus.

Principes
- Types stricts (TypeScript): proscrire `any`. Utiliser `unknown` + garde de type, et des interfaces précises.
- Simplicité: privilégier les fonctions courtes, déterministes, testables.
- Clarté: commenter le “pourquoi” des décisions, pas le “comment” évident.

Démarrage
1. `npm install`
2. `cp .env.example .env.local` et renseigner les variables
3. `npm run db:migrate && npm run db:seed`
4. `npm run dev`

Arborescence clef
- `app/` — Pages et API Next.js
- `lib/` — Utilitaires, auth, validations, sécurité, Prisma, rate limit, error handler
- `components/` — UI réutilisable
- `__tests__/` — Tests unitaires
- `docs/` — Documentation technique (vous êtes ici)

Auth & Sécurité
- NextAuth (lib/auth/next-auth.config.ts) avec PrismaAdapter.
- Middlewares:
  - `withAuth(handler)`: exige session, ajoute `auth` (utilisateur + expiration)
  - `withAdminAuth(handler)`: exige rôle ADMIN
- Parser JSON sûr: `lib/security.ts::parseJson(request, maxBytes)`
- Rate limiting: `lib/rate-limit.ts` avec `X-RateLimit-*`

Erreurs
- Créer des erreurs via `ApiErrorHandler.*` (unauthorized, forbidden, badRequest, notFound, conflict…)
- Centraliser le rendu dans `ApiErrorHandler.handle(error)` (NextResponse.json)

Base de données
- Prisma singleton (`lib/prisma.ts`) pour éviter les fuites de connexions.
- Accéder à la DB via `db` importé de `lib/prisma`.
- Éviter de construire des `new PrismaClient()` directement.

Paiements Stripe
- Démo (`STRIPE_DEMO_MODE=1`): URLs simulées, webhook démo.
- Live (`STRIPE_DEMO_MODE=0`): clés requises; même code, même routes.

Tests
- UI: Testing Library (jsdom).
- API: Jest en environnement node; `RequestLike` typé pour contacter les handlers; caster en `NextRequest` via `unknown` uniquement à l’appel.
- Prisma & NextAuth: mock dans les tests pour éviter la DB réelle.

Style & Conventions
- Voir `docs/CODE_STYLE.md`.
- Import order conforme ESLint.
- Noms explicites des fichiers et fonctions.

Complexité maîtrisée
- Si une fonction dépasse 30-40 lignes, scinder en services ou helpers.
- Ajouter un docblock en tête de fichier pour décrire le flux si nécessaire.

Migrations & Seed
- `npm run db:migrate` — migrations dev
- `npm run db:seed` — seed de démonstration (admin + client + cours)

CI/CD
- Voir `docs/CI_CD.md` pour le pipeline complet (qualité, tests, build, e2e, sécurité, codeql).

Questions fréquentes
- Pourquoi `unknown` à la place de `any` ?
  - `unknown` oblige à vérifier le type avant utilisation, évitant les erreurs silencieuses et documentant l’intention.
- Pourquoi éviter `instanceof` dans Jest avec Prisma ?
  - Certains environnements n’exposent pas les prototypes externes; une garde basée sur la présence de `code` est plus robuste.

Bonnes pratiques de commit
- Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`, `test:`, etc.
- PRs petites et focalisées, avec mise à jour de docs si nécessaire.