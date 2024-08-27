import { NextResponse } from 'next/server';
import { getChildrenByParentId } from '@/db/childService'; 

export async function POST(request: Request) {
    try {
        let { id } = await request.json();
        console.log("id in POST", id)
        
        if (!id) {
            return NextResponse.json({ error: 'Invalid parentId' }, { status: 400 });
        }

        
        if(typeof id !== "number"){
            id = parseInt(id, 10);
        }

        const children = await getChildrenByParentId(id);

        return NextResponse.json(children, { status: 200 });
    } catch (error) {
        console.error('Error fetching children:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
