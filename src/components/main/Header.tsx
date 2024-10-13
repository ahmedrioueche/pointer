import { HiX, HiSearch, HiOutlineChevronRight } from 'react-icons/hi';
import { IoMdHand } from 'react-icons/io'; // Importing the hand icon
import { HiOutlineCurrencyDollar, HiOutlineChevronDown } from 'react-icons/hi';
import { FaRegHeart } from 'react-icons/fa';
import { Transition } from '@headlessui/react';
import { motion } from 'framer-motion'; // For animation
import { useEffect, useState, useRef, useCallback } from 'react';
import BudgetModal from './modals/BudgetModal';
import { useData } from '@/app/context/dataContext';
import { apiGetSettingsByParentId, apiPromptGemini } from '@/lib/apiHelper';
import { assertPositive, getCurrencySymbol } from '@/lib/helper';

const Header = ({ user, childData, isBudgetModalOpen}: any) => {
    const [showQuote, setShowQuote] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isSmallScreen, setIsSmallScreen] = useState(false);
    const [showPointsDropDown, setShowPointsDropdown] = useState(false);
    const [showBudgetDropDown, setShowBudgetDropdown] = useState(false);
    const [showBudgetModal, setShowBudgetModal] = useState(false);
    const [budget, setBudget] = useState(0);
    const [currentBudget, setCurrentBudget] = useState(0);
    const [pointsRemaining, setPointsRemaining] = useState(0);
    const [pointsPerCurrency, setPointsPerCurrency] = useState(0);
    const [currencySymbol, setCurrencySymbol] = useState('');
    const [currentChildData, setCurrentChildData] = useState<any>();
    const [quoteOfTheDay, setQuoteOfTheDay] = useState<string>();
    const [quoteSource, setQuoteSource] = useState<string>();
    const [isQuotePrompted, setIsQuotePrompted] = useState(false);
    const [isQuoteExpired, setIsQuoteExpired] = useState(true);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const pointsDropdownRef = useRef<HTMLDivElement>(null);
    const budgetDropDownRef = useRef<HTMLDivElement>(null);

    const childrenContext = useData();
    
    useEffect(() => {
        if(user.type === "child"){
            const childData = childrenContext.children.filter((child:any) => child.id === user.id);
            setCurrentChildData(childData.length > 0? childData[0] : null);
        }
    }, [childrenContext, user.type, user.id])

    useEffect(() => {
        const getSettings = async (userId : number) => {
        const response = await apiGetSettingsByParentId(userId);
        const settings = response.response;
        if(settings){
            setPointsPerCurrency(settings.pointsPerCurrency)

            const symbol = getCurrencySymbol(settings.currency);
            if(symbol)
            setCurrencySymbol(symbol);
        }
        } 

        if(user.type === "child")
            getSettings(user.id);
    }, [user.id, user.type])

    useEffect(() => {
        if(user.type === "child" && currentChildData){
            const budget = currentChildData.budget;
            setBudget(assertPositive(budget));
    
            const currentBudget = currentChildData.currentPoints / pointsPerCurrency;
            setCurrentBudget(assertPositive(currentBudget < budget ? currentBudget : budget));
    
            const pointsRemaining = (budget - currentBudget) * pointsPerCurrency;
            setPointsRemaining(assertPositive(pointsRemaining));
        }
    
    }, [currentChildData, pointsPerCurrency, user.type])


   // useEffect(() => {
   //     const getQuoteOfTheDay = async () => {
   //         let prompt;
   //         if(user.type === "child"){
   //             prompt = `Give a quote or an advice of the day to a child of age ${currentChildData.age}
   //             it should be something wise, educational or funny.
   //             Don't give an introduction or a conclusion, your response should be structered in this way:
   //             -Quote: "quote..."
   //             -Source: "source.." if a source exists.`
   //         }
   //         else {
   //             prompt = `Give a quote or an advice of the day to a grown person,
   //             it should be something wise and educational about raising children if possible, or
   //             something general.
   //             Don't give an introduction or a conclusion, your response should be structered in this way:
   //             -Quote: "quote..."
   //             -Source: "source.." if a source exists.
   //             `
   //         }
   //           
   //         const response = await apiPromptGemini(prompt);
   //         const { quote, source } = extractQuote(response);
   //   
   //         if (quote) {
   //           setQuoteOfTheDay(quote);
   //           setIsQuotePrompted(true);
   //           setIsQuoteExpired(false);
   //         }
   //         if(source){
   //            setQuoteSource(source);
   //         }
   //     }
//
   //     if(!quoteOfTheDay && !isQuotePrompted && isQuoteExpired)
   //         getQuoteOfTheDay();
   // }, [currentChildData, quoteOfTheDay, user.type])
//
   // function extractQuote(response : any) {
   //     // Split the response by lines to get the quote and source parts
   //     const lines = response.split("\n");
   //     
   //     // Extract the quote (assuming it's always in the first line)
   //     const quoteLine = lines.find((line: any)=> line.startsWith("-Quote:"));
   //     
   //     // Extract the source if it exists (assuming it's in the second line)
   //     const sourceLine = lines.find((line: any) => line.startsWith("-Source:"));
   //     
   //     // Remove "-Quote:" and trim whitespace to get the actual quote
   //     const quote = quoteLine ? quoteLine.replace("-Quote:", "").trim() : null;
   //     
   //     // Remove "-Source:" and trim whitespace to get the actual source
   //     const source = sourceLine ? sourceLine.replace("-Source:", "").trim() : null;
   //   
   //     return { quote, source };
   // }
   // 
   // // Load the target time from localStorage or set it to 24 hours from now
   // const getInitialTargetTime = () => {
   //     const savedTime = localStorage.getItem('targetTime');
   //     if (savedTime) {
   //         return new Date(savedTime);
   //     } else {
   //         const now = new Date();
   //         now.setHours(now.getHours() + 24);
   //         localStorage.setItem('targetTime', now.toISOString());
   //         return now;
   //     }
   // };
//
   // const [targetTime, setTargetTime] = useState<Date>(getInitialTargetTime);
   // const [remainingTime, setRemainingTime] = useState<number>(getRemainingTime(targetTime));
//
   // useEffect(() => {
   //     // Check the remaining time when the component mounts and every hour
   //     const updateRemainingTime = () => {
   //         const timeLeft = getRemainingTime(targetTime);
   //         setRemainingTime(timeLeft);
//
   //         if (timeLeft <= 0) {
   //             // When the timer hits 0, do something
   //             console.log("Timer reached 0. Perform an action here!");
   //             setIsQuoteExpired(true);
   //             // Reset the target time for another 24 hours
   //             const now = new Date();
   //             now.setHours(now.getHours() + 24);
   //             setTargetTime(now);
   //             localStorage.setItem('targetTime', now.toISOString());
   //         }
   //     };
//
   //     // Update the remaining time immediately
   //     updateRemainingTime();
//
   //     // Schedule the next update in 1 hour
   //     const timeoutId = setTimeout(updateRemainingTime, 1000 * 60 * 60); // Check every hour
//
   //     // Cleanup on unmount
   //     return () => clearTimeout(timeoutId);
   // }, [targetTime]);
