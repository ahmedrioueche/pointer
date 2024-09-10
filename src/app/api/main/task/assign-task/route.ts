import { assignTask } from '@/db/taskService'; // Import the service function
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {

      let { task, childId } = await request.json();

      if (!task || !childId) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
     }

     if(typeof childId === "string")
        childId = parseInt(childId, 10);

      const id = await assignTask(task, childId);

      return NextResponse.json({ id: id, status: 200 });

    } catch (error) {
        console.error('Error assigning task:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 

