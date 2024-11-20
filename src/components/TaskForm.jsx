import React, { useState, useEffect } from 'react';
import { DAYS_OF_WEEK } from '../utils/constants';
import { Plus, X, AlertCircle, Clock, Tag } from 'lucide-react';
import { validateTask, hasErrors } from '../utils/validation';

const CATEGORIES = [
  { id: 'work', label: 'Travail', color: 'bg-blue-100 text-blue-800' },
  { id: 'personal', label: 'Personnel', color: 'bg-green-100 text-green-800' },
  { id: 'important', label: 'Important', color: 'bg-red-100 text-red-800' },
];

const TaskForm = ({ onSubmit, initialTask = null, onCancel }) => {
  const [task, setTask] = useState({
    title: '',
    day: DAYS_OF_WEEK[0],
    note: '',
    time: '',
    category: '',
    id: null
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTask(initialTask);
      setFeedback('Modification de la tâche...');
    }
  }, [initialTask]);

  const validateForm = () => {
    const newErrors = validateTask(task);
    setErrors(newErrors);
    return !hasErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSubmit({
        ...task,
        id: task.id || Date.now()
      });
      
      setFeedback(task.id ? 'Tâche mise à jour !' : 'Tâche ajoutée !');
      setTask({ 
        title: '', 
        day: DAYS_OF_WEEK[0], 
        note: '', 
        time: '',
        category: '',
        id: null 
      });
      
      setTimeout(() => setFeedback(''), 3000);
    } catch (error) {
      setFeedback('Erreur lors de l\'enregistrement');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg border border-gray-200 p-6 mb-8">
      {feedback && (
        <div className={`mb-4 p-3 rounded-md ${feedback.includes('Erreur') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {feedback}
        </div>
      )}
      
      <div className="space-y-4">
        {/* Titre et Jour */}
        <div className="flex gap-4 flex-col sm:flex-row">
          <div className="flex-1">
            <input
              type="text"
              value={task.title}
              onChange={(e) => {
                setTask({ ...task, title: e.target.value });
                if (errors.title) {
                  setErrors({ ...errors, title: '' });
                }
              }}
              placeholder="Nouvelle tâche..."
              className={`w-full px-4 py-2 rounded-md border ${
                errors.title ? 'border-red-400' : 'border-gray-200'
              } focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-500 flex items-center">
                <AlertCircle size={12} className="mr-1" />
                {errors.title}
              </p>
            )}
          </div>
          
          <select
            value={task.day}
            onChange={(e) => setTask({ ...task, day: e.target.value })}
            className="px-4 py-2 rounded-md border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 bg-white transition-colors"
          >
            {DAYS_OF_WEEK.map(day => (
              <option key={day} value={day}>{day}</option>
            ))}
          </select>
        </div>

        {/* Heure et Catégorie */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="time"
                value={task.time}
                onChange={(e) => setTask({ ...task, time: e.target.value })}
                className="pl-10 w-full px-4 py-2 rounded-md border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              />
            </div>
          </div>

          <div>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={task.category}
                onChange={(e) => setTask({ ...task, category: e.target.value })}
                className="pl-10 w-full px-4 py-2 rounded-md border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
              >
                <option value="">Catégorie</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Note */}
        <div>
          <textarea
            value={task.note}
            onChange={(e) => {
              setTask({ ...task, note: e.target.value });
              if (errors.note) {
                setErrors({ ...errors, note: '' });
              }
            }}
            placeholder="Ajouter une note (optionnel)"
            className={`w-full px-4 py-2 rounded-md border ${
              errors.note ? 'border-red-400' : 'border-gray-200'
            } focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors`}
            rows="2"
          />
          {errors.note && (
            <p className="mt-1 text-xs text-red-500 flex items-center">
              <AlertCircle size={12} className="mr-1" />
              {errors.note}
            </p>
          )}
        </div>

        {/* Boutons */}
        <div className="flex justify-end gap-2 pt-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              disabled={isSubmitting}
            >
              <X size={16} className="inline-block mr-1" />
              Annuler
            </button>
          )}
          <button
            type="submit"
            className={`px-4 py-2 rounded-md bg-blue-500 text-white transition-colors ${
              isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
            disabled={isSubmitting}
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