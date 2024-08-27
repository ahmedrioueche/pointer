import { assertInt } from '@/utils/helper';
import { updateRewardClaimById } from '../../../../../db/rewardService'; // Import the service function
import { NextResponse } from 'next/server';

// API route handler
export async function POST(request: Request) {
    try {
      // Parse the tasks from the request body
      let { id, update } = await request.json();
      console.log("rewardId in update-reward", id)
      console.log("update", update)

      // Validate input
      if (!id) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }
     id = assertInt(id)

      // Call the addTask method from the service
      await updateRewardClaimById(id, update);

      return NextResponse.json({ message:"success", status: 200 });

    } catch (error) {
        console.error('Error updating reward:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 

