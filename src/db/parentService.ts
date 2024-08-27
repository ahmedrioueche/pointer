import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Interface for parent data
export interface Parent {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    is_verified?: boolean;
    age?: number;
    gender?: string;
    children_count?: number;
    subscription_type?: string;
    subscription_start_date?: Date;
    subscription_end_date?: Date;
    is_subscription_active?: boolean;
    payment_method?: string;
    last_payment_date?: Date;
    subscription_price?: number;
}

interface Response {
    status: string;
    message?: string;
    parentId? : Number;
}


export const insertParent = async (parent: Parent): Promise<Response> => {
    try {
        const newParent = await prisma.parent.create({
            data: {
                first_name: parent.first_name,
                last_name: parent.last_name,
                email: parent.email,
                password: parent.password,
                is_verified: parent.is_verified,
                age: parent.age,
                gender: parent.gender,
                children_count: parent.children_count,
                subscription_type: parent.subscription_type,
                subscription_start_date: parent.subscription_start_date,
                subscription_end_date: parent.subscription_end_date,
                is_subscription_active: parent.is_subscription_active,
                payment_method: parent.payment_method,
                last_payment_date: parent.last_payment_date,
                subscription_price: parent.subscription_price,
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
        await prisma.parent.update({
            where: { id: parentId },
            data: updateData,
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
