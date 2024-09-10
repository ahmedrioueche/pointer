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

        console.log("session", session);
        const userType = session.user.userType;
        console.log("userType", userType);
        const userId = session.user.id;
        console.log("userId", userId);
        
        //in loggin with child creds userType is defined. In case of loggin in with google (only for parent), 
        //we set userType manually
        userType? sessionStorage.setItem("userType", userType) : null;
        //in loggin with child creds userId is defined, in case of loggin in with google we dont want the gooogle id, 
        //so we get the parent id from db later
        (userId && userType != "parent") ? sessionStorage.setItem("userId", userId) : null;

        const fetchParentData = async () => {
            setHasFetched(true); 

            try {
                const response = await fetch('/api/main/parent/get-parent', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email: session?.user.email }),
                });
                
                const parent = await response.json();
                console.log("parent", parent);

                if (parent && !parent.error) {
                    
                    sessionStorage.setItem("userEmail", parent.email);
                    sessionStorage.setItem("userId", parent.id);
                    sessionStorage.setItem("userType", 'parent');
                    sessionStorage.setItem("username", parent.username || parent.firstName);

                    if (parent.isVerified === null) {
                        router.push('/auth/verify');
                        return;
                    }

                    if (parent.childrencount === null || parent.childrenCount === 0) {
                        router.push('/auth/confirm');
                        return;
                    }

                    if (parent.subscriptionType === null) {
                        router.push('/auth/plans');
                        return;
                    }

                    router.push('/main/home');
                    return;

                } else {
                    const result: any = await apiInsertDB(session?.user, "", "/api/main/parent/insert-parent");

                    const parentId = result.parentId;
                    if(parentId === undefined || parentId === "undefined"){
                        //failed, try again 
                        const result: any = await apiInsertDB(session?.user, "", "/api/main/parent/insert-parent");
                        const parentId = result.parentId;
                        if(parentId === undefined || parentId === "undefined"){
                            //something is wrong!
                            router.push("/auth/error");
                            return;
                        }
                    }

                    const email = result.email;

                    sessionStorage.setItem("userEmail", email);
                    sessionStorage.setItem("userId", parentId);

                    router.push('/auth/confirm');
                    return;
                }
            } catch (error) {
                console.error('Error fetching parent data:', error);
                router.push('/auth/error');
            }
        };

        if(userType === "parent" || userType === undefined)
            fetchParentData();
        else 
            router.push('/main/home')
        
    }, [status, session, router, hasFetched]);

    return <Loading />;
}

export default LoadingPage;
