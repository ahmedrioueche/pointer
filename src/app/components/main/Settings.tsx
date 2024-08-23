import React, { useState } from 'react';
import {
  FaBell,
  FaUser,
  FaShieldAlt,
  FaGlobe,
  FaCog,
  FaChevronDown,
} from 'react-icons/fa';
import LoadingButton from '../LoadingButton';

const settingsData = [
  {
    title: 'Language',
    description: 'Select your preferred language.',
    icon: FaGlobe,
    bgColor: 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500',
    options: ['English', 'Arabic', 'French'],
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
  const [openIndexMain, setOpenIndexMain] = useState<number | null>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  const toggleOpenMain = (index: number) => {
    setOpenIndexMain(openIndexMain === index ? null : index);
  };

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full p-6 bg-light-background dark:bg-dark-background min-h-screen">
      <h1 className="text-3xl flex flex-row font-bold font-stix mb-6 text-light-text dark:text-dark-text">
        <FaCog className="mr-3" />
        Settings
      </h1>
      <div className="w-full max-w-[100vw] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {settingsData.map((setting, index) => (
          <div key={index} className="relative w-full max-w-full">
            <div
              className={`p-6 rounded-lg shadow-md ${setting.bgColor} transition-transform duration-300`}
              style={{ height: openIndexMain === index ? 'auto' : '150px' }}
            >
              <div
                className="flex items-center justify-between cursor-pointer"
                onClick={() => toggleOpenMain(index)}
              >
                <div className="flex items-center">
                  <setting.icon className="text-white text-3xl mr-4" />
                  <div>
                    <h3 className="text-xl font-semibold text-white">
                      {setting.title}
                    </h3>
                    <p className="text-white font-satisfy">{setting.description}</p>
                  </div>
                </div>
                <FaChevronDown
                  className={`text-white text-xl transition-transform duration-300 ${
                    openIndexMain === index ? 'rotate-180' : 'rotate-0'
                  }`}
                />
              </div>
              {openIndexMain === index && (
                <div className="mt-4 p-4 rounded-lg shadow-inner h-auto overflow-auto">
                  <ul>
                    {setting.options.map((option, idx) => (
                      <div key={idx}>
                        <li
                          onClick={() => toggleOpen(idx)}
                          className={`py-3 px-4 ${setting.bgColor} text-dark-text dark:text-dark-text hover:scale-105 rounded-md mb-3 shadow-sm cursor-pointer flex justify-between items-center transition-transform duration-300`}
                        >
                          {option}
                          <FaChevronDown
                            className={`text-white text-xl transition-transform duration-300 ${
                              openIndex === idx ? 'rotate-180' : 'rotate-0'
                            }`}
                          />
                        </li>
                        {openIndex === idx && (
                          <div className="mt-3 mb-3">
                            {renderSettingContent(openIndexMain, openIndex, setting.bgColor)}
                          </div>
                        )}
                      </div>
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


const renderSettingContent = (openIndexMain: number | null, openIndex: number | null, bgColor: string) => {
  if (openIndexMain === null || openIndex === null) return null;

  const containerClasses = `p-4 rounded-lg shadow-md text-dark-text font-stix ${bgColor}`;

  if (openIndexMain === 0) {
    switch (openIndex) {
      case 0:
        return (
          <div className={containerClasses}>
            <h4 className="font-bold mb-2">Selected Language: English</h4>
            <p>All system interfaces and messages will be displayed in English.</p>
          </div>
        );
      case 1:
        return (
          <div className={containerClasses}>
            <h4 className="font-bold mb-2">Selected Language: Arabic</h4>
            <p>The system will switch to Arabic, and you will see all the texts in Arabic.</p>
          </div>
        );
      case 2:
        return (
          <div className={containerClasses}>
            <h4 className="font-bold mb-2">Selected Language: French</h4>
            <p>French language has been selected. All texts will now appear in French.</p>
          </div>
        );
      default:
        return null;
    }
  }

  if (openIndexMain === 1) {
    switch (openIndex) {
      case 0:
        return (
          <div className={containerClasses}>
            <h4 className="font-bold mb-2">Email Notifications</h4>
            <p>Manage your email notification settings here. You can opt in or out of receiving email updates about the latest features, security notices, and more.</p>
            <div className="mt-4">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-accent" />
                <span>Receive feature updates</span>
              </label>
              <label className="flex items-center space-x-3 mt-3">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-accent" />
                <span>Receive security alerts</span>
              </label>
            </div>
          </div>
        );
      case 1:
        return (
          <div className={containerClasses}>
            <h4 className="font-bold mb-2">Push Notifications</h4>
            <p>Control the push notifications you receive on your devices. Choose the types of alerts you would like to receive directly to your phone or tablet.</p>
            <div className="mt-4">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-accent" />
                <span>Receive marketing notifications</span>
              </label>
              <label className="flex items-center space-x-3 mt-3">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-accent" />
                <span>Receive transactional notifications</span>
              </label>
            </div>
          </div>
        );
      case 2:
        return (
          <div className={containerClasses}>
            <h4 className="font-bold mb-2">SMS Notifications</h4>
            <p>Choose your SMS notification preferences. You can select whether you want to receive text messages for account activities, promotions, and more.</p>
            <div className="mt-4">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-accent" />
                <span>Receive promotional messages</span>
              </label>
              <label className="flex items-center space-x-3 mt-3">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-accent" />
                <span>Receive account activity alerts</span>
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  if (openIndexMain === 2) {
    switch (openIndex) {
      case 0:
        return (
          <div className={containerClasses}>
            <h4 className="font-bold mb-2">Change Password</h4>
            <p>Ensure your account is secure by regularly updating your password.</p>
            <div className="mt-4 flex flex-col items-center">
              <input
                  type="password"
                  placeholder="Current Password"
                  className={`w-full dark:bg-light-background border mb-3 input-placeholder bg-light-background  rounded-lg px-4 py-3 text-light-text dark:text-light-text placeholder-gray-400 focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-0`}
              />               
               <input
                  type="password"
                  placeholder="New Password"
                  className={`w-full dark:bg-light-background border mb-3 input-placeholder  bg-light-background  rounded-lg px-4 py-3 text-light-text dark:text-light-text placeholder-gray-400 focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-0`}
              />    
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className={`w-full dark:bg-light-background border mb-3 input-placeholder  bg-light-background  rounded-lg px-4 py-3 text-light-text dark:text-light-text placeholder-gray-400 focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-0`}
              />    
                <button className="w-full bg-light-primary text-white px-4 py-3 rounded-md hover:bg-accent hover:text-light-text dark:hover:text-light-text font-satisfy transition duration-300 dark:hover:bg-dark-accent hover:bg-light-accent">Update Password</button>
        
                </div>
          </div>
        );
      case 1:
        return (
          <div className={containerClasses}>
            <h4 className="font-bold mb-2">Update Email</h4>
            <p>Change your primary email address for account-related communications.</p>
            <div className="mt-4">
              <input
                  type="email"
                  placeholder="Email"
                  className={`w-full dark:bg-light-background border mb-3 input-placeholder  bg-light-background  rounded-lg px-4 py-3 text-light-text dark:text-light-text placeholder-gray-400 focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-0`}
              />              
                <button className="w-full bg-light-primary text-white px-4 py-3 rounded-md hover:bg-accent hover:text-light-text dark:hover:text-light-text font-satisfy transition duration-300 dark:hover:bg-dark-accent hover:bg-light-accent">Update Email</button>
            </div>
          </div>
        );
      case 2:
        return (
          <div className={containerClasses}>
            <h4 className="font-bold mb-2">Two-Factor Authentication</h4>
            <p>Add an extra layer of security to your account by enabling two-factor authentication.</p>
            <div className="mt-4">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-accent" />
                <span>Enable Two-Factor Authentication</span>
              </label>
              <p className="mt-3 text-sm text-gray-500">You will need to use a code sent to your phone to log in.</p>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  if (openIndexMain === 3) {
    switch (openIndex) {
      case 0:
        return (
          <div className={containerClasses}>
            <h4 className="font-bold mb-2">Profile Visibility</h4>
            <p>Control who can see your profile and personal information.</p>
            <div className="mt-4">
              <label className="flex items-center space-x-3">
                <input type="radio" name="profile_visibility" className="form-radio h-5 w-5 text-accent" />
                <span>Public</span>
              </label>
              <label className="flex items-center space-x-3 mt-3">
                <input type="radio" name="profile_visibility" className="form-radio h-5 w-5 text-accent" />
                <span>Friends Only</span>
              </label>
              <label className="flex items-center space-x-3 mt-3">
                <input type="radio" name="profile_visibility" className="form-radio h-5 w-5 text-accent" />
                <span>Private</span>
              </label>
            </div>
          </div>
        );
      case 1:
        return (
          <div className={containerClasses}>
            <h4 className="font-bold mb-2">Data Sharing</h4>
            <p>Manage how your data is shared with third parties and partners.</p>
            <div className="mt-4">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-accent" />
                <span>Share data for personalized ads</span>
              </label>
              <label className="flex items-center space-x-3 mt-3">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-accent" />
                <span>Share data with partners</span>
              </label>
            </div>
          </div>
        );
      case 2:
        return (
          <div className={containerClasses}>
            <h4 className="font-bold mb-2">Location Settings</h4>
            <p>Choose when and how your location is shared with apps and services.</p>
            <div className="mt-4">
              <label className="flex items-center space-x-3">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-accent" />
                <span>Share location with apps</span>
              </label>
              <label className="flex items-center space-x-3 mt-3">
                <input type="checkbox" className="form-checkbox h-5 w-5 text-accent" />
                <span>Enable location history</span>
              </label>
            </div>
          </div>
        );
      default:
        return null;
    }
  }

  return null;
};



export default Settings;
