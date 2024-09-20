'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Notif, Reward } from '@/types/interface';
import { RewardCard } from './RewardCard';
import { assertInt, fetcher, generateUniqueId } from '@/utils/helper';
import { apiAddReward, apiClaimReward, apiDeleteReward, apiGetChildData, apiSendNotification, apiUnClaimReward, apiUpdateChild, apiUpdateReward } from '@/lib/apiHelper';
import Alert from '../../Alert';
import { useData } from '@/app/context/dataContext';
import CustomizeModal from '../modals/CustomizeModal';
import CreateReward from './CreateReward';

const Rewards: React.FC = (user : any) => {
  const userId = user? user.user.id : undefined;
  const userType = user? user.user.type : undefined;
  const rewardType = userType === "child" ? "reward_to_claim" : "reward_page";

  const [rewards, setRewards] = useState<Reward[]>([]);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [status, setStatus] = useState<{ success: string; message: string }>();
  const [showAlert, setShowAlert] = useState(false);
  const [currentChildData, setCurrentChildData] = useState<any>([]);
  const [rewardData, setRewardData] = useState<any>([]);
  const [updateChildDataSignal, setUpdateChildDataSignal] = useState(false);
  const [children, setChildren] = useState<any>([]);
  const [showCustomizeModal, setShowCustomizeModal] = useState(false);

  const childrenContext = useData();

  useEffect(() => {
      setChildren(childrenContext.children);
  },[childrenContext, updateChildDataSignal])

  //fetch child data
  useEffect(() => {

    if(userType === "child"){
      const childData = children.filter((child : any) => child.id === userId)
      setCurrentChildData(childData.length > 0 ? childData[0] : null);
    }
    
  }, [childrenContext, updateChildDataSignal, children, userId, userType]);

  useEffect(() => {
    const parentId = currentChildData?.parent_id;
    const fetchRewardData = async () => {
        try {
          const data = await fetcher('/api/main/reward/get-reward-parent-id', userType === "child"? assertInt(parentId) : assertInt(userId)); //either child or parent
          const fetchedRewards = data.rewards;
          if(fetchedRewards){
            const sortedRewards = fetchedRewards.sort((a: any, b: any) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
            setRewards(sortedRewards);
          }
        } catch (err) {
          console.error("Error fetching reward data:", err);
        }
    };

    if (parentId || (!parentId && userId)) {
      fetchRewardData();
    }
  }, [currentChildData, userId, userType, updateChildDataSignal]);
  

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

        getUpdatedChildData();

        const notification : Notif = {
          title: "A new reward has been added",
          content: `${newReward.name}, ${newReward.points} points`,
          description: `${newReward.description}`,
          type:'reward_added'
        }

        childrenContext.children.forEach(async (child : any) => {
          const notifResponse = await apiSendNotification(userId, child.id, "child" , notification);
          console.log("apiSendNotification response", notifResponse)
        }) 
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

    getUpdatedChildData();
  };

  const getUpdatedChildData = () => {
    childrenContext.triggerFetch();

    setTimeout(() => {
      setUpdateChildDataSignal(prev => !prev);
    }, 2000)
  }

  const claimReward = async (index : number) =>{
    //make sure the children data is up to date
    getUpdatedChildData();

    let UpdateChildData = false;

    const rewardToClaim = rewards[index];
    const childId = currentChildData.id;

    //update reward claims data
    const rewardUpdateResult = rewardToClaim.id? await apiClaimReward(rewardToClaim.id, childId) : null;
    console.log("rewardUpdateResult", rewardUpdateResult)

    //update child data
    const prevPoints = currentChildData.currentPoints;
    const prevRewardsEarned = currentChildData.rewardsEarned;
    const newPoints = prevPoints - rewardToClaim.points;
    console.log("newPoints", newPoints)

    let childUpdateResult;
    if(!UpdateChildData){
      childUpdateResult = await apiUpdateChild(childId, {currentPoints : newPoints, rewardsEarned :prevRewardsEarned + 1}, );
      UpdateChildData = true;
    }

    getUpdatedChildData();

    //send notification to parent
    const notification : Notif = {
      title: `${currentChildData.name} just claimed a reward!`,
      content: `${rewardToClaim.name}, ${rewardToClaim.points}`,
      description: `${rewardToClaim.description}`,
      type: "reward_claimed",
    }
    
    const notifResponse = await apiSendNotification(currentChildData.id, currentChildData.parent_id, "parent" , notification);
    console.log("apiSendNotification response", notifResponse)
  }

  
  const unClaimReward = async (index : number) =>{
    getUpdatedChildData();

    let UpdateChildData = false;
    const rewardToUnclaim = rewards[index];
    console.log("rewardToUnclaim", rewardToUnclaim)
    const childId = currentChildData.id;
    console.log("childId", childId)
    const rewardUpdateResult = rewardToUnclaim.id? await apiUnClaimReward(rewardToUnclaim.id, childId) : null;

    //update child data
    const prevPoints = currentChildData.currentPoints;
    const prevRewardsEarned = currentChildData.rewardsEarned;

    let childUpdateResult;
    if(!UpdateChildData){
      childUpdateResult = await apiUpdateChild(childId, {currentPoints : (prevPoints + rewardToUnclaim.points), rewardsEarned :prevRewardsEarned - 1}, );
      UpdateChildData = true;
    }

    getUpdatedChildData();

  }
  

  const handleClose = () => {
    setShowAlert(false);
  };

  const handleModalClose = () => {
    setShowCustomizeModal(false);
  }

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-2 ">
      <div className={`max-w-6xl mx-auto grid grid-cols-1  ${userType === "child"? 'lg:grid-cols-2' : 'lg:grid-cols-3'} gap-8`}>
        {userType !== "child" && (
          <div className="lg:col-span-1">
            <CreateReward onCreate={addReward} rewardToEdit={selectedReward} />
          </div>
        )}
        <div className="lg:col-span-2">
          <div className={`grid grid-cols-1 md:grid-cols-2 ${userType === "child"? 'lg:grid-cols-3' : ''} gap-6`}>
            {rewards && rewards.length > 0 ? (rewards.map((reward, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <RewardCard
                  type={rewardType}
                  user={user}
                  childData={currentChildData}
                  {...reward}
                  onModify={() => modifyReward(index)}
                  onRemove={() => removeReward(index)}
                  onClaim={()=>{claimReward(index)}}
                  onUnClaim={()=>{unClaimReward(index)}}
                  onCustomize={() => setShowCustomizeModal(true)}
                />
              </motion.div>
            ))) : (
              <div className='font-satisfy text-xl text-light-text dark:text-dark-text'>Rewards will appear here</div>
            )}
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
        <CustomizeModal 
            user={user}
            isOpen={showCustomizeModal} 
            onAssignTask={() => {null}}
            onClose={() => {handleModalClose()}}
        />
    </div>
  );
};


export default Rewards;