import React from 'react';
import { Trash2, Edit } from 'lucide-react';

const Task = ({ task, onDelete, onEdit }) => {
  return (
    <div className="bg-gray-50 p-3 rounded-md border border-gray-200 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">{task.title}</h3>
          {task.note && (
            <div className="mt-1">
              <p className="text-xs text-gray-500 break-words">{task.note}</p>
            </div>
          )}
        </div>
        <div className="flex gap-2 ml-2">
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-blue-500 transition-colors"
            title="Modifier"
          >
            <Edit size={16} />
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="text-gray-400 hover:text-red-500 transition-colors"
            title="Supprimer"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Task;