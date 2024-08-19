import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { getUserDB } from "@/db/userService"
import CredentialsProvider from 'next-auth/providers/credentials'; 

const authHandler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
              email: { label: 'Email', type: 'email' },
              password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
              if (!credentials || !credentials.email || !credentials.password) {
                return null;
              }
              let user = await getUserDB(credentials.email, credentials.password);
              
              if (user) {
                return user;
              } else {
                return null;
              }
            },
          }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/auth/signup', 
        error: '/auth/error',
    },
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        async redirect({ url, baseUrl }) {
            if (url === '/api/auth/session' || url === baseUrl) {
              return `${baseUrl}/main/dashboard`; 
            }

            if (url === '/api/auth/signout') {
              return `${baseUrl}/auth/login`;
            }
            
            return baseUrl;
        },
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id as string;
                token.email = user.email as string;
                token.name = user.name as string | undefined;
                token.image = user.image as string | undefined;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user = {
                    id: token.id as string,
                    email: token.email as string,
                    name: token.name as string | undefined,
                    image: token.image as string | undefined
                };
            }
            return session;
        }
    }
});

export const GET = authHandler;
export const POST = authHandler;


