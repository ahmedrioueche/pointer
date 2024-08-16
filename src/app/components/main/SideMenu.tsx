'use client';

import React from 'react';
import { FaTasks, FaCoins, FaGift, FaChartBar, FaUser } from 'react-icons/fa';
import Link from 'next/link';

const SideMenu: React.FC = () => {
    return (
        <aside className="w-64 bg-light-background dark:bg-dark-background p-4 shadow-md">
            <ul className="space-y-4">
                <li>
                    <Link href="/dashboard" className="flex items-center text-dark-text dark:text-light-text hover:text-light-accent dark:hover:text-dark-accent transition-colors">
                        <FaChartBar className="text-xl mr-3" />
                        Dashboard
                    </Link>
                </li>
                <li>
                    <Link href="/tasks" className="flex items-center text-dark-text dark:text-light-text hover:text-light-accent dark:hover:text-dark-accent transition-colors">
                        <FaTasks className="text-xl mr-3" />
                        Tasks
                    </Link>
                </li>
                <li>
                    <Link href="/points" className="flex items-center text-dark-text dark:text-light-text hover:text-light-accent dark:hover:text-dark-accent transition-colors">
                        <FaCoins className="text-xl mr-3" />
                        Points
                    </Link>
                </li>
                <li>
                    <Link href="/rewards" className="flex items-center text-dark-text dark:text-light-text hover:text-light-accent dark:hover:text-dark-accent transition-colors">
                        <FaGift className="text-xl mr-3" />
                        Rewards
                    </Link>
                </li>
                <li>
                    <Link href="/profile" className="flex items-center text-dark-text dark:text-light-text hover:text-light-accent dark:hover:text-dark-accent transition-colors">
                        <FaUser className="text-xl mr-3" />
                        Profile
                    </Link>
                </li>
            </ul>
        </aside>
    );
};

export default SideMenu;
