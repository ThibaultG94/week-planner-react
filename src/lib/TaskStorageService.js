import { supabase } from "./supabase";
import { STORAGE_KEY } from "../utils/constants";

class TaskStorageService {
  constructor(user) {
    this.user = user;
  }

  async getTasks() {
    try {
      if (this.user) {
        // Récupérer depuis Supabase pour les utilisateurs connectés
        const { data, error } = await supabase
          .from("tasks")
          .select("*")
          .eq("user_id", this.user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        return data;
      } else {
        // Utiliser localStorage pour les utilisateurs non connectés
        const tasks = localStorage.getItem(STORAGE_KEY);
        return tasks ? JSON.parse(tasks) : [];
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des tâches:", error);
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
        // Pour localStorage, simuler un ID unique
        const newTask = { ...task, id: Date.now() };
        const tasks = await this.getTasks();
        tasks.push(newTask);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        return newTask;
      }
    } catch (error) {
      console.error("Erreur lors de l'ajout de la tâche:", error);
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
          .eq("user_id", this.user.id) // Sécurité supplémentaire
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
      console.error("Erreur lors de la mise à jour de la tâche:", error);
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
          .eq("user_id", this.user.id); // Sécurité supplémentaire

        if (error) throw error;
      } else {
        const tasks = await this.getTasks();
        const filteredTasks = tasks.filter((task) => task.id !== taskId);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTasks));
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de la tâche:", error);
      throw error;
    }
  }
}

export default TaskStorageService;
