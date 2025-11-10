# Documentation Professionnelle — Studio Élan

Ce dossier `docs/` centralise la documentation technique destinée à votre “vous du futur”. Objectif: relire, comprendre et évoluer le code sans effort dans 12 mois.

Contenu
- ARCHITECTURE.md — Vue d’ensemble et conventions
- CODE_STYLE.md — Règles de style et types (zéro `any`)
- API_ROUTES.md — Documentation des endpoints Next.js
- DEV_GUIDE.md — Guide développeur pour travailler efficacement
- TESTS.md — Tests unitaires et E2E, environnements, mocks
- CI_CD.md — Pipeline CI/CD, artefacts et déclencheurs

Principes directeurs
- Types stricts: proscrire `any`, préférez `unknown` + gardes de type et des interfaces claires.
- Simplicité: fonctions courtes, comportements déterministes.
- Documentation vivante: mettre à jour les docs à chaque PR qui modifie les comportements.

Comment utiliser
- Avant une feature: lisez ARCHITECTURE.md et CODE_STYLE.md.
- Pour une route API: consultez API_ROUTES.md et DEV_GUIDE.md.
- Pour les tests: lisez TESTS.md (node vs jsdom), puis lancez `npm test`.
- Pour CI/CD et déploiement: CI_CD.md et DEPLOYMENT.md (à la racine).

Conseil
- Si une partie du code semble complexe, ajoutez un docblock en tête du fichier avec un résumé du flux et des invariants, et mettez à jour `docs/**` en conséquence. Votre “moi du futur” vous remerciera.