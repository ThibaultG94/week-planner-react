import { useState } from 'react';
import { Calendar, Plus, X } from 'lucide-react';
import TaskForm from './TaskForm';

const AppHeader = ({ onAddTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">WeekPlanner</h1>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus size={20} className="mr-2" />
              Nouvelle tâche
            </button>
          </div>
        </div>
      </header>

      {/* Modal pour le formulaire */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-semibold">Nouvelle tâche</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-4">
              <TaskForm
                onSubmit={async (task) => {
                  await onAddTask(task);
                  setIsModalOpen(false);
                }}
                onCancel={() => setIsModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AppHeader;