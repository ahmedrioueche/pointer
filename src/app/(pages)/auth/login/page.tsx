"use client"
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { FaSun, FaMoon, FaGoogle, FaSpinner } from 'react-icons/fa';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingButton from '@/app/components/LoadingButton';
import { useTheme } from '@/app/context/ThemeContext';

interface LoginDetails {
    identifier: string;
    password: string;
}

const Login: React.FC = () => {
    const initialDetails: LoginDetails = {
        identifier: '',
        password: '',
    };

    const [loginDetails, setLoginDetails] = useState<LoginDetails>(initialDetails);
    const [buttonText, setButtonText] = useState('Log In');
    const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
    const {isDarkMode, toggleDarkMode } = useTheme();
    const [isPrimaryLoading, setIsPrimaryLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const router = useRouter(); 

    const onInputChange = (category: keyof LoginDetails, value: string) => {
        setLoginDetails({
            ...loginDetails,
            [category]: value,
        });
    };

    const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPrimaryLoading(true);

        if (!loginDetails.identifier || !loginDetails.password) {
            setIsPrimaryLoading(false);
            setStatus({ success: false, message: 'Please fill in all required fields.' });
            return;
        }

        try {         
            const signInResult = await signIn('credentials', {
                redirect: false,
                identifier: loginDetails.identifier,
                password: loginDetails.password,
            });
            console.log("signInResult", signInResult)

            if (signInResult?.error) {
                console.log("error", signInResult?.error);
                setStatus({ success: false, message: 'Login failed.' });
                setIsPrimaryLoading(false);
            } else {
                router.push('/auth/loading');
            }
    
        } catch (error) {
            setButtonText("Log In");
            setStatus({ success: false, message: 'Login failed. Please try again.' });
            setLoginDetails(initialDetails);
        }
    };

    const handleGoogleSignup = async () => {
        setIsGoogleLoading(true);
        try {
            await signIn('google', { callbackUrl: '/auth/loading' });
        } catch (error) {
            setIsGoogleLoading(false);
            setStatus({ success: false, message: 'Login failed. Please try again.' });
        }
        setIsGoogleLoading(false);
    };

    return (
        <section className={`py-16 flex items-center justify-center min-h-screen dark:bg-dark-background bg-light-background`}>
            <div className="container mx-auto flex flex-col items-center">
                <div className="relative md:w-1/2 flex flex-col items-center bg-white dark:bg-dark-background rounded-lg shadow-lg p-8 font-stix">
                    <button 
                        onClick={toggleDarkMode} 
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
                            type="text"
                            value={loginDetails.identifier}
                            placeholder="Email or Username"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => onInputChange('identifier', e.target.value)}
                            className={`w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-6 py-4 text-light-text dark:text-dark-text placeholder-gray-400 focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-0`}
                        />
                        <input
                            type="password"
                            value={loginDetails.password}
                            placeholder="Password"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => onInputChange('password', e.target.value)}
                            className={`w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-6 py-4 text-light-text dark:text-dark-text placeholder-gray-400 focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-0`}
                        />
                        <LoadingButton
                            isLoading={isPrimaryLoading}
                            type="submit"
                            buttonText="Log In"
                            className="" 
                        />
                        {status && (
                            <div className="flex justify-center w-full mt-4">
                                <p className={`text-center ${status.success ? 'text-light-primary' : 'text-light-accent dark:text-dark-accent'}`}>{status.message}</p>
                            </div>
                        )}
                    </form>
                    <div className="w-full max-w-lg flex flex-col items-center text-center mt-4 space-y-4">
                       <LoadingButton
                            isLoading={isGoogleLoading}
                            type="button"
                            onClick={handleGoogleSignup}
                            buttonText="Continue With Google"
                            icon={FaGoogle}
                            className="" 
                        />
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
