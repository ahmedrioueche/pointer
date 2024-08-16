'use client';

import React from 'react';
import Link from 'next/link';
import { FaHome, FaUser, FaCog } from 'react-icons/fa';

const Navbar: React.FC = () => {
    return (
        <nav className="bg-light-primary dark:bg-dark-primary shadow-md">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                <Link href="/" className="text-2xl font-satisfy text-light-background dark:text-dark-background">
                    Dashboard
                </Link>
                <div className="space-x-4">
                    <Link href="/" className="text-light-text dark:text-dark-text hover:text-light-accent dark:hover:text-dark-accent transition-colors">
                        <FaHome />
                    </Link>
                    <Link href="/profile" className="text-light-text dark:text-dark-text hover:text-light-accent dark:hover:text-dark-accent transition-colors">
                        <FaUser />
                    </Link>
                    <Link href="/settings" className="text-light-text dark:text-dark-text hover:text-light-accent dark:hover:text-dark-accent transition-colors">
                        <FaCog />
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
