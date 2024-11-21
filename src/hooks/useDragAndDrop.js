import { useState, useCallback } from "react";
import useTaskPositioning from "./useTaskPositionning";

const useDragAndDrop = ({ tasks, onTaskMove, onTasksReorder }) => {
  const [activeId, setActiveId] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const taskPositioning = useTaskPositioning(tasks);

  const handleDragStart = useCallback(
    ({ active }) => {
      const task = tasks.find((t) => t.id === active.id);
      if (task) {
        setActiveId(active.id);
        setActiveTask(task);
      }
    },
    [tasks]
  );

  const handleDragOver = useCallback(
    ({ active, over }) => {
      if (!over || !activeTask) return;

      // L'ID suit le format : day-period-position
      const [targetDay, targetPeriod, targetPosition] = over.id.split("-");

      // Ne rien faire si on survole la même position
      if (
        targetDay === activeTask.day &&
        targetPeriod === activeTask.period &&
        parseInt(targetPosition) === activeTask.position
      ) {
        return;
      }

      // Calculer la position optimale
      const optimalPosition = taskPositioning.calculateOptimalPosition(
        activeTask,
        targetDay,
        targetPeriod,
        parseInt(targetPosition)
      );

      if (optimalPosition >= 0) {
        onTaskMove(active.id, targetDay, targetPeriod, optimalPosition);

        // Réorganiser les autres tâches si nécessaire
        const reorderedTasks = taskPositioning.reorderPositions(
          targetDay,
          targetPeriod,
          optimalPosition
        );

        if (reorderedTasks.length > 0) {
          onTasksReorder(reorderedTasks);
        }
      }
    },
    [activeTask, onTaskMove, onTasksReorder, taskPositioning]
  );

  const handleDragEnd = useCallback(
    ({ active, over }) => {
      if (!over || !activeTask) {
        if (activeTask) {
          // Remettre la tâche à sa position initiale
          onTaskMove(
            active.id,
            activeTask.day,
            activeTask.period,
            activeTask.position
          );
        }
      }

      setActiveId(null);
      setActiveTask(null);
    },
    [activeTask, onTaskMove]
  );

  return {
    activeId,
    activeTask,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};

export default useDragAndDrop;
