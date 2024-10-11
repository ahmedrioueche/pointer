import { assertInt } from '@/utils/helper';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Interface for parent data
export interface Parent {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    age?: number;
    gender?: string;
    isVerified?: boolean;
    isFreeTrial?: boolean;
    childrenCount?: number;
    subscriptionType?: string;
    subscriptionStartDate?: Date;
    subscriptionEndDate?: Date;
    isSubscriptionActive?: boolean;
    paymentMethod?: string;
    lastPaymentDate?: Date;
    subscriptionPrice?: string;
}

interface Response {
    status: string;
    message?: string;
    parentId? : Number;
}


export const insertParent = async (parent: Parent): Promise<Response> => {
    try {
        console.log("parent", parent)
        const newParent = await prisma.parent.create({
            data: {
                firstName: parent.firstName,
                lastName: parent.lastName,
                email: parent.email,
                password: parent.password,
                isVerified: parent.isVerified,
                isFreeTrial: parent.isFreeTrial,
                age: parent.age,
                gender: parent.gender,
                childrenCount: parent.childrenCount,
                subscriptionType: parent.subscriptionType,
                subscriptionStartDate: parent.subscriptionStartDate,
                subscriptionEndDate: parent.subscriptionEndDate,
                isSubscriptionActive: parent.isSubscriptionActive,
                paymentMethod: parent.paymentMethod,
                lastPaymentDate: parent.lastPaymentDate,
                subscriptionPrice: parent.subscriptionPrice? parseFloat(parent.subscriptionPrice) || 0.0 : 0.0,
            },
        });

        return {
            status: 'success',
            parentId: newParent.id,
        };
        
    } catch (error) {
            return {
                status: 'failed',
                message: 'Failed to insert user',
            };
    } finally {
        await prisma.$disconnect();
    }
};


export const updateParent = async (parentId: number, updateData: Partial<Parent>): Promise<Response> => {
    try {
        let age = assertInt(updateData.age);
        let childrenCount = assertInt(updateData.childrenCount)
        let subscriptionPrice = updateData.subscriptionPrice? parseFloat(updateData.subscriptionPrice) || 0.0 : 0.0;

        await prisma.parent.update({
            where: { id: parentId },
            data: {...updateData, age, childrenCount: childrenCount, subscriptionPrice:subscriptionPrice}
        });

        return { status: 'success' };
    } catch (error) {   
        console.error('Error updating parent:', error);
        return { status: 'error', message: 'An error occurred' };
    } finally {
        await prisma.$disconnect();
    }
};


export async function getParentByEmail(email: string): Promise<any | null> {
    try {
        const parent = await prisma.parent.findUnique({
            where: { email },
        });

        return parent;
    } catch (error) {
        console.error('Error retrieving user from database:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

export async function getParentById(id: number): Promise<any | null> {
    try {
        const parent = await prisma.parent.findUnique({
            where: { id },
        });

        return parent;
    } catch (error) {
        console.error('Error retrieving user from database:', error);
        return null;
    } finally {
        await prisma.$disconnect();
    }
}

