import { useEffect, useState } from "react";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

interface PricingCardProps {
  title: string;
  price: any;
  duration: string;
  description: string;
  features: string[];
  onClick: () => void;
  isLoading?: boolean;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  title,
  price,
  duration,
  description,
  features,
  onClick,
  isLoading,
}) => {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);

  // Control animation for entrance
  const controls = useAnimation();
  const { ref, inView } = useInView({
    threshold: 0.1, // Trigger when 10% of the card is visible
  });

  useEffect(() => {
    if (inView) {
      // Reset animation each time in view
      controls.start("visible");
    } else {
      // Reset to initial state when out of view
      controls.start("hidden");
    }
  }, [inView, controls]);

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },  // Starting hidden state (slightly below and transparent)
    visible: {
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.8, ease: "easeOut" }, // Smooth transition to visible
    },
  };

  return (
    <motion.div
      ref={ref}
      variants={cardVariants} // Add animation variants
      initial="hidden" // Initial state when out of view
      animate={controls} // Animate based on scroll into view
      whileHover={{ scale: 1.05, transition: { type: "spring", stiffness: 300 } }} // Hover effect remains the same
      className={`flex flex-col p-6 bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-800 dark:to-purple-800 rounded-lg shadow-md transition-transform h-[450px]`}
    >
      <div className="flex flex-col flex-grow justify-between">
        <div className="flex flex-col items-center">
          <h3 className={`text-xl font-semibold mb-4 font-stix text-white`}>
            {title}
          </h3>
          <p className={`text-4xl font-bold mb-1 font-stix text-white`}>
            {price}
          </p>
          <p className={`text-xl mb-4 font-stix text-gray-200`}>
            {duration}
          </p>
        </div>
        <p className={`text-lg mb-6 text-gray-100 font-stix text-center`}>
          {description}
        </p>
        <ul className="list-disc list-inside text-left mb-6">
          {features.map((feature, index) => (
            <li
              key={index}
              className={`flex items-center font-stix text-white mb-2`}
            >
              <FaCheckCircle className="mr-2 text-yellow-300" />
              {feature}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-center">
        <button
          className={`px-6 py-3 rounded-md font-stix bg-yellow-500 text-white hover:bg-yellow-600 font-medium transition-colors duration-300 relative flex items-center justify-center`}
          onClick={onClick}
          disabled={isLoading} // Disable button while loading
        >
          {isLoading ? (
            <FaSpinner className="animate-spin text-white" /> // Show spinner if loading
          ) : (
            "Choose Plan"
          )}
        </button>
      </div>
    </motion.div>
  );
};
