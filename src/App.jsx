import { useState, useCallback } from 'react';
import WeekView from './components/WeekView';
import TaskForm from './components/TaskForm';
import useLocalStorage from './hooks/useLocalStorage';
import { STORAGE_KEY } from './utils/constants';
import AppHeader from './components/AppHeader';

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
      showFeedback('Tâche mise à jour avec succès !');
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <AppHeader 
        onAddTask={handleAddTask} 
        editingTask={editingTask}
        onEditComplete={() => setEditingTask(null)} 
      />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {feedback.message && (
          <div className={`mb-4 p-4 rounded-md ${
            feedback.type === 'warning' ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'
          }`}>
            {feedback.message}
          </div>
        )}
        
        <TaskForm 
          onSubmit={handleAddTask}
          initialTask={editingTask}
          onCancel={editingTask ? () => setEditingTask(null) : null}
        />
        
        <WeekView 
          tasks={tasks}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
        />
      </main>
    </div>
  );
}

export default App;