import React from 'react';
import { FaClipboardList, FaEdit, FaTimes } from 'react-icons/fa';
import { Child } from '@/types/interface';
import { CHILDREN_AVATAR_COUNT } from '@/data/values';

interface EditAvatarModalProps {
  isOpen: boolean;
  child: Child;
  onUpdate: (avatar: string) => void;
  onClose: () => void;
}

const EditAvatarModal: React.FC<EditAvatarModalProps> = ({ isOpen, child, onUpdate, onClose }) => {
  const type = child.gender === "male" ? "boy" : "girl";

  // Function to generate the avatar list
  const getAvatarList = () => {
    const avatars = [];
    for (let i = 1; i <= CHILDREN_AVATAR_COUNT; i++) {
      avatars.push(
        <div key={i} className="p-2 flex justify-center">
          <img
            src={`/avatars/${type}_${i}.png`} 
            alt={`${type} avatar ${i}`}
            className="w-24 h-24 object-cover rounded-full cursor-pointer hover:opacity-80 hover:scale-110 transition-transform duration-300"
            onClick={() => {
              onUpdate(`/avatars/${type}_${i}.png`);
              onClose();
            }}
          />
        </div>
      );
    }
    return avatars;
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 transition-transform duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-full md:w-[30vw] lg:w-[40vw] max-h-[98vh] overflow-y-auto flex flex-col task-menu">
        <div className="flex justify-between items-center mb-3 p-3">
          <div className="flex items-center text-light-text dark:text-dark-text">
            <FaEdit className="text-xl mr-3" />
            <h2 className="text-xl font-stix">Change Avatar</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-light-text hover:text-dark-text"
          >
            <FaTimes size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {getAvatarList()}
        </div>
      </div>
    </div>
  );
};

export default EditAvatarModal;
