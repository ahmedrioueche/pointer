import { NextResponse } from 'next/server';
import { markRead } from '../../../../../services/notifService';

export async function POST(request: Request) {
    try {
        let { notifIds } = await request.json();

        console.log("notifIds in notif/mark-read", notifIds)
        if (!notifIds) {
            return NextResponse.json({ error: 'Bad request' }, { status: 400 });
        }

        const response = await markRead(notifIds);

        return NextResponse.json(response);

    } catch (error) {
        console.error('Error in loading route:', error);
        return NextResponse.json({ error: 'Failed to mark notifications as read'}, { status: 500 });
    }
}
