import { useState } from 'react';
import AppHeader from './components/AppHeader';
import WeekView from './components/WeekView';
import { TaskProvider } from './contexts/TaskContext';

function App() {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState({ day: null, period: null });

  const handleOpenTaskForm = (day, period) => {
    setSelectedPeriod({ day, period });
    setIsTaskFormOpen(true);
  };

  return (
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
          className="flex-shrink-0" // Empêche l'header de rétrécir
        />

        <main className="flex-1 overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 min-h-full">
            <WeekView onAddTask={handleOpenTaskForm} />
          </div>
        </main>
      </div>
    </TaskProvider>
  );
}

export default App;