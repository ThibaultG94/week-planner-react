import { 
    DndContext, 
    closestCenter,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
  } from '@dnd-kit/core';
  import { 
    SortableContext,
    verticalListSortingStrategy,
  } from '@dnd-kit/sortable';
  import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
  
  const DragDropContext = ({ 
    children,
    items,
    onDragStart,
    onDragOver,
    onDragEnd,
    activationConstraint = { distance: 10 }
  }) => {
    const sensors = useSensors(
      useSensor(MouseSensor, { activationConstraint }),
      useSensor(TouchSensor, { activationConstraint })
    );
  
    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
      >
        <SortableContext 
          items={items.map(item => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {children}
        </SortableContext>
      </DndContext>
    );
  };
  
  export default DragDropContext;