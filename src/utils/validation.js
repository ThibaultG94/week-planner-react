// Règles de validation pour les tâches
const TASK_RULES = {
  title: {
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  note: {
    required: false,
    maxLength: 200,
  },
};

// Messages d'erreur personnalisés
const ERROR_MESSAGES = {
  required: (field) => `Le champ ${field} est requis`,
  minLength: (field, length) =>
    `Le champ ${field} doit contenir au moins ${length} caractères`,
  maxLength: (field, length) =>
    `Le champ ${field} ne doit pas dépasser ${length} caractères`,
  pattern: (field) => `Le format du champ ${field} n'est pas valide`,
};

/**
 * Valide un champ selon les règles spécifiées
 * @param {string} field - Nom du champ
 * @param {any} value - Valeur à valider
 * @param {Object} rules - Règles de validation
 * @returns {string|null} Message d'erreur ou null si valide
 */
export const validateField = (field, value, rules = {}) => {
  // Gestion de la règle required
  if (rules.required && (!value || value.trim() === "")) {
    return ERROR_MESSAGES.required(field);
  }

  // Skip other validations if field is empty and not required
  if (!value && !rules.required) {
    return null;
  }

  // Gestion de la longueur minimale
  if (rules.minLength && value.length < rules.minLength) {
    return ERROR_MESSAGES.minLength(field, rules.minLength);
  }

  // Gestion de la longueur maximale
  if (rules.maxLength && value.length > rules.maxLength) {
    return ERROR_MESSAGES.maxLength(field, rules.maxLength);
  }

  // Gestion des expressions régulières
  if (rules.pattern && !rules.pattern.test(value)) {
    return ERROR_MESSAGES.pattern(field);
  }

  return null;
};

/**
 * Valide un objet tâche complet
 * @param {Object} task - Tâche à valider
 * @returns {Object} Objet contenant les erreurs éventuelles
 */
export const validateTask = (task) => {
  const errors = {};

  // Validation du titre
  const titleError = validateField("titre", task.title, TASK_RULES.title);
  if (titleError) errors.title = titleError;

  // Validation de la note
  const noteError = validateField("note", task.note, TASK_RULES.note);
  if (noteError) errors.note = noteError;

  return errors;
};

/**
 * Vérifie si un objet d'erreurs contient des erreurs
 * @param {Object} errors - Objet d'erreurs
 * @returns {boolean} True si des erreurs sont présentes
 */
export const hasErrors = (errors) => {
  return Object.keys(errors).length > 0;
};

// Export des constantes pour réutilisation
export { TASK_RULES };
