"use client";
import React, { useState, ChangeEvent, FormEvent } from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import CustomSelect from '@/app/components/CustomSelect';

const Confirm: React.FC = () => {
    const router = useRouter();

    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [isParent, setIsParent] = useState<string | null>(null);
    const [childrenCount, setChildrenCount] = useState('');
    const [children, setChildren] = useState<{ 
        name: string; 
        age: string; 
        gender: string; 
        hasDevice: string; 
        usesSharedDevice: string; 
    }[]>([]);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

    const toggleTheme = () => {
        const newTheme = !isDarkMode ? 'dark' : 'light';
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark', !isDarkMode);
        localStorage.setItem('theme', newTheme);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const currentErrors: { [key: string]: string } = {};

        // Validate age
        const ageNum = Number(age);
        if (!age || isNaN(ageNum) || ageNum < 12 || ageNum > 120) {
            currentErrors.age = 'Please enter a valid age';
        }

        // Validate gender
        if (!gender) {
            currentErrors.gender = 'Please select a gender.';
        }

        // Validate parent status
        if (!isParent) {
            currentErrors.isParent = 'Please select whether you are a parent or not.';
        }

        // Validate parent status and children details if applicable
        if (isParent === 'yes') {
            if (!childrenCount || isNaN(Number(childrenCount)) || Number(childrenCount) <= 0) {
                currentErrors.childrenCount = 'Please enter a valid number of children.';
            } else {
                children.forEach((child, index) => {
                    if (!child.name) currentErrors[`childName${index}`] = `Please enter name for the child.`;
                    const childAgeNum = Number(child.age);
                    if (!child.age || isNaN(childAgeNum) || childAgeNum <= 0 || childAgeNum >= ageNum) {
                        currentErrors[`childAge${index}`] = `Please enter a valid age for the child.`;
                    }
                    if (!child.gender) currentErrors[`childGender${index}`] = `Please select a gender for the child.`;
                });
            }
        }

        if (Object.keys(currentErrors).length > 0) {
            setErrors(currentErrors);
        } else {
            const userDetails = {
                age,
                gender,
                isParent,
                children: isParent === 'yes' ? children : [],
            };
            localStorage.setItem('userDetails', JSON.stringify(userDetails));

            const userData = getUserData()
            console.log("userData", userData);

        }
    };

    const handleChildrenCountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const count = parseInt(e.target.value, 10);
        setChildrenCount(e.target.value);
        if (!isNaN(count) && count > 0) {
            setChildren(Array(count).fill({ name: '', age: '', gender: '' }));
        } else {
            setChildren([]);
        }
    };

    const handleChildChange = (index: number, field: 'name' | 'age' | 'gender' | 'hasDevice' | 'usesSharedDevice', value: string) => {
        const updatedChildren = [...children];
        updatedChildren[index] = { ...updatedChildren[index], [field]: value };
        setChildren(updatedChildren);
    };    

    const getUserData = () => {
        // Retrieve and parse signup credentials from session storage
        const signupCredentials = sessionStorage.getItem("signupCredentials");
        const parsedCredentials = signupCredentials ? JSON.parse(signupCredentials) : {};
    
        // Extract the individual fields from the parsed credentials
        const { firstName = '', lastName = '', email = '', password = '' } = parsedCredentials;
    
        // Structure the user data including extracted credentials and form inputs
        const userData = {
            firstName,
            lastName,
            email,
            password,
            age: age,
            gender: gender,
            isParent: isParent,
            childrenCount: childrenCount,
            children: isParent === 'yes' ? children : [],
        };
    
        return userData;
    };
    

    return (
        <section className={`py-16 flex items-center justify-center min-h-screen dark:bg-dark-background bg-light-background`}>
            <div className="container mx-auto flex flex-col items-center">
                <div className="relative md:w-1/2 flex flex-col items-center bg-white dark:bg-dark-background rounded-lg shadow-lg p-8 font-stix">
                    <button
                        onClick={toggleTheme}
                        className="absolute top-4 right-4 text-xl p-2 rounded-md bg-light-background dark:bg-dark-background focus:outline-none hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
                    >
                        {isDarkMode ? <FaSun className="dark:text-dark-text" /> : <FaMoon className="text-light-text" />}
                    </button>
                    <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold font-satisfy mb-8 text-center
                        ${isDarkMode ? 
                            'bg-gradient-to-r from-dark-primary to-dark-accent text-transparent bg-clip-text' 
                            : 
                            'bg-gradient-to-r from-light-primary to-light-accent text-transparent bg-clip-text'}
                        leading-snug
                    `}>
                        Confirm Your Details
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-lg">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <input
                                    type="number"
                                    value={age}
                                    placeholder="Age"
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setAge(e.target.value)}
                                    className={`w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-6 py-4 text-light-text dark:text-dark-text placeholder-gray-400 focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-0 no-spinner`}
                                />
                                {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
                            </div>
                            <div>
                                <CustomSelect value={gender} onChange={(value) => setGender(value)} />
                                {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <p className={`text-lg dark:text-dark-text text-light-text`}>Are you a parent?</p>
                            <div className="flex space-x-4">
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        value="yes"
                                        checked={isParent === 'yes'}
                                        onChange={(e) => setIsParent(e.target.value)}
                                        className="radio-hidden"
                                    />
                                    <div className="radio-custom"></div>
                                    <span className={`dark:text-dark-text text-light-text`}>Yes</span>
                                </label>
                                <label className="flex items-center space-x-2">
                                    <input
                                        type="radio"
                                        value="no"
                                        checked={isParent === 'no'}
                                        onChange={(e) => setIsParent(e.target.value)}
                                        className="radio-hidden"
                                    />
                                    <div className="radio-custom"></div>
                                    <span className={`dark:text-dark-text text-light-text`}>No</span>
                                </label>
                            </div>
                            {errors.isParent && <p className="text-red-500 text-sm mt-1">{errors.isParent}</p>}

                            {isParent === 'yes' && (
                                <>
                                    <div>
                                        <input
                                            type="number"
                                            value={childrenCount}
                                            placeholder="How many children do you have?"
                                            onChange={handleChildrenCountChange}
                                            className={`w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-6 py-4 text-light-text dark:text-dark-text placeholder-gray-400 focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-0 no-spinner`}
                                        />
                                        {errors.childrenCount && <p className="text-red-500 text-sm mt-1">{errors.childrenCount}</p>}
                                    </div>
                                    {children.map((child, index) => (
                                        <div key={index} className="space-y-2">
                                            <div>
                                                <input
                                                    type="text"
                                                    value={child.name}
                                                    placeholder={children.length === 1 ? `Child Name` : `Child ${index + 1} Name`}
                                                    onChange={(e) => handleChildChange(index, 'name', e.target.value)}
                                                    className={`w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-6 py-4 text-light-text dark:text-dark-text placeholder-gray-400 focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-0`}
                                                />
                                                {errors[`childName${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`childName${index}`]}</p>}
                                            </div>
                                            <div>
                                                <input
                                                    type="number"
                                                    value={child.age}
                                                    placeholder={children.length === 1 ? `Child Age` : `Child ${index + 1} Age`}
                                                    onChange={(e) => handleChildChange(index, 'age', e.target.value)}
                                                    className={`w-full bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-6 py-4 text-light-text dark:text-dark-text placeholder-gray-400 focus:outline-none focus:border-light-primary dark:focus:border-dark-primary focus:ring-0 no-spinner`}
                                                />
                                                {errors[`childAge${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`childAge${index}`]}</p>}
                                            </div>
                                            <div>
                                                <CustomSelect value={child.gender} onChange={(value) => handleChildChange(index, 'gender', value)} />
                                                {errors[`childGender${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`childGender${index}`]}</p>}
                                            </div>
                                            <div>
                                            <CustomSelect 
                                                value={child.gender} 
                                                onChange={(value) => handleChildChange(index, 'gender', value)} 
                                            />
                                            {errors[`childGender${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`childGender${index}`]}</p>}
                                        </div>

                                        {/* New field: Is the child allowed a separate internet-connected device? */}
                                        <div className="space-y-2">
                                            <p className={`text-lg dark:text-dark-text text-light-text`}>
                                                Is {child.name || `Child ${index + 1}`} allowed to have a separate internet-connected device?
                                            </p>
                                            <div className="flex space-x-4">
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        value="yes"
                                                        checked={child.hasDevice === 'yes'}
                                                        onChange={(e) => handleChildChange(index, 'hasDevice', e.target.value)}
                                                        className="radio-hidden"
                                                    />
                                                    <div className="radio-custom"></div>
                                                    <span className={`dark:text-dark-text text-light-text`}>Yes</span>
                                                </label>
                                                <label className="flex items-center space-x-2">
                                                    <input
                                                        type="radio"
                                                        value="no"
                                                        checked={child.hasDevice === 'no'}
                                                        onChange={(e) => handleChildChange(index, 'hasDevice', e.target.value)}
                                                        className="radio-hidden"
                                                    />
                                                    <div className="radio-custom"></div>
                                                    <span className={`dark:text-dark-text text-light-text`}>No</span>
                                                </label>
                                            </div>
                                            {errors[`childHasDevice${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`childHasDevice${index}`]}</p>}
                                        </div>

                                            {child.hasDevice === 'no' && (
                                                <div className="space-y-2">
                                                    <p className={`text-lg dark:text-dark-text text-light-text`}>
                                                        Do they use a shared device with you?
                                                    </p>
                                                    <div className="flex space-x-4 mb-10">
                                                        <label className="flex items-center space-x-2">
                                                            <input
                                                                type="radio"
                                                                value="yes"
                                                                checked={child.usesSharedDevice === 'yes'}
                                                                onChange={(e) => handleChildChange(index, 'usesSharedDevice', e.target.value)}
                                                                className="radio-hidden"
                                                            />
                                                            <div className="radio-custom"></div>
                                                            <span className={`dark:text-dark-text text-light-text`}>Yes</span>
                                                        </label>
                                                        <label className="flex items-center space-x-2">
                                                            <input
                                                                type="radio"
                                                                value="no"
                                                                checked={child.usesSharedDevice === 'no'}
                                                                onChange={(e) => handleChildChange(index, 'usesSharedDevice', e.target.value)}
                                                                className="radio-hidden"
                                                            />
                                                            <div className="radio-custom"></div>
                                                            <span className={`dark:text-dark-text text-light-text`}>No</span>
                                                        </label>
                                                    </div>
                                                    {errors[`childUsesSharedDevice${index}`] && <p className="text-red-500 text-sm mt-1">{errors[`childUsesSharedDevice${index}`]}</p>}
                                                </div>
                                            )}
                                            </div>
                                                        ))}
                                                    </>
                                                )}
                                            </div>

                        <button
                            type="submit"
                            className={`w-full px-6 py-3 rounded-md font-medium transition-colors duration-100 bg-light-primary
                                     dark:bg-dark-primary text-dark-text hover:bg-gradient-to-r hover:from-dark-primary hover:to-dark-accent`}
                        >
                            Confirm Details
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default Confirm;