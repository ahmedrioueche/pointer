import { unAssignTask } from '@/services/taskService'; // Import the service function
import { assertInt } from '@/utils/helper';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {

      let { taskId, childId } = await request.json();

      if (!taskId || !childId) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
     }

      taskId = assertInt(taskId);
      childId = assertInt(childId);

      await unAssignTask(taskId, childId);

      return NextResponse.json({status: 200 });

    } catch (error) {
        console.error('Error unassigning task:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 

