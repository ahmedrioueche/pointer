"use client";

import React, { useState, useEffect, useRef } from 'react';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';
import clsx from 'clsx';
import { useTheme } from '@/app/context/ThemeContext';
import { testimonials } from '@/data/text';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  index: number; // We will use this to determine the direction
}

const TestimonialCard: React.FC<TestimonialProps> = ({ quote, author, role, index }) => {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={cardRef}
      className={clsx(
        "flex flex-col p-6 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800 rounded-lg shadow-md transition-transform",
        isVisible ? "animate-slide-in-left" : "opacity-0"
      )}
    >
      <div className="flex items-start text-white mb-4">
        <FaQuoteLeft className="text-3xl" />
        <p className="ml-2 text-white font-stix">{quote}</p>
        <FaQuoteRight className="text-3xl ml-2" />
      </div>
      <h3 className="text-lg font-semibold font-satisfy mt-4 text-white">{author}</h3>
      <p className="text-white font-stix">{role}</p>
    </div>
  );
};

const Testimonial: React.FC = () => {
  const { isDarkMode } = useTheme();

  return (
    <section className="py-16 bg-light-background dark:bg-dark-background mb-0">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold font-satisfy mb-12 text-center text-light-primary dark:text-dark-text">
          What People Are Saying
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} {...testimonial} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
