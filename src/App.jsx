import { useState } from "react";
import AppHeader from "./components/AppHeader";
import WeekView from "./components/WeekView";
import { TaskProvider } from "./contexts/TaskContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import SignUpForm from "./components/auth/SignUpForm";
import SignInForm from "./components/auth/SingInForm";
import { supabase } from "./lib/supabase";
import { migrateTasksToSupabase } from "./lib/taskMigration";

function App() {
  const { user } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(null); // 'signin' ou 'signup'
  const [showMigrationDialog, setShowMigrationDialog] = useState(false);
  const [localStorageTasks, setLocalStorageTasks] = useState([]);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState({
    day: null,
    period: null,
  });
  const [isMigrating, setIsMigrating] = useState(false);

  const handleOpenTaskForm = (day, period) => {
    setSelectedPeriod({ day, period });
    setIsTaskFormOpen(true);
  };

  // Dans la fonction App
  async function migrateLocalTasks() {
    // On vérifie qu'on a bien un utilisateur connecté
    if (!user) {
      console.error("Pas d'utilisateur connecté");
      return;
    }

    // On active l'indicateur de chargement
    setIsMigrating(true);

    try {
      // On appelle notre fonction de migration
      const result = await migrateTasksToSupabase(user, supabase);

      if (result.success) {
        // Fermer le dialogue de migration
        setShowMigrationDialog(false);

        // Rafraîchir l'état des tâches
        // Note: il faudra adapter ça selon comment tu gères le chargement des tâches
        // dans ton TaskContext

        // Afficher un message de succès
        alert("Migration réussie !");
      } else {
        // En cas d'erreur, afficher un message
        alert("La migration a échoué : " + result.error);
      }
    } catch (error) {
      console.error("Erreur lors de la migration:", error);
      alert("Une erreur est survenue pendant la migration");
    } finally {
      // Dans tous les cas, on désactive l'indicateur de chargement
      setIsMigrating(false);
    }
  }

  return (
    <AuthProvider>
      <TaskProvider>
        <div className="flex flex-col h-screen">
          <AppHeader
            isFormOpen={isTaskFormOpen}
            onFormOpen={() => {
              setSelectedPeriod({ day: null, period: null });
              setIsTaskFormOpen(true);
            }}
            onFormClose={() => {
              setIsTaskFormOpen(false);
            }}
            selectedPeriod={selectedPeriod}
            setAuthModalOpen={setAuthModalOpen} // Ajout de cette prop
            className="flex-shrink-0"
          />
          {authModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
                {authModalOpen === "signup" ? (
                  <SignUpForm onClose={() => setAuthModalOpen(null)} />
                ) : (
                  <SignInForm onClose={() => setAuthModalOpen(null)} />
                )}
              </div>
            </div>
          )}
          {/* Bannière d'avertissement si non connecté */}
          {!user && (
            <div className="bg-yellow-50 p-4 border-b border-yellow-100">
              <div className="flex justify-between items-center max-w-7xl mx-auto">
                <p className="text-yellow-700">
                  Vos tâches sont actuellement stockées localement.
                  <span className="font-medium">
                    {" "}
                    Connectez-vous pour les sauvegarder en ligne !
                  </span>
                </p>
                <button
                  onClick={() => setAuthModalOpen("signup")}
                  className="bg-yellow-100 hover:bg-yellow-200 px-4 py-2 rounded-md"
                >
                  S'inscrire gratuitement
                </button>
              </div>
            </div>
          )}

          {/* Dialog de migration si nécessaire */}
          {showMigrationDialog && localStorageTasks.length > 0 && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
                <h3 className="text-lg font-semibold mb-4">
                  Données locales détectées
                </h3>
                <p className="mb-4">
                  Nous avons détecté {localStorageTasks.length} tâches stockées
                  localement.
                </p>
                <div className="flex gap-2 justify-end">
                  <button
                    onClick={migrateLocalTasks}
                    disabled={isMigrating}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
                  >
                    {isMigrating
                      ? "Migration en cours..."
                      : "Transférer vers mon compte"}
                  </button>
                  <button
                    onClick={clearLocalTasks}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Supprimer les données locales
                  </button>
                </div>
              </div>
            </div>
          )}

          <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-full">
              <WeekView onAddTask={handleOpenTaskForm} />
            </div>
          </main>
        </div>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
