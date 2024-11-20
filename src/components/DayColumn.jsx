import { useMemo } from 'react';
import TimeBlock from './common/TimeBlock';
import { Calendar } from 'lucide-react';

const DayColumn = ({ day, tasks, onAddTask, onTaskDrop, onTaskComplete }) => {
  const isToday = useMemo(() => {
    const today = new Date().toLocaleDateString('fr-FR', { weekday: 'long' })
      .charAt(0).toUpperCase() + 
      new Date().toLocaleDateString('fr-FR', { weekday: 'long' }).slice(1);
    return today === day;
  }, [day]);

  const { morningTasks, afternoonTasks } = useMemo(() => {
    return {
      morningTasks: tasks.filter(task => task.period === 'morning'),
      afternoonTasks: tasks.filter(task => task.period === 'afternoon')
    };
  }, [tasks]);

  return (
    <div className={`flex flex-col h-full ${
      isToday ? 'ring-2 ring-blue-100' : ''
    }`}>
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <h2 className="font-semibold text-gray-700">{day}</h2>
        {isToday && (
          <span className="flex items-center text-xs text-blue-600">
            <Calendar size={14} className="mr-1" />
            Aujourd'hui
          </span>
        )}
      </div>

      <div className="flex-1 space-y-4 p-4 bg-gray-50">
        <TimeBlock
          period="Matin"
          tasks={morningTasks}
          onAddTask={() => onAddTask(day, 'morning')}
          onDrop={(e) => onTaskDrop(e, day, 'morning')}
          onTaskComplete={onTaskComplete}
        />
        
        <TimeBlock
          period="Après-midi"
          tasks={afternoonTasks}
          onAddTask={() => onAddTask(day, 'afternoon')}
          onDrop={(e) => onTaskDrop(e, day, 'afternoon')}
          onTaskComplete={onTaskComplete}
        />
      </div>
    </div>
  );
};

export default DayColumn;