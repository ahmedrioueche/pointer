import React, { useEffect, useState } from 'react';
import { Task } from "@/types/interface";
import { FaCheck, FaEdit, FaTrashAlt, FaUserPlus, FaCalendar, FaCalendarDay, FaInfoCircle, FaComment, FaTasks, FaHandPointer, FaUserTie, FaCalendarCheck, FaFileAlt, FaPlus, FaTimes } from "react-icons/fa";
import { formatDateTime, getRelativeDate, capitalizeFirstLetter } from '@/utils/formater';
import { getRandomBgColor } from '@/utils/helper';

interface TaskCardProps extends Task {
  cardType: 
  "task_page"              //taskCard in task page (only visible to parent)
  | "task_menu"            //taskCard in task modal (only visible to parent)
  | "task_pending"         //taskCard in task modal in pending card (only visible to parent)
  | "task_done"            //taskCard in ChildProfile from parent's prespective
  | "task_assignment"      //taskCard in ChildHome (only visible to child)
  | "task_done_childview"  //taskCard in ChildProfile from child's prespective
  | "task_customize"       //taskCard in CustomizeModal
  | "task_details"         //taskCard in TaskDetailsModal (parent view)
  | "task_details_childview" //taskCard in TaskDetailsModal (child view)
  child_name?: string;
  onModify?: () => void;
  onRemove?: () => void;
  onApprove?: () => void;
  onAchieved?: () => void;
  onAssign?: () => void;
  onShowDetails?: () => void;
  onAddComment?: (comment: { text: string, maker: string, date: string } | null) => void;
  onAddChildComment?: (comment: { text: string, maker: string, date: string } | null) => void;
  onApprovalUndo?: () => void;
  onAchievementUndo?: () => void;
  onTaskPageAssign?:() => void;
  onClose?:() => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  cardType,
  name,
  description,
  child_name,
  points,
  creationDate,
  dueDate,
  isApproved,
  isCompleted,
  completionDate,
  assignedByName,
  assignmentDate,
  approvedBy,
  approvedByName,
  approvalDate,
  createdForComment,
  createdForCommentDate,
  creatorComment,
  creatorCommentDate,
  icon: Icon,
  onModify,
  onRemove,
  onApprove,
  onAchieved,
  onAssign,
  onShowDetails,
  onAddComment,
  onAddChildComment,
  onApprovalUndo,
  onAchievementUndo,
  onTaskPageAssign,
  onClose,
}) => {
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [showChildCommentInput, setShowChildCommentInput] = useState(false);
  const [comment, setComment] = useState('');
  const [childComment, setChildComment] = useState('');
  const [currentComment, setCurrentComment] = useState<{ text: string, maker: string, date: string } | null>(null);
  const [currentChildComment, setCurrentChildComment] = useState<{ text: string, maker: string, date: string } | null>(null);
  const [showApprovalMessage, setShowApprovalMessage] = useState(false);
  const [approval, setApproval] = useState<{ maker: string, date: string } | null>(null);
  const [achievement, setAchievement] = useState<{ maker: string, date: string } | null>(null);
  const [showAchievementMessage, setShowAchievementMessage] = useState(false);
  const [bgColor, setBgColor] = useState("");  

  useEffect(()=> {
    let bgColor = getRandomBgColor();
    setBgColor(bgColor);
  },[])

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
    if (currentComment) {
      setCurrentComment(prev => ({
        ...prev!,
        text: event.target.value
      }));  
    }
  };

  const handleCommentSubmit = () => {
    if (comment.trim()) {
      const newRemark = {
        text: comment,
        maker: "Parent",
        date: new Date().toISOString()
      };

      onAddComment?.(newRemark);

      newRemark.date = capitalizeFirstLetter(formatDateTime(new Date()))
      setCurrentComment(newRemark);

    } else {
      setCurrentComment(null);
      onAddComment?.(null);
    }
    setComment('');
    setShowCommentInput(false);
  };

  
  const handleChildCommentSubmit = () => {
    if (comment.trim()) {
      const newRemark = {
        text: comment,
        maker: child_name? child_name : "Child",
        date: new Date().toISOString()
      };

      onAddChildComment?.(newRemark);

      newRemark.date = capitalizeFirstLetter(formatDateTime(new Date()))
      setCurrentChildComment(newRemark);

    } else {
      setCurrentChildComment(null);
      onAddChildComment?.(null);
    }
    setComment('');
    setShowCommentInput(false);
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

  const handleAchieved = () => {
    setShowAchievementMessage(true);

    const achievement  = {
      maker: "Child", 
      date: capitalizeFirstLetter(formatDateTime(new Date()))
    };

    setAchievement(achievement);

    onAchieved? onAchieved() : null;
  }

  const handleUndo = () => {
    console.log("undo");
    setApproval(null);
    setShowApprovalMessage(false);

    onApprovalUndo? onApprovalUndo() : null;

  };

  const handleAchievementUndo = () => {
    console.log("handleAchievementUndo");
    setAchievement(null);
    setShowAchievementMessage(false);

    onAchievementUndo? onAchievementUndo() : null;

  };
  

  const toggleCommentInput = async() => {
    setShowCommentInput(prev => !prev);
    if (currentComment) {
      setComment(currentComment.text);
    }
  };

  const toggleChildCommentInput = async() => {
    setShowChildCommentInput(prev => !prev);
    if (currentChildComment) {
      setChildComment(currentChildComment.text);
    }
  };

  const handleTaskPageAssign = () => {
    onTaskPageAssign? onTaskPageAssign() : null;
  }

  const buttonStyle : any ="p-3 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-gray-700 hover:text-white";

  return (
    <div
      className={`relative p-6 rounded-lg cursor-pointer font-stix shadow-md bg-gradient-to-r from-purple-400 to-blue-800 ${cardType !== "task_pending" ? bgColor : 'bg-gradient-to-r from-purple-400 to-indigo-400'} text-dark-text dark:text-dark-text flex flex-col h-full transform transition-transform hover:scale-105`}
    >
      <div className="flex items-start space-x-4">
        <div className="text-4xl flex-shrink-0">
         { Icon?  <Icon /> : <FaTasks/>}
        </div>
        {cardType === "task_details_childview" && (
          <button
            className="absolute top-6 right-6 p-2 z-100 rounded-full text-light-text bg-white transition-colors duration-300 hover:bg-dark-accent"
            onClick={onClose}
          >
            <FaTimes size={14} />
        </button>
        )}
        <div className="flex-grow">
          <h4 className="text-xl font-semibold mb-1">{capitalizeFirstLetter(name)}</h4>
          {creationDate && (
            <div className="mt-2 flex items-center text-sm font-satisfy">
              <FaCalendar className="text-lg mr-2" />
              <p>{capitalizeFirstLetter(formatDateTime(new Date(creationDate)))}</p>
           </div>
          )}

        {(cardType === "task_assignment" && assignmentDate)  && (
            <div className="mt-2 flex items-center text-sm font-satisfy">
              <FaCalendar className="text-lg mr-2" />
              <p>{capitalizeFirstLetter(formatDateTime(new Date(assignmentDate)))}</p>
           </div>
        )}
        {(cardType === "task_done_childview"  || cardType === "task_done") && completionDate  && (
          <>
            <div className="mt-2 flex items-center text-sm font-satisfy">
                <FaCalendarCheck className="text-lg mr-2" />
                <p>{capitalizeFirstLetter(formatDateTime(new Date(completionDate)))}</p>
            </div>
          </>
        )}
          {cardType !== "task_done_childview" && cardType !== "task_done" && dueDate && (
            <div className="flex items-center text-sm mt-1 font-satisfy">
              <FaCalendarDay className="text-lg mr-2" />
              <p>{capitalizeFirstLetter(formatDateTime(new Date(dueDate)))}</p>
            </div>
          )}

          {description && (
              <div className="flex items-center text-sm mt-1 font-satisfy">
                <FaFileAlt className="text-lg mr-2" />
                <p className=''>{capitalizeFirstLetter(description)}</p>
              </div>
            )}
     
          {(cardType === "task_assignment") && (
            <div className="flex items-center text-sm mt-1 font-satisfy">
                <FaUserTie className="text-lg mr-2" />
                <p className=''>By {assignedByName? assignedByName : "Parent" }</p>
            </div>
          )}
           

          <div className="flex items-center mt-2 mb-2">
            <p className="text-xl font-bold font-satisfy">{points}</p>
            <h4 className='text-base ml-1 font-satisfy'>Points</h4>
          </div>

          {(cardType === "task_done" || cardType === "task_done_childview") && (approval || isApproved ) && (
            <div className="mt-2">
              <div className="flex items-start space-x-2 mb-2">
                <FaCheck className="text-xl" />
                <div>
                  <div className="flex items-center text-sm font-satisfy mb-1">
                    <p className="font-semibold">by {approval? approval.maker : approvedByName? approvedByName : "Parent"}</p>
                    <p className="ml-2">{approval? capitalizeFirstLetter(approval.date) : approvalDate ? capitalizeFirstLetter(formatDateTime(new Date(approvalDate))) : "At unknown date"}</p>
                  </div>
                  <p className="font-satisfy">{}</p>
                </div>
              </div>
            </div>
          )}

        {(cardType === "task_done" || cardType === "task_done_childview") && (currentComment || creatorComment) && (
        <div className="mt-2">
          <div className="flex items-start space-x-2 mb-2">
            <FaComment className="text-xl" />
            <div className="flex flex-col w-full"> 
              <div className="flex items-center text-sm font-satisfy mb-1">
                <p className="font-semibold">{currentComment ? currentComment.maker : "Parent"}</p>
                <p className="ml-2">{currentComment ? capitalizeFirstLetter(currentComment.date) : creatorCommentDate ? capitalizeFirstLetter(formatDateTime(new Date(creatorCommentDate))) : "Unknown date"}</p>
              </div>
              <p className="font-satisfy whitespace-pre-wrap break-words w-full"> 
                {currentComment ? currentComment.text : creatorComment}
              </p>
            </div>
          </div>
        </div>
        )}
        <div>

        {cardType === "task_assignment" && (currentChildComment || createdForComment) && (
          <div className="mt-2">
            <div className="flex items-start space-x-2 mb-2">
              <FaComment className="text-xl" />
              <div className="flex flex-col w-full"> 
                <div className="flex items-center text-sm font-satisfy mb-1">
                  <p className="font-semibold">{child_name? child_name : "child"}</p>
                  <p className="ml-2">{currentChildComment ? currentChildComment.date : createdForCommentDate ? formatDateTime(new Date(createdForCommentDate)) : "Unknown date"}</p>
                </div>
                <p className="font-satisfy whitespace-pre-wrap break-words w-full">
                  {currentChildComment ? currentChildComment.text : creatorComment}
                </p>
              </div>
            </div>
          </div>
          )}
        </div>
      </div>
      </div>
      <div className="mt-3 flex flex-col">
        <div className="flex items-center justify-between space-x-2">
          {cardType === "task_page" && (
            <>
              <button
                onClick={onModify}
                className={`${buttonStyle}`}
              >
                <FaEdit size={16} />
              </button>
              <button
                onClick={handleTaskPageAssign}
                className={`${buttonStyle}`}
              >
                <FaUserPlus size={16} />
              </button>
              <button
                onClick={onRemove}
                className={`${buttonStyle}`}
              >
                <FaTrashAlt size={16} />
              </button>
             
            </>
          )}
          {cardType === "task_pending" && (
            <>
              <button
                onClick={onModify}
                className={`${buttonStyle}`}
              >
                <FaEdit size={16} />
              </button>
              <button
                onClick={onRemove}
                className={`${buttonStyle}`}
              >
                <FaTrashAlt size={16} />
              </button>
            </>
          )}
          {cardType === "task_details" && (
            <>
              <button
                onClick={onRemove}
                className={`${buttonStyle}`}
              >
                <FaTrashAlt size={16} />
              </button>
              <button
                className={`${buttonStyle}`}
                onClick={onClose}
              >
                <FaTimes size={14} />
              </button>
            </>
            
          )}
          {cardType === "task_menu" && (
            <button
              onClick={onAssign}
              className={`${buttonStyle}`}
            >
              <FaUserPlus size={16} />
            </button>
          )}
          {cardType === "task_done" && (
            <>
              <button
                onClick={handleApprove}
                className={`${buttonStyle}`}
              >
                <FaCheck size={16} />
              </button>
              <button
                onClick={toggleCommentInput}
                className={`${buttonStyle}`}
              >
                <FaComment size={16} />
              </button>
              <button
                onClick={onShowDetails}
                className={`${buttonStyle}`}
              >
                <FaInfoCircle size={16} />
              </button>
            </>
          )}

          {cardType === "task_assignment" && (
            <>
              <button
                onClick={handleAchieved}
                className={`${buttonStyle}`}
              >
                <FaCheck size={16} />
              </button>
              <button
                onClick={toggleChildCommentInput}
                className={`${buttonStyle}`}
              >
                <FaComment size={16} />
              </button>
              <button
                onClick={onShowDetails}
                className={`${buttonStyle}`}
              >
                <FaInfoCircle size={16} />
              </button>
            </>
          )}
            {cardType === "task_done_childview" && (
            <div className='flex justify-center'>
              <button
                onClick={onShowDetails}
                className={`${buttonStyle}`}
                style={{ width: 'fit-content' }} 
              >
                <FaInfoCircle size={16} />
              </button>
            </div>
          )}
          {cardType === "task_customize" && (
            <div className='flex justify-center'>
              <button
                onClick={onShowDetails}
                className={`${buttonStyle}`}
                style={{ width: 'fit-content'}} 
              >
                <FaPlus size={16} />
              </button>
            </div>
          )}          
        </div>
        {cardType !== "task_done_childview" && (showApprovalMessage || isApproved) && (
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
         {(cardType === "task_assignment" && (showAchievementMessage || isCompleted)) && (
          <div className="mt-3 flex items-center text-base font-satisfy text-dark-text">
            <p className="mr-2">Task marked as achieved!</p>
            <button
              onClick={handleAchievementUndo}
              className="text-light-text hover:underline"
            >
              Undo
            </button>
          </div>
        )}
        {cardType === "task_done" && showCommentInput && (
          <div className="mt-5 flex items-center">
            <input
              type="text"
              value={comment}
              onChange={handleCommentChange}
              className="flex-grow p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent text-light-text dark:text-light-text font-satisfy"
              placeholder={`How did ${child_name? child_name : "child"} do?`}
            />
            <button
              onClick={handleCommentSubmit}
              className="ml-1 p-2 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-light-text hover:text-dark-text"
            >
              <FaCheck size={16} />
            </button>
          </div>
        )}
         {cardType === "task_assignment" && showChildCommentInput && (
          <div className="mt-5 flex items-center">
            <input
              type="text"
              value={comment}
              onChange={handleCommentChange}
              className="flex-grow p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-light-accent dark:focus:ring-dark-accent text-light-text dark:text-light-text font-satisfy"
              placeholder={`What do you think ${child_name? child_name : ""}?`}
            />
            <button
              onClick={handleChildCommentSubmit}
              className="ml-1 p-2 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-light-text hover:text-dark-text"  
            >
              <FaCheck size={16} />
            </button>
          </div>
        )}      
      </div>

    </div>
  );
};
