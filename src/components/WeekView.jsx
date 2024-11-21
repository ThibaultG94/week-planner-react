import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { DAYS_OF_WEEK } from '../utils/constants';
import { useTaskContext } from '../contexts/TaskContext';
import DayColumn from './DayColumn';

const WeekView = ({ onAddTask }) => {
  const [activeId, setActiveId] = useState(null);
  const { tasks, moveTask } = useTaskContext();

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
    
    moveTask(active.id, targetDay, targetPeriod, parseInt(targetPosition));
    setActiveId(null);
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <DndContext
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
      >
        <div className="grid grid-cols-7 gap-2 h-full">
          {DAYS_OF_WEEK.map((day) => (
            <DayColumn 
              key={day}
              day={day}
              tasks={tasks.filter(task => task.day === day)}
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