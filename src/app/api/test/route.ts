import { test } from '@/services/test';
import { NextResponse } from 'next/server';

async function handlePost(req: Request) {
    try {
       const { name } =  await req.json();

        await test(name); 

        return NextResponse.json({ message: 'User created successfully!' }, { status: 200 });
    } catch (error) {
        console.error('Error creating user:', error); // Log the error to server logs
        return NextResponse.json({ message: 'Error creating user.' }, { status: 500 });
    }
}

// Export handlers for different HTTP methods
export const POST = handlePost;
