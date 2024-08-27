import { updateTaskById } from '../../../../../db/taskService'; // Import the service function
import { NextResponse } from 'next/server';

// API route handler
export async function POST(request: Request) {
    try {
      // Parse the tasks from the request body
      let { id, update } = await request.json();
      console.log("taskId in update-task", id)
      console.log("update", update)

      // Validate input
      if (!id) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

      // Call the addTask method from the service
      await updateTaskById(id, update);

      return NextResponse.json({ message:"success", status: 200 });

    } catch (error) {
        console.error('Error updating task:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 

