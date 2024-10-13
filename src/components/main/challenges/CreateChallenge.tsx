import React, { useEffect, useRef, useState } from 'react';
import { FaTasks, FaGift, FaUsers, FaClipboard, FaPlus, FaTrophy, FaClock, FaArrowAltCircleDown, FaArrowAltCircleUp, FaArrowCircleDown, FaArrowCircleUp, FaSpinner } from 'react-icons/fa';
import ChildCardHori from '../child/ChildCardHori';
import { useData } from '@/app/context/dataContext';
import AddRewardModal from '../modals/AddRewardModal'; // Assuming you have a Modal component
import { Challenge, Child } from '@/types/interface';
import { assertInt } from '@/lib/helper';
import { User } from 'lucide-react';
import { Reward } from '@prisma/client';
import { capitalizeFirstLetter } from '@/lib/formater';

interface CreateChallengeProps {
  user : any;
  onCreate: (newChallenge: Challenge) => void;
  childrenData: Child[];
}

const titles = {
  challengeName: 'Challenge Name',
  points: 'Points',
  description: 'Description',
  assignToChildren: 'Assign to Children',
  rewards: 'Rewards',
  timeLimit: 'Challenge Time',
};

const CreateChallenge: React.FC<CreateChallengeProps> = ({user, onCreate, childrenData }) => {
  const [challengeName, setChallengeName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [points, setPoints] = useState<number>(0);
  const [assignedTo, setAssignedTo] = useState<string>();
  const [rewards, setRewards] = useState<string>();
  const [time, setTime] = useState<Date>(new Date());
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [newReward, setNewReward] = useState<string>('');
  const addRewardModalRef = useRef<HTMLDivElement | null>(null);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
  
    // Check for required fields
    if (!challengeName || points === undefined) {
      // You might want to show an error message or handle this scenario
      console.error('Challenge name and points are required');
      return;
    }
  
    // Create the new challenge object
    const newChallenge: Challenge = {
      id: Date.now(),
      parentId: user.id,
      name: challengeName,
      description: description || '', 
      points: points,
      assignedTo: assignedTo || '', 
      rewards: rewards || '', 
      time: time || undefined, 
    };
  
    // Call the onCreate function with the new challenge
    onCreate(newChallenge);
  
    // Reset form fields after submission
    setChallengeName('');
    setDescription('');
    setPoints(0);
    setAssignedTo('');
    setRewards('');
    setTime(new Date());
  };
  

  const handleSelectChild = (childId: string) => {
    // Split the string by commas into an array, filter out any empty strings
    const assignedToArray = assignedTo ? assignedTo.split(',').filter(Boolean) : [];
    console.log("assignedToArray", assignedToArray)
    // Check if the child ID is already in the array
    if (!assignedToArray.includes(String(childId))) {
      // Add the new child ID and update the string
      const updatedAssignedTo = [...assignedToArray, childId].join(',');
      console.log("updatedAssignedTo", updatedAssignedTo)

      setAssignedTo(updatedAssignedTo);
    }
  };

  const handleRemoveChild = (childId: string) => {
    setAssignedTo((prev : any) => {
      const updatedIds = prev? prev
        .split(',')
        .filter((id : any) => id.trim() !== '' && id !== childId)
        .join(',') : null;
      return updatedIds;
    });
  };
  
  
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addRewardModalRef.current && !addRewardModalRef.current.contains(event.target as Node)) {
        console.log("close the damn thing!")
        setIsModalOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCollapse = (e: { stopPropagation: () => void; }) => {
    e.stopPropagation();
    setIsCollapsed(prev => !prev)
  }

  const handleAddReward = (reward: any) => {
    // Format the new reward
    const newReward = reward.description? `${reward.name}: ${reward.description}` : `${reward.name}`;
  
    // Update the rewards state with the new reward, separated by commas
    setRewards((prevRewards) => {
      // Check if prevRewards is empty or undefined
      const updatedRewards = prevRewards
        ? `${prevRewards}, ${newReward}`
        : newReward;
  
      return updatedRewards;
    });
  
    // Close the modal
    setIsModalOpen(false);
  };
  

  const handleRemoveReward = (reward: string) => {
    // Parse the rewards string into an array
    const rewardArray = rewards? rewards.split(',').filter(Boolean) : null;
  
    // Remove the specified reward
    const updatedRewardArray = rewardArray? rewardArray.filter((r : any) => r.trim() !== reward.trim()) : null; 
  
    // Update the rewards state with the new comma-separated string
    updatedRewardArray? setRewards(updatedRewardArray.join(',')) : null;
  };
  

  return (
    <div className="bg-gradient-to-r from-blue-800 via-blue-900 to-blue-600 md:p-8 p-6 rounded-lg shadow-lg mb-6 w-full max-w-4xl mx-auto relative overflow-hidden font-stix">
      {/* Title */}
      <div onClick={handleCollapse} className='flex flex-row justify-between items-center cursor-pointer'>
        <h2 className="md:text-2xl text-xl font-extrabold font-satisfy text-white animate-fade-in flex flex-row items-center">
          <FaTrophy className='mr-3'/>
          Create a New Challenge
        </h2>
        <button
          onClick={handleCollapse}
          className="p-2 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-light-text hover:text-dark-text flex items-center justify-center"
        >
          {isCollapsed ? (
            <FaArrowCircleDown size={20} />
          ) : (
            <FaArrowCircleUp size={20} />
          )}
        </button>
      </div>

      {!isCollapsed && (
        <>
        {/* Form */}
       <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Challenge Name */}
         <div className="relative col-span-1">
            <label className="block md:text-lg text-base font-semibold text-gray-200 mb-2">
              <FaClipboard className="inline mr-2" /> {titles.challengeName}
            </label>
            <input
              type="text"
              className="w-full p-4 rounded-lg bg-white placeholder:text-gray-200 bg-opacity-20 placeholder-transparent text-white border border-gray-300 focus:border-yellow-500 focus:ring-0 focus:outline-none transition-all duration-300"
              value={challengeName}
              onChange={(e) => setChallengeName(e.target.value)}
              placeholder="Enter challenge name"
              required
            />
        </div>

        {/* Points */}
        <div className="relative col-span-1">
            <label className="block  md:text-lg text-base font-semibold text-gray-200 mb-2">
            <FaGift className="inline mr-2" /> {titles.points}
            </label>
            <input
            type="number"
            className="w-full p-4 rounded-lg bg-white bg-opacity-20 placeholder-transparent text-white border border-gray-300 focus:border-yellow-500 focus:ring-0 focus:outline-none transition-all duration-300 no-spinner"
            value={points}
            onChange={(e) => setPoints(parseInt(e.target.value))}
            placeholder="Enter points"
            required
            />
        </div>

        {/* Description */}
        <div className="relative col-span-1 md:col-span-2">
            <label className="block  md:text-lg text-base font-semibold text-gray-200 mb-2">
            <FaTasks className="inline mr-2" /> {titles.description}
            </label>
            <textarea
              className="w-full p-4 rounded-lg bg-white placeholder:text-gray-200 bg-opacity-20 placeholder-transparent text-white border border-gray-300 focus:border-yellow-500 focus:ring-0 focus:outline-none transition-all duration-300"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the challenge"
              required
            />
        </div>

        {/* Rewards */}
        <div className="relative col-span-1">
            <label className="block  md:text-lg text-base font-semibold text-gray-200 mb-2">
            <FaGift className="inline mr-2" /> {titles.rewards}
            </label>
            <div className="mt-4">
            <div className="mb-2">
            {rewards && rewards.trim() !== '' && ( 
              <div className="flex flex-wrap gap-2">
                {rewards
                  .split(',') // Assuming rewards are comma-separated
                  .filter(Boolean) 
                  .map((reward, index) => (
                      <span
                        key={index}
                        className="relative inline-block bg-yellow-400 text-gray-800 px-6 py-2 rounded-full cursor-pointer group"
                      >
                        {capitalizeFirstLetter(reward.trim())} {/* Display the reward name */}
                        <span onClick={() => handleRemoveReward(reward)} className="absolute top-0 right-0 p-1 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          &times;
                        </span>
                      </span>
                    ))
                }
              </div>
            )}
         </div>
            <button
                type="button"
                onClick={openModal}
                className="mt-4 flex items-center text-yellow-400 hover:text-yellow-500 transition-all duration-300"
            >
                <FaPlus className="mr-2" /> Add Reward
            </button>
            </div>
        </div>

          <div className="relative col-span-1">
              <label className="block md:text-lg text-base font-semibold text-gray-200 mb-2">
                <FaClock className="inline mr-2" /> Time Limit
              </label>
              <input
                type="datetime-local"
                className="w-full p-4 rounded-lg bg-white bg-opacity-20 placeholder-transparent text-white border border-gray-300 focus:border-yellow-500 focus:ring-0 focus:outline-none transition-all duration-300"
                value={time?.toISOString().slice(0, 16)}
                onChange={(e) => setTime(new Date(e.target.value))}
              />
            </div>

        {/* Assign To Children */}
        <div className="relative col-span-1 md:col-span-2">
            <label className="block md:text-lg text-base  font-semibold text-gray-200 mb-2">
            <FaUsers className="inline mr-2" /> {titles.assignToChildren}
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {childrenData && childrenData.length > 0 && childrenData.map((child: any) => (
                <ChildCardHori 
                  type='create_challenge'
                  key={child.id}
                  name={child.name} 
                  age={child.age} 
                  gender={child.gender} 
                  avatar={child.avatar}
                  callback={() => handleSelectChild(child.id)} 
                />
            ))}
            </div>

            <div className="mt-4">
            {assignedTo && assignedTo.trim() !== '' && ( 
              <div className="flex flex-wrap gap-2">
                {assignedTo
                  .split(',')
                  .filter(Boolean) 
                  .map((childId, index) => {
                    const selectedChild = childrenData.find(child => assertInt(child.id) === assertInt(childId));
                    return selectedChild ? (
                      <span
                        key={index}
                        className="relative inline-block bg-yellow-400 text-gray-800 px-6 py-2 rounded-full cursor-pointer group"
                      >
                        {selectedChild.name}
                        <span onClick={() => handleRemoveChild(childId)} className="absolute top-0 right-0 p-1 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          &times;
                        </span>
                      </span>
                    ) : null;
                  })}
              </div>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <div className="col-span-1 md:col-span-2">
            <button
              type="button"
              onClick={handleCreateChallenge} 
              className="w-full bg-yellow-400 text-gray-800 font-bold text-sm md:text-base uppercase py-4 rounded-lg hover:bg-yellow-500 transition-all duration-300"
              >
              { isLoading? <FaSpinner className='animate-spin'/>: "Create Challenge"}
            </button>
        </div>
      </div>

      <AddRewardModal
          onCreate={(reward) => handleAddReward(reward)}
          onClose={() => setIsModalOpen(false)}
          isOpen={isModalOpen}  
      />
        </>
      )}

    </div>
  );
};

export default CreateChallenge;
