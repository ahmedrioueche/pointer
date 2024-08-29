// types/next-auth.d.ts

import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    email?: string;
    name?: string;
    image?: string;
    userType?: string; 
  }

  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
      userType?: string;
    };
    isNewUser?: boolean; 
  }

  interface Token {
    id?: string;
    email?: string;
    name?: string;
    image?: string;
    userType?: string;
    isNewUser?: boolean; 
  }
}
