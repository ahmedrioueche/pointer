import { deleteRewardById } from '../../../../../db/rewardService'; // Import the service function
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
      let { id } = await request.json();

      if (!id) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
      }

      await deleteRewardById(id);

      return NextResponse.json({ message:"success", status: 200 });

    } catch (error) {
        console.error('Error deleting reward:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 

