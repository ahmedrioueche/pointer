import React, { useState, useEffect } from 'react';
import { FaTasks, FaCheckCircle, FaUserShield, FaStar, FaGift, FaCalendarAlt, FaEye, FaEyeSlash, FaCopy, FaCheck, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { format, isValid } from 'date-fns';
import ProfileCard from './ProfileCard';
import { useSwipeable } from 'react-swipeable';
import { TaskCard } from './tasks/TaskCard';
import { RewardCard } from './RewardCard';
import DetailsModal from './DetailsModal';
import ProfileModal from './EditProfileModal';
import { Child, Reward, Task } from '@/lib/interface';
import MainLoading from './MainLoading';
import { apiGetChildData, apiGetRewardsByChildId, apiGetTasksByChildId, apiUpdateReward, apiUpdateRewardClaim, apiUpdateTask, apiUpdateTaskAssignment } from '@/lib/apiHelper';
import { assertInt, getRandomBgColor } from '@/utils/helper';
import TaskModal from './tasks/TaskModal';
import Alert from '../Alert';
import { capitalizeFirstLetter } from '@/lib/formater';



const handleModify = () => {};

const handleRemove = () => {};

let placeholderRewardData : Reward[] = [
 
];


const ChildProfile: React.FC<{id: number}> = ({id}) => {

  const [childData, setChildData] = useState<Child>();
  const [showPassword, setShowPassword] = useState(false);
  const [copyIcon, setCopyIcon] = useState<{ field: string | null; icon: React.ReactNode }>({ field: null, icon: <FaCopy /> });
  const [currentPage, setCurrentPage] = useState(0);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [showRewardDetails, setShowRewardDetails] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [fetchedTasks, setFetchedTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [openedTask, setOpenedTask] = useState<Task>();
  const [openedReward, setOpenedReward] = useState<Reward>();
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([])
  const [fetchedRewards, setFetchedRewards] = useState<Reward[]>([])
  const [status, setStatus] = useState<{ success: string; message: string }>();
  const [showAlert, setShowAlert] = useState(false);
  
  useEffect(() => {
    const fetchChildData = async () => {
      try {
        const data = await apiGetChildData(id);
      
        const child: Child = {
          ...data,
        };
        setChildData(child);
      } catch (err) {
        console.error("Error fetching child data:", err);
      }
    };

    fetchChildData();
    setProfileUpdated(false);
  }, [id, profileUpdated]);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const data = await apiGetTasksByChildId(id);
        const fetchedTasks = data.tasks;
        setFetchedTasks(fetchedTasks)


      } catch (err) {
        console.error("Error fetching child data:", err);
      }
    };

    fetchCompletedTasks();

  }, [id]);

  useEffect(() => {
    fetchedTasks.forEach((taskAssignment: any) => {
        // Structure the task object with the required properties
        const structuredTask = {
            id: taskAssignment.task.id,
            name: taskAssignment.task.name,
            creatorId: taskAssignment.task.creatorId,
            creatorName: taskAssignment.task.creatorName,
            points: taskAssignment.task.points,
            dueDate: taskAssignment.dueDate,
            assignmentDate: taskAssignment.assignmentDate,
            completionDate: taskAssignment.completionDate,
            isCompleted: taskAssignment.isCompleted,
            isApproved: taskAssignment.isApproved,
            approvedBy: taskAssignment.approvedBy,
            approvedByName: taskAssignment.approvedByName,
            assignedBy: taskAssignment.assignedBy,
            assignedByName: taskAssignment.assignedByName,
            createdForComment: taskAssignment.createdForComment,
            creatorComment: taskAssignment.creatorComment,
            creatorCommentDate: taskAssignment.creatorCommentDate,
            attachedFiles: taskAssignment.attachedFiles            
        };

        if (taskAssignment.isCompleted) {
            setCompletedTasks(prev => {
                const isTaskPresent = prev.some(completedTask => completedTask.id === taskAssignment.task.id);

                if (!isTaskPresent) {
                    return [...prev, structuredTask];
                }
                return prev;
            });
        } else {  
            setPendingTasks(prev => {
                const isTaskPresent = prev.some(pendingTask => pendingTask.id === taskAssignment.task.id);

                if (!isTaskPresent) {
                    return [...prev, structuredTask];
                }
                return prev;
            });
        }
    });

}, [fetchedTasks]);


