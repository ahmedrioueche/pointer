"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { FaSun, FaMoon, FaGoogle } from 'react-icons/fa';
import Link from 'next/link';
import { signIn } from 'next-auth/react';

interface LoginDetails {
    email: string;
    password: string;
}

const Login: React.FC = () => {
    const initialDetails: LoginDetails = {
        email: '',
        password: '',
    };

    const [loginDetails, setLoginDetails] = useState<LoginDetails>(initialDetails);
    const [buttonText, setButtonText] = useState('Log In');
    const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            const isDark = savedTheme === 'dark';
            setIsDarkMode(isDark);
            document.documentElement.classList.toggle('dark', isDark);
        }
    }, []);

    const onInputChange = (category: keyof LoginDetails, value: string) => {
        setLoginDetails({
            ...loginDetails,
            [category]: value,
        });
    };

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setButtonText("Logging In...");
        try {
            // Simulate an API call
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Fake delay
            setButtonText("Log In");
            setStatus({ success: true, message: 'Logged in successfully!' });
        } catch (error) {
            setButtonText("Log In");
            setStatus({ success: false, message: 'Login failed. Please try again.' });
        }
        setLoginDetails(initialDetails);
    };

    const handleGoogleSignup = async () => {
        setIsLoading(true);
        try {
            await signIn('google');
        } catch (error) {
            setIsLoading(false); // Reset loading state on error
        }
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
                        Log In to Pointer
                    </h2>
                    <form onSubmit={handleLogin} className="space-y-4 w-full max-w-lg">
                        <input
                            type="email"
                            value={loginDetails.email}
                            placeholder="Email"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => onInputChange('email', e.target.value)}
                            className={`w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-6 py-4 text-light-text dark:text-dark-text placeholder-gray-400 focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-0`}
                        />
                        <input
                            type="password"
                            value={loginDetails.password}
                            placeholder="Password"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => onInputChange('password', e.target.value)}
                            className={`w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-6 py-4 text-light-text dark:text-dark-text placeholder-gray-400 focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-0`}
                        />
                        <button
                            type="submit"
                            className={`w-full px-6 py-3 rounded-md font-medium transition-colors duration-100 bg-light-primary
                            dark:bg-dark-primary text-dark-text hover:bg-gradient-to-r hover:from-dark-primary hover:to-dark-accent`}>     
                            {buttonText}
                        </button>

                        {status && (
                            <div className="flex justify-center w-full mt-4">
                                <p className={`text-center ${status.success ? 'text-green-400' : 'text-red-400'}`}>{status.message}</p>
                            </div>
                        )}
                    </form>
                    <div className="w-full flex flex-col items-center text-center mt-4 space-y-4">
                        <button 
                            onClick={handleGoogleSignup} 
                            disabled={isLoading} // Disable button when loading
                            className="w-full px-6 py-3 rounded-md bg-light-primary dark:bg-dark-primary text-white font-medium flex items-center justify-center gap-2 transition-colors duration-100 hover:bg-gradient-to-r hover:from-dark-primary hover:to-dark-accent">
                            {isLoading ? (
                                <span>Loading...</span> // Show loading text
                            ) : (
                                <>
                                    <FaGoogle />
                                    <span>Sign up with Google</span>
                                </>
                            )}
                        </button>
                        <p className={`text-lg ${isDarkMode ? 'text-dark-text' : 'text-light-text'}`}>
                            Not signed up yet?{' '}
                            <Link href="/auth/signup">
                                <span className="text-light-primary dark:text-dark-primary hover:underline">Sign up</span>
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Login;
