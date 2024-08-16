// types/next-auth.d.ts

import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
    };
  }

  interface Token {
    id?: string;
    email?: string;
    name?: string;
    image?: string;
  }
}
