'use client';

import React from 'react';
import { FaTasks, FaCoins, FaGift } from 'react-icons/fa';

const MainMenu: React.FC = () => {
    return (
        <div className="flex flex-col md:flex-row md:space-x-8 space-y-4 md:space-y-0">
            <div className="flex-1 bg-light-background dark:bg-dark-background p-6 rounded-lg shadow-md flex items-center justify-center flex-col">
                <FaTasks className="text-6xl text-light-primary dark:text-dark-primary mb-4" />
                <h3 className="text-2xl font-stix font-semibold text-dark-text dark:text-light-text">Task Management</h3>
                <p className="text-light-secondary dark:text-dark-secondary text-center">Create and assign tasks, track progress, and manage completions.</p>
            </div>
            <div className="flex-1 bg-light-background dark:bg-dark-background p-6 rounded-lg shadow-md flex items-center justify-center flex-col">
                <FaCoins className="text-6xl text-light-primary dark:text-dark-primary mb-4" />
                <h3 className="text-2xl font-stix font-semibold text-dark-text dark:text-light-text">Point System</h3>
                <p className="text-light-secondary dark:text-dark-secondary text-center">Reward tasks with points to encourage positive behavior.</p>
            </div>
            <div className="flex-1 bg-light-background dark:bg-dark-background p-6 rounded-lg shadow-md flex items-center justify-center flex-col">
                <FaGift className="text-6xl text-light-primary dark:text-dark-primary mb-4" />
                <h3 className="text-2xl font-stix font-semibold text-dark-text dark:text-light-text">Exciting Rewards</h3>
                <p className="text-light-secondary dark:text-dark-secondary text-center">Allow children to redeem points for various rewards.</p>
            </div>
        </div>
    );
};

export default MainMenu;
