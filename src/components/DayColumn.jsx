import { useMemo } from 'react';
import TimeBlock from './common/TimeBlock';

const DayColumn = ({ 
  day, 
  tasks, 
  onAddTask, 
  onTaskDrop, 
  onTaskComplete, 
  onTasksReorder,
  onDeleteTask,
  onEditTask 
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

  return (
    <div className={`h-full flex flex-col border ${
      isToday ? 'border-blue-400' : 'border-gray-200'
    } bg-white`}>
      {/* En-tête */}
      <div className="h-8 flex items-center px-2 border-b">
        <h2 className="font-medium text-sm text-gray-700">{day}</h2>
      </div>

      {/* Container pour Matin/Après-midi */}
      <div className="flex-1 grid grid-rows-2 divide-y">
        <div className="relative h-full">
          <div className="absolute -top-0 left-2 z-10">
            <span className="text-xs font-medium text-gray-500">Matin</span>
          </div>
          <TimeBlock
            period="morning"
            tasks={morningTasks}
            onAddTask={() => onAddTask(day, 'morning')}
            onDrop={(e) => onTaskDrop(e, day, 'morning')}
            onTaskComplete={onTaskComplete}
            onReorder={onTasksReorder}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
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
            onAddTask={() => onAddTask(day, 'afternoon')}
            onDrop={(e) => onTaskDrop(e, day, 'afternoon')}
            onTaskComplete={onTaskComplete}
            onReorder={onTasksReorder}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
            maxTasks={4}
          />
        </div>
      </div>
    </div>
  );
};

export default DayColumn;