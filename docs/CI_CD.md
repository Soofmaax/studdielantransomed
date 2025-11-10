# CI/CD — Studio Élan

Pipeline GitHub Actions (`.github/workflows/ci.yml`)
Ordre des jobs:
1. quality — Format, Lint and Type Check (Frontend)
2. tests — Unit tests (Jest)
3. coverage — Coverage + artifacts + Codecov upload
4. backend-quality — Lint + Type-check (NestJS)
5. backend-tests — Tests backend + couverture
6. build — Build Next.js
7. e2e — Tests E2E (Playwright)
8. security-scan — npm audit + CycloneDX SBOM
9. codeql — Analyse CodeQL

Déclencheurs
- `push` et `pull_request` sur `main`.
- `schedule`: hebdomadaire (security-scan et codeql).
- `workflow_dispatch`: manuel.

Artefacts produits
- `coverage-report`: couverture frontend.
- `coverage-backend`: couverture NestJS.
- `sbom-cyclonedx`: SBOM CycloneDX JSON.
- `playwright-report`: résultats E2E.

Environnements
- Tests unitaires:
  - `STRIPE_DEMO_MODE=1` pour éviter les vraies clés Stripe.
- E2E:
  - `NEXT_PUBLIC_E2E=1` pour activer les contrôles de test en UI (sélecteurs data-testid).
- Build:
  - Variables d’environnement publiques (NEXT_PUBLIC_*) injectées pour le build.
  - Variables serveur définies pour cohérence (NEXTAUTH_SECRET, STRIPE_*).

Bonnes pratiques
- Ne pas auto-commit dans la CI.
- Utiliser les scripts npm dédiés:
  - `npm run lint`, `npm run type-check`
  - `npm test`, `npm run test:coverage`, `npm run test:backend`
  - `npm run e2e`
- Ajouter des secrets via GitHub Actions si nécessaire (ex: Codecov token).

Transition démo → production
- `STRIPE_DEMO_MODE=0` + clés Stripe réelles dans les secrets.
- Garder le même pipeline; aucune modification de route à effectuer.