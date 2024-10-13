import React, { useState } from 'react';
import { FaTimes, FaStar } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface PointsModalProps {
  isOpen: boolean;
  onClose: () => void;
  points: number;
}

const PointsModal: React.FC<PointsModalProps> = ({ isOpen, onClose, points }) => {
  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 transition-transform duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-[90vw] max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4 p-4">
          <div className="flex items-center text-light-text dark:text-dark-text">
            <FaStar className="text-3xl text-yellow-500 mr-3" />
            <h2 className="text-xl font-bold">Your Points</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-light-text hover:text-dark-text"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="text-center">
          <p className="text-3xl font-semibold text-light-text dark:text-dark-text">
            You have <span className="text-yellow-500">{points}</span> points!
          </p>
          <div className="mt-6">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-full transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PointsModal;
