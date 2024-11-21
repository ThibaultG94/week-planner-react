import React, { useState } from 'react';
import { 
  DndContext, 
  DragOverlay,
  closestCenter,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { DAYS_OF_WEEK } from '../utils/constants';
import { useTaskContext } from '../contexts/TaskContext';
import DayColumn from './DayColumn';
import TaskCard from './common/TaskCard';

const WeekView = ({ onAddTask }) => {
  // États
  const [activeId, setActiveId] = useState(null);
  const [activeTask, setActiveTask] = useState(null);
  const { tasks, moveTask } = useTaskContext();

  // Configuration des sensors avec des contraintes d'activation
  const sensors = useSensors(
    useSensor(MouseSensor, {
      // Activation après un mouvement de 5px pour éviter les déclenchements accidentels
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      // Délai de 200ms avec tolérance de mouvement de 5px
      activationConstraint: {
        delay: 200,
        tolerance: 5,
      },
    })
  );

  // Gestionnaires d'événements
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveId(active.id);
    // Trouver la tâche active pour l'overlay
    const draggedTask = tasks.find(task => task.id === active.id);
    setActiveTask(draggedTask);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    // Vérification de sécurité : si pas de over ou format invalide, annuler
    if (!over || !over.id || typeof over.id !== 'string') {
      setActiveId(null);
      setActiveTask(null);
      return;
    }

    try {
      // Parse des informations de destination
      const [targetDay, targetPeriod, targetPosition] = over.id.split('-');
      
      // Vérifications supplémentaires
      if (!targetDay || !targetPeriod || targetPosition === undefined) {
        console.warn('Invalid drop target format');
        return;
      }

      if (!DAYS_OF_WEEK.includes(targetDay) || 
          !['morning', 'afternoon'].includes(targetPeriod) ||
          isNaN(parseInt(targetPosition))) {
        console.warn('Invalid drop target values');
        return;
      }

      // Si toutes les vérifications passent, effectuer le déplacement
      moveTask(active.id, targetDay, targetPeriod, parseInt(targetPosition));
    } catch (error) {
      console.error('Error during drag end:', error);
    } finally {
      // Toujours nettoyer les états
      setActiveId(null);
      setActiveTask(null);
    }
  };

  // Création d'un modificateur personnalisé qui restreint le mouvement horizontal
  const customModifier = (args) => {
    // Restreindre horizontalement pour éviter le dépassement de la fenêtre
    const horizontallyRestricted = restrictToHorizontalAxis(args);
    
    // Limiter la distance maximale de déplacement horizontal
    const maxHorizontalDistance = window.innerWidth - 100; // Marge de sécurité
    const x = Math.min(Math.max(horizontallyRestricted.x, -maxHorizontalDistance), maxHorizontalDistance);
    
    return {
      ...horizontallyRestricted,
      x,
      // Garder le y tel quel pour permettre le scroll vertical
      y: args.transform.y
    };
  };

  return (
    <div className="h-full">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        collisionDetection={closestCenter}
        modifiers={[customModifier]}
      >
        <div className="grid grid-cols-7 gap-2 h-full">
          {DAYS_OF_WEEK.map((day) => (
            <DayColumn 
              key={day}
              day={day}
              tasks={tasks.filter(task => task.day === day)}
              onAddTask={onAddTask}
              activeId={activeId}
            />
          ))}
        </div>

        {/* Overlay qui suit le curseur pendant le drag */}
        <DragOverlay>
          {activeTask ? (
            <div style={{ 
              width: '200px',
              transform: 'rotate(3deg)',
              cursor: 'grabbing'
            }}>
              <TaskCard 
                task={activeTask}
                isDragging={true}
              />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default WeekView;