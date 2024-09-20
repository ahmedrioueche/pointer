'use client';

import React, { useEffect, useState } from 'react';
import { FaTasks, FaGift, FaChartBar, FaUser, FaHome, FaCalendarAlt, FaDice, FaTrophy, FaBook, FaQuestionCircle, FaLightbulb } from 'react-icons/fa';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SideMenu: React.FC<{ user: any }> = ({ user }) => {
    const [isCollapsed, setIsCollapsed] = useState(true); // Start with collapsed
    const [isMobile, setIsMobile] = useState<boolean>(false);
    const [userType, setUserType] = useState<string>();
    const pathname = usePathname();

    useEffect(() => {
        setUserType(user.type);

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        handleResize(); 

        return () => window.removeEventListener('resize', handleResize);
    }, [user.type]);

    const handleMouseEnter = () => {
        setIsCollapsed(false);
    };

    const handleMouseLeave = () => {
        setIsCollapsed(true);
    };

    return (
        <aside
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={`relative top-0 left-0 transition-all duration-300 ease-in-out ${
                isMobile ? 'hidden' : (isCollapsed ? 'w-20' : 'w-64')
            } bg-light-background dark:bg-dark-background p-4 shadow-md`}
        >
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
                {userType !== "child" && (
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
                )}
                {userType !== "child" && (
                    <li>
                        <Link
                            href="/main/routines"
                            className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                                pathname === '/main/routines' 
                                ? 'bg-gray-200 dark:bg-gray-700 text-light-accent dark:text-dark-accent' 
                                : 'text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent hover:text-light-background dark:hover:text-dark-background'
                            }`}
                        >
                            <FaCalendarAlt className={`text-${isCollapsed ? '3xl' : '2xl'} ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                            {!isCollapsed && <span>Routines</span>}
                        </Link>
                    </li>
                )}
              
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
                <li>
                    <Link
                        href="/main/homework"
                        className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                            pathname === '/main/homework' 
                            ? 'bg-gray-200 dark:bg-gray-700 text-light-accent dark:text-dark-accent' 
                            : 'text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent hover:text-light-background dark:hover:text-dark-background'
                        }`}
                    >
                        <FaBook className={`text-${isCollapsed ? '3xl' : '2xl'} ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                        {!isCollapsed && <span>Homework</span>}
                    </Link>
                </li>
          
                <li>
                    <Link
                        href="/main/challenges"
                        className={`flex items-center px-3 py-2 rounded-lg transition-colors ${
                            pathname === '/main/competitions' 
                            ? 'bg-gray-200 dark:bg-gray-700 text-light-accent dark:text-dark-accent' 
                            : 'text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent hover:text-light-background dark:hover:text-dark-background'
                        }`}
                    >
                        <FaTrophy className={`text-${isCollapsed ? '3xl' : '2xl'} ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                        {!isCollapsed && <span>Challenges</span>}
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
             
                <hr className="w-full border-t border-gray-300 dark:border-gray-600 my-2" />
                <li>
                    <Link
                        href="/main/help"
                        className={`flex items-center px-3 rounded-lg transition-colors ${
                            pathname === '/main/help' 
                            ? 'bg-gray-200 dark:bg-gray-700 text-light-accent dark:text-dark-accent' 
                            : 'text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent hover:text-light-background dark:hover:text-dark-background'
                        }`}
                    >
                        <FaQuestionCircle className={`text-${isCollapsed ? '3xl' : '2xl'} ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                        {!isCollapsed && <span>Help</span>}
                    </Link>
                </li>
            
            </ul>
        </aside>
    );
};

export default SideMenu;
