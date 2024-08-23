import React, { useState } from 'react';
import {
  FaBell,
  FaUser,
  FaShieldAlt,
  FaGlobe,
  FaCog,
  FaChevronDown,
} from 'react-icons/fa';

const settingsData = [
  {
    title: 'Language',
    description: 'Select your preferred language.',
    icon: FaGlobe,
    bgColor: 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500',
    options: ['English', 'Spanish', 'French'],
  },
  {
    title: 'Notifications',
    description: 'Manage your notification preferences.',
    icon: FaBell,
    bgColor: 'bg-gradient-to-r from-yellow-500 via-orange-500 to-red-500',
    options: ['Email Notifications', 'Push Notifications', 'SMS Notifications'],
  },
  {
    title: 'Account',
    description: 'Edit your personal information.',
    icon: FaUser,
    bgColor: 'bg-gradient-to-r from-green-400 via-blue-400 to-purple-400',
    options: ['Change Password', 'Update Email', 'Two-Factor Authentication'],
  },
  {
    title: 'Privacy',
    description: 'Control your privacy settings.',
    icon: FaShieldAlt,
    bgColor: 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500',
    options: ['Profile Visibility', 'Data Sharing', 'Location Settings'],
  },
  {
    title: 'General',
    description: 'General application settings.',
    icon: FaCog,
    bgColor: 'bg-gradient-to-r from-teal-400 via-blue-500 to-purple-600',
    options: ['Auto Updates', 'App Version', 'Backup & Restore'],
  },
];

const Settings: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="p-6 bg-light-background dark:bg-dark-background min-h-screen">
      <h1 className="text-3xl flex flex-row font-bold font-stix mb-6 text-light-text dark:text-dark-text">
       <FaCog className='mr-3'/>
        Settings
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {settingsData.map((setting, index) => (
          <div
            key={index}
            className="relative"
          >
            <div
              className={`p-6 rounded-lg shadow-md ${setting.bgColor} transition-transform duration-300`}
              style={{ height: openIndex === index ? 'auto' : '150px' }} // Adjust fixed height as needed
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleOpen(index)}
              >
                <div className="flex items-center">
                  <setting.icon className="text-white text-3xl mr-4" />
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {setting.title}
                    </h3>
                    <p className="text-white">{setting.description}</p>
                  </div>
                </div>
                <FaChevronDown
                  className={`text-white text-xl transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </div>
              {openIndex === index && (
                <div className="mt-4 p-4 rounded-lg shadow-inner h-auto overflow-auto">
                  <ul>
                    {setting.options.map((option, idx) => (
                      <li
                        key={idx}
                        className={`py-3 px-4 ${setting.bgColor} text-dark-text dark:text-dark-text hover:scale-105 rounded-md mb-3 shadow-sm cursor-pointer flex justify-between items-center transition-transform duration-300`}
                      >
                        {option}
                        <FaChevronDown className="text-dark-text" />
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Settings;
