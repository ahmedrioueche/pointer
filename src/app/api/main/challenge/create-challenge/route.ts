import { NextResponse } from 'next/server';
import { createChallenge } from '@/services/challengeService';

async function handlePost(req: Request) {
    try {
        const { challenge } = await req.json();

        const id = await createChallenge(challenge); 

        return NextResponse.json({ id: id }, { status: 200 });
    } catch (error) {
        console.error('Error creating challenge:', error);
        return NextResponse.json({ message: 'Error creating challenge.' }, { status: 500 });
    }
}

export const POST = handlePost;
