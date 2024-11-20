import { 
  DndContext, 
  closestCorners,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';

const DragDropContext = ({ 
  children,
  onDragStart,
  onDragOver,
  onDragEnd,
  dragOverlay,
  activationConstraint = { distance: 10 }
}) => {
  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint }),
    useSensor(TouchSensor, { activationConstraint })
  );

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
    >
      {children}
      <DragOverlay>{dragOverlay}</DragOverlay>
    </DndContext>
  );
};

export default DragDropContext;