import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, Edit, MessageSquare } from 'lucide-react';
import AnimatedTransition from './AnimatedTransition';

const TaskCard = ({ 
  task, 
  onDelete, 
  onEdit, 
  onComplete,
  containerId,
  isDragging = false
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ 
    id: task.id,
    data: {
      type: 'Task',
      task,
      containerId
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isSortableDragging ? 0.5 : 1,
    height: '100%', // S'adapte à la hauteur du conteneur parent
  };

  return (
    <AnimatedTransition>
      <div
        ref={setNodeRef}
        style={style}
        className="group relative flex flex-col h-full bg-white rounded-md border border-gray-200 p-3 hover:shadow-sm transition-all duration-200"
        {...attributes}
        {...listeners}
      >
        <div className="flex items-start gap-3 h-full">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onComplete(task.id)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          
          <div className="flex-1 flex flex-col h-full">
            <h3 className={`text-sm font-medium ${
              task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
            }`}>
              {task.title}
            </h3>
            
            {task.note && (
              <button
                onClick={() => {}} // Toggle notes visibility
                className="mt-1 flex items-center text-xs text-gray-500 hover:text-gray-700"
              >
                <MessageSquare size={12} className="mr-1" />
                Notes
              </button>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className="text-gray-400 hover:text-blue-500 transition-colors"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </AnimatedTransition>
  );
};

export default React.memo(TaskCard);