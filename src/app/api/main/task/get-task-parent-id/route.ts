import { getTasksByParentId } from '@/db/taskService'; // Import the service function
import { NextResponse } from 'next/server';

// API route handler
export async function POST(request: Request) {
    try {
      // Parse the tasks from the request body
      let { id } = await request.json();
      console.log("id in get-tasks POST", id)
      // Validate input 
      if (!id) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
      }

      if(typeof id === "string")
        id = parseInt(id, 10);

      const tasks = await getTasksByParentId(id);

      return NextResponse.json({ tasks, status: 200 });

    } catch (error) {
        console.error('Error fetching children:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 

