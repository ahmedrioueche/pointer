import React, { useEffect, useState } from 'react';
import { FaClipboardList, FaTimes, FaCalendarDay, FaDollarSign } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 transition-transform duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-[80vw] max-h-[80vh] overflow-y-auto task-menu">
        <div className="flex justify-between items-center mb-4 p-4">
          <div className="flex items-center text-light-text dark:text-dark-text">
            <FaClipboardList className="text-3xl mr-3" />
            <h2 className="text-xl font-stix">Profile</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-gray-700"
          >
            <FaTimes size={16} />
          </button>
        </div>

      </div>
    </div>
  );
};

export default ProfileModal;
