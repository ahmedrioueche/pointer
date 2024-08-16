"use client"
import React from 'react';
import { useState, useEffect } from 'react';
import { FaRocket } from 'react-icons/fa';

// Define the CTA component
const CTA: React.FC = () => {
  // Optional: Add state for dark mode if needed
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  // Handle CTA button click
  const handleClick = () => {
    console.log('CTA Clicked');
  };

  return (
    <section className={`py-16 text-center bg-light-background dark:bg-dark-background`}>
      <h2 className={`text-3xl font-bold font-satisfy mb-4 dark:text-dark-text text-light-primary`}>
        Ready to Get Started?
      </h2>
      <p className={`text-lg mb-8 text-light-secondary dark:text-dark-secondary `}>
        Join us today and take the first step towards achieving your goals with our amazing tool.
      </p>
      <button
        onClick={handleClick}
        className={`px-6 py-3 rounded-md ${isDarkMode ? 'bg-dark-primary text-dark-background hover:bg-dark-accent' : 'bg-light-primary text-light-background hover:bg-light-accent'} font-medium transition-colors duration-300`}
      >
        Get Started Now <FaRocket className="inline ml-2" />
      </button>
    </section>
  );
};

export default CTA;
