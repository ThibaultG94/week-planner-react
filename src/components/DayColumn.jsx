import { useMemo } from "react";
import TimeBlock from "./common/TimeBlock";

const DayColumn = ({ day, tasks, onAddTask, activeId }) => {
  // Détecter si c'est aujourd'hui
  const isToday = useMemo(() => {
    const today =
      new Date()
        .toLocaleDateString("fr-FR", { weekday: "long" })
        .charAt(0)
        .toUpperCase() +
      new Date().toLocaleDateString("fr-FR", { weekday: "long" }).slice(1);
    return today === day;
  }, [day]);

  // Trier les tâches par période
  const { morningTasks, afternoonTasks } = useMemo(() => {
    return {
      morningTasks: tasks
        .filter((task) => task.location.period === "morning")
        .sort(
          (a, b) => (a.location.position || 0) - (b.location.position || 0)
        ),
      afternoonTasks: tasks
        .filter((task) => task.location.period === "afternoon")
        .sort(
          (a, b) => (a.location.position || 0) - (b.location.position || 0)
        ),
    };
  }, [tasks]);

  return (
    <div
      className={`h-full flex flex-col border ${
        isToday ? "border-blue-400" : "border-gray-200"
      } bg-white rounded-lg shadow-sm`}
    >
      <div className="h-8 flex items-center px-3 py-6 border-b">
        <h2
          className={`font-medium ${
            isToday ? "text-blue-600" : "text-gray-700"
          }`}
        >
          {day}
        </h2>
      </div>

      <div className="flex-1 grid grid-rows-2 divide-y">
        <TimeBlock
          period="morning"
          day={day}
          tasks={morningTasks}
          onAddTask={onAddTask}
          activeId={activeId}
          maxTasks={4}
        />

        <TimeBlock
          period="afternoon"
          day={day}
          tasks={afternoonTasks}
          onAddTask={onAddTask}
          activeId={activeId}
          maxTasks={4}
        />
      </div>
    </div>
  );
};

export default DayColumn;
