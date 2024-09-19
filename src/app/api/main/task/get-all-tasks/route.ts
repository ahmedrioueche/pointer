import { getPendingTasks } from '../../../../../services/taskService'; // Import the service function
import { NextResponse } from 'next/server';

// API route handler
export async function POST(request: Request) {
    try {

      const result = await getPendingTasks();

      return NextResponse.json({ result: result, status: 200 });

    } catch (error) {
        console.error('Error fetching children:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 

