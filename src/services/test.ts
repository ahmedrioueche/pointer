import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const test = async (name: string) => {
    try {
        // Insert a new record into the 'Test' model with the provided name
        const newTest = await prisma.test.create({
            data: {
                name: name,          // Assign the input 'name' to the model
                createdAt: new Date(), // Optional: Set createdAt to current date/time
            },
        });

        console.log('New test created:', newTest);
        return newTest;

    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to create test');
    } finally {
        await prisma.$disconnect();
    }
};

test("Ahmed")