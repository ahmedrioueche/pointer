import React, { useEffect, useState } from 'react';
import { FaTimes, FaMoneyBillWave } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import ChildCard from '../child/ChildCard'; // Assuming you have this component
import { useData } from '@/app/context/dataContext';
import ChildCardHori from '../child/ChildCardHori';
import { apiGetSettingsByParentId, apiUpdateChild, apiUpdateSettings } from '@/lib/apiHelper';
import CreateReward from '../rewards/CreateReward';
import { Reward } from '@/types/interface';

interface AddRewardsModalProps {
  user?: any;
  isOpen: boolean;
  onCreate: (reward : Reward) => void;
  onClose: () => void;
}

const AddRewardsModal: React.FC<AddRewardsModalProps> = ({isOpen, onCreate, onClose }) => {
 
  return (
    <div className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto ${
        isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        <div className="w-full max-w-lg bg-transparent p-6 text-dark-text dark:text-dark-text relative max-h-[80vh] overflow-y-auto transform transition-transform scale-100 animate-fadeIn">
        <CreateReward 
            type="create_challenge"
            onCreate={(reward) => onCreate(reward)}
            onClose={onClose}
        />
      </div>
    </div>
  );
};

export default AddRewardsModal;
