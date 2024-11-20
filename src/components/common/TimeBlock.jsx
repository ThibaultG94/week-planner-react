import { Plus } from 'lucide-react';
import Task from '../Task';

const TimeBlock = ({ 
  period, 
  tasks = [], 
  onAddTask, 
  onDrop, 
  onTaskComplete,
  onDeleteTask,
  onEditTask,
  maxTasks = 4 
}) => {
  const handleDrop = (e) => {
    e.preventDefault();
    const draggedTaskId = e.dataTransfer.getData('text/plain');
    if (!draggedTaskId) return;
    onDrop?.(e, draggedTaskId);
  };

  // Structure de base : 4 emplacements
  const slots = Array(4).fill(null).map((_, index) => {
    return tasks[index] || null;
  });

  return (
    <div 
      className="h-full pt-6"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {/* Grille de 4 emplacements */}
      <div className="h-full grid grid-rows-4 gap-1">
        {slots.map((task, index) => (
          <div 
            key={index} 
            className={`relative rounded ${
              !task ? 'border-2 border-dashed border-gray-200' : ''
            }`}
          >
            {/* Tâche existante */}
            {task && (
              <div className="absolute inset-0">
                <Task 
                  task={task}
                  onComplete={onTaskComplete}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                />
              </div>
            )}
            
            {/* Overlay "Ajouter une tâche" sur les emplacements vides */}
            {!task && (
              <button
                onClick={() => onAddTask(period, index)}
                className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 text-gray-400 hover:text-blue-500 hover:bg-gray-50/80 rounded transition-all duration-200"
              >
                <Plus size={14} className="mr-1" />
                <span className="text-xs">Ajouter une tâche</span>
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeBlock;