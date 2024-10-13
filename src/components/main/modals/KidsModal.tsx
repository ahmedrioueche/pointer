import React, { useEffect, useState } from 'react';
import { FaClipboardList, FaTimes } from 'react-icons/fa';
import { useData } from '@/app/context/dataContext';
import ChildCardHori from '../child/ChildCardHori';

interface KidsModalProps {
  isOpen: boolean;
  onAssignTask: (childId: number | undefined,  isAssignedToAll : boolean) => void;
  onClose: () => void;
  children?: React.ReactNode;
}

const KidsModal: React.FC<KidsModalProps> = ({ isOpen, onAssignTask, onClose, children }) => {
  const [childrenData, setChildrenData] = useState<any>([]);
  const { children: childrenFromContext } = useData();

  useEffect(() => {
    if (childrenFromContext) {
      setChildrenData(childrenFromContext);
    }
  }, [childrenFromContext]);

  const handleAssignTask = (childId?: number) => {
    onAssignTask ? onAssignTask(childId, false) : null;
  };

  const handleAssignToAll = () => {
    childrenData.forEach((child: any) => {
      onAssignTask(child.id, true);
    });
  };

  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 transition-transform duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 w-full md:w-[30vw] lg:w-[40vw] max-h-[98vh] overflow-y-auto flex flex-col task-menu">
        <div className="flex justify-between items-center mb-3 p-3">
          <div className="flex items-center text-light-text dark:text-dark-text">
            <FaClipboardList className="text-3xl mr-2" />
            <h2 className="text-xl font-stix">Assign Task</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-light-text hover:text-dark-text"
          >
            <FaTimes size={16} />
          </button>
        </div>

        <div className="flex flex-col gap-2">
          {childrenData.map((child: any) => (
            <ChildCardHori
              type="task_page"
              key={child.id}
              id={child.id}
              name={child.name}
              age={child.age}
              gender={child.gender}
              avatar={child.avatar}
              pendingTasks={child.pendingTasks}
              callback={handleAssignTask}
            />
          ))}
        </div>
        {childrenData.length > 1 &&  (
          <button
            onClick={handleAssignToAll}
            className="mt-2 py-2 px-4 font-stix bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-colors duration-300 self-center"
          >
            Assign to All
         </button>
        )} 
  
        {children}
      </div>
    </div>
  );
};

export default KidsModal;
