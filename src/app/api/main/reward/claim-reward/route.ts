import { claimReward } from '@/db/rewardService'; 
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
      let { rewardId, childId } = await request.json();

      if (!rewardId || !childId) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
    }

      const result = await claimReward(rewardId, childId );
    
      return NextResponse.json({ result: result, status: 200 });

    } catch (error) {
        console.error('Error fetching children:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 

