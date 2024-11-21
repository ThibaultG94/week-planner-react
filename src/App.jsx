import { useState } from 'react';
import AppHeader from './components/AppHeader';
import WeekView from './components/WeekView';
import { TaskProvider } from './contexts/TaskContext';

function App() {
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState({ day: null, period: null });
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const showFeedback = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
  };

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

        {feedback.message && (
          <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${
            feedback.type === 'warning' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'
          }`}>
            {feedback.message}
          </div>
        )}

        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <WeekView onAddTask={handleOpenTaskForm} />
        </main>
      </div>
    </TaskProvider>
  );
}

export default App;