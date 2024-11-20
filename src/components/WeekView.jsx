import React, { useState, useCallback } from 'react';
import DayColumn from './DayColumn';
import DragDropContext from './common/DragDropContext';
import { DAYS_OF_WEEK } from '../utils/constants';
import useDragAndDrop from '../hooks/useDragAndDrop';

const WeekView = ({ 
  tasks, 
  onTaskUpdate, 
  onDeleteTask, 
  onEditTask, 
  onTaskComplete,
  onTaskMove: onTaskMoveExternal,
  onAddTask 
}) => {
  const [draggedTask, setDraggedTask] = useState(null);

  const handleTaskMove = useCallback(({ taskId, targetDay, targetPeriod }) => {
    const taskToMove = tasks.find(t => t.id === Number(taskId));
    if (!taskToMove) return;

    const tasksInDestination = tasks.filter(
      t => t.day === targetDay && t.period === targetPeriod
    );

    if (tasksInDestination.length >= 4) {
      console.warn('Impossible de déplacer : période pleine');
      return;
    }

    const updatedTasks = tasks.map(task => {
      if (task.id === Number(taskId)) {
        return {
          ...task,
          day: targetDay,
          period: targetPeriod,
          position: tasksInDestination.length
        };
      }
      return task;
    });

    onTaskUpdate(updatedTasks);
    onTaskMoveExternal?.(taskId, targetDay, targetPeriod);
  }, [tasks, onTaskUpdate, onTaskMoveExternal]);

  const {
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  } = useDragAndDrop({
    items: tasks,
    onMove: handleTaskMove,
    onReorder: (newTasks, day, period) => {
      const updatedTasks = tasks.map(task => {
        if (task.day === day && task.period === period) {
          const newTask = newTasks.find(t => t.id === task.id);
          return newTask ? { ...newTask, day, period } : task;
        }
        return task;
      });
      onTaskUpdate(updatedTasks);
    }
  });

  const handleDragStartWrapper = (event) => {
    const task = tasks.find(t => t.id === event.active.id);
    setDraggedTask(task);
    handleDragStart(event);
  };

  const handleDragEndWrapper = (event) => {
    handleDragEnd(event);
    setDraggedTask(null);
  };

  return (
    <div className="h-[calc(100vh-8rem)]">
      <DragDropContext
        items={tasks}
        onDragStart={handleDragStartWrapper}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEndWrapper}
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
              onTasksReorder={(updatedTasks) => {
                onTaskUpdate(updatedTasks);
              }}
              draggedTask={draggedTask}
              activeId={activeId}
            />
          ))}
        </div>
      </DragDropContext>

      {draggedTask && (
        <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 z-50">
          <p className="text-sm text-gray-600">
            Déplacement de : <span className="font-medium">{draggedTask.title}</span>
          </p>
        </div>
      )}
    </div>
  );
};

export default React.memo(WeekView);