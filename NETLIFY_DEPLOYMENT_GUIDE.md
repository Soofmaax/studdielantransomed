# 🚀 Guide de Déploiement Netlify - Studio Élan

## 🎯 Problème Résolu

Votre erreur "Page not found" sur Netlify était causée par une configuration incorrecte pour Next.js. Voici la solution complète.

---

## 📋 Étapes de Correction

### 1. **Remplacer les Fichiers de Configuration**

Remplacez ces fichiers dans votre projet par les versions corrigées :

#### `netlify.toml` (à la racine du projet)
```toml
# Configuration Netlify pour Studio Élan - Next.js App Router
[build]
  command = "npm run build"
  publish = ".next"
  
  [build.environment]
    NODE_VERSION = "18"
    NPM_VERSION = "9"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### `next.config.js` (configuration pour export statique)
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  
  // Configuration pour Netlify
  output: 'export',
  trailingSlash: true,
  
  images: {
    unoptimized: true,
    formats: ['image/avif', 'image/webp'],
    domains: ['images.pexels.com', 'images.unsplash.com'],
  },
  
  poweredByHeader: false,
  generateEtags: false,
};

module.exports = nextConfig;
```

#### `package.json` (dépendances corrigées)
- Ajouter `"web-vitals": "^3.5.0"`
- Ajouter `"pg": "^8.11.3"`
- Corriger `"next-auth": "4.24.7"`

### 2. **Corriger le Composant WebVitals**

Remplacer dans `components/performance/WebVitalsMonitor.tsx` :

```javascript
// ANCIEN (ne fonctionne plus)
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

// NOUVEAU (API actuelle)
import { onCLS, onFID, onFCP, onLCP, onTTFB } from 'web-vitals';
```

---

## 🔧 Configuration Netlify Dashboard

### 1. **Paramètres de Build**
- **Build command:** `npm run build`
- **Publish directory:** `.next`
- **Node version:** `18`

### 2. **Variables d'Environnement**
Ajouter dans Netlify Dashboard > Site settings > Environment variables :

```
NODE_VERSION=18
NPM_VERSION=9
NEXTAUTH_URL=https://votre-site.netlify.app
NEXTAUTH_SECRET=votre-secret-aleatoire-tres-long
```

### 3. **Plugins Netlify**
Installer le plugin Next.js :
- Aller dans **Plugins** dans le dashboard Netlify
- Rechercher et installer **"@netlify/plugin-nextjs"**

---

## 📦 Commandes de Déploiement

### Déploiement Local de Test
```bash
# Installer les dépendances
npm install

# Build de production
npm run build

# Tester localement
npm run start
```

### Déploiement Netlify
```bash
# Via Git (recommandé)
git add .
git commit -m "fix: Configuration Netlify corrigée"
git push origin main

# Ou via Netlify CLI
npm install -g netlify-cli
netlify deploy --prod
```

---

## 🚨 Points Critiques à Vérifier

### 1. **Structure des Dossiers**
```
votre-projet/
├── netlify.toml          ← À la racine
├── next.config.js        ← Configuration corrigée
├── package.json          ← Dépendances mises à jour
├── app/                  ← App Router Next.js
├── components/
└── public/
```

### 2. **Fichiers Obligatoires**
- ✅ `netlify.toml` à la racine
- ✅ `next.config.js` avec `output: 'export'`
- ✅ `package.json` avec bonnes dépendances

### 3. **Erreurs Communes à Éviter**
- ❌ Ne pas mettre `output: 'standalone'` (pour Vercel uniquement)
- ❌ Ne pas oublier `images: { unoptimized: true }`
- ❌ Ne pas utiliser les API routes avec export statique

---

## 🎯 Résolution des Problèmes Spécifiques

### Problème 1: "Page not found"
**Cause:** Configuration Next.js incorrecte pour Netlify
**Solution:** Utiliser `output: 'export'` et `trailingSlash: true`

### Problème 2: Images ne se chargent pas
**Cause:** Optimisation d'images incompatible avec export statique
**Solution:** Ajouter `images: { unoptimized: true }`

### Problème 3: Erreurs de build
**Cause:** Dépendances manquantes ou versions incorrectes
**Solution:** Mettre à jour `package.json` avec les bonnes versions

### Problème 4: Routes ne fonctionnent pas
**Cause:** Redirections manquantes
**Solution:** Ajouter les redirections dans `netlify.toml`

---

## ✅ Checklist de Déploiement

Avant de déployer, vérifiez :

- [ ] `netlify.toml` présent à la racine
- [ ] `next.config.js` avec `output: 'export'`
- [ ] `package.json` avec toutes les dépendances
- [ ] Variables d'environnement configurées sur Netlify
- [ ] Plugin Next.js installé sur Netlify
- [ ] Build local réussi avec `npm run build`
- [ ] Aucune API route utilisée (incompatible avec export statique)

---

## 🚀 Après le Déploiement

### 1. **Vérifications**
- Site accessible sur l'URL Netlify
- Navigation entre pages fonctionne
- Images se chargent correctement
- Formulaires fonctionnent (si applicable)

### 2. **Optimisations**
- Configurer un domaine personnalisé
- Activer HTTPS (automatique sur Netlify)
- Configurer les headers de sécurité
- Mettre en place les analytics

### 3. **Monitoring**
- Surveiller les Core Web Vitals
- Vérifier les logs de déploiement
- Tester sur différents appareils

---

## 🆘 Support

Si vous rencontrez encore des problèmes :

1. **Vérifiez les logs de build** dans Netlify Dashboard
2. **Testez en local** avec `npm run build && npm run start`
3. **Vérifiez la console** du navigateur pour les erreurs JavaScript
4. **Consultez la documentation** Netlify Next.js

---

**🎉 Votre site Studio Élan devrait maintenant se déployer parfaitement sur Netlify !**

