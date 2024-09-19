import { NextResponse } from 'next/server';
import { getChildById } from '@/services/childService'; // Adjust the import based on your actual file structure

export async function POST(request: Request) {
    try {
        let { id } = await request.json();

        if (!id) {
            return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
        }
        
        if (typeof id !== 'number') {
            id = parseInt(id, 10);
        }
        
        // Fetch children data from the database
        const child = await getChildById(id);

        return NextResponse.json(child, { status: 200 });
    } catch (error) {
        console.error('Error fetching children:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
