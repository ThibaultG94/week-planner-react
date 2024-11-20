import { Plus } from 'lucide-react';
import Task from '../Task';

const TimeBlock = ({ period, tasks = [], onAddTask, onDrop, onTaskComplete, onReorder }) => {
  const maxTasks = 4;
  const availableSlots = maxTasks - tasks.length;

  const handleDragOver = (e) => {
    e.preventDefault();
    const draggedTaskId = e.dataTransfer.getData('text/plain');
    const target = e.target.closest('.task-item');
    
    if (!target) return;
    
    const boundingRect = target.getBoundingClientRect();
    const mouseY = e.clientY;
    const threshold = boundingRect.top + boundingRect.height / 2;
    
    target.classList.remove('border-t-2', 'border-b-2');
    if (mouseY < threshold) {
      target.classList.add('border-t-2');
    } else {
      target.classList.add('border-b-2');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const draggedTaskId = e.dataTransfer.getData('text/plain');
    const target = e.target.closest('.task-item');
    
    if (!target) return;
    
    const targetTaskId = target.dataset.taskId;
    const boundingRect = target.getBoundingClientRect();
    const mouseY = e.clientY;
    const threshold = boundingRect.top + boundingRect.height / 2;
    
    target.classList.remove('border-t-2', 'border-b-2');
    
    const tasksCopy = [...tasks];
    const draggedIndex = tasksCopy.findIndex(t => t.id.toString() === draggedTaskId);
    const targetIndex = tasksCopy.findIndex(t => t.id.toString() === targetTaskId);
    
    if (draggedIndex === -1) return;
    
    const [draggedTask] = tasksCopy.splice(draggedIndex, 1);
    let newIndex = mouseY < threshold ? targetIndex : targetIndex + 1;
    
    if (draggedIndex < targetIndex) {
      newIndex--;
    }
    
    tasksCopy.splice(newIndex, 0, draggedTask);
    onReorder(tasksCopy);
  };

  return (
    <div 
      className="p-4 bg-white border border-gray-200 rounded-lg"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h3 className="text-sm font-medium text-gray-600 mb-3">{period}</h3>
      
      <div className="space-y-2">
        {tasks.map((task) => (
          <div 
            key={task.id} 
            className="task-item"
            data-task-id={task.id}
          >
            <Task 
              task={task}
              onComplete={onTaskComplete}
            />
          </div>
        ))}
        
        {availableSlots > 0 && (
          <button
            onClick={() => onAddTask(period)}
            className="w-full h-12 border-2 border-dashed border-gray-200 rounded-md flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-colors"
          >
            <Plus size={20} />
            <span className="ml-2 text-sm">Ajouter une tâche</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TimeBlock;