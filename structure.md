# Structure du Projet WeekPlanner

```
week-planner-react/
├── node_modules/          # Dépendances du projet
├── public/
│   ├── vite.svg          # Logo Vite
│   └── react.svg         # Logo React
├── src/                  # Code source
│   ├── components/       # Composants React
│   │   ├── common/       # Composants réutilisables
│   │   │   ├── DeleteConfirmation.jsx   # Modal de confirmation de suppression
│   │   │   ├── TimeBlock.jsx            # Bloc pour une demi-journée
│   │   │   └── AddTaskButton.jsx        # Bouton + pour ajouter une tâche
│   │   │   ├── TaskCard.jsx             # Nouvelle vue de carte de tâche (compacte/détaillée)
│   │   │   └── AnimatedTransition.jsx   # Composant pour les transitions fluides
│   │   ├── AppHeader.jsx        # Header avec logo et bouton nouvelle tâche
│   │   ├── Task.jsx             # Composant tâche avec drag & drop
│   │   ├── TaskForm.jsx         # Modal formulaire de tâches
│   │   ├── WeekView.jsx         # Grille de la semaine
│   │   └── DayColumn.jsx        # Colonne d'une journée avec matin/après-midi
│   ├── hooks/           # Custom hooks React
│   │   ├── useLocalStorage.js         # Persistance des données
│   │   ├── useDragAndDrop.js         # Gestion du drag & drop améliorée
│   │   ├── useTaskPositioning.js     # Nouveau hook pour le positionnement des tâches
│   │   └── useViewMode.js            # Nouveau hook pour gérer les modes d'affichage
│   ├── utils/           # Utilitaires
│   │   ├── constants.js        # Constantes (jours, storage keys)
│   │   ├── taskHelpers.js      # Fonctions pour la gestion des tâches
│   │   ├── validation.js       # Validation des formulaires
│   │   ├── timeBlocks.js       # Nouvelle gestion des blocs horaires
│   │   └── animations.js       # Configurations des animations
│   ├── contexts/       # Contexts React
│   │   ├── TaskContext.jsx    # Gestion globale des tâches
│   │   └── ViewModeContext.jsx # Gestion du mode d'affichage
│   ├── App.jsx          # Composant principal
│   ├── index.css        # Styles globaux
│   └── main.jsx         # Point d'entrée
├── .gitignore           # Fichiers à ignorer par Git
├── eslint.config.js     # Configuration ESLint
├── index.html           # Page HTML principale
├── package.json         # Configuration du projet
├── postcss.config.js    # Configuration PostCSS
├── README.md           # Documentation
├── structure.md        # Structure du projet
├── tailwind.config.js  # Configuration Tailwind
└── vite.config.js      # Configuration Vite
```

## Description des composants

### Composants principaux

- `App.jsx`: Composant racine de l'application
- `AppHeader.jsx`: En-tête avec logo et bouton d'ajout de tâche
- `WeekView.jsx`: Grille principale avec les colonnes des jours
- `DayColumn.jsx`: Colonne représentant une journée avec ses blocs matin/après-midi
- `Task.jsx`: Représentation d'une tâche individuelle avec drag & drop
- `TaskForm.jsx`: Modal de création/édition de tâche

### Composants communs

- `TimeBlock.jsx`: Représente un bloc de demi-journée pouvant contenir jusqu'à 4 tâches
- `AddTaskButton.jsx`: Bouton + pour ajouter rapidement une tâche dans un bloc vide
- `DeleteConfirmation.jsx`: Modal de confirmation de suppression

### Hooks et contexts

- `useLocalStorage.js`: Gestion de la persistance des données
- `useDragAndDrop.js`: Hook personnalisé pour le drag & drop
- `TaskContext.jsx`: Context pour la gestion globale des tâches et leur état

### Utilitaires

- `constants.js`: Constantes de l'application
- `taskHelpers.js`: Fonctions utilitaires pour la gestion des tâches
