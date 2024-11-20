import React, { useState } from 'react';
import DayColumn from './DayColumn';
import { DAYS_OF_WEEK } from '../utils/constants';

const WeekView = ({ 
  tasks, 
  onTaskUpdate, 
  onDeleteTask, 
  onEditTask, 
  onTaskComplete 
}) => {
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  const handleTaskDrop = (e, targetDay, period) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId || taskId === draggedTaskId) return;

    const updatedTasks = tasks.map(task => {
      if (task.id === parseInt(taskId)) {
        const targetTasks = tasks.filter(t => t.day === targetDay && t.period === period);
        const newPosition = targetTasks.length;
        return { 
          ...task, 
          day: targetDay, 
          period: period,
          position: newPosition 
        };
      }
      return task;
    });

    onTaskUpdate(updatedTasks);
    setDraggedTaskId(null);
  };

  return (
    <div className="h-[calc(100vh-8rem)] grid grid-cols-7 gap-2">
      {DAYS_OF_WEEK.map((day) => (
        <DayColumn 
          key={day}
          day={day}
          tasks={tasks.filter(task => task.day === day)}
          onTaskDrop={handleTaskDrop}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          onTaskComplete={onTaskComplete}
        />
      ))}
    </div>
  );
};

export default React.memo(WeekView);