"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
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
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        setIsDarkMode(savedTheme === 'dark');

        const adjustTextareaHeight = () => {
            if (textareaRef.current) {
                // Reset the height to auto to calculate the new height
                textareaRef.current.style.height = 'auto';
                // Set the height based on scroll height
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            }
        };

        adjustTextareaHeight(); // Initial adjustment
        window.addEventListener('resize', adjustTextareaHeight); // Adjust on window resize
        return () => window.removeEventListener('resize', adjustTextareaHeight);
    }, [formDetails.message]);

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
                                className="w-full bg-light-background dark:bg-dark-background border border-gray-700 rounded-lg px-6 py-4 text-light-text dark:text-dark-text focus:text-dark-text dark:focus:text-light-text placeholder-gray-400 focus:outline-none focus:border-light-primary focus:ring-0 focus:bg-dark-background dark:focus:bg-light-background"
                            />
                            <input
                                type="text"
                                value={formDetails.lastName}
                                placeholder="Last Name"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => onFormUpdate('lastName', e.target.value)}
                                className="w-full bg-light-background dark:bg-dark-background border border-gray-700 rounded-lg px-6 py-4 text-light-text dark:text-dark-text focus:text-dark-text dark:focus:text-light-text placeholder-gray-400 focus:outline-none focus:border-light-primary focus:ring-0 focus:bg-dark-background dark:focus:bg-light-background"
                            />
                            <input
                                type="email"
                                value={formDetails.email}
                                placeholder="Email"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => onFormUpdate('email', e.target.value)}
                                className="w-full bg-light-background dark:bg-dark-background border border-gray-700 rounded-lg px-6 py-4 text-light-text dark:text-dark-text focus:text-dark-text dark:focus:text-light-text placeholder-gray-400 focus:outline-none focus:border-light-primary focus:ring-0 focus:bg-dark-background dark:focus:bg-light-background"
                            />
                            <input
                                type="tel"
                                value={formDetails.phone}
                                placeholder="Phone Number"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => onFormUpdate('phone', e.target.value)}
                                className="w-full bg-light-background dark:bg-dark-background border border-gray-700 rounded-lg px-6 py-4 text-light-text dark:text-dark-text focus:text-dark-text dark:focus:text-light-text placeholder-gray-400 focus:outline-none focus:border-light-primary focus:ring-0 focus:bg-dark-background dark:focus:bg-light-background"
                            />
                        </div>
                        <textarea
                            placeholder="Message"
                            value={formDetails.message}
                            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => {
                                onFormUpdate('message', e.target.value);
                                if (textareaRef.current) {
                                    textareaRef.current.style.height = 'auto';
                                    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
                                }
                            }}
                            className="w-full bg-light-background dark:bg-dark-background border border-gray-700 rounded-lg px-6 py-3 text-light-text dark:text-dark-text focus:text-dark-text dark:focus:text-light-text placeholder-gray-400 focus:outline-none focus:border-light-primary focus:ring-0 focus:bg-dark-background dark:focus:bg-light-background resize-none overflow-y-hidden"
                            rows={5}
                            ref={textareaRef}
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

export default ContactForm;
