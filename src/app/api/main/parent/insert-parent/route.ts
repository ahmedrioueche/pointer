import { NextResponse } from 'next/server';
import { getParentByEmail, insertParent } from '@/db/parentService';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { id, email, name } = await request.json();

        if (!id || !email || !name) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const [firstName, lastName] = getName(name);

        const hashedPassword = await bcrypt.hash(id, 10);

        const parent = {
            firstName: firstName,
            lastName:lastName,
            email: email,
            password: hashedPassword,
            isVerified: true,
        }

        const result = await insertParent(parent);

        return NextResponse.json(result);

    } catch (error) {
        console.error('Error in loading route:', error);
        return NextResponse.json({ error: 'Failed to fetch parent data' }, { status: 500 });
    }
}

const getName = (fullName: string | null | undefined): [string, string] => {
    if (!fullName) {
      return ["", ""];
    }
  
    const nameParts = fullName.trim().split(" ");
    const firstName = nameParts[0] || "";
    const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";
  
    return [firstName, lastName];
  };