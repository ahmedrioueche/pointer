  "use client";

  import Link from "next/link";
  import { useEffect, useRef, useState } from "react";
  import { FaMoon, FaSun, FaBars, FaTimes, FaHome, FaInfoCircle, FaPhone, FaAppStore, FaSignInAlt, FaUserPlus, FaSpinner } from "react-icons/fa";
  import { useRouter } from 'next/navigation';
import { useTheme } from "@/app/context/ThemeContext";

  const Navbar = () => {
    const {isDarkMode, toggleDarkMode } = useTheme();
    const [activeLink, setActiveLink] = useState("home");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [isSignupLoading, setIsSignupLoading] = useState(false);
    const router  = useRouter();
    const dropdownRef = useRef<HTMLDivElement | null>(null);

    const handleSetActiveLink = (link : any) => {
      setActiveLink(link);

      const section = document.getElementById(link);
      if (section) {
        section.scrollIntoView({
          behavior: "smooth", 
          block: "start",    
        });
      }
    };

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
          if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
            setIsMenuOpen(false);
          }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, []);

    const toggleMenu = () => {
      setIsMenuOpen((prevOpen) => !prevOpen);
    };

    const handleLogin = () => {
      setIsLoginLoading(true);
      router.push("/auth/login")
    }

    const handleSignup = () => {
      setIsSignupLoading(true);
      router.push("/auth/signup")
    }

    return (
      <nav className="relative z-1000 top-0 left-0 w-full py-4 px-6 shadow-md bg-light-background dark:bg-dark-background">
        <div className="container mx-auto flex items-center justify-between font-satisfy">
          <div className="text-3xl font-bold">  
            <Link
              href="/"
              className={`relative cursor-pointer dark:hover:text-dark-accent hover:text-light-accent transition-colors duration-300 text-light-primary dark:text-dark-primary`}
              onClick={() => setActiveLink("home")}
            >
              Pointer
            </Link>
          </div>
          {/* Large screens navigation */}
          <ul className="hidden md:flex space-x-6 flex-1 justify-center">
            {["Home", "How It Works", "Features", "Contact"].map((item, index) => {
              const sectionId = item.toLowerCase().replace(/\s+/g, "-");
              return (
                <li key={index}>
                  <Link
                    href={`/`}
                    className="relative cursor-pointer text-sm sm:text-lg font-medium group"
                    onClick={() => handleSetActiveLink(sectionId)}
                  >
                    <span
                      className={`relative transition-colors duration-300 ${
                        activeLink === item.toLowerCase()
                          ? "text-light-primary dark:text-dark-primary"
                          : "text-light-text dark:text-dark-text group-hover:text-light-primary dark:group-hover:text-dark-primary"
                      }`}
                    >
                      {item}
                    </span>
                    <span
                      className={`block h-[2px] w-0 bg-light-primary dark:bg-dark-primary absolute left-0 bottom-[-2px] transition-all duration-300 ${
                        activeLink === item.toLowerCase() ? "w-full" : "group-hover:w-full"
                      }`}
                    ></span>
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogin}
              className="hidden md:block px-4 py-2 rounded-md bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text font-medium hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
            >
              {isLoginLoading? <FaSpinner className="animate-spin"/> : "Login"} 
            </button>
            <button
              onClick={handleSignup}
              className="hidden md:block px-4 py-2 rounded-md bg-light-primary dark:bg-dark-primary text-light-text dark:text-dark-text font-medium hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
            >
              {isSignupLoading? <FaSpinner className="animate-spin"/> : "Signup"} 
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text  hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
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
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden overflow-y-auto mt-5 z-[100] absolute top-[2.8rem] right-[1.4rem] w-[15.6rem] bg-light-background dark:bg-dark-background border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg flex flex-col p-2 space-y-4"
            ref={dropdownRef}
          >
            {[
              { name: "Home", icon: FaHome },
              { name: "How It Works", icon: FaAppStore },
              { name: "Features", icon: FaInfoCircle },
              { name: "Contact", icon: FaPhone },
            ].map((item, index) => (
              <Link
                key={index}
                href={`/`}
                className="flex items-center px-4 py-2 w-full text-lg font-medium font-satisfy text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
                onClick={() => {
                  handleSetActiveLink(item.name.toLowerCase());
                  setIsMenuOpen(false);
                }}
              >
                <item.icon className="mr-3 text-lg" />
                {item.name}
              </Link>
            ))}
            <hr className="w-full border-t border-gray-300 dark:border-gray-600 my-2" />
            <Link
              href="/auth/login"
              className="flex items-center px-4 py-2  w-full text-lg font-medium font-satisfy text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaSignInAlt className="mr-3 text-lg" />
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="flex items-center px-4 py-2 w-full text-lg font-medium font-satisfy text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaUserPlus className="mr-3 text-lg" />
              Signup
            </Link>
          </div>
        )}
      </nav>
    );
  };

  export default Navbar;
