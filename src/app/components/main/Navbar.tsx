"user client"
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { FaMoon, FaSun, FaBars, FaTimes, FaSignOutAlt, FaBell, FaCog, FaChartBar, FaTasks, FaCoins, FaGift, FaUser, FaHome, FaClock, FaArrowDown, FaArrowUp, FaLightbulb, FaDice, FaArrowRight, FaTrophy, FaSpinner, FaRegHeart, FaCalendarAlt } from "react-icons/fa";
import { signOut } from "next-auth/react";
import DropdownNotifications from "./DropDownNotif";
import PlansModal from "./modals/PlansModal";
import { apiGetChildData, apiGetParentById } from "@/lib/apiHelper";
import { Child } from "@/types/interface";
import { useRouter } from 'next/navigation';
import Header from "./Header";
import PayModal from "./modals/PayModal";
import DropDownMenu from "./DropDownMenu";
import { useTheme } from "@/app/context/ThemeContext";

const DashboardNavbar: React.FC<{user : any }> = ( {user } ) => {
  const {isDarkMode, toggleDarkMode } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [remainingDays, setRemainingDays] = useState(30);
  const [isFreeTrial, setIsFreeTrial] = useState(true);
  const [remainingMilliseconds, setRemainingMilliseconds] = useState(0);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [childData, setChildData] = useState<Child>();
  const [parentData, setParentData] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isPayModalOpen, setIsPayModalOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const userType = user.type;

  useEffect(() => {
    const fetchChildData = async () => {
      try {
        const data = await apiGetChildData(user.id);
        
        const child: Child = {
          ...data,
        };
        setChildData(child);
      } catch (err) {
        console.error("Error fetching child data:", err);
      }
    };

    const fetchParentData = async () => {
      try {
        const data = await apiGetParentById(user.id);
        
        setParentData(data);

      } catch (err) {
        console.error("Error fetching parent data:", err);
      }
    };

    if(userType === "child")
      fetchChildData();
    
    if(userType === "parent")
      fetchParentData();

    }, [userType, user.id]);


  const onOpenNotifDropDown = () => {
    isMenuOpen? setIsMenuOpen(false) : null;
  }
  
  const getRemainingDays = useCallback(() => {
    if (parentData) {
      const currentDate = new Date();
      const createdAtDate = new Date(parentData.createdAt);
  
      // Total duration in milliseconds (e.g., 30 days)
      const totalDurationInMilliseconds = 30 * 24 * 60 * 60 * 1000;
  
      // Difference between current date and created date
      const differenceInMilliseconds = currentDate.getTime() - createdAtDate.getTime();
  
      // Calculate the remaining milliseconds
      const remainingMilliseconds = totalDurationInMilliseconds - differenceInMilliseconds;
  
      // Calculate the number of remaining days
      const remainingDays = Math.max(0, Math.floor(remainingMilliseconds / (1000 * 60 * 60 * 24)));
  
      setRemainingMilliseconds(remainingMilliseconds);
  
      return remainingDays;
    }
    return 30; 
  }, [parentData, setRemainingMilliseconds]);
  

  const handleRemainingDays = (remainingDays : number) => {
    setIsFreeTrial(true);
    setRemainingDays(remainingDays);
  }
  
  useEffect(() => {
    const checkUserData = () => {
      //test
      //setIsPayModalOpen(true);

    //check if user is in a free trial
      //if yes, check remainingDays 
        //if remainingDays < 0, display "please pay"
        //else display remainingDays
      //if no, check subscription end date
        //if no payment, or payment duration passed, display "please pay"
        if(parentData.isFreeTrial){
          const remainingDays : number = getRemainingDays();
          if(remainingDays > 0){
            handleRemainingDays(remainingDays);
            return;
          }
          
          setIsPayModalOpen(true);
          return;
        }
  
        if((!parentData.subscriptionEndDate || (new Date(parentData.subscriptionEndDate).getTime() - new Date().getTime()) <= 0))
          setIsPayModalOpen(true);
  
        setIsChecked(true);
        
        
    }

    if(parentData && !isChecked){
      checkUserData();
    }
  
  }, [parentData, isChecked, getRemainingDays]);


  const toggleMenu = () => {
    setIsMenuOpen((prevOpen) => !prevOpen);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/api/auth/signout" });
  };
  
  const [isPlansModalOpen, setIsPlansModalOpen] = useState(false);

  const togglePlansModal = () => {
    isMenuOpen? toggleMenu() : null;
    setIsPlansModalOpen(!isPlansModalOpen);
  };

  const handleProfileClick = () => {
    setIsLoading(true);
    router.push(`/main/child/${user.id}`);
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsMenuOpen(false);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, []);

  useEffect(()=> {
    setTimeout(() => {
      setIsLoading(false)
    }, 3000);
  },[isLoading])

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

  const firstLetter = user.name?.charAt(0).toUpperCase() || "P";

  const toggleBudgetModal = () => {
    setIsBudgetModalOpen(true);
  }

  return (
    <nav className="relative font-satisfy z-1000 top-0 left-0 w-full py-4 px-6 shadow-md bg-light-background dark:bg-dark-background">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-3xl font-bold">
          <Link
            href="/main/home"
            className="relative font-satisfy cursor-pointer text-dark-primary transition-colors duration-300 hover:text-light-accent dark:hover:text-dark-accent"
          >
            Pointer
          </Link>
        </div>

        <Header user={user} childData={childData} isBudgetModalOpen={isBudgetModalOpen}/>        

      <div className="flex items-center space-x-4">
        {userType != "child" && isFreeTrial &&(
          <button
          onClick={togglePlansModal}
          className="hidden md:flex px-4 py-2 md:px-5 md:justify-center rounded-md text-base md:text-base font-satisfy bg-light-primary dark:bg-dark-primary text-dark-text dark:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 items-center group"
        >
          {!isSmallScreen && (
            `${remainingDays} Days`
          )}
      
          <span className={`${isSmallScreen? 'ml-0' : 'ml-2'} transition-transform duration-300 group-hover:rotate-180`}>
            <FaClock className="text-xl group-hover:hidden" />
            <FaArrowUp className="text-xl hidden group-hover:block" />
          </span>
        </button>
        )}
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
          >
            {isDarkMode ? <FaSun size={20} /> : <FaMoon size={20} />}
          </button>

          <DropdownNotifications user={user} onClick={onOpenNotifDropDown} isMenuOpen={isMenuOpen} />
          
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 font-satisfy rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
          >
            {isMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
          </button>
          

          <div className="hidden md:flex items-center space-x-4">
          
            {/* Settings Icon */}
            <Link
              href="/main/settings"
              className="p-2 rounded-md bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text dark:hover:text-light-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
            >
              <FaCog size={20} /> 
            </Link>

            <div className="flex items-center space-x-4">
              {userType === "child"? (
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full"
                  title={user.name}
                  onClick={handleProfileClick}>

                    {isLoading?  <FaSpinner className="animate-spin text-light-text dark:text-dark-text"/> : 
                      childData?.avatar? <img src={childData.avatar} alt={`${firstLetter}`} className="w-10 h-10 mb-1 rounded-full object-cover cursor-pointer" />
                      : <div>{firstLetter}</div>
                    }
                </div>
              ):(
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-full bg-light-primary dark:bg-dark-primary text-light-background dark:text-dark-background font-bold text-xl cursor-pointer hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
                  title={user.name}
                >
                  {firstLetter}
                </div>
              )}
          
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 rounded-md bg-light-primary dark:bg-dark-primary text-dark-text dark:text-light-text hover:text-dark-text font-medium hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
              >
                <FaSignOutAlt className="mr-2" /> Logout
              </button>
            </div>
          </div>
        </div>
            <PlansModal
              remainingMilliseconds={remainingMilliseconds}
              parentData={parentData}
              isOpen={isPlansModalOpen}
              onClose={togglePlansModal}
           />
           <PayModal
            isOpen={isPayModalOpen}
            />
      </div>
            <DropDownMenu 
              isMenuOpen={isMenuOpen} 
              toggleMenu={() => toggleMenu()} 
              user={user}
              remainingDays={remainingDays}
              handleProfileClick={() => handleProfileClick()}
              handleLogout={() => handleLogout()}
              togglePlansModal={() => setIsPlansModalOpen(true)}
              toggleBudgetModal={() => toggleBudgetModal()}/>
    </nav>
  );
};

export default DashboardNavbar;
