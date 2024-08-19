"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import { PricingCard } from '../PricingCard';
import { useRouter } from 'next/navigation';



const Pricing: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  const handleClick = () => {
    router.push("/auth/signup"); 
  }

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
            <PricingCard key={index} {...option} onClick={handleClick}/>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
