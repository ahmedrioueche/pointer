import pool from './db';
import { PrismaClient } from '@prisma/client';
import { Child } from '@/lib/interface';
import { assertInt, generateRandomUsernamePassword, getRandomIcon } from '@/utils/helper';

const prisma = new PrismaClient();

export const insertChild = async (child: Child): Promise<any> => {
  try {

    console.log("child in insertChild", child);
    const [username, password] = generateRandomUsernamePassword(child.name);

    let parentId = assertInt(child.parent_id);
    let age = assertInt(child.age);
    
    const newChild = await prisma.child.create({
      data: {
        parent_id: child.parent_id? parentId : undefined,
        name: child.name,
        age: age,
        gender: child.gender,
        has_device: child.has_device? child.has_device : null,
        uses_shared_device: child.uses_shared_device? child.uses_shared_device : null,
        icon: child.icon? child.icon : getRandomIcon(child.gender, 6),
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
      where: { parent_id: parentId },
    });

    return children as Child[]; // Ensure it matches the Child type
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

      const updatedChild = await prisma.child.update({
        where: { id },  
        data: {        
          name: data.name,
          age: data.age,
          gender: data.gender,
          has_device: data.has_device,
          uses_shared_device: data.uses_shared_device || null,
          username: data.username,
          email: data.email? data.email : null,
          password: data.password,
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