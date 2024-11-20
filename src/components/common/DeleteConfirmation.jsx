import { AlertTriangle } from 'lucide-react';

const DeleteConfirmation = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="w-6 h-6 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900">Confirmer la suppression</h3>
        </div>
        
        <p className="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer la tâche "{taskTitle}" ? Cette action est irréversible.
        </p>
        
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-600 transition-colors"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;