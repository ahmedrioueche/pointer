import React, { useState } from 'react';
import { FaCalendarAlt, FaClipboardList, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { CreateTask } from './CreateTask';
import { TaskCard } from './TaskCard';
import { TaskCardIf } from '@/lib/interface';
import PendingTasks from './PendingTasks';
import { bgColors } from '@/data/style';

interface MenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const Menu: React.FC<MenuProps> = ({
  isOpen,
  onClose,
}) => {
  const [pendingTasks, setPendingTasks] = useState<TaskCardIf[]>([
    { title: "Make the bed", points: 10, creation_date: "2024-08-21T09:00", due_date: "2024-08-21T10:00", approval_date: "2024-08-21T15:00", icon: FaCalendarAlt, bgColor: bgColors[0] },
    { title: "Do homework", points: 10, creation_date: "2024-08-21T10:00", due_date: "2024-08-21T11:00", approval_date: "2024-08-21T15:00", icon: FaCalendarAlt, bgColor: bgColors[1] },
    { title: "Buy groceries", points: 10, creation_date: "2024-08-21T11:00", due_date: "2024-08-21T12:00", approval_date: "2024-08-21T15:00",icon: FaCalendarAlt, bgColor: bgColors[2] },
  ]);
  
  const [tasks, setTasks] = useState<TaskCardIf[]>([
    { title: "Make the bed", points: 10, creation_date: "2024-08-21T12:00", due_date: "2024-08-21T13:00", approval_date: "2024-08-21T15:00", icon: FaClipboardList, bgColor: bgColors[0] },
    { title: "Do homework", points: 10, creation_date: "2024-08-21T13:00", due_date: "2024-08-21T14:00", approval_date: "2024-08-21T15:00",  icon: FaClipboardList, bgColor: bgColors[1] },
    { title: "Buy groceries", points: 10, creation_date: "2024-08-21T14:00", due_date: "2024-08-21T15:00", approval_date: "2024-08-21T15:00",  icon: FaClipboardList, bgColor: bgColors[2] },
    { title: "Walk the dog", points: 10, creation_date: "2024-08-21T15:00", due_date: "2024-08-21T16:00", approval_date: "2024-08-21T15:00", icon: FaClipboardList, bgColor: bgColors[3] },
    { title: "Clean the house", points: 10, creation_date: "2024-08-21T16:00", due_date: "2024-08-21T17:00",  approval_date: "2024-08-21T15:00", icon: FaClipboardList, bgColor: bgColors[4] },
    { title: "Prepare dinner", points: 10, creation_date: "2024-08-21T17:00", due_date: "2024-08-21T18:00", approval_date: "2024-08-21T15:00", icon: FaClipboardList, bgColor: bgColors[5] },
    { title: "Read a book", points: 10, creation_date: "2024-08-21T18:00", due_date: "2024-08-21T19:00", approval_date: "2024-08-21T15:00", icon: FaClipboardList, bgColor: bgColors[6] },
  ]);
  
  
  const assignTask = (newTask: TaskCardIf) => {
    setPendingTasks([newTask, ...pendingTasks]); 
  };

  const modifyTask = (index: number) => {
    console.log("Modify task:", index);
  };

  const removeTask = (index: number) => {
    setPendingTasks(pendingTasks.filter((_, i) => i !== index));
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 transition-transform duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 max-w-[97vw] w-full h-full max-h-[98vh] overflow-y-auto task-menu">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-light-text dark:text-dark-text">
            <FaClipboardList className="text-3xl mr-3" />
            <h2 className="text-xl font-stix">Tasks</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-gray-700"
          >
            <FaTimes size={16} />
          </button>
        </div>
        
       {/* Top row: CreateTask and PendingTasks */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="col-span-1 md:col-span-1 lg:col-span-1 mt-2">
          <CreateTask type="task_menu" onCreate={assignTask} />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-2">
          <PendingTasks
            tasks={pendingTasks}
            onModify={modifyTask}
            onRemove={removeTask}
          />
        </div>
      </div>


        {/* Bottom row: Tasks list */}
        <div className="grid grid-cols-1 gap-4 mt-4 md:grid-cols-4">
          {tasks.map((task, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <TaskCard
                type="task_menu"
                {...task}
                onModify={() => null}
                onRemove={() => null}
                onAction={() => null}
                onAssign={() => assignTask(task)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Menu;
