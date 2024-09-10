import { getRewardsByParentId } from '../../../../../db/rewardService'; // Import the service function
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
      let { id } = await request.json();

      if (!id) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
      }

      if(typeof id === "string")
        id = parseInt(id, 10);

      const rewards = await getRewardsByParentId(id);

      return NextResponse.json({ rewards: rewards, status: 200 });

    } catch (error) {
        console.error('Error fetching rewards:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 

