"use client";

import Link from "next/link";
import { useState } from "react";
import Modal from "./Modal";
import { heroText } from "../../../data/text";
import Image from "next/image"; 
import { FaSpinner } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { useTheme } from "@/app/context/ThemeContext";
import { motion } from 'framer-motion';

const Hero = () => {
  const { isDarkMode } = useTheme();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router  = useRouter();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  
  const handleSignup = () => {
    setIsLoading(true);
    router.push("/auth/signup");
  };

  return (
    <section
      id="hero"
      className="relative w-full h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text flex justify-center py-7 md:py-0 md:items-center overflow-hidden"
    >
      {/* Left Image for Large Screens */}
      <motion.div
        className="absolute top-0 left-5 w-2/5 h-full hidden md:block"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src={isDarkMode ? '/ss/ss2.jpg' : '/ss/ss2_light.jpg'} 
          alt="App Screenshot Left"
          layout="fill"
          objectFit="cover"
          className="transform -translate-x-1/4 rotate-6 scale-65 blur-sm opacity-50 md:opacity-70 top-0" 
        />
      </motion.div>

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6 max-w-xl mx-auto">
        {/* Animated Text */}
        <motion.h1
          className="text-5xl md:text-6xl font-bold mb-6 font-satisfy"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {heroText.welcome}{" "}
          <span className="text-light-primary dark:text-dark-primary">
            Pointer
          </span>
        </motion.h1>
        <motion.h2
          className="text-2xl text-light-primary dark:text-dark-primary font-semibold mb-6 font-stix"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
        >
          {heroText.tagline}
          </motion.h2>
        <motion.p
          className="text-lg mb-8 leading-relaxed font-stix"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.4 }}
        >
          {heroText.description}
        </motion.p>
        <div className="flex justify-center gap-4">
          {/* Animated Buttons */}
          <motion.button
            onClick={handleSignup}
            className="font-stix px-6 py-3 rounded-md bg-light-primary dark:bg-dark-primary text-dark-text font-medium hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
          >
            {isLoading ? <FaSpinner className="animate-spin"/> : "Get Started"}
          </motion.button>
          
          <motion.button
            onClick={openModal}
            className="font-stix px-6 py-2 rounded-md bg-light-background dark:bg-dark-background text-light-primary dark:text-dark-primary border-2 border-light-primary dark:border-dark-primary font-medium hover:bg-light-primary dark:hover:bg-dark-primary hover:text-dark-text dark:hover:text-dark-text transition-colors duration-300"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
          >
            Learn More
          </motion.button>
        </div>
      </div>

      {/* Right Image */}
      <motion.div
        className="absolute top-0 right-0 w-2/5 h-full hidden md:block"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Image
          src={isDarkMode ? '/ss/ss1.png' : '/ss/ss1_light.png'}
          alt="App Screenshot Right"
          layout="fill"
          objectFit="cover"
          className="transform translate-x-1/4 -rotate-6 scale-65 blur-sm opacity-30 md:opacity-70"
        />
      </motion.div>

      {/* Modal for Learn More */}
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-2xl font-bold mb-4 font-satisfy">{heroText.modal.title}</h2>
        {heroText.modal.sections.map((section, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-light-primary dark:text-dark-primary">
              {section.title}
            </h3>
            <p>{section.content}</p>
          </div>
        ))}
        <button
          onClick={closeModal}
          className="font-stix px-6 py-3 mt-5 rounded-md bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text font-medium hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
        >
          Close
        </button>
      </Modal>
    </section>
  );
};

export default Hero;
