import { capitalizeFirstLetter, formatDateTime } from '@/lib/formater';
import { Reward, Task } from '@/types/interface';
import React from 'react';
import { FaTimes, FaTasks, FaGift, FaCalendarAlt, FaCheck, FaCommentDots, FaUserCheck, FaFileAlt } from 'react-icons/fa';

interface ProfileModalProps {
  task? : Task;
  reward? : Reward;
  isOpenOnTask: boolean;
  isOpenOnReward: boolean;
  onClose: () => void;
}

const DetailsModal: React.FC<ProfileModalProps> = ({
  task,
  reward,
  isOpenOnTask,
  isOpenOnReward,
  onClose,
}) => {

  const renderCard = (
    icon: React.ElementType,
    label: string,
    value: string | number,
    bgColor: string
  ) => (
    <div className={`p-4 rounded-lg shadow-md flex items-center mb-4 ${bgColor} transition duration-300 hover:scale-105`}>
      <div>
        <h3 className="text-lg font-semibold text-white">{label}</h3>
        <p className="text-white">{value}</p>
      </div>
    </div>
  );

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 transition-transform duration-300 ${
        isOpenOnTask || isOpenOnReward ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:max-w-[90vw] lg:max-w-[70vw] md:max-w-[70vw] w-full h-full max-h-[90vh] overflow-y-auto task-menu" >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center text-light-text dark:text-dark-text">
            {isOpenOnTask ? <FaTasks className="text-3xl mr-3" /> : <FaGift className="text-3xl mr-3" />}
            <h2 className="text-xl font-bold">{isOpenOnTask ? 'Task Details' : 'Reward Details'}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-light-text hover:text-dark-text"
          >
            <FaTimes size={16} />
          </button>
        </div>
        
        {isOpenOnTask && (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 sm:grid-cols-1 gap-4 font-stix">
            {task?.name && renderCard(FaTasks, 'Title', task.name, task.bgColor ? task.bgColor : "bg-gradient-to-r from-purple-400 to-blue-400")}
            {task?.points && renderCard(FaTasks, 'Points', task.points, 'bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400')}
            {task?.creationDate && renderCard(FaCalendarAlt, 'Creation Date',  capitalizeFirstLetter(formatDateTime(new Date(task.creationDate))), 'bg-gradient-to-r from-green-400 via-blue-400 to-purple-400')}
            {task?.dueDate && renderCard(FaCalendarAlt, 'Due Date',  capitalizeFirstLetter(formatDateTime(new Date(task.dueDate))), 'bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400')}
            {task?.approvalDate && renderCard(FaCheck, 'Approval Date',  capitalizeFirstLetter(formatDateTime(new Date(task.approvalDate))), 'bg-gradient-to-r from-purple-400 via-pink-400 to-red-400')}
            {task?.approvedByName && renderCard(FaUserCheck, 'Approved By', task.approvedByName, 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400')}
            {task?.description && renderCard(FaTasks, 'Points', task.description, 'bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400')}
            {task?.creatorComment && renderCard(FaCommentDots, 'Comment', task.creatorComment, 'bg-gradient-to-r from-green-400 via-blue-400 to-purple-400')}
            {task?.createdForComment && renderCard(FaTasks, 'Points', task.createdForComment, 'bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400')}
            {renderCard(FaFileAlt, 'Attached files', task?.attachedFiles? task.attachedFiles : "No attached Files", 'bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400')}
          </div>
        )}

        {isOpenOnReward && (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 sm:grid-cols-1 gap-4 font-stix">
            {reward?.name && renderCard(FaGift, 'Title', capitalizeFirstLetter(reward?.name), 'bg-gradient-to-r from-purple-400 to-blue-400')}
            {reward?.points && renderCard(FaTasks, 'Points', reward?.points, 'bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400')}
            {reward?.creationDate && renderCard(FaCalendarAlt, 'Creation Date',  capitalizeFirstLetter(formatDateTime(new Date(reward.creationDate))), 'bg-gradient-to-r from-green-400 via-blue-400 to-purple-400')}
            {reward?.approvedAt && renderCard(FaCheck, 'Approval Date',  capitalizeFirstLetter(formatDateTime(new Date(reward.approvedAt))), 'bg-gradient-to-r from-purple-400 via-pink-400 to-red-400')}
            {reward?.approvedByName && renderCard(FaUserCheck, 'Approved By', reward?.approvedByName, 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400')}
            {reward?.description && renderCard(FaTasks, 'Description', reward.description, 'bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400')}
            {reward?.claimComment && renderCard(FaCommentDots, 'Claim Comment', reward?.claimComment, 'bg-gradient-to-r from-green-400 via-blue-400 to-purple-400')}
            {reward?.approveComment && renderCard(FaCommentDots, 'Approve Comment', reward?.approveComment, 'bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400')}
            {renderCard(FaFileAlt, 'Attached files', reward?.attachedFiles? reward.attachedFiles : "No attached Files", 'bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400')}
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailsModal;
