"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { PricingCard } from '../../../components/PricingCard'; // Adjust the import path if necessary
import { apiInsertDB } from "@/lib/dbHelper"
import { useSession } from 'next-auth/react';
import Loading from '@/app/components/Loading';

const Plans: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const router = useRouter();
  const { data: session, status } = useSession(); 

  if (status === 'loading') return <Loading />; 
  if (!session) {
    router.push('/auth/login');
    return null;
  }
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  const handleClick = (price: string) => {

    updateParentPlan(price);

    if (price === "$0") {
      router.push('/main/dashboard');
    } else {
      router.push('/main/payment');
    }
  };

  const updateParentPlan = async (price: string) => {
    // Determine subscription_type based on price
    let subscription_type: string;
    switch (price) {
      case "$0":
        subscription_type = "free";
        break;
      case "$19":
        subscription_type = "standard";
        break;
      case "$199":
        subscription_type = "premium";
        break;
      default:
        subscription_type = "unknown"; // Handle unexpected cases
        break;
    }
  
    try {
      const result = await apiInsertDB(subscription_type, null, 'api/auth/confirm');
      // Handle result if necessary
      console.log('Subscription updated successfully:', result);
    } catch (error) {
      console.error('Error updating subscription:', error);
      // Handle error if necessary
    }
  };

  const pricingOptions = [
    {
      title: "Basic",
      price: "$0",
      description: "Get started with basic features to start rewarding your child for their efforts.",
      features: [
        "Track Tasks",
        "Redeem Points",
        "Basic Reports"
      ]
    },
    {
      title: "Standard",
      price: "$19",
      description: "Enhance your experience with additional features for a more effective reward system.",
      features: [
        "All Basic Features",
        "Custom Rewards",
        "Detailed Reports"
      ]
    },
    {
      title: "Premium",
      price: "$199",
      description: "Unlock the full potential of our app with advanced features and premium support.",
      features: [
        "All Standard Features",
        "Priority Support",
        "Advanced Analytics",
      ]
    }
  ];

  return (
    <section className={`py-16 bg-light-background dark:bg-dark-background`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl font-bold text-center mb-4 font-satisfy dark:text-dark-text text-light-primary`}>
          Choose Your Plan
        </h2>
        <p className={`text-lg text-center mb-8 text-light-text dark:text-dark-text`}>
          Select the plan that best fits your needs. All plans come with a 14-day free trial!
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {pricingOptions.map((option, index) => (
            <PricingCard 
              key={index} 
              {...option} 
              onClick={() => handleClick(option.price)} // Pass price to handleClick
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Plans;
