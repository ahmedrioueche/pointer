"use client";

import React, { useState, useRef } from 'react';
import { PricingCard } from '../PricingCard';
import { useRouter } from 'next/navigation';
import { pricingOptions } from '@/data/text'; 
import { useTheme } from '@/app/context/ThemeContext';
import { motion, useAnimation } from 'framer-motion'; // Import for motion and animation control
import { useInView } from 'react-intersection-observer'; // Import useInView for scroll animation

const Pricing: React.FC = () => {
  const { isDarkMode } = useTheme();
  const [loadingCardIndex, setLoadingCardIndex] = useState<number | null>(null); 
  const router = useRouter(); 

  const handleClick = () => {
    router.push("/auth/signup"); 
  }

  return (
    <section className={`py-16 bg-light-background dark:bg-dark-background`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl font-bold text-center mb-4 font-satisfy dark:text-dark-text text-light-primary`}>
          Choose Your Plan
        </h2>
        <p className={`text-lg text-center mb-8 text-light-text dark:text-dark-text font-stix`}>
          Select the plan that best fits your needs!
        </p>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          {pricingOptions.map((option, index) => (
            <PricingCard 
              key={index} 
              {...option} 
              onClick={handleClick} 
              isLoading={loadingCardIndex === index} 
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;