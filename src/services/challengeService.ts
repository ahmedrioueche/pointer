import { PrismaClient } from '@prisma/client';
import { Challenge } from '@/types/interface';

const prisma = new PrismaClient();

export const createChallenge = async (challenge: Challenge) => {
  try {
    const newChallenge = await prisma.challenge.create({
      data: {
        parentId: challenge.parentId,
        name: challenge.name,
        description: challenge.description,
        points: challenge.points,
        assignedTo: challenge.assignedTo,
        image: challenge.image,
        time: challenge.time,
        rewards: challenge.rewards,
      },
    });

    return newChallenge;
  } catch (error) {
    console.error('Error creating challenge:', error);
    throw new Error('Failed to create challenge');
  } finally {
    await prisma.$disconnect();
  }
};

export const getChallengesByParentId = async (parentId: number) => {
  try {
    const challenges = prisma.challenge.findMany({
      where : {
        parentId : parentId,
      }
    })

    return challenges;

  } catch (error) {
    console.error('Error fetching challenges:', error);
    throw new Error('Failed to fetching challenges');
  } finally {
    await prisma.$disconnect();
  }
};

export const getChallengesByChildId = async (childId: number) => {
  try {
    
    const childIdStr = String(childId);
    const challenges = await prisma.challenge.findMany({
      where: {
        assignedTo: {
          contains: childIdStr,
        }
      }
    });

    return challenges;
  } catch (error) {
    console.error('Error fetching challenges:', error);
    throw new Error('Failed to fetch challenges');
  } finally {
    await prisma.$disconnect();
  }
};


export const deleteChallenge = async (challengeId: number) => {
  try {
    
    const response = await prisma.challenge.delete({
      where: {
        id : challengeId
      }
    });

    return response;
  } catch (error) {
    console.error('Error deleting challenge:', error);
    throw new Error('Failed to delete challenge');
  } finally {
    await prisma.$disconnect();
  }
};


export const updateChallenge = async (challengeId: number, challenge : Partial<Challenge>) => {
  try {
    
    const response = await prisma.challenge.update({
      where: {
        id : challengeId,
      },
      data : challenge,

    });

    return response;
  } catch (error) {
    console.error('Error deleting challenge:', error);
    throw new Error('Failed to delete challenge');
  } finally {
    await prisma.$disconnect();
  }
};