import { NextResponse } from 'next/server';
import { insertChild } from '@/db/childService';

// Handler function for POST requests
async function handlePost(req: Request) {
    try {
        const { child } = await req.json();
        console.log("child in handlePost", child)
        const id = await insertChild(child); 

        return NextResponse.json({ id: id }, { status: 200 });
    } catch (error) {
        console.error('Error creating user:', error); // Log the error to server logs
        return NextResponse.json({ message: 'Error creating user.' }, { status: 500 });
    }
}

// Export handlers for different HTTP methods
export const POST = handlePost;