useEffect(() => {
  const fetchClaimedRewards = async () => {
    try {
      const data = await apiGetRewardsByChildId(id);
      const fetchedRewards = data.rewards;

      const rewardsArray = fetchedRewards.map((rewardClaim: any) => ({
        ...rewardClaim,
        ...rewardClaim.reward, 
      }));

      setFetchedRewards(rewardsArray);

    } catch (err) {
      console.error("Error fetching child data:", err);
    }
  };

  fetchClaimedRewards();
}, [id]);


  const handleTaskApprove = async (index : number) => {
    const taksToUpdate = completedTasks[index];

    const response = await apiUpdateTaskAssignment(taksToUpdate.id, {isApproved: true, approvalDate: new Date().toISOString(), approvedBy: id, approvedByName : "Parent"})
    if(!response.ok){
      setStatus({success : "Error", message : "Could not perform action, something went wrong!"});
      setShowAlert(true);  
    }
  };

  const handleTaskUndo = async (index : number) => {
    const taksToUpdate = completedTasks[index];

    const response = await apiUpdateTaskAssignment(taksToUpdate.id, {isApproved: false, approvalDate: null, approvedBy: null, approvedByName : null})
    if(!response.ok){
      setStatus({success : "Error", message : "Could not perform action, something went wrong!"});
      setShowAlert(true);  
    }
  }

  const handleTaskAddRemark = async (index: number, remark: { text: string, maker: string, date: string } | null) => {
    const taksToUpdate = completedTasks[index];

    const response = await apiUpdateTaskAssignment(taksToUpdate.id, {creatorComment: remark?.text, creatorCommentDate: remark?.date })
    if(!response.ok){
      setStatus({success : "Error", message : "Could not perform action, something went wrong!"});
      setShowAlert(true);  
    }
  }  
  
  const handleRewardApprove = async (index : number) => {
    const rewardToUpdate = fetchedRewards[index];

    const response = await apiUpdateRewardClaim(rewardToUpdate.id, {isApproved: true, approvedAt: new Date().toISOString(), approvedBy: assertInt(id), approvedByName : "Parent"})
    if(!response.ok){
      setStatus({success : "Error", message : "Could not perform action, something went wrong!"});
      setShowAlert(true);  
    }
  };

  const handleRewardUndo = async (index : number) => {
    const rewardToUpdate = fetchedRewards[index];

    const response = await apiUpdateRewardClaim(rewardToUpdate.id, {isApproved: false, approvedAt: null, approvedBy: null, approvedByName : null})
    if(!response.ok){
      setStatus({success : "Error", message : "Could not perform action, something went wrong!"});
      setShowAlert(true);  
    }
  }

  const handleRewardAddRemark = async (index: number, remark: { text: string, maker: string, date: string } | null) => {
    const rewardToUpdate = fetchedRewards[index];

    const response = await apiUpdateRewardClaim(rewardToUpdate.id, {approveComment: remark?.text, approveCommentDate: remark?.date })
    if(!response.ok){
      setStatus({success : "Error", message : "Could not perform action, something went wrong!"});
      setShowAlert(true);  
    }
  }  
  

  const toggleProfileModal = () => {

    if(isProfileModalOpen){
      setProfileUpdated(true);
    }

    setIsProfileModalOpen(!isProfileModalOpen);
  };

  const toggleShowTaskDetails = (index : number) => {
    const openedTask : Task = completedTasks[index];
    setOpenedTask(openedTask);
    setShowTaskDetails(!showTaskDetails);
  }

  const toggleShowRewardDetails = (index : number) => {
    const openedReward : Reward = fetchedRewards[index];
    setOpenedReward(openedReward)
    setShowRewardDetails(!showRewardDetails);
  }

  const closeModal = () => {
    setShowRewardDetails(false);
    setShowTaskDetails(false);
  }

  const toggleTaskModal = () => {
    setIsTasksModalOpen(!isTasksModalOpen);
  };


  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCopyToClipboard = (text: string | undefined, field: string) => {
    if(text){
      navigator.clipboard.writeText(text);
      setCopyIcon({ field, icon: <FaCheck className="text-light-accent dark:text-dark-accent" /> });
      setTimeout(() => setCopyIcon({ field: null, icon: <FaCopy /> }), 1000);
    };
  }

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

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const pages = [
    {
      type: 'tasks',
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
        {completedTasks.map((task, index) => (
          <div key={index} className="h-full">
            <TaskCard
              type="task_done"
              key={index}
              {...task}
              child_name={childData?.name}
              bgColor={getRandomBgColor()}
              onModify={handleModify}
              onRemove={handleRemove}
              onApprove={() => handleTaskApprove(index)}
              onAssign={() => null}
              onShowDetails={() => toggleShowTaskDetails(index)}
              onAddRemark={(remark) => handleTaskAddRemark(index, remark)} 
              onUndo={() => handleTaskUndo(index)}
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
          {fetchedRewards && fetchedRewards.map((reward, index) => (
            <RewardCard 
              type='reward_claimed'
              key={index}
              {...reward}
              onApprove={() => handleRewardApprove(index)}
              onUndo={() => handleRewardUndo(index)}
              onAddRemark={(remark) => handleRewardAddRemark(index, remark)} 
              onShowDetails={()=> toggleShowRewardDetails(index)}
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
            value={
              childData?.created_at
                ? format(new Date(childData.created_at), 'PPP')
                : 'Unknown date'
            }
            icon={<FaCalendarAlt />}
            bgColor="bg-gradient-to-r from-green-400 to-blue-500"
          />
          <DetailCard
            title="Tasks Assigned"
            value={childData?.tasksAssigned ?? 'N/A'}
            icon={<FaTasks />}
            bgColor="bg-gradient-to-r from-pink-500 to-orange-500"
          />
          <DetailCard
            title="Tasks Completed"
            value={childData?.tasksCompleted ?? 'N/A'}
            icon={<FaCheckCircle />}
            bgColor="bg-gradient-to-r from-purple-500 to-indigo-500"
          />
        
          <DetailCard
            title="Total Points Earned"
            value={childData?.totalPoints ?? 0}
            icon={<FaStar />}
            bgColor="bg-gradient-to-r from-teal-400 to-cyan-500"
          />
          <DetailCard
            title="Rewards Earned"
            value={childData?.rewardsEarned ?? 0}
            icon={<FaGift />}
            bgColor="bg-gradient-to-r from-blue-500 to-purple-500"
          />
            <DetailCard
            title="Competence"
            value={childData?.competence? capitalizeFirstLetter(childData?.competence) : "unknown"} 
            icon={<FaUserShield />}
            bgColor="bg-gradient-to-r from-yellow-500 to-red-500"
          />

        </div>
      ),
    },
  ];

  if (!childData) {
    return <MainLoading numCards={6}/>;
  }

  return (
    <div className="flex flex-col md:flex-row p-6 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text rounded-lg shadow-lg" {...swipeHandlers}>
      <div className="flex flex-col items-center md:items-start md:w-1/3 space-y-6 md:space-y-4 mb-6 md:mb-0">
        <div className="w-full max-w-md md:max-w-xl lg:max-w-lg mb-2">
          <ProfileCard name={childData.name} age={childData.age} gender={childData.gender} level={childData.level} icon={childData.icon} current_points={childData.current_points} onEditProfile={toggleProfileModal} onAssignTasks={toggleTaskModal} />
        </div>
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
        <DetailsModal  
          task={openedTask}
          reward={openedReward}
          isOpenOnTask={showTaskDetails}
          isOpenOnReward={showRewardDetails}
          onClose={closeModal}/>
          
        <ProfileModal   
          child={childData}
          isOpen={isProfileModalOpen}
          onClose={toggleProfileModal}
        />

        <TaskModal
          parent_id={id}
          fetchedPendingTasks={pendingTasks}
          child_id={id}
          isOpen={isTasksModalOpen}
          onClose={() => setIsTasksModalOpen(false)}
          onUpdate={() => null }
       />

        {showAlert && (
          <Alert
            title={status?.success}
            message={status?.message}
            onClose={handleAlertClose}
          />
      )}
  
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
    className={`p-6 rounded-lg cursor-pointer text-dark-text dark:text-dark-text font-stix shadow-md ${bgColor}  flex items-center space-x-4 transform transition-transform hover:scale-105 w-full md:w-auto h-31`}
  >
    <div className="text-4xl">{icon}</div>
    <div>
      <h4 className="text-lg font-semibold mb-1">{title}</h4>
      <p className="text-xl font-bold">{value}</p>
    </div>
 
  </div>
);

export default ChildProfile;