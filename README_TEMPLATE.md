# Template de Personnalisation — Studio Élan

Ce projet Next.js est conçu comme un template de site pour studio de yoga / bien-être, avec un CMS simple et une configuration centralisée. Ce document explique quels fichiers modifier pour l’adapter à un autre business (nom, branding, SEO, contenu).

## 1. Informations business et SEO

Fichier principal: `lib/content/business-config.ts`

Ce fichier centralise toutes les informations de l’entreprise et les métadonnées SEO par défaut.

Vous pouvez y modifier:

- Identité:
  - `name`: nom du studio / entreprise
  - `tagline`: phrase courte de description
- Contact:
  - `phone`
  - `email`
- Adresse:
  - `address.streetAddress`
  - `address.postalCode`
  - `address.city`
  - `address.region`
  - `address.countryCode`
- Localisation:
  - `geo.latitude`
  - `geo.longitude`
- Horaires:
  - `openingHours`: tableau de blocs (`days`, `opens`, `closes`)
- Réseaux sociaux:
  - `social.instagram`, `social.facebook`, etc.
- SEO global:
  - `seo.siteName`
  - `seo.siteUrl`
  - `seo.defaultTitle`
  - `seo.defaultDescription`
  - `seo.titleTemplate`
  - `seo.keywords`
  - `seo.ogImageUrl`
  - `seo.twitterImageUrl`
- SEO par page:
  - `seo.pages.home`
  - `seo.pages.about`
  - `seo.pages.services`
  - `seo.pages.contact`
  - `seo.pages.courses`
  - `seo.pages.reservation`

Ces valeurs sont utilisées:

- par le `metadata` global dans `app/layout.tsx`,
- par les `metadata` de chaque page (about, services, contact, courses, reservation),
- par le JSON-LD LocalBusiness (voir section 2).

## 2. JSON-LD LocalBusiness (SEO local)

Fichier: `lib/seo/local-business-jsonld.ts`

Ce module génère automatiquement le schéma JSON-LD de type `LocalBusiness` à partir de `BUSINESS_CONFIG`.

- Fonction principale:
  - `getLocalBusinessJsonLd()` — construit un objet compatible Schema.org.
- Données utilisées:
  - `BUSINESS_CONFIG.name`, `address`, `geo`, `phone`
  - `openingHours`, `priceRange`, `currenciesAccepted`
  - liens vers les réseaux sociaux (`social.*`)
  - description et image issues de `BUSINESS_CONFIG.seo`

Injection dans le layout:

Fichier: `app/layout.tsx`

- Le script JSON-LD est inséré dans `<head>`:

  ```tsx
  const localBusinessJsonLd = getLocalBusinessJsonLd();

  <head>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessJsonLd) }}
    />
  </head>
  ```

Pour adapter à un autre business, il suffit donc de mettre à jour `BUSINESS_CONFIG`; le JSON-LD se mettra à jour automatiquement.

## 3. Métadonnées par page (SEO)

Les pages publiques principales définissent des métadonnées spécifiques en s’appuyant sur `BUSINESS_CONFIG.seo.pages`.

Pages concernées:

- `app/about/page.tsx`
- `app/services/page.tsx`
- `app/contact/page.tsx`
- `app/courses/page.tsx`
- `app/reservation/layout.tsx` (layout dédié pour gérer le metadata d’une page client-side)

Exemples:

```ts
// app/about/page.tsx
export const metadata: Metadata = {
  title: BUSINESS_CONFIG.seo.pages.about.title,
  description: BUSINESS_CONFIG.seo.pages.about.description,
};
```

```ts
// app/reservation/layout.tsx
export const metadata: Metadata = {
  title: BUSINESS_CONFIG.seo.pages.reservation.title,
  description: BUSINESS_CONFIG.seo.pages.reservation.description,
};
```

Pour personnaliser les titres / descriptions:

1. Modifier les textes dans `lib/content/business-config.ts` (`seo.pages.*`).
2. Les pages utiliseront automatiquement ces nouvelles valeurs.

## 4. Contenu éditable (CMS)

Le contenu métier (textes, sections, services, etc.) est géré via:

- Prisma `ContentBlock` + `lib/content/server.ts`
- Types & contenu par défaut dans `lib/content/defaults.ts`
- Interface d’édition dans `app/admin/content/*`

Pour adapter le contenu par défaut à un nouveau client:

- Modifier les structures et valeurs dans `lib/content/defaults.ts`:
  - `home_page`
  - `about_page`
  - `services_page`
  - `contact_page`

Ensuite:

- Le client final pourra ajuster les textes et images depuis le CMS (panneau admin)
- Le site utilisera:
  - le contenu en base si existant,
  - sinon les valeurs de `DEFAULT_CONTENT`.

## 5. Page des cours

Configuration des cours de yoga:

- Fichier: `lib/content/yoga-studio-content.ts`
  - `YOGA_COURSES_PAGE_CONFIG`: contenu de la page `/courses` (héros, intro, cartes de cours).
- Page: `app/courses/page.tsx`
  - utilise `YOGA_COURSES_PAGE_CONFIG` pour l’affichage,
  - utilise `BUSINESS_CONFIG.seo.pages.courses` pour le SEO.

Pour adapter cette page à un autre studio:

1. Mettre à jour `YOGA_COURSES_PAGE_CONFIG.courses` (titres, descriptions, durées, prix, images).
2. Ajuster le SEO de la page dans `BUSINESS_CONFIG.seo.pages.courses`.

## 6. Couleurs et design system

Design system Tailwind:

- Fichier de configuration: `tailwind.config.ts`
  - Palettes complètes:
    - `primary` (inspirée du vert sauge)
    - `accent` (inspirée du doré)
  - Couleurs legacy:
    - `cream`, `sage`, `gold`

Variables de thème (mode clair/sombre):

- Fichier: `app/globals.css`
  - `--primary`, `--accent`, `--background`, `--foreground`, etc.

Pour rebrander le site:

1. Modifier les variables CSS dans `app/globals.css` (`:root` et `.dark`).
2. Ajuster les palettes `primary` et `accent` dans `tailwind.config.ts` (valeurs 50–900).
3. Optionnel: remplacer progressivement les classes `text-sage`, `text-gold` par des classes `text-primary-*` / `text-accent-*`.

Une documentation plus détaillée des couleurs est disponible dans:

- `docs/DESIGN_SYSTEM.md`

## 7. Résumé des fichiers à modifier pour un nouveau client

Minimum pour un nouveau business:

- Identité + SEO:
  - `lib/content/business-config.ts`
- Contenu “statique” par défaut:
  - `lib/content/defaults.ts`
  - `lib/content/yoga-studio-content.ts` (page cours)
- Branding (couleurs):
  - `app/globals.css`
  - `tailwind.config.ts`

Optionnel:

- Logo, favicon, images:
  - `public/` (ajouter les assets du client)
  - `public/manifest.json` (nom / icône de l’app)
- Textes complémentaires / sections:
  - composants dans `components/sections/*` si besoin d’adapter la structure.

En modifiant principalement ces fichiers, vous pouvez adapter rapidement ce template à quasiment n’importe quel studio (yoga, pilates, coaching, etc.) sans toucher à la logique métier (auth, réservation, paiement).