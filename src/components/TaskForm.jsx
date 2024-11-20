import React, { useState, useEffect } from 'react';
import { DAYS_OF_WEEK } from '../utils/constants';
import { validateTask, hasErrors } from '../utils/validation';

const TaskForm = ({ 
  onSubmit, 
  initialTask = null,
  onCancel,
  preselectedDay,
  preselectedPeriod
}) => {
  const [task, setTask] = useState({
    title: '',
    day: preselectedDay || DAYS_OF_WEEK[0],
    period: preselectedPeriod || 'morning',
    note: '',
    completed: false,
    id: null
  });

  useEffect(() => {
    if (initialTask) {
      setTask(initialTask);
    }
  }, [initialTask]);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateTask(task);
    
    if (hasErrors(validationErrors)) {
      setErrors(validationErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...task,
        id: task.id || Date.now(),
        period: task.period || preselectedPeriod || 'morning',
        day: task.day || preselectedDay || DAYS_OF_WEEK[0]
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4">
        <div>
          <input
            type="text"
            value={task.title}
            onChange={(e) => setTask({ ...task, title: e.target.value })}
            placeholder="Titre de la tâche"
            className={`w-full px-4 py-2 rounded-md border ${
              errors.title ? 'border-red-400' : 'border-gray-200'
            }`}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-500">{errors.title}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <select
            value={task.day}
            onChange={(e) => setTask({ ...task, day: e.target.value })}
            className="px-4 py-2 rounded-md border border-gray-200"
          >
            {DAYS_OF_WEEK.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>

          <select
            value={task.period}
            onChange={(e) => setTask({ ...task, period: e.target.value })}
            className="px-4 py-2 rounded-md border border-gray-200"
          >
            <option value="morning">Matin</option>
            <option value="afternoon">Après-midi</option>
          </select>
        </div>

        <textarea
          value={task.note}
          onChange={(e) => setTask({ ...task, note: e.target.value })}
          placeholder="Note (optionnel)"
          className="w-full px-4 py-2 rounded-md border border-gray-200"
          rows="3"
        />
      </div>

      <div className="flex justify-end gap-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md"
            disabled={isSubmitting}
          >
            Annuler
          </button>
        )}
        <button
          type="submit"
          className={`px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${
            isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          disabled={isSubmitting}
        >
          {task.id ? 'Modifier' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;