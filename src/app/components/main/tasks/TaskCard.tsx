import React from 'react';
import { TaskCardIf } from "@/lib/interface";
import { FaCheck, FaEdit, FaTrashAlt, FaUserPlus, FaCalendar, FaCalendarDay } from "react-icons/fa";
import { capitalizeFirstLetter, formatDateTime, getRelativeDate } from '@/lib/formater';

interface TaskCardProps extends TaskCardIf {
  type: "task_page" | "task_menu" | "task_pending"; 
  onModify: () => void;
  onRemove: () => void;
  onAction: () => void;
  onAssign: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  type,
  title,
  points,
  creation_date,
  due_date,
  icon: Icon,
  bgColor,
  onModify,
  onRemove,
  onAction,
  onAssign,
}) => (
  <div
    className={`relative p-6 rounded-lg cursor-pointer font-stix shadow-md ${bgColor} text-light-text dark:text-dark-text flex flex-col h-full transform transition-transform hover:scale-105`}
  >
    <div className="flex items-start space-x-4">
      <div className="text-4xl flex-shrink-0">
        <Icon />
      </div>
      <div className="flex-grow">
        <h4 className="text-lg font-semibold mb-1">{title}</h4>
        <div className="mt-2 flex items-center text-sm font-satisfy">
          <FaCalendar className="text-lg mr-2" />
          <p>{capitalizeFirstLetter(formatDateTime(new Date(creation_date)))}</p>
        </div>
        <div className="flex items-center text-sm mt-1 font-satisfy">
          <FaCalendarDay className="text-lg mr-2" />
          <p>{capitalizeFirstLetter(getRelativeDate(new Date(due_date)))}</p>
        </div>
        <div className="flex items-center mt-2 mb-2">
          <p className="text-xl font-bold font-satisfy">{points}</p>
          <h4 className='text-base ml-1 font-satisfy'>Points</h4>
        </div>
      </div>
    </div>
    <div className="mt-auto flex justify-around space-x-2">
      {type === "task_page" && (
        <>
          <button
            onClick={onModify}
            className="p-3 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-gray-700"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={onRemove}
            className="p-3 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-gray-700"
          >
            <FaTrashAlt size={16} />
          </button>
          <button
            onClick={onAction}
            className="p-3 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-gray-700"
          >
            <FaCheck size={16} />
          </button>
        </>
      )}
      {type === "task_pending" && (
        <>
          <button
            onClick={onModify}
            className="p-3 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-gray-700"
          >
            <FaEdit size={16} />
          </button>
          <button
            onClick={onRemove}
            className="p-3 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-gray-700"
          >
            <FaTrashAlt size={16} />
          </button>
        </>
      )}
      {type === "task_menu" && (
        <button
          onClick={onAssign}
          className="p-3 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-gray-700"
        >
          <FaUserPlus size={16} />
        </button>
      )}
    </div>
  </div>
);
