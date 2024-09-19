import { NextResponse } from 'next/server';
import { updateChallenge } from '@/services/challengeService';

async function handlePost(req: Request) {
    try {
        const { challengeId, challenge } = await req.json();

        if(!challengeId || !challenge)
           return NextResponse.json({ error: 'Bad request' }, { status: 400 });

        const reponse = await updateChallenge(challengeId, challenge); 

        return NextResponse.json({ challenge: reponse }, { status: 200 });
    } catch (error) {
        console.error('Error updating challenge:', error);
        return NextResponse.json({ message  : 'Error updating challenge.' }, { status: 500 });
    }
}

export const POST = handlePost;
