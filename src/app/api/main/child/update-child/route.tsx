import { NextResponse } from 'next/server';
import { updateChild } from '@/services/childService';

async function handlePost(req: Request) {
    try {
        const { id, updateData } = await req.json();

        if (!id || !updateData) {
            return NextResponse.json({ message: 'Child ID and update data are required.' }, { status: 400 });
        }

        // Attempt to update the child data in the database
        const updatedChild = await updateChild(id, updateData);

        if (updatedChild) {
            // If the update was successful, return the updated child data with a 200 status code
            return NextResponse.json({success : true, status: 200 });
        } else {
            // If no child was found to update, return a 404 status code
            return NextResponse.json({ message: 'Child not found.' }, { status: 404 });
        }

    } catch (error) {
        console.error('Error updating child:', error); 
        // Return a 500 status code in case of server error
        return NextResponse.json({ message: 'Error updating child.' }, { status: 500 });
    }
}

export const POST = handlePost;
