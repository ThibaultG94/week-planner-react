# Structure du Projet WeekPlanner

```
week-planner-react/
├── node_modules/          # Dépendances du projet
├── public/               # Ressources publiques
│   ├── react.svg         # Logo React
│   └── vite.svg          # Logo Vite
├── src/                  # Code source
│   ├── **tests**/ # Dossier principal des tests
│   │ ├── flows/ # Tests de flux utilisateur
│   │ │ ├── authentication.test.js
│   │ │ ├── dataMigration.test.js
│   │ │ └── errorHandling.test.js
│   │ ├── unit/ # Tests unitaires
│   │ │ └── services/
│   │ │ └── TaskStorageService.test.js
│   │ └── utils/ # Utilitaires de test
│   │ ├── setup.js
│   │ └── mocks.js
│   ├── components/       # Composants React
│   │   ├── common/       # Composants réutilisables
│   │   │   ├── AnimatedTransition.jsx   # Animation des transitions
│   │   │   ├── DeleteConfirmation.jsx   # Modal de confirmation
│   │   │   ├── DroppableSlot.jsx        # Zone de drop pour les tâches
│   │   │   ├── TaskCard.jsx             # Carte de tâche
│   │   │   └── TimeBlock.jsx            # Bloc horaire (matin/après-midi)
│   │   ├── AppHeader.jsx        # En-tête de l'application
│   │   ├── DayColumn.jsx        # Colonne d'un jour
│   │   ├── TaskForm.jsx         # Formulaire de tâche
│   │   └── WeekView.jsx         # Vue de la semaine
│   ├── contexts/        # Contexts React
│   │   ├── TaskContext.jsx           # Gestion globale des tâches
│   │   └── ViewModeContext.jsx       # Gestion du mode d'affichage
│   ├── hooks/           # Custom hooks
│   │   ├── useDragAndDrop.js         # Logique de drag & drop
│   │   ├── useLocalStorage.js        # Persistence locale
│   │   ├── useTaskPositioning.js     # Positionnement des tâches
│   │   └── useViewMode.js            # Mode d'affichage
│   ├── lib/
│   │   ├── supabase.js
│   │   ├── taskMigration.js
│   │   └── TaskStorageService.js
│   ├── utils/           # Utilitaires
│   │   ├── animations.js       # Animations
│   │   ├── constants.js        # Constantes
│   │   ├── taskHelpers.js      # Helpers pour les tâches
│   │   ├── timeBlocks.js       # Gestion des blocs horaires
│   │   └── validation.js       # Validation des données
│   ├── App.jsx          # Composant racine
│   ├── index.css        # Styles globaux
│   └── main.jsx         # Point d'entrée
├── .gitignore          # Configuration Git
├── dnt-kit.md          # Documentation dnd-kit
├── eslint.config.js    # Configuration ESLint
├── index.html          # HTML principal
├── package.json        # Configuration npm
├── postcss.config.js   # Configuration PostCSS
├── README.md           # Documentation
├── tailwind.config.js  # Configuration Tailwind
├── vitest.config.js      # Configuration Vitest
└── vite.config.js      # Configuration Vite
```

## Hiérarchie des composants

```
App
├── AppHeader
│   └── TaskForm
└── WeekView
    └── DayColumn
        └── TimeBlock
            └── DroppableSlot
                └── TaskCard
                    └── DeleteConfirmation
```

## Description des composants

### Composants principaux

- `App.jsx`: Composant racine gérant l'état global et les fonctions principales
- `AppHeader.jsx`: En-tête avec logo et bouton d'ajout de tâche
- `WeekView.jsx`: Grille principale avec les colonnes des jours
- `DayColumn.jsx`: Colonne représentant une journée avec ses blocs matin/après-midi
- `TaskForm.jsx`: Modal de création/édition de tâche

### Composants communs

- `DroppableSlot.jsx`: Zone de drop unique pour une tâche avec gestion dnd-kit
- `TimeBlock.jsx`: Grille de 4 slots pour une période (matin ou après-midi)
- `TaskCard.jsx`: Représentation draggable d'une tâche
- `DeleteConfirmation.jsx`: Modal de confirmation de suppression
- `AnimatedTransition.jsx`: Composant pour les animations de transition

### Hooks et utilitaires

- `useLocalStorage.js`: Gestion de la persistance des données
- `useDragAndDrop.js`: Hook personnalisé pour le drag & drop avec dnd-kit
- `useTaskPositioning.js`: Hook pour gérer les positions des tâches dans les slots
- `useViewMode.js`: Hook pour gérer les modes d'affichage
