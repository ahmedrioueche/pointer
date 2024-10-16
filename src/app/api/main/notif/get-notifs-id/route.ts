import { NextResponse } from 'next/server';
import { getNotificationsById } from '../../../../../services/notifService';
import { assertInt } from '@/lib/helper';

export async function POST(request: Request) {
    try {
        let { receiverId, receiverType } = await request.json();

        if (!receiverId || !receiverType) {
            return NextResponse.json({ error: 'Bad request' }, { status: 400 });
        }

        receiverId = assertInt(receiverId);

        const response = await getNotificationsById(receiverId, receiverType);

        return NextResponse.json(response);

    } catch (error) {
        console.error('Error in loading route:', error);
        return NextResponse.json({ error: 'Failed to get notification' }, { status: 500 });
    }
}
