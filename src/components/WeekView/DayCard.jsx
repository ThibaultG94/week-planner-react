import Task from '../Task';

const DayCard = ({ day, tasks, onDeleteTask, onEditTask }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <h2 className="font-semibold text-gray-700 mb-4 pb-2 border-b">{day}</h2>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            Aucune tâche
          </p>
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