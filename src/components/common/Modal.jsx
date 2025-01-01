const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
    >
      <div
        onClick={(e) => e.stopPropagation}
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;
