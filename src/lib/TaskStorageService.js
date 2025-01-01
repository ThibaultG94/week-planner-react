import { supabase } from "./supabase";
import { STORAGE_KEY } from "../utils/constants";

class TaskStorageService {
  constructor(user) {
    this.user = user;
  }

  async getTasks() {
    try {
      if (this.user) {
        // Retrieve from Supabase for logged-in users
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", this.user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
      } else {
        // Use localStorage for offline users
        const tasks = localStorage.getItem(STORAGE_KEY);
        return tasks ? JSON.parse(tasks) : [];
      }
    } catch (error) {
      console.error("Error while retrieving tasks:", error);
      throw error;
    }
  }

  async addTask(task) {
    try {
      if (this.user) {
        const { data, error } = await supabase
          .from("tasks")
          .insert([{ ...task, user_id: this.user.id }])
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        // For localStorage, simulate a unique ID
        const newTask = { ...task, id: Date.now() };
        const tasks = await this.getTasks();
        tasks.push(newTask);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        return newTask;
      }
    } catch (error) {
      console.error("Error adding task", error);
      throw error;
    }
  }

  async updateTask(taskId, updates) {
    try {
      if (this.user) {
        const { data, error } = await supabase
          .from("tasks")
          .update(updates)
          .eq("id", taskId)
          .eq("user_id", this.user.id) // Additional safety
          .select()
          .single();

        if (error) throw error;
        return data;
      } else {
        const tasks = await this.getTasks();
        const updatedTasks = tasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTasks));
        return updatedTasks.find((task) => task.id === taskId);
      }
    } catch (error) {
      console.error("Error updating task:", error);
      throw error;
    }
  }

  async deleteTask(taskId) {
    try {
      if (this.user) {
        const { error } = await supabase
          .from("tasks")
          .delete()
          .eq("id", taskId)
          .eq("user_id", this.user.id); // Additional safety

        if (error) throw error;
      } else {
        const tasks = await this.getTasks();
        const filteredTasks = tasks.filter((task) => task.id !== taskId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTasks));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      throw error;
    }
  }

  // Private method for transforming a task for Supabase
  #transformTaskForSupabase(task) {
    return {
      id: task.id,
      title: task.title,
      note: task.note || null,
      location_type: task.location.type,
      day: task.location.day || null,
      period: task.location.period || null,
      position: task.location.position,
      completed: task.completed || false,
      user_id: this.user.id,
    };
  }

  // Data migration method
  async migrateLocalToSupabase() {
    try {
      if (!this.user) {
        throw new Error("User not logged in");
      }

      // 1. Recover local tasks
      const localTasks = await this.getTasks();
      if (localTasks.length === 0) return { success: true, data: [] };

      // 2. Transform tasks
      const transformedTasks = localTasks.map(this.#transformTaskForSupabase);

      // 3. Insert tasks into Supabase
      const { data, error } = await supabase
        .from("tasks")
        .insert(transformedTasks);

      if (error) throw error;

      // 4. If all goes well, empty localStorage
      localStorage.removeItem(STORAGE_KEY);

      return { success: true, data };
    } catch (error) {
      console.error("Error during migration:", error);
      return {
        success: false,
        error: error.message,
      };
    }
  }
}

export default TaskStorageService;
