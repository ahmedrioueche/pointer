import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function authenticateUser(identifier: string, password: string): Promise<any> {
    try {

        let parent, child;
        
        parent = await prisma.parent.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier }
                ]
            },
            select: {
                id: true,
                email: true,
                username: true,
                first_name: true,
                last_name: true,
                password: true,
            }
        });

        if(parent){
            const isMatch = await bcrypt.compare(password, parent.password);
            if(isMatch)
                return { ...parent, userType: 'parent' };
        }
    
        child = await prisma.child.findFirst({
            where: {
                OR: [   
                    { email: identifier },
                    { username: identifier }
                ]
            },
            select: {
                id: true,
                email: true,
                username: true,
                name: true,
                icon: true,
                password: true,
            }
        });

        if(child) {
            console.log("child", child)
          //  const isMatch = child.password? await bcrypt.compare(password, child.password) : null;
            //if(isMatch){
                return { ...child, userType: 'child' };
            //}
        }
        
        return null;

    } catch (error) {
        console.error('Error retrieving user from the database:', error);
        return null;
    }
}
