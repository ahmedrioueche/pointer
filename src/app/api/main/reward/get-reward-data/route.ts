import { getRewardData } from '@/db/rewardService'; 
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
      let { id } = await request.json();

      if (!id) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
      }
      
      if(typeof id != "number")
        id = parseInt(id, 10);

      const data = await getRewardData(id);

      return NextResponse.json({ data, status: 200 });

    } catch (error) {
        console.error('Error fetching rewards:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 

