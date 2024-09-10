import { NextResponse } from 'next/server';
import { sendNotification } from '../../../../../db/notifService';

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
        return NextResponse.json({ error: 'Failed to fetch parent data' }, { status: 500 });
    }
}
