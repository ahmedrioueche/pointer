"use client";

import { useState, useEffect } from "react";

const Hero = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      document.documentElement.classList.toggle("dark", newMode);
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  return (
    <section className="relative w-full h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center px-6 py-8">
        <div className="text-center max-w-3xl">
          <h1 className="text-5xl font-bold mb-6 font-stix">
            Welcome to <span className="text-light-primary dark:text-dark-primary">Pointer</span>
          </h1>
          <h2 className="text-2xl text-light-primary dark:text-dark-primary font-semibold mb-6 font-stix">
            The Reward System for Parents
          </h2>
          <p className="text-lg mb-8 leading-relaxed font-stix">
            Pointer is a modern web and mobile app designed to help parents effectively discipline their children by rewarding them with points for completing tasks.
            These points can be redeemed for exciting rewards such as money, vacations, and more.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={toggleDarkMode}
              className="px-6 py-3 rounded-md bg-light-primary dark:bg-dark-primary text-light-background dark:text-dark-background font-medium hover:bg-light-secondary dark:hover:bg-dark-secondary transition-colors duration-300"
            >
              Get Started
            </button>
            <button
              className="px-6 py-3 rounded-md bg-light-background dark:bg-dark-background text-light-primary dark:text-dark-primary border-2 border-light-primary dark:border-dark-primary font-medium hover:bg-light-primary dark:hover:bg-dark-primary hover:text-light-background dark:hover:text-dark-background transition-colors duration-300"
            >
              Learn More
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
