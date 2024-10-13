import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { FaPlus, FaRocket, FaSpinner } from 'react-icons/fa';
import { Task } from '@/types/interface';

interface CardProps {
  id?: number;
  name: string;
  age: number;
  gender: 'male' | 'female';
  avatar?: string;
  budget?: number;
  pendingTasks?: Task[];
  type?: 'task_page' | 'budget_modal' | 'challenge_card' | 'create_challenge' | 'quiz';
  callback: (id?: number, budget?: number) => void;
}

const ChildCard: React.FC<CardProps> = ({ id, name, age, gender, budget, avatar, pendingTasks = [], type, callback }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [newBudget, setNewBudget] = useState<number>(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    if (budget) setNewBudget(budget);
  }, [budget]);

  const handleAssignTaskClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    callback(id);
  };

  const hanldeAddChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    callback(id);
  };

  
  const handleBudgetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewBudget(Number(e.target.value));
  };

  const handleSetBudgetClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    callback(id, newBudget);
  };

  useEffect(() => {
    const handleResize = () => {
        setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);

  const handleSelectChild = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("id", id)
    callback(id);
  }

  const maleGradient = 'bg-gradient-to-br from-blue-300 to-blue-500';
  const femaleGradient = 'bg-gradient-to-br from-pink-300 to-pink-500';

  const maleHoverGradient = 'hover:bg-gradient-to-br hover:from-blue-400 hover:to-blue-600';
  const femaleHoverGradient = 'hover:bg-gradient-to-br hover:from-pink-400 hover:to-pink-600';

  const gradientBg = gender === 'male' ? maleGradient : femaleGradient;
  const hoverBg = gender === 'male' ? maleHoverGradient : femaleHoverGradient;

  return (
    <div
      className={`flex items-center p-4 ${gradientBg} ${hoverBg} z-[0] text-white rounded-lg shadow-lg transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer mb-4 relative`}
    >
      {/* Profile Picture and Name/Age */}
      <div className="flex items-center">
        {/* Profile Picture */}
        <div className={`${type === "quiz" ? "w-20 h-20" : 'w-24 h-24 '} rounded-full overflow-hidden`}>
          <Image
            src={avatar || '/default-avatar.png'}
            alt={gender === 'male' ? 'Boy' : 'Girl'}
            width={96}
            height={96}
            className="object-cover h-full w-full"
          />
        </div>

        {/* Name and Age */}
        {(type === "task_page" || type === "challenge_card" || type === "create_challenge" || type === "quiz" || !isSmallScreen) && (
          <div className="ml-4">
            <h3 className="text-xl font-semibold font-satisfy">
              {name}, {age}
            </h3>
            {type !== 'budget_modal' && pendingTasks.length > 0 && (
              <p className="text-sm text-gray-200 mt-1 font-stix">
                Pending Tasks: {pendingTasks.length}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Assign Task Button */}
      {type === 'task_page' && (
        <button
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white text-light-primary font-medium rounded-full shadow-md hover:text-white transition-colors duration-300
        hover:bg-gradient-to-br ${gender === 'male' ? 'hover:from-blue-300 hover:to-blue-500' : 'hover:from-pink-300 hover:to-pink-500'}`}
          onClick={handleAssignTaskClick}
        >
          {isLoading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
        </button>
      )}

      {type === 'create_challenge' && (
        <button
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white text-light-primary font-medium rounded-full shadow-md hover:text-white transition-colors duration-300
            hover:bg-gradient-to-br ${gender === 'male' ? 'hover:from-blue-300 hover:to-blue-500' : 'hover:from-pink-300 hover:to-pink-500'}`}
          onClick={hanldeAddChild}
        >
          {isLoading ? <FaSpinner className="animate-spin" /> : <FaPlus />}
        </button>
      )}

      {type === 'quiz' && (
        <button
          className={`absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-white text-light-primary font-medium rounded-full shadow-md hover:text-white transition-colors duration-300
            hover:bg-gradient-to-br ${gender === 'male' ? 'hover:from-blue-300 hover:to-blue-500' : 'hover:from-pink-300 hover:to-pink-500'}`}
           onClick={handleSelectChild}
        >
          {isLoading ? <FaSpinner className="animate-spin" /> : <FaRocket />}
        </button>
      )}

      {type === 'budget_modal' && !isSmallScreen && (
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center">
          <div className="relative w-28">
            <input
              type="number"
              value={newBudget}
              onChange={handleBudgetChange}
              placeholder="Set Budget"
              className={`px-4 py-2 mt-1 rounded-md text-white w-full pr-8 no-spinner outline-none border border-white ${gradientBg}`}
            />
            <span className="absolute inset-y-0 right-2 mt-1 flex items-center text-lg text-white">$</span>
          </div>
          <button
            className="p-2 bg-green-500 text-white font-medium rounded-full shadow-md hover:bg-green-600 transition-colors duration-300 ml-2"
            onClick={handleSetBudgetClick}
          >
            Set
          </button>
        </div>
      )}

      {type === 'budget_modal' && isSmallScreen && (
        <div className="absolute right-5 top-1/2 justify-center transform -translate-y-1/2 flex flex-col">
          {/* Name and Age in a separate row */}
          <div className="flex justify-start mb-2 left-0">
            <h3 className="text-lg font-semibold font-satisfy">
              {name}, {age}
            </h3>
          </div>

          {/* Input Field and Set Button */}
          <div className="flex items-center">
            <div className="relative w-28">
              <input
                type="number"
                value={newBudget}
                onChange={handleBudgetChange}
                placeholder="Set Budget"
                className={`px-4 py-2 mt-1 rounded-md text-white w-full pr-8 no-spinner outline-none border border-white ${gradientBg}`}
              />
              <span className="absolute inset-y-0 right-2 mt-1 flex items-center text-lg text-white">$</span>
            </div>
            <button
              className="p-2 bg-green-500 text-white font-medium rounded-full shadow-md hover:bg-green-600 transition-colors duration-300 ml-2"
              onClick={handleSetBudgetClick}
            >
              Set
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChildCard;
