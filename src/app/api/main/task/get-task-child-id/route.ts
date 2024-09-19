import { getTasksByChildId } from '@/services/taskService'; // Import the service function
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
      let { id } = await request.json();

      if (!id) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
      }
      
      if(typeof id != "number")
        id = parseInt(id, 10);

      const tasks = await getTasksByChildId(id);

      return NextResponse.json({ tasks, status: 200 });

    } catch (error) {
        console.error('Error fetching tasks:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 

