"use client"

import React, { useState, useEffect } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Loading from '@/app/components/Loading';
import LoadingButton from '@/app/components/LoadingButton';


const EmailVerification: React.FC = () => {
    const [userEmail, setUserEmail] = useState<string | null>('');
    const [userVerificationCode, setUserVerificationCode] = useState<string>('');
    const [sentVerificationCode, setSentVerificationCode] = useState<string>('');
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [resultStatus, setStatus] = useState<{ success: boolean; message: string } | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    let codeSent : boolean = false;
    const router = useRouter();
    const { data: session, status } = useSession(); 

    useEffect(() => {
        if (status === 'unauthenticated') {
          router.push('/auth/login'); 
        }
      }, [status, router]);
      
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            const isDark = savedTheme === 'dark';
            setIsDarkMode(isDark);
            document.documentElement.classList.toggle('dark', isDark);
        }
    }, []);

    useEffect(()=> {
        const email = sessionStorage.getItem("userEmail");
        if (!codeSent && email) {
            sendVerificationCode(email);
            setUserEmail(email);
            codeSent = true;
        }
    }, [])

    const sendVerificationCode = async (email : string | null) => {
        try {
            const response = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: { "Content-Type": "application/json", Accept: "application/json" },
                body: JSON.stringify({ email }),
            });

            const result = await response.json();
            if (response.ok) {

                if(result.verificationCode){
                    setSentVerificationCode(result.verificationCode);
                }
            }

        } catch (error) {
            setStatus({ success: false, message: 'Internal server error. Please try again later.' });
        } finally {
            setIsLoading(false);
        }
    };

    const verifyCode = (userVerificationCode : string) => {
        setIsLoading(true);

        if(sentVerificationCode === userVerificationCode) {
            router.push("/auth/confirm");

        }
        else {
            setStatus({ success: false, message: 'Email verification failed' });

        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!userVerificationCode) {
            setStatus({ success: false, message: 'Please enter the verification code.' });
            return;
        }
        verifyCode(userVerificationCode);
    };

    const resendCode = () => {
        sendVerificationCode(userEmail);
    }

    const toggleTheme = () => {
        const newTheme = !isDarkMode ? 'dark' : 'light';
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark', !isDarkMode);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <>
            {session? (
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
                                value={userVerificationCode}
                                placeholder="Enter the verification code"
                                onChange={(e) => {
                                    const newCode = e.target.value;
                                    setUserVerificationCode(newCode);
                                    if (newCode.length === 6) {
                                        verifyCode(newCode);
                                    }
                                }}
                                className={`w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-6 py-4 text-light-text dark:text-dark-text placeholder-gray-400 focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-0`}
                            />

                                <LoadingButton
                                    isLoading={isLoading}
                                    type="submit"
                                    buttonText="Vefify Code"
                                    className="" 
                                />
                                {resultStatus && (
                                    <div className="flex justify-center w-full mt-4">
                                        <p className={`text-center ${resultStatus.success ? 'text-light-primary dark:text-dark-primary' : 'text-light-accent dark:text-dark-accent'}`}>{resultStatus.message}</p>
                                    </div>
                                )}
                            </form>
                            <div className="w-full max-w-lg flex flex-col items-center text-center mt-4 space-y-4">
                                <p className={`text-lg ${isDarkMode ? 'text-dark-text' : 'text-light-text'}`}>
                                    <span onClick={resendCode} className="font-stix text-base text-light-primary dark:text-dark-primary hover:underline cursor-pointer">Did not receive the code? check spam, or click here to resend</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            ) : (
                <Loading/>
            )}
        </>
    );
};

export default EmailVerification;
