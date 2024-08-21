import React from 'react';
import { FaPlus } from 'react-icons/fa'; // Import a plus icon from react-icons

const AddCard: React.FC = () => {
  return (
    <div
      className="relative bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-6 rounded-lg shadow-lg flex items-center justify-center cursor-pointer transition-transform transform hover:scale-105 hover:shadow-xl"
      // Added hover shadow and scale transformation for a modern effect
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="w-20 h-20 bg-gradient-to-r from-light-accent to-light-primary dark:from-dark-accent dark:to-dark-primary rounded-full flex items-center justify-center shadow-lg">
          <FaPlus className="text-white text-4xl" />
          {/* Used a larger plus icon and changed the color to white */}
        </div>
        <h3 className="text-2xl font-semibold font-satisfy text-light-primary dark:text-dark-primary">
          Add Child
          {/* Updated font size and color for better visibility */}
        </h3>
      </div>
    </div>
  );
};

export default AddCard;
