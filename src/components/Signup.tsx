"use client";

import React, { useState, ChangeEvent, FormEvent } from 'react';

interface SignupDetails {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

const Signup: React.FC = () => {
    const initialDetails: SignupDetails = {
        firstName: '',
        lastName: '',
        email: '',
        password: '',
    };

    const [signupDetails, setSignupDetails] = useState<SignupDetails>(initialDetails);
    const [buttonText, setButtonText] = useState('Sign Up');
    const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    const onInputChange = (category: keyof SignupDetails, value: string) => {
        setSignupDetails({
            ...signupDetails,
            [category]: value,
        });
    };

    const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setButtonText("Signing Up...");
        try {
            // Simulate an API call
            await new Promise((resolve) => setTimeout(resolve, 2000)); // Fake delay
            setButtonText("Sign Up");
            setStatus({ success: true, message: 'Signed up successfully!' });
        } catch (error) {
            setButtonText("Sign Up");
            setStatus({ success: false, message: 'Signup failed. Please try again.' });
        }
        setSignupDetails(initialDetails);
    };

    return (
        <section className={`py-16 dark:bg-dark-background bg-light-background flex items-center justify-center min-h-screen`}>
            <div className="container mx-auto flex flex-col items-center">
                <div className="md:w-1/2 flex flex-col items-center px-6 md:px-12">
                    <h2 className={`text-4xl font-bold font-satisfy mb-8 dark:text-dark-text text-light-primary`}>
                        Sign Up
                    </h2>
                    <form onSubmit={handleSignup} className="space-y-4 w-full max-w-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                value={signupDetails.firstName}
                                placeholder="First Name"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => onInputChange('firstName', e.target.value)}
                                className="w-full bg-light-background dark:bg-dark-background border border-gray-700 rounded-lg px-6 py-4 text-light-text dark:text-dark-text placeholder-gray-400 focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-0"
                            />
                            <input
                                type="text"
                                value={signupDetails.lastName}
                                placeholder="Last Name"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => onInputChange('lastName', e.target.value)}
                                className="w-full bg-light-background dark:bg-dark-background border border-gray-700 rounded-lg px-6 py-4 text-light-text dark:text-dark-text placeholder-gray-400 focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-0"
                            />
                        </div>
                        <input
                            type="email"
                            value={signupDetails.email}
                            placeholder="Email"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => onInputChange('email', e.target.value)}
                            className="w-full bg-light-background dark:bg-dark-background border border-gray-700 rounded-lg px-6 py-4 text-light-text dark:text-dark-text placeholder-gray-400 focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-0"
                        />
                        <input
                            type="password"
                            value={signupDetails.password}
                            placeholder="Password"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => onInputChange('password', e.target.value)}
                            className="w-full bg-light-background dark:bg-dark-background border border-gray-700 rounded-lg px-6 py-4 text-light-text dark:text-dark-text placeholder-gray-400 focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-0"
                        />
                        <button
                            type="submit"
                            className={`w-full px-6 py-3 rounded-md font-medium transition-colors duration-300 ${isDarkMode ? 'bg-dark-primary text-dark-background hover:bg-dark-accent' : 'bg-light-primary text-light-background hover:bg-light-accent'}`}>
                            <span className='text-dark-text'>{buttonText}</span>
                        </button>
                        {status && (
                            <div className="flex justify-center w-full mt-4">
                                <p className={`text-center ${status.success ? 'text-green-400' : 'text-red-400'}`}>{status.message}</p>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Signup;
