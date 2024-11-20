import React, { useState } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { DragOverlay } from '@dnd-kit/core';
import DayColumn from './DayColumn';
import { DAYS_OF_WEEK } from '../utils/constants';
import TaskCard from './common/TaskCard';

const WeekView = ({ 
  tasks, 
  onTaskUpdate, 
  onDeleteTask, 
  onEditTask, 
  onTaskComplete,
  onAddTask 
}) => {
  const [activeTask, setActiveTask] = useState(null);

  const handleDragStart = (event) => {
    const task = tasks.find(t => t.id === event.active.id);
    setActiveTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveTask(null);
      return;
    }

    // Récupérer les informations du slot cible
    const [targetDay, targetPeriod, targetPosition] = over.id.split('-');
    
    // Ne rien faire si on dépose au même endroit
    const targetSlotTask = tasks.find(t => 
      t.day === targetDay && 
      t.period === targetPeriod && 
      t.position === parseInt(targetPosition)
    );
    if (targetSlotTask && targetSlotTask.id === active.id) {
      setActiveTask(null);
      return;
    }

    // Récupérer la tâche à déplacer
    const updatedTasks = tasks.map(t => {
      // Si c'est la tâche qu'on déplace
      if (t.id === active.id) {
        return {
          ...t,
          day: targetDay,
          period: targetPeriod,
          position: parseInt(targetPosition)
        };
      }

      // Si c'est une tâche qui était dans le slot cible, on la déplace
      if (t.day === targetDay && 
          t.period === targetPeriod && 
          t.position === parseInt(targetPosition)) {
        // Trouver une nouvelle position disponible
        const takenPositions = tasks
          .filter(task => task.day === targetDay && task.period === targetPeriod)
          .map(task => task.position);
        
        for (let i = 0; i < 4; i++) {
          if (!takenPositions.includes(i)) {
            return { ...t, position: i };
          }
        }
      }

      return t;
    });

    onTaskUpdate(updatedTasks);
    setActiveTask(null);
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
            />
          ))}
        </div>
        
        <DragOverlay>
          {activeTask ? (
            <div className="bg-white shadow-lg rounded-md border border-blue-200 w-[200px] h-[60px]">
              <TaskCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default React.memo(WeekView);