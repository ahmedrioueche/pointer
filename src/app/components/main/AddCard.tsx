import React from 'react';
import { FaUserPlus } from 'react-icons/fa'; // Import a user plus icon from react-icons

const AddCard: React.FC = () => {
  return (
    <div
      className="relative bg-gradient-to-br from-purple-300 via-blue-400 to-teal-500 dark:from-purple-700 dark:via-blue-800 dark:to-teal-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="w-24 h-24 bg-gradient-to-r from-purple-500 via-blue-600 to-teal-700 dark:from-purple-800 dark:via-blue-900 dark:to-teal-800 rounded-full flex items-center justify-center shadow-xl">
          <FaUserPlus className="text-white text-5xl" />
        </div>
        <h3 className="text-3xl font-satisfy font-bold">
          Add Child
        </h3>
      </div>
    </div>
  );
};

export default AddCard;
