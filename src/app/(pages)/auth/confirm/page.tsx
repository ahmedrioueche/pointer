"use client";
import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { FaSun, FaMoon, FaSpinner } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import CustomSelect from '@/app/components/CustomSelect';
import { apiInsertDB } from '@/lib/dbHelper';
import { useSession } from 'next-auth/react';
import Loading from '@/app/components/Loading';
import { apiUpdateParent } from '@/lib/apiHelper';

interface Child {
    name: string;
    age: string;
    gender: string;
    parentId: Number | null;
    hasDevice: string; 
    usesSharedDevice: string;
}

const Confirm: React.FC = () => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [parentId, setParentId] = useState<Number | null>(0);
    const [childrenCount, setChildrenCount] = useState('');
    const [children, setChildren] = useState<Child[]>([]);
    const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [resStatus, setStatus] = useState<{ success: boolean; message: string } | null>(null);
    const [age, setAge] = useState('');
    const [gender, setGender] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    
    const toggleTheme = () => {
        const newTheme = !isDarkMode ? 'dark' : 'light';
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark', !isDarkMode);
        localStorage.setItem('theme', newTheme);
    };

    useEffect(()=> {
        if (typeof window !== 'undefined') {
            const parentIdString = sessionStorage.getItem("parentId");
            console.log("parentIdString", parentIdString);
            const parentId = parentIdString ? parseInt(parentIdString, 10) : null;
            setParentId(parentId);
        }
    })

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

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
        // Validate parent status and children details if applicable
        if (!childrenCount || isNaN(Number(childrenCount)) || Number(childrenCount) <= 0) {
            currentErrors.childrenCount = 'Please enter a valid number of children.';
        } else {
            children.forEach((child, index) => {
                if (!child.name) currentErrors[`childName${index}`] = `Please enter name for the child.`;
                const childAgeNum = Number(child.age);
                if (!child.age || isNaN(childAgeNum) || childAgeNum <= 0) {
                    currentErrors[`childAge${index}`] = `Please enter a valid age for the child.`;
                }
                if (!child.gender) currentErrors[`childGender${index}`] = `Please select a gender for the child.`;

                if (!child.hasDevice) currentErrors[`childHasDevice${index}`] = `Please select if ${child.name || `Child ${index + 1}`} is allowed a separate device.`;
                if (child.hasDevice === 'no' && !child.usesSharedDevice) {
                    currentErrors[`childUsesSharedDevice${index}`] = `Please select if ${child.name || `Child ${index + 1}`} uses a shared device with you.`;
                }
            });
        }

        if (Object.keys(currentErrors).length > 0) {
            setErrors(currentErrors);
        } else {
            for (const child of children) {

                const childData: Child = {
                    name: child.name,
                    age: child.age,
                    gender: child.gender,
                    parentId: parentId,
                    hasDevice: child.hasDevice,
                    usesSharedDevice: child.usesSharedDevice,
                };

                //function to insert child in db 
                const result = await apiInsertDB(childData, "", '/api/auth/confirm');
                //TODO: handle response
           }

            const parentData = {
                age: age,
                gender: gender,
                children_count: childrenCount,
            }

           try{
                const result = await apiUpdateParent(parentId, parentData);
                
                if (result?.status === 200) {

                    router.push('/auth/plans');
                }
                else {  
                    setStatus({ success: false, message: 'Ops! An error occured!' });
                }

           }
           catch(error){
             console.log("Failed updating parent data:", error)
           }
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

    return (
        <>
            {session? (
                <section className={`py-16 flex items-center justify-center min-h-screen dark:bg-dark-background bg-light-background`}>
                <div className="container mx-auto flex flex-col items-center">
                    <div className="relative md:w-1/2 flex flex-col items-center bg-white dark:bg-dark-background rounded-lg shadow-lg p-8 font-stix">
                        <button
                            onClick={toggleTheme}
                            className="absolute top-4 right-4 text-xl p-2 rounded-md bg-light-background dark:bg-dark-background focus:outline-none hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
                        >
                            {isDarkMode ? <FaSun className="text-dark-text" /> : <FaMoon className="text-light-text" />}
                        </button>
                        <h2 className={`text-3xl sm:text-3xl md:text-4xl font-bold font-satisfy mb-8 text-center
                            ${isDarkMode ? 
                                'bg-gradient-to-r from-dark-primary to-dark-accent text-transparent bg-clip-text' 
                                : 
                                'bg-gradient-to-r from-light-primary to-light-accent text-transparent bg-clip-text'}
                            leading-snug
                        `}>
                            Confirm Your Details
                        </h2>
                        
                        <div className="w-full flex justify-center">
                            <form onSubmit={handleSubmit} className="w-full space-y-4 max-w-lg min-w-[21rem]">
                            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                
                                </div>
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

                                        <div className="space-y-2">
                                            <p className={`mt-4 text-base font-stix dark:text-dark-text text-light-text`}>
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
                                        { 
                                            (index !== (parseInt(childrenCount, 10) - 1)) && 
                                            <div className="my-8 border-t border-gray-300 dark:border-gray-600"></div>
                                        }
                                    </div>
                
                                ))}
                                    </div>
                                    {resStatus && (
                                    <div className="flex justify-center w-full mt-4">
                                        <p className={`text-center ${resStatus.success ? 'text-light-primary dark:text-dark-primary' : 'text-red-400'}`}>{resStatus.message}</p>
                                    </div>
                                    )}
                                <button
                                    type="submit"
                                    className={`w-full px-6 py-3 rounded-md font-medium transition-colors duration-100 bg-light-primary
                                            dark:bg-dark-primary text-dark-text hover:bg-gradient-to-r hover:from-dark-primary hover:to-dark-accent`}
                                >
                                {isLoading ? (
                                    <FaSpinner className="animate-spin text-white" />
                                    ) : (
                                    "Confirm Details"
                                    )}                   
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
            ): 
            <Loading/>
            }
        </>
    );
};

export default Confirm;