# Documentation Complète WeekPlanner

## 1. Vue d'ensemble du Projet

### 1.1 Description

WeekPlanner est une application de planification hebdomadaire basée sur React, permettant aux utilisateurs d'organiser leurs tâches via une interface drag & drop intuitive.

### 1.2 Fonctionnalités Principales Actuelles

- Création et gestion de tâches
- Organisation par jour et période (matin/après-midi)
- Drag & drop pour le réarrangement des tâches
- Persistance locale des données
- Interface responsive
- Authentification utilisateur avec Supabase
- Stockage hybride (Supabase + localStorage)
- Migration des données locales vers Supabase

## 2. Architecture Technique

### 2.1 Stack Technologique

- React 18.3
- Vite
- TailwindCSS
- dnd-kit pour le drag & drop
- Supabase pour l'authentification et le stockage
- LocalStorage pour utilisateurs non connectés
- Vitest + Testing Library pour les tests

### 2.2 Structure du Projet

```
week-planner-react/
├── src/
│   ├── __tests__/           # Tests
│   │   ├── flows/          # Tests des flux utilisateur
│   │   │   ├── authentication.test.js
│   │   │   ├── dataMigration.test.js
│   │   │   └── errorHandling.test.js
│   │   ├── unit/          # Tests unitaires
│   │   │   └── services/
│   │   │       └── TaskStorageService.test.js
│   │   └── setup.js       # Configuration des tests
│   ├── components/       # Composants React
│   ├── contexts/        # Contexts React
│   ├── hooks/          # Custom hooks
│   ├── lib/            # Services et utilitaires
│   └── utils/          # Fonctions utilitaires
```

### 2.3 Patterns de Test

1. **Tests Unitaires**

   - Tests de TaskStorageService
   - Validation des données
   - Logique métier isolée

2. **Tests de Flux (Integration)**

   - Authentification complète
   - Migration des données
   - Gestion des erreurs
   - Expérience utilisateur

3. **Organisation des Tests**
   - `/flows` : Tests de bout en bout
   - `/unit` : Tests unitaires
   - `setup.js` : Configuration globale

## 3. Tests

### 3.1 Exécution des Tests

```bash
# Mode watch
npm test

# Interface utilisateur Vitest
npm run test:ui

# Couverture de code
npm run coverage
```

### 3.2 Tests de Flux Principaux

1. **Authentication Flow**

   - Inscription
   - Connexion
   - Gestion de session
   - Erreurs d'authentification

2. **Data Migration Flow**

   - Détection des données locales
   - Migration vers Supabase
   - Gestion des erreurs
   - État de l'UI

3. **Error Handling Flow**
   - Erreurs réseau
   - Validation des formulaires
   - Rollbacks
   - Messages d'erreur

### 3.3 Mock et Simulation

1. **APIs**

   - Supabase Auth
   - Supabase Storage
   - Network Requests

2. **Browser APIs**
   - localStorage
   - navigator.onLine
   - window.performance

### 3.4 Bonnes Pratiques

1. **Structure**

   - Un fichier par domaine fonctionnel
   - Tests isolés et indépendants
   - Setup et teardown appropriés

2. **Assertions**

   - Tests d'UI avec Testing Library
   - Vérification des états
   - Validation des messages

3. **Performance**
   - Timeouts adaptés
   - Gestion de l'asynchrone
   - Optimisation des mocks

## 4. Développement

### 4.1 Installation

```bash
# Installation des dépendances
npm install

# Démarrage en développement
npm run dev

# Build production
npm run build
```

### 4.2 Variables d'Environnement

```env
VITE_SUPABASE_URL=votre_url
VITE_SUPABASE_ANON_KEY=votre_clé
```

### 4.3 Structure des Commits

```
type(scope): description

- feat: nouvelle fonctionnalité
- fix: correction de bug
- test: ajout/modification de tests
- docs: documentation
- chore: maintenance
```

## 5. Déploiement

### 5.1 Prérequis

- Node.js 18+
- Compte Supabase
- Variables d'environnement configurées

### 5.2 Build

```bash
# Build
npm run build

# Preview
npm run preview
```

### 5.3 Migration des Données

1. Préparation

   - Vérification des schémas
   - Backup des données

2. Exécution
   - Migration progressive
   - Validation des données
   - Rollback si nécessaire

## 6. Maintenance

### 6.1 Monitoring

- Supabase Dashboard
- Logs d'erreur
- Métriques de performance

### 6.2 Backups

- Exports réguliers
- Versioning des schémas
- Plans de restauration

### 6.3 Mises à Jour

- Dépendances
- Sécurité
- Compatibilité navigateurs

## 7. Contribuer

### 7.1 Guidelines

1. Fork le projet
2. Créer une branche (`feature/ma-feature`)
3. Commiter les changements
4. Pousser vers la branche
5. Créer une Pull Request

### 7.2 Standards

- ESLint pour le style
- Tests requis
- Documentation à jour
- Review obligatoire

## 8. Support

### 8.1 Ressources

- Documentation Supabase
- Documentation React
- Guide dnd-kit

### 8.2 Contact

- Issues GitHub
- Discussions
- Support technique

## 9. Roadmap

### 9.1 Court Terme

- Optimisation des tests
- Documentation API
- Amélioration UX

### 9.2 Moyen Terme

- Mode hors-ligne
- Export/Import
- Templates

### 9.3 Long Terme

- Version mobile
- Collaboration
- API publique
