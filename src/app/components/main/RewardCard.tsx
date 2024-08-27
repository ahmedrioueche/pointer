import React, { useEffect, useState } from 'react';
import { RewardCardProps } from "@/lib/interface";
import { FaCheck, FaEdit, FaTrashAlt, FaCalendar, FaCalendarDay, FaInfoCircle, FaComment, FaGift } from "react-icons/fa";
import { formatDateTime, capitalizeFirstLetter } from '@/lib/formater';
import { getRandomBgColor } from '@/utils/helper';

export const RewardCard: React.FC<RewardCardProps> = ({
  type,
  name,
  points,
  icon: Icon,
  creationDate,
  claimedAt,
  approvedAt,
  isApproved,
  approvedBy,
  approvedByName,
  approveCommentDate,
  claimComment,
  approveComment,
  onModify,
  onRemove,
  onCreate,
  onApprove,
  onAddRemark,
  onUndo,
  onShowDetails,
}) => {
  const [remark, setRemark] = useState('');
  const [currentRemark, setCurrentRemark] = useState<{ text: string, maker: string, date: string } | null>(null);
  const [showRemarkInput, setShowRemarkInput] = useState(false);
  const [approval, setApproval] = useState<{ maker: string, date: string } | null>(null);
  const [showApprovalMessage, setShowApprovalMessage] = useState(false);
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

    const newApproval = {
      maker: "Parent", 
      date: capitalizeFirstLetter(formatDateTime(new Date()))
    };

    setApproval(newApproval);

    onApprove? onApprove() : null;
  };

  
  const handleUndo = () => {
    setApproval(null);

    setShowApprovalMessage(false);

    onUndo? onUndo() : null;
  };

  const toggleRemarkInput = () => {
    setShowRemarkInput(prev => !prev);
    if (currentRemark) {
      setRemark(currentRemark.text);
    }
  };


  const formattedCreationDate = creationDate
    ? capitalizeFirstLetter(formatDateTime(new Date(creationDate)))
    : capitalizeFirstLetter(formatDateTime(new Date()));

  const formattedClaimDate = claimedAt
    ? capitalizeFirstLetter(formatDateTime(new Date(claimedAt)))
    : capitalizeFirstLetter(formatDateTime(new Date()));

  const formattedApprovalDate = approvedAt
    ? capitalizeFirstLetter(formatDateTime(new Date(approvedAt)))
    : capitalizeFirstLetter(formatDateTime(new Date()));

  return (
    <div
      className={`relative p-6 rounded-lg cursor-pointer font-stix shadow-md bg-gradient-to-r from-purple-400 to-blue-800 ${bgColor} text-dark-text dark:text-dark-text flex flex-col h-full transform transition-transform hover:scale-105`}
    >
      <div className="flex items-start space-x-4">
        <div className="text-4xl flex-shrink-0">
          {Icon?  <Icon /> : <FaGift/>}
        </div>
        <div className="flex-grow">
          <h4 className="text-2xl font-semibold mb-1">{capitalizeFirstLetter(name)}</h4>
          <div className="mt-2 flex items-center text-base font-satisfy">
            <FaCalendar className="text-lg mr-2" />
            <p>{formattedCreationDate}</p>
          </div>
          {type === "reward_claimed" && (
            <div className="flex items-center text-base mt-1 font-satisfy">
            <FaCalendarDay className="text-lg mr-2" />
            <p>{formattedClaimDate}</p>
          </div>
          )}
       
          <div className="flex items-center mt-2 mb-2">
            <p className="text-xl font-bold font-satisfy">{points}</p>
            <h4 className='text-base ml-1 font-satisfy'>Points</h4>
          </div>
          {type === "reward_claimed" && (approval || isApproved) && (
            <div className="mt-2">
              <div className="flex items-start space-x-2 mb-2">
                <FaCheck className="text-xl" />
                <div>
                  <div className="flex items-center text-sm font-satisfy mb-1">
                  <p className="font-semibold">by {approval? approval.maker : approvedByName? approvedByName : "Parent"}</p>
                  <p className="ml-2">{approval? approval.date : approvedAt ? formatDateTime(new Date(approvedAt)) : "At unknown date"}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {type === "reward_claimed" && (currentRemark  || approveComment) && (
            <div className="mt-2">
              <div className="flex items-start space-x-2 mb-2">
                <FaComment className="text-xl" />
                <div>
                  <div className="flex items-center text-sm font-satisfy mb-1">
                  <p className="font-semibold">{currentRemark? currentRemark.maker : "Parent"}</p>
                  <p className="ml-2">{currentRemark? currentRemark.date : approveCommentDate? formatDateTime(new Date(approveCommentDate)) : "Unknown date"}</p>
                  </div>
                  <p className="font-satisfy">{currentRemark? currentRemark.text : approveComment}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="mt-3 flex flex-col">
        <div className="flex items-center justify-between space-x-2">
          {type === "reward_page" && (
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
          {type === "reward_claimed" && (
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
        {(showApprovalMessage || isApproved) &&  (
          <div className="mt-3 flex items-center text-base font-satisfy text-dark-text">
            <p className="mr-2">Reward approved,</p>
            <button
              onClick={handleUndo}
              className="text-light-text hover:underline"
            >
              Undo
            </button>
          </div>
        )}
        {type === "reward_claimed" && showRemarkInput && (
          <div className="mt-5 flex items-center">
            <input
              type="text"
              value={remark}
              onChange={handleRemarkChange}
              className="flex-grow p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent dark:text-light-text font-satisfy"
              placeholder="Add a remark..."
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
