import { NextResponse } from 'next/server';
import { sendNotification } from '../../../../../services/notifService';

export async function POST(request: Request) {
    try {
        const { senderId,  receiverId, receiverType, notif } = await request.json();

        if (!senderId || !receiverId || !notif) {
            return NextResponse.json({ error: 'Bad request' }, { status: 400 });
        }

        const response = await sendNotification(senderId, receiverId, receiverType, notif);

        return NextResponse.json(response);

    } catch (error) {
        console.error('Error in loading route:', error);
        return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
    }
}
