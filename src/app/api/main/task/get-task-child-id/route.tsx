import { getTasksByChildId } from '@/db/taskService'; // Import the service function
import { NextResponse } from 'next/server';

// API route handler
export async function POST(request: Request) {
    try {
      // Parse the tasks from the request body
      let { id } = await request.json();
      console.log("id in get-task POST", id)
      // Validate input 
      if (!id) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
      }
      
      if(typeof id != "number")
        id = parseInt(id, 10);


      // Call the addTask method from the service
      const tasks = await getTasksByChildId(id);

      return NextResponse.json({ tasks, status: 200 });

    } catch (error) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 

