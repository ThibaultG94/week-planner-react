import { useState } from 'react';
import WeekView from './components/WeekView';
import TaskForm from './components/TaskForm';
import useLocalStorage from './hooks/useLocalStorage';
import { STORAGE_KEY } from './utils/constants';
import { Calendar } from 'lucide-react';

function App() {
  const [tasks, setTasks] = useLocalStorage(STORAGE_KEY, []);
  const [editingTask, setEditingTask] = useState(null);

  const handleAddTask = (newTask) => {
    if (editingTask) {
      setTasks(tasks.map(task => 
        task.id === newTask.id ? newTask : task
      ));
      setEditingTask(null);
    } else {
      setTasks([...tasks, newTask]);
    }
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">WeekPlanner</h1>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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