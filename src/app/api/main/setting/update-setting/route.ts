import { updateSettings } from '@/services/settingService'; // Import the service function
import { assertInt } from '@/lib/helper';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
      let { parentId, settings } = await request.json();


      if (!parentId || !settings) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
      }

      parentId = assertInt(parentId);
      
      const response = await updateSettings(parentId, settings);

      return NextResponse.json({ response: response, status: 200 });

    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 

