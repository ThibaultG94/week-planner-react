import { createContext, useContext, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEY } from '../utils/constants';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEY, []);

  const addTask = useCallback((newTask) => {
    const completeTask = {
      ...newTask,
      id: Date.now(),
      completed: false,
      position: tasks.filter(t => t.day === newTask.day && t.period === newTask.period).length
    };
    setTasks(currentTasks => [...currentTasks, completeTask]);
  }, [setTasks, tasks]);

  const updateTask = useCallback((taskId, updates) => {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
  }, [setTasks]);

  const deleteTask = useCallback((taskId) => {
    setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
  }, [setTasks]);

  const toggleTaskComplete = useCallback((taskId) => {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  }, [setTasks]);

  const moveTask = useCallback((taskId, targetDay, targetPeriod, targetPosition) => {
    setTasks(currentTasks => {
      const taskToMove = currentTasks.find(task => task.id === taskId);
      if (!taskToMove) return currentTasks;

      return currentTasks.map(task => {
        if (task.id === taskId) {
          return {
            ...task,
            day: targetDay,
            period: targetPeriod,
            position: targetPosition
          };
        }
        return task;
      });
    });
  }, [setTasks]);

  const reorderTasks = useCallback((updatedTasks) => {
    setTasks(currentTasks => {
      const newTasks = [...currentTasks];
      updatedTasks.forEach(update => {
        const index = newTasks.findIndex(task => task.id === update.id);
        if (index !== -1) {
          newTasks[index] = { ...newTasks[index], ...update };
        }
      });
      return newTasks;
    });
  }, [setTasks]);

  const value = {
    tasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    moveTask,
    reorderTasks
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === null) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}