import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

interface PricingCardProps {
    title: string;
    price: string;
    description: string;
    features: string[];
    onClick: () => void; 
}
  
  export const PricingCard: React.FC<PricingCardProps> = ({ title, price, description, features, onClick }) => {
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  
    useEffect(() => {
      const savedTheme = localStorage.getItem('theme');
      setIsDarkMode(savedTheme === 'dark');
    }, []);
  
    return (
      <div id="pricing" className={`flex flex-col p-6 bg-dark-background dark:bg-light-background rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg h-[430px]`}>
        <div className="flex flex-col flex-grow justify-between">
          <div className="flex flex-col items-center">
            <h3 className={`text-xl font-semibold mb-4 font-stix text-dark-text dark:text-light-text`}>
              {title}
            </h3>
            <p className={`text-4xl font-bold mb-4 font-stix text-dark-text dark:text-light-text`}>
              {price}
            </p>
          </div>
          <p className={`text-lg mb-6 text-light-secondary font-stix dark:text-dark-secondary text-center`}>
            {description}
          </p>
          <ul className="list-disc list-inside text-left mb-6">
            {features.map((feature, index) => (
              <li key={index} className={`flex items-center font-stix text-dark-text dark:text-light-text mb-2`}>
                <FaCheckCircle className={`mr-2 ${isDarkMode ? 'text-dark-primary' : 'text-light-primary'}`} />
                {feature}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-center mt-auto">
            <button className={`px-6 py-3 rounded-md font-stix dark:bg-dark-primary dark:text-dark-text dark:hover:bg-dark-accent bg-light-primary text-dark-text hover:bg-light-accent font-medium transition-colors duration-300`}
                    onClick={onClick}
            >
              Choose Plan
            </button>
        </div>
      </div>
    );
  };



  