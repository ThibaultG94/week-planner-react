export async function migrateTasksToSupabase(user, supabase) {
  try {
    // 1. Récupérer les tâches du localStorage et les transformer
    const localTasks = JSON.parse(
      localStorage.getItem("weekplanner-tasks") || "[]"
    );
    const transformedTasks = localTasks.map((task) =>
      transformTaskForSupabase(task, user.id)
    );

    // 2. Insérer les tâches dans Supabase en une seule opération
    const { data, error } = await supabase
      .from("tasks")
      .insert(transformedTasks);

    if (error) {
      throw new Error(`Erreur lors de la migration: ${error.message}`);
    }

    // 3. Si tout s'est bien passé, on peut vider le localStorage
    localStorage.removeItem("weekplanner-tasks");

    return { success: true, data };
  } catch (error) {
    console.error("Erreur durant la migration:", error);
    return {
      success: false,
      error: error.message,
    };
  }
}
