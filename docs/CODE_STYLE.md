# Guide de Style de Code — Studio Élan

Objectif: rendre le code lisible et maintenable sur le long terme (12+ mois), sans “magie” cachée.

Principes généraux
- Types stricts: proscrire `any`. Utiliser `unknown` + garde de type, des interfaces ou des types précis.
- Fonctions courtes: idéalement < 30 lignes, une responsabilité claire.
- Noms explicites: éviter les abréviations obscures.
- Zéro logique implicite: les invariants sont vérifiés explicitement.
- Erreurs visibles: ne pas masquer les erreurs, utiliser ApiErrorHandler pour les transformer en réponses standardisées.

Imports & Organisation
- Ordre des imports:
  1. modules externes
  2. modules internes (lib/**, components/**)
  3. modules locaux (sibling)
  4. imports de type-only (`import type { ... }`)
- Une ligne vide entre chaque groupe.

Types
- Préférer les types structurés:
  - `unknown` pour les entrées non fiables, suivi d’une vérification de type.
  - Interfaces et types nominaux pour les objets passés entre couches (ex: `IAuthenticatedUser`, `ICreateCheckoutSessionRequest`).
- Casts:
  - Éviter les casts aveugles; si nécessaire, cast vers un type minimal avec garde (ex: `as { code?: string }` après vérification `typeof === 'object'`).
- Génériques:
  - Utiliser `unknown[]` pour des rest args (`T extends unknown[]`) à la place de `any[]`.

Erreurs & Exceptions
- Les routes API jettent des `ApiError` via `ApiErrorHandler.*` (unauthorized, forbidden, badRequest…).
- `ApiErrorHandler.handle` convertit les erreurs en `NextResponse.json`.
- Prisma: ne pas s’appuyer sur `instanceof` en environnement test; utiliser un garde basé sur la présence d’un `code` (`P2002`, `P2025`).

Validation & Sécurité
- Toujours valider les payloads avec Zod (lib/validations/**).
- Parser JSON via `lib/security.ts::parseJson()` pour Content-Type, taille, JSON correct.
- Rate limiting: utiliser `lib/rate-limit.ts` pour les endpoints sensibles, ajouter les `X-RateLimit-*`.

Commentaires & Documentation
- Commenter le “pourquoi”, pas le “quoi”.
- Ajouter des docblocks en tête des fichiers complexes avec un schéma de flux si besoin.
- Tenir la documentation à jour dans `docs/**` et faire des PRs dédiées si les comportements changent.

Tests
- Séparer les environnements:
  - jsdom: UI (components/**)
  - node: API (app/api/**)
- Mock explicite:
  - `next-auth`: `getServerSession`
  - `lib/prisma`: éviter les imports du client Prisma dans Jest (mocker les méthodes nécessaires).
- Éviter `any` dans les tests:
  - Créer des `RequestLike` typés au lieu de passer des objets bruts.
  - Caster vers `NextRequest` via `unknown` seulement au point d’appel.

CSS & UI
- TailwindCSS: classes utilitaires, pas de CSS complexe inline.
- Composants UI dans `components/ui/**` avec props typées.
- Animation via Framer Motion: ne pas surenchérir; privilégier la sobriété.

Commits & CI
- Conventional Commits: `feat`, `fix`, `docs`, `refactor`, `test`…
- CI: jobs pour qualité, tests (frontend/backend), build, e2e, sécurité, codeql.
- Pas d’auto-commit des fixes dans CI (les corrections se font localement).

Exemple de garde de type utile
```ts
function isPrismaError(e: unknown): e is { code: string; meta?: Record<string, unknown> } {
  return !!e && typeof e === 'object' && typeof (e as { code?: unknown }).code === 'string';
}
```

Cas fréquents à éviter
- `any` par défaut: préférez `unknown` ou des interfaces.
- `try/catch` global silencieux: toujours remonter via `ApiErrorHandler.handle`.
- `instanceof` sur des classes externes en Jest: utiliser des gardes basés sur les propriétés.