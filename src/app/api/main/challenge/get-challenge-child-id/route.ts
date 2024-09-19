import { NextResponse } from 'next/server';
import { getChallengesByChildId } from '@/services/challengeService';

async function handlePost(req: Request) {
    try {
        const { id:childId } = await req.json();

        if(!childId)
           return NextResponse.json({ error: 'Bad request' }, { status: 400 });

        const challenges = await getChallengesByChildId(childId); 

        return NextResponse.json({ challenges: challenges }, { status: 200 });
    } catch (error) {
        console.error('Error fetching challenges:', error);
        return NextResponse.json({ message  : 'Error fetching challenges.' }, { status: 500 });
    }
}

export const POST = handlePost;
