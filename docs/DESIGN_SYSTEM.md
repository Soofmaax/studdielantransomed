# Design System — Studio Élan

Ce document décrit le système de design (couleurs) utilisé par l’interface Next.js, ainsi que la manière de l’adapter facilement pour un autre business.

## 1. Couleurs principales

Le design repose sur trois grandes familles de couleurs :

- Couleurs de marque:
  - `primary` — vert sauge (sage) : ton principal, doux.
  - `accent` — doré (gold) : accent fort, utilisé pour attirer l’attention.
- Couleurs de fond:
  - `background` / `foreground` — définis par des variables CSS (mode clair/sombre).
  - `cream` — fond supplémentaire très clair, utilisé sur plusieurs sections.

Toutes ces couleurs sont définies dans:

- `tailwind.config.ts` → palette Tailwind (classes `bg-primary-500`, `text-accent-600`, etc.).
- `app/globals.css` → variables CSS pour le thème (`--primary`, `--accent`, etc.).

### 1.1. Palette `primary` (sage)

Dans `tailwind.config.ts`:

- `sage`: `#B2C2B1` (nom historique, encore utilisé dans certains composants).
- `primary`: palette complète 50–900 + tokens shadcn:

```ts
primary: {
  50:  "#F7F8F6",
  100: "#E7EEE4",
  200: "#D4DFD1",
  300: "#C1D0BE",
  400: "#B6C7B4",
  500: "#B2C2B1", // teinte principale "sage"
  600: "#94A28F",
  700: "#738072",
  800: "#58635A",
  900: "#3C433D",
  DEFAULT: "hsl(var(--primary))",
  foreground: "hsl(var(--primary-foreground))",
}
```

Usages recommandés:

- `bg-primary-500`:
  - Surfaces de mise en avant (ex: barres décoratives, éléments graphiques).
- `bg-primary-600` / `bg-primary-700`:
  - Boutons principaux en mode clair, hovers, bordures actives.
- `bg-primary-50` / `bg-primary-100`:
  - Fonds très subtils (cards, sections alternées).
- `text-primary-700`:
  - Titres ou liens importants sur fond clair.

### 1.2. Palette `accent` (gold)

Dans `tailwind.config.ts`:

- `gold`: `#D4B254` (nom historique, encore utilisé dans certains composants).
- `accent`: palette complète 50–900 + tokens shadcn:

```ts
accent: {
  50:  "#FDF8EC",
  100: "#FAEED0",
  200: "#F3DF9F",
  300: "#EBCF70",
  400: "#E3C452",
  500: "#D4B254", // teinte principale "gold"
  600: "#BE9F4B",
  700: "#9B7F3D",
  800: "#786230",
  900: "#5C4A26",
  DEFAULT: "hsl(var(--accent))",
  foreground: "hsl(var(--accent-foreground))",
}
```

Usages recommandés:

- `bg-accent-500` / `bg-accent-600`:
  - Boutons d’appel à l’action (CTA), badges importants.
- `text-accent-600`:
  - Prix, éléments de mise en avant (ex: tarif dans les cartes de services).
- `accent-100` / `accent-50`:
  - Fond léger pour encadrés d’information (alertes, messages marketing).
- `accent-700` / `accent-800`:
  - Accents forts sur fonds clairs ou hover en mode sombre.

### 1.3. Couleurs de fond et neutres

Dans `app/globals.css` (mode clair et sombre):

- `--background` / `--foreground`:
  - Gèrent la couleur de fond globale et le texte.
- `--card`, `--popover`, `--border`, `--input`, `--ring`:
  - Utilisées par les composants UI génériques (shadcn).
- `cream` (`#F8F5F0`):
  - Utilisée comme fond de section (ex: headers de page, blocs d’information).

Usages typiques:

- `body`:
  - `bg-background text-foreground` (appliqué via `@layer base`).
- Sections principales:
  - `bg-cream` pour alterner avec le fond global (`bg-background`).
- Cartes:
  - `bg-white` + `border-border` ou `bg-card`.

