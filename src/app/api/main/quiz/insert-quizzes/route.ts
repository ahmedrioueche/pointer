import { NextResponse } from 'next/server';
import { insertQuizzes } from '@/services/quizService'; 

export async function POST(request: Request) {
    try {
        let { quizzes } = await request.json();
        if (!quizzes) {
            return NextResponse.json({ error: 'Bad Request' }, { status: 400 });
        }

        const reponse = await insertQuizzes(quizzes);
        return NextResponse.json(reponse, { status: 200 });
    } catch (error) {
        console.error('Error inserting quizzes in route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
