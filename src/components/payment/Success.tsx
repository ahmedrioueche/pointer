"use client";
import { useData } from '@/app/context/dataContext';
import { apiSendEmail, apiUpdateParent } from '@/lib/apiHelper';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

const SuccessPage: React.FC = () => {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);
    
    const data = useData();
    const user = data.user;

    useEffect(() => {
        // Ensure component is mounted
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted || status !== 'authenticated') return;

        // Update user's subscription data
        const subscriptionType = sessionStorage.getItem("subscriptionType");
        const subscriptionPrice = sessionStorage.getItem("subscriptioPrice");
        console.log("subscriptionPrice", subscriptionPrice)
        const paymentMethod = sessionStorage.getItem("paymentMethod");
        const subscriptionStartDate = new Date();
        const daysToAdd = subscriptionType === "monthly" ? 30 : 365;
        const subscriptionEndDate = new Date(subscriptionStartDate.getTime() + daysToAdd * 24 * 60 * 60 * 1000);

        const updateUserData = async () => {
            try {
                const response = await apiUpdateParent(user.id, {
                    subscriptionStartDate,
                    subscriptionType,
                    subscriptionEndDate,
                    paymentMethod,
                    isSubscriptionActive: true,
                    isFreeTrial: false,
                    lastPaymentDate: subscriptionStartDate,
                    subscriptionPrice,
                });
                console.log("Update response:", response);
            } catch (error) {
                console.error("Failed to update user data:", error);
            }
        };

        const sendConfirmationEmail = async () => {
            const userEmail = user.email;
            if (userEmail) {
                const subject = "Payment Confirmation";
                const content = `Your payment to Pointer of $${subscriptionPrice} was well received. Your subscription ends on ${subscriptionEndDate.toDateString()}. Thank you for choosing Pointer.`;

                try {
                    const response = await apiSendEmail(userEmail, subject, content);
                    console.log("Email response:", response);
                } catch (error) {
                    console.error("Failed to send email:", error);
                }
            }
        };

        updateUserData();
        sendConfirmationEmail();

        // Redirect after data updates and email sending
        router.push("/main/home");

    }, [isMounted, status, user, router]);

    return (
        <section className="min-h-screen flex flex-col justify-center items-center bg-light-background dark:bg-dark-background">
            <div className="container mx-auto px-4 flex flex-col items-center">
                <div className="max-w-lg w-full bg-white dark:bg-dark-background rounded-lg shadow-lg p-6 font-stix">
                    <div className="flex flex-col items-center">
                        <FaCheckCircle className="text-green-500 text-3xl mb-2 mr-3" />
                        <h2 className="text-3xl font-bold text-center text-green-500 mb-4">
                            Payment Successful!
                        </h2>
                        <p className="text-center text-lg text-gray-700 dark:text-gray-300 mb-6">
                            Thank you for your payment. Your transaction was successful. We have sent you a confirmation email.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SuccessPage;