## 2. Classes Tailwind disponibles

Grâce à la palette définie dans `tailwind.config.ts`, vous pouvez utiliser:

- Pour la couleur primaire:
  - `bg-primary-50` à `bg-primary-900`
  - `text-primary-50` à `text-primary-900`
  - `border-primary-50` à `border-primary-900`
- Pour l’accent:
  - `bg-accent-50` à `bg-accent-900`
  - `text-accent-50` à `text-accent-900`
  - `border-accent-50` à `border-accent-900`

Les tokens shadcn existants restent utilisables:

- `bg-primary` / `text-primary` → `--primary`
- `bg-accent` / `text-accent` → `--accent`

## 3. Où ces couleurs sont utilisées

Exemples dans le code Next.js:

- `components/sections/Services.tsx`:
  - `bg-primary-500` — barre décorative sous le titre de section.
  - `text-accent-600 dark:text-accent-400` — affichage du prix.
- Pages publiques (`app/page.tsx`, `app/services/page.tsx`, etc.):
  - `bg-cream`, `text-sage`, `text-gold` — noms de couleurs historiques.
  - Boutons principaux en `bg-sage hover:bg-gold` (cohérents avec `primary`/`accent`).

Les classes comme `bg-primary-500` ou `text-accent-600` sont désormais supportées par Tailwind grâce aux palettes 50–900 définies ci-dessus.

## 4. Comment adapter le design pour un autre business

L’objectif est de permettre de “rebrander” facilement le template sans toucher à tous les composants.

### Étape 1 — Modifier les variables CSS globales

Fichier: `app/globals.css`

Dans `:root` (mode clair) et `.dark` (mode sombre), ajuster:

- `--primary` / `--primary-foreground`
- `--accent` / `--accent-foreground`
- éventuellement `--background`, `--foreground`, `--card`, etc.

Exemple (simplifié):

```css
:root {
  --primary: 210 90% 56%;        /* bleu par exemple */
  --primary-foreground: 0 0% 100%;
  --accent: 340 82% 52%;         /* rose/rouge */
  --accent-foreground: 0 0% 100%;
}
```

Cela actualise automatiquement:

- `bg-primary`, `text-primary`
- `bg-accent`, `text-accent`
- ainsi que les composants shadcn qui s’appuient sur ces variables.

### Étape 2 — Mettre à jour les palettes Tailwind (optionnel mais recommandé)

Fichier: `tailwind.config.ts`

Dans `extend.colors.primary` et `extend.colors.accent`, mettre à jour:

- Les hex de `50` à `900` pour refléter la nouvelle identité visuelle.
- Garder `DEFAULT` et `foreground` synchronisés avec les variables CSS (`--primary`, `--accent`).

Cela garantit que les classes:

- `bg-primary-500`, `hover:bg-primary-600`
- `text-accent-600`, `bg-accent-100`

restent cohérentes avec les nouvelles couleurs de marque.

### Étape 3 — Vérifier les couleurs nommées legacy

Certaines classes utilisent encore des noms de couleurs historiques:

- `text-sage`, `bg-sage`
- `text-gold`, `bg-gold`
- `bg-cream`

Pour un rebranding complet:

- soit conserver ces noms et simplement changer leurs valeurs dans `tailwind.config.ts`,
- soit remplacer progressivement ces classes par des classes basées sur `primary` / `accent`.

### Étape 4 — Contrôle visuel

Après modification:

1. Lancer `npm run dev`.
2. Parcourir les pages publiques (`/`, `/services`, `/courses`, `/contact`).
3. Vérifier:
   - lisibilité (contraste suffisant),
   - cohérence des CTAs,
   - comportement au survol (`hover:`),
   - mode sombre si utilisé.

---

En résumé:

- `tailwind.config.ts` fournit des palettes complètes `primary` et `accent` pour Tailwind (50–900).
- `app/globals.css` pilote le thème global via des variables CSS.
- Adapter le site à un autre business se fait principalement en ajustant ces deux fichiers, sans toucher au code des composants.