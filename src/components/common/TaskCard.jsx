import React, { useState } from 'react';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, Edit, MessageSquare } from 'lucide-react';
import { useTaskContext } from '../../contexts/TaskContext';
import DeleteConfirmation from './DeleteConfirmation';

const TaskCard = ({ task }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { deleteTask, toggleTaskComplete, editTask } = useTaskContext();
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    isDragging
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

  // Handlers séparés pour les boutons
  const handleEdit = (e) => {
    console.log('Edit clicked');
    editTask(task);
  };

  const handleDelete = () => {
    console.log('Delete clicked');
    setShowDeleteConfirm(true);
  };

  const handleComplete = () => {
    console.log('Complete clicked');
    toggleTaskComplete(task.id);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-50 w-full h-full bg-white rounded-md border border-gray-200 p-2"
      />
    );
  }

  return (
    <>
      <div className="relative w-full h-full">
        {/* Zone draggable */}
        <div
          ref={setNodeRef}
          style={style}
          {...attributes}
          {...listeners}
          className="absolute inset-0 w-full h-full"
        />

        {/* Contenu et contrôles (non draggable) */}
        <div className="group relative w-full h-full bg-white rounded-md border border-gray-200 p-2 hover:shadow-sm transition-all duration-200">
          <div className="flex items-start gap-2 h-full max-h-[60px]">
            {/* Checkbox */}
            <div 
              className="mt-1" 
              onClick={(e) => e.stopPropagation()}
            >
              <input
                type="checkbox"
                id={`task-${task.id}-checkbox`}
                name={`task-${task.id}-checkbox`}
                checked={task.completed}
                onChange={handleComplete}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 shrink-0"
              />
            </div>
            
            {/* Contenu */}
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

            {/* Boutons d'action */}
            <div 
              className="absolute top-1.5 right-1.5 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute inset-0 -m-1 bg-white/80 backdrop-blur-sm rounded-sm" />
              <div className="relative flex gap-1">
                <button
                  type="button"
                  onClick={handleEdit}
                  className="p-1 text-gray-400 hover:text-blue-500 z-50 cursor-pointer"
                >
                  <Edit size={14} />
                </button>
                <button
                  type="button"
                  onClick={handleDelete}
                  className="p-1 text-gray-400 hover:text-red-500 z-50 cursor-pointer"
                >
                  <Trash2 size={14} />
                </button>
              </div>
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