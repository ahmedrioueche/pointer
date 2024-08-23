import React, { useState } from 'react';
import { TaskCardIf } from "@/lib/interface";
import { FaCheck, FaEdit, FaTrashAlt, FaUserPlus, FaCalendar, FaCalendarDay, FaInfoCircle, FaComment } from "react-icons/fa";
import { formatDateTime, getRelativeDate, capitalizeFirstLetter } from '@/lib/formater';

interface TaskCardProps extends TaskCardIf {
  type: "task_page" | "task_menu" | "task_pending" | "task_done";
  onModify?: () => void;
  onRemove?: () => void;
  onAction?: () => void;
  onAssign?: () => void;
  onShowDetails?: () => void;
  onAddRemark?: (remark: { text: string, maker: string, date: string } | null) => void;
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
  onShowDetails,
  onAddRemark
}) => {
  const [showRemarkInput, setShowRemarkInput] = useState(false);
  const [remark, setRemark] = useState('');
  const [currentRemark, setCurrentRemark] = useState<{ text: string, maker: string, date: string } | null>(null);
  const [showApprovalMessage, setShowApprovalMessage] = useState(false);
  const [approval, setApproval] = useState<{ maker: string, date: string } | null>(null);

  const handleRemarkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemark(event.target.value);
    if (currentRemark) {
      setCurrentRemark(prev => ({
        ...prev!,
        text: event.target.value
      }));
    }
  };

  console.log("type, due_date", type, due_date)

  const handleRemarkSubmit = () => {
    if (remark.trim()) {
      const newRemark = {
        text: remark,
        maker: "Parent", // Replace with logic to get the current user's name
        date: capitalizeFirstLetter(formatDateTime(new Date()))
      };
      setCurrentRemark(newRemark);
      onAddRemark?.(newRemark);
    } else {
      // If the remark is empty, remove the current remark
      setCurrentRemark(null);
      onAddRemark?.(null);
    }
    setRemark('');
    setShowRemarkInput(false);
  };

  const handleApprove = () => {
    setShowApprovalMessage(true);
    const approval = {
      maker: "Parent", // Replace with logic to get the current user's name
      date: capitalizeFirstLetter(formatDateTime(new Date()))
    };
    setApproval(approval);
  };

  const handleUndo = () => {
    setApproval(null);
    setShowApprovalMessage(false);
  };

  const toggleRemarkInput = () => {
    setShowRemarkInput(prev => !prev);
    if (currentRemark) {
      setRemark(currentRemark.text);
    }
  };

  return (
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
          {(type === "task_done" || type === "task_pending") && (
            <div className="flex items-center text-sm mt-1 font-satisfy">
            <FaCalendarDay className="text-lg mr-2" />
            <p>{capitalizeFirstLetter(formatDateTime(new Date(due_date)))}</p>
          </div>
          )}
          <div className="flex items-center mt-2 mb-2">
            <p className="text-xl font-bold font-satisfy">{points}</p>
            <h4 className='text-base ml-1 font-satisfy'>Points</h4>
          </div>
          {type === "task_done" && approval && (
            <div className="mt-2">
              <div className="flex items-start space-x-2 mb-2">
                <FaCheck className="text-xl" />
                <div>
                  <div className="flex items-center text-sm font-satisfy mb-1">
                    <p className="font-semibold">by {approval.maker}</p>
                    <p className="ml-2">{approval.date}</p>
                  </div>
                  <p className="font-satisfy">{}</p>
                </div>
              </div>
            </div>
          )}
          {type === "task_done" && currentRemark && (
            <div className="mt-2">
              <div className="flex items-start space-x-2 mb-2">
                <FaComment className="text-xl" />
                <div>
                  <div className="flex items-center text-sm font-satisfy mb-1">
                    <p className="font-semibold">{currentRemark.maker}</p>
                    <p className="ml-2">{currentRemark.date}</p>
                  </div>
                  <p className="font-satisfy">{currentRemark.text}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-col">
        {/* Button row */}
        <div className="flex items-center justify-between space-x-2">
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
          {type === "task_done" && (
            <>
              <button
                onClick={handleApprove}
                className="p-3 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-gray-700"
              >
                <FaCheck size={16} />
              </button>
              <button
                onClick={toggleRemarkInput}
                className="p-3 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-gray-700"
              >
                <FaComment size={16} />
              </button>
              <button
                onClick={onShowDetails}
                className="p-3 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-gray-700"
              >
                <FaInfoCircle size={16} />
              </button>
            </>
          )}
        </div>
        {/* Approval message */}
        {showApprovalMessage && (
          <div className="mt-3 flex items-center text-base font-satisfy text-dark-text">
            <p className="mr-2">Task approved,</p>
            <button
              onClick={handleUndo}
              className="text-light-text hover:underline"
            >
              Undo
            </button>
          </div>
        )}
        {type === "task_done" && showRemarkInput && (
          <div className="mt-5 flex items-center">
            <input
              type="text"
              value={remark}
              onChange={handleRemarkChange}
              className="flex-grow p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent dark:text-light-text font-satisfy"
              placeholder="How did child do?"
            />
            <button
              onClick={handleRemarkSubmit}
              className="ml-1 p-2 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-light-text"
            >
              <FaCheck size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
