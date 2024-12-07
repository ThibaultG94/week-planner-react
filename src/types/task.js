/**
 * @typedef {'week' | 'parking'} LocationType
 *
 * @typedef {Object} TaskLocation
 * @property {LocationType} type - Type de localisation ('week' ou 'parking')
 * @property {string} [day] - Jour de la semaine (uniquement pour type='week')
 * @property {string} [period] - Période (uniquement pour type='week')
 * @property {number} position - Position dans la zone
 *
 * @typedef {Object} Task
 * @property {number} id - Identifiant unique
 * @property {string} title - Titre de la tâche
 * @property {string} [note] - Note optionnelle
 * @property {TaskLocation} location - Localisation de la tâche
 * @property {boolean} completed - État de complétion
 */
