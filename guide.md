# Guide de développement WeekPlanner

## 1. État Actuel du Projet

### 1.1 Frontend (Complété)

- Application React fonctionnelle
- Interface drag & drop avec dnd-kit
- Gestion locale des tâches
- Corrections des bugs majeurs:
  - ✓ Problème de disparition pendant le drag & drop
  - ✓ Problème d'édition dans le TaskForm
  - ✓ Collision de position des tâches

### 1.2 Backend (En cours)

- Choix de Supabase comme solution backend
- Base de données créée
- Structure de la table tasks définie:
  ```sql
  - id (int8, PK, auto-generated)
  - title (text, NOT NULL)
  - note (text, NULL)
  - location_type (text, NOT NULL, DEFAULT 'parking')
  - day (text, NULL)
  - period (text, NULL)
  - position (int8, NOT NULL, DEFAULT 0)
  - completed (boolean, NOT NULL, DEFAULT false)
  - created_at (timestamptz, auto-generated)
  ```

## 2. Prochaines Étapes Immédiates

### 2.1 Intégration Supabase (Priorité Haute)

1. Installation du client Supabase

```bash
npm install @supabase/supabase-js
```

2. Configuration du client React

- Création des variables d'environnement
- Setup du client Supabase
- Création des hooks personnalisés pour l'accès aux données

3. Migration des données

- Adaptation du TaskContext pour utiliser Supabase
- Migration de la logique CRUD

### 2.2 Authentification (Priorité Moyenne)

- Configuration de l'auth Supabase
- Création des écrans de login/register
- Sécurisation des routes
- Configuration RLS pour la table tasks

## 3. Améliorations UX/UI Prévues

### 3.1 Court Terme

1. Feedback visuel

- Animations de transition
- Indicateurs de chargement
- Messages d'erreur

2. Optimisations drag & drop

- Utilisation optimisée de useTaskPositioning
- Swap de positions
- Animations fluides

### 3.2 Moyen Terme

- Mode sombre
- Filtres et recherche
- Vue mobile optimisée

## 4. Infrastructure

### 4.1 Déploiement

- Configuration CapRover pour Supabase
- Migration vers serveur de production
- Configuration des sauvegardes

### 4.2 Monitoring

- Logs d'erreur
- Métriques de performance
- Surveillance des ressources

## 5. Dette Technique

### 5.1 Priorités

1. Tests

- Tests unitaires pour les hooks
- Tests d'intégration Supabase
- Tests E2E des fonctionnalités critiques

2. Documentation

- API documentation
- Guide de déploiement
- Documentation utilisateur

### 5.2 Optimisations

- Lazy loading
- Memoization des composants
- Gestion du cache

## 6. Métriques de Succès

### 6.1 Performance

- Temps de chargement < 2s
- FPS > 30 pendant le drag & drop
- Latence API < 300ms

### 6.2 Engagement

- Mesures d'utilisation
- Feedback utilisateur
- Taux d'erreur
