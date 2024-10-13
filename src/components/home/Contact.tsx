"use client";

import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react';
import { sendContactForm } from '../../lib/apiHelper'; // Adjust the import path as necessary
import Image from 'next/image'; // Assuming you're using Next.js for image optimization
import { useTheme } from '@/app/context/ThemeContext';
import { motion, useInView } from 'framer-motion';

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
    const { isDarkMode, toggleDarkMode } = useTheme();
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    // Refs and inView hooks for animations
    const imageRef = useRef<HTMLDivElement>(null);
    const imageInView = useInView(imageRef, { once: false });

    const formRef = useRef<HTMLDivElement>(null);
    const formInView = useInView(formRef, { once: false });

    useEffect(() => {
        const adjustTextareaHeight = () => {
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
                textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            }
        };

        adjustTextareaHeight();
        window.addEventListener('resize', adjustTextareaHeight);
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
            if (result.status === "success") {
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

    // Animation variants
    const imageVariants = {
        hidden: { opacity: 0, x: -100 }, // Image starts from the left
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    const formVariants = {
        hidden: { opacity: 0, x: 100 }, // Form starts from the right
        visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
    };

    return (
        <section id="contact" className={`py-16 dark:bg-dark-background bg-light-background flex items-center justify-center min-h-screen`}>
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6">
                {/* Left Section with Image */}
                <motion.div
                    ref={imageRef}
                    initial="hidden"
                    animate={imageInView ? "visible" : "hidden"}
                    variants={imageVariants}
                    className="hidden md:block md:w-1/2 mr-5"
                >
                    <Image
                        src="/images/contact.svg" // Path to your SVG image
                        alt="Contact Us"
                        width={500} // Adjust width as needed
                        height={500} // Adjust height as needed
                        className="mx-auto"
                    />
                </motion.div>

                {/* Right Section with Contact Form */}
                <motion.div
                    ref={formRef}
                    initial="hidden"
                    animate={formInView ? "visible" : "hidden"}
                    variants={formVariants}
                    className="md:w-1/2 flex flex-col items-center"
                >
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
                                className="w-full font-stix bg-gray-100 dark:bg-gray-700 border border-gray-700 rounded-lg px-6 py-4 text-light-text dark:text-dark-text focus:outline-none focus:border-light-primary"
                            />
                            <input
                                type="text"
                                value={formDetails.lastName}
                                placeholder="Last Name"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => onFormUpdate('lastName', e.target.value)}
                                className="w-full font-stix bg-gray-100 dark:bg-gray-700 border border-gray-700 rounded-lg px-6 py-4 text-light-text dark:text-dark-text focus:outline-none focus:border-light-primary"
                            />
                            <input
                                type="email"
                                value={formDetails.email}
                                placeholder="Email"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => onFormUpdate('email', e.target.value)}
                                className="w-full font-stix bg-gray-100 dark:bg-gray-700 border border-gray-700 rounded-lg px-6 py-4 text-light-text dark:text-dark-text focus:outline-none focus:border-light-primary"
                            />
                            <input
                                type="tel"
                                value={formDetails.phone}
                                placeholder="Phone Number"
                                onChange={(e: ChangeEvent<HTMLInputElement>) => onFormUpdate('phone', e.target.value)}
                                className="w-full font-stix bg-gray-100 dark:bg-gray-700 border border-gray-700 rounded-lg px-6 py-4 text-light-text dark:text-dark-text focus:outline-none focus:border-light-primary"
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
                            className="w-full font-stix bg-gray-100 dark:bg-gray-700 border border-gray-700 rounded-lg px-6 py-3 text-light-text dark:text-dark-text focus:outline-none focus:border-light-primary resize-none overflow-y-hidden"
                            rows={5}
                            ref={textareaRef}
                        />

                        <button
                            type="submit"
                            className={`w-full font-stix px-6 py-3 rounded-md font-medium transition-colors duration-300 ${isDarkMode ? 'bg-dark-primary text-dark-background hover:bg-dark-accent' : 'bg-light-primary text-light-background hover:bg-light-accent'}`}>
                            <span className='text-dark-text'>{buttonText}</span>
                        </button>
                        {status && (
                            <div className="flex justify-center w-full mt-4">
                                <p className={`text-center font-stix ${status.success ? 'text-green-400' : 'text-red-400'}`}>{status.message}</p>
                            </div>
                        )}
                    </form>
                </motion.div>
            </div>
        </section>
    );
};

export default ContactForm;
