import { assertInt } from '@/lib/helper';
import { updateTaskAssignmentById } from '../../../../../services/taskService'; // Import the service function
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
      let { id, childId, update } = await request.json();

      if (!id) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
     }
     
     id = assertInt(id);

      await updateTaskAssignmentById(id, childId, update);

      return NextResponse.json({ message:"success", status: 200 });

    } catch (error) {
        console.error('Error updating task assignment', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 

