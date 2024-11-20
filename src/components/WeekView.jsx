import React, { useState } from 'react';
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
  onAddTask  // S'assurer que cette prop est bien reçue
}) => {
  const [draggedTask, setDraggedTask] = useState(null);

  const {
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  } = useDragAndDrop({
    items: tasks,
    onReorder: (newTasks, containerId) => {
      const [period, day] = containerId.split('-');
      const updatedTasks = tasks.map(task => {
        if (task.day !== day || task.period !== period) return task;
        const newTask = newTasks.find(t => t.id === task.id);
        return newTask || task;
      });
      onTaskUpdate(updatedTasks);
    },
    onMove: ({ taskId, destinationContainer }) => {
      const [newPeriod, newDay] = destinationContainer.split('-');
      const taskToMove = tasks.find(t => t.id === Number(taskId));
      
      if (taskToMove) {
        const tasksInDestination = tasks.filter(
          t => t.day === newDay && t.period === newPeriod
        );

        if (tasksInDestination.length >= 4) {
          console.warn('Impossible de déplacer : période pleine');
          return;
        }

        const updatedTasks = tasks.map(task => {
          if (task.id === Number(taskId)) {
            return {
              ...task,
              day: newDay,
              period: newPeriod,
              position: tasksInDestination.length
            };
          }
          return task;
        });

        onTaskUpdate(updatedTasks);
        onTaskMoveExternal?.(taskId, newDay, newPeriod);
      }
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
              onAddTask={onAddTask} // Passer la prop ici
              onTaskMove={(taskId, targetDay, targetPeriod) => {
                const taskToMove = tasks.find(t => t.id === taskId);
                if (taskToMove && targetDay && targetPeriod) {
                  onTaskMoveExternal?.(taskId, targetDay, targetPeriod);
                }
              }}
              onTasksReorder={(updatedTasks) => {
                onTaskUpdate(tasks.map(task => {
                  const updatedTask = updatedTasks.find(t => t.id === task.id);
                  return updatedTask || task;
                }));
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