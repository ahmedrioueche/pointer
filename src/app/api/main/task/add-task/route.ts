import { addTask } from '@/db/taskService'; // Import the service function
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
      let { task } = await request.json();

      if (!task) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
      }

      const id = await addTask(task);

      return NextResponse.json({ id: id, status: 200 });

    } catch (error) {
        console.error('Error adding task:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 

