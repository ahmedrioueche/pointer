import { capitalizeFirstLetter } from '@/utils/formater';
import React from 'react';
import { FaCalendarAlt, FaEdit, FaMedal, FaStar, FaTasks } from 'react-icons/fa';

interface ProfileCardProps {
  name: string;
  age: number;
  gender: string;
  level?: string;
  currentPoints? : number;
  icon?: string;
  onEditProfile: () => void;
  onAssignTasks: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, age, gender, currentPoints: currentPoints, level, icon, onEditProfile, onAssignTasks }) => {
  const genderImage = gender?.toLowerCase() === 'male' ? '/icons/boy_1.png' : '/icons/girl_1.png';
  
  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r transform transition-transform hover:scale-105 from-teal-500 to-cyan-500 p-6 rounded-lg shadow-lg text-dark-text dark:text-dark-text max-h-[400px] overflow-hidden">
      <div className="mb-4 flex items-center justify-center">
        <img src={icon || genderImage} style={{ width: '200px', height: '200px' }} alt="Profile" />
      </div>
      <div className="text-center">
        <h1 className="text-3xl md:text-4xl font-bold font-satisfy">{name}</h1>
        <p className="text-lg md:text-xl font-light mt-1 font-satisfy">
          <FaCalendarAlt className="inline-block mr-1" /> Age {age}
        </p>
        <div className='flex flex-row justify-center items-center font-satisfy mt-2'>
        {level && (
          <p className="text-lg md:text-xl font-light mr-4">
            <FaMedal className="inline-block mr-1" /> { capitalizeFirstLetter(level)}
          </p>
        )}
        {currentPoints && currentPoints > 0 && (
          <p className="text-lg md:text-xl font-light">
            <FaStar className="inline-block mr-1 mb-1" /> {currentPoints}
          </p>
        )}
        </div>
        
        <div className="flex justify-center mt-3">
          <button
            className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-light-accent dark:hover:bg-dark-accent hover:text-light-text dark:hover-text-light-text transition-colors duration-300"
            onClick={onEditProfile}
          >
            <FaEdit />
            <span>Edit</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 ml-10 bg-blue-600 text-white rounded-lg shadow-md hover:bg-light-accent dark:hover:bg-dark-accent hover:text-light-text dark:hover-text-light-text transition-colors duration-300"
            onClick={onAssignTasks}
          >
            <FaTasks />
            <span>Tasks</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
