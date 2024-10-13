'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';
import Navbar from '@/components/main/Navbar';
import SideMenu from '@/components/main/SideMenu';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { DataProvider } from '@/app/context/dataContext';

interface PageProps {
  params: {
    id: string;
  };
}

const Page = ({ params }: PageProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [MainContainer, setMainContainer] = useState<React.ComponentType<any> | null>(null);
  let type, userIdString, id, name, email, user;

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if(session){
    type = sessionStorage.getItem("userType");
    userIdString = sessionStorage.getItem("userId");
    name = session?.user?.name;
    id = userIdString ? parseInt(userIdString, 10) : null;
    email = sessionStorage.getItem("userEmail") || session.user.email;
    user = {type, id, name, email}
  }

  useEffect(() => {
    const Component = dynamic(() => import('@/components/main/child/ChildProfile'));
    setMainContainer(() => Component);
  }, [id]);

  return (
    <>
      {session ? (
       <DataProvider user={user}>
        <div className="flex flex-col min-h-screen bg-light-background dark:bg-dark-background">
          <Navbar user={user}/>
          <div className="flex flex-1">
            <SideMenu user={user}/>
            <main className="flex-1 p-6">
              {MainContainer ? (
                <MainContainer user={user} />
              ) : (
                <></>
              )}
            </main>
          </div>
        </div>
      </DataProvider>
      ) : (
        <Loading />
      )}
    </>
  );
};

export default Page;
