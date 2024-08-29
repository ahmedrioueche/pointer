'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from '@/app/components/Loading';
import Navbar from '@/app/components/main/Navbar';
import SideMenu from '@/app/components/main/SideMenu';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import MainLoading from '@/app/components/main/MainLoading';

interface PageProps {
  params: {
    id: string;
  };
}

const Page = ({ params }: PageProps) => {
  const { id } = params;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [MainContainer, setMainContainer] = useState<React.ComponentType<any> | null>(null);
  let userType, userIdString, userId, user;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if(session){
    userType = sessionStorage.getItem("userType");
    userIdString = sessionStorage.getItem("userId");
    userId = userIdString ? parseInt(userIdString, 10) : null;
    user = {userType, userId}
  }

  const firstName = session?.user?.name?.split(' ')[0];

  useEffect(() => {
    const Component = dynamic(() => import('@/app/components/main/ChildProfile'));
    setMainContainer(() => Component);
  }, [id]);

  return (
    <>
      {session ? (
        <div className="flex flex-col min-h-screen bg-light-background dark:bg-dark-background">
          <Navbar firstName={firstName} user={user}/>
          <div className="flex flex-1">
            <SideMenu user={user}/>
            <main className="flex-1 p-6">
              {MainContainer ? (
                <MainContainer id={id} />
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
