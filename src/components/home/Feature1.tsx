"use client";

import { useTheme } from '@/app/context/ThemeContext';
import React, { useState, useEffect, useRef } from 'react';
import { FaCoins, FaTasks, FaGift } from 'react-icons/fa';
import clsx from 'clsx';

interface FeatureProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const Feature: React.FC<FeatureProps> = ({ icon, title, description, delay }) => {
  const [isVisible, setIsVisible] = useState(false);
  const featureRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRef = featureRef.current; 
  
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          } else {
            setIsVisible(false); 
          }
        });
      },
      { threshold: 0.1 } 
    );
  
    if (currentRef) {
      observer.observe(currentRef);
    }
  
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef); 
      }
    };
  }, []);
  

  return (
    <div
      ref={featureRef}
      className={clsx(
        "flex flex-col items-center p-6 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg",
        isVisible ? "flip-in" : "opacity-0"
      )}
      style={{
        transitionDelay: `${delay}s`, // Stagger the delay for the animation
      }}
    >
      <div className="text-4xl text-white mb-4">{icon}</div>
      <h3 className="text-lg font-stix font-semibold mb-2 text-white">{title}</h3>
      <p className="text-white text-center font-stix">{description}</p>
    </div>
  );
};

const FeaturesSection: React.FC = () => {
  const { isDarkMode } = useTheme();

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
    <section id="features" className="py-16 bg-light-background dark:bg-dark-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12 font-satisfy text-light-primary dark:text-dark-text">
          Key Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Feature key={index} {...feature} delay={index * 0.2} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
