import React, { useEffect, useState } from 'react';
import { Task } from "@/lib/interface";
import { FaCheck, FaEdit, FaTrashAlt, FaUserPlus, FaCalendar, FaCalendarDay, FaInfoCircle, FaComment, FaTasks } from "react-icons/fa";
import { formatDateTime, getRelativeDate, capitalizeFirstLetter } from '@/lib/formater';
import { getRandomBgColor } from '@/utils/helper';

interface TaskCardProps extends Task {
  type: "task_page" | "task_menu" | "task_pending" | "task_done";
  child_name?: string;
  onModify?: () => void;
  onRemove?: () => void;
  onApprove?: () => void;
  onAssign?: () => void;
  onShowDetails?: () => void;
  onAddRemark?: (remark: { text: string, maker: string, date: string } | null) => void;
  onUndo?: () => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  type,
  name,
  child_name,
  points,
  creationDate,
  dueDate,
  isApproved,
  approvedBy,
  approvedByName,
  approvalDate,
  creatorComment,
  creatorCommentDate,
  icon: Icon,
  onModify,
  onRemove,
  onApprove,
  onAssign,
  onShowDetails,
  onAddRemark,
  onUndo,
}) => {
  const [showRemarkInput, setShowRemarkInput] = useState(false);
  const [remark, setRemark] = useState('');
  const [currentRemark, setCurrentRemark] = useState<{ text: string, maker: string, date: string } | null>(null);
  const [showApprovalMessage, setShowApprovalMessage] = useState(false);
  const [approval, setApproval] = useState<{ maker: string, date: string } | null>(null);
  const [bgColor, setBgColor] = useState("");

  useEffect(()=> {
    let bgColor = getRandomBgColor();
    setBgColor(bgColor);
  },[])

  const handleRemarkChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRemark(event.target.value);
    if (currentRemark) {
      setCurrentRemark(prev => ({
        ...prev!,
        text: event.target.value
      }));  
    }
  };

  const handleRemarkSubmit = () => {
    if (remark.trim()) {
      const newRemark = {
        text: remark,
        maker: "Parent",
        date: new Date().toISOString()
      };

      onAddRemark?.(newRemark);

      newRemark.date = capitalizeFirstLetter(formatDateTime(new Date()))
      setCurrentRemark(newRemark);

    } else {
      setCurrentRemark(null);
      onAddRemark?.(null);
    }
    setRemark('');
    setShowRemarkInput(false);
  };

  const handleApprove = () => {

    setShowApprovalMessage(true);

    const approval = {
      maker: "Parent", 
      date: capitalizeFirstLetter(formatDateTime(new Date()))
    };

    setApproval(approval);

    onApprove? onApprove() : null;
  };

  const handleUndo = () => {
    console.log("undo");
    setApproval(null);
    setShowApprovalMessage(false);

    onUndo? onUndo() : null;

  };

  const toggleRemarkInput = async() => {
    setShowRemarkInput(prev => !prev);
    if (currentRemark) {
      setRemark(currentRemark.text);
    }
  };

  return (
    <div
      className={`relative p-6 rounded-lg cursor-pointer font-stix shadow-md bg-gradient-to-r from-purple-400 to-blue-800 ${bgColor} text-dark-text dark:text-dark-text flex flex-col h-full transform transition-transform hover:scale-105`}
    >
      <div className="flex items-start space-x-4">
        <div className="text-4xl flex-shrink-0">
         { Icon?  <Icon /> : <FaTasks/>}
        </div>
        <div className="flex-grow">
          <h4 className="text-xl font-semibold mb-1">{capitalizeFirstLetter(name)}</h4>
          {creationDate && (
            <div className="mt-2 flex items-center text-sm font-satisfy">
              <FaCalendar className="text-lg mr-2" />
              <p>{capitalizeFirstLetter(formatDateTime(new Date(creationDate)))}</p>
           </div>
          )}
       
          {(type === "task_done" || type === "task_pending") && (
              <div className="flex items-center text-sm mt-1 font-satisfy">
              <FaCalendarDay className="text-lg mr-2" />
              <p>{dueDate ? capitalizeFirstLetter(formatDateTime(new Date(dueDate))) : null}</p>
            </div>
          )}
          <div className="flex items-center mt-2 mb-2">
            <p className="text-xl font-bold font-satisfy">{points}</p>
            <h4 className='text-base ml-1 font-satisfy'>Points</h4>
          </div>
          {type === "task_done" && (approval || isApproved ) && (
            <div className="mt-2">
              <div className="flex items-start space-x-2 mb-2">
                <FaCheck className="text-xl" />
                <div>
                  <div className="flex items-center text-sm font-satisfy mb-1">
                    <p className="font-semibold">by {approval? approval.maker : approvedByName? approvedByName : "Parent"}</p>
                    <p className="ml-2">{approval? approval.date : approvalDate ? formatDateTime(new Date(approvalDate)) : "At unknown date"}</p>
                  </div>
                  <p className="font-satisfy">{}</p>
                </div>
              </div>
            </div>
          )}
          {type === "task_done" && (currentRemark || creatorComment) && (
            <div className="mt-2">
              <div className="flex items-start space-x-2 mb-2">
                <FaComment className="text-xl" />
                <div>
                  <div className="flex items-center text-sm font-satisfy mb-1">
                    <p className="font-semibold">{currentRemark? currentRemark.maker : "Parent"}</p>
                    <p className="ml-2">{currentRemark? currentRemark.date : creatorCommentDate? formatDateTime(new Date(creatorCommentDate)) : "Unknown date"}</p>
                  </div>
                  <p className="font-satisfy">{currentRemark? currentRemark.text : creatorComment}</p>
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
        {(showApprovalMessage || isApproved) && (
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
              className="flex-grow p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent text-light-text dark:text-light-text font-satisfy"
              placeholder={`How did ${child_name? child_name : "child"} do?`}
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
