import { addTask } from '@/db/taskService'; // Import the service function
import { NextResponse } from 'next/server';

// API route handler
export async function POST(request: Request) {
    try {
      // Parse the tasks from the request body
      let { task } = await request.json();
      console.log("task in POST", task)
      // Validate input
      if (!task) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

      // Call the addTask method from the service
      const id = await addTask(task);

      return NextResponse.json({ id: id, status: 200 });

    } catch (error) {
        console.error('Error adding task:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 

