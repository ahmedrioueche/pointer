import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaTasks, FaUser, FaChevronDown, FaSpinner } from 'react-icons/fa';
import { Task } from "../../../lib/interface";
import Link from 'next/link';

interface CardProps {
  id?: number;
  name: string;
  age: number;
  gender: 'male' | 'female';
  achievedTasks?: Task[];
  pendingTasks?: Task[];
  icon?: string;
  callback: any;
}

const ChildCard: React.FC<CardProps> = ({ id, name, age, gender, achievedTasks, pendingTasks, icon, callback }) => {
  const router = useRouter();
  const [isAchievedCollapsed, setIsAchievedCollapsed] = useState(true);
  const [isPendingCollapsed, setIsPendingCollapsed] = useState(true);
  const [isLoading, setIsLoading] = useState(false);


  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLoading(true);
    router.push(`/main/child/${id}`);
  };

  const handleTasksClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("id in handleTasksClicks", id)
    callback(id);
  };

  console.log("pendingTasks",pendingTasks);

  const maleGradient = 'bg-gradient-to-br from-blue-300 to-blue-500';
  const femaleGradient = 'bg-gradient-to-br from-pink-300 to-pink-500';

  const maleHoverGradient = 'hover:bg-gradient-to-br hover:from-blue-400 hover:to-blue-600';
  const femaleHoverGradient = 'hover:bg-gradient-to-br hover:from-pink-400 hover:to-pink-600';

  const gradientBg = gender === 'male' ? maleGradient : femaleGradient;
  const hoverBg = gender === 'male' ? maleHoverGradient : femaleHoverGradient;

  return (
    <div
      className={`relative p-6 ${gradientBg} ${hoverBg} z-[0] text-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer mb-4`}
    >
      <div onClick={handleProfileClick}>
        <div className="flex items-center justify-center w-38 h-30 mx-auto rounded-full overflow-hidden">
          <Image
            src={icon? icon : ""}
            alt={gender === 'male' ? 'Boy' : 'Girl'}
            width={90}
            height={90}
            className="object-cover h-32 w-32"
          />
        </div>

        {/* Name and Age */}
        <div className="mt-4 text-center">
          <h3 className="text-2xl font-stix mb-1">{name}, {age}</h3>
        </div>
      </div>
      {/* Achieved Tasks Section */}
      <div className={`mt-4 font-stix ${isAchievedCollapsed ? 'max-h-12' : 'max-h-[500px]'} overflow-hidden transition-[max-height] duration-300 ease-in-out`}>
        <div
          className="flex items-center justify-between hover:underline cursor-pointer"
          onClick={() => setIsAchievedCollapsed(!isAchievedCollapsed)}
        >
          <p className="text-md font-satisfy hover:underline">Achieved tasks today: {achievedTasks?.length}</p>
          <FaChevronDown
            className={`transition-transform ${isAchievedCollapsed ? 'rotate-0' : 'rotate-180'}`}
          />
        </div>

        {!isAchievedCollapsed && achievedTasks && (
          <div className="flex flex-col items-center justify-between w-full font-satisfy text-base mt-4">
            {achievedTasks.map(task => (
              <div
                key={task.id}
                className={`bg-transparent py-3 px-2 flex items-center rounded-md mb-2 shadow-sm w-full text-left hover:${gender === "male" ? `${maleGradient}` : `${femaleGradient}`}`}
              >
                <FaTasks className="text-dark-text mr-3" />
                <span className="text-left">{task.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pending Tasks Section */}
      <div className={`mt-4 font-stix ${isPendingCollapsed ? 'max-h-12' : 'max-h-[500px]'} overflow-hidden transition-[max-height] duration-300 ease-in-out`}>
        <div
          className="flex items-center justify-between hover:underline cursor-pointer"
          onClick={() => setIsPendingCollapsed(!isPendingCollapsed)}
        >
          <p className="text-md font-satisfy">Pending tasks today: {pendingTasks?.length}</p>
          <FaChevronDown
            className={`transition-transform ${isPendingCollapsed ? 'rotate-0' : 'rotate-180'}`}
          />
        </div>

        {!isPendingCollapsed && pendingTasks && (
          <div className="flex flex-col items-center justify-between w-full mt-2 font-satisfy text-base">
            {pendingTasks.map((task, index) => (
              <div
                key={index}
                className={`bg-transparent py-3 px-2 flex items-center rounded-md mb-2 shadow-sm w-full text-left hover:${gender === "male" ? `${maleGradient}` : `${femaleGradient}`}`}
              >
                <FaTasks className="text-dark-text mr-3" />
                <span className="text-left">{task.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile and Tasks Buttons */}
      <div className="mt-4 flex justify-between">
        <button
          className={`flex items-center mt-4 px-4 py-2 bg-white text-light-primary font-medium font-stix rounded-lg shadow-md hover:text-white transition-colors duration-300
          hover:bg-gradient-to-br ${gender === 'male' ? 'hover:from-blue-300 hover:to-blue-500' : 'hover:bg-gradient-to-br hover:from-pink-300 hover:to-pink-500'}`}
          onClick={handleProfileClick}
        >
            <FaUser className="mr-2" /> { isLoading?   <FaSpinner className="animate-spin text"/> :  "Profile"}

        </button>
        <button
          className={`flex items-center mt-4 px-4 py-2 bg-white text-light-primary font-medium font-stix rounded-lg shadow-md hover:text-white transition-colors duration-300
          hover:bg-gradient-to-br ${gender === 'male' ? 'hover:from-blue-300 hover:to-blue-500' : 'hover:bg-gradient-to-br hover:from-pink-300 hover:to-pink-500'}`}
          onClick={handleTasksClick}
        >
          <FaTasks className="mr-2" /> Tasks
        </button>
      </div>
    </div>
  );
};

export default ChildCard;