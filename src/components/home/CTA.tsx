"use client";
import React from 'react';
import { useTheme } from '@/app/context/ThemeContext';
import Link from 'next/link';
import { FaRocket } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const CTA: React.FC = () => {
  const { isDarkMode } = useTheme();

  // Define animation variants for entrance effect
  const buttonVariants = {
    hidden: { opacity: 0, x: '100%' }, // Start from the right edge of the viewport
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30,
        duration: 0.5
      }
    }
  };

  // Intersection Observer setup
  const { ref, inView } = useInView({
    triggerOnce: false, // Trigger every time it comes into view
    threshold: 0.1
  });

  return (
    <section className={`py-16 text-center bg-light-background dark:bg-dark-background`}>
      <h2 className={`text-3xl font-bold font-satisfy mb-4 dark:text-dark-text text-light-primary`}>
        Ready to Get Started?
      </h2>
      <p className={`text-lg mb-8 font-stix text-light-text dark:text-dark-text`}>
        Join us today and take the first step towards achieving your goals with our amazing tool.
      </p>
      <Link href={"/auth/signup"}>
        <motion.button
          id="cta-button"
          ref={ref}
          onClick={() => console.log('CTA Clicked')}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          variants={buttonVariants}
          className={`px-6 py-3 font-stix rounded-md text-dark-text ${isDarkMode ? 'bg-dark-primary hover:bg-dark-accent' : 'bg-light-primary hover:bg-light-accent'} font-medium transition-colors duration-300`}
        >
          Get Started Now <FaRocket className="inline ml-2" />
        </motion.button>
      </Link>
    </section>
  );
};

export default CTA;
