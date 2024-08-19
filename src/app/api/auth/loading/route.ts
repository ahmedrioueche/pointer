import { NextResponse } from 'next/server';
import { getParentByEmail } from '@/db/parentService';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const parent = await getParentByEmail(email);

        return NextResponse.json(parent);

    } catch (error) {
        console.error('Error in loading route:', error);
        return NextResponse.json({ error: 'Failed to fetch parent data' }, { status: 500 });
    }
}
