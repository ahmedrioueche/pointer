import React, { useState, useEffect, useCallback } from 'react';
import { FaTasks, FaCheckCircle, FaUserShield, FaStar, FaGift, FaCalendarAlt, FaEye, FaEyeSlash, FaCopy, FaCheck, FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import { format, isValid } from 'date-fns';
import ProfileCard from '../cards/ProfileCard';
import { useSwipeable } from 'react-swipeable';
import { TaskCard } from '../tasks/TaskCard';
import { RewardCard } from '../rewards/RewardCard';
import DetailsModal from '../modals/DetailsModal';
import ProfileModal from '../modals/EditProfileModal';
import { Child, Notif, Reward, Task } from '@/types/interface';
import MainLoading from '../MainLoading';
import { apiGetChildData, apiGetRewardsByChildId, apiGetTasksByChildId, apiSendNotification, apiUpdateChild, apiUpdateReward, apiUpdateRewardClaim, apiUpdateTask, apiUpdateTaskAssignment } from '@/lib/apiHelper';
import { assertInt, getRandomBgColor } from '@/utils/helper';
import TaskModal from '../tasks/TaskModal';
import Alert from '../../Alert';
import { capitalizeFirstLetter } from '@/utils/formater';
import { useParams } from 'next/navigation';
import { useData } from '@/app/context/dataContext';

const ChildProfile: React.FC<{user: any}> = ({user}) => {
  const { id } = useParams<{ id: string }>();
  const childId = assertInt(id);
  const userId = user? user.id : undefined;
  const userType = user? user.type : undefined;

  const [showPassword, setShowPassword] = useState(false);
  const [copyIcon, setCopyIcon] = useState<{ field: string | null; icon: React.ReactNode }>({ field: null, icon: <FaCopy /> });
  const [currentPage, setCurrentPage] = useState(0);
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [showRewardDetails, setShowRewardDetails] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [profileUpdated, setProfileUpdated] = useState(false);
  const [taskApproveSignal, setTaskApproveSignal] = useState(false);
  const [taskUnapproveSignal, setTaskUnapproveSignal] = useState(false);
  const [rewardApproveSignal, setRewardApproveSignal] = useState(false);
  const [rewardUnapproveSignal, setrewardUnapproveSignal] = useState(false);
  const [fetchedTasks, setFetchedTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [openedTask, setOpenedTask] = useState<Task>();
  const [openedReward, setOpenedReward] = useState<Reward>();
  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([])
  const [fetchedRewards, setFetchedRewards] = useState<Reward[]>([])
  const [status, setStatus] = useState<{ success: string; message: string }>();
  const [showAlert, setShowAlert] = useState(false);
  const [pages, setPages] = useState<{ type: string; content: JSX.Element }[]>([]);
  const [updateDataSignal, setUpdateDataSignal] = useState(false);
  const [taskToUpdate, setTaskToUpdate] = useState<Task>()
  const [childData, setCurrentChildData] = useState<any>();

  const childrenContext = useData();

  useEffect(() => {
      const childData = childrenContext.children.filter((child:any) => child.id === assertInt(id) );
      setCurrentChildData(childData.length > 0? childData[0] : null);
  
}, [childrenContext, id])

  useEffect(() => {
    childrenContext.triggerFetch();
  }, [id, profileUpdated, taskApproveSignal, taskUnapproveSignal, rewardApproveSignal, rewardUnapproveSignal, childrenContext]);

  useEffect(() => {
    const fetchCompletedTasks = async () => {
      try {
        const data = childData?.id? await apiGetTasksByChildId(childData?.id) : null;
        if(data){
          const fetchedTasks = data.tasks;
          const sortedTasks = fetchedTasks.sort((a: any, b: any) => new Date(b.completionDate).getTime() - new Date(a.completionDate).getTime());
          setFetchedTasks(sortedTasks)
        }

      } catch (err) {
        console.error("Error fetching child data:", err);
      }
    };

      fetchCompletedTasks();

  }, [childData, updateDataSignal]);

  useEffect(() => {
    fetchedTasks.forEach((taskAssignment: any) => {
        // Structure the task object with the required properties
        const structuredTask = {
            id: taskAssignment.task.id,
            name: taskAssignment.task.name,
            creatorId: taskAssignment.task.creatorId,
            creatorName: taskAssignment.task.creatorName,
            creationDate: taskAssignment.task.creationDate,
            points: taskAssignment.task.points,
            dueDate: taskAssignment.dueDate,
            assignmentDate: taskAssignment.assignmentDate,
            completionDate: taskAssignment.completionDate,
            isCompleted: taskAssignment.isCompleted,
            isApproved: taskAssignment.isApproved,
            approvalDate: taskAssignment.approvalDate,
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
        const data = childData?.id? await apiGetRewardsByChildId(childData?.id) : null;
        if(data){
          const fetchedRewards = data.rewards;
          const sortedRewards = fetchedRewards.sort((a: any, b: any) => new Date(b.claimedAt).getTime() - new Date(a.claimedAt).getTime());
          const rewardsArray = sortedRewards.map((rewardClaim: any) => ({
            ...rewardClaim,
            ...rewardClaim.reward, 
          }));
  
          setFetchedRewards(rewardsArray);
        }
      
      } catch (err) {
        console.error("Error fetching child data:", err);
      }
    };

      fetchClaimedRewards();
  }, [childData]);


  const handleTaskApprove = useCallback(async (index: number) => {
    const taskToUpdate = completedTasks[index];
    setTaskToUpdate(taskToUpdate);
  
    const response = await apiUpdateTaskAssignment(taskToUpdate.id, childId, {
      isApproved: true,
      approvalDate: new Date().toISOString(),
      approvedBy: id,
      approvedByName: "Parent"
    });
  
    if (!response.ok) {
      setStatus({ success: "Error", message: "Could not perform action, something went wrong!" });
      setShowAlert(true);
      return;
    }
  
    // Get the updated childData
    setTaskApproveSignal(true);
  
    // Send notification to child
    const notification: Notif = {
      title: "Parent has approved a completed task",
      content: `${taskToUpdate.name}, ${taskToUpdate.points} pts`,
      description: `${taskToUpdate.description}`,
      type: "task_approved",
    };
  
    const notifResponse = await apiSendNotification(userId, childId, "child", notification);
    console.log("apiSendNotification response", notifResponse);
  }, [completedTasks, childId, id, userId, setTaskToUpdate, setStatus, setShowAlert, setTaskApproveSignal]);
  

  //making sure we get up to date child data before taking action on it
  useEffect(() => {
    const updateChildData = async () => {
      let isUpdated = false;
      if(!isUpdated){
        const taskPoints = assertInt(taskToUpdate?.points);
        const childPrevPoints = assertInt(childData?.currentPoints);
        const childTotalPoints = assertInt(childData?.totalPoints);
        const childResponse = await apiUpdateChild(childId, {currentPoints : childPrevPoints + taskPoints, totalPoints : childTotalPoints + taskPoints})
        if(!childResponse){
          setStatus({success : "Error", message : "Could not perform action, something went wrong!"});
          setShowAlert(true);  
        }
        isUpdated = true;
        setTaskApproveSignal(false);
      }
    }
   
    if(taskApproveSignal)
      updateChildData();

  }, [childData, childId, taskApproveSignal, taskToUpdate])


  const handleTaskUndo = async (index : number) => {

    const taskToUpdate = completedTasks[index];

    const response = await apiUpdateTaskAssignment(taskToUpdate.id, childId, {isApproved: false, approvalDate: null, approvedBy: null, approvedByName : null})
    if(!response.ok){
      setStatus({success : "Error", message : "Could not perform action, something went wrong!"});
      setShowAlert(true);  
      return;
    }
    setTaskUnapproveSignal(true);
  }

  //making sure we get up to date child data before taking action on it
  useEffect(() => {
    const updateChildData = async () => {
      let isUpdated = false;
      if(!isUpdated){
        const taskPoints = assertInt(taskToUpdate?.points);
        const childPrevPoints = assertInt(childData?.currentPoints);
        const childTotalPoints = assertInt(childData?.totalPoints);
        const childResponse = await apiUpdateChild(childId, {currentPoints : childPrevPoints - taskPoints, totalPoints : childTotalPoints - taskPoints})
        if(!childResponse){
          setStatus({success : "Error", message : "Could not perform action, something went wrong!"});
          setShowAlert(true);  
        }
        isUpdated = true;
        setTaskUnapproveSignal(false);
      }
    }
   
    if(taskUnapproveSignal)
      updateChildData();

  }, [childData, childId, taskToUpdate, taskUnapproveSignal])


  const handleTaskAddComment = async (index: number, comment: { text: string, maker: string, date: string } | null) => {
    const taskToUpdate = completedTasks[index];

    const response = await apiUpdateTaskAssignment(taskToUpdate.id, childId, {creatorComment: comment?.text, creatorCommentDate: comment?.date })
    if(!response.ok){
      setStatus({success : "Error", message : "Could not perform action, something went wrong!"});
      setShowAlert(true);  
      return;
    }
      //send notification to child
      const notification : Notif = {
        title: "Parent has added a comment on a task",
        content: `${taskToUpdate.name}, ${taskToUpdate.points} pts`,
        description: `${comment?.text}`,
        type: "task_commented_by_parent",
      }
      
      const notifResponse = await apiSendNotification(userId, childId, "child" , notification);
      console.log("apiSendNotification response", notifResponse)
  }  
  
  const handleRewardApprove = async (index : number) => {
    const rewardToUpdate = fetchedRewards[index];
    const response = await apiUpdateRewardClaim(rewardToUpdate.id, {isApproved: true, approvedAt: new Date().toISOString(), approvedBy: assertInt(id), approvedByName : "Parent"})
    
    if(!response.ok){
      setStatus({success : "Error", message : "Could not perform action, something went wrong!"});
      setShowAlert(true);  
      return;
    }

    setRewardApproveSignal(true);

     //send notification to child
     const notification : Notif = {
      title: `Parent has approved ${rewardToUpdate.name}! Congrats!`,
      content: `${rewardToUpdate.points} pts`,
      description: `${rewardToUpdate.description}`,
      type: "reward_approved",
    }
    
    const notifResponse = await apiSendNotification(userId, childId, "child" , notification);
    console.log("apiSendNotification response", notifResponse)
  };

  useEffect(() => {
    const updateChildData = async () => {
      const prevRewardsEarned = assertInt(childData?.rewardsEarned);
      const response = await apiUpdateChild(childId, {rewardsEarned : prevRewardsEarned + 1})
      console.log("response in updateChildData with rewardApproveSignal", response)
      setRewardApproveSignal(false);
    }

    if(rewardApproveSignal)
      updateChildData();

  }, [childData, childId, rewardApproveSignal])

  const handleRewardUndo = async (index : number) => {
    const rewardToUpdate = fetchedRewards[index];

    const response = await apiUpdateRewardClaim(rewardToUpdate.id, {isApproved: false, approvedAt: null, approvedBy: null, approvedByName : null})
    if(!response.ok){
      setStatus({success : "Error", message : "Could not perform action, something went wrong!"});
      setShowAlert(true);  
      return;
    }

    setrewardUnapproveSignal(true);
  }

  useEffect(() => {

    const updateChildData = async () => {
      const prevRewardsEarned = assertInt(childData?.rewardsEarned);
      const response = await apiUpdateChild(childId, {rewardsEarned : prevRewardsEarned - 1})
      console.log("response in updateChildData with rewardApproveSignal", response)
      setrewardUnapproveSignal(false);
    }

    if(rewardUnapproveSignal)
      updateChildData();

  }, [childData, childId, rewardApproveSignal, rewardUnapproveSignal])

  const handleRewardAddRemark = async (index: number, remark: { text: string, maker: string, date: string } | null) => {
    const rewardToUpdate = fetchedRewards[index];

    const response = await apiUpdateRewardClaim(rewardToUpdate.id, {approveComment: remark?.text, approveCommentDate: remark?.date })
    if(!response.ok){
      setStatus({success : "Error", message : "Could not perform action, something went wrong!"});
      setShowAlert(true);  
    }
     //send notification to child
     const notification : Notif = {
      title: "Parent has added a comment on a reward",
      content: `${rewardToUpdate.name}, ${rewardToUpdate.points} pts`,
      description: `${remark?.text}`,
      type: "reward_commented_by_parent",
    }
    
    const notifResponse = await apiSendNotification(userId, childId, "child" , notification);
    console.log("apiSendNotification response", notifResponse)
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

  useEffect(() => {
    setPages(() => [
      {
        type: 'tasks',
        content: (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
            {completedTasks.map((task, index) => (
              <div key={index} className="h-full">
                <TaskCard
                  cardType={userType === "child"? "task_done_childview" : "task_done"}
                  {...task}
                  child_name={childData?.name}
                  bgColor={getRandomBgColor()}
                  onModify={()=> {null}}
                  onRemove={()=>{null}}
                  onApprove={() => handleTaskApprove(index)}
                  onAssign={() => null}
                  onShowDetails={() => toggleShowTaskDetails(index)}
                  onAddComment={(remark) => handleTaskAddComment(index, remark)} 
                  onApprovalUndo={() => handleTaskUndo(index)}
                />
              </div>
            ))}
          </div>
        ),
      },
      {
        type: 'rewards',
        content: (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
            {fetchedRewards && fetchedRewards.map((reward, index) => (
              <RewardCard 
                type="reward_claimed"
                key={index}
                {...reward}
                onApprove={() => handleRewardApprove(index)}
                onUndo={() => handleRewardUndo(index)}
                onAddRemark={(remark) => handleRewardAddRemark(index, remark)} 
                onShowDetails={() => toggleShowRewardDetails(index)}
              />
            ))}
          </div>
        ),
      },
    ]);
  }, [completedTasks.length > 0, fetchedRewards.length > 0]);

  useEffect(() => {
    if (childData) {
      setPages((prevPages) => {
        // Filter out any existing object of type "details"
        const filteredPages = prevPages.filter(page => page.type !== 'details');
        return [
          ...filteredPages,
          {
            type: 'details',
            content: (
              <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
                <DetailCard
                  title="Added On"
                  value={
                    childData.created_at
                      ? format(new Date(childData.created_at), 'PPP')
                      : 'Unknown date'
                  }
                  icon={<FaCalendarAlt />}
                  bgColor="bg-gradient-to-r from-green-400 to-blue-500"
                />
                <DetailCard
                  title="Tasks Assigned"
                  value={childData.tasksAssigned ?? 'N/A'}
                  icon={<FaTasks />}
                  bgColor="bg-gradient-to-r from-pink-500 to-orange-500"
                />
                <DetailCard
                  title="Tasks Completed"
                  value={childData.tasksCompleted ?? 'N/A'}
                  icon={<FaCheckCircle />}
                  bgColor="bg-gradient-to-r from-purple-500 to-indigo-500"
                />
                <DetailCard
                  title="Total Points Earned"
                  value={childData.totalPoints ?? 0}
                  icon={<FaStar />}
                  bgColor="bg-gradient-to-r from-teal-400 to-cyan-500"
                />
                <DetailCard
                  title="Rewards Earned"
                  value={childData.rewardsEarned ?? 0}
                  icon={<FaGift />}
                  bgColor="bg-gradient-to-r from-blue-500 to-purple-500"
                />
                <DetailCard
                  title="Competence"
                  value={childData.competence ? capitalizeFirstLetter(childData.competence) : 'Unknown'}
                  icon={<FaUserShield />}
                  bgColor="bg-gradient-to-r from-yellow-500 to-red-500"
                />
              </div>
            ),
          },
        ];
      });
    }
  }, [childData]);
  
  useEffect(() => {
    if (completedTasks.length === 0) {
      setPages((prevPages: any[]) => prevPages.filter(page => page.type != "tasks"));
    }
  
    if (fetchedRewards.length === 0) {
      setPages((prevPages: any[]) => prevPages.filter(page => page.type != "rewards"));
    }
  }, [completedTasks.length, fetchedRewards.length]);
  
  if (!childData) {
    return <MainLoading numCards={6}/>;
  }

  return (
    <div className="flex flex-col md:flex-row sm:p-2 bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text rounded-lg shadow-lg" {...swipeHandlers}>
      <div className="flex flex-col items-center md:items-start md:w-1/2 lg:w-1/3 space-y-6 md:space-y-4 mb-6 md:mb-0">
        <div className="w-full max-w-3xl mb-2">
          <ProfileCard name={childData.name} age={childData.age} gender={childData.gender} level={childData.level} icon={childData.icon} currentPoints={childData.currentPoints} onEditProfile={toggleProfileModal} onAssignTasks={toggleTaskModal} />
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

    <div className="flex flex-col w-full md:w-2/3 space-y-6 md:ml-5 relative" {...swipeHandlers}>
      <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-6 mb-1">
        {pages[currentPage]? pages[currentPage].content : null}
      </div>
        {pages.length > 1 ? (
          <div className="flex flex-col w-full relative">
            <div className="flex justify-between items-center absolute top-0 left-0 right-0 transform -translate-y-1/2 z-10">
              <button
                className="text-light-primary dark:text-dark-primary hover:text-light-accent dark:hover:text-dark-accent focus:outline-none"
                onClick={handlePrevPage}
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
        ) : null}
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
          fetchedPendingTasks={pendingTasks}
          child={childData}
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