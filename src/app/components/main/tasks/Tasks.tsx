'use client';

import React, { useState } from 'react';
import {FaCalendarAlt, FaClipboardList } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { TaskCard } from './TaskCard';
import { TaskCardIf } from '@/lib/interface';
import { CreateTask } from './CreateTask';
import { bgColors } from '@/data/style';


const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<TaskCardIf[]>([
    { title: "Make the bed", points: 10, creation_date: "2024-08-21T12:00", due_date: "2024-08-21T13:00", icon: FaClipboardList, bgColor: bgColors[0] },
    { title: "Do homework", points: 10, creation_date: "2024-08-21T13:00", due_date: "2024-08-21T14:00", icon: FaClipboardList, bgColor: bgColors[1] },
    { title: "Buy groceries", points: 10, creation_date: "2024-08-21T14:00", due_date: "2024-08-21T15:00", icon: FaClipboardList, bgColor: bgColors[2] },
    { title: "Walk the dog", points: 10, creation_date: "2024-08-21T15:00", due_date: "2024-08-21T16:00", icon: FaClipboardList, bgColor: bgColors[3] },
    { title: "Clean the house", points: 10, creation_date: "2024-08-21T16:00", due_date: "2024-08-21T17:00", icon: FaClipboardList, bgColor: bgColors[4] },
    { title: "Prepare dinner", points: 10, creation_date: "2024-08-21T17:00", due_date: "2024-08-21T18:00", icon: FaClipboardList, bgColor: bgColors[5] },
    { title: "Read a book", points: 10, creation_date: "2024-08-21T18:00", due_date: "2024-08-21T19:00", icon: FaClipboardList, bgColor: bgColors[6] },
  ]);
  
  const addTask = (newTask: TaskCardIf) => {
    setTasks([newTask, ...tasks]); // Prepend new task
  };

  const modifyTask = (index: number) => {
    // Logic to modify the task
    console.log("Modify task:", index);
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const actionTask = (index: number) => {
    // Logic for task action (e.g., mark as done)
    console.log("Action task:", index);
  };

  return (
    <div className="w-full min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
           <div className="col-span-1 lg:col-span-1 w-full">
             <CreateTask type="task_page" onCreate={addTask} />
          </div>
        </div>
        <div className="lg:col-span-2">
          <div className="col-span-1 lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasks.map((task, index) => (
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
                    onAction={() => actionTask(index)}
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
