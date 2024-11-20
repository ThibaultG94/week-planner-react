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
      <div className="h-full grid grid-rows-4 gap-0.5">
        {slots.map((task, index) => (
          <div key={index} className="relative bg-gray-50">
            {task ? (
              <div className="absolute inset-0 px-1">
                <Task 
                  task={task}
                  onComplete={onTaskComplete}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                />
              </div>
            ) : (
              tasks.length === 0 && index === 0 && (
                <button
                  onClick={onAddTask}
                  className="absolute inset-0 flex items-center justify-center text-gray-400 hover:text-blue-500 hover:bg-gray-100/50 transition-colors"
                >
                  <Plus size={14} className="mr-1" />
                  <span className="text-xs">Ajouter une tâche</span>
                </button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeBlock;