import { useMemo } from "react";

/**
 * Hook pour gérer les positions des tâches dans une grille
 * @param {Array} tasks - Liste des tâches
 * @param {number} maxSlotsPerPeriod - Nombre maximum de slots par période
 * @returns {Object} Fonctions utilitaires pour la gestion des positions
 */
const useTaskPositioning = (tasks, maxSlotsPerPeriod = 4) => {
  // Mémoiser les tâches groupées par jour et période
  const groupedTasks = useMemo(() => {
    return tasks.reduce((acc, task) => {
      const key = `${task.day}-${task.period}`;
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(task);
      return acc;
    }, {});
  }, [tasks]);

  /**
   * Trouve la prochaine position disponible dans une période
   * @param {string} day - Jour de la semaine
   * @param {string} period - Période (morning/afternoon)
   * @returns {number} Position disponible
   */
  const findNextAvailablePosition = (day, period) => {
    const key = `${day}-${period}`;
    const periodTasks = groupedTasks[key] || [];

    // Trier les tâches par position
    const takenPositions = periodTasks.map((t) => t.position);

    // Trouver la première position disponible
    for (let i = 0; i < maxSlotsPerPeriod; i++) {
      if (!takenPositions.includes(i)) {
        return i;
      }
    }

    return -1; // Aucune position disponible
  };

  /**
   * Vérifie si une position est disponible dans une période
   * @param {string} day - Jour de la semaine
   * @param {string} period - Période (morning/afternoon)
   * @param {number} position - Position à vérifier
   * @param {number} excludeTaskId - ID de la tâche à exclure de la vérification
   * @returns {boolean} True si la position est disponible
   */
  const isPositionAvailable = (day, period, position, excludeTaskId = null) => {
    const key = `${day}-${period}`;
    const periodTasks = groupedTasks[key] || [];

    return !periodTasks.some(
      (task) => task.position === position && task.id !== excludeTaskId
    );
  };

  /**
   * Réorganise les positions des tâches après un déplacement
   * @param {string} day - Jour de la semaine
   * @param {string} period - Période (morning/afternoon)
   * @param {number} skipPosition - Position à exclure
   * @returns {Array} Liste des tâches avec leurs nouvelles positions
   */
  const reorderPositions = (day, period, skipPosition = null) => {
    const key = `${day}-${period}`;
    const periodTasks = [...(groupedTasks[key] || [])];

    // Trier les tâches par position actuelle
    periodTasks.sort((a, b) => a.position - b.position);

    // Réassigner les positions séquentiellement
    let currentPosition = 0;
    const updates = [];

    periodTasks.forEach((task) => {
      if (task.position === skipPosition) {
        return;
      }

      if (task.position !== currentPosition) {
        updates.push({
          ...task,
          position: currentPosition,
        });
      }
      currentPosition++;
    });

    return updates;
  };

  /**
   * Calcule la position optimale pour une tâche déplacée
   * @param {Object} task - Tâche à déplacer
   * @param {string} targetDay - Jour cible
   * @param {string} targetPeriod - Période cible
   * @param {number} suggestedPosition - Position suggérée
   * @returns {number} Position optimale
   */
  const calculateOptimalPosition = (
    task,
    targetDay,
    targetPeriod,
    suggestedPosition = null
  ) => {
    // Si une position est suggérée et disponible, l'utiliser
    if (
      suggestedPosition !== null &&
      isPositionAvailable(targetDay, targetPeriod, suggestedPosition, task.id)
    ) {
      return suggestedPosition;
    }

    // Sinon, trouver la prochaine position disponible
    return findNextAvailablePosition(targetDay, targetPeriod);
  };

  return {
    findNextAvailablePosition,
    isPositionAvailable,
    reorderPositions,
    calculateOptimalPosition,
  };
};

export default useTaskPositioning;
