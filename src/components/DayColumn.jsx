import { useMemo } from 'react';
import TimeBlock from './common/TimeBlock';
import { Calendar } from 'lucide-react';

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

  const handleReorder = (period, reorderedTasks) => {
    // Mise à jour des positions lors du réordonnancement
    const updatedTasks = reorderedTasks.map((task, index) => ({
      ...task,
      position: index
    }));
    
    const otherTasks = tasks.filter(task => task.period !== period);
    onTasksReorder([...otherTasks, ...updatedTasks]);
  };

  return (
    <div 
      className={`flex flex-col h-full rounded-lg border ${
        isToday ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'
      } bg-white transition-shadow hover:shadow-md`}
    >
      {/* En-tête de la colonne */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="font-semibold text-gray-700">{day}</h2>
        {isToday && (
          <span className="flex items-center text-xs text-blue-600">
            <Calendar size={14} className="mr-1" />
            Aujourd'hui
          </span>
        )}
      </div>

      {/* Contenu de la colonne */}
      <div className="flex-1 space-y-4 p-4 bg-gray-50">
        <TimeBlock
          period="Matin"
          tasks={morningTasks}
          onAddTask={() => onAddTask(day, 'morning')}
          onDrop={(e) => onTaskDrop(e, day, 'morning')}
          onTaskComplete={onTaskComplete}
          onReorder={(tasks) => handleReorder('morning', tasks)}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          maxTasks={4}
        />
        
        <TimeBlock
          period="Après-midi"
          tasks={afternoonTasks}
          onAddTask={() => onAddTask(day, 'afternoon')}
          onDrop={(e) => onTaskDrop(e, day, 'afternoon')}
          onTaskComplete={onTaskComplete}
          onReorder={(tasks) => handleReorder('afternoon', tasks)}
          onDeleteTask={onDeleteTask}
          onEditTask={onEditTask}
          maxTasks={4}
        />
      </div>
    </div>
  );
};

export default DayColumn;