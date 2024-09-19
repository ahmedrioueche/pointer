import { NextResponse } from 'next/server';
import { getParentById } from '@/services/parentService';
import { assertInt } from '@/utils/helper';

export async function POST(request: Request) {
    try {
        let { parentId } = await request.json();

        if (!parentId) {
            return NextResponse.json({ error: 'Bad request' }, { status: 400 });
        }

        parentId = assertInt(parentId);
        
        const parent = await getParentById(parentId);

        return NextResponse.json(parent);

    } catch (error) {
        console.error('Error in loading route:', error);
        return NextResponse.json({ error: 'Failed to fetch parent data' }, { status: 500 });
    }
}
