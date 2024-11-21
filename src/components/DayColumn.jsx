import { useMemo } from 'react';
import TimeBlock from './common/TimeBlock';
import { DndContext, useDroppable } from '@dnd-kit/core';
import useDragAndDrop from '../hooks/useDragAndDrop';

const DayColumn = ({ 
  day, 
  tasks,
  onAddTask,
  onTaskComplete, 
  onTasksReorder,
  onDeleteTask,
  onEditTask,
  onTaskMove 
}) => {
  // Détecter si c'est aujourd'hui
  const isToday = useMemo(() => {
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long' })
      .charAt(0).toUpperCase() + 
      new Date().toLocaleDateString('fr-FR', { weekday: 'long' }).slice(1);
    return today === day;
  }, [day]);

  // Trier les tâches par période
  const { morningTasks, afternoonTasks } = useMemo(() => {
    return {
      morningTasks: tasks.filter(task => task.period === 'morning')
        .sort((a, b) => (a.position || 0) - (b.position || 0)),
      afternoonTasks: tasks.filter(task => task.period === 'afternoon')
        .sort((a, b) => (a.position || 0) - (b.position || 0))
    };
  }, [tasks]);

  // Setup du drag & drop
  const {
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  } = useDragAndDrop({
    tasks,
    onTasksReorder,
    onTaskMove
  });

  // Setup des zones de drop pour la colonne
  const { setNodeRef: setMorningRef } = useDroppable({
    id: `morning-${day}`,
    data: {
      type: 'period',
      period: 'morning',
      day
    }
  });

  const { setNodeRef: setAfternoonRef } = useDroppable({
    id: `afternoon-${day}`,
    data: {
      type: 'period',
      period: 'afternoon',
      day
    }
  });

  // Gestionnaires pour chaque période
  const handleMorningAddTask = () => onAddTask(day, 'morning');
  const handleAfternoonAddTask = () => onAddTask(day, 'afternoon');

  return (
    <div className={`h-full flex flex-col border ${
      isToday ? 'border-blue-400' : 'border-gray-200'
    } bg-white rounded-lg shadow-sm`}>
      {/* En-tête de la colonne */}
      <div className="h-8 flex items-center px-3 py-6 border-b">
        <h2 className={`font-medium ${
          isToday ? 'text-blue-600' : 'text-gray-700'
        }`}>
          {day}
        </h2>
      </div>

      {/* Conteneur pour le drag & drop */}
      <DndContext
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 grid grid-rows-2 divide-y">
          {/* Période du matin */}
          <div ref={setMorningRef} className="relative h-full">
            <div className="absolute -top-0 left-2 z-10">
              <span className="text-xs font-medium text-gray-500">Matin</span>
            </div>
            <TimeBlock
              period="morning"
              day={day}
              tasks={morningTasks}
              onAddTask={handleMorningAddTask}
              onTaskComplete={onTaskComplete}
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
              activeId={activeId}
              maxTasks={4}
            />
          </div>
          
          {/* Période de l'après-midi */}
          <div ref={setAfternoonRef} className="relative h-full">
            <div className="absolute -top-0 left-2 z-10">
              <span className="text-xs font-medium text-gray-500">Après-midi</span>
            </div>
            <TimeBlock
              period="afternoon"
              day={day}
              tasks={afternoonTasks}
              onAddTask={handleAfternoonAddTask}
              onTaskComplete={onTaskComplete}
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
              activeId={activeId}
              maxTasks={4}
            />
          </div>
        </div>
      </DndContext>
    </div>
  );
};

export default DayColumn;