import React, { useEffect, useState } from 'react';
import { FaClipboardList, FaTimes, FaCalendarDay, FaDollarSign } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

interface PlansModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlansModal: React.FC<PlansModalProps> = ({ isOpen, onClose }) => {
  const [showPlans, setShowPlans] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(864000); // Example value: 10 days in seconds

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeRemaining((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  };

  const handleUpgradeClick = () => {
    setShowPlans(true);
  };

  const handleBackClick = () => {
    setShowPlans(false);
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 transition-transform duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-[90vw] max-h-[95vh] overflow-y-auto task-menu">
        <div className="flex justify-between items-center mb-4 p-4">
          <div className="flex items-center text-light-text dark:text-dark-text">
            <FaClipboardList className="text-3xl mr-3" />
            <h2 className="text-xl font-stix">Plans</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-gray-700"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <AnimatePresence initial={false}>
          {!showPlans ? (
            <motion.div
              key="days-remaining"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex items-center justify-center h-full p-4"
            >
              <div className="bg-light-background dark:bg-gray-700 rounded-lg shadow-md p-8 flex flex-col items-center space-y-4 text-center w-full max-w-lg sm:w-full sm:h-full sm:p-6">
                <FaCalendarDay className="text-light-accent dark:text-dark-accent text-6xl mb-4" />
                <h3 className="text-xl font-semibold text-light-text dark:text-dark-text">Free Trial</h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-4">
                  You have {formatTime(timeRemaining)} left in your free trial.
                </p>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                  <p>✓ Full access to all premium features</p>
                  <p>✓ Unlimited project creation</p>
                  <p>✓ Priority support</p>
                </div>
                <button
                  onClick={handleUpgradeClick}
                  className="px-8 py-3 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white font-bold rounded-full transition-colors duration-300 text-lg"
                >
                  Upgrade Now!
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="plans"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%', opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex flex-col items-center justify-center h-full p-4 sm:p-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                {/* Monthly Plan Card */}
                <div className="bg-light-background dark:bg-gray-700 rounded-lg shadow-md p-6 flex flex-col items-start justify-between hover:shadow-lg transition-shadow duration-300 sm:p-8 h-full">
                  <div className="flex items-center space-x-4">
                    <FaDollarSign className="text-light-accent dark:text-dark-accent text-4xl" />
                    <div>
                      <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Monthly Plan</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">$19 per month</p>
                    </div>
                  </div>
                  <div className="mt-4 text-gray-600 dark:text-gray-300">
                    <p>✓ Access to all features</p>
                    <p>✓ Unlimited project creation</p>
                    <p>✓ Priority support</p>
                    <p>✓ Cancel anytime</p>
                  </div>
                  <button
                    className="mt-4 px-4 py-2 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white font-bold rounded-full transition-colors duration-300"
                  >
                    Choose Monthly
                  </button>
                </div>

                {/* Yearly Plan Card */}
                <div className="bg-light-background dark:bg-gray-700 rounded-lg shadow-md p-6 flex flex-col items-start justify-between hover:shadow-lg transition-shadow duration-300 sm:p-8 h-full">
                  <div className="flex items-center space-x-4">
                    <FaDollarSign className="text-light-accent dark:text-dark-accent text-4xl" />
                    <div>
                      <h3 className="text-lg font-semibold text-light-text dark:text-dark-text">Yearly Plan</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300">$199 per year</p>
                    </div>
                  </div>
                  <div className="mt-4 text-gray-600 dark:text-gray-300">
                    <p>✓ Access to all features</p>
                    <p>✓ Unlimited project creation</p>
                    <p>✓ Priority support</p>
                    <p>✓ Save $29 compared to monthly plan</p>
                    <p>✓ Cancel anytime</p>
                  </div>
                  <button
                    className="mt-4 px-4 py-2 bg-light-accent hover:bg-light-accent-hover dark:bg-dark-accent dark:hover:bg-dark-accent-hover text-white font-bold rounded-full transition-colors duration-300"
                  >
                    Choose Yearly
                  </button>
                </div>
              </div>

              <button
                onClick={handleBackClick}
                className="mt-8 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded-full transition-colors duration-300"
              >
                Back
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default PlansModal;
