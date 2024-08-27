import { deleteRewardById } from '../../../../../db/rewardService'; // Import the service function
import { NextResponse } from 'next/server';

// API route handler
export async function POST(request: Request) {
    try {
      // Parse the tasks from the request body
      let { id } = await request.json();
      console.log("reward id in delete-reward", id)
      // Validate input
      if (!id) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

      // Call the addTask method from the service
      await deleteRewardById(id);

      return NextResponse.json({ message:"success", status: 200 });

    } catch (error) {
        console.error('Error deleting reward:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 

