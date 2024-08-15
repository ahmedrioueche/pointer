"use client";

import React, { useState, useEffect } from 'react';
import { FaCoins, FaTasks, FaGift } from 'react-icons/fa';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description }) => (
  <div className="flex flex-col items-center p-6 bg-dark-background dark:bg-light-background rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
    <div className="text-4xl text-light-primary dark:text-dark-primary mb-4">{icon}</div>
    <h3 className="text-lg font-semibold mb-2 text-dark-text dark:text-light-text">{title}</h3>
    <p className="text-light-secondary dark:text-dark-secondary text-center">{description}</p>
  </div>
);

const FeaturesSection: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDarkMode(savedTheme === "dark");
  }, []);

  const features = [
    {
      icon: <FaTasks />,
      title: "Task Management",
      description: "Create and assign tasks to your children, tracking their progress and completion.",
    },
    {
      icon: <FaCoins />,
      title: "Point System",
      description: "Reward completed tasks with points, encouraging positive behavior and responsibility.",
    },
    {
      icon: <FaGift />,
      title: "Exciting Rewards",
      description: "Allow children to redeem points for various rewards, from money to exciting experiences.",
    },
  ];

  return (
    <section className={`py-16 bg-light-background dark:bg-dark-background`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl font-bold text-center mb-12 font-satisfy text-light-primary dark:text-dark-text`}>
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
