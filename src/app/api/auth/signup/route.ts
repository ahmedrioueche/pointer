import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { insertParent } from '@/db/parentService'; // Adjust the path as necessary

// Handler function for POST requests
async function handlePost(req: Request) {
    try {
        const { firstName, lastName, email, password } = await req.json();
    
        if (!firstName || !lastName || !email || !password) {
            return NextResponse.json({ message: 'Please provide all required fields.' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const parent = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
        };

        const parentId = await insertParent(parent); 

        return NextResponse.json({ message: 'User created successfully!', parentId }, { status: 200 });
    } catch (error) {
        console.error('Error creating user:', error); // Log the error to server logs
        return NextResponse.json({ message: 'Error creating user.' }, { status: 500 });
    }
}

// Export handlers for different HTTP methods
export const POST = handlePost;
