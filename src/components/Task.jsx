import React, { useRef, useState } from 'react';
import { Trash2, Edit, MessageSquare } from 'lucide-react';
import DeleteConfirmation from './common/DeleteConfirmation';

const Task = ({ task, onDelete, onEdit, onComplete, onDragStart, onDragEnd }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const taskRef = useRef(null);

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task.id);
    if (taskRef.current) {
      taskRef.current.classList.add('opacity-50');
    }
    onDragStart?.(task);
  };

  const handleDragEnd = () => {
    if (taskRef.current) {
      taskRef.current.classList.remove('opacity-50');
    }
    onDragEnd?.();
  };

  return (
    <>
      <div
        ref={taskRef}
        draggable
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className="group bg-white p-3 rounded-md border border-gray-200 hover:shadow-sm transition-all duration-200"
      >
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onComplete(task.id)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <h3 className={`text-sm font-medium ${
                task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
              }`}>
                {task.title}
              </h3>
            </div>

            {task.note && (
              <button
                onClick={() => setShowNotes(!showNotes)}
                className="mt-2 flex items-center text-xs text-gray-500 hover:text-gray-700"
              >
                <MessageSquare size={12} className="mr-1" />
                Notes
              </button>
            )}

            {showNotes && task.note && (
              <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                {task.note}
              </div>
            )}
          </div>

          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className="text-gray-400 hover:text-blue-500 transition-colors"
              title="Modifier"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Supprimer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        <div className="absolute left-0 right-0 h-2 -bottom-2 hidden group-hover:block">
          <div className="h-full bg-blue-500 opacity-0 hover:opacity-20 transition-opacity rounded" />
        </div>
      </div>

      <DeleteConfirmation
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={() => {
          onDelete(task.id);
          setShowDeleteConfirm(false);
        }}
        taskTitle={task.title}
      />
    </>
  );
};

export default React.memo(Task);