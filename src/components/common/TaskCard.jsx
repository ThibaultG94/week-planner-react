import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, Edit, MessageSquare } from 'lucide-react';

const TaskCard = ({ 
  task, 
  onDelete, 
  onEdit, 
  onComplete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform
  } = useDraggable({
    id: task.id,
    data: {
      task,
      type: 'task'
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    touchAction: 'none',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative w-full h-full bg-white rounded-md border border-gray-200 p-2 hover:shadow-sm transition-all duration-200"
      {...listeners}
      {...attributes}
    >
      <div className="flex items-start gap-2 h-full max-h-[60px]">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onComplete(task.id)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 shrink-0"
        />
          
        <div className="flex-1 flex flex-col min-w-0">
          <h3 className={`text-sm font-medium line-clamp-2 w-full ${
            task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
          }`}>
            {task.title}
          </h3>
            
          {task.note && (
            <div className="mt-auto flex items-center text-xs text-gray-500">
              <MessageSquare size={12} className="shrink-0 mr-1" />
              <span className="truncate">Notes</span>
            </div>
          )}
        </div>

        {/* Boutons positionnés en absolute avec un fond flouté */}
        <div className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="absolute inset-0 -m-1 bg-white/80 backdrop-blur-sm rounded-sm"></div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(task);
            }}
            className="p-1 text-gray-400 hover:text-blue-500 relative"
          >
            <Edit size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            className="p-1 text-gray-400 hover:text-red-500 relative"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TaskCard);