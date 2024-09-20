import React, { useEffect, useState } from 'react';
import { FaClipboardList, FaTimes } from 'react-icons/fa';
import useSWR from 'swr';
import { fetcher } from '@/utils/helper';
import { Task } from '@/types/interface';
import { TaskCard } from '../tasks/TaskCard';
import { motion } from 'framer-motion';

interface KidsModalProps {
  user : any,
  isOpen: boolean;
  onAssignTask: (childId: number | undefined,  isAssignedToAll : boolean) => void;
  onClose: () => void;
  children?: React.ReactNode;
}

const CustomizeModal: React.FC<KidsModalProps> = ({ user, isOpen, onAssignTask, onClose, children }) => {
    const [tasks, setTasks] = useState<Task[]>()
    const userId = user? user.user.userId : undefined;
    
    const { data: data, error, mutate } = useSWR('/api/main/task/get-task-parent-id', (url) => fetcher(url, userId), {
        revalidateOnFocus: true, 
    });
      
    useEffect(() => {
        if(data){
          const fetchedTasks = data.tasks
          if (Array.isArray(fetchedTasks)) {
            const sortedTasks = fetchedTasks.sort((a: any, b: any) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime());
            setTasks(sortedTasks);
          }
        }
    }, [data]);

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 transition-transform duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-full md:w-[60vw] lg:w-[60vw] max-h-[98vh] overflow-y-auto flex flex-col task-menu">
        <div className="flex justify-between items-center mb-3 p-3">
          <div className="flex items-center text-light-text dark:text-dark-text">
            <FaClipboardList className="text-3xl mr-2" />
            <h2 className="text-xl font-stix mt-1">Set Reward for specific task/s</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-light-text hover:text-dark-text"
          >
            <FaTimes size={16} />
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tasks && tasks?.map((task, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <TaskCard
                    cardType='task_customize'
                    {...task}
                  />
                </motion.div>
              ))}
             </div>
        {children}
      </div>
    </div>
  );
};

export default CustomizeModal;
