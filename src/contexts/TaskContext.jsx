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

  // Service creation with memoization
  const storageService = useMemo(() => new TaskStorageService(user), [user]);

  // Initial task loading
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
        // Update
        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === taskId ? { ...task, ...updates } : task
          )
        );

        // API call
        await storageService.updateTask(taskId, updates);
        setIsFormOpen(false);
        setEditingTask(null);
      } catch (err) {
        setError(err);
        // Cancel update by reloading tasks
        const freshTasks = await storageService.getTasks();
        setTasks(freshTasks);
      }
    },
    [storageService]
  );

  const deleteTask = useCallback(
    async (taskId) => {
      try {
        // Update
        const previousTasks = [...tasks];
        setTasks((currentTasks) =>
          currentTasks.filter((task) => task.id !== taskId)
        );

        // API call
        await storageService.deleteTask(taskId);
      } catch (err) {
        setError(err);
        // Restore previous state in case of error
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

        // Update
        setTasks((currentTasks) =>
          currentTasks.map((t) =>
            t.id === taskId ? { ...t, completed: !t.completed } : t
          )
        );

        // API call
        await storageService.updateTask(taskId, { completed: !task.completed });
      } catch (err) {
        setError(err);
        // Restore previous state by reloading tasks
        const freshTasks = await storageService.getTasks();
        setTasks(freshTasks);
      }
    },
    [tasks, storageService]
  );

  const moveTask = useCallback(
    async (taskId, newLocation) => {
      try {
        // Update
        setTasks((currentTasks) =>
          currentTasks.map((task) =>
            task.id === taskId ? { ...task, location: newLocation } : task
          )
        );

        // API call
        await storageService.updateTask(taskId, { location: newLocation });
      } catch (err) {
        setError(err);
        // Restore previous state by reloading tasks
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
    // Status
    tasks,
    isFormOpen,
    editingTask,
    loading,
    error,

    // Filters
    parkedTasks: tasks.filter((task) => task.location.type === "parking"),
    weekTasks: tasks.filter((task) => task.location.type === "week"),

    // Task actions
    addTask,
    editTask,
    updateTask,
    deleteTask,
    toggleTaskComplete,
    moveTask,

    // Form actions
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
