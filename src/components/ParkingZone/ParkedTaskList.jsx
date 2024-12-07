import TaskCard from "../common/TaskCard";

const ParkedTaskList = ({ tasks }) => {
  return (
    <div className="p-2 space-y-2">
      {tasks.map((task) => (
        <div key={task.id} className="h-[60px]">
          <TaskCard task={task} />
        </div>
      ))}
    </div>
  );
};

export default ParkedTaskList;
