import { Plus } from 'lucide-react';
import Task from '../Task';

const TimeBlock = ({ period, tasks = [], onAddTask, onDrop, onTaskComplete }) => {
  const maxTasks = 4;
  const availableSlots = maxTasks - tasks.length;

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue-50');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('bg-blue-50');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-blue-50');
    if (availableSlots > 0) {
      onDrop(e, period);
    }
  };

  return (
    <div 
      className="p-4 bg-white border border-gray-200 rounded-lg"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h3 className="text-sm font-medium text-gray-600 mb-3">{period}</h3>
      
      <div className="space-y-2">
        {tasks.map((task) => (
          <Task 
            key={task.id}
            task={task}
            onComplete={onTaskComplete}
          />
        ))}
        
        {availableSlots > 0 && (
          <button
            onClick={() => onAddTask(period)}
            className="w-full h-12 border-2 border-dashed border-gray-200 rounded-md flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-colors"
          >
            <Plus size={20} />
            <span className="ml-2 text-sm">Ajouter une tâche</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TimeBlock;