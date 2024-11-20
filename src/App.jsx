import { useState, useCallback } from 'react';
import AppHeader from './components/AppHeader';
import WeekView from './components/WeekView';
import useLocalStorage from './hooks/useLocalStorage';
import { STORAGE_KEY } from './utils/constants';

function App() {
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEY, []);
  const [editingTask, setEditingTask] = useState(null);
  const [feedback, setFeedback] = useState({ message: '', type: '' });

  const showFeedback = (message, type = 'success') => {
    setFeedback({ message, type });
    setTimeout(() => setFeedback({ message: '', type: '' }), 3000);
  };

  const handleAddTask = useCallback((newTask) => {
    if (editingTask) {
      setTasks(currentTasks => 
        currentTasks.map(task => task.id === newTask.id ? newTask : task)
      );
      setEditingTask(null);
      showFeedback('Tâche mise à jour !');
    } else {
      setTasks(currentTasks => [...currentTasks, newTask]);
      showFeedback('Nouvelle tâche ajoutée !');
    }
  }, [editingTask, setTasks]);

  const handleDeleteTask = useCallback((taskId) => {
    setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
    showFeedback('Tâche supprimée !', 'warning');
  }, [setTasks]);

  const handleEditTask = useCallback((task) => {
    setEditingTask(task);
  }, []);

  const handleTasksReorder = useCallback((updatedTasks) => {
    setTasks(updatedTasks);
  }, [setTasks]);

  const handleTaskComplete = useCallback((taskId) => {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === taskId
          ? { ...task, completed: !task.completed }
          : task
      )
    );
    showFeedback('Statut de la tâche mis à jour !');
  }, [setTasks]);

  const handleTaskMove = useCallback((taskId, targetDay, targetPeriod) => {
    setTasks(currentTasks =>
      currentTasks.map(task =>
        task.id === taskId
          ? { ...task, day: targetDay, period: targetPeriod }
          : task
      )
    );
    showFeedback('Tâche déplacée !');
  }, [setTasks]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <AppHeader 
        onAddTask={handleAddTask}
        editingTask={editingTask}
        onEditComplete={() => setEditingTask(null)}
      />

      {feedback.message && (
        <div className={`fixed top-4 right-4 p-4 rounded-md shadow-lg ${
          feedback.type === 'warning' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'
        }`}>
          {feedback.message}
        </div>
      )}

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <WeekView 
          tasks={tasks}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
          onTaskComplete={handleTaskComplete}
          onTaskMove={handleTaskMove}
          onTasksReorder={handleTasksReorder}
        />
      </main>
    </div>
  );
}

export default App;