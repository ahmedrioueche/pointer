'use client';

import React, { useEffect, useState } from 'react';
import { AiOutlineLoading3Quarters, AiOutlineCheckCircle } from 'react-icons/ai';

const Loading: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        setIsDarkMode(savedTheme === 'dark');
    }, []);

    return (
        <section
            className={`py-20 flex items-center justify-center min-h-screen ${
                isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
            } transition-colors duration-300`}
        >
            <div className="container mx-auto flex flex-col items-center">
                <div
                    className={`relative w-full max-w-lg flex flex-col items-center rounded-xl shadow-2xl p-10 ${
                        isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'
                    } transition-all duration-500`}
                >
                    <div className="flex items-center justify-center mb-8">
                        <AiOutlineLoading3Quarters
                            className={`text-7xl animate-spin ${
                                isDarkMode ? 'text-blue-400' : 'text-blue-600'
                            }`}
                        />
                    </div>
                    <h2
                        className={`text-3xl font-extrabold mb-6 ${
                            isDarkMode ? 'bg-gradient-to-r from-purple-400 to-blue-400' : 'bg-gradient-to-r from-blue-500 to-purple-500'
                        } text-transparent bg-clip-text`}
                    >
                        Loading...
                    </h2>
                    <p className="text-lg text-center">
                        We’re getting everything ready for you. It won’t take long!
                    </p>
                </div>
                <div
                    className="mt-10 flex items-center space-x-2 text-sm text-gray-500"
                >
                    <AiOutlineCheckCircle
                        className={`${
                            isDarkMode ? 'text-green-400' : 'text-green-600'
                        } transition-colors duration-300`}
                    />
                    <span className={`${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Thanks for your patience
                    </span>
                </div>
            </div>
        </section>
    );
};

export default Loading;