//
    // Helper function to calculate the remaining time in milliseconds
    function getRemainingTime(target: Date) {
        const now = new Date();
        return target.getTime() - now.getTime();
    }
    
    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (!isSmallScreen)
            setShowDropdown(false);
    }, [isSmallScreen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
            if (pointsDropdownRef.current && !pointsDropdownRef.current.contains(event.target as Node)) {
                setShowPointsDropdown(false);
            }
            if (budgetDropDownRef.current && !budgetDropDownRef.current.contains(event.target as Node)) {
                setShowBudgetDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleShowSearch = () => {
        if (window.innerWidth > 768)
            setShowQuote(prev => !prev);
        else
            setShowDropdown(prev => !prev);
    }

    const handleBudgetClick = () => {
        if(user.type === "child")
            setShowBudgetDropdown(prev => !prev);

        else
            setShowBudgetModal(true);
    }

    useEffect(() => {
        if(isBudgetModalOpen)
            setShowBudgetModal(true);
    }, [isBudgetModalOpen])

    return (
        <div className="relative flex items-center justify-between p-4 text-white">
            <div className="relative flex items-center justify-center space-x-4 md:mr-6 cursor-pointer group">
                {!isSmallScreen && (
                 <div
                    className="flex items-center px-1 py-3 bg-light-primary dark:bg-dark-primary text-dark-text hover:text-dark-text font-medium hover:bg-light-accent dark:hover:bg-dark-accent rounded-full shadow-md hover:shadow-xl transition-shadow duration-300"
                    onClick={() => handleShowSearch()}
                    >
                    <motion.div
                        className="flex items-center"
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 1, repeat: Infinity, repeatType: 'loop' }}
                    >
                        <IoMdHand className={`text-xl text-yellow-300 ml-1 ${!isSmallScreen? "mr-3" : ''}`} />
                    </motion.div>
                    <span className={`md:inline sm:text-sm text-sm font-semibold`}>{'Hi, ' + user.name.split(/[\s.]+/)[0]}</span>


                    {isSmallScreen ? (
                        <HiOutlineChevronDown className="ml-2 text-base" />
                    ) : (
                        <HiOutlineChevronRight className="ml-2 text-vase" />
                    )}
                    </div>
                )}
              

                {showDropdown && (
                    <div 
                        ref={dropdownRef} 
                        className="absolute right-0 top-full mt-2 w-60 bg-light-background  dark:bg-dark-background border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50"
                    > <ul className="py-2">
                        {user.type === "child" && (
                            <div>
                            <li
                                className="flex items-center px-4 py-2 text-dark-text dark:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent  hover:text-gray-800 cursor-pointer transition-colors duration-200"
                                onClick={() => {
                                    setShowPointsDropdown(false);
                                }}
                            >
                                <FaRegHeart className="text-pink-600 mr-2" />
                                Points Earned: {childData?.currentPoints? childData?.currentPoints : null}
                            </li>
                            <li
                                className="flex items-center px-4 py-2 text-light-text dark:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent  hover:text-gray-800 cursor-pointer transition-colors duration-200"
                                onClick={() => {
                                    setShowBudgetDropdown(false);
                                }}
                            >
                                <HiOutlineCurrencyDollar className="text-green-600 mr-2" />
                                Your Budget
                            </li>
                            </div>
                        )}
                       
                            <li
                                className="flex items-center px-4 py-2  text-light-text dark:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent  hover:text-gray-800 cursor-pointer transition-colors duration-200"
                                onClick={() => {
                                    handleShowSearch();
                                    setShowDropdown(false);
                                }}
                            >
                                <HiSearch className="text-blue-600 mr-2" />
                                Look for Something
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            {/* Budget Button (center) */}
            <div className="relative items-center space-x-4 mr-6 hidden md:flex">
                <button
                    className="flex items-center justify-center px-6 py-2 bg-green-600 text-white text-lg font-medium hover:bg-green-700 transition-all duration-300 rounded-lg shadow-md"
                    onClick={() => handleBudgetClick()}
                >
                    <HiOutlineCurrencyDollar className="text-2xl mr-2 md-mr-0" />
                    {!isSmallScreen && (
                        <span className="hidden text-sm md:inline mr-1">Budget</span>
                    )}
                    {user.type === "child" && (
                        <HiOutlineChevronDown className="ml-2 md:ml-0 text-lg" />
                    )}
                </button>
                {showBudgetDropDown && (
                <div 
                    className="absolute right-0 top-full mt-2 w-72 bg-light-background dark:bg-dark-background border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50 animate-fadeIn"
                    ref={budgetDropDownRef}
                >
                    <ul className="divide-y divide-gray-300 dark:divide-gray-600">
                    <li className="flex items-center justify-between px-4 py-3 text-light-text dark:text-dark-text cursor-pointer transition-colors duration-200 hover:bg-light-accent dark:hover:bg-dark-accent">
                        <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 2a7 7 0 110 14 7 7 0 010-14zm0 2a5 5 0 100 10 5 5 0 000-10zm-1 6V7a1 1 0 112 0v3h2a1 1 0 110 2H9a1 1 0 110-2h1z"/>
                        </svg>
                        <span>Budget Max</span>
                        </div>
                        <span className="font-bold">{currencySymbol}{budget}</span>
                    </li>
                    <li className="flex items-center justify-between px-4 py-3 text-light-text dark:text-dark-text cursor-pointer transition-colors duration-200 hover:bg-light-accent dark:hover:bg-dark-accent">
                        <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M5 10a5 5 0 1110 0 5 5 0 01-10 0zm5-3a1 1 0 100 2 1 1 0 000-2zm1 7a1 1 0 10-2 0 1 1 0 002 0z" clipRule="evenodd" />
                        </svg>
                        <span>Current Budget</span>
                        </div>
                        <span className="font-bold">{currencySymbol}{currentBudget}</span>
                        </li>
                        <li className="flex items-center justify-between px-4 py-3 text-light-text dark:text-dark-text cursor-pointer transition-colors duration-200 hover:bg-light-accent dark:hover:bg-dark-accent">
                            <div className="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-6a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" />
                            </svg>
                            <span>Points Remaining</span>
                            </div>
                            <span className="font-bold">{pointsRemaining}</span>
                        </li>
                    </ul>
                </div>
                )}

            </div>
            {user.type === "child" && (
                  <div className="relative flex items-center space-x-4 hidden md:flex">
                  <button
                      className="flex items-center px-6 py-2 bg-pink-600 text-white text-lg font-medium hover:bg-pink-700 transition-all duration-300 rounded-lg shadow-md"
                      onClick={() => setShowPointsDropdown(prev => !prev)}
                  >
                      <FaRegHeart className="text-2xl mr-2" />
                      <span className="hidden text-sm md:inline md:text-base"> 
                        {!isSmallScreen && ( <span>Points</span>)}
                        <span> {childData?.currentPoints? childData?.currentPoints : null}</span>
                       </span>
                  </button>
                 
              </div>
            )}
          
            {showQuote && quoteOfTheDay && (
                    <Transition
                        show={showQuote}
                        enter="transition-opacity duration-800"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition-opacity duration-800"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div 
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-light-primary dark:bg-dark-primary text-black rounded-lg shadow-lg p-4 w-full max-w-5xl flex items-center hover:scale-110 transition duration-300"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                            <HiX
                                className={`text-xl mr-2 text-red-500 cursor-pointer transition-opacity duration-300 z-10`}
                                onClick={() => {handleShowSearch()}}
                            />              
                            <div className="text-sm font-normal font-satisfy text-dark-text">
                                {`${quoteOfTheDay}  -${quoteSource}`}  
                            </div>
                        </div>
                    </Transition>
                )}

                <BudgetModal 
                    user={user}
                    isOpen={showBudgetModal} 
                    onClose={() => setShowBudgetModal(false)}     
                />
        </div>
    );
};

export default Header;
