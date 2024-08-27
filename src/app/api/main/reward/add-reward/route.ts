import { addReward } from '@/db/rewardService'; // Import the service function
import { NextResponse } from 'next/server';

// API route handler
export async function POST(request: Request) {
    try {
      // Parse the rewards from the request body
      let { reward } = await request.json();
      console.log("reward in POST", reward)
      // Validate input
      if (!reward) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

      // Call the addTask method from the service
      const id = await addReward(reward);

      return NextResponse.json({ id: id, status: 200 });

    } catch (error) {
        console.error('Error fetching children:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 

