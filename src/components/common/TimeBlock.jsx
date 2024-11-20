import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

const TimeBlock = ({ 
  period, 
  tasks = [], 
  onAddTask,
  containerId,
  onTaskComplete,
  onDeleteTask,
  onEditTask,
  activeId,
  maxTasks = 4 
}) => {
  // Structure de base : 4 emplacements
  const slots = Array(maxTasks).fill(null).map((_, index) => {
    return tasks[index] || null;
  });

  return (
    <div className="h-full pt-7">
      {/* Grille de 4 emplacements avec hauteur adaptative */}
      <div className="h-full grid grid-rows-4 gap-1">
        {slots.map((task, index) => (
          <div 
            key={index} 
            className={`relative h-full min-h-[60px] rounded ${
              !task ? 'border-2 border-dashed border-gray-200' : ''
            }`}
          >
            {/* Tâche existante avec drag & drop */}
            {task && (
              <div className="absolute inset-0">
                <TaskCard
                  task={task}
                  onComplete={onTaskComplete}
                  onDelete={onDeleteTask}
                  onEdit={onEditTask}
                  containerId={containerId}
                  isDragging={task.id === activeId}
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

            {/* Indicateur de zone de drop */}
            {activeId && !task && (
              <div className="absolute inset-0 rounded border-2 border-blue-400 border-dashed opacity-50" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimeBlock;