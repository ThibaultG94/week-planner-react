import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

const DroppableSlot = ({
  id,
  day,
  period,
  position,
  task,
  onAddTask,
  onTaskComplete,
  onDeleteTask,
  onEditTask,
  isActive
}) => {
  // Créer l'ID dans le bon ordre : jour-période-position
  const slotId = `${day}-${period}-${position}`;
  
  const { setNodeRef, isOver } = useDroppable({
    id: slotId,
    data: {
      type: 'slot',
      day,
      period,
      position,
      accepts: ['task']
    }
  });

  return (
    <div 
      ref={setNodeRef}
      className={`relative h-full min-h-[60px] rounded-md transition-all duration-200
        ${!task ? 'border-2 border-dashed border-gray-200' : ''}
        ${isOver ? 'bg-blue-50 border-blue-200' : ''}
        ${isActive ? 'opacity-50' : ''}`}
    >
      {task && (
        <div className="absolute inset-0">
          <TaskCard
            task={task}
            onComplete={onTaskComplete}
            onDelete={onDeleteTask}
            onEdit={onEditTask}
          />
        </div>
      )}

      {!task && !isOver && (
        <button
          onClick={onAddTask}
          className="absolute inset-0 flex items-center justify-center opacity-0 
            hover:opacity-100 text-gray-400 hover:text-blue-500 
            hover:bg-gray-50/80 rounded-md transition-all duration-200"
        >
          <Plus size={16} className="mr-1" />
          <span className="text-xs">Ajouter une tâche</span>
        </button>
      )}
    </div>
  );
};

export default React.memo(DroppableSlot);