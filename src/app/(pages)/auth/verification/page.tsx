"use client"

import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const EmailVerification: React.FC = () => {
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            const isDark = savedTheme === 'dark';
            setIsDarkMode(isDark);
            document.documentElement.classList.toggle('dark', isDark);
        }
    }, []);

    const verifyCode = async (code: string) => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ code }),
            });

            const result = await response.json();

            if (response.ok) {
                setStatus({ success: true, message: 'Email verified successfully! You can now log in.' });
                // Redirect to login page after successful verification
                setTimeout(() => {
                    router.push('/auth/login');
                }, 2000);
            } else {
                setStatus({ success: false, message: result.message || 'Verification failed. Please try again.' });
            }
        } catch (error) {
            setStatus({ success: false, message: 'Internal server error. Please try again later.' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!verificationCode) {
            setStatus({ success: false, message: 'Please enter the verification code.' });
            return;
        }
        verifyCode(verificationCode);
    };

    const toggleTheme = () => {
        const newTheme = !isDarkMode ? 'dark' : 'light';
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark', !isDarkMode);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <section className={`py-16 flex items-center justify-center min-h-screen dark:bg-dark-background bg-light-background`}>
            <div className="container mx-auto flex flex-col items-center">
                <div className="relative md:w-1/2 flex flex-col items-center bg-white dark:bg-dark-background rounded-lg shadow-lg p-8 font-stix">
                    {/* Theme Toggle Button */}
                    <button 
                        onClick={toggleTheme} 
                        className="absolute top-4 right-4 text-xl p-2 rounded-md bg-light-background dark:bg-dark-background focus:outline-none hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
                    >
                        {isDarkMode ? <FaSun className="text-dark-text" /> : <FaMoon className="text-light-text" />}
                    </button>
                    <h2 className={`text-4xl font-bold font-satisfy mb-8
                        ${isDarkMode ? 
                            'bg-gradient-to-r from-dark-primary to-dark-accent text-transparent bg-clip-text' 
                            : 
                            'bg-gradient-to-r from-light-primary to-light-accent text-transparent bg-clip-text'}
                        leading-snug
                    `}
                    >
                        Verify Your Email
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-lg">
                        <input
                            type="text"
                            value={verificationCode}
                            placeholder="Enter the verification code"
                            onChange={(e) => setVerificationCode(e.target.value)}
                            className={`w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-6 py-4 text-light-text dark:text-dark-text placeholder-gray-400 focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-0`}
                        />
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full px-6 py-3 rounded-md font-medium transition-colors duration-100 
                                ${isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-light-primary dark:bg-dark-primary text-dark-text hover:bg-gradient-to-r hover:from-dark-primary hover:to-dark-accent'}`}
                        >
                            {isLoading ? 'Verifying...' : 'Verify Code'}
                        </button>
                        {status && (
                            <div className="flex justify-center w-full mt-4">
                                <p className={`text-center ${status.success ? 'text-green-400' : 'text-red-400'}`}>{status.message}</p>
                            </div>
                        )}
                    </form>
                    <div className="w-full max-w-lg flex flex-col items-center text-center mt-4 space-y-4">
                        <p className={`text-lg ${isDarkMode ? 'text-dark-text' : 'text-light-text'}`}>
                            <Link href="/auth/login">
                                <span className="text-light-primary dark:text-dark-primary hover:underline">Go to Login</span>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default EmailVerification;
