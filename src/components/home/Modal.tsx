import React from "react";
import { FaTimes } from "react-icons/fa";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  // Close the modal when clicking outside of the content
  const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 font-stix"
      onClick={handleBackdropClick}
    >
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 max-w-md w-full h-[90vh] overflow-hidden rounded-lg shadow-lg relative">
        <button
            onClick={onClose}
            className="absolute mt-2 top-4 right-4 text-light-text bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-2xl p-2 rounded-full"
          >
            <FaTimes size={16} />
         </button>
        <div className="h-full overflow-y-scroll p-6 modal-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
