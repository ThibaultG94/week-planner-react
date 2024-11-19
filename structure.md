# Structure du Projet WeekPlanner

```
week-planner-react/
├── src/
│   ├── components/           # Composants réutilisables
│   │   ├── WeekView/        # Vue principale de la semaine
│   │   │   ├── index.jsx    # Composant conteneur
│   │   │   └── DayCard.jsx  # Carte pour chaque jour
│   │   ├── TaskForm/        # Formulaire d'ajout de tâche
│   │   │   └── index.jsx
│   │   └── Task/           # Composant de tâche individuelle
│   │       └── index.jsx
│   ├── hooks/              # Custom hooks
│   │   └── useLocalStorage.js  # Hook pour la persistance
│   ├── utils/              # Utilitaires
│   │   └── constants.js    # Constantes (jours, etc.)
│   ├── App.jsx            # Composant racine
│   ├── main.jsx          # Point d'entrée
│   └── index.css         # Styles globaux
├── public/               # Assets statiques
├── tailwind.config.js   # Configuration Tailwind
└── package.json         # Dépendances
```

## Description des composants

- `WeekView`: Affiche la grille hebdomadaire
- `DayCard`: Gère l'affichage des tâches pour un jour
- `TaskForm`: Formulaire pour créer/éditer des tâches
- `Task`: Affiche une tâche individuelle avec ses actions

## Fonctionnalités clés

- Persistance avec localStorage
- Gestion des tâches par jour
- Notes associées aux tâches
- Interface responsive
- Thème personnalisable
