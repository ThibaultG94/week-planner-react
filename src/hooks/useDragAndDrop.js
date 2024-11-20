import { useState, useCallback } from "react";

const useDragAndDrop = ({ onMove }) => {
  const [activeId, setActiveId] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const handleDragStart = useCallback(({ active }) => {
    setActiveId(active.id);
    setActiveTask(active.data.current?.task);
  }, []);

  const handleDragOver = useCallback(
    ({ active, over }) => {
      if (!over) return;

      const activeContainer = active.data.current?.containerId;
      const overContainer = over.data.current?.containerId;

      if (activeContainer !== overContainer) {
        const [targetPeriod, targetDay] = overContainer?.split("-") || [];

        if (targetDay && targetPeriod) {
          onMove({
            taskId: active.id,
            targetDay,
            targetPeriod,
            position: over.data.current?.position || 0,
          });
        }
      }
    },
    [onMove]
  );

  const handleDragEnd = useCallback(
    ({ active, over }) => {
      if (!over) {
        setActiveId(null);
        setActiveTask(null);
        return;
      }

      const overContainer = over.data.current?.containerId;
      if (!overContainer) {
        setActiveId(null);
        setActiveTask(null);
        return;
      }

      const [targetPeriod, targetDay] = overContainer.split("-");
      onMove({
        taskId: active.id,
        targetDay,
        targetPeriod,
        position: over.data.current?.position || 0,
      });

      setActiveId(null);
      setActiveTask(null);
    },
    [onMove]
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
