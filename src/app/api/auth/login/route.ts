import { NextResponse } from 'next/server';
import { authenticateUser } from '@/services/userService'; // Adjust the import path as needed

interface DBUser {
  id: string;
  email: string;
  name?: string;
  image?: string;
  password: string;
}

async function handlePost(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ message: 'Email and password are required' }, { status: 400 });
    }

    const user = await authenticateUser(email, password);

    if (user) {
      return NextResponse.json({ user }, { status: 200 });
    } else {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    console.error('Error logging in user:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export const POST = handlePost;
