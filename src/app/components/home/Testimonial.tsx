"use client";

import React, { useState, useEffect } from 'react';
import { FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
}

const TestimonialCard: React.FC<TestimonialProps> = ({ quote, author, role }) => (
  <div className="flex flex-col p-6 bg-dark-background dark:bg-light-background rounded-lg shadow-md mb-0 md:mb-0 transition-transform transform hover:scale-105 hover:shadow-lg">
    <div className="flex items-start text-light-primary dark:text-dark-primary mb-4">
      <FaQuoteLeft className="text-3xl" />
      <p className="ml-2 text-dark-text dark:text-light-text">{quote}</p>
      <FaQuoteRight className="text-3xl ml-2" />
    </div>
    <h3 className="text-lg font-semibold font-satisfy mt-4 text-dark-text dark:text-light-text">{author}</h3>
    <p className="text-light-secondary dark:text-dark-secondary">{role}</p>
  </div>
);

const Testimonial: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    setIsDarkMode(savedTheme === "dark");
  }, []);

  const testimonials = [
    {
      quote: "This app has revolutionized the way I manage tasks with my kids. They are more responsible and motivated!",
      author: "Jane Doe",
      role: "Parent",
    },
    {
      quote: "The point system is genius. My kids love earning rewards for their hard work.",
      author: "John Smith",
      role: "Father of two",
    },
    {
      quote: "An excellent tool for teaching kids responsibility while making it fun.",
      author: "Emily Johnson",
      role: "Teacher",
    },
    {
      quote: "The best parenting tool I’ve come across. It’s so easy to use and incredibly effective.",
      author: "Michael Brown",
      role: "Father",
    },
    {
      quote: "I’ve noticed a big improvement in my children's behavior since we started using this app.",
      author: "Laura Wilson",
      role: "Mother of three",
    },
    {
      quote: "It’s rewarding for both parents and children. Highly recommend it!",
      author: "Chris Miller",
      role: "Parent",
    },
  ];

  return (
    <section className="py-16 bg-light-background dark:bg-dark-background mb-0">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold font-satisfy mb-12 text-center text-light-primary dark:text-dark-text">
        What People Are Saying
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} {...testimonial} />
        ))}
      </div>
    </div>
  </section>
  
  );
};

export default Testimonial;
