import React, { useEffect, useState } from 'react';
import { FaClipboardList, FaTimes } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { CreateTask } from './CreateTask';
import { TaskCard } from './TaskCard';
import { Child, Notif, Task } from '@/types/interface';
import PendingTasks from './PendingTasks';
import { generateUniqueId } from '@/utils/helper';
import { apiAddTask as apiAddTask, apiAssignTask, apiDeleteTask, apiSendNotification, apiUnAssignTask, apiUpdateTask } from '@/lib/apiHelper';
import MainLoading from '../MainLoading';

interface TaskModalProps {
  child: Child;
  fetchedPendingTasks?: Task[] | undefined;
  isOpen?: boolean;
  onClose: () => void;
  onUpdate?: () => void;
  type?: string; 
  routineTime?:string;
  bgColor?:string;
}

const TaskModal: React.FC<TaskModalProps> = ({
  child,
  fetchedPendingTasks,
  isOpen,
  routineTime: time,
  onClose,
  onUpdate,
  type, 
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
  }, [isOpen, fetchedPendingTasks]);

  if (loading) return <MainLoading numCards={3} />;

  const assignTask = async (newTask: Task, TaskType : string | undefined) => {
    newTask = { ...newTask, creatorId: child.parent_id, creatorName: "Parent"};

    if (selectedTask) { // Modify task
      const selectedTaskId = selectedTask.id;
      const response = await apiUpdateTask(selectedTaskId, {...newTask, id: selectedTaskId});

      setPendingTasks(
        pendingTasks.map((task) =>
          task.id === selectedTask.id ? {...newTask, id: selectedTaskId} : task
        )
      );
      setSelectedTask(null); 
    } else { // Create a new task
      const tempId = generateUniqueId();
      const tempTask = { ...newTask, id: tempId, type: TaskType };
      tasks ? setPendingTasks([tempTask, ...pendingTasks]) : setPendingTasks([tempTask]);

      const response = child.id? await apiAssignTask(tempTask, child.id) : null;
      if(type === 'create_only'){
        onClose()
      }
      const taskId = response.id;
      setPendingTasks((prevTasks) =>
        prevTasks?.map((task) =>
          task.id === tempId ? { ...task, id: taskId } : task
        )
      );

      const notification: Notif = {
        title: "A new task has been assigned to you",
        content: `${newTask.name}, ${newTask.points} pts`,
        description: `${newTask.description}`,
        type: "task_assigned",
      };
      
      if (child.parent_id && type !== "create_only") {
        await apiSendNotification(child.parent_id, child.id, "child", notification);
      }
    }
    onUpdate? onUpdate() : null;
  };

  const modifyTask = (index: number) => {
    setSelectedTask(pendingTasks[index]);
  };

  const removeTask = async (index: number) => {
    const taskToDelete = pendingTasks[index];
    setPendingTasks(pendingTasks.filter((_, i) => i !== index));

    if (taskToDelete.id) {
      child.id? await apiUnAssignTask(taskToDelete.id, child.id) : null;
    }
    onUpdate? onUpdate() : null;
  };

  const defaultBgColor = 'bg-gradient-to-br from-blue-500 to-blue-400';
 
  return (
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 transition-transform duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}
    >
      <div className={`bg-white rounded-lg shadow-lg p-4 ${defaultBgColor} ${type === "create_only"? `md:max-w-[50vw]` : 'max-w-[97vw]'} w-full h-full max-h-[98vh] overflow-y-auto task-menu`}>
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

        {type === 'create_only' ? (
          <div className='mt-10'>
           <CreateTask taskToEdit={selectedTask} routineTime={time} bgColor={''} type="routine" onCreate={assignTask} />
          </div>
        ) : (
          <>
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
                    cardType="task_menu"
                    {...task}
                    onModify={() => null}
                    onRemove={() => null}
                    onApprove={() => null}
                    onAssign={() => assignTask(task, '')}
                  />
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TaskModal;
