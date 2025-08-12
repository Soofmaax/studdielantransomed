# 🧘‍♀️ Studio Élan

> *Une application web fullstack d'exception pour un studio de yoga premium*

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

---

## ✨ Philosophie du Projet

Ce projet incarne une approche **artisanale** du développement web. Chaque ligne de code a été pensée pour la **clarté**, la **simplicité** et l'**élégance**. Un développeur qui ouvre ce projet doit immédiatement ressentir la qualité et le soin apporté à chaque détail.

### 🎯 Principes Fondamentaux

- **Lisibilité Avant Tout** : Code auto-documenté avec des noms explicites
- **DRY (Don't Repeat Yourself)** : Logique réutilisable factorisée intelligemment  
- **Cohérence Absolue** : Style uniforme dans tout le projet
- **Performance Optimale** : Objectif 100% Lighthouse
- **Sécurité Renforcée** : Validation stricte et bonnes pratiques

---

## 🏗️ Architecture

### Frontend (Next.js 14)
```
app/                    # App Router Next.js
├── (auth)/            # Groupe de routes authentifiées
├── admin/             # Interface d'administration
├── api/               # API Routes Next.js
└── globals.css        # Styles globaux
```

### Backend (NestJS)
```
src/
├── auth/              # Module d'authentification JWT
├── courses/           # Gestion des cours de yoga
├── bookings/          # Système de réservation
├── users/             # Gestion des utilisateurs
└── common/            # Utilitaires partagés
```

### Base de Données
- **PostgreSQL** avec **Prisma ORM**
- Migrations versionnées
- Seed data pour le développement

---

## 🚀 Démarrage Rapide

### Prérequis
- **Node.js** 18+ 
- **PostgreSQL** 13+
- **npm** 9+

### Installation

```bash
# 1. Cloner le repository
git clone https://github.com/Soofmaax/studioelan.git
cd studioelan

# 2. Installer les dépendances
npm install

# 3. Configurer l'environnement
cp .env.example .env.local
# ⚠️ Éditer .env.local avec vos valeurs

# 4. Préparer la base de données
npm run db:migrate
npm run db:seed

# 5. Démarrer en mode développement
npm run dev
```

🎉 **L'application est maintenant accessible sur :**
- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:3000/api
- **Documentation API** : http://localhost:3000/api (Swagger)

---

## 📋 Variables d'Environnement

| Variable | Description | Exemple |
|----------|-------------|---------|
| `DATABASE_URL` | URL PostgreSQL | `postgresql://user:pass@localhost:5432/studio_elan` |
| `JWT_SECRET` | Clé secrète JWT | `your-super-secret-jwt-key-256-bits` |
| `NEXTAUTH_SECRET` | Clé NextAuth | `your-nextauth-secret` |
| `NEXTAUTH_URL` | URL de base | `http://localhost:3000` |
| `STRIPE_SECRET_KEY` | Clé secrète Stripe | `sk_test_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Clé publique Stripe | `pk_test_...` |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe | `whsec_...` |
| `NEXT_PUBLIC_SENTRY_DSN` | DSN Sentry (optionnel) | `https://...@sentry.io/...` |

---

## 🧪 Tests & Qualité

### Tests Unitaires
```bash
npm run test              # Lancer tous les tests
npm run test:watch        # Mode watch
npm run test:coverage     # Avec couverture
```

### Tests End-to-End
```bash
npm run test:e2e          # Tests Playwright
npm run test:e2e:ui       # Interface graphique
```

### Validation Complète
```bash
npm run validate          # Lint + Tests + Type-check
```

### Qualité du Code
```bash
npm run lint              # ESLint
npm run type-check        # Vérification TypeScript
npm run format            # Prettier
```

---

## 🛠️ Scripts Disponibles

| Script | Description |
|--------|-------------|
| `npm run dev` | Démarrage fullstack (frontend + backend) |
| `npm run build` | Build de production |
| `npm run start` | Démarrage production |
| `npm run db:migrate` | Migrations Prisma |
| `npm run db:seed` | Données de test |
| `npm run db:studio` | Interface Prisma Studio |
| `npm run clean` | Nettoyage des builds |

---

## 🎨 Stack Technique

### Core Technologies
- **Frontend** : Next.js 14, React 18, TypeScript
- **Backend** : NestJS, Node.js, TypeScript  
- **Database** : PostgreSQL, Prisma ORM
- **Styling** : TailwindCSS, Framer Motion
- **Auth** : NextAuth.js, JWT, bcrypt

### Developer Experience
- **Testing** : Jest, Playwright, Testing Library
- **Code Quality** : ESLint, Prettier, Husky
- **Type Safety** : TypeScript strict mode
- **API Documentation** : Swagger/OpenAPI
- **Monitoring** : Sentry

### Production Ready
- **Payments** : Stripe integration
- **Performance** : Next.js optimizations
- **Security** : CSP headers, validation
- **Deployment** : Vercel/Netlify ready

---

## 📁 Structure du Projet

```
studio-elan/
├── 📁 app/                 # Next.js App Router
│   ├── 📁 (auth)/         # Routes authentifiées
│   ├── 📁 admin/          # Interface admin
│   ├── 📁 api/            # API Routes
│   └── 📄 layout.tsx      # Layout racine
├── 📁 components/         # Composants React réutilisables
│   ├── 📁 ui/             # Composants UI de base
│   ├── 📁 layout/         # Composants de layout
│   └── 📁 sections/       # Sections de pages
├── 📁 src/                # Backend NestJS
│   ├── 📁 auth/           # Module authentification
│   ├── 📁 courses/        # Module cours
│   ├── 📁 bookings/       # Module réservations
│   └── 📁 common/         # Utilitaires partagés
├── 📁 lib/                # Utilitaires frontend
├── 📁 hooks/              # Hooks React personnalisés
├── 📁 types/              # Définitions TypeScript
├── 📁 prisma/             # Schéma et migrations DB
├── 📁 public/             # Assets statiques
└── 📁 __tests__/          # Tests
```

---

## 🔒 Sécurité

### Mesures Implémentées
- ✅ **Headers de sécurité** (CSP, HSTS, etc.)
- ✅ **Validation stricte** des données (Zod + class-validator)
- ✅ **Authentification JWT** sécurisée
- ✅ **Hachage bcrypt** des mots de passe
- ✅ **Validation des webhooks** Stripe
- ✅ **Variables d'environnement** protégées

### Bonnes Pratiques
- Pas de secrets dans le code
- Validation côté client ET serveur
- Rate limiting sur les APIs
- Logs de sécurité avec Sentry

---

## 🚀 Déploiement

### Vercel (Recommandé)
```bash
# Installation Vercel CLI
npm i -g vercel

# Déploiement
vercel --prod
```

### Variables d'Environnement Production
Configurer dans l'interface Vercel :
- Toutes les variables de `.env.example`
- `DATABASE_URL` pointant vers votre DB production
- Clés Stripe de production

---

## 🤝 Contribution

### Workflow Git
```bash
# Créer une branche feature
git checkout -b feature/nouvelle-fonctionnalite

# Commits conventionnels
git commit -m "feat: ajouter système de notifications"

# Push et Pull Request
git push origin feature/nouvelle-fonctionnalite
```

### Standards de Code
- **Commits** : Convention Conventional Commits
- **Code** : ESLint + Prettier automatiques
- **Tests** : Couverture minimale 80%
- **Types** : TypeScript strict, zéro `any`

---

## 📈 Performance

### Objectifs
- **Lighthouse** : 100/100/100/100
- **Core Web Vitals** : Tous verts
- **Bundle Size** : Optimisé avec tree-shaking
- **Images** : WebP/AVIF avec lazy loading

### Optimisations
- Code splitting automatique
- Mémoisation React intelligente
- Cache React Query optimisé
- CDN pour les assets statiques

---

## 📞 Support

### Documentation
- **API** : `/api` (Swagger interactif)
- **Base de données** : Schéma Prisma documenté
- **Composants** : Storybook (à venir)

### Contact
- **Email** : dev@studio-elan.fr
- **Issues** : GitHub Issues
- **Discussions** : GitHub Discussions

---

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

---

<div align="center">

**Fait avec ❤️ et beaucoup de ☕ par l'équipe Studio Élan**

*Un code artisanal pour une expérience utilisateur d'exception*

</div>

