import { NextResponse } from 'next/server';
import { updateQuiz } from '@/services/quizService'; 

export async function POST(request: Request) {
    try {
        let { quiz } = await request.json();
        if (!quiz) {
            return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
        }

        const reponse = await updateQuiz(quiz);
        return NextResponse.json(reponse, { status: 200 });
    } catch (error) {
        console.error('Error inserting quizzes in route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
