# Structure du Projet WeekPlanner

```
week-planner-react/
├── node_modules/          # Dépendances du projet
├── public/
│   ├── vite.svg          # Logo Vite
│   └── react.svg         # Logo React
├── src/                  # Code source
│   ├── components/       # Composants React
│   │   ├── Task/        # Composant Tâche
│   │   │   └── index.jsx
│   │   ├── TaskForm/    # Formulaire de tâches
│   │   │   └── index.jsx
│   │   └── WeekView/    # Vue hebdomadaire
│   │       ├── index.jsx
│   │       └── DayCard.jsx
│   ├── hooks/           # Custom hooks React
│   │   └── useLocalStorage.js
│   ├── utils/           # Utilitaires
│   │   └── constants.js
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

## Description des fichiers principaux

### Fichiers de configuration

- `package.json`: Gestion des dépendances et scripts
- `vite.config.js`: Configuration de Vite (bundler)
- `tailwind.config.js`: Configuration du framework CSS
- `postcss.config.js`: Configuration de PostCSS
- `eslint.config.js`: Règles de linting

### Fichiers source principaux

- `index.html`: Point d'entrée HTML
- `src/main.jsx`: Point d'entrée JavaScript
- `src/App.jsx`: Composant racine de l'application
- `src/index.css`: Styles globaux et imports Tailwind
- `src/App.css`: Styles spécifiques à App
