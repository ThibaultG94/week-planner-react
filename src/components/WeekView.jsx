import React, { useState } from 'react';
import { DndContext, closestCenter, pointerWithin } from '@dnd-kit/core';
import { DAYS_OF_WEEK } from '../utils/constants';
import DayColumn from './DayColumn';

const WeekView = ({ 
  tasks, 
  onDeleteTask, 
  onEditTask, 
  onTaskComplete,
  onAddTask,
  onTaskUpdate 
}) => {
  const [activeId, setActiveId] = useState(null);

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const [targetDay, targetPeriod, targetPosition] = over.id.split('-');
    
    onTaskUpdate(active.id, {
      day: targetDay,
      period: targetPeriod,
      position: parseInt(targetPosition)
    });

    setActiveId(null);
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      {/* Un seul contexte DND pour toute la vue */}
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        // Utiliser un algorithme de collision plus tolérant
        collisionDetection={closestCenter}
      >
        <div className="grid grid-cols-7 gap-2 h-full">
          {DAYS_OF_WEEK.map((day) => (
            <DayColumn 
              key={day}
              day={day}
              tasks={tasks.filter(task => task.day === day)}
              onTaskComplete={onTaskComplete}
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
              onAddTask={onAddTask}
              activeId={activeId}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default WeekView;