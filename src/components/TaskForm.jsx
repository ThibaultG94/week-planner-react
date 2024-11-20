import React, { useState, useEffect } from 'react';
import { DAYS_OF_WEEK } from '../utils/constants';
import { Plus, X, AlertCircle, Clock } from 'lucide-react';
import { validateTask, hasErrors } from '../utils/validation';
import { PERIODS, canExtendTask } from '../utils/timeBlocks';

const TaskForm = ({ 
  onSubmit, 
  initialTask = null, 
  onCancel, 
  existingTasks = [] 
}) => {
  const [task, setTask] = useState({
    title: '',
    day: DAYS_OF_WEEK[0],
    startBlock: PERIODS[0].id,
    endBlock: PERIODS[0].id,
    note: '',
    completed: false,
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

  const handleBlockChange = (type, value) => {
    const updates = { [type]: value };
    
    // Si on change le bloc de début, ajuster la fin si nécessaire
    if (type === 'startBlock' && 
        PERIODS.find(p => p.id === value)?.order > 
        PERIODS.find(p => p.id === task.endBlock)?.order) {
      updates.endBlock = value;
    }
    
    // Si on change le bloc de fin, ajuster le début si nécessaire
    if (type === 'endBlock' && 
        PERIODS.find(p => p.id === value)?.order < 
        PERIODS.find(p => p.id === task.startBlock)?.order) {
      updates.startBlock = value;
    }

    // Vérifier si l'extension est possible
    const newTask = { ...task, ...updates };
    const otherTasks = existingTasks.filter(t => t.id !== task.id);
    
    if (canExtendTask(newTask, updates.endBlock || task.endBlock, otherTasks)) {
      setTask(newTask);
    } else {
      setFeedback('Impossible d\'étendre la tâche : conflit avec d\'autres tâches');
      setTimeout(() => setFeedback(''), 3000);
    }
  };

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
        startBlock: PERIODS[0].id,
        endBlock: PERIODS[0].id,
        note: '', 
        completed: false,
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {feedback && (
        <div className={`p-3 rounded-md ${feedback.includes('Erreur') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {feedback}
        </div>
      )}
      
      {/* Titre et Jour */}
      <div className="flex gap-4 flex-col sm:flex-row">
        <div className="flex-1">
          <input
            type="text"
            value={task.title}
            onChange={(e) => {
              setTask({ ...task, title: e.target.value });
              if (errors.title) setErrors({ ...errors, title: '' });
            }}
            placeholder="Nouvelle tâche..."
            className={`w-full px-4 py-2 rounded-md border ${
              errors.title ? 'border-red-400' : 'border-gray-200'
            } focus:border-blue-400 focus:ring-1 focus:ring-blue-400`}
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
          className="px-4 py-2 rounded-md border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
        >
          {DAYS_OF_WEEK.map(day => (
            <option key={day} value={day}>{day}</option>
          ))}
        </select>
      </div>

      {/* Blocs horaires */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={task.startBlock}
              onChange={(e) => handleBlockChange('startBlock', e.target.value)}
              className="pl-10 w-full px-4 py-2 rounded-md border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            >
              {PERIODS.map(period => (
                <option key={period.id} value={period.id}>
                  {period.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <div className="relative">
            <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={task.endBlock}
              onChange={(e) => handleBlockChange('endBlock', e.target.value)}
              className="pl-10 w-full px-4 py-2 rounded-md border border-gray-200 focus:border-blue-400 focus:ring-1 focus:ring-blue-400"
            >
              {PERIODS.filter(period => 
                period.order >= PERIODS.find(p => p.id === task.startBlock)?.order
              ).map(period => (
                <option key={period.id} value={period.id}>
                  {period.label}
                </option>
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
            if (errors.note) setErrors({ ...errors, note: '' });
          }}
          placeholder="Ajouter une note (optionnel)"
          className={`w-full px-4 py-2 rounded-md border ${
            errors.note ? 'border-red-400' : 'border-gray-200'
          } focus:border-blue-400 focus:ring-1 focus:ring-blue-400`}
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
            className="px-4 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50"
            disabled={isSubmitting}
          >
            <X size={16} className="inline-block mr-1" />
            Annuler
          </button>
        )}
        <button
          type="submit"
          className={`px-4 py-2 rounded-md bg-blue-500 text-white ${
            isSubmitting ? 'opacity-75 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
          disabled={isSubmitting}
        >
          <Plus size={16} className="inline-block mr-1" />
          {task.id ? 'Mettre à jour' : 'Ajouter'}
        </button>
      </div>
    </form>
  );
};

export default TaskForm;