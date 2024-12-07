import React, { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";
import DroppableSlot from "./DroppableSlot";

const TimeBlock = React.memo(
  ({
    day,
    period,
    tasks = [],
    onAddTask,
    onTaskMove,
    onTasksReorder,
    activeId,
    maxTasks = 4,
  }) => {
    // Créer un tableau de slots avec les tâches associées
    const slots = useMemo(() => {
      const emptySlots = Array(maxTasks)
        .fill(null)
        .map((_, index) => ({
          id: `${day}-${period}-${index}`,
          position: index,
          task: null,
        }));

      // Associer les tâches aux slots correspondants
      tasks.forEach((task) => {
        if (task.location.position < maxTasks) {
          emptySlots[task.location.position].task = task;
        }
      });

      return emptySlots;
    }, [tasks, day, period, maxTasks]);

    // Setup de la zone de drop pour toute la période
    const { setNodeRef, isOver } = useDroppable({
      id: `${day}-${period}`,
      data: {
        type: "period",
        period,
        day,
      },
    });

    return (
      <div className="relative h-full">
        {/* Label de la période */}
        <div className="absolute -top-0 left-2 z-10">
          <span className="text-xs font-medium text-gray-500">
            {period === "morning" ? "Matin" : "Après-midi"}
          </span>
        </div>

        <div
          ref={setNodeRef}
          className={`h-full pt-7 transition-colors ${
            isOver ? "bg-blue-50" : ""
          }`}
        >
          <div className="h-full grid grid-rows-4 gap-1 p-2">
            {slots.map((slot) => (
              <DroppableSlot
                key={slot.id}
                id={slot.id}
                day={day}
                period={period}
                position={slot.position}
                task={slot.task}
                onAddTask={() => onAddTask(day, period)}
                onTaskMove={onTaskMove}
                onTasksReorder={onTasksReorder}
                isActive={activeId === slot.task?.id}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
);

export default TimeBlock;
