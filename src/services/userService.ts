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
                firstName: true,
                lastName: true,
                password: true,
            }
        });

        if(parent){
            const isMatch = await bcrypt.compare(password, parent.password);
            if(isMatch)
                return { ...parent, identifier: parent.email, userType: 'parent' };
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
                avatar: true,
                password: true,
            }
        });

        if(child) {
            console.log("child", child)
          //  const isMatch = child.password? await bcrypt.compare(password, child.password) : null;
            //if(isMatch){
                return { ...child, identifier: child.username, userType: 'child' };
            //}
        }
        
        return null;

    } catch (error) {
        console.error('Error athenticating user:', error);
        return null;
    }
}
