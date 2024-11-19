import React from 'react';
import Task from '../Task';

const DayCard = ({ day, tasks }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">{day}</h2>
      <div className="space-y-2">
        {tasks.map((task) => (
          <Task key={task.id} task={task} />
        ))}
        {tasks.length === 0 && (
          <p className="text-gray-500 text-sm">Aucune tâche pour ce jour</p>
        )}
      </div>
    </div>
  );
};

export default DayCard;