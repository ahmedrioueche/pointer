import React, { useEffect, useState } from 'react';
import { FaClipboardList, FaTimes, FaCalendarDay, FaDollarSign, FaCheck, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { pricingOptions } from '@/data/text'; 

interface PlansModalProps {
  remainingMilliseconds: any;
  parentData: any;
  isOpen: boolean;
  onClose: () => void;
}

const PlansModal: React.FC<PlansModalProps> = ({ parentData, remainingMilliseconds, isOpen, onClose }) => {
  const [showPlans, setShowPlans] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isLoading, setIsLoading] = useState<string | null>(null); // New loading state
  const router = useRouter();

  useEffect(() => {
    setTimeRemaining(remainingMilliseconds / 1000);
  }, [remainingMilliseconds]);

  useEffect(() => {
    const countdown = setInterval(() => {
      setTimeRemaining((prevTime: any) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(countdown);
  }, []);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return `${days}d ${hours}h ${minutes}m ${secs}s`;
  };

  const handleUpgradeClick = () => {
    setShowPlans(true);
  };

  const handleBackClick = () => {
    setShowPlans(false);
  };

  const handlePlanClick = (type: string, amount: string) => {
    setIsLoading(type);
    router.push(`/payment/stripe?plan=${type}&amount=${amount}`);
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 transition-transform duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}
    >
      <div className="relative bg-white bg-gradient-to-r from-blue-600 to-blue-300 rounded-lg shadow-lg py-3 w-full max-w-[90vw] max-h-[95vh] overflow-y-auto task-menu">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center text-white">
            <FaClipboardList className="text-4xl mr-3 " />
            <h2 className="text-2xl font-extrabold text-gradient mt-2">Plans</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-light-text hover:text-dark-text"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <AnimatePresence>
          {!showPlans ? (
            <motion.div
              key="days-remaining"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex items-center justify-center h-full p-4"
            >
              <div className="bg-gradient-to-r from-blue-500 to-blue-300 rounded-lg shadow-lg p-8 flex flex-col items-center space-y-4 text-center w-full max-w-lg sm:w-full sm:h-full sm:p-6">
                <FaCalendarDay className="text-white text-7xl mb-4" />
                <h3 className="text-2xl font-semibold text-white">Free Trial</h3>
                <p className="text-xl text-white mb-4">
                  You have {formatTime(timeRemaining)} left in your free trial.
                </p>
                <div className="text-lg text-white mb-6 space-y-2">
                  {pricingOptions[0].features.map((feature: any, index: any) => (
                    <p key={index} className="flex items-center">
                          <FaCheck className="mr-2 text-dark-text" /> {feature}
                    </p>
                  ))}
                </div>
                <button
                  onClick={handleUpgradeClick}
                  className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors duration-300 text-lg"
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
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex flex-col items-center justify-center h-full p-4 sm:p-6"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
                {pricingOptions.slice(1).map((plan: any, index: any) => (
                  <div
                    key={index}
                    className="bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-lg shadow-lg p-6 flex flex-col items-start justify-between hover:shadow-2xl transition-shadow duration-300 sm:p-8 h-full"
                  >
                    <div className="flex items-center space-x-4">
                      <FaDollarSign className="text-yellow-700 text-5xl" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{plan.title} Plan</h3>
                        <p className="text-sm text-gray-700">{plan.price}</p>
                      </div>
                    </div>
                    <div className="mt-4 text-gray-700 space-y-2">
                      {plan.features.map((feature: any, index: number) => (
                        <p key={index} className="flex items-center">
                          <FaCheck className="mr-2 text-yellow-700" /> {feature}
                        </p>
                      ))}
                    </div>
                    <button
                      className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-full transition-colors duration-300"
                      onClick={() => handlePlanClick(plan.title.toLowerCase(), plan.price)}
                    >
                      { isLoading === plan.title.toLowerCase() ? <FaSpinner className='animate-s'/> : `Choose ${plan.title}`}
                    </button>
                  </div>
                ))}
              </div>

              <button
                onClick={handleBackClick}
                className="px-8 py-3 mt-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-colors duration-300 text-lg"
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
