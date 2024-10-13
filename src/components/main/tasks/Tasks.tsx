'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TaskCard } from './TaskCard';
import { Notif, Task } from '@/types/interface';
import { CreateTask } from './CreateTask';
import { fetcher, generateUniqueId } from '@/utils/helper';
import useSWR from 'swr';
import { apiAddTask, apiAssignTask, apiDeleteTask, apiSendNotification, apiUpdateTask } from '@/lib/apiHelper';
import KidsModal from '../modals/KidsModal';
import Alert from '../../Alert';
import { useData } from '@/app/context/dataContext';
import ChildTasks from './ChildTasks';

const Tasks: React.FC = (user : any) => {

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>();
  const [isKidsModalOpen, setIsKidsModalOpen] = useState(false);
  const [taskToAssign, setTaskTosAssign] = useState<Task>();
  const [showAlert, setShowAlert] = useState(false);
  const [status, setStatus] = useState<{ success: string; message: string; bg? : string}>();
  const [children, setChildren] = useState<any>([]);

  const userId = user? user.user.id : undefined;
  const userType = user? user.user.type : undefined;
  const childrenContext = useData();

  useEffect(() => {
    if (childrenContext) {
      setChildren(childrenContext.children);
    }
  }, [childrenContext]);
  
  const { data: data, error, mutate } = useSWR('/api/main/task/get-task-parent-id', (url) => fetcher(url, userId), {
    revalidateOnFocus: true, 
  });

  useEffect(() => {
    if(data){
      const fetchedTasks = data.tasks
      if (Array.isArray(fetchedTasks)) {
        const filteredTasks = fetchedTasks.filter((task: any) => task.type !== "routine");  
        const sortedTasks = filteredTasks.sort(
          (a: any, b: any) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()
        );  
        setTasks(sortedTasks);
      }
    }
  }, [data]);

  const addTask = async (newTask: Task) => {
    newTask = {...newTask, creatorId: userId}

    if (selectedTask) {
      const selectedTaskId = selectedTask.id;
      const response = await apiUpdateTask(selectedTaskId, {...newTask, id: selectedTaskId});
      console.log("response", response)
      setTasks(
        tasks?.map((task) =>
          task.id === selectedTask.id ? {...newTask, id: selectedTaskId} : task
        ) 
      );

        setSelectedTask(null);

    } else {

        const tempId = generateUniqueId();
        const tempTask = { ...newTask, id: tempId };
        tasks ? setTasks([tempTask, ...tasks]) : setTasks([tempTask]);

        const response = await apiAddTask(newTask);
        console.log("response", response)

        const taskId = response.id;
        setTasks((prevTasks) =>
            prevTasks?.map((task) =>
                task.id === tempId ? { ...task, id: taskId } : task
            )
        );
    }
  };

  const modifyTask = (index: number) => {
    tasks? setSelectedTask(tasks[index]) : null;
  };

  const removeTask = async (index: number) => {
    const taskToDelete = tasks? tasks[index] : undefined;
    setTasks(tasks?.filter((_, i) => i !== index));
    let response;
    if(taskToDelete){
      response = await apiDeleteTask(taskToDelete.id);
      console.log("response", response)
    }
  };

  const assignTask = async (childId: number | undefined, isAssignedToAll : boolean) => {
    let response; const childName = getChildName(childId);
    let newTask : any = { ...taskToAssign, creatorId: userId, creatorName: "Parent"};
    console.log("newTask", newTask)
    if(newTask && childId){
      response = await apiAssignTask(newTask, childId);
    }

    console.log("response", response)
    if(response.status !== 200){
      setStatus({success: "Could not assign task", message: `Task already assigned to  ${childName ? childName : "child"}!`})
      setShowAlert(true);
      setTimeout(() => setShowAlert(false), 3000); 
    } 
    else {
      setStatus({success: "Done!", message: `Task was assigned to ${isAssignedToAll? "all children" : childName ? childName : "child"} succesfully!`, bg: "bg-blue-500"})
      setShowAlert(true);
      setTimeout(() => {
        setShowAlert(false);
        isAssignedToAll? setIsKidsModalOpen(false) : null;
      }, 3000); 

      childrenContext.triggerFetch();

      //send notification to child
      const notification : Notif = {
        title: "A new task has been assigned to you",
        content: `${newTask.name}, ${newTask.points} pts`,
        description: `${newTask.description}`,
        type: "task_assigned",
      }
      
      const response = await apiSendNotification(userId, childId, "child" , notification);
      console.log("apiSendNotification response", response)
    }
  };

  const handleAssignTask = (index : number) => {
    const taskToAssign = tasks? tasks[index] : null;
    if(taskToAssign){
      setTaskTosAssign(taskToAssign);
    }
    setIsKidsModalOpen(true);
  }

  const getChildName = (id: number | undefined): string | undefined => {
    if (id) {
      const child = children.find((child: any) => child.id === id);
      return child?.name;
    }
    return undefined;
  };  

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  return (
    <>  
      {userType === "child" ? (
        <ChildTasks user={user.user} />
      ) : (
        <div className="w-full min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-2">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="col-span-1 lg:col-span-1 w-full">
                <CreateTask taskToEdit={selectedTask} type="task_page" onCreate={addTask} />
              </div>
            </div>
            <div className="lg:col-span-2">
              <div className="col-span-1 lg:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tasks && tasks?.map((task, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <TaskCard
                        cardType="task_page"
                        {...task}
                        onModify={() => modifyTask(index)}
                        onRemove={() => removeTask(index)}
                        onApprove={() => null}
                        onAssign={() => null}
                        onTaskPageAssign={() => handleAssignTask(index)}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
  
          <KidsModal
            isOpen={isKidsModalOpen}
            onAssignTask={(childId, isAssignedToAll) => assignTask(childId, isAssignedToAll)}
            onClose={() => setIsKidsModalOpen(false)}
          >
            {showAlert && (
              <Alert
                title={status?.success}
                message={status?.message}
                bg={status?.bg}
                onClose={handleAlertClose}
              />
            )}
          </KidsModal>
        </div>
      )}
    </>
  );
}
  export default Tasks;
