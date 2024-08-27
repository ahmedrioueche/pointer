import { getRewardsByChildId } from '@/db/rewardService'; // Import the service function
import { NextResponse } from 'next/server';

// API route handler
export async function POST(request: Request) {
    try {
      // Parse the rewards from the request body
      let { id } = await request.json();
      console.log("id in get-reward POST", id)
      // Validate input 
      if (!id) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
      }
      
      if(typeof id != "number")
        id = parseInt(id, 10);

      const rewards = await getRewardsByChildId(id);

      return NextResponse.json({ rewards, status: 200 });

    } catch (error) {
        console.error('Error fetching rewards:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 

