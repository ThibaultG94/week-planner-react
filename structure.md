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
│   │   │   └── DeleteConfirmation.jsx
│   │   ├── AppHeader.jsx        # Header de l'application
│   │   ├── Task.jsx             # Composant tâche individuelle
│   │   ├── TaskForm.jsx         # Formulaire de tâches
│   │   ├── WeekView.jsx         # Vue hebdomadaire
│   │   └── DayCard.jsx          # Carte journalière
│   ├── hooks/           # Custom hooks React
│   │   └── useLocalStorage.js
│   ├── utils/           # Utilitaires
│   │   ├── constants.js        # Constantes de l'application
│   │   └── validation.js       # Fonctions de validation
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
- `WeekView.jsx`: Vue principale avec la grille des jours
- `DayCard.jsx`: Carte représentant un jour et ses tâches
- `Task.jsx`: Représentation d'une tâche individuelle
- `TaskForm.jsx`: Formulaire de création/édition de tâche

### Composants communs

- `common/DeleteConfirmation.jsx`: Modal de confirmation de suppression

### Hooks personnalisés

- `useLocalStorage.js`: Gestion de la persistance des données

### Utilitaires

- `constants.js`: Constantes de l'application (jours, clés de stockage)
- `validation.js`: Fonctions de validation des formulaires
