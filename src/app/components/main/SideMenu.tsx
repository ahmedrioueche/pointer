'use client';

import React, { useEffect, useState } from 'react';
import { FaTasks, FaCoins, FaGift, FaChartBar, FaUser, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import Link from 'next/link';

const SideMenu: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
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
                className="absolute top-1/2 right-[-1.5rem] transform translate-x-1/2 -translate-y-1/2 p-1 rounded-full bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
                style={{ zIndex: 20 }}
            >
                {isCollapsed ? <FaArrowRight size={20} /> : <FaArrowLeft size={20} />}
            </button>

            <ul className="space-y-4">
                <li>
                    <Link
                        href="/dashboard"
                        className="flex items-center px-3 py-2 rounded-lg text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent hover:text-light-background dark:hover:text-dark-background transition-colors"
                    >
                        <FaChartBar className={`text-${isCollapsed ? '3xl' : '2xl'} ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                        {!isCollapsed && <span>Dashboard</span>}
                    </Link>
                </li>
                <li>
                    <Link
                        href="/tasks"
                        className="flex items-center px-3 py-2 rounded-lg text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent hover:text-light-background dark:hover:text-dark-background transition-colors"
                    >
                        <FaTasks className={`text-${isCollapsed ? '3xl' : '2xl'} ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                        {!isCollapsed && <span>Tasks</span>}
                    </Link>
                </li>
                <li>
                    <Link
                        href="/points"
                        className="flex items-center px-3 py-2 rounded-lg text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent hover:text-light-background dark:hover:text-dark-background transition-colors"
                    >
                        <FaCoins className={`text-${isCollapsed ? '3xl' : '2xl'} ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                        {!isCollapsed && <span>Points</span>}
                    </Link>
                </li>
                <li>
                    <Link
                        href="/rewards"
                        className="flex items-center px-3 py-2 rounded-lg text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent hover:text-light-background dark:hover:text-dark-background transition-colors"
                    >
                        <FaGift className={`text-${isCollapsed ? '3xl' : '2xl'} ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                        {!isCollapsed && <span>Rewards</span>}
                    </Link>
                </li>
                <li>
                    <Link
                        href="/profile"
                        className="flex items-center px-3 py-2 rounded-lg text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent hover:text-light-background dark:hover:text-dark-background transition-colors"
                    >
                        <FaUser className={`text-${isCollapsed ? '3xl' : '2xl'} ${isCollapsed ? 'mx-auto' : 'mr-3'}`} />
                        {!isCollapsed && <span>Profile</span>}
                    </Link>
                </li>
            </ul>
        </aside>
    );
};

export default SideMenu;
