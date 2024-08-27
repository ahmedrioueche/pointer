'use client';

import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import Link from 'next/link';

const ErrorPage: React.FC = () => {
    // Use localStorage to determine if dark mode is enabled
    const savedTheme = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
    const isDarkMode = savedTheme === 'dark';

    return (
        <section
            className={`py-16 flex items-center justify-center min-h-screen ${
                isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
            } transition-colors duration-300`}
        >
            <div className="container mx-auto flex flex-col items-center">
                <div
                    className={`relative md:w-1/2 flex flex-col items-center rounded-lg shadow-2xl p-8 ${
                        isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
                    } transition-all duration-500`}
                >
                    <FaExclamationTriangle
                        className={`text-5xl mb-4 ${
                            isDarkMode ? 'text-red-400' : 'text-red-600'
                        }`}
                    />
                    <h2
                        className={`text-2xl font-bold mb-4 ${
                            isDarkMode
                                ? 'bg-gradient-to-r from-purple-400 to-blue-400 text-transparent bg-clip-text'
                                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text'
                        }`}
                    >
                        Something Went Wrong
                    </h2>
                    <p className={`text-lg mb-6 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                        An error occurred while trying to process your request. Please try again later or contact support if the issue persists.
                    </p>
                    <Link
                        href="/"
                        className={`w-full px-6 py-3 rounded-md font-medium flex items-center justify-center gap-2 transition-colors duration-300 ${
                            isDarkMode ? 'bg-blue-600 text-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500' : 'bg-blue-500 text-white hover:bg-gradient-to-r hover:from-purple-400 hover:to-blue-400'
                        }`}
                    >
                        <span>Go Home</span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ErrorPage;
