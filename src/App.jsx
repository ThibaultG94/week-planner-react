import { useState } from 'react';
import AppHeader from './components/AppHeader';
import WeekView from './components/WeekView';
import { TaskProvider } from './contexts/TaskContext';

function App() {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState({ day: null, period: null });

  // Nouveau gestionnaire pour ouvrir le formulaire depuis les blocs
  const handleOpenTaskForm = (day, period) => {
    setSelectedPeriod({ day, period });
    setIsTaskFormOpen(true);
  };

  return (
    <TaskProvider>
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
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
        />

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <WeekView onAddTask={handleOpenTaskForm} />
        </main>
      </div>
    </TaskProvider>
  );
}

export default App;