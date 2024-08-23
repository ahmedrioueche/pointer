import React, { MouseEventHandler } from 'react';
import { FaSpinner } from 'react-icons/fa';

interface LoadingButtonProps {
  isLoading?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  buttonText: string;
  type?: 'button' | 'submit' | 'reset';
  icon?: React.ElementType;
  className?: string;
}

const LoadingButton: React.FC<LoadingButtonProps> = ({
  isLoading,
  onClick,
  buttonText,
  type = 'button',
  icon: Icon,
  className,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isLoading}
      className={`w-full h-12 px-6 py-3 rounded-md font-medium text-white flex items-center justify-center gap-2 transition-colors duration-100 hover:bg-gradient-to-r hover:from-dark-primary hover:to-dark-accent
                  ${isLoading ? 'bg-gradient-to-r from-dark-primary to-dark-accent cursor-not-allowed' : 'bg-light-primary dark:bg-dark-primary'} ${className}`}
    >
      {isLoading ? (
        <FaSpinner className="animate-spin text-white" />
      ) : (
        <>
          {Icon && <Icon className="text-white" />}
          {buttonText}
        </>
      )}
    </button>
  );
};

export default LoadingButton;
