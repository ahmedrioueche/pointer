'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from '@/app/components/Loading';
import Navbar from '@/app/components/main/Navbar';
import SideMenu from '@/app/components/main/SideMenu';
import { lazy, Suspense, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import MainLoading from '@/app/components/main/MainLoading';
import LoadingSkeleton from '@/app/components/LoadingSceleton';

interface PageProps {
  params: {
    slug: string;
  };
}

const Page = ({ params }: PageProps) => {
  const { slug } = params;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [Component, setComponent] = useState<React.LazyExoticComponent<React.FC<any>> | null>(null);
  let userType, userIdString, userId, username, user;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
 
  }, [status, router]);


  if(session){
    userType = sessionStorage.getItem("userType");
    userIdString = sessionStorage.getItem("userId");
    username = session?.user?.name;
    userId = userIdString ? parseInt(userIdString, 10) : null;
    user = {userType, userId, username}
  }

  const firstName = session?.user?.name?.split(' ')[0];

  useEffect(() => {
    switch (slug) {
      case 'home':
        setComponent(() => lazy(() => import('@/app/components/main/Home')));
        break;
      case 'dashboard':
        setComponent(() => lazy(() => import('@/app/components/main/Dashboard')));
        break;
      case 'tasks':
        setComponent(() => lazy(() => import('@/app/components/main/tasks/Tasks')));
        break;
      case 'rewards':
        setComponent(() => lazy(() => import('@/app/components/main/Rewards')));
        break;
      case 'settings':
        setComponent(() => lazy(() => import('@/app/components/main/Settings')));
        break;
      default:
        setComponent(() => lazy(() => import('@/app/components/main/Home')));
        break;
    }
  }, [slug]);

  if (status === 'loading') return <LoadingSkeleton/>;
  if (!session) return <Loading />;

  const MainContainer = Component ? Component : null;

  return (
    <>
      {session ? (
        <div className="flex flex-col min-h-screen bg-light-background dark:bg-dark-background">
          <Navbar firstName={firstName} user={user} />
          <div className="flex flex-1">
            <SideMenu user={user} />
            <main className="flex-1 p-1">
              {MainContainer ? (
                 <Suspense fallback={<MainLoading numCards={6} />}>
                    <MainContainer user={user} />
                </Suspense>
              ) : (
                <></>
              )}
            </main>
          </div>
        </div>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Page;
