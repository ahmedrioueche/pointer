import { NextResponse } from 'next/server';
import { insertChild } from '@/db/childService';
import { updateParent } from '@/db/parentService';

// Handler function for POST requests
async function handlePost(req: Request) {
    try {
        const { name, age, gender, parentId, hasDevice, usesSharedDevice } = await req.json();

        if (!name || !age || !gender || !parentId || !hasDevice) {
            return NextResponse.json({ message: 'Please provide all required fields.' }, { status: 400 });
        }

        const child = {
            name,
            age,
            gender,
            parentId,
            hasDevice,
            usesSharedDevice
        };

        await insertChild(child); 

        return NextResponse.json({ message: 'User created successfully!' }, { status: 200 });
    } catch (error) {
        console.error('Error creating user:', error); // Log the error to server logs
        return NextResponse.json({ message: 'Error creating user.' }, { status: 500 });
    }
}

// Export handlers for different HTTP methods
export const POST = handlePost;
