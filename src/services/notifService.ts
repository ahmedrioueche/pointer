import { assertInt } from '@/lib/helper';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export const sendNotification = async (senderId : number | undefined, receiverId : number | undefined, receiverType : string, notif: any) => {

    try {
        const createdNotif = await prisma.notification.create({ 
            data: {
                senderId: assertInt(senderId),
                receiverId: assertInt(receiverId),
                title: notif.title,
                content: notif.content,
                description: notif.description,
                receiverType: receiverType,
                type: notif.type,
            }
        });
    
        return createdNotif.id;    
    }
    catch (error) {
        console.error('Error sending notification:', error);
        throw new Error('Failed to send notification');
    } finally {
        await prisma.$disconnect();
    }
}


export const getNotificationsById = async (receiverId : number, receiverType : any) => {

    try {
        const notifs = await prisma.notification.findMany({ 
           where:{
            receiverId: assertInt(receiverId),
            receiverType: receiverType,
           }
        });
    
        return notifs;  
    }
    catch (error) {
        console.error('Error sending notification:', error);
        throw new Error('Failed to send notification');
    } finally {
        await prisma.$disconnect();
    }
}


export const markRead = async (notifIds : any) => {

    try {
        if(notifIds && notifIds.length > 0){
            notifIds.forEach(async (notifId : any) => {
                const notifInDb = await prisma.notification.findUnique({
                    where: 
                        {id : notifId}
                })

                const result = await prisma.notification.update({
                    where: {id : notifInDb?.id},
                    data: {isRead : true}
                })
                console.log("result", result)
            }) 
        }    
    }
    catch (error) {
        console.error('Error sending notification:', error);
        throw new Error('Failed to send notification');
    } finally {
        await prisma.$disconnect();
    }
}