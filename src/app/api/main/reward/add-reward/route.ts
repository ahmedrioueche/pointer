import { addReward } from '@/db/rewardService'; // Import the service function
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {

      let { reward } = await request.json();

      if (!reward) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
      }

      const id = await addReward(reward);

      return NextResponse.json({ id: id, status: 200 });

    } catch (error) {
        console.error('Error adding reward:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 

