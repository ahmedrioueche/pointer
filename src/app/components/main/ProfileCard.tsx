import React from 'react';
import { FaCalendarAlt, FaStar } from 'react-icons/fa';

interface ProfileCardProps {
  name: string;
  age: number;
  gender: string;
  level: string;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, age, gender, level }) => {
  const genderImage = gender.toLowerCase() === 'male' ? '/icons/boy_1.png' : '/icons/girl_1.png';

  return (
    <div className="flex flex-col items-center md:items-start bg-gradient-to-r transform transition-transform hover:scale-105 from-teal-500 to-cyan-500 p-6 rounded-lg shadow-lg text-light-text dark:text-dark-text max-h-[400px] overflow-hidden">
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
      </div>
    </div>
  );
};

export default ProfileCard;
