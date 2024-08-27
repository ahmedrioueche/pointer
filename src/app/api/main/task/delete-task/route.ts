import { deleteTaskById } from '../../../../../db/taskService'; // Import the service function
import { NextResponse } from 'next/server';

// API route handler
export async function POST(request: Request) {
    try {
      // Parse the tasks from the request body
      let { id } = await request.json();
      console.log("taskId in POST", id)
      // Validate input
      if (!id) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

      // Call the addTask method from the service
      await deleteTaskById(id);

      return NextResponse.json({ message:"success", status: 200 });

    } catch (error) {
        console.error('Error fetching children:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 

