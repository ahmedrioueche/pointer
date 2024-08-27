import { Reward } from '@/lib/interface';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const addReward = async (reward: Reward): Promise<number> => {
  console.log("rewards in addTasks", reward);

  try {
        const rewardData: any = {
            name: reward.name,
            creatorId: typeof reward.creatorId === "string" ? parseInt(reward.creatorId, 10) : reward.creatorId || undefined,
            creatorName: reward.creatorName || undefined,
            creationDate: reward.creationDate ? new Date(reward.creationDate) : undefined,
            isClaimed: reward.isClaimed || false,
            points: typeof reward.points === "string" ? parseInt(reward.points, 10) : reward.points || undefined,
            description: reward.description || undefined,
            attachedFiles: reward.attachedFiles || undefined,
            icon : reward.icon || undefined,
        };
  
          // Create new reward
          const createdReward = await prisma.reward.create({ data: rewardData });
          
          if (reward.isClaimed) {
              await prisma.rewardClaim.create({
                  data: {
                    rewardId: createdReward.id,                      
                    childId: typeof reward.claimedBy === "string" ? parseInt(reward.claimedBy, 10) : reward.claimedBy || 0,
                    claimedAt: reward.claimedAt || new Date(), 
                    claimComment: reward.claimComment || undefined,
                    approveComment: reward.approveComment || undefined,
                    approvedAt: reward.approvedAt ? new Date(reward.approvedAt) : undefined,
                    approvedBy:  typeof reward.approvedBy === "string" ? parseInt(reward.approvedBy, 10) : reward.approvedBy || undefined, 
                    approvedByName: reward.approvedByName || undefined,
                    approveCommentDate: reward.approveCommentDate? new Date(reward.approveCommentDate) : undefined,
                    isApproved: reward.isApproved || false,
                  },
              });
          }

          return createdReward.id;
          
  } catch (error) {
      console.error('Error adding rewards:', error);
      throw new Error('Failed to add rewards');
  } finally {
      await prisma.$disconnect();
  }
};


export const getRewardsByParentId = async (parentId: number): Promise<any> => {
    try {
  
      const rewards = await prisma.reward.findMany({
          where: { creatorId: parentId },
      });
  
      console.log("rewards in getRewardsByParentId", rewards)
      
      return rewards;
  
    } catch (error) {
        console.error('Error fetching rewards by parentId:', error);
        throw new Error('Failed to fetch rewards by parentId');
    } finally {
        await prisma.$disconnect();
  }
}


export const updateRewardById = async (rewardId: number, updates: Partial<any>): Promise<void> => {
    try {
      let points = updates.points;
      points = typeof points === "string" ? parseInt(points, 10) : points || undefined;
  
      let creatorId = updates.creatorId;
      creatorId = typeof creatorId === "string"? parseInt(creatorId, 10) : creatorId;
  
      console.log("rewardId in updateTaskById", rewardId);
      // Update the Task record
      await prisma.reward.update({
        where: { id: rewardId }, 
        data: { ...updates, points, creatorId },
      });
      
    } catch (error) {
      console.error('Error updating reward:', error);
      throw new Error('Failed to update reward');
    } finally {
      await prisma.$disconnect();
    }
};


export const deleteRewardById = async (rewardId: number): Promise<void> => {
  try {
  
    await prisma.reward.delete({
      where: { id: rewardId },
    });

  } catch (error) {
    console.error('Error deleting reward:', error);
    throw new Error('Failed to delete reward');
  } finally {
    await prisma.$disconnect();
  }
};

export const getRewardsByChildId = async (childId: number): Promise<any> => {
  try {

    console.log("childId in getRewardsByChildId", childId)

    const rewards = await prisma.rewardClaim.findMany({
        where: { childId: childId },
        include: {reward : true}
    });

    return rewards;
    
  } catch (error) {
      console.error('Error fetching rewards by childId:', error);
      throw new Error('Failed to fetch rewards by childId');
  } finally {
      await prisma.$disconnect();
  }
};

export const claimReward = async (rewardId: number, childId: number): Promise<number> => {
  try {
      // Create the reward claim
      const claimData = {
        childId: childId,
        rewardId: rewardId,
      };
      const claim = await prisma.rewardClaim.create({ data: claimData });

      // Update the reward to set is_claimed to true
      await prisma.reward.update({
        where: { id: rewardId },
        data: { isClaimed: true },
      });

      return claim.id;

  } catch (error) {
    console.error('Error claiming reward:', error);
    throw new Error('Failed to claim reward');
  } finally {
    await prisma.$disconnect();
  }
};


export const updateRewardClaimById = async (rewardId: number, updates: Partial<any>): Promise<void> => {
  try {
    console.log("rewardId in updateRewardClaimByRewardId", rewardId);

    // Fetch the reward claim associated with the rewardId
    const rewardClaim = await prisma.rewardClaim.findFirst({
      where: { rewardId: rewardId }, // Assuming `rewardId` is a foreign key in `rewardClaim`
    });

    if (!rewardClaim) {
      throw new Error('Reward claim not found for the given rewardId');
    }

    // Update the Reward Claim record
    await prisma.rewardClaim.update({
      where: { id: rewardClaim.id }, // Use the fetched rewardClaim ID
      data: { ...updates },
    });

  } catch (error) {
    console.error('Error updating reward claim:', error);
    throw new Error('Failed to update reward claim');
  } finally {
    await prisma.$disconnect();
  }
};



