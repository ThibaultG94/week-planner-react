import { useMemo } from 'react';
import TimeBlock from './common/TimeBlock';
import DragDropContext from './common/DragDropContext';
import useDragAndDrop from '../hooks/useDragAndDrop';

const DayColumn = ({ 
  day, 
  tasks,
  onAddTask, // S'assurer que cette prop est bien reçue
  onTaskComplete, 
  onTasksReorder,
  onDeleteTask,
  onEditTask,
  onTaskMove 
}) => {
  const isToday = useMemo(() => {
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long' })
      .charAt(0).toUpperCase() + 
      new Date().toLocaleDateString('fr-FR', { weekday: 'long' }).slice(1);
    return today === day;
  }, [day]);

  const { morningTasks, afternoonTasks } = useMemo(() => {
    return {
      morningTasks: tasks.filter(task => task.period === 'morning')
        .sort((a, b) => (a.position || 0) - (b.position || 0)),
      afternoonTasks: tasks.filter(task => task.period === 'afternoon')
        .sort((a, b) => (a.position || 0) - (b.position || 0))
    };
  }, [tasks]);

  const {
    activeId,
    handleDragStart,
    handleDragOver,
    handleDragEnd
  } = useDragAndDrop({
    items: tasks,
    onReorder: onTasksReorder,
    onMove: ({ taskId, destinationContainer }) => {
      const [newPeriod] = destinationContainer.split('-');
      onTaskMove(taskId, day, newPeriod);
    }
  });

  // Gestionnaires pour chaque période
  const handleMorningAddTask = () => onAddTask(day, 'morning');
  const handleAfternoonAddTask = () => onAddTask(day, 'afternoon');

  return (
    <div className={`h-full flex flex-col border ${
      isToday ? 'border-blue-400' : 'border-gray-200'
    } bg-white`}>
      <div className="h-8 flex items-center px-2 border-b">
        <h2 className="font-medium text-sm text-gray-700">{day}</h2>
      </div>

      <DragDropContext
        items={tasks}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 grid grid-rows-2 divide-y">
          <div className="relative h-full">
            <div className="absolute -top-0 left-2 z-10">
              <span className="text-xs font-medium text-gray-500">Matin</span>
            </div>
            <TimeBlock
              period="morning"
              tasks={morningTasks}
              onAddTask={handleMorningAddTask}
              containerId={`morning-${day}`}
              onTaskComplete={onTaskComplete}
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
              activeId={activeId}
              maxTasks={4}
            />
          </div>
          
          <div className="relative h-full">
            <div className="absolute -top-0 left-2 z-10">
              <span className="text-xs font-medium text-gray-500">Après-midi</span>
            </div>
            <TimeBlock
              period="afternoon"
              tasks={afternoonTasks}
              onAddTask={handleAfternoonAddTask}
              containerId={`afternoon-${day}`}
              onTaskComplete={onTaskComplete}
              onDeleteTask={onDeleteTask}
              onEditTask={onEditTask}
              activeId={activeId}
              maxTasks={4}
            />
          </div>
        </div>
      </DragDropContext>
    </div>
  );
};

export default DayColumn;