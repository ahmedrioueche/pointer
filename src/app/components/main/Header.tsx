import { HiX, HiSearch, HiOutlineChevronRight } from 'react-icons/hi';
import { IoMdHand } from 'react-icons/io'; // Importing the hand icon
import { HiOutlineCurrencyDollar, HiOutlineChevronDown } from 'react-icons/hi';
import { FaRegHeart } from 'react-icons/fa';
import { Transition } from '@headlessui/react';
import { motion } from 'framer-motion'; // For animation
import { useEffect, useState, useRef, useCallback } from 'react';
import BudgetModal from './modals/BudgetModal';
import { useData } from '@/app/context/dataContext';
import { Child } from '@/lib/interface';
import { apiGetSettingsByParentId } from '@/lib/apiHelper';
import { getCurrencySymbol } from '@/utils/helper';

const Header = ({ user, childData, isBudgetModalOpen}: any) => {
    const [showSearch, setShowSearch] = useState(false);
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
    const dropdownRef = useRef<HTMLDivElement>(null);
    const pointsDropdownRef = useRef<HTMLDivElement>(null);
    const budgetDropDownRef = useRef<HTMLDivElement>(null);

    const childrenContext = useData();
    
    useEffect(() => {
        if(user.type === "child"){
            const childData = childrenContext.children.filter((child:any) => child.id === user.userId);
            setCurrentChildData(childData.length > 0? childData[0] : null);
        }
    }, [childrenContext])

    console.log("user", user)
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
        getSettings(user.userId);

  }, [user.id])

    useEffect(() => {
        if(user.type === "child" && currentChildData){
            const budget = currentChildData.budget;
            setBudget(budget);
    
            const currentBudget = currentChildData.currentPoints / pointsPerCurrency;
            setCurrentBudget(childData.currentPoints / pointsPerCurrency);
    
            const pointRemaining = (budget - currentBudget) * pointsPerCurrency;
            setPointsRemaining(pointRemaining);
        }
    
    }, [currentChildData, pointsPerCurrency])


    useEffect(() => {
        const handleResize = () => {
            setIsSmallScreen(window.innerWidth <= 990);
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
            setShowSearch(prev => !prev);
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
                      className="flex items-center px-4 py-2 bg-pink-600 text-white text-lg font-medium hover:bg-pink-700 transition-all duration-300 rounded-lg shadow-md"
                      onClick={() => setShowPointsDropdown(prev => !prev)}
                  >
                      <FaRegHeart className="text-2xl mr-2" />
                      <span className="hidden text-sm md:inline"> 
                        {!isSmallScreen && ( <span>Points</span>)}
                        <span> {childData?.currentPoints? childData?.currentPoints : null}</span>
                       </span>
                      <HiOutlineChevronDown className="ml-2 text-lg" />
                  </button>
                  {showPointsDropDown && (
                  <div 
                      className="absolute right-0 top-full mt-2 w-60 bg-light-background  dark:bg-dark-background border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-50"
                      ref={pointsDropdownRef}>                        
                          <ul>
                              <li className="px-4 py-2 text-light-text dark:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent  cursor-pointer transition-colors duration-200">Redeem Points</li>
                              <li className="px-4 py-2 text-light-text dark:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent  cursor-pointer transition-colors duration-200">View History</li>
                              <li className="px-4 py-2 text-light-text dark:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent cursor-pointer transition-colors duration-200">Settings</li>
                          </ul>
                  </div>
                  )}
                  
              </div>
            )}
          

            {/* Search Bar (center) */}
            {showSearch && (
                    <Transition
                        show={showSearch}
                        enter="transition-opacity duration-800"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="transition-opacity duration-800"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <div 
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-light-primary dark:bg-dark-primary text-black rounded-lg shadow-lg p-4 w-full max-w-4xl flex items-center"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                        >
                        {isHovered? (
                            <HiX
                                className={`text-xl mr-2 text-red-500 cursor-pointer transition-opacity duration-300 z-10`}
                                onClick={() => {handleShowSearch()}}
                            />
                            ) : (
                                <HiSearch
                                className={`text-2xl mr-2 text-blue-600 transition-opacity duration-300`}
                            />
                            ) 
                        }                    
                            <input
                                type="text"
                                placeholder={`Looking for something, ${user.name}?`}
                                className="bg-gray-100 text-gray-800 border outline-none border-gray-300 rounded-lg p-2 w-full"
                            />
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
