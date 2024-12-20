import {
  createContext,
  useContext,
  useCallback,
  useState,
  useEffect,
  useMemo,
} from "react";
import { useAuth } from "./AuthContext";
import TaskStorageService from "../lib/TaskStorageService";

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Création du service avec mémoïsation
  const storageService = useMemo(() => new TaskStorageService(user), [user]);

  // Chargement initial des tâches
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const loadedTasks = await storageService.getTasks();
        setTasks(loadedTasks);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, [storageService]);

  const addTask = useCallback(
    async (newTask, locationType = "week") => {
      try {
        const addedTask = await storageService.addTask({
          ...newTask,
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
                  position: tasks.filter((t) => t.location.type === "parking")
                    .length,
                },
        });

        setTasks((currentTasks) => [...currentTasks, addedTask]);
      } catch (err) {
        setError(err);
      }
    },
    [tasks, storageService]
  );

  const editTask = useCallback((task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  }, []);

  const updateTask = useCallback(
    async (taskId, updates) => {
      try {
        // Mise à jour optimiste
        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          )
        );

        // Appel API
        await storageService.updateTask(taskId, updates);
        setIsFormOpen(false);
        setEditingTask(null);
      } catch (err) {
        setError(err);
        // Annuler la mise à jour optimiste en rechargeant les tâches
        const freshTasks = await storageService.getTasks();
        setTasks(freshTasks);
      }
    },
    [storageService]
  );

  const deleteTask = useCallback(
    async (taskId) => {
      try {
        // Mise à jour optimiste
        const previousTasks = [...tasks];
        setTasks((currentTasks) =>
          currentTasks.filter((task) => task.id !== taskId)
        );

        // Appel API
        await storageService.deleteTask(taskId);
      } catch (err) {
        setError(err);
        // Restaurer l'état précédent en cas d'erreur
        setTasks(previousTasks);
      }
    },
    [tasks, storageService]
  );

  const toggleTaskComplete = useCallback(
    async (taskId) => {
      try {
        const task = tasks.find((t) => t.id === taskId);
        if (!task) return;

        // Mise à jour optimiste
        setTasks((currentTasks) =>
          currentTasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          )
        );

        // Appel API
        await storageService.updateTask(taskId, { completed: !task.completed });
      } catch (err) {
        setError(err);
        // Restaurer l'état précédent en rechargeant les tâches
        const freshTasks = await storageService.getTasks();
        setTasks(freshTasks);
      }
    },
    [tasks, storageService]
  );

  const moveTask = useCallback(
    async (taskId, newLocation) => {
      try {
        // Mise à jour optimiste
        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === taskId ? { ...task, location: newLocation } : task
          )
        );

        // Appel API
        await storageService.updateTask(taskId, { location: newLocation });
      } catch (err) {
        setError(err);
        // Restaurer l'état précédent en rechargeant les tâches
        const freshTasks = await storageService.getTasks();
        setTasks(freshTasks);
      }
    },
    [storageService]
  );

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
    loading,
    error,

    // Filtres
    parkedTasks: tasks.filter((task) => task.location.type === "parking"),
    weekTasks: tasks.filter((task) => task.location.type === "week"),

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

export default TaskContext;
