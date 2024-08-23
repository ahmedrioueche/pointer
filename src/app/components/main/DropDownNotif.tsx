import { useEffect, useState } from "react";
import { FaBell, FaUser, FaTrophy, FaCheckCircle } from "react-icons/fa";
import { capitalizeFirstLetter, formatDateTime } from "@/lib/formater";

const notifications = [
  { id: 1, message: 'Alice has finished Task "Do homework"', icon: <FaCheckCircle className="text-green-500" />, date: new Date('2024-08-20T14:00:00Z') },
  { id: 2, message: 'Bob claimed reward "Playstation 5"', icon: <FaTrophy className="text-yellow-500" />, date: new Date('2024-08-21T09:30:00Z') },
  // Add more notifications as needed
];


const DropdownNotifications: React.FC<{ onClick: () => void, isMenuOpen: boolean }> = ({ onClick, isMenuOpen }) => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
    onClick();
  };

  useEffect(() => {
    isMenuOpen? setIsDropdownOpen(false) : null;
  }, [isMenuOpen])

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="p-2 rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
      >
        <FaBell size={20} />
      </button>
      {isDropdownOpen && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-light-background dark:bg-dark-background border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50">
          <div className="p-4">
            {notifications.length === 0 ? (
              <p className="text-center text-light-text dark:text-dark-text">No notifications</p>
            ) : (
              notifications.map(({ id, message, icon, date }) => (
                <div
                  key={id}
                  className="flex items-center p-2 border-b border-gray-300 dark:border-gray-600 hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 cursor-pointer"
                >
                  <div className="mr-2 text-xl">{icon}</div>
                  <div className="flex-1">
                    <p className="text-light-text font-satisfy dark:text-dark-text">{message}</p>
                    <p className="text-sm text-gray-500 font-satisfy dark:text-gray-400">
                      {capitalizeFirstLetter(formatDateTime(date))}     
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownNotifications;
