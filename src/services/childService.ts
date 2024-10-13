import { PrismaClient } from '@prisma/client';
import { Child } from '@/types/interface';
import { assertInt, generateRandomUsernamePassword, getRandomIcon as getRandomAvatar } from '@/lib/helper';
import { CHILDREN_AVATAR_COUNT } from '@/data/values';

const prisma = new PrismaClient();

export const insertChild = async (child: Child): Promise<any> => {
  try {

    const [username, password] = generateRandomUsernamePassword(child.name);

    let parentId = assertInt(child.parentId);
    let age = assertInt(child.age);
    
    const newChild = await prisma.child.create({
      data: {
        parentId: parentId,
        name: child.name,
        age: age,
        gender: child.gender,
        hasDevice: child.hasDevice? child.hasDevice : null,
        usesSharedDevice: child.usesSharedDevice? child.usesSharedDevice : null,
        avatar: child.avatar? child.avatar : getRandomAvatar(child.gender, CHILDREN_AVATAR_COUNT),
        username: username,
        password: password,
      },
    });

    return newChild.id; 
  } catch (error) {
    console.error('Error inserting child:', error);
    throw new Error('Failed to insert child');
  } finally {
    await prisma.$disconnect();
  }

};


export const getChildrenByParentId = async (parentId: number): Promise<Child[]> => {
  try {
    const children = await prisma.child.findMany({
      where: { parentId: parentId },
    });

    return children as Child[]; 
  } catch (error) {
    console.error('Error fetching children by parent ID:', error);
    throw new Error('Failed to fetch children');
  } finally {
    await prisma.$disconnect();
  }
};


export const getChildById = async (id: number): Promise<any> => {
    try {
      // Fetch the child from the database
      const child = await prisma.child.findUnique({
        where: { id },
      });
  
      return child || null; // Return the child object or null if not found

    } catch (error) {
      console.error('Error fetching child by ID:', error);
      throw new Error('Failed to fetch child data');
    } finally {
      // Optionally close the Prisma client connection
      await prisma.$disconnect();
    }
};


  export const updateChild = async (id: number, data: Partial<Child>): Promise<any> => {
    try {
      const updateData = {
        name: data.name,
        age: data.age,
        gender: data.gender,
        avatar: data.avatar,
        email: data.email,
        password: data.password,
        budget:data.budget,
        totalPoints: data.totalPoints,
        currentPoints: data.currentPoints,
        rewardsEarned: data.rewardsEarned,
        level: data.level,
        competence: data.competence,
        tasksCompleted: data.tasksCompleted,
        tasksAssigned: data.tasksAssigned,
        quizzesTotalPoints: data.quizzesTotalPoints,
        quizzesCorrectAnswersCount: data.quizzesCorrectAnswersCount,
      }

      const updatedChild = await prisma.child.update({
        where: { id },  
        data: {    
          ...updateData
        },
      });
  
      return updatedChild;
  
    } catch (error) {
      console.error('Error updating child data:', error);
      throw new Error('Failed to update child data');
    } finally {
      // Optionally close the Prisma client connection
      await prisma.$disconnect();
    }
  };