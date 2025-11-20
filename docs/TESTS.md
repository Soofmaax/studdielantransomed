# Guide des Tests — Studio Élan

Objectif: des tests robustes, lisibles, et faciles à maintenir.

Types de tests
- Unitaires (Jest):
  - Frontend (jsdom): composants React, hooks.
  - API Next.js (node): handlers dans `app/api/**`.
- E2E (Playwright):
  - Flots critiques: login, réservation, paiement (démo), contact, admin.

Configuration
- Jest:
  - `jest.config.cjs` → front + API
  - `jest.backend.config.js` → NestJS (src/**)
  - Setup: `jest.setup.js`
    - jsdom: only `whatwg-fetch` et `matchMedia` si `window` existe.
    - mocks `next/navigation` pour les tests UI.

Environnements
- jsdom:
  - Rendu de composants via Testing Library.
- node:
  - API routes: importer `POST`/`GET` depuis `app/api/**`.
  - Construire un `RequestLike` typé (headers/text/json/nextUrl).
  - Caster à l’appel vers `NextRequest` via `unknown` (pas de `any`).

Mocks
- Auth:
  ```ts
  jest.mock('next-auth', () => ({
    getServerSession: async () => ({ user: { id, role }, expires }),
  }))
  ```
- Prisma:
  - `jest.mock('@/lib/prisma', () => ({ default: { course: { findUnique: jest.fn() }, booking: { count: jest.fn() } } }))`
  - Évite l’utilisation du client Prisma réel dans Jest (no DB).
- Stripe:
  - Mode démo: éviter les clés, simuler les URLs Stripe.
- Next APIs:
  - Éviter `headers()` dans les tests, utiliser `request.headers.get()`.

Bonnes pratiques
- Pas de `any`: typage explicite des payloads et des stubs de requêtes.
- Lecture de réponse:
  - Préférer `res.text()` + `JSON.parse` si l’environnement n’expose pas `Response.json`.
  - Sinon `await res.json()` en node (Undici).
- Zod:
  - S’assurer d’entrées valides (UUID, date dans le futur) dans les tests qui vérifient un succès.

E2E Playwright
- Config: `playwright.config.ts`
- En CI:
  - Job `e2e` (NEXT_PUBLIC_E2E=1), installation des navigateurs, upload du rapport.
- Flows couverts:
  - Réservation avec redirection Stripe (démo).
  - Auth admin + pages admin.
  - Contact: message envoyé.
  - Navigation responsive.

Commandes utiles
```bash
npm run test            # Unitaires
npm run test:coverage   # Couverture
npm run e2e             # Playwright
npm run e2e:ui          # Playwright UI
```