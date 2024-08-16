"use client";

import React, { useState, useEffect } from 'react';
import { FaTasks, FaCoins, FaGift } from 'react-icons/fa';

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const StepCard: React.FC<StepProps> = ({ icon, title, description }) => (
  <div className="flex flex-col items-start p-6 bg-dark-background dark:bg-light-background rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
    <div className="text-3xl text-light-primary dark:text-dark-primary mb-4">{icon}</div>
    <h3 className="text-lg font-semibold mb-2 text-dark-text dark:text-light-text">{title}</h3>
    <p className="text-light-secondary dark:text-dark-secondary">{description}</p>
  </div>
);

const Steps: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDarkMode(savedTheme === "dark");
  }, []);

  const steps = [
    {
      icon: <FaTasks />,
      title: "Set Tasks",
      description: "Create and assign tasks to your children, tracking their progress and completion.",
    },
    {
      icon: <FaCoins />,
      title: "Earn Points",
      description: "Reward completed tasks with points, encouraging positive behavior and responsibility.",
    },
    {
      icon: <FaGift />,
      title: "Redeem Rewards",
      description: "Allow children to redeem points for various rewards, from money to exciting experiences.",
    },
  ];

  return (
    <section className="py-16 bg-light-background dark:bg-dark-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="w-full md:w-1/2 max-w-md mb-8 md:mb-0">
            <h2 className="text-3xl font-bold font-satisfy mb-4 text-light-primary dark:text-dark-text">
              How It Works
            </h2>
            <p className="text-lg mb-8 text-light-secondary font-stix dark:text-dark-secondary">
              Follow these simple steps to get started with our app and make the most of its features.
            </p>
            <button className="px-6 py-3 rounded-md bg-light-primary dark:bg-dark-primary text-light-background dark:text-dark-background font-medium hover:bg-light-secondary dark:hover:bg-dark-secondary transition-colors duration-300">
              Get Started
            </button>
          </div>
          <div className="w-full md:w-1/2 flex justify-end mt-8 md:mt-0">
            <div className="flex flex-col">
              {steps.map((step, index) => (
                <div
                  key={index}
                  className={index !== steps.length - 1 ? "mb-8" : ""}
                >
                  <StepCard {...step} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Steps;
