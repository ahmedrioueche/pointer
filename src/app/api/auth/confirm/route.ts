import { NextResponse } from 'next/server';
import { insertChild } from '@/services/childService';

async function handlePost(req: Request) {
    try {
        const { name, age, gender, parent_id, has_device, uses_shared_device, username, password } = await req.json();

        if (!name || !age || !gender || !parent_id || !has_device) {
            return NextResponse.json({ message: 'Please provide all required fields.' }, { status: 400 });
        }

        const child = {
            name,
            age,
            gender,
            parent_id,
            has_device,
            uses_shared_device,
            username,
            password,
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
