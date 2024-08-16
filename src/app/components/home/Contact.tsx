"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { sendContactForm } from '../../../lib/api'; // Adjust the import path as necessary

interface FormDetails {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    message: string;
}

const ContactForm: React.FC = () => {
    const formInitialDetails: FormDetails = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        message: '',
    };

    const [formDetails, setFormDetails] = useState<FormDetails>(formInitialDetails);
    const [buttonText, setButtonText] = useState('Send');
    const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        setIsDarkMode(savedTheme === 'dark');
    }, []);

    const onFormUpdate = (category: keyof FormDetails, value: string) => {
        setFormDetails({
            ...formDetails,
            [category]: value,
        });
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setButtonText("Sending..");
        try {
            const result = await sendContactForm(formDetails);
            setButtonText("Send");
            if (result.success) {
                setStatus({ success: true, message: 'Message sent successfully' });
            } else {
                setStatus({ success: false, message: 'Oops.. Something went wrong!' });
            }
        } catch (error) {
            setButtonText("Send");
            setStatus({ success: false, message: 'Oops.. Something went wrong!' });
        }
        setFormDetails(formInitialDetails);
    };

    return (
        <section id="contact" className={`py-16 dark:bg-dark-background bg-light-background flex items-center justify-center min-h-screen`}>
            <div className="container mx-auto flex flex-col items-center">
                <div className="md:w-1/2 flex flex-col items-center px-6 md:px-12">
                    <h2 className={`text-4xl font-bold font-satisfy mb-8 dark:text-dark-text text-light-primary`}>
                        Contact Us
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                value={formDetails.firstName}
                                placeholder="First Name"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => onFormUpdate('firstName', e.target.value)}
                                className="w-full bg-light-background dark:bg-dark-background border border-gray-700 rounded-lg px-6 py-4 text-light-text dark:text-dark-text placeholder-gray-400 focus:outline-none focus:border-light-primary focus:ring-0"
                            />
                            <input
                                type="text"
                                value={formDetails.lastName}
                                placeholder="Last Name"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => onFormUpdate('lastName', e.target.value)}
                                className="w-full bg-light-background dark:bg-dark-background border border-gray-700 rounded-lg px-6 py-4 text-light-text dark:text-dark-text placeholder-gray-400 focus:outline-none focus:border-light-primary focus:ring-0"
                            />
                            <input
                                type="email"
                                value={formDetails.email}
                                placeholder="Email"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => onFormUpdate('email', e.target.value)}
                                className="w-full bg-light-background dark:bg-dark-background border border-gray-700 rounded-lg px-6 py-4 text-light-text dark:text-dark-text placeholder-gray-400 focus:outline-none focus:border-light-primary focus:ring-0"
                            />
                            <input
                                type="tel"
                                value={formDetails.phone}
                                placeholder="Phone Number"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => onFormUpdate('phone', e.target.value)}
                                className="w-full bg-light-background dark:bg-dark-background border border-gray-700 rounded-lg px-6 py-4 text-light-text dark:text-dark-text placeholder-gray-400 focus:outline-none focus:border-light-primary focus:ring-0"
                            />
                        </div>
                        <textarea
                            placeholder="Message"
                            value={formDetails.message}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onFormUpdate('message', e.target.value)}
                            className="w-full bg-light-background dark:bg-dark-background border border-gray-700 rounded-lg px-6 py-6 text-light-text dark:text-dark-text placeholder-gray-400 focus:outline-none focus:border-light-primary focus:ring-0"
                            />
                        <button
                            type="submit"
                            className={`w-full px-6 py-3 rounded-md ${isDarkMode ? 'bg-dark-primary text-dark-background hover:bg-dark-accent' : 'bg-light-primary text-light-background hover:bg-light-accent'} font-medium transition-colors duration-300`}>                        
                            <span className='text-dark-text'>{buttonText}</span>
                        </button>
                        {status && (
                            <p className={`mt-4 ${status.success ? 'text-green-400' : 'text-red-400'}`}>{status.message}</p>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
