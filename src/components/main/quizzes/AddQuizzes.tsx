import React from 'react';
import { FaPlus, FaSpinner } from 'react-icons/fa';

interface AddQuizzesCardProps {
  isLoading?: string;
  onClick: () => void;
}

const AddQuizzesCard: React.FC<AddQuizzesCardProps> = ({ onClick, isLoading }) => {
  return (
    <div
      onClick={onClick}
      className="bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 dark:from-blue-800 dark:via-blue-900 dark:to-blue-600 rounded-xl shadow-lg p-6 flex flex-col items-center justify-center cursor-pointer transform transition-transform duration-300 hover:scale-105 font-stix"
    >
      { isLoading === "generate"? <FaSpinner className ="animate-spin text-white mb-2 text-4xl"/> : <FaPlus className="text-4xl text-white mb-4" />}
      <p className="text-lg font-bold text-white">More</p>
    </div>
  );
};

export default AddQuizzesCard;
