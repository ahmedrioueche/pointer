/* signup logic
    if user signs up using email, their data is stored directly in db in /auth/signup/page.tsx.
    since user is always redirected to this page (/auth/loading/page.tsx) when signing up or login in,
    this page checks if user exists in db (either they have signed up with email, or they have logged in via
    email or 0auth), if the user exists, it checks the user data to detemine what page to route to.
    if the user doesnt exist in db (signed up using 0auth for the first time), this page inserts the user in db
    with setting is_verified to true, since no future email verification is required when using 0auth.
*/

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
                    
                    sessionStorage.setItem("userId", parent.id);
                    sessionStorage.setItem("userEmail", parent.email);
                    sessionStorage.setItem("userType", "parent");

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
                    const result: any = await apiInsertDB(session?.user, "", "/api/insert-parent");

                    console.log("parentId in else", result)

                    const parentId = result.parentId;

                    sessionStorage.setItem("userId", parentId);
                    sessionStorage.setItem("userType", "parent");

                  //  router.push('/auth/confirm');
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
