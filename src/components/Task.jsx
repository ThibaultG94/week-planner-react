import React, { useState } from 'react';
import { Trash2, Edit, Clock, MessageSquare } from 'lucide-react';
import DeleteConfirmation from './common/DeleteConfirmation';

const Task = ({ task, onDelete, onEdit, onStatusChange, isDragging }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showNotes, setShowNotes] = useState(false);

  const categoryColors = {
    work: 'bg-blue-100 text-blue-800',
    personal: 'bg-green-100 text-green-800',
    important: 'bg-red-100 text-red-800'
  };

  return (
    <>
      <div 
        className={`group bg-white p-3 rounded-md border ${
          isDragging ? 'shadow-lg border-blue-400' : 'border-gray-200'
        } hover:shadow-sm transition-all duration-200`}
        draggable="true"
      >
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onStatusChange(task.id)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div>
                <h3 className={`text-sm font-medium ${
                  task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                }`}>
                  {task.title}
                </h3>
                {task.time && (
                  <div className="flex items-center mt-1 text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    {task.time}
                  </div>
                )}
              </div>
              
              {task.category && (
                <span className={`text-xs px-2 py-1 rounded-full ${categoryColors[task.category]}`}>
                  {task.category}
                </span>
              )}
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