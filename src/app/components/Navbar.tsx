"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { FaMoon, FaSun, FaBars, FaTimes } from "react-icons/fa";

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeLink, setActiveLink] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);  // Ref for the dropdown menu

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

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    const menuRef = useRef<HTMLDivElement>(null); // Typing the ref to HTMLDivElement

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="relative z-1000 top-0 left-0 w-full py-4 px-6 shadow-md bg-light-background dark:bg-dark-background">
      <div className="container mx-auto flex items-center justify-between font-satisfy">
        <div className="text-3xl font-bold">
          <Link
            href="/"
            className={`relative cursor-pointer ${isDarkMode ? 'text-dark-text' : 'text-light-text'} transition-colors duration-300 hover:text-light-primary dark:hover:text-dark-primary`}
            onClick={() => setActiveLink("home")}
          >
            Pointer
          </Link>
        </div>
        {/* Large screens navigation */}
        <ul className="hidden md:flex space-x-6 flex-1 justify-center">
          {["Home", "App", "About", "Contact"].map((item, index) => (
            <li key={index}>
              <Link
                href={`/${item.toLowerCase()}`}
                className="relative cursor-pointer text-sm sm:text-lg font-medium group"
                onClick={() => setActiveLink(item.toLowerCase())}
              >
                <span
                  className={`relative transition-colors duration-300 ${activeLink === item.toLowerCase() ? "text-light-primary dark:text-dark-primary" : "text-light-text dark:text-dark-text group-hover:text-light-primary dark:group-hover:text-dark-primary"}`}
                >
                  {item}
                </span>
                <span
                  className={`block h-[2px] w-0 bg-light-primary dark:bg-dark-primary absolute left-0 bottom-[-2px] transition-all duration-300 ${activeLink === item.toLowerCase() ? "w-full" : "group-hover:w-full"}`}
                ></span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="hidden md:block px-4 py-2 rounded-md bg-light-primary dark:bg-dark-primary text-light-background dark:text-dark-background font-medium hover:bg-light-secondary dark:hover:bg-dark-secondary transition-colors duration-300"
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="hidden md:block px-4 py-2 rounded-md bg-light-primary dark:bg-dark-primary text-light-background dark:text-dark-background font-medium hover:bg-light-secondary dark:hover:bg-dark-secondary transition-colors duration-300"
          >
            Signup
          </Link>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text hover:bg-light-secondary dark:hover:bg-dark-secondary transition-colors duration-300"
          >
            {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>
          {/* Mobile Menu Icon */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text hover:bg-light-secondary dark:hover:bg-dark-secondary transition-colors duration-300"
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div ref={menuRef} className="md:hidden flex flex-col items-center bg-light-background dark:bg-dark-background shadow-md py-4 mt-2 rounded-lg">
          {["Home", "App", "About", "Contact"].map((item, index) => (
            <Link
              key={index}
              href={`/${item.toLowerCase()}`}
              className="block px-4 py-2 w-full text-center text-lg font-medium text-light-text dark:text-dark-text hover:bg-light-secondary dark:hover:bg-dark-secondary hover:text-light-text dark:hover:text-dark-text transition-colors duration-300"
              onClick={() => {
                setActiveLink(item.toLowerCase());
                setIsMenuOpen(false);
              }}
            >
              {item}
            </Link>
          ))}
          <Link
            href="/login"
            className="block px-4 py-2 mt-2 mb-2 w-full text-center text-lg font-medium bg-light-primary dark:bg-dark-primary text-light-background dark:text-dark-background rounded-md hover:bg-light-secondary dark:hover:bg-dark-secondary transition-colors duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="block px-4 py-2 w-full text-center text-lg font-medium bg-light-primary dark:bg-dark-primary text-light-background dark:text-dark-background rounded-md hover:bg-light-secondary dark:hover:bg-dark-secondary transition-colors duration-300"
            onClick={() => setIsMenuOpen(false)}
          >
            Signup
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
