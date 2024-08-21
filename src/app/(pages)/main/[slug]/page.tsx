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
    slug: string;
  };
}

const Page = ({ params }: PageProps) => {
  const { slug } = params;
  const { data: session, status } = useSession();
  const router = useRouter();
  const [MainContainer, setMainContainer] = useState<React.ComponentType<any> | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  const firstName = session?.user?.name?.split(' ')[0];

  useEffect(() => {
    let Component: React.ComponentType<any> | null = null;

    switch (slug) {
      case 'home':
        Component = dynamic(() => import('@/app/components/main/Home'));
        break;
      case 'dashboard':
        Component = dynamic(() => import('@/app/components/main/Dashboard'));
        break;
      case 'tasks':
        Component = dynamic(() => import('@/app/components/main/Tasks'));
        break;
      case 'rewards':
        Component = dynamic(() => import('@/app/components/main/Rewards'));
        break;
      default:
        Component = dynamic(() => import('@/app/components/main/Home'));
        break;
    }

    setMainContainer(() => Component);
  }, [slug]);

  return (
    <>
      {session ? (
        <div className="flex flex-col min-h-screen bg-light-background dark:bg-dark-background">
          <Navbar firstName={firstName} />
          <div className="flex flex-1">
            <SideMenu />
            <main className="flex-1 p-6">
              {MainContainer ? (
                <MainContainer />
              ) : (
                <MainLoading numCards={6} />
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
