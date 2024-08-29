import React, { useEffect, useState } from 'react';
import { FaClipboardList, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { CreateTask } from './CreateTask';
import { TaskCard } from './TaskCard';
import { Task } from '@/lib/interface';
import PendingTasks from './PendingTasks';
import { generateUniqueId } from '@/utils/helper';
import { apiAddTask as apiAddTask, apiAssignTask, apiDeleteTask, apiUnAssignTask, apiUpdateTask } from '@/lib/apiHelper';
import MainLoading from '../MainLoading';

interface TaskModalProps {
  parent_id: number;
  child_id: number;
  fetchedPendingTasks: Task[] | undefined;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({
  parent_id,
  child_id: childId,
  fetchedPendingTasks,
  isOpen,
  onClose,
  onUpdate,
}) => {

  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);  
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    if(fetchedPendingTasks){
      setPendingTasks(fetchedPendingTasks);
    }
    
    setLoading(false);
    
  }, [isOpen]);
  
  if (loading) return <MainLoading numCards={3}/>;


  const assignTask = async (newTask: Task) => {
   
    newTask = { ...newTask, creatorId: parent_id, creatorName: "Parent",};

    if (selectedTask) {
      const selectedTaskId = selectedTask.id;
      const response = await apiUpdateTask(selectedTaskId, {...newTask, id: selectedTaskId});

      setPendingTasks(
        pendingTasks.map((task) =>
          task.id === selectedTask.id ? {...newTask, id: selectedTaskId} : task
        ) 
      );
      setSelectedTask(null); 
      
      console.log("response", response)
      onUpdate();

    } else {
      const tempId = generateUniqueId();
      const tempTask = { ...newTask, id: tempId };
      tasks ? setPendingTasks([tempTask, ...pendingTasks]) : setPendingTasks([tempTask]);

      const response = await apiAssignTask(newTask, childId);
      console.log("response", response)

      const taskId = response.id;
      setPendingTasks((prevTasks) =>
          prevTasks?.map((task) =>
              task.id === tempId ? { ...task, id: taskId } : task
          )
      );
      onUpdate();
    }
  };

  const modifyTask = (index: number) => {
    setSelectedTask(pendingTasks[index]);
  };

  const removeTask = async (index: number) => {
    console.log("index", index)
    console.log("pendingTasks in removeTasks", pendingTasks)
    const taskToDelete = pendingTasks[index];
    console.log("taskToDelete", taskToDelete)
    setPendingTasks(pendingTasks.filter((_, i) => i !== index));

    const response = taskToDelete.id? await apiUnAssignTask(taskToDelete.id, childId) : null;
    console.log("response in removeTask", response)

    onUpdate();
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
        
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="col-span-1 md:col-span-1 lg:col-span-1 flex flex-col justify-between">
            <div className="h-full">
              <CreateTask taskToEdit={selectedTask} type="task_menu" onCreate={assignTask} />
            </div>
          </div>
          <div className="col-span-1 md:col-span-2 lg:col-span-2 flex flex-col justify-between">
            <div className="h-full">
              <PendingTasks
                tasks={pendingTasks}
                onModify={modifyTask}
                onRemove={removeTask}
                onClose={() => null}
              />
            </div>
          </div>
      </div>
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
                onApprove={() => null}
                onAssign={() => assignTask(task)}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
