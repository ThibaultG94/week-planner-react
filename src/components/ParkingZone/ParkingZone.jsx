import { useDroppable } from "@dnd-kit/core";
import { useTaskContext } from "../../contexts/TaskContext";
import ParkedTaskList from "./ParkedTaskList";

const ParkingZone = () => {
  const { parkedTasks } = useTaskContext();

  const { setNodeRef, isOver } = useDroppable({
    id: "parking-zone",
    data: {
      type: "parking",
      accepts: ["task"],
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`h-full flex flex-col border ${
        isOver ? "border-blue-400" : "border-gray-200"
      } bg-white rounded-lg shadow-sm`}
    >
      <div className="h-8 flex items-center px-3 py-6 border-b">
        <h2 className="font-medium text-gray-700">Parking</h2>
      </div>

      <div className="flex-1 overflow-y-auto">
        <ParkedTaskList tasks={parkedTasks} />
      </div>
    </div>
  );
};

export default ParkingZone;
