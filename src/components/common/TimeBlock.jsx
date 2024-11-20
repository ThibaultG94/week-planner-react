import DroppableSlot from './DroppableSlot';

const TimeBlock = ({ 
  day,
  period, 
  tasks = [], 
  onAddTask,
  onTaskComplete,
  onDeleteTask,
  onEditTask,
  maxTasks = 4 
}) => {
  const slots = Array(maxTasks).fill(null).map((_, index) => ({
    id: `${day}-${period}-${index}`,
    task: tasks.find(t => t.position === index) || null
  }));

  return (
    <div className="h-full pt-7">
      <div className="h-full grid grid-rows-4 gap-1">
        {slots.map(({ id, task }, index) => (
          <DroppableSlot
            key={id}
            id={id}
            day={day}
            period={period}
            index={index}
            task={task}
            onAddTask={() => onAddTask(day, period, index)}
            onTaskComplete={onTaskComplete}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
          />
        ))}
      </div>
    </div>
  );
};

export default TimeBlock;