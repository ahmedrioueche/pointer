import { NextResponse } from 'next/server';
import { updateParent } from '@/db/parentService';

async function handlePost(req: Request) {
    try {
        const {parentId, updateData } = await req.json();

        if (!updateData) {
            return NextResponse.json({ message: 'Please provide all required fields.' }, { status: 400 });
        }

        await updateParent(parentId, {...updateData}); 

        return NextResponse.json({ message: 'User created successfully!' }, { status: 200 });
    } catch (error) {
        console.error('Error creating user:', error); 
        return NextResponse.json({ message: 'Error creating user.' }, { status: 500 });
    }
}

export const POST = handlePost;

