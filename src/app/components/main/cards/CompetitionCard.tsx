// components/CompetitionCard.tsx

import React, { useState } from 'react';
import { FaMedal, FaTrophy, FaCalendar, FaCalendarDay, FaInfoCircle, FaComment } from 'react-icons/fa';
import { formatDateTime, capitalizeFirstLetter } from '@/utils/formater';

export interface CompetitionCardProps {
  title: string;
  participants: number;
  icon?: React.ElementType;
  bgColor?: string;
  start_date?: string;
  end_date?: string;
  onShowDetails?: () => void;
}

export const CompetitionCard: React.FC<CompetitionCardProps> = ({
  title,
  participants,
  icon: Icon,
  bgColor,
  start_date,
  end_date,
  onShowDetails,
}) => {
  const formattedStartDate = start_date
    ? capitalizeFirstLetter(formatDateTime(new Date(start_date)))
    : '';
    
  const formattedEndDate = end_date
    ? capitalizeFirstLetter(formatDateTime(new Date(end_date)))
    : '';

  return (
    <div
      className={`relative p-6 rounded-lg cursor-pointer font-stix shadow-md ${bgColor} text-dark-text dark:text-dark-text flex flex-col h-full transform transition-transform hover:scale-105`}
    >
      <div className="flex items-start space-x-4">
        <div className="text-4xl flex-shrink-0">
          {Icon ? <Icon /> : null}
        </div>
        <div className="flex-grow">
          <h4 className="text-lg font-semibold mb-1">{title}</h4>
          <div className="mt-2 flex items-center text-base font-satisfy">
            <FaCalendar className="text-lg mr-2" />
            <p>{formattedStartDate}</p>
          </div>
          <div className="flex items-center text-base mt-1 font-satisfy">
            <FaCalendarDay className="text-lg mr-2" />
            <p>{formattedEndDate}</p>
          </div>
          <div className="flex items-center mt-2 mb-2">
            <p className="text-xl font-bold font-satisfy">{participants}</p>
            <h4 className="text-base ml-1 font-satisfy">Participants</h4>
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-col">
        <div className="flex items-center justify-between space-x-2">
          <button
            onClick={onShowDetails}
            className="p-3 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-gray-700"
          >
            <FaInfoCircle size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
