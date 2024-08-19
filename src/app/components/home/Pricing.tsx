"use client";

import React, { useState, useEffect } from 'react';
import { PricingCard } from '../PricingCard';
import { useRouter } from 'next/navigation';
import { pricingOptions } from '@/data/text'; 

const Pricing: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [loadingCardIndex, setLoadingCardIndex] = useState<number | null>(null); 
  const router = useRouter(); 

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  const handleClick = () => {
    router.push("/auth/signup"); 
  }

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
            <PricingCard key={index} {...option} onClick={handleClick} isLoading={loadingCardIndex === index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
