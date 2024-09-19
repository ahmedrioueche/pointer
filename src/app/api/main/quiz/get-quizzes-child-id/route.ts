import { NextResponse } from 'next/server';
import { getQuizzesByChildId } from '@/services/quizService'; 

export async function POST(request: Request) {
    try {
        let { childId } = await request.json();
        if (!childId) {
            return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
        }

        const quizzes = await getQuizzesByChildId(childId);
        return NextResponse.json({quizzes : quizzes,  status: 200 });
    } catch (error) {
        console.error('Error inserting quizzes in route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
