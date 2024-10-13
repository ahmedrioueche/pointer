import { FaTimes } from 'react-icons/fa';
import { TaskCard } from '../tasks/TaskCard';
import { apiDeleteTask, apiUpdateTask, apiUpdateTaskAssignment } from '@/lib/apiHelper';
import { Task } from '@/types/interface';

interface TaskDetailsModalProps {
  isOpen: boolean;
  task: any; 
  child:any;
  clickedTimeSlot:any;
  type?: "task_details" | "task_details_childview";
  onClose?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onUpdate?:() => void;
}

const TaskDetailsModal: React.FC<TaskDetailsModalProps> = ({ isOpen, task, child, clickedTimeSlot, type, onClose, onEdit, onDelete, onUpdate}) => {
  if (!isOpen) return null;
  
  const dayToExclude = clickedTimeSlot.split('-')[1];
  const routineExceptions = task.routineExceptions || ''; 
  console.log("task:", task);

  const handleExcludeTask = async (dayToExclude: string) => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; 
  
    const currentExceptions = routineExceptions ? routineExceptions.split(',').map((day : any) => day.trim()) : [];
  
    if (!currentExceptions.includes(dayToExclude)) {
      const updatedRoutineExceptions = [...currentExceptions, dayToExclude].join(',');
  
      const response = await apiUpdateTaskAssignment(task.taskId, child.id, {
        routineExceptions: updatedRoutineExceptions,
        dayToExclude,
      });
    
      const allDaysExcluded = daysOfWeek.every(day => updatedRoutineExceptions.includes(day));
  
      if (allDaysExcluded) {
        const deleteResponse = await apiDeleteTask(task.id);
        console.log("Task deleted:", deleteResponse);
      }
    } else {
      console.log(`${dayToExclude} is already in routineExceptions.`);
    }
    
    onUpdate ? onUpdate() : null;
    onClose ? onClose() : null;
  };
  

  const handleModify = async (newTask : Task) => {
    newTask = { ...newTask, creatorId: child.parentId, creatorName: "Parent"};
    const response = await apiUpdateTask(task.id, {...newTask, id: task.id});
    console.log("response", response);
  }
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="w-full max-w-lg bg-transparent p-6 text-dark-text dark:text-dark-text relative max-h-[80vh] overflow-y-auto transform transition-transform scale-100 animate-fadeIn">
        <TaskCard 
          cardType={type} 
          {...task}
          onClose={onClose}
          onModify={handleModify}
          onRemove={() => handleExcludeTask(dayToExclude)}
        />
      </div>
    </div>
  );
};

export default TaskDetailsModal;
