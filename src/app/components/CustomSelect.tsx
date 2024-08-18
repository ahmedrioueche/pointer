import React, { useState } from 'react';

const CustomSelect: React.FC<{ value: string; onChange: (value: string) => void }> = ({ value, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const options = [
        { value: 'male', label: 'Male' },
        { value: 'female', label: 'Female' }
    ];

    const handleSelect = (value: string) => {
        onChange(value);
        setIsOpen(false);
    };

    return (
        <div className="relative w-full">
            <div
                className={`w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                rounded-lg px-6 py-4 text-light-text dark:text-dark-text cursor-pointer 
                hover:bg-light-primary dark:hover:bg-dark-primary hover:text-dark-text transition-colors duration-200`}
                onClick={() => setIsOpen(!isOpen)}
            >
                {value ? options.find(option => option.value === value)?.label : 'Select Gender'}
            </div>
            {isOpen && (
                <div className="absolute w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                rounded-lg mt-1 z-10">
                    {options.map(option => (
                        <div
                            key={option.value}
                            onClick={() => handleSelect(option.value)}
                            className={`px-6 py-2 cursor-pointer text-light-text dark:text-dark-text hover:text-dark-text
                            hover:bg-light-primary dark:hover:bg-dark-primary transition-colors duration-200 
                            ${option.value === value ? 'bg-light-primary dark:bg-dark-primary' : ''}`}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomSelect;
