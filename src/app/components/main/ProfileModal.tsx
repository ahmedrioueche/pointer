import React from 'react';
import { FaTimes, FaTasks, FaGift, FaCalendarAlt, FaCheck, FaCommentDots, FaUserCheck } from 'react-icons/fa';

interface ProfileModalProps {
  isOpenOnTask: boolean;
  isOpenOnReward: boolean;
  onClose: () => void;
}

const placeholderTaskData = [
  {
    title: 'Math Homework',
    points: 50,
    creation_date: new Date('2023-08-15').toISOString(),
    due_date: new Date('2023-08-20').toISOString(),
    approval_date: new Date('2023-08-20').toISOString(),
    approved_by: 'John Doe',
    comment: 'Great work on the last assignment!',
    icon: FaTasks,
    bgColor: 'bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400',
  },
];

const placeholderRewardData = [
  {
    title: 'New Bicycle',
    points: 300,
    icon: FaGift,
    bgColor: 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500',
    approved_by: 'Jane Smith',
    comment: 'Keep up the good work!',
  },
];

const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpenOnTask,
  isOpenOnReward,
  onClose,
}) => {
  const task = placeholderTaskData[0];
  const reward = placeholderRewardData[0];

  const renderCard = (
    icon: React.ElementType,
    label: string,
    value: string | number,
    bgColor: string
  ) => (
    <div className={`p-4 rounded-lg shadow-md flex items-center mb-4 ${bgColor}`}>
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
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-[70vw] w-full h-full max-h-[90vh] overflow-y-auto task-menu" >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center text-light-text dark:text-dark-text">
            {isOpenOnTask ? <FaTasks className="text-3xl mr-3" /> : <FaGift className="text-3xl mr-3" />}
            <h2 className="text-2xl font-bold">{isOpenOnTask ? 'Task Details' : 'Reward Details'}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-gray-700"
          >
            <FaTimes size={16} />
          </button>
        </div>
        
        {isOpenOnTask && (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 sm:grid-cols-1 gap-4">
            {renderCard(FaTasks, 'Task Title', task.title, task.bgColor)}
            {renderCard(FaCalendarAlt, 'Creation Date', new Date(task.creation_date).toLocaleDateString(), 'bg-gradient-to-r from-green-400 via-blue-400 to-purple-400')}
            {renderCard(FaCalendarAlt, 'Due Date', new Date(task.due_date).toLocaleDateString(), 'bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400')}
            {renderCard(FaCheck, 'Approval Date', new Date(task.approval_date).toLocaleDateString(), 'bg-gradient-to-r from-purple-400 via-pink-400 to-red-400')}
            {renderCard(FaUserCheck, 'Approved By', task.approved_by, 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400')}
            {renderCard(FaTasks, 'Points', task.points, 'bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400')}
            {renderCard(FaCommentDots, 'Comment', task.comment, 'bg-gradient-to-r from-green-400 via-blue-400 to-purple-400')}
          </div>
        )}

        {isOpenOnReward && (
          <div className="grid md:grid-cols-2 lg:grid-cols-2 sm:grid-cols-1 gap-4">
            {renderCard(FaGift, 'Reward Title', reward.title, reward.bgColor)}
            {renderCard(FaTasks, 'Points', reward.points, 'bg-gradient-to-r from-yellow-400 via-red-400 to-pink-400')}
            {renderCard(FaUserCheck, 'Approved By', reward.approved_by, 'bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400')}
            {renderCard(FaCommentDots, 'Comment', reward.comment, 'bg-gradient-to-r from-green-400 via-blue-400 to-purple-400')}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileModal;
