import { createContext, useContext, useCallback, useState } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import { STORAGE_KEY } from "../utils/constants";

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEY, []);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const getParkedTasks = useCallback(() => {
    return tasks.filter((task) => task.location.type === "parking");
  }, [tasks]);

  const getWeekTasks = useCallback(() => {
    return tasks.filter((task) => task.location.type === "week");
  }, [tasks]);

  const addTask = useCallback(
    (newTask, locationType = "week") => {
      const completeTask = {
        ...newTask,
        id: Date.now(),
        completed: false,
        location:
          locationType === "week"
            ? {
                type: "week",
                day: newTask.day,
                period: newTask.period,
                position: tasks.filter(
                  (t) =>
                    t.location.type === "week" &&
                    t.location.day === newTask.day &&
                    t.location.period === newTask.period
                ).length,
              }
            : {
                type: "parking",
                position: getParkedTasks().length,
              },
      };
      setTasks((currentTasks) => [...currentTasks, completeTask]);
    },
    [tasks, getParkedTasks]
  );

  const editTask = useCallback((task) => {
    console.log("Editing task:", task);
    setEditingTask(task);
    setIsFormOpen(true);
  }, []);

  const updateTask = useCallback(
    (taskId, updates) => {
      console.log("Updating task:", taskId, updates);
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        )
      );
      setIsFormOpen(false);
      setEditingTask(null);
    },
    [setTasks]
  );

  const deleteTask = useCallback(
    (taskId) => {
      setTasks((currentTasks) => {
        const updatedTasks = currentTasks.filter((task) => task.id !== taskId);
        // Réorganiser les positions des tâches restantes
        const taskToDelete = currentTasks.find((t) => t.id === taskId);
        if (taskToDelete) {
          const samePeriodTasks = updatedTasks
            .filter(
              (t) =>
                t.day === taskToDelete.day && t.period === taskToDelete.period
            )
            .sort((a, b) => a.position - b.position);

          samePeriodTasks.forEach((task, index) => {
            task.position = index;
          });
        }
        return updatedTasks;
      });
    },
    [setTasks]
  );

  const toggleTaskComplete = useCallback(
    (taskId) => {
      setTasks((currentTasks) =>
        currentTasks.map((task) =>
          task.id === taskId ? { ...task, completed: !task.completed } : task
        )
      );
    },
    [setTasks]
  );

  const moveTask = useCallback((taskId, newLocation) => {
    setTasks((currentTasks) => {
      const taskToMove = currentTasks.find((task) => task.id === taskId);
      if (!taskToMove) return currentTasks;

      // Ne pas recalculer la position mais utiliser celle fournie
      return currentTasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            location: newLocation, // Utiliser directement la nouvelle location avec sa position
          };
        }
        return task;
      });
    });
  }, []);

  const reorderTasks = useCallback((locationData) => {
    setTasks((currentTasks) => {
      const tasksInLocation = currentTasks.filter((task) => {
        if (locationData.type === "parking") {
          return task.location.type === "parking";
        }
        return (
          task.location.type === "week" &&
          task.location.day === locationData.day &&
          task.location.period === locationData.period
        );
      });

      // Réorganiser les positions
      tasksInLocation.sort((a, b) => a.location.position - b.location.position);
      const updatedTasks = tasksInLocation.map((task, index) => ({
        ...task,
        location: {
          ...task.location,
          position: index,
        },
      }));

      // Mettre à jour uniquement les tâches concernées
      return currentTasks.map((task) => {
        const updatedTask = updatedTasks.find((t) => t.id === task.id);
        return updatedTask || task;
      });
    });
  }, []);

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

    parkedTasks: getParkedTasks(),
    weekTasks: getWeekTasks(),

    // Actions tâches
    addTask,
    editTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    moveTask,

    // Actions formulaire
    openTaskForm,
    closeTaskForm,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === null) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}
