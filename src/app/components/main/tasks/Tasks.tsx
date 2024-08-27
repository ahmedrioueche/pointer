'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TaskCard } from './TaskCard';
import { Task } from '@/lib/interface';
import { CreateTask } from './CreateTask';
import { fetcher, generateUniqueId } from '@/utils/helper';
import useSWR from 'swr';
import { apiAddTask, apiDeleteTask, apiUpdateTask } from '@/lib/apiHelper';

const Tasks: React.FC = (user : any) => {

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>();

  const userId = user? user.user.userId : undefined;

  const { data: data, error, mutate } = useSWR('/api/main/task/get-task-parent-id', (url) => fetcher(url, userId), {
    revalidateOnFocus: true, 
  });

  useEffect(() => {
    if(data){
      const fetchedTasks = data.tasks
      if (Array.isArray(fetchedTasks)) {
        const notApprovedTasks = fetchedTasks.filter((task : Task) => ( !task.assignedTo && !task.isApproved ));
        setTasks(notApprovedTasks);
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

  return (
    <div className="w-full min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-8">
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
                    type='task_page'
                    {...task}
                    onModify={() => modifyTask(index)}
                    onRemove={() => removeTask(index)}
                    onApprove={() => null}
                    onAssign={() => null}
                  />
                </motion.div>
              ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};






export default Tasks;
