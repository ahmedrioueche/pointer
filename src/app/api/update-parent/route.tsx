import { NextResponse } from 'next/server';
import { updateParent } from '@/db/parentService';

async function handlePost(req: Request) {
    try {
        const { parentId, updateData } = await req.json();

        if (!updateData) {
            return NextResponse.json({ message: 'Please provide all required fields.' }, { status: 400 });
        }

        const response = await updateParent(parentId, { ...updateData });

        return NextResponse.json(response, { status: response.status === 'success' ? 200 : 400 });
        
    } catch (error) {
        console.error('Error updating parent:', error); 
        return NextResponse.json({ message: 'Error updating parent.' }, { status: 500 });
    }
}

export const POST = handlePost;
