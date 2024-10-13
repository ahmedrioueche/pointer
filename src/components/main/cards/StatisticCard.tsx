// components/StatisticCard.tsx

import React from 'react';
import { FaChartLine, FaUsers, FaDollarSign, FaClock } from 'react-icons/fa';

export interface StatisticCardProps {
  title: string;
  figure: string;
  icon: React.ElementType;
  bgColor?: string;
  description?: string;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  figure,
  icon: Icon,
  bgColor = 'bg-white',
  description
}) => {
  return (
    <div className={`p-6 rounded-lg shadow-md ${bgColor} text-dark-text dark:text-dark-text flex flex-col items-center text-center`}>
      <div className="text-4xl mb-4">
        <Icon />
      </div>
      <h4 className="text-2xl font-semibold mb-2">{title}</h4>
      <p className="text-3xl font-bold mb-2">{figure}</p>
      {description && <p className="text-base">{description}</p>}
    </div>
  );
};
