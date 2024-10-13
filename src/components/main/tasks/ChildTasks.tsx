import { apiSendNotification, apiUpdateTaskAssignment } from '@/lib/apiHelper';
import { Notif, Task } from '@/types/interface';
import React, { useEffect, useState } from 'react';
import { TaskCard } from './TaskCard';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { fetcher } from '@/lib/helper';
import Alert from '../../Alert';
import DetailsModal from '../modals/DetailsModal';
import { useData } from '@/app/context/dataContext';
import AnimeDancing from '../AnimeDancing';

const ChildHome: React.FC<{ user: any }> = ({ user }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<{ success: string; message: string }>();
  const [showAlert, setShowAlert] = useState(false);
  const [openedTask, setOpenedTask] = useState<Task>();
  const [showTaskDetails, setShowTaskDetails] = useState(false);
  const [children, setChildren] = useState<any>([]);
  const [currentChildData, setCurrentChildData] = useState<any>([]);

  let userId: number | undefined = undefined;
  if(user){
    userId = user.id;
  }

  const { data: tasksDB, error, mutate } = useSWR<any>(`/api/main/task/get-task-child-id`, (url) => fetcher(url, userId), {
    revalidateOnFocus: true, 
  });

  //structure tasks
  useEffect(() => {
    if (tasksDB && tasksDB.tasks) {
      console.log("tasksDB.tasks", tasksDB.tasks)
      const structuredTasks = tasksDB.tasks.map((task: any) => ({
        id: task.task.id,
        name: task.task.name,
        type: task.task.type,
        description: task.task.description,
        creatorId: task.task.creatorId,
        creatorName: task.task.creatorName,
        points: task.task.points,
        dueDate: task.dueDate,
        assignmentDate: task.assignmentDate,
        completionDate: task.completionDate,
        isCompleted: task.isCompleted,
        isApproved: task.isApproved,
        approvedBy: task.approvedBy,
        approvedByName: task.approvedByName,
        assignedBy: task.assignedBy,
        assignedByName: task.assignedByName,
        createdForComment: task.createdForComment,
        creatorComment: task.creatorComment,
        creatorCommentDate: task.creatorCommentDate,
        attachedFiles: task.attachedFiles,
      }));

      const filteredTasks = structuredTasks.filter((task: { isCompleted: any, type: any }) => !task.isCompleted && task.type !== "routine");
      setTasks(filteredTasks);
    }
  }, [tasksDB]);

  //get current child's data
  const childrenContext = useData();

  useEffect(() => {
      setChildren(childrenContext.children);
  },[childrenContext])

  useEffect(() => {
    if(children && children.length > 0){
      const childData = children.filter((child : any) => child.id === userId)
      setCurrentChildData(childData.length > 0 ? childData[0] : null);
    }
    
  }, [children, userId])
  
  const handleAchievement = async (index : number) => {
    const achievedTask = tasks[index];
    const response = userId? await apiUpdateTaskAssignment(achievedTask.id, userId, {isCompleted: true, completionDate: new Date().toISOString()}) : null;
    if(!response?.ok){
      setStatus({success : "Error", message : "Could not perform action, something went wrong!"});
      setShowAlert(true);  
    }

     //send notification to parent
     const notification : Notif = {
      title: `${currentChildData.name} just completed a task!`,
      content: `${achievedTask.name}, ${achievedTask.points} pts`,
      description: `${achievedTask.description}`,
      type: "task_completed"
    }

    console.log("currentChildData", currentChildData);
    
    const notifResponse = await apiSendNotification(currentChildData.id, currentChildData.parentId , "parent" , notification);
    console.log("apiSendNotification response", notifResponse)
  }

  const handleAchievementUndo = async (index : number) => {
    const achievedTask = tasks[index];
    const response = userId? await apiUpdateTaskAssignment(achievedTask.id, userId, {isCompleted: false, completionDate: null}) : null;
    if(!response?.ok){
      setStatus({success : "Error", message : "Could not perform action, something went wrong!"});
      setShowAlert(true);  
    }
  }

  const handleChildComment = async (index: number, comment: { text: string, maker: string, date: string } | null) => {
    const taskToUpdate = tasks[index];
    const response = userId? await apiUpdateTaskAssignment(taskToUpdate.id, userId, {createdForComment: comment?.text, createdForommentDate: comment?.date }) : null;
    if(!response?.ok){
      setStatus({success : "Error", message : "Could not perform action, something went wrong!"});
      setShowAlert(true);  
    }
    
     //send notification to parent
    const notification : Notif = {
      title: `${currentChildData.name} just commented on a task!`,
      content: `${taskToUpdate.name} ${taskToUpdate.points} pts `,
      description: `${taskToUpdate.description}`,
      type: "task_commented_by_child"
    }

    console.log("currentChildData", currentChildData);
    
    const notifResponse = await apiSendNotification(currentChildData.id, currentChildData.parentId , "parent" , notification);
    console.log("apiSendNotification response", notifResponse)
  }

  const toggleShowTaskDetails = (index : number) => {
    const openedTask : Task = tasks[index];
    setOpenedTask(openedTask);
    setShowTaskDetails(!showTaskDetails);
  }
  
  const closeModal = () => {
    setShowTaskDetails(false);
  }
  
  const handleAlertClose = () => {
    setShowAlert(false);
  };
  return (
    <div className='relative p-2'>
      {tasks && tasks.length > 0 ? (
        <div className="lg:col-span-2">
          <div className="col-span-1 lg:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tasks.map((task, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-full" 
                >
                  <TaskCard
                    cardType="task_assignment"
                    {...task}
                    child_name={user.username}
                    onAchieved={() => { handleAchievement(index); }}
                    onAchievementUndo={() => { handleAchievementUndo(index); }}
                    onAddChildComment={(comment) => { handleChildComment(index, comment); }}
                    onShowDetails={() => toggleShowTaskDetails(index)}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <AnimeDancing text='No Tasks for now! Hurray!'/>
        </div>
      )}
      
      <DetailsModal  
        task={openedTask}
        reward={undefined}
        isOpenOnTask={showTaskDetails}
        isOpenOnReward={false}
        onClose={closeModal}
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
export default ChildHome;
