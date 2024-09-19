import { getSettingsByParentId } from '@/services/settingService'; 
import { assertInt } from '@/utils/helper';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
      let { parentId } = await request.json();

      if (!parentId) {
        return NextResponse.json({ error: 'Invalid input' }, { status: 400 });
      }

      parentId = assertInt(parentId);
      
      const response = await getSettingsByParentId(parentId);

      return NextResponse.json({ response: response, status: 200 });

    } catch (error) {
        console.error('Error updating settings:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
  } 

