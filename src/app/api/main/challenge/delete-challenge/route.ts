import { NextResponse } from 'next/server';
import { deleteChallenge } from '@/services/challengeService';

async function handlePost(req: Request) {
    try {
        const { challengeId } = await req.json();

        if(!challengeId)
           return NextResponse.json({ error: 'Bad request' }, { status: 400 });

        const response = await deleteChallenge(challengeId); 

        return NextResponse.json({ challenge: response }, { status: 200 });
    } catch (error) {
        console.error('Error deleting challenge:', error);
        return NextResponse.json({ message  : 'Error deleting challenge.' }, { status: 500 });
    }
}

export const POST = handlePost;
