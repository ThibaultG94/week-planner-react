import { Calendar, Plus, X } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import TaskForm from "./TaskForm";
import { useTaskContext } from "../contexts/TaskContext";

const AppHeader = ({ setAuthModalOpen }) => {
  // Récupérer l'état d'authentification et les méthodes
  const { user, signOut } = useAuth();

  const {
    isFormOpen,
    openTaskForm,
    closeTaskForm,
    addTask,
    updateTask,
    editingTask,
  } = useTaskContext();

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto h-14 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-gray-600" />
              <h1 className="text-lg font-semibold text-gray-900">
                WeekPlanner
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {user ? (
                <button
                  onClick={signOut}
                  className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                >
                  Se déconnecter
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setAuthModalOpen("signin")}
                    className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    Se connecter
                  </button>
                  <button
                    onClick={() => setAuthModalOpen("signup")}
                    className="px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                  >
                    S'inscrire
                  </button>
                </>
              )}

              <button
                onClick={openTaskForm}
                className="inline-flex items-center px-3 py-1.5 text-sm border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <Plus size={16} className="mr-1" />
                Nouvelle tâche
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Modal de création/édition de tâche */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingTask ? "Modifier la tâche" : "Nouvelle tâche"}
              </h2>
              <button
                onClick={closeTaskForm}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <TaskForm
                initialTask={editingTask}
                onSubmit={async (taskData) => {
                  if (editingTask) {
                    await updateTask(editingTask.id, taskData);
                  } else {
                    await addTask(taskData);
                  }
                  closeTaskForm();
                }}
                onCancel={closeTaskForm}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppHeader;
