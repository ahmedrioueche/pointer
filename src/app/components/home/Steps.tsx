"use client";

import { useTheme } from '@/app/context/ThemeContext';
import Link from 'next/link';
import React, { useState, useEffect, useRef } from 'react';
import { FaTasks, FaCoins, FaGift, FaChartLine, FaRocket } from 'react-icons/fa';
import clsx from 'clsx';

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const StepCard: React.FC<StepProps> = ({ icon, title, description, delay }) => {
  const [isVisible, setIsVisible] = useState(false);
  const stepRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    if (stepRef.current) {
      observer.observe(stepRef.current);
    }

    return () => {
      if (stepRef.current) {
        observer.unobserve(stepRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={stepRef}
      className={clsx(
        "flex flex-col items-start p-6 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800 rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg",
        isVisible ? "flip-in" : "opacity-0"
      )}
      style={{
        transitionDelay: `${delay}s`,
      }}
    >
      <div className="text-3xl text-white mb-4">{icon}</div>
      <h3 className="text-lg font-semibold font-stix mb-2 text-white">{title}</h3>
      <p className="text-white font-stix">{description}</p>
    </div>
  );
};

const Steps: React.FC = () => {
  const { isDarkMode } = useTheme();
  
  const [textVisible, setTextVisible] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTextVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (textRef.current) {
      observer.observe(textRef.current);
    }

    return () => {
      if (textRef.current) {
        observer.unobserve(textRef.current);
      }
    };
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
    {
      icon: <FaChartLine />,
      title: "Track Progress",
      description: "Monitor your child's progress over time and adjust tasks and rewards to optimize their motivation and development.",
    },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-light-background dark:bg-dark-background">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="w-full md:w-1/2 max-w-md mb-8 md:mb-0">
            <div
              ref={textRef}
              className={clsx(
                "flex flex-col",
                textVisible ? "animate-slide-in-left" : "opacity-0"
              )}
            >
              <h2 className="text-3xl font-bold font-satisfy mb-4 text-light-primary dark:text-dark-text">
                How It Works
              </h2>
              <p className="text-lg mb-8 text-light-text font-stix dark:text-dark-text">
                Follow these simple steps to get started with our app and make the most of its features.
              </p>
              <Link href={"/auth/login"}>
                <button className="px-6 py-3 rounded-md bg-light-primary dark:bg-dark-primary font-stix text-dark-text font-medium hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300">
                  Get Started <FaRocket className="inline ml-2" />
                </button>
              </Link>
            </div>
          </div>
          <div className="w-full md:w-1/2 flex justify-end mt-8 md:mt-0">
            <div className="flex flex-col">
              {steps.map((step, index) => (
                <div key={index} className={index !== steps.length - 1 ? "mb-8" : ""}>
                  <StepCard {...step} delay={index * 0.3} />
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
