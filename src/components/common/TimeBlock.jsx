import { Plus } from 'lucide-react';
import Task from '../Task';
import { getBlocksBetween, PERIODS } from '../../utils/timeBlocks';

const TimeBlock = ({ 
  period, 
  tasks = [], 
  onAddTask, 
  onDrop, 
  onTaskComplete,
  onDeleteTask,
  onEditTask,
  onReorder, 
  maxTasks = 4 
}) => {
  // Convertit la période affichée en identifiant interne
  const periodId = period === "Matin" ? "morning" : "afternoon";
  
  // Détermine les blocs appartenant à cette période
  const periodBlocks = PERIODS.filter(block => block.period === periodId);
  const firstBlockId = periodBlocks[0]?.id;
  const lastBlockId = periodBlocks[periodBlocks.length - 1]?.id;

  // Filtre les tâches qui appartiennent à ce bloc de temps
  const blockTasks = tasks.filter(task => {
    if (!task.startBlock || !task.endBlock) return task.period === periodId;
    const taskBlocks = getBlocksBetween(task.startBlock, task.endBlock);
    return taskBlocks.some(blockId => 
      periodBlocks.some(periodBlock => periodBlock.id === blockId)
    );
  });

  const calculateTaskStyle = (task) => {
    // Si la tâche n'a pas de blocs définis, utiliser le style par défaut
    if (!task.startBlock || !task.endBlock) {
      return {};
    }

    // Trouve l'index du premier et dernier bloc de la tâche dans cette période
    const taskBlocks = getBlocksBetween(task.startBlock, task.endBlock);
    const periodBlockIds = periodBlocks.map(block => block.id);
    
    const firstTaskBlock = taskBlocks.find(blockId => periodBlockIds.includes(blockId));
    const lastTaskBlock = [...taskBlocks].reverse().find(blockId => periodBlockIds.includes(blockId));
    
    if (!firstTaskBlock || !lastTaskBlock) return {};

    // Calcule la hauteur en fonction du nombre de blocs
    const startIdx = periodBlockIds.indexOf(firstTaskBlock);
    const endIdx = periodBlockIds.indexOf(lastTaskBlock);
    const height = (endIdx - startIdx + 1) * 100; // 100px par bloc

    return {
      height: `${height}%`,
      top: `${startIdx * 25}%`, // 25% par bloc (100% / 4 blocs)
      position: 'absolute',
      left: 0,
      right: 0,
    };
  };

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
    if (!draggedTaskId) return;

    onDrop?.(e, draggedTaskId);
  };

  const availableSlots = maxTasks - blockTasks.length;

  return (
    <div 
      className="relative p-4 bg-white border border-gray-200 rounded-lg"
      style={{ height: '400px' }} // Hauteur fixe pour permettre le positionnement absolu
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h3 className="text-sm font-medium text-gray-600 mb-3">{period}</h3>
      
      <div className="relative h-full">
        {/* Grille de fond pour visualiser les 4 blocs */}
        <div className="absolute inset-0 grid grid-rows-4 gap-px pointer-events-none">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="border-t border-gray-100 first:border-t-0"
            />
          ))}
        </div>

        {/* Tâches */}
        {blockTasks.map((task) => (
          <div 
            key={task.id}
            className="task-item px-3"
            style={calculateTaskStyle(task)}
            data-task-id={task.id}
          >
            <Task 
              task={task}
              onComplete={onTaskComplete}
              onDelete={onDeleteTask}
              onEdit={onEditTask}
              style={{ height: '100%' }}
            />
          </div>
        ))}
        
        {/* Bouton d'ajout */}
        {availableSlots > 0 && (
          <button
            onClick={() => onAddTask(firstBlockId)}
            className="absolute bottom-0 left-0 right-0 h-12 border-2 border-dashed border-gray-200 rounded-md flex items-center justify-center text-gray-400 hover:text-blue-500 hover:border-blue-500 transition-colors"
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