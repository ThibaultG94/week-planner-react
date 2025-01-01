import { useState } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import { TaskProvider } from "./contexts/TaskContext";
import AppHeader from "./components/AppHeader";
import WeekView from "./components/WeekView";
import SignUpForm from "./components/auth/SignUpForm";
import SignInForm from "./components/auth/SingInForm";
import Modal from "./components/common/Modal";
import NotificationBanner from "./components/common/NotificationBanner";

function App() {
  // States to manage the interface
  const [authModalType, setAuthModalType] = useState(null); // 'signin' or 'signup'
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState({
    day: null,
    period: null,
  });

  // Function to open the task form with a specific period
  const handleOpenTaskForm = (day, period) => {
    setSelectedPeriod({ day, period });
    setIsTaskFormOpen(true);
  };

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
            setAuthModalOpen={setAuthModalType}
            className="flex-shrink-0"
          />

          {/* Modal for authentication */}
          <Modal isOpen={authModalType === "signup"}>
            <SignUpForm
              onClose={() => setAuthModalType(null)}
              onSignInClick={() => setAuthModalType("signin")}
            />
          </Modal>

          <Modal isOpen={authModalType === "signin"}>
            <SignInForm
              onClose={() => setAuthModalType(null)}
              onSignUpClick={() => setAuthModalType("signup")}
            />
          </Modal>

          {/* Warning banner for local tasks */}
          <NotificationBanner />

          {/* Main content */}
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
