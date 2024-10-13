import React, { useEffect, useState } from 'react';
import { FaTimes, FaMoneyBillWave } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ChildCard from '../child/ChildCard'; // Assuming you have this component
import { useData } from '@/app/context/dataContext';
import ChildCardHori from '../child/ChildCardHori';
import { apiGetSettingsByParentId, apiUpdateChild, apiUpdateSettings } from '@/lib/apiHelper';
import { assertPositive } from '@/lib/helper';

interface BudgetModalProps {
  user: any;
  isOpen: boolean;
  onClose: () => void;
}

const BudgetModal: React.FC<BudgetModalProps> = ({user, isOpen, onClose }) => {
  const [pointsPerCurrency, setPointsPerCurrency] = useState<number>(1);
  const [currentPoints, setCurrentPoints] = useState(0);
  const [budget, setBudget] = useState(0);
  const [currentBudget, setCurrentBudget] = useState(0);
  const [pointsRemaining, setPointsRemaining] = useState(0);
  const [currencySymbol, setCurrencySymbol] = useState('');
  const [children, setChildren] = useState<any>();
  const [currentChildData, setCurrentChildData] = useState<any>([]);
  const childrenContext = useData();
  const userId = user.id;
  const userType = user.type;


  useEffect(() => {
    const getSettings = async (userId : number) => {
      const response = await apiGetSettingsByParentId(userId);
      const settings = response.response;
      setPointsPerCurrency(settings.pointsPerCurrency)
    } 

    getSettings(userId);

  }, [userId])

  useEffect(() => {
    setChildren(childrenContext.children);
  }, [childrenContext]);

  useEffect(() => {
    if(children && children.length > 0){
      const childData = children.filter((child : any) => child.id === userId)
      setCurrentChildData(childData.length > 0 ? childData[0] : null);
    }
    
  }, [children, userId])
  

  const handleSetBudget = async (id : any, budget : any) => { 
    const response = await apiUpdateChild(id, {budget : budget});
    console.log("response", response);
  }

  const handleUpdateSettings = async () => {
    const response = await apiUpdateSettings(userId, {pointsPerCurrency : pointsPerCurrency});
    console.log("response", response);
    onClose? onClose() : null;
  }

  useEffect(() => {
    if(user.type === "child" && currentChildData){

        const currentPoints = currentChildData.currentPoints;
        setCurrentPoints(currentPoints);

        const budget = currentChildData.budget;
        setBudget(assertPositive(budget));

        const currentBudget = currentChildData.currentPoints / pointsPerCurrency;
        setCurrentBudget(assertPositive(currentBudget > budget? budget : currentBudget));

        const pointsRemaining = (budget - currentBudget) * pointsPerCurrency;
        setPointsRemaining(assertPositive(pointsRemaining));
    }

}, [currentChildData, pointsPerCurrency, user.type])

  const childData = {
    currentPoints: currentPoints,
    maxBudget: budget,
    currentBudget: currentBudget,
    pointsNeeded: pointsRemaining,
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 transition-transform duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 mt-3 w-full md:w-[80vw] lg:w-[80vw] max-h-[98vh] overflow-y-auto flex flex-col task-menu">
        <div className="flex justify-between items-center p-3">
          <div className="flex items-center text-light-text dark:text-dark-text">
            <FaMoneyBillWave className="text-3xl text-green-500 mr-3" />
            <h2 className="text-xl font-bold">Budget and Points</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-light-text hover:text-dark-text"
          >
            <FaTimes size={16} />
          </button>
        </div>

        {userType === "parent" ? (
          <div className="text-center">
            <p className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
              Set the budget for each child and assign points per dollar.
            </p>
          <div className="flex flex-row justify-center mb-7">
            <label className="block text-light-text dark:text-dark-text mr-6 mt-2">
              Points per Dollar
            </label>
            <input
              type="number"
              value={pointsPerCurrency}
              onChange={(e) => setPointsPerCurrency(Number(e.target.value))}
              className="px-4 py-2 rounded-md bg-gray-200 dark:bg-gray-700 text-black dark:text-white no-spinner"
            />
            <button
              className="p-2 ml-3 bg-green-500 text-white font-medium rounded-full shadow-md hover:bg-green-600 transition-colors duration-300"
              onClick={handleUpdateSettings}
              >
              Set
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-4">
            {children && children.length > 0 && children.map((child: any) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <ChildCardHori {...child} type="budget_modal" callback={(id, budget) => handleSetBudget(id, budget)} />
              </motion.div>
            ))}
          </div>
          
          <div className="mt-2">
            <button
              onClick={handleUpdateSettings}
              className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-colors duration-300"
            >
              Close
            </button>
          </div>
        </div>
        ) : (
        // Child user type view with placeholder data
        <div className="text-center">
        <p className="text-lg font-semibold text-light-text dark:text-dark-text mb-4">
          Here is your budget and points progress.
        </p>
        <div className="flex flex-col items-center justify-center space-y-4 mb-7">
          <div className="text-light-text dark:text-dark-text">
            <p>Max Budget: ${childData.maxBudget}</p>
            <p className='mt-2'>Current Budget: ${childData.currentBudget}</p>
            <p className='mt-2'> Current Points: {childData.currentPoints}</p>
            <p className='mt-2'>Points Needed to Max Budget: {childData.pointsNeeded}</p>
          </div>
        </div>

        <div className="mt-2">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-full transition-colors duration-300"
          >
            Close
          </button>
        </div>
      </div>
      )}
      </div>
    </div>
  );
};

export default BudgetModal;
