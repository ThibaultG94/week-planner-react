import { createContext, useContext, useCallback, useState } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';
import { STORAGE_KEY } from '../utils/constants';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEY, []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const addTask = useCallback((newTask) => {
    const completeTask = {
      ...newTask,
      id: Date.now(),
      completed: false,
      position: tasks.filter(t => t.day === newTask.day && t.period === newTask.period).length
    };
    setTasks(currentTasks => [...currentTasks, completeTask]);
    setIsFormOpen(false);
    setEditingTask(null);
  }, [setTasks, tasks]);

  const editTask = useCallback((task) => {
    console.log('Editing task:', task);
    setEditingTask(task);
    setIsFormOpen(true);
  }, []);

  const updateTask = useCallback((taskId, updates) => {
    console.log('Updating task:', taskId, updates);
    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    );
    setIsFormOpen(false);
    setEditingTask(null);
  }, [setTasks]);

  const deleteTask = useCallback((taskId) => {
    setTasks(currentTasks => {
      const updatedTasks = currentTasks.filter(task => task.id !== taskId);
      // Réorganiser les positions des tâches restantes
      const taskToDelete = currentTasks.find(t => t.id === taskId);
      if (taskToDelete) {
        const samePeriodTasks = updatedTasks
          .filter(t => t.day === taskToDelete.day && t.period === taskToDelete.period)
          .sort((a, b) => a.position - b.position);
        
        samePeriodTasks.forEach((task, index) => {
          task.position = index;
        });
      }
      return updatedTasks;
    });
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

  // Gestion du formulaire
  const openTaskForm = useCallback(() => {
    setEditingTask(null);
    setIsFormOpen(true);
  }, []);

  const closeTaskForm = useCallback(() => {
    setIsFormOpen(false);
    setEditingTask(null);
  }, []);

  const value = {
    // État
    tasks,
    isFormOpen,
    editingTask,
    
    // Actions tâches
    addTask,
    editTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    moveTask,
    
    // Actions formulaire
    openTaskForm,
    closeTaskForm
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