import React, { useState, useEffect } from 'react';
import { FaTasks, FaCheckCircle, FaUserShield, FaStar, FaGift, FaCalendarAlt, FaEye, FaEyeSlash, FaCopy, FaCheck, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { format, isValid } from 'date-fns';
import ProfileCard from './ProfileCard';
import { useSwipeable } from 'react-swipeable';
import { TaskCard } from './tasks/TaskCard';
import { RewardCard } from './RewardCard';

interface ChildProfileProps {
  name: string;
  age: number;
  gender: string;
  addedOn: Date;
  tasksAssigned: number;
  tasksCompleted: number;
  competence: string;
  totalPoints: number;
  rewardsEarned: number;
  username: string;
  password: string;
  level: string;
}

const handleAction = () => {};

const handleModify = () => {};

const handleRemove = () => {};

const placeholderTaskData = [
  {
    title: 'Math Homework',
    points: 50,
    creation_date: new Date('2023-08-15').toISOString(),
    due_date: new Date('2023-08-20').toISOString(),
    approval_date: new Date('2023-08-20').toISOString(),
    icon: FaTasks,
    bgColor: 'bg-gradient-to-r from-yellow-500 to-red-500',
  },
  {
    title: 'Science Project',
    points: 100,
    creation_date: new Date('2023-08-10').toISOString(),
    due_date: new Date('2023-08-25').toISOString(),
    approval_date: new Date('2023-08-20').toISOString(),
    icon: FaTasks,
    bgColor: 'bg-gradient-to-r from-blue-500 to-green-500',
  },
];

const placeholderRewardData = [
  {
    title: 'New Bicycle',
    points: 300,
    icon: FaGift,
    bgColor: 'bg-gradient-to-r from-purple-500 to-pink-500',
    onModify: handleModify,
    onRemove: handleRemove,
    onAction: handleAction,
  },
  {
    title: 'Video Game',
    points: 200,
    icon: FaGift,
    bgColor: 'bg-gradient-to-r from-green-400 to-blue-500',
    onModify: handleModify,
    onRemove: handleRemove,
    onAction: handleAction,
  },
];

const placeholderChildData: ChildProfileProps = {
  name: "Bob",
  age: 10,
  gender: "male",
  addedOn: new Date(),
  tasksAssigned: 15,
  tasksCompleted: 12,
  competence: "Intermediate",
  totalPoints: 250,
  rewardsEarned: 5,
  username: "johndoe123",
  password: "password123",
  level: "Gold",
};

const ChildProfile: React.FC = () => {
  const [childData, setChildData] = useState<ChildProfileProps>(placeholderChildData);
  const [showPassword, setShowPassword] = useState(false);
  const [copyIcon, setCopyIcon] = useState<{ field: string | null; icon: React.ReactNode }>({ field: null, icon: <FaCopy /> });
  const [currentPage, setCurrentPage] = useState(0);
  const pages = [
    {
      type: 'tasks',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
        {placeholderTaskData.map((task, index) => (
          <div key={index} className="h-full">
            <TaskCard
              type="task_done"
              key={index}
              {...task}
              onModify={handleModify}
              onRemove={handleRemove}
              onAction={handleAction}
              onAssign={() => null}
              onShowDetails={() => null}
              onAddRemark={() => null}
            />
          </div>
          ))}
        </div>
      ),
    },
    {
      type: 'rewards',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {placeholderRewardData.map((reward, index) => (
            <RewardCard
            type='reward_claimed'
              key={index}
              {...reward}
            />
          ))}
        </div>
      ),
    },
    {
      type: 'details',
      content: (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-1">
          <DetailCard
            title="Added On"
            value={isValid(new Date(childData.addedOn)) ? format(new Date(childData.addedOn), 'PPP') : 'Invalid Date'}
            icon={<FaCalendarAlt />}
            bgColor="bg-gradient-to-r from-green-400 to-blue-500"
          />
          <DetailCard
            title="Tasks Assigned"
            value={childData.tasksAssigned}
            icon={<FaTasks />}
            bgColor="bg-gradient-to-r from-pink-500 to-orange-500"
          />
          <DetailCard
            title="Tasks Completed"
            value={childData.tasksCompleted}
            icon={<FaCheckCircle />}
            bgColor="bg-gradient-to-r from-purple-500 to-indigo-500"
          />
          <DetailCard
            title="Competence"
            value={childData.competence}
            icon={<FaUserShield />}
            bgColor="bg-gradient-to-r from-yellow-500 to-red-500"
          />
          <DetailCard
            title="Total Points Earned"
            value={childData.totalPoints}
            icon={<FaStar />}
            bgColor="bg-gradient-to-r from-teal-400 to-cyan-500"
          />
          <DetailCard
            title="Rewards Earned"
            value={childData.rewardsEarned}
            icon={<FaGift />}
            bgColor="bg-gradient-to-r from-blue-500 to-purple-500"
          />
        </div>
      ),
    },
  ];


  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCopyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopyIcon({ field, icon: <FaCheck className="text-light-accent dark:text-dark-accent" /> });
    setTimeout(() => setCopyIcon({ field: null, icon: <FaCopy /> }), 1000);
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setCurrentPage((prevPage) => (prevPage < pages.length - 1 ? prevPage + 1 : prevPage)),
    onSwipedRight: () => setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : prevPage)),
    trackMouse: true,
  });

  const handleNextPage = () => {
    setCurrentPage((prevPage) => (prevPage < pages.length - 1 ? prevPage + 1 : prevPage));
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => (prevPage > 0 ? prevPage - 1 : prevPage));
  };

  if (!childData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col md:flex-row p-6 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text rounded-lg shadow-lg" {...swipeHandlers}>
      {/* Profile Card */}
      <div className="flex flex-col items-center md:items-start md:w-1/3 space-y-6 md:space-y-4 mb-6 md:mb-0">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-lg mb-2">
          <ProfileCard name={childData.name} age={childData.age} gender={childData.gender} level={childData.level} />
        </div>
       {/* Username and Password */}
      <div className="flex flex-col space-y-4 w-full">
          <div className="relative">
            <input
              type="text"
              value={childData.username}
              readOnly
              className="w-full max-w-md bg-light-background dark:bg-dark-background border focus:outline-none focus:border-light-accent dark:focus:border-dark-accent border-light-primary dark:border-dark-primary rounded-lg px-4 py-2 text-light-text dark:text-dark-text"
              aria-label="Child's username"
            />
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-light-primary dark:text-dark-primary"
              onClick={() => handleCopyToClipboard(childData.username, 'username')}
              aria-label="Copy username"
            >
              {copyIcon.field === 'username' ? copyIcon.icon : <FaCopy />}
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={childData.password}
              readOnly
              className="w-full max-w-md bg-light-background dark:bg-dark-background border focus:outline-none focus:border-light-accent dark:focus:border-dark-accent border-light-primary dark:border-dark-primary rounded-lg px-4 py-2 text-light-text dark:text-dark-text"
              aria-label="Child's password"
            />
            <button
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-light-primary dark:text-dark-primary"
              onClick={() => handleCopyToClipboard(childData.password, 'password')}
              aria-label="Copy password"
            >
              {copyIcon.field === 'password' ? copyIcon.icon : <FaCopy />}
            </button>
            <button
              className="absolute right-8 top-1/2 transform -translate-y-1/2 px-2 py-1 text-light-primary dark:text-dark-primary"
              onClick={handleTogglePassword}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
      </div>


      {/* Detail Cards */}
      <div className="flex flex-col w-full md:w-2/3 space-y-6 md:ml-5 relative" {...swipeHandlers}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 mb-1">
            {pages[currentPage].content}
        </div>

      <div className="flex flex-col w-full relative">
      {/* Pagination Arrows */}
      <div className="flex justify-between items-center absolute top-0 left-0 right-0 transform -translate-y-1/2 z-10">
        <button
          className="text-light-primary dark:text-dark-primary hover:text-l ight-accent dark:hover:text-dark-accent focus:outline-none"
          onClick={handlePrevPage}
          disabled={currentPage === 0}
        >
          <FaArrowLeft className="text-2xl" />
        </button>
        <div className="flex justify-center">
          {pages.map((_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full mx-1 ${index === currentPage ? 'bg-light-accent dark:bg-dark-accent' : 'bg-light-primary dark:bg-dark-primary'}`}
            />
          ))}
        </div>
        <button
          className="text-light-primary dark:text-dark-primary hover:text-light-accent dark:hover:text-dark-accent focus:outline-none"
          onClick={handleNextPage}
          disabled={currentPage === pages.length - 1}
        >
          <FaArrowRight className="text-2xl" />
        </button>
      </div>
      </div>
      </div>

    </div>
  );
};

// DetailCard Component
const DetailCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; bgColor: string }> = ({
  title,
  value,
  icon,
  bgColor,
}) => (
  <div
    className={`p-6 rounded-lg cursor-pointer font-stix shadow-md ${bgColor} text-light-text dark:text-dark-text flex items-center space-x-4 transform transition-transform hover:scale-105 w-full md:w-auto h-32`}
  >
    <div className="text-4xl">{icon}</div>
    <div>
      <h4 className="text-lg font-semibold mb-1">{title}</h4>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

export default ChildProfile;