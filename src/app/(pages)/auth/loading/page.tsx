"use client";
import Loading from '@/app/components/Loading';
import { apiInsertDB } from '@/lib/dbHelper';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function LoadingPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        if (status === 'loading' || fetching) return;
        if (!session) {
            router.push('/auth/login');
            return;
        }

        const fetchParentData = async () => {
            setFetching(true); // Set the fetching flag to true to prevent multiple calls

            try {
                const response = await fetch('/api/auth/loading', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: session?.user.email }),
                });

                const parent = await response.json();

                console.log("parent", parent);
                
                if (parent) {
                    if (parent.children_count === 0) {
                        router.push('/auth/confirm');
                        return;
                    }

                    if (parent.subscription_type === null) {
                        router.push('/auth/plans');
                        return;
                    }

                    router.push('/main/dashboard');
                    
                } else {
                    const parentId: any = await apiInsertDB(session.user, "", "/api/insert-parent");

                    console.log("parentId", parentId)

                    sessionStorage.setItem("parentId", parentId);

                    router.push('/auth/confirm');
                }
            } catch (error) {
                console.error('Error fetching parent data:', error);
                router.push('/auth/error');
            } finally {
                setFetching(false); // Reset the fetching flag once the call is complete
            }
        };

        fetchParentData();

    }, [status, session, router, fetching]);

    return <Loading />;
}

export default LoadingPage;
