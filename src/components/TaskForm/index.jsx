import React, { useState, useEffect } from 'react';
import { DAYS_OF_WEEK } from '../../utils/constants';
import { Plus, X } from 'lucide-react';

const TaskForm = ({ onSubmit, initialTask = null, onCancel }) => {
  const [task, setTask] = useState({
    title: '',
    day: DAYS_OF_WEEK[0],
    note: '',
    id: null
  });

  useEffect(() => {
    if (initialTask) {
      setTask(initialTask);
    }
  }, [initialTask]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...task,
      id: task.id || Date.now()
    });
    setTask({ title: '', day: DAYS_OF_WEEK[0], note: '', id: null });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            placeholder="Nouvelle tâche..."
            className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
          <select
            value={task.day}
            onChange={(e) => setTask({ ...task, day: e.target.value })}
            className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {DAYS_OF_WEEK.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>
        <textarea
          value={task.note}
          onChange={(e) => setTask({ ...task, note: e.target.value })}
          placeholder="Ajouter une note (optionnel)"
          className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          rows="2"
        />
        <div className="flex justify-end gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-3 py-2 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
            >
              <X size={16} className="inline-block mr-1" />
              Annuler
            </button>
          )}
          <button
            type="submit"
            className="px-3 py-2 text-sm rounded-md bg-blue-600 text-white hover:bg-blue-700"
          >
            <Plus size={16} className="inline-block mr-1" />
            {task.id ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </div>
    </form>
  );
};

export default TaskForm;