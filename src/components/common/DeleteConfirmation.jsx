import { AlertTriangle } from 'lucide-react';
import { createPortal } from 'react-dom';

const DeleteConfirmation = ({ isOpen, onClose, onConfirm, taskTitle }) => {
  if (!isOpen) return null;

  // Utiliser createPortal pour monter le modal au niveau racine du DOM
  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] isolate" // z-index très élevé et isolation
      style={{ 
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        backdropFilter: 'blur(4px)'
      }}
    >
      {/* Overlay qui bloque les interactions avec le reste de l'app */}
      <div 
        className="absolute inset-0"
        onClick={onClose}
      />

      {/* Modal centré avec z-index encore plus élevé */}
      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            className="relative bg-white rounded-lg p-6 max-w-sm w-full shadow-2xl z-[10000]"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Confirmer la suppression
              </h3>
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
      </div>
    </div>,
    document.body // Monter le modal directement dans le body
  );
};

export default DeleteConfirmation;