// Configuration des périodes et blocs
export const PERIODS = [
  { id: "morning-1", label: "Début de matinée", period: "morning", order: 0 },
  { id: "morning-2", label: "Milieu de matinée", period: "morning", order: 1 },
  { id: "morning-3", label: "Fin de matinée", period: "morning", order: 2 },
  { id: "morning-4", label: "Fin de matinée", period: "morning", order: 3 },
  {
    id: "afternoon-1",
    label: "Début d'après-midi",
    period: "afternoon",
    order: 4,
  },
  {
    id: "afternoon-2",
    label: "Milieu d'après-midi",
    period: "afternoon",
    order: 5,
  },
  {
    id: "afternoon-3",
    label: "Fin d'après-midi",
    period: "afternoon",
    order: 6,
  },
  {
    id: "afternoon-4",
    label: "Fin d'après-midi",
    period: "afternoon",
    order: 7,
  },
];

// Obtenir tous les blocs entre deux positions
export const getBlocksBetween = (startBlock, endBlock) => {
  const startOrder = PERIODS.find((p) => p.id === startBlock)?.order || 0;
  const endOrder = PERIODS.find((p) => p.id === endBlock)?.order || 0;

  return PERIODS.filter(
    (p) =>
      p.order >= Math.min(startOrder, endOrder) &&
      p.order <= Math.max(startOrder, endOrder)
  ).map((p) => p.id);
};

// Vérifier si deux tâches se chevauchent
export const tasksOverlap = (task1, task2) => {
  if (task1.day !== task2.day) return false;

  const task1Blocks = getBlocksBetween(task1.startBlock, task1.endBlock);
  const task2Blocks = getBlocksBetween(task2.startBlock, task2.endBlock);

  return task1Blocks.some((block) => task2Blocks.includes(block));
};

// Vérifier si un bloc est disponible
export const isBlockAvailable = (
  block,
  existingTasks,
  maxTasksPerBlock = 4
) => {
  const tasksInBlock = existingTasks.filter((task) =>
    getBlocksBetween(task.startBlock, task.endBlock).includes(block)
  );

  return tasksInBlock.length < maxTasksPerBlock;
};

// Calculer la hauteur d'une tâche en fonction de ses blocs
export const calculateTaskHeight = (startBlock, endBlock) => {
  const blocks = getBlocksBetween(startBlock, endBlock);
  return blocks.length;
};

// Vérifier si une tâche peut être étendue à un certain bloc
export const canExtendTask = (
  task,
  targetBlock,
  existingTasks,
  maxTasksPerBlock = 4
) => {
  const potentialBlocks = getBlocksBetween(task.startBlock, targetBlock);

  return potentialBlocks.every((block) => {
    const tasksInBlock = existingTasks.filter(
      (t) =>
        t.id !== task.id && // Ignorer la tâche actuelle
        getBlocksBetween(t.startBlock, t.endBlock).includes(block)
    );
    return tasksInBlock.length < maxTasksPerBlock;
  });
};
