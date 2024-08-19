"use client";

import Link from "next/link";
import { useState } from "react";
import { FaMoon, FaSun, FaBars, FaTimes, FaSignOutAlt, FaBell, FaCog, FaChartBar, FaTasks, FaCoins, FaGift, FaUser } from "react-icons/fa";
import { signOut } from "next-auth/react"; // Import signOut

const DashboardNavbar = ({ firstName }: any) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      document.documentElement.classList.toggle("dark", newMode);
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  const toggleMenu = () => {
    setIsMenuOpen((prevOpen) => !prevOpen);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/api/auth/signout" }); // Redirect to the login page after logout
  };

  // Extract the first letter of the first name
  const firstLetter = firstName?.charAt(0).toUpperCase();

  return (
    <nav className="relative z-1000 top-0 left-0 w-full py-4 px-6 shadow-md bg-light-background dark:bg-dark-background">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-3xl font-bold">
          <Link
            href="/dashboard"
            className="relative font-satisfy cursor-pointer text-dark-primary transition-colors duration-300 hover:text-light-accent dark:hover:text-dark-accent"
          >
            Pointer
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
          >
            {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>

          {/* Mobile Menu Icon */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

          {/* Hidden items on mobile, visible on larger screens */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications Icon */}
            <Link
              href="/notifications"
              className="p-2 rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
            >
              <FaBell size={20} />
            </Link>

            {/* Settings Icon */}
            <Link
              href="/settings"
              className="p-2 rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
            >
              <FaCog size={20} />
            </Link>

            {/* User's First Letter Logo and Logout Button */}
            <div className="flex items-center space-x-4">
              <div
                className="flex items-center justify-center w-10 h-10 rounded-full bg-light-primary dark:bg-dark-primary text-light-background dark:text-dark-background font-bold text-xl cursor-pointer hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
                title={firstName}
              >
                {firstLetter}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 rounded-md bg-light-primary dark:bg-dark-primary text-light-background dark:text-dark-background font-medium hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden items-center fixed top-0 left-0 w-full h-screen bg-light-background dark:bg-dark-background flex flex-col p-4 space-y-4">
          <button
            onClick={toggleMenu}
            className="absolute top-4 right-4 p-2 rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
          >
            <FaTimes size={20} />
          </button>
          <div className="flex flex-col items-start w-full">
            <Link
              href="/dashboard"
              className="flex items-center w-full p-4 text-lg font-medium text-light-text dark:text-dark-text hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
              onClick={toggleMenu}
            >
              <FaChartBar className="mr-2 text-lg" /> Dashboard
            </Link>
            <Link
              href="/tasks"
              className="flex items-center w-full p-4 text-lg font-medium text-light-text dark:text-dark-text hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
              onClick={toggleMenu}
            >
              <FaTasks className="mr-2 text-lg" /> Tasks
            </Link>
            <Link
              href="/points"
              className="flex items-center w-full p-4 text-lg font-medium text-light-text dark:text-dark-text hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
              onClick={toggleMenu}
            >
              <FaCoins className="mr-2 text-lg" /> Points
            </Link>
            <Link
              href="/rewards"
              className="flex items-center w-full p-4 text-lg font-medium text-light-text dark:text-dark-text hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
              onClick={toggleMenu}
            >
              <FaGift className="mr-2 text-lg" /> Rewards
            </Link>
            <Link
              href="/profile"
              className="flex items-center w-full p-4 text-lg font-medium text-light-text dark:text-dark-text hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
              onClick={toggleMenu}
            >
              <FaUser className="mr-2 text-lg" /> Profile
            </Link>

            <hr className="w-full border-t border-gray-300 dark:border-gray-600 my-2" />
            <Link
              href="/notifications"
              className="flex items-center w-full p-4 text-lg font-medium text-light-text dark:text-dark-text hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaBell className="mr-2 text-lg" />
              Notifications
            </Link>
            <Link
              href="/settings"
              className="flex items-center w-full p-4 text-lg font-medium text-light-text dark:text-dark-text hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaCog className="mr-2 text-lg" />
              Settings
            </Link>
            <Link
              href="/profile"
              className="flex items-center w-full p-4 text-lg font-medium text-light-text dark:text-dark-text hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-light-primary dark:bg-dark-primary text-light-background dark:text-dark-background font-bold text-xl cursor-pointer hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300">
                {firstLetter}
              </div>
              <span className="ml-2">Profile</span>
            </Link>
            <hr className="w-full border-t border-gray-300 dark:border-gray-600 my-2" />
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-4 text-lg font-medium text-light-text dark:text-dark-text hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-300"
            >
              <FaSignOutAlt className="mr-2 text-lg" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default DashboardNavbar;
