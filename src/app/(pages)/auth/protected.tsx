"use client";

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/router';

const ProtectedPage = () => {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === 'loading') {
        return <p>Loading...</p>;
    }

    if (!session) {
        router.push('/auth/signin');
        return null;
    }

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold">Protected Page</h1>
            <p>Welcome, {session.user?.email}!</p>
        </div>
    );
};

export default ProtectedPage;
