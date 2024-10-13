import React, { useState } from 'react';
import { FaClipboardList, FaTimes, FaDollarSign, FaCalendarDay, FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { payments } from '@/data/values';

interface PayModalProps {
  isOpen: boolean;
}

const PayModal: React.FC<PayModalProps> = ({ isOpen }) => {
  const [showPlans, setShowPlans] = useState(false);
  const [isMonthlyLoading, setIsMonthlyLoading] = useState(false);
  const [isYearlyLoading, setIsYearlyLoading] = useState(false);

  const router = useRouter();

  const handleUpgradeClick = () => {
    setShowPlans(true);
  };

  const handlePlanClick = (type: string) => {
    if(type === "monthly"){
      setIsMonthlyLoading(true);
    }
    else  
    setIsMonthlyLoading(true);

    const amount = type === 'monthly' ? payments.monthlyPlanPaymentInDollars : payments.yearlyPlanPaymentInDollars;
    router.push(`/payment/stripe?plan=${type}&amount=${amount}`);
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 transition-transform duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}
    >
      <div className="relative bg-white bg-gradient-to-r from-red-600 to-red-300 rounded-lg shadow-lg py-4 w-full max-w-[90vw] max-h-[95vh] overflow-y-auto task-menu">
        <div className="flex justify-between items-center p-4">
          <div className="flex items-center text-white">
            <FaClipboardList className="text-4xl mr-3" />
            <h2 className="text-2xl font-extrabold text-gradient mt-2">Subscription Required</h2>
          </div>
       
        </div>

        <AnimatePresence>
          {!showPlans ? (
            <motion.div
              key="trial-ended"
              initial={{ x: '100%' }}  // Enter from right
              animate={{ x: 0 }}
              exit={{ x: '-100%' }} // Exit to left
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="flex items-center justify-center h-full p-4"
            >
              <div className="bg-gradient-to-r from-red-500 to-red-300 rounded-lg shadow-lg p-8 flex flex-col items-center space-y-4 text-center w-full max-w-lg">
                <FaCalendarDay className="text-white text-7xl mb-4" />
                <h3 className="text-2xl font-semibold text-white">Free Trial Ended</h3>
                <p className="text-xl text-white mb-4">
                  Your free trial has ended. Please choose a plan to continue enjoying our app.
                </p>
                <button
                  onClick={handleUpgradeClick}
                  className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-colors duration-300 text-lg"
                >
                  Choose a Plan
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
              className="flex flex-col items-center justify-center h-full p-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full">
                {/* Monthly Plan Card */}
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-lg shadow-lg p-6 flex flex-col items-start justify-between hover:shadow-2xl transition-shadow duration-300 sm:p-8 h-full">
                  <div className="flex items-center space-x-4">
                    <FaDollarSign className="text-yellow-700 text-5xl" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Monthly Plan</h3>
                      <p className="text-sm text-gray-700">$19 per month</p>
                    </div>
                  </div>
                  <div className="mt-4 text-gray-700">
                    <p>✓ Full access to all features</p>
                    <p>✓ Track multiple children’s progress</p>
                    <p>✓ Access to premium educational content</p>
                    <p>✓ Flexible monthly billing</p>
                  </div>
                  <button
                    className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-full transition-colors duration-300"
                    onClick={() => handlePlanClick("monthly")}
                  >
                     {isMonthlyLoading ? <FaSpinner className="animate-spin text" /> : "Choose Monthly"}

                  </button>
                </div>

                {/* Yearly Plan Card */}
                <div className="bg-gradient-to-r from-yellow-400 to-yellow-300 rounded-lg shadow-lg p-6 flex flex-col items-start justify-between hover:shadow-2xl transition-shadow duration-300 sm:p-8 h-full">
                  <div className="flex items-center space-x-4">
                    <FaDollarSign className="text-yellow-700 text-5xl" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Yearly Plan</h3>
                      <p className="text-sm text-gray-700">$199 per year</p>
                    </div>
                  </div>
                  <div className="mt-4 text-gray-700">
                    <p>✓ Full access to all features</p>
                    <p>✓ Save on annual billing</p>
                    <p>✓ Additional rewards and incentives for long-term use</p>
                    <p>✓ Priority support</p>
                  </div>
                  <button
                    className="mt-4 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold rounded-full transition-colors duration-300"
                    onClick={() => handlePlanClick("yearly")}
                  >
                     {isYearlyLoading ? <FaSpinner className="animate-spin text" /> : "Choose Yearly"}
                  
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowPlans(false)}
                className="px-8 py-3 mt-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-colors duration-300 text-lg"
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

export default PayModal;
