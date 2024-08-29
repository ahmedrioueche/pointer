import React from 'react';
import { FaHourglassStart } from 'react-icons/fa';
import { TaskCard } from './TaskCard';
import {  Task } from '@/lib/interface';
import { bgColors } from '@/data/style';
import { getRandomBgColor } from '@/utils/helper';

interface PendingTasksProps {
  tasks: Task[];
  onModify: (index: number) => void;
  onRemove: (index: number) => void;
  onClose: () => void;
}

const PendingTasks: React.FC<PendingTasksProps> = ({
  tasks,
  onModify,
  onRemove,
  onClose,
}) => {

  return(
    <div className="font-stix bg-gradient-to-r from-purple-800 via-blue-800 to-blue-900 border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-6 min-h-full flex flex-col">
      <div className="flex items-center mb-6">
        <FaHourglassStart className="text-4xl text-indigo-500 dark:text-indigo-300 mr-4" />
        <h2 className="text-2xl font-semibold text-dark-text">Pending Tasks</h2>
      </div>
      
      {/* Grid layout for tasks */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 flex-grow">
        {tasks.length === 0 ? (
          <span className='text-dark-text dark:text-dark-text font-satisfy'>Pending Tasks will be shown here</span>
        ) : (
          tasks.map((task, index) => (
            <TaskCard
              key={index}
              type="task_pending"
              {...task}
              onModify={() => onModify(index)}
              onRemove={() => onRemove(index)}
              onApprove={() => null}
              onAssign={() => null}
            />
          ))
        )}
      </div>
      
    </div>
  );
}
export default PendingTasks;
