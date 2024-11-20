import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import TaskCard from './TaskCard';

const TaskSlot = ({ 
  id, 
  task, 
  onAddTask, 
  onTaskComplete, 
  onDeleteTask, 
  onEditTask 
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div 
      ref={setNodeRef}
      className={`relative h-full min-h-[60px] rounded 
        ${!task ? 'border-2 border-dashed border-gray-200' : ''} 
        ${isOver ? 'bg-blue-50 border-blue-200' : ''}`}
    >
      {task && (
        <TaskCard
          task={task}
          onComplete={onTaskComplete}
          onDelete={onDeleteTask}
          onEdit={onEditTask}
        />
      )}
      
      {!task && (
        <button
          onClick={onAddTask}
          className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 text-gray-400 hover:text-blue-500 hover:bg-gray-50/80 rounded transition-all duration-200"
        >
          <Plus size={14} className="mr-1" />
          <span className="text-xs">Ajouter une tâche</span>
        </button>
      )}
    </div>
  );
};

export default React.memo(TaskSlot);