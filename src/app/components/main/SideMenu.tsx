'use client';

import React, { useEffect, useState } from 'react';
import { FaTasks, FaCoins, FaGift, FaChartBar, FaUser, FaArrowLeft, FaArrowRight, FaHome, FaLightbulb, FaDice, FaTrophy } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SideMenu: React.FC<{user : any}> = ( user : any ) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [userType, setUserType] = useState();
    const pathname = usePathname();

    useEffect(() => {

        setUserType(user.user.userType);

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); // Call it once to set the initial state

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <aside
            className={`relative top-0 left-0 transition-all duration-300 ease-in-out ${
                isMobile ? 'hidden' : (isCollapsed ? 'w-20' : 'w-64')
            } bg-light-background dark:bg-dark-background p-4 shadow-md`}
        >
            <button 
                onClick={toggleCollapse} 
                className="absolute top-1/2 right-[0.7rem] transform translate-x-1/2 -translate-y-1/2 p-1 rounded-full bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
                style={{ zIndex: 20 }}
            >
                {isCollapsed ? <FaArrowRight size={20} /> : <FaArrowLeft size={20} />}
            </button>

            <ul className="space-y-4">
                <li>
                    <Link
                        href="/main/home"
                        className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                            pathname === '/main/home' 
                                ? 'bg-gray-200 dark:bg-gray-700 text-light-accent dark:text-dark-accent' 
                                : 'text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent hover:text-light-background dark:hover:text-dark-background'
                        }`}
                    >
                        <FaHome className={`text-${isCollapsed ? '3xl' : '2xl'} ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                        {!isCollapsed && <span>Home</span>}
                    </Link>
                </li>
                <li>
                    <Link
                        href="/main/dashboard"
                        className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                            pathname === '/main/dashboard' 
                            ? 'bg-gray-200 dark:bg-gray-700 text-light-accent dark:text-dark-accent' 
                            : 'text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent hover:text-light-background dark:hover:text-dark-background'
                        }`}
                    >
                        <FaChartBar className={`text-${isCollapsed ? '3xl' : '2xl'} ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                        {!isCollapsed && <span>Dashboard</span>}
                    </Link>
                </li>
                <li>
                    <Link
                        href="/main/rewards"
                        className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                            pathname === '/main/rewards' 
                            ? 'bg-gray-200 dark:bg-gray-700 text-light-accent dark:text-dark-accent' 
                            : 'text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent hover:text-light-background dark:hover:text-dark-background'
                        }`}
                    >
                        <FaGift className={`text-${isCollapsed ? '3xl' : '2xl'} ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                        {!isCollapsed && <span>Rewards</span>}
                    </Link>
                </li>
                {userType != "child" && (
                 <li>
                    <Link
                        href="/main/tasks"
                        className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                            pathname === '/main/tasks' 
                            ? 'bg-gray-200 dark:bg-gray-700 text-light-accent dark:text-dark-accent' 
                            : 'text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent hover:text-light-background dark:hover:text-dark-background'
                        }`}
                    >
                        <FaTasks className={`text-${isCollapsed ? '3xl' : '2xl'} ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                        {!isCollapsed && <span>Tasks</span>}
                    </Link>
                 </li>
                )}
              
                <li>
                    <Link
                        href="/main/competitions"
                        className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                            pathname === '/main/competitions' 
                            ? 'bg-gray-200 dark:bg-gray-700 text-light-accent dark:text-dark-accent' 
                            : 'text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent hover:text-light-background dark:hover:text-dark-background'
                        }`}
                    >
                        <FaTrophy className={`text-${isCollapsed ? '3xl' : '2xl'} ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                        {!isCollapsed && <span>Competitions</span>}
                    </Link>
                </li>
             
                
                <li>
                    <Link
                        href="/main/quizzes"
                        className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                            pathname === '/main/quizzes' 
                            ? 'bg-gray-200 dark:bg-gray-700 text-light-accent dark:text-dark-accent' 
                            : 'text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent hover:text-light-background dark:hover:text-dark-background'
                        }`}
                    >
                        <FaLightbulb className={`text-${isCollapsed ? '3xl' : '2xl'} ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                        {!isCollapsed && <span>Quizzes</span>}
                    </Link>
                </li>
                <li>
                    <Link
                        href="/main/games"
                        className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                            pathname === '/main/games' 
                            ? 'bg-gray-200 dark:bg-gray-700 text-light-accent dark:text-dark-accent' 
                            : 'text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent hover:text-light-background dark:hover:text-dark-background'
                        }`}
                    >
                        <FaDice className={`text-${isCollapsed ? '3xl' : '2xl'} ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                        {!isCollapsed && <span>Games</span>}
                    </Link>
                </li>

            </ul>
        </aside>
    );
};

export default SideMenu;
