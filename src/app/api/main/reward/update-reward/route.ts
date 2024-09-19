import { assert } from 'console';
import { updateRewardById } from '../../../../../services/rewardService'; // Import the service function
import { NextResponse } from 'next/server';
import { assertInt } from '@/utils/helper';

export async function POST(request: Request) {
    try {

      let { id, update } = await request.json();

      if (!id) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
      }
     
      id = assertInt(id)

      await updateRewardById(id, update);

      return NextResponse.json({ message:"success", status: 200 });

    } catch (error) {
        console.error('Error updating reward:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 

