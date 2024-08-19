import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import pool from '@/db/db'; // Adjust the import path as needed
import getUserDB from '@/db/userService'; // Adjust the import path as needed

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

    const user = await getUserDB(email, password);

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

// Export handlers for different HTTP methods
export const POST = handlePost;
