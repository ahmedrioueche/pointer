import React, { useState } from 'react';
import { FaCalendarAlt, FaEdit, FaStar } from 'react-icons/fa';
import ProfileModal from './ProfileModal';

interface ProfileCardProps {
  name: string;
  age: number;
  gender: string;
  level: string;
  onClick: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, age, gender, level, onClick}) => {
  const genderImage = gender.toLowerCase() === 'male' ? '/icons/boy_1.png' : '/icons/girl_1.png';

  return (
    <div className="flex flex-col items-center md:items-start bg-gradient-to-r transform transition-transform hover:scale-105 from-teal-500 to-cyan-500 p-6 rounded-lg shadow-lg text-dark-text dark:text-dark-text max-h-[400px] overflow-hidden">
      <div className="flex-shrink-0 mb-4 flex items-center">
        <img src={genderImage} alt={gender} className="w-40 h-40 md:w-36 md:h-36 rounded-full shadow-lg" />
      </div>
      <div className="text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-bold font-satisfy">{name}</h1>
        <p className="text-lg md:text-xl font-light mt-1">
          <FaCalendarAlt className="inline-block mr-1" /> Age {age}
        </p>
        <p className="text-lg md:text-xl font-light mt-1">
          <FaStar className="inline-block mr-1" /> Level {level}
        </p>
        <div className='flex flex-col mt-4'>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-light-accent dark:hover:bg-dark-accent hover:text-light-text dark:hover-text-light-text transition-colors duration-300"
            onClick={onClick}>
            <FaEdit />
            <span>Edit Profile</span>
          </button>
        </div>
      </div>
    
    </div>
  );
};

export default ProfileCard;
