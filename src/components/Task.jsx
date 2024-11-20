import React, { useRef, useState } from 'react';
import { Trash2, Edit, MessageSquare, GripVertical } from 'lucide-react';
import DeleteConfirmation from './common/DeleteConfirmation';
import { PERIODS, calculateTaskHeight } from '../utils/timeBlocks';

const Task = ({ 
  task, 
  onDelete, 
  onEdit, 
  onComplete, 
  onDragStart, 
  onDragEnd,
  style = {} 
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const taskRef = useRef(null);

  // Calculer la taille de la tâche en fonction des blocs
  const blockCount = task.startBlock && task.endBlock 
    ? calculateTaskHeight(task.startBlock, task.endBlock)
    : 1;

  // Récupérer les labels des blocs de début et de fin
  const startBlockLabel = task.startBlock
    ? PERIODS.find(p => p.id === task.startBlock)?.label
    : '';
  const endBlockLabel = task.endBlock
    ? PERIODS.find(p => p.id === task.endBlock)?.label
    : '';

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
        style={{
          ...style,
          minHeight: blockCount > 1 ? `${blockCount * 25}%` : 'auto'
        }}
        className={`group relative flex flex-col bg-white rounded-md border border-gray-200 hover:shadow-sm transition-all duration-200 ${
          blockCount > 1 ? 'p-4' : 'p-3'
        }`}
      >
        {/* Barre de drag & drop */}
        <div className="absolute left-1 top-0 bottom-0 flex items-center opacity-0 group-hover:opacity-100 transition-opacity cursor-move">
          <GripVertical size={16} className="text-gray-400" />
        </div>

        <div className="flex items-start gap-3 pl-4">
          <input
            type="checkbox"
            checked={task.completed}
            onChange={() => onComplete(task.id)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          
          <div className="flex-1">
            <div className="flex flex-col">
              <h3 className={`text-sm font-medium ${
                task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
              }`}>
                {task.title}
              </h3>

              {/* Affichage de la plage horaire pour les tâches multi-blocs */}
              {blockCount > 1 && startBlockLabel && endBlockLabel && (
                <span className="text-xs text-gray-500 mt-1">
                  {startBlockLabel} - {endBlockLabel}
                </span>
              )}
            </div>

            {/* Notes avec transition d'expansion */}
            {task.note && (
              <div className="mt-2">
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className="flex items-center text-xs text-gray-500 hover:text-gray-700"
                >
                  <MessageSquare size={12} className="mr-1" />
                  Notes {showNotes ? '(masquer)' : '(afficher)'}
                </button>
                
                {showNotes && (
                  <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    {task.note}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => onEdit(task)}
              className="text-gray-400 hover:text-blue-500 transition-colors p-1"
              title="Modifier"
            >
              <Edit size={16} />
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Supprimer"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Indicateur de zone de drop */}
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