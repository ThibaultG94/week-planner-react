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
    handleDragOver,
  };
};

export default useDragAndDrop;
