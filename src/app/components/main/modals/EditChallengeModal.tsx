import React, { useState, useEffect } from 'react';
import { FaTrophy, FaTasks, FaGift, FaUsers, FaClipboard, FaClock, FaArrowCircleDown, FaArrowCircleUp, FaSpinner, FaTimes, FaPlus } from 'react-icons/fa';
import ChildCardHori from '../child/ChildCardHori';
import { Challenge, Child } from '@/types/interface';
import { assertInt } from '@/utils/helper';

interface EditChallengeModalProps {
  user: any;
  challenge?: Challenge ;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (updatedChallenge: Challenge) => void;
  childrenData: Child[];
}

const EditChallengeModal: React.FC<EditChallengeModalProps> = ({ user, challenge, isOpen, onClose, onUpdate, childrenData }) => {
  const [challengeName, setChallengeName] = useState(challenge?.name || '');
  const [description, setDescription] = useState<string | undefined>(challenge?.description || '');
  const [points, setPoints] = useState<number>(challenge?.points || 0);
  const [assignedTo, setAssignedTo] = useState<string | undefined>(challenge?.assignedTo || '');
  const [rewards, setRewards] = useState<string | undefined>(challenge?.rewards || '');
  const [time, setTime] = useState<Date>(new Date(challenge?.time || Date.now()));
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  useEffect(() => {
    if(challenge){
        setChallengeName(challenge.name);
        setDescription(challenge.description);
        setPoints(challenge.points);
        setAssignedTo(challenge.assignedTo);
        setRewards(challenge.rewards);
        setTime(new Date(challenge.time || Date.now()));
    }
 
  }, [challenge]);

  const handleUpdateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!challengeName || points === undefined) {
      console.error('Challenge name and points are required');
      return;
    }

    const updatedChallenge: any = {
      ...challenge,
      name: challengeName,
      description,
      points,
      assignedTo,
      rewards,
      time: time || undefined,
    };

    onUpdate(updatedChallenge);
    onClose();
  };

  const handleSelectChild = (childId: string) => {
    const assignedToArray = assignedTo ? assignedTo.split(',').filter(Boolean) : [];
    if (!assignedToArray.includes(String(childId))) {
      const updatedAssignedTo = [...assignedToArray, childId].join(',');
      setAssignedTo(updatedAssignedTo);
    }
  };

  const handleRemoveChild = (childId: string) => {
    setAssignedTo((prev) => {
      const updatedIds = prev? prev
        .split(',')
        .filter((id) => id.trim() !== '' && id !== childId)
        .join(',') : undefined;
      return updatedIds;
    });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return isOpen ? (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 transition-transform duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}
    >    {/* Title */}
        <div className="bg-gradient-to-r from-blue-300 via-blue-500 to-blue-700 dark:from-blue-800 dark:via-blue-900 dark:to-blue-600 rounded-lg shadow-lg p-4 px-8 mt-3 w-full md:w-[70vw] lg:w-[70vw] max-h-[95vh] overflow-y-auto flex flex-col task-menu font-stix">
        <div className="flex justify-between items-center p-3">
          <div className="flex items-center text-light-text dark:text-dark-text">
            <FaTrophy className="text-3xl mr-3" />
            <h2 className="text-xl font-bold font-satisfy">Edit Challenge</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-light-text hover:text-dark-text"
          >
            <FaTimes size={16} />
          </button>
        </div>
        <>
          {/* Form */}
          <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Challenge Name */}
            <div className="relative col-span-1">
              <label className="block md:text-lg text-base font-semibold text-gray-200 mb-2">
                <FaClipboard className="inline mr-2" /> Challenge Name
              </label>
              <input
                type="text"
                className="w-full p-4 rounded-lg bg-white bg-opacity-20 placeholder-transparent text-white border border-gray-300 focus:border-yellow-500 focus:ring-0 focus:outline-none transition-all duration-300"
                value={challengeName}
                onChange={(e) => setChallengeName(e.target.value)}
                placeholder="Enter challenge name"
                required
              />
            </div>
  
            {/* Points */}
            <div className="relative col-span-1">
              <label className="block md:text-lg text-base font-semibold text-gray-200 mb-2">
                <FaGift className="inline mr-2" /> Points
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
              <label className="block md:text-lg text-base font-semibold text-gray-200 mb-2">
                <FaTasks className="inline mr-2" /> Description
              </label>
              <textarea
                className="w-full p-4 rounded-lg bg-white bg-opacity-20 placeholder-transparent text-white border border-gray-300 focus:border-yellow-500 focus:ring-0 focus:outline-none transition-all duration-300"
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
                <FaGift className="inline mr-2" /> Rewards
                </label>
                <div className="mt-4">
                
                <button
                    type="button"
                    onClick={openModal}
                    className="mt-4 flex items-center text-yellow-400 hover:text-yellow-500 transition-all duration-300"
                >
                    <FaPlus className="mr-2" /> Add Reward
                </button>
                </div>
            </div>
  
            {/* Time Limit */}
            <div className="relative col-span-1">
              <label className="block md:text-lg text-base font-semibold text-gray-200 mb-2">
                <FaClock className="inline mr-2" /> Time Limit
              </label>
              <input
                type="datetime-local"
                className="w-full p-4 rounded-lg bg-white bg-opacity-20 placeholder-transparent text-white border border-gray-300 focus:border-yellow-500 focus:ring-0 focus:outline-none transition-all duration-300"
                value={time.toISOString().slice(0, 16)}
                onChange={(e) => setTime(new Date(e.target.value))}
              />
            </div>
  
            {/* Assign To Children */}
            <div className="relative col-span-1 md:col-span-2">
              <label className="block md:text-lg text-base font-semibold text-gray-200 mb-2">
                <FaUsers className="inline mr-2" /> Assign to Children
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                {childrenData &&
                  childrenData.length > 0 &&
                  childrenData.map((child) => (
                    <ChildCardHori
                      key={child.id}
                      type='create_challenge'
                      name={child.name}
                      age={child.age}
                      gender={child.gender}
                      avatar={child.avatar}
                      callback={() => handleSelectChild(String(child.id))}
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
                        const selectedChild = childrenData.find((child) => assertInt(child.id) === assertInt(childId));
                        return selectedChild ? (
                          <span
                            key={index}
                            className="relative inline-block bg-yellow-400 text-gray-800 px-6 py-2 rounded-full cursor-pointer group"
                          >
                            {selectedChild.name}
                            <span
                              onClick={() => handleRemoveChild(childId)}
                              className="absolute top-0 right-0 p-1 text-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
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
                onClick={handleUpdateChallenge}
                className="w-full bg-yellow-400 text-gray-800 font-bold text-sm md:text-base uppercase py-4 rounded-lg hover:bg-yellow-500 transition-all duration-300"
              >
                {isLoading ? <FaSpinner className="animate-spin" /> : 'Update Challenge'}
              </button>
            </div>
          </div>
        </>
    </div>
    </div>
  ) : null;
  
};

export default EditChallengeModal;
