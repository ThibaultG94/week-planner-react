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
│   │   │   ├── DroppableSlot.jsx        # Conteneur unique pour une tâche avec drop zone
│   │   │   ├── TimeBlock.jsx            # Bloc pour une demi-journée
│   │   │   ├── AddTaskButton.jsx        # Bouton + pour ajouter une tâche
│   │   │   ├── TaskCard.jsx             # Carte de tâche draggable
│   │   │   └── AnimatedTransition.jsx   # Composant pour les transitions fluides
│   │   ├── AppHeader.jsx        # Header avec logo et bouton nouvelle tâche
│   │   ├── TaskForm.jsx         # Modal formulaire de tâches
│   │   ├── WeekView.jsx         # Grille de la semaine
│   │   └── DayColumn.jsx        # Colonne d'une journée avec matin/après-midi
│   ├── hooks/           # Custom hooks React
│   │   ├── useLocalStorage.js         # Persistance des données
│   │   ├── useDragAndDrop.js         # Gestion du drag & drop avec dnd-kit
│   │   ├── useTaskPositioning.js      # Gestion des positions des tâches dans les slots
│   │   └── useViewMode.js            # Gestion des modes d'affichage
│   ├── utils/           # Utilitaires
│   │   ├── constants.js         # Constantes (jours, storage keys)
│   │   ├── validation.js        # Validation des formulaires
│   │   ├── timeBlocks.js        # Gestion des blocs horaires
│   │   └── dragAndDrop.js       # Helpers pour le drag & drop
│   ├── contexts/       # Contexts React
│   │   └── TaskContext.jsx    # Gestion globale des tâches
│   ├── App.jsx          # Composant principal
│   ├── index.css        # Styles globaux
│   └── main.jsx         # Point d'entrée
├── .gitignore          # Fichiers à ignorer par Git
├── eslint.config.js    # Configuration ESLint
├── index.html          # Page HTML principale
├── package.json        # Configuration du projet
├── postcss.config.js   # Configuration PostCSS
├── README.md           # Documentation
├── structure.md        # Structure du projet actualisée
├── tailwind.config.js  # Configuration Tailwind
└── vite.config.js      # Configuration Vite
```

## Description des composants

### Composants principaux

- `App.jsx`: Composant racine de l'application
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
- `AddTaskButton.jsx`: Bouton d'ajout rapide de tâche

### Hooks et contexts

- `useLocalStorage.js`: Gestion de la persistance des données
- `useDragAndDrop.js`: Hook personnalisé pour le drag & drop avec dnd-kit
- `useTaskPositioning.js`: Hook pour gérer les positions des tâches
- `useViewMode.js`: Hook pour gérer les modes d'affichage
- `TaskContext.jsx`: Context pour la gestion globale des tâches

### Utilitaires

- `constants.js`: Constantes de l'application
- `validation.js`: Validation des formulaires
- `timeBlocks.js`: Logique des blocs horaires
- `dragAndDrop.js`: Utilitaires pour le drag & drop
