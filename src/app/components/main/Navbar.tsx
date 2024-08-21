import Link from "next/link";
import { useEffect, useState } from "react";
import { FaMoon, FaSun, FaBars, FaTimes, FaSignOutAlt, FaBell, FaCog, FaChartBar, FaTasks, FaCoins, FaGift, FaUser, FaHome, FaClock, FaArrowDown, FaArrowUp, FaLightbulb, FaDice, FaArrowRight } from "react-icons/fa";
import { signOut } from "next-auth/react";

const DashboardNavbar = ({ firstName } : any) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [remainingDays, setRemainingDays] = useState(30);

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      document.documentElement.classList.toggle("dark", newMode);
      localStorage.setItem("theme", newMode ? "dark" : "light");
      return newMode;
    });
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        const isDark = savedTheme === 'dark';
        setIsDarkMode(isDark);
        document.documentElement.classList.toggle('dark', isDark);
    }
  }, []);

  useEffect(() => {
      setRemainingDays(30);
    
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prevOpen) => !prevOpen);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/api/auth/signout" });
  };

  const firstLetter = firstName?.charAt(0).toUpperCase() || "P";

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
        <button
          className="hidden md:flex px-4 py-2 rounded-md text-lg md:text-xl font-stix bg-light-primary dark:bg-dark-primary text-dark-text dark:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 items-center group"
        >
          {`${remainingDays} Days`}
          <span className="ml-2 transition-transform duration-300 group-hover:rotate-180">
            <FaClock className="text-xl group-hover:hidden" />
            <FaArrowUp className="text-xl hidden group-hover:block" />
          </span>
        </button>
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
          >
            {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>

          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>

          <div className="hidden md:flex items-center space-x-4">
            {/* Notifications Icon */}
            <Link
              href="/notifications"
              className="p-2 rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
            >
              <FaBell size={20} />
            </Link>

            {/* Settings Icon */}
            <Link
              href="/settings"
              className="p-2 rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
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
                className="flex items-center px-4 py-2 rounded-md bg-light-primary dark:bg-dark-primary text-dark-text dark:text-light-text hover:text-dark-text font-medium hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden z-[100] overflow-y-scroll items-center fixed top-0 right-0 w-[20rem] h-screen bg-light-background dark:bg-dark-background flex flex-col p-4 space-y-4">
          <button
            onClick={toggleMenu}
            className="absolute top-3 right-3 p-2 rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
          >
            <FaTimes size={20} />
          </button>
          <div className="flex flex-col items-start w-full">
            <Link
              href="/main/home"
              className="flex items-center w-full p-4 py-3 mt-4 text-lg font-medium text-light-text  dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
              onClick={toggleMenu}
            >
              <FaHome className="mr-2 text-lg" /> Home
            </Link>
            <Link
              href="/main/dashboard"
              className="flex items-center w-full p-4 py-3 text-lg font-medium text-light-text  dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
              onClick={toggleMenu}
            >
              <FaChartBar className="mr-2 text-lg" /> Dashboard
            </Link>
          
            <Link
              href="/main/rewards"
              className="flex items-center w-full p-4 py-3 text-lg font-medium text-light-text  dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
              onClick={toggleMenu}
            >
              <FaGift className="mr-2 text-lg" /> Rewards
            </Link>
            <Link
              href="/main/tasks"
              className="flex items-center w-full p-4 py-3 text-lg font-medium text-light-text  dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
              onClick={toggleMenu}
            >
              <FaTasks className="mr-2 text-lg" /> Tasks
            </Link>

            <Link
              href="/main/quizzes"
              className="flex items-center w-full p-4 py-3 text-lg font-medium text-light-text  dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
              onClick={toggleMenu}
            >
              <FaLightbulb className="mr-2 text-lg" /> Quizzes
            </Link>
            <Link
              href="/main/games"
              className="flex items-center w-full p-4 py-3 text-lg font-medium text-light-text  dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
              onClick={toggleMenu}
            >
              <FaDice className="mr-2 text-lg" /> Games
            </Link>
           
            <hr className="w-full border-t border-gray-300 dark:border-gray-600 my-2" />
            <Link
              href="/main/notifications"
              className="flex items-center w-full p-4 py-3 text-lg font-medium text-light-text  dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaBell className="mr-2 text-lg" />
              Notifications
            </Link>
            <Link
              href="/main/settings"
              className="flex items-center w-full p-4 py-3 text-lg font-medium text-light-text  dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <FaCog className="mr-2 text-lg" />
              Settings
            </Link>
            <Link
              href="/main/profile"
              className="flex items-center w-full p-4 py-3 text-lg font-medium text-light-text  dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-light-primary dark:bg-dark-primary text-light-background dark:text-dark-background font-bold text-xl cursor-pointer hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300">
                {firstLetter}
              </div>
              <span className="ml-2">Profile</span>
            </Link>
            <hr className="w-full border-t border-gray-300 dark:border-gray-600 my-2" />
            <button
              className="flex items-center w-full p-4 py-3 text-lg font-medium text-light-text dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
            >
              <span className="flex items-center">
                <FaClock className="text-xl transition-transform duration-500 ease-in-out transform hover:rotate-360" />
                <span className="ml-2">{`${remainingDays} Days`}</span>
              </span>
            </button>
            <button
              className="relative flex items-center w-full p-4 py-3 text-lg font-medium text-light-text dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
            >
              <FaClock className="text-xl transition-transform duration-500 ease-in-out transform group-hover:rotate-360" />
              <span className="ml-2">{`${remainingDays} Days`}</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center w-full p-4 py-3 text-lg font-medium text-light-text  dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
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
