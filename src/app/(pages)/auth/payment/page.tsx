"use client";
import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaSun, FaMoon } from 'react-icons/fa';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import LoadingButton from '@/app/components/LoadingButton';

// Make sure to replace this with your actual Stripe publishable key
const stripePromise = loadStripe('your-publishable-key-here');

const Payment: React.FC = () => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
    const router = useRouter();
    const stripe = useStripe();
    const elements = useElements();

    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            const isDark = savedTheme === 'dark';
            setIsDarkMode(isDark);
            document.documentElement.classList.toggle('dark', isDark);
        }
    }, []);

    const toggleTheme = () => {
        const newTheme = !isDarkMode ? 'dark' : 'light';
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark', !isDarkMode);
        localStorage.setItem('theme', newTheme);
    };

    const handlePayment = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!stripe || !elements) return; // Stripe.js has not loaded yet

        setIsLoading(true);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)!,
        });

        if (error) {
            setStatus({ success: false, message: error.message || 'Payment failed. Please try again.' });
            setIsLoading(false);
        } else {
            // Send paymentMethod.id to your server to process the payment
            try {
                const response = await fetch('/api/payment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ paymentMethodId: paymentMethod.id }),
                });

                const result = await response.json();

                if (response.ok) {
                    setStatus({ success: true, message: 'Payment successful!' });
                    router.push('/confirmation'); // Redirect to confirmation page
                } else {
                    setStatus({ success: false, message: result.message || 'Payment failed. Please try again.' });
                }
            } catch (error) {
                setStatus({ success: false, message: 'Payment failed. Please try again.' });
            }

            setIsLoading(false);
        }
    };

    return (
        <section className={`min-h-screen flex flex-col justify-center items-center py-16 bg-light-background dark:bg-dark-background`}>
            <div className="container mx-auto px-4 flex flex-col items-center">
                <div className="max-w-lg w-full bg-white dark:bg-dark-background rounded-lg shadow-lg p-8">
                    <form onSubmit={handlePayment} className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className={`text-4xl font-bold font-satisfy text-center text-light-primary dark:text-dark-text-primary mx-auto`}>
                                Payment
                            </h2>
                            <button 
                                onClick={toggleTheme} 
                                className="text-xl p-2 rounded-md bg-light-background dark:bg-dark-background focus:outline-none hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
                            >
                                {isDarkMode ? <FaSun className="text-dark-text" /> : <FaMoon className="text-light-text" />}
                            </button>
                        </div>

                        <div className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
                            <CardElement 
                                options={{
                                    style: {
                                        base: {
                                            fontSize: '16px',
                                            color: isDarkMode ? '#fff' : '#000',
                                            '::placeholder': {
                                                color: isDarkMode ? '#aaa' : '#888',
                                            },
                                        },
                                        invalid: {
                                            color: '#fa755a',
                                        },
                                    },
                                }}
                            />
                        </div>
                        <LoadingButton
                            isLoading={isLoading}
                            type="submit"
                            buttonText="Pay"
                            className="" 
                        />                     

                        {status && (
                            <div className="mt-4">
                                <p className={`text-center ${status.success ? 'text-green-400' : 'text-red-400'}`}>{status.message}</p>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </section>
    );
};

// Wrap your component with Elements to provide the Stripe context
const PaymentPage: React.FC = () => (
    <Elements stripe={stripePromise}>
        <Payment />
    </Elements>
);

export default PaymentPage;
