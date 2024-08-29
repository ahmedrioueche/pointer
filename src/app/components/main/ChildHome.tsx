import { apiGetTasksByChildId, apiUpdateTaskAssignment } from '@/lib/apiHelper';
import { Task } from '@/lib/interface';
import React, { useEffect, useState } from 'react';
import { TaskCard } from './tasks/TaskCard';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { fetcher } from '@/utils/helper';
import Alert from '../Alert';
import DetailsModal from './DetailsModal';

const ChildHome: React.FC<{ user: any }> = ({ user }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [status, setStatus] = useState<{ success: string; message: string }>();
  const [showAlert, setShowAlert] = useState(false);
  const [openedTask, setOpenedTask] = useState<Task>();
  const [showTaskDetails, setShowTaskDetails] = useState(false);

  const { data: tasksDB, error, mutate } = useSWR<any>(`/api/main/task/get-task-child-id`, (url) => fetcher(url, user.userId), {
    revalidateOnFocus: true, 
  });

  useEffect(() => {
    if (tasksDB && tasksDB.tasks) {
      const structuredTasks = tasksDB.tasks.map((task: any) => ({
        id: task.task.id,
        name: task.task.name,
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

      const incompleteTasks = structuredTasks.filter((task: { isCompleted: any; }) => !task.isCompleted);
      setTasks(incompleteTasks);
    }
  }, [tasksDB]);

  
  const handleAchievement = async (index : number) => {
    console.log("achioooooooooooooooeved!!")

    const achievedTask = tasks[index];

    const response = await apiUpdateTaskAssignment(achievedTask.id, {isCompleted: true, completionDate: new Date().toISOString()})
    if(!response.ok){
      setStatus({success : "Error", message : "Could not perform action, something went wrong!"});
      setShowAlert(true);  
    }
  }

  const handleAchievementUndo = async (index : number) => {
    console.log("undo achieved!!")

    const achievedTask = tasks[index];

    const response = await apiUpdateTaskAssignment(achievedTask.id, {isCompleted: false, completionDate: null})
    if(!response.ok){
      setStatus({success : "Error", message : "Could not perform action, something went wrong!"});
      setShowAlert(true);  
    }
  }

  const handleChildComment = async (index: number, comment: { text: string, maker: string, date: string } | null) => {
    const taksToUpdate = tasks[index];

    const response = await apiUpdateTaskAssignment(taksToUpdate.id, {createdForComment: comment?.text, createdForommentDate: comment?.date })
    if(!response.ok){
      setStatus({success : "Error", message : "Could not perform action, something went wrong!"});
      setShowAlert(true);  
    }
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
    <div className='p-3'>
      <div className="lg:col-span-2">
        <div className="col-span-1 lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {tasks && tasks.map((task, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full" 
              >
                <TaskCard
                  type="task_assignment"
                  {...task}
                  child_name={user.username}
                  onAchieved={() => {handleAchievement(index)}}
                  onAchievementUndo={() => {handleAchievementUndo(index)}}
                  onAddChildComment={(comment) => {handleChildComment(index, comment)}}
                  onShowDetails={() => toggleShowTaskDetails(index)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      <DetailsModal  
          task={openedTask}
          reward={undefined}
          isOpenOnTask={showTaskDetails}
          isOpenOnReward={false}
          onClose={closeModal}/>

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
