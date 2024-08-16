// app/(pages)/main/dashboard/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Loading from '../../../components/Loading'; // Import the Loading component
import Navbar from '@/app/components/main/Navbar';
import MainMenu from '@/app/components/main/MainMenu';
import SideMenu from '@/app/components/main/SideMenu';

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') return <Loading />; 
  if (!session) {
    router.push('/auth/login');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen bg-light-background dark:bg-dark-background">
        <Navbar />
        <div className="flex flex-1">
            <SideMenu />
            <main className="flex-1 p-6">
                <h1 className="text-3xl font-bold mb-6 text-dark-text dark:text-light-text">Dashboard</h1>
                <MainMenu />
            </main>
        </div>
    </div>
);
};

export default Dashboard;
