"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import Modal from "./Modal";
import { heroText } from '../../../data/text';

const Hero = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      document.documentElement.classList.toggle("dark", newMode);
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <section id="hero" className="relative w-full h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text flex items-center justify-center">
      <div className="relative w-full h-full flex items-center justify-center px-6 py-8">
        <div className="text-center max-w-3xl mx-auto mt-0">
          <h1 className="text-5xl font-bold mb-6 font-stix">
            {heroText.welcome} <span className="text-light-primary dark:text-dark-primary">Pointer</span>
          </h1>
          <h2 className="text-2xl text-light-primary dark:text-dark-primary font-semibold mb-6 font-stix">
            {heroText.tagline}
          </h2>
          <p className="text-lg mb-8 leading-relaxed font-stix">
            {heroText.description}
          </p>
          <div className="flex justify-center gap-4">
            <Link href={"/auth/signup"}>
              <button
                className="font-stix px-6 py-3 rounded-md bg-light-primary dark:bg-dark-primary text-light-background dark:text-dark-background font-medium hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
              >
                Get Started
              </button>
            </Link>
            <button
              onClick={openModal}
              className="font-stix px-6 py-2 rounded-md bg-light-background dark:bg-dark-background text-light-primary dark:text-dark-primary border-2 border-light-primary dark:border-dark-primary font-medium hover:bg-light-primary dark:hover:bg-dark-primary hover:text-light-background dark:hover:text-dark-background transition-colors duration-300"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        <h2 className="text-2xl font-bold mb-4">{heroText.modal.title}</h2>
        {heroText.modal.sections.map((section, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-xl font-semibold mb-2 text-light-primary dark:text-dark-primary">{section.title}</h3>
            <p>{section.content}</p>
          </div>
        ))}
        <button
          onClick={closeModal}
          className="font-stix px-6 py-3 mt-5 rounded-md bg-light-primary dark:bg-dark-primary text-light-background dark:text-dark-background font-medium hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
        >
          Close
        </button>
      </Modal>
    </section>
  );
};

export default Hero;
