"use client";
import Loading from '@/app/components/Loading';
import { apiInsertDB } from '@/lib/dbHelper';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

function LoadingPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [hasFetched, setHasFetched] = useState(false);

    useEffect(() => {
        if (status !== 'authenticated' || hasFetched) return;

        const fetchParentData = async () => {
            setHasFetched(true); 

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
                    if (parent.is_verified === null) {
                        router.push('/auth/verify');
                        return;
                    }

                    if (parent.children_count === 0) {
                        router.push('/auth/confirm');
                        return;
                    }

                    if (parent.subscription_type === null) {
                        router.push('/auth/plans');
                        return;
                    }

                    router.push('/main/home');
                    
                } else {
                    const parentId: any = await apiInsertDB(session?.user, "", "/api/insert-parent");

                    console.log("parentId", parentId)

                    sessionStorage.setItem("parentId", parentId);

                    router.push('/auth/confirm');
                }
            } catch (error) {
                console.error('Error fetching parent data:', error);
                router.push('/auth/error');
            }
        };

        fetchParentData();

    }, [status, session, router, hasFetched]);

    return <Loading />;
}

export default LoadingPage;
