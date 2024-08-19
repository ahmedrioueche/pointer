'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from '../../../components/Loading'; 
import Navbar from '@/app/components/main/Navbar';
import MainMenu from '@/app/components/main/MainMenu';
import SideMenu from '@/app/components/main/SideMenu';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Extract the first name from the session data
  const firstName = session?.user?.name?.split(' ')[0];

  return (

    <>
      {session? (
      <div className="flex flex-col min-h-screen bg-light-background dark:bg-dark-background">
        <Navbar firstName={firstName} />
        <div className="flex flex-1">
          <SideMenu />
          <main className="flex-1 p-6">
            <MainMenu />
          </main>
        </div>
      </div>
      ) : (
        <Loading/>
      )}
    </>
  );
};

export default Dashboard;
