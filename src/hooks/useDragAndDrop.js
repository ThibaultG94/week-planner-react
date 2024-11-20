import { useState, useCallback } from "react";
import { arrayMove } from "@dnd-kit/sortable";

const useDragAndDrop = ({ items, onReorder, onMove }) => {
  const [activeId, setActiveId] = useState(null);
  const [initialContainer, setInitialContainer] = useState(null);

  const handleDragStart = useCallback(({ active }) => {
    setActiveId(active.id);
    setInitialContainer(active.data.current?.sortable?.containerId);
  }, []);

  const handleDragOver = useCallback(
    ({ active, over }) => {
      if (!over) return;

      const activeContainer = active.data.current?.sortable?.containerId;
      const overContainer = over.data.current?.sortable?.containerId;

      if (activeContainer !== overContainer) {
        onMove?.({
          taskId: active.id,
          sourceContainer: activeContainer,
          destinationContainer: overContainer,
          overItemId: over.id,
        });
      }
    },
    [onMove]
  );

  const handleDragEnd = useCallback(
    ({ active, over }) => {
      if (!over) {
        setActiveId(null);
        return;
      }

      const activeContainer = active.data.current?.sortable?.containerId;
      const overContainer = over.data.current?.sortable?.containerId;

      if (activeContainer === overContainer) {
        // Réorganisation dans le même conteneur
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        if (oldIndex !== newIndex) {
          const newItems = arrayMove(items, oldIndex, newIndex);
          onReorder?.(newItems, activeContainer);
        }
      } else {
        // Déplacement vers un autre conteneur
        onMove?.({
          taskId: active.id,
          sourceContainer: initialContainer,
          destinationContainer: overContainer,
          overItemId: over.id,
        });
      }

      setActiveId(null);
      setInitialContainer(null);
    },
    [items, onReorder, onMove, initialContainer]
  );

  return {
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd,
  };
};

export default useDragAndDrop;
