'use client';

import React, { useEffect, useState } from 'react';
import { FaPlus, FaDollarSign, FaGlobeAmericas, FaXbox, FaPlaystation, FaLaptop, FaPhone, FaDog, FaEdit, FaTrashAlt, FaCheck, FaGift } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Reward } from '@/lib/interface';
import { RewardCard } from './RewardCard';
import useSWR from 'swr';
import { fetcher, generateUniqueId } from '@/utils/helper';
import { apiAddReward, apiClaimReward, apiDeleteReward, apiUpdateReward } from '@/lib/apiHelper';
import Alert from '../Alert';

const Rewards: React.FC = (user : any) => {
  const userId = user? user.user.userId : undefined;

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [status, setStatus] = useState<{ success: string; message: string }>();
  const [showAlert, setShowAlert] = useState(false);

  const { data: data, error, mutate } = useSWR('/api/main/reward/get-reward-parent-id', (url) => fetcher(url, userId), {
    revalidateOnFocus: true, 
  });
  
  useEffect(() => {
    if(data){
      const fetchedRewards = data.rewards
      if (Array.isArray(fetchedRewards)) {
        setRewards(fetchedRewards);
      }
    }
  }, [data]);

  
  const addReward = async (newReward: Reward) => {
    newReward = {...newReward, creatorId: typeof userId === "string" ? parseInt(userId) : userId}

    if (selectedReward) {
      const selectedRewardId = selectedReward.id;
      const response = await apiUpdateReward(selectedRewardId, {...newReward, id: selectedRewardId});

      setRewards(
        rewards?.map((reward) =>
          reward.id === selectedReward.id ? { ...newReward, id: selectedRewardId } : reward
        )
      );
      
      setSelectedReward(null); 
    } else {

        const tempId = generateUniqueId();
        const tempReward = { ...newReward, id: tempId };
        rewards ? setRewards([tempReward, ...rewards]) : setRewards([tempReward]);

        const response = await apiAddReward(newReward);

        const rewardId = response.id;
        setRewards((prevRewards) =>
          prevRewards?.map((reward) =>
            reward.id === tempId ? { ...reward, id: rewardId } : reward
          )
        );    
      }
  };

  const modifyReward = (index: number) => {
    setSelectedReward(rewards[index]);
  };

  const removeReward = async (index: number) => {
    const rewardToDelete = rewards? rewards[index] : undefined;
    setRewards(rewards?.filter((_, i) => i !== index));
    let response;
    if(rewardToDelete){
      response = await apiDeleteReward(rewardToDelete.id);
    }

    if(response.error){
      setStatus({success : "Error", message : "Could not delete reward, it is claimed by a child!"});
      setShowAlert(true);
      rewardToDelete? setRewards(prev => [...prev, rewardToDelete]) : null;
    }            

  };

  const handleClaimReward = async () =>{

    const rewardId = 1;
    const childId = 1;

    const result = await apiClaimReward(rewardId, childId);
  }

  //useEffect(()=>{
  //  handleClaimReward()
  // },[])

  const handleClose = () => {
    setShowAlert(false);
  };

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <CreateReward onCreate={addReward} rewardToEdit={selectedReward} />
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
                  type="reward_page"
                  {...reward}
                  onModify={() => modifyReward(index)}
                  onRemove={() => removeReward(index)}
                />
              </motion.div>
            ))}
          </div>
        </div>
        {showAlert && (
        <Alert
          title={status?.success}
          message={status?.message}
          onClose={handleClose}
        />
      )}
      </div>
    </div>
  );
};

interface CreateRewardProps {
  onCreate: (reward: Reward) => void;
  rewardToEdit?: Reward | null;
}

const CreateReward: React.FC<CreateRewardProps> = ({ onCreate, rewardToEdit }) => {
  const [newRewardTitle, setNewRewardTitle] = useState<string>("");
  const [newRewardPoints, setNewRewardPoints] = useState<string | number>(10);

  useEffect(() => {
    if (rewardToEdit) {
      setNewRewardTitle(rewardToEdit.name);
      setNewRewardPoints(rewardToEdit.points);
    }
  }, [rewardToEdit]);

  const handleCreate = () => {
    if (newRewardTitle.trim()) {
      const newReward: Reward = {
        name: newRewardTitle,
        points: newRewardPoints,
        icon: rewardToEdit?.icon || FaGift, 
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
        <h2 className="text-xl font-stix text-dark-text">{rewardToEdit ? "Edit Reward" : "Create New Reward"}</h2>
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
        {rewardToEdit ? "Update Reward" : "Create Reward"}
      </button>

    </div>
  );
};

export default Rewards;