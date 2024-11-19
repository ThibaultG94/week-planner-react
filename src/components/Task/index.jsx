import React, { useState, memo } from 'react';
import { Trash2, Edit } from 'lucide-react';
import DeleteConfirmation from '../common/DeleteConfirmation';

const Task = ({ task, onDelete, onEdit }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    onDelete(task.id);
    setShowDeleteConfirm(false);
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <>
      <div className="bg-gray-50 p-3 rounded-md border border-gray-200 hover:shadow-sm transition-all duration-200">
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
              className="text-gray-400 hover:text-blue-500 transition-colors duration-200"
              title="Modifier"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={handleDeleteClick}
              className="text-gray-400 hover:text-red-500 transition-colors duration-200"
              title="Supprimer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      <DeleteConfirmation
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        taskTitle={task.title}
      />
    </>
  );
};

export default memo(Task);