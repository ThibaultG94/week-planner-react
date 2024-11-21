import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, Edit, MessageSquare } from 'lucide-react';
import { useTaskContext } from '../../contexts/TaskContext';
import DeleteConfirmation from './DeleteConfirmation';

const TaskCard = ({ task, isDragging }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deleteTask, toggleTaskComplete, editTask } = useTaskContext();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform
  } = useDraggable({
    id: task.id,
    data: {
      type: 'task',
      task
    }
  });

  const style = transform ? {
    transform: CSS.Transform.toString(transform),
    touchAction: 'none',
  } : { touchAction: 'none' };

  // Gestionnaire d'événements amélioré pour arrêter complètement la propagation
  const handleActionClick = (e, action) => {
    e.preventDefault();
    e.stopPropagation();
    // Désactiver tous les événements liés au drag
    if (listeners.onMouseDown) {
      e.target.removeEventListener('mousedown', listeners.onMouseDown);
    }
    if (listeners.onTouchStart) {
      e.target.removeEventListener('touchstart', listeners.onTouchStart);
    }
    action();
  };

  // Version simplifiée pour l'overlay de drag
  if (isDragging) {
    return (
      <div className="w-full h-full bg-white rounded-md border border-gray-200 shadow-md p-2">
        <div className="flex items-start gap-2 h-full">
          <h3 className="text-sm font-medium line-clamp-2 text-gray-900">
            {task.title}
          </h3>
          {task.note && (
            <div className="mt-auto flex items-center text-xs text-gray-500">
              <MessageSquare size={12} className="shrink-0 mr-1" />
              <span className="truncate">Notes</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className="group relative w-full h-full bg-white rounded-md border border-gray-200 p-2 hover:shadow-sm transition-all duration-200"
        {...attributes}
        {...listeners}
      >
        <div className="flex items-start gap-2 h-full max-h-[60px]">
          {/* Checkbox zone avec gestion des événements améliorée */}
          <div 
            onClick={(e) => handleActionClick(e, () => toggleTaskComplete(task.id))}
            className="relative"
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => {}} // Géré par le onClick parent
              className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 shrink-0 cursor-pointer"
            />
            <div className="absolute inset-0 w-6 h-6 -m-1 cursor-pointer" />
          </div>
          
          {/* Contenu */}
          <div className="flex-1 flex flex-col min-w-0">
            <h3 className={`text-sm font-medium line-clamp-2 w-full transition-all duration-200 ${
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

          {/* Boutons d'action avec gestion des événements améliorée */}
          <div 
            className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="absolute inset-0 -m-1 bg-white/80 backdrop-blur-sm rounded-sm" />
            <div className="relative flex gap-1">
              <button
                onClick={(e) => handleActionClick(e, () => editTask(task))}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="p-1 text-gray-400 hover:text-blue-500 z-50"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={(e) => handleActionClick(e, () => setShowDeleteConfirm(true))}
                onMouseDown={(e) => e.stopPropagation()}
                onTouchStart={(e) => e.stopPropagation()}
                className="p-1 text-gray-400 hover:text-red-500 z-50"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmation
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          deleteTask(task.id);
          setShowDeleteConfirm(false);
        }}
        taskTitle={task.title}
      />
    </>
  );
};

export default React.memo(TaskCard);