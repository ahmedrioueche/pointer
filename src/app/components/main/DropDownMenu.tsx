import React, { FC, useRef } from 'react';
import Link from 'next/link';
import {
  FaHome,
  FaChartBar,
  FaCalendarAlt,
  FaTasks,
  FaGift,
  FaDice,
  FaLightbulb,
  FaTrophy,
  FaCog,
  FaClock,
  FaSignOutAlt,
  FaSpinner,
  FaDollarSign,
} from 'react-icons/fa';

type User = {
  name: string;
  type: string;
};

type ChildData = {
  icon?: string;
};

type MenuProps = {
  isMenuOpen: boolean;
  user: User;
  childData?: ChildData;
  isLoading?: boolean;
  remainingDays?: number;
  toggleMenu: () => void;
  handleProfileClick: () => void;
  handleLogout: () => void;
  togglePlansModal: () => void;
  toggleBudgetModal: () => void;
};

const Menu: FC<MenuProps> = ({
  isMenuOpen,
  user,
  childData,
  isLoading,
  remainingDays,
  toggleMenu,
  togglePlansModal,
  handleProfileClick,
  handleLogout,
  toggleBudgetModal,
}) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  if (!isMenuOpen) return null;

  const userType = user.type;
  const firstLetter = user.name?.charAt(0).toUpperCase() || "P";

  const  handlePlansClick = () => {
    togglePlansModal();
    toggleMenu();
  }

  const handleBudgetClick = () => {

    toggleBudgetModal();
    toggleMenu()

  }

  return (
    <div
      ref={dropdownRef}
      className="md:hidden overflow-y-auto mt-5 z-[100] absolute top-[2.8rem] right-[1.4rem] w-[15.6rem] bg-light-background dark:bg-dark-background border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg flex flex-col py-1 space-y-4"
    >
      <div className="flex flex-col items-start w-full space-y-2">
        <Link
          href="/main/home"
          className="flex items-center w-full p-4 py-2 text-lg font-medium text-light-text dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
          onClick={toggleMenu}
        >
          <FaHome className="mr-3 text-lg" /> Home
        </Link>

        {userType !== 'child' && (
          <>
            <Link
              href="/main/dashboard"
              className="flex items-center w-full p-4 py-2 text-lg font-medium text-light-text dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
              onClick={toggleMenu}
            >
              <FaChartBar className="mr-3 text-lg" /> Dashboard
            </Link>

            <Link
              href="/main/routines"
              className="flex items-center w-full p-4 py-2 text-lg font-medium text-light-text dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
              onClick={toggleMenu}
            >
              <FaCalendarAlt className="mr-3 text-lg" /> Routines
            </Link>
          </>
        )}
          <button
            onClick={handleBudgetClick}
            className="flex items-center w-full p-4 py-2 text-lg font-medium text-light-text dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
          >
            <span className="flex items-center">
              <FaDollarSign className="text-xl transition-transform duration-500 ease-in-out transform hover:rotate-360" />
              <span className="ml-2">Budget</span>
            </span>
          </button>
       
        <Link
          href="/main/tasks"
          className="flex items-center w-full p-4 py-2 text-lg font-medium text-light-text dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
          onClick={toggleMenu}
        >
          <FaTasks className="mr-3 text-lg" /> Tasks
        </Link>

        <Link
          href="/main/rewards"
          className="flex items-center w-full p-4 py-2 text-lg font-medium text-light-text dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
          onClick={toggleMenu}
        >
          <FaGift className="mr-3 text-lg" /> Rewards
        </Link>

        <Link
          href="/main/quizzes"
          className="flex items-center w-full p-4 py-2 text-lg font-medium text-light-text dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
          onClick={toggleMenu}
        >
          <FaLightbulb className="mr-3 text-lg" /> Quizzes
        </Link>

        <Link
          href="/main/competitions"
          className="flex items-center w-full p-4 py-2 text-lg font-medium text-light-text dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
          onClick={toggleMenu}
        >
          <FaTrophy className="mr-3 text-lg" /> Competitions
        </Link>

        <Link
          href="/main/games"
          className="flex items-center w-full p-4 py-2 text-lg font-medium text-light-text dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
          onClick={toggleMenu}
        >
          <FaDice className="mr-3 text-lg" /> Games
        </Link>

        <hr className="w-full border-t border-gray-300 dark:border-gray-600 my-2" />

        <Link
          href="/main/settings"
          className="flex items-center w-full p-4 py-2 text-lg font-medium text-light-text dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
          onClick={toggleMenu}
        >
          <FaCog className="mr-3 text-lg" /> Settings
        </Link>

        {userType === 'child' ? (
          <div
            className="flex items-center mr-3 cursor-pointer w-full p-3 py-2 text-lg font-medium text-light-text dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
            title={user.name}
            onClick={handleProfileClick}
          >
            {isLoading ? (
              <div className="flex flex-row items-center">
                <FaSpinner className="animate-spin" />
                <span className="ml-3">Profile</span>
              </div>
            ) : childData?.icon ? (
              <div className="flex flex-row items-center">
                <img
                  src={childData.icon}
                  alt={firstLetter}
                  className="rounded-full object-cover cursor-pointer h-7 w-7"
                />
                <span className="ml-3">Profile</span>
              </div>
            ) : (
              <div className='flex flex-row'>
              <div
                  className="flex items-center justify-center w-6 h-6  mt-1 rounded-full bg-light-primary dark:bg-dark-primary text-light-background dark:text-dark-background font-bold text-xl cursor-pointer hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
                  title={user.name}
              >
                  {firstLetter}
              </div>
              <span className='text-light-text dark:text-dark-text mt-1 ml-3 text-lg'>Profile</span>
          </div>
            )}
          </div>
        ) : (
            <div className='flex flex-row'>
                <div
                    className="flex items-center justify-center w-6 h-6 ml-3 mt-1 rounded-full bg-light-primary dark:bg-dark-primary text-light-background dark:text-dark-background font-bold text-xl cursor-pointer hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
                    title={user.name}
                >
                    {firstLetter}
                </div>
                <span className='text-light-text dark:text-dark-text mt-1 ml-3 text-lg'>Profile</span>
            </div>
        )}

        <hr className="w-full border-t border-gray-300 dark:border-gray-600 my-2" />

        {userType !== 'child' && (
          <button
            onClick={handlePlansClick}
            className="flex items-center w-full p-4 py-2 text-lg font-medium text-light-text dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
          >
            <span className="flex items-center">
              <FaClock className="text-xl transition-transform duration-500 ease-in-out transform hover:rotate-360" />
              <span className="ml-2">{`${remainingDays} Days`}</span>
            </span>
          </button>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center w-full p-4 py-2 text-lg font-medium text-light-text dark:text-dark-text hover:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
        >
          <FaSignOutAlt className="mr-3 text-lg" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Menu;
