'use client';

import React, { useState } from 'react';
import { FaPlus, FaDollarSign, FaGlobeAmericas, FaXbox, FaPlaystation, FaLaptop, FaPhone, FaDog, FaEdit, FaTrashAlt, FaCheck, FaGift } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Reward } from '@/lib/interface';
import { bgColors } from '@/data/style';
import { RewardCard } from './RewardCard';

const initialRewards: Reward[] = [
  { title: "Money ($100)", points: 100, icon: FaDollarSign, bgColor: bgColors[0] },
  { title: "Trip to Europe", points: 1000, icon: FaGlobeAmericas, bgColor: bgColors[1] },
  { title: "Xbox", points: 300, icon: FaXbox, bgColor: bgColors[2] },
  { title: "PlayStation", points: 350, icon: FaPlaystation, bgColor: bgColors[3] },
  { title: "PC", points: 800, icon: FaLaptop, bgColor: bgColors[4] },
  { title: "Phone", points: 400, icon: FaPhone, bgColor: bgColors[5] },
  { title: "Pet", points: 600, icon: FaDog, bgColor: bgColors[6] },
];

const Rewards: React.FC = () => {
  const [rewards, setRewards] = useState<Reward[]>(initialRewards);

  const addReward = (newReward: Reward) => {
    setRewards([newReward, ...rewards]); // Prepend new reward
  };

  const modifyReward = (index: number) => {
    // Logic to modify the reward
    console.log("Modify reward:", index);
  };

  const removeReward = (index: number) => {
    setRewards(rewards.filter((_, i) => i !== index));
  };

  const actionReward = (index: number) => {
    // Logic for reward action (e.g., mark as redeemed)
    console.log("Action reward:", index);
  };

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <CreateReward onCreate={addReward} />
        </div>
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rewards.map((reward, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <RewardCard
                  type='reward_page'
                  {...reward}
                  onModify={() => modifyReward(index)}
                  onRemove={() => removeReward(index)}
                  onAction={() => actionReward(index)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


// Function to get a random color from the list
const getRandomBgColor = () => {
  const randomIndex = Math.floor(Math.random() * bgColors.length);
  return bgColors[randomIndex];
};


interface CreateRewardProps {
  onCreate: (reward: Reward) => void; 
}

const CreateReward: React.FC<CreateRewardProps> = ({ onCreate }) => {
  const [newRewardTitle, setNewRewardTitle] = useState<string>("");
  const [newRewardPoints, setNewRewardPoints] = useState<string | number>(10);

  const handleCreate = () => {
    if (newRewardTitle.trim()) {
      const newReward: Reward = {
        title: newRewardTitle,
        points: newRewardPoints,
        icon: FaGift, 
        bgColor: getRandomBgColor(), 
      };
      onCreate(newReward);
      setNewRewardTitle("");
      setNewRewardPoints(10);
    }
  };

  return (
    <div className="bg-gradient-to-r transform transition-transform hover:scale-105 from-purple-600 to-blue-500 p-6 rounded-lg shadow-md text-light-text dark:text-dark-text">
      <div className="flex items-center mb-4">
        <FaPlus className="text-4xl mr-3 text-dark-text" />
        <h2 className="text-xl font-stix text-dark-text">Create New Reward</h2>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={newRewardTitle}
          onChange={(e) => setNewRewardTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-4 rounded-lg placeholder:text-dark-text shadow-md text-dark-text dark:placeholder-dark-text bg-purple-600 border border-purple-600 focus:border-light-background focus:outline-none transition-all duration-300 mb-4"
        />
        <input
          type="number"
          value={newRewardPoints}
          onChange={(e) => setNewRewardPoints(e.target.value)}
          placeholder="Points"
          className="w-full p-4 rounded-lg placeholder:text-dark-text shadow-md text-dark-text dark:placeholder-dark-text bg-purple-600 border border-purple-600 focus:border-light-background focus:outline-none transition-all duration-300 mb-4 no-spinner"
        />
      </div>
      <button
        onClick={handleCreate}
        className="w-full p-4 rounded-lg bg-primary text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 flex items-center justify-center"
      >
        <FaPlus size={20} className="inline mr-2" />
        Create Reward
      </button>
    </div>
  );
};

export default Rewards;
