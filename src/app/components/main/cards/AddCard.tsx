import React from 'react';
import { FaUserPlus, FaPlus } from 'react-icons/fa'; // Import FaUserPlus and FaPlus for the plus icon

const AddCard: React.FC = () => {
  return (
    <div
      className="relative bg-gradient-to-br from-purple-300 via-blue-400 to-teal-500 dark:from-purple-700 dark:via-blue-800 dark:to-teal-600 text-white p-6 rounded-lg shadow-lg flex items-center justify-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-2xl"
      style={{ height: '375px' }} // Fixed height added here
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="relative w-28 h-28 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 bg-gradient-to-r from-purple-500 via-blue-600 to-teal-700 dark:from-purple-800 dark:via-blue-900 dark:to-teal-800 rounded-full flex items-center justify-center shadow-xl">
          <img src="/icons/girl_7.png" alt="Child" className="w-24 h-24 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full" /> {/* Image in the center */}
        </div>
        <h3 className="text-3xl font-satisfy font-bold flex items-center space-x-2">
          <FaPlus className="text-white text-xl" /> {/* Add icon */}
          <span>Add Child</span>
        </h3>
      </div>
    </div>
  );
};

export default AddCard;
