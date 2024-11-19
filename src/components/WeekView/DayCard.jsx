import Task from '../Task';
import { CalendarCheck } from 'lucide-react';

const DayCard = ({ day, tasks, onDeleteTask, onEditTask }) => {
  const isToday = new Date().toLocaleDateString('fr-FR', { weekday: 'long' }).charAt(0).toUpperCase() + 
                  new Date().toLocaleDateString('fr-FR', { weekday: 'long' }).slice(1) === day;

  return (
    <div className={`bg-white rounded-lg shadow-sm border ${
      isToday ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'
    } p-4 transition-all duration-200 hover:shadow-md`}>
      <div className="flex items-center justify-between mb-4 pb-2 border-b">
        <h2 className="font-semibold text-gray-700">{day}</h2>
        {isToday && (
          <span className="flex items-center text-xs text-blue-600">
            <CalendarCheck size={14} className="mr-1" />
            Aujourd'hui
          </span>
        )}
      </div>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-sm text-gray-400 text-center py-8 bg-gray-50 rounded-md">
            <p>Aucune tâche</p>
            <p className="text-xs mt-1">Cliquez sur + pour en ajouter</p>
          </div>
        ) : (
          tasks.map(task => (
            <Task
              key={task.id}
              task={task}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default DayCard;