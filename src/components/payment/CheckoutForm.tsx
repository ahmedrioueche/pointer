"use client";
import React, { useState, FormEvent, useEffect } from 'react';
import { useRouter, useSearchParams  } from 'next/navigation';
import { FaSun, FaMoon } from 'react-icons/fa';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import LoadingButton from '@/components/LoadingButton';
import { payments } from '@/data/values';
import { assertInt } from '@/utils/helper';
import { useTheme } from '@/app/context/ThemeContext';

const CheckoutForm: React.FC = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const plan : "monthly" | "yearly" = searchParams.get('plan') as "monthly" | "yearly";
    const amount = searchParams.get('amount');
    const {isDarkMode, toggleDarkMode } = useTheme();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [status, setStatus] = useState<{ success: boolean; message: string } | null>(null);
    const stripe = useStripe();
    const elements = useElements();


    const handlePayment = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!stripe || !elements) return; 

        setIsLoading(true);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: elements.getElement(CardElement)!,
        });

        if (error) {
            setStatus({ success: false, message: error.message || 'Payment failed. Please try again.' });
            setIsLoading(false);
        } else {
            try {
                const amountInDollars = amount; 
                if((plan === "monthly" && assertInt(amountInDollars) === payments.monthlyPlanPaymentInDollars) || 
                   (plan === "yearly" && assertInt(amountInDollars) === payments.yearlyPlanPaymentInDollars)){

                    const response = await fetch('/api/payment/stripe', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            paymentMethodId: paymentMethod.id,
                            amountInDollars 
                        }),
                    });
                
                    const result = await response.json();

                    if (response.ok) {
                        const clientSecret = result.clientSecret;

                        const confirmPayment = await stripe.confirmCardPayment(clientSecret);

                        if (confirmPayment.error) {
                            setStatus({ success: false, message: confirmPayment.error.message || 'Payment failed during confirmation.' });
                        } else {
                            setStatus({ success: true, message: 'Payment successful!' });

                            sessionStorage.setItem("subscriptionType", plan);
                            amountInDollars? sessionStorage.setItem("subscriptioPrice", amountInDollars) : null;
                            sessionStorage.setItem("paymentMethod", "stripe");
                            console.log("amountInDollars", amountInDollars)

                            router.push('/main/success'); 
                        }
                    } else {
                        setStatus({ success: false, message: result.message || 'Payment failed. Please try again.' });
                    }
                }
                else {
                    //error
                    setStatus({success:false, message: "Something went wrong!" })
                    setIsLoading(false);
                    return;
                }
            } catch (error) {
                setStatus({ success: false, message: 'Payment failed. Please try again.' });
            }

            setIsLoading(false);
        }
    };

    return (
        <section className={`min-h-screen flex flex-col justify-center items-center bg-light-background dark:bg-dark-background`}>
            <div className="container mx-auto px-4 flex flex-col items-center">
                <div className="max-w-lg w-full bg-white dark:bg-dark-background rounded-lg shadow-lg p-5">
                    <form onSubmit={handlePayment} className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className={`text-4xl mb-2 font-bold font-satisfy text-center primary mx-auto  ${isDarkMode ? 
                            'bg-gradient-to-r from-dark-primary to-dark-accent text-transparent bg-clip-text' 
                            : 
                            'bg-gradient-to-r from-light-primary to-light-accent text-transparent bg-clip-text'}
                        leading-snug  `}>
                                Payment
                            </h2>
                            <button 
                                onClick={toggleDarkMode} 
                                className="text-xl p-2 mb-2 rounded-md bg-light-background dark:bg-dark-background focus:outline-none hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
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

export default CheckoutForm;
