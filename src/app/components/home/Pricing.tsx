"use client";

import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';

interface PricingCardProps {
  title: string;
  price: string;
  description: string;
  features: string[];
}

const PricingCard: React.FC<PricingCardProps> = ({ title, price, description, features }) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  return (
    <div id="pricing" className={`flex flex-col p-6 bg-dark-background dark:bg-light-background rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg h-[430px]`}>
      <div className="flex flex-col flex-grow justify-between">
        <div className="flex flex-col items-center">
          <h3 className={`text-xl font-semibold mb-4 font-stix text-dark-text dark:text-light-text`}>
            {title}
          </h3>
          <p className={`text-4xl font-bold mb-4 font-stix text-dark-text dark:text-light-text`}>
            {price}
          </p>
        </div>
        <p className={`text-lg mb-6 text-dark-secondary font-stix dark:text-light-secondary text-center`}>
          {description}
        </p>
        <ul className="list-disc list-inside text-left mb-6">
          {features.map((feature, index) => (
            <li key={index} className={`flex items-center font-stix text-dark-text dark:text-light-text mb-2`}>
              <FaCheckCircle className={`mr-2 ${isDarkMode ? 'text-dark-primary' : 'text-light-primary'}`} />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center mt-auto">
        <Link href={"/auth/signup"}>
        <button className={`px-6 py-3 rounded-md font-stix ${isDarkMode ? 'bg-dark-primary text-dark-background hover:bg-dark-accent' : 'bg-light-primary text-light-background hover:bg-light-accent'} font-medium transition-colors duration-300`}>
          Choose Plan
        </button>
        </Link>
      </div>
    </div>
  );
};

const Pricing: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');
  }, []);

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
            <PricingCard key={index} {...option} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
