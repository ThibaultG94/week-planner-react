import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTaskContext } from '../../contexts/TaskContext';
import TaskCard from './TaskCard';

const DroppableSlot = ({
  day,
  period,
  position,
  task,
  isActive,
  isOver,
}) => {
  const slotId = `${day}-${period}-${position}`;
  const { openTaskForm } = useTaskContext();
  
  const { setNodeRef } = useDroppable({
    id: slotId,
    data: {
      type: 'slot',
      day,
      period,
      position,
      accepts: ['task']
    }
  });

  // Animation variants pour les transitions
  const slotVariants = {
    initial: { 
      opacity: 0, 
      scale: 0.95 
    },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 500,
        damping: 25,
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  };

  // Animation variants pour le feedback visuel du drop
  const dropIndicatorVariants = {
    initial: {
      scale: 0.95,
      opacity: 0
    },
    animate: {
      scale: 1,
      opacity: isOver ? 1 : 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  };

  return (
    <motion.div 
      ref={setNodeRef}
      initial="initial"
      animate="animate"
      whileHover="hover"
      variants={slotVariants}
      className={`relative h-full min-h-[60px] rounded-lg transition-colors duration-200
        ${!task ? 'border-2 border-dashed' : ''}
        ${isOver ? 'border-blue-400 bg-blue-50' : 'border-gray-200'}
        ${isActive ? 'opacity-50' : ''}`}
      style={{ 
        touchAction: 'none',
        cursor: task ? 'grab' : 'default' 
      }}
    >
      {/* Indicateur de drop */}
      <motion.div
        variants={dropIndicatorVariants}
        className="absolute inset-0 bg-blue-100 rounded-lg z-0"
        style={{ pointerEvents: 'none' }}
      />

      {/* Contenu de la tâche */}
      {task && (
        <motion.div 
          layoutId={`task-${task.id}`}
          className="absolute inset-0 z-10"
        >
          <TaskCard task={task} />
        </motion.div>
      )}

      {/* Bouton d'ajout de tâche */}
      {!task && !isOver && (
        <motion.button
          onClick={() => openTaskForm(day, period)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute inset-0 flex items-center justify-center opacity-0 
            hover:opacity-100 text-gray-400 hover:text-blue-500 
            hover:bg-gray-50/80 rounded-lg transition-all duration-200 z-20"
        >
          <Plus className="w-4 h-4 mr-1" />
          <span className="text-xs font-medium">Ajouter une tâche</span>
        </motion.button>
      )}
    </motion.div>
  );
};

export default React.memo(DroppableSlot);