import React, { useState } from 'react';
import DayColumn from './DayColumn';
import { DAYS_OF_WEEK } from '../utils/constants';

const WeekView = ({ tasks, onTaskUpdate, onDeleteTask, onEditTask }) => {
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  const handleTaskDrop = (e, targetDay, period) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (!taskId || taskId === draggedTaskId) return;

    const updatedTasks = tasks.map(task => {
      if (task.id === parseInt(taskId)) {
        return { ...task, day: targetDay, period };
      }
      return task;
    });

    onTaskUpdate(updatedTasks);
    setDraggedTaskId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-7 gap-4 min-h-screen">
      {DAYS_OF_WEEK.map((day) => (
        <DayColumn 
          key={day} 
          day={day}
          tasks={tasks.filter(task => task.day === day)}
          onTaskDrop={handleTaskDrop}
          onDragStart={(task) => setDraggedTaskId(task.id)}
          onDragEnd={() => setDraggedTaskId(null)}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
        />
      ))}
    </div>
  );
};

export default WeekView;