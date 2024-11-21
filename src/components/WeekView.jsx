import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
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

    // L'ID est maintenant formaté comme 'day-period-position'
    const [day, period, position] = over.id.split('-');
    
    // Mettre à jour la tâche avec sa nouvelle position
    onTaskUpdate(active.id, {
      day, // Maintenant dans le bon ordre
      period, // Maintenant dans le bon ordre
      position: parseInt(position)
    });

    setActiveId(null);
  };

  const handleTaskMove = (taskId, targetDay, targetPeriod, position) => {
    onTaskUpdate(taskId, {
      day: targetDay,
      period: targetPeriod,
      position
    });
  };

  const handleTasksReorder = (updatedTasks) => {
    updatedTasks.forEach(task => {
      onTaskUpdate(task.id, {
        position: task.position
      });
    });
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
              onTaskComplete={onTaskComplete}
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
              onAddTask={onAddTask}
              onTaskMove={handleTaskMove}
              onTasksReorder={handleTasksReorder}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default WeekView;