"use client";

import React from 'react';
import { FaExclamationTriangle } from 'react-icons/fa';
import Link from 'next/link';

const ErrorPage: React.FC = () => {
    return (
        <section className={`py-16 flex items-center justify-center min-h-screen dark:bg-dark-background bg-light-background`}>
            <div className="container mx-auto flex flex-col items-center">
                <div className="relative md:w-1/2 flex flex-col items-center bg-white dark:bg-dark-background rounded-lg shadow-lg p-8 font-stix">
                    <FaExclamationTriangle className="text-5xl mb-4 text-red-500 dark:text-red-400" />
                    <h2 className={`text-3xl font-bold mb-4 bg-gradient-to-r from-dark-primary to-dark-accent text-transparent bg-clip-text`}>
                        Something Went Wrong
                    </h2>
                    <p className={`text-lg mb-6 ${document.documentElement.classList.contains('dark') ? 'text-dark-text' : 'text-light-text'}`}>
                        An error occurred while trying to process your request. Please try again later or contact support if the issue persists.
                    </p>
                    <Link href="/" className="w-full px-6 py-3 rounded-md bg-light-primary dark:bg-dark-primary text-white font-medium flex items-center justify-center gap-2 transition-colors duration-100 hover:bg-blue-600">
                        <span>Go to Home</span>
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default ErrorPage;
