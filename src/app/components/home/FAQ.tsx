"use client";

import React, { useState, useEffect } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  return (
    <div className={`border-b ${isDarkMode ? 'border-dark-secondary' : 'border-light-secondary'} mb-4`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left py-4 px-6 flex justify-between items-center rounded-md
          ${isDarkMode ? 'bg-dark-background text-dark-text hover:bg-dark-accent' : 'bg-light-background text-light-text hover:bg-light-accent'}
          transition-colors`}
      >
        <span className="font-semibold">{question}</span>
        <span className={`transform ${isOpen ? 'rotate-180' : 'rotate-0'} transition-transform`}>
          &#9662;
        </span>
      </button>
      {isOpen && (
        <div className={`px-6 py-4 mt-2 rounded-md shadow-md
          ${isDarkMode ? 'bg-dark-background text-dark-text border border-dark-secondary' : 'bg-light-background text-light-text border border-light-secondary'}
          transition-colors transition-shadow`}
        >
          {answer}
        </div>
      )}
    </div>
  );
};

const FAQ: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    setIsDarkMode(savedTheme === 'dark');
  }, []);

  const faqs: FAQItemProps[] = [
    {
      question: "What is Pointer?",
      answer: "Pointer is a modern web and mobile app designed to help parents effectively discipline their children by rewarding them with points for completing tasks. These points can be redeemed for exciting rewards such as money, vacations, and more."
    },
    {
      question: "How does the point system work?",
      answer: "Parents assign tasks to their children, and upon completion, children earn points. These points accumulate and can be redeemed for various rewards. The app also allows customization of tasks and rewards to better fit individual family needs."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, all plans come with a 14-day free trial. You can explore all features and see if the app meets your needs before committing to a subscription."
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer: "Absolutely. You can cancel your subscription at any time, and you will not be charged for the next billing cycle. For more details, refer to our cancellation policy in the app settings."
    }
  ];

  return (
    <section className={`py-16 dark:bg-dark-background bg-light-background`}>
      <div className="container mx-auto px-4">
        <h2 className={`text-3xl font-bold text-center mb-6 font-satisfy dark:text-dark-text text-light-primary`}>
          Frequently Asked Questions
        </h2>
        <div className="w-full max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <FAQItem key={index} {...faq} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
