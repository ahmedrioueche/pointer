import { capitalizeFirstLetter } from '@/utils/formater';
import React from 'react';
import { FaCalendarAlt, FaEdit, FaMedal, FaStar, FaTasks } from 'react-icons/fa';

interface ProfileCardProps {
  user?: any;
  name: string;
  age: number;
  gender: string;
  level?: string;
  currentPoints?: number;
  icon?: string;
  onEditProfile: () => void;
  onAssignTasks: () => void;
  onOpenEditAvatarModal: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({
  user,
  name,
  age,
  gender,
  currentPoints,
  level,
  icon,
  onEditProfile,
  onAssignTasks,
  onOpenEditAvatarModal,
}) => {
  const genderImage = gender?.toLowerCase() === 'male' ? '/avatars/boy_1.png' : '/avatars/girl_1.png';

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-r transform transition-transform hover:scale-105 from-teal-500 to-cyan-500 p-4 rounded-lg shadow-lg text-dark-text dark:text-dark-text max-h-[300px] overflow-hidden">
      <div onClick={onOpenEditAvatarModal} className="mb-2 flex items-center justify-center hover:cursor-pointer hover:scale-105">
        <img src={icon || genderImage} style={{ width: '120px', height: '120px' }} alt="Profile" />
      </div>
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold font-satisfy">{name}</h1>
        <p className="text-md md:text-lg font-light mt-1 font-satisfy">
          <FaCalendarAlt className="inline-block mr-1" /> Age {age}
        </p>
        <div className="flex flex-row justify-center items-center font-satisfy mt-1">
          {level && (
            <p className="text-md md:text-lg font-light mr-3">
              <FaMedal className="inline-block mr-1" /> {capitalizeFirstLetter(level)}
            </p>
          )}
          {currentPoints && currentPoints > 0 && (
            <p className="text-md md:text-lg font-light">
              <FaStar className="inline-block mr-1 mb-1" /> {currentPoints}
            </p>
          )}
        </div>

        {user.type === 'parent' && (
          <div className="flex justify-center mt-2">
            <button
              className="flex items-center gap-2 px-4 py-1.5 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 hover:text-light-text dark:hover:text-light-text transition-colors duration-300"
              onClick={onEditProfile}
            >
              <FaEdit />
              <span>Edit</span>
            </button>
            <button
              className="flex items-center gap-2 px-3 py-1.5 ml-6 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 hover:text-light-text dark:hover:text-light-text transition-colors duration-300"
              onClick={onAssignTasks}
            >
              <FaTasks />
              <span>Tasks</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
