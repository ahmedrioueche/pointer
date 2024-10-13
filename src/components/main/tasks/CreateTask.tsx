import { capitalizeFirstLetter } from "@/lib/formater";
import { Task } from "@/types/interface";
import { useEffect, useRef, useState } from "react";
import { FaCalendarAlt, FaClipboardList, FaEdit, FaPlus, FaUserPlus } from "react-icons/fa";
import Alert from "../../Alert";

interface CreateTaskProps {
  type: "task_page" | "task_menu" | "task_pending" | "task_done" | "routine" ; 
  bgColor?:string;
  onCreate: (task: Task, type?:string) => void;
  taskToEdit: Task | null;
  routineTime?:string;
}

export const CreateTask: React.FC<CreateTaskProps> = ({ type, bgColor, routineTime, onCreate, taskToEdit}) => {
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskPoints, setNewTaskPoints] = useState<string | number | undefined>(10);
  const [newTaskDueDate, setNewTaskDueDate] = useState<string | undefined>();
  const [newTaskDesc, setNewTaskDesc] = useState<string | undefined>();
  const [showAlert, setShowAlert] = useState(false);
  const [status, setStatus] = useState<{ success: string; message: string; bg? : string}>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto'; 
      textarea.style.height = `${textarea.scrollHeight}px`; 
    }
  }, [newTaskDesc]);

  useEffect(() => {
    if (taskToEdit) {
      setNewTaskTitle(taskToEdit.name);
      setNewTaskPoints(taskToEdit.points);
      setNewTaskDesc(taskToEdit.description);

      if (taskToEdit.dueDate) {
        const dueDateObj = new Date(taskToEdit.dueDate);
        if (!isNaN(dueDateObj.getTime())) {
          setNewTaskDueDate(dueDateObj.toISOString().slice(0, 16));
        } else {
          setNewTaskDueDate(""); 
        }
      } else {
        setNewTaskDueDate(""); 
      }
    }
  }, [taskToEdit]);

  const handleCreate = () => {
    if (newTaskTitle.trim()) {
      if (newTaskDueDate && new Date(newTaskDueDate) < new Date()) {
        setStatus({success : "Error", message: "Due date cannot be in the past"})
        setShowAlert(true);
        setTimeout(()=> {        
          setShowAlert(false);
        }, 2000)
        return;
      }
      const now = new Date();
      const newTask: Task = {
        name: capitalizeFirstLetter(newTaskTitle),
        description: newTaskDesc ? newTaskDesc : undefined, 
        points: newTaskPoints,
        creationDate: now,
        dueDate: newTaskDueDate ? new Date(newTaskDueDate) : undefined,
        routineTime: routineTime? routineTime : undefined,
        icon: taskToEdit?.icon || FaCalendarAlt,
      };      

      const taskType = type === "routine"? "routine" : "";
      onCreate(newTask, taskType);
      setNewTaskTitle("");
      setNewTaskPoints(10);
      setNewTaskDueDate("");
      setNewTaskDesc(""); 
    }
  };

  const handleAlertClose = () => {
    setShowAlert(false);
  };

  const defaultBgColor = 'bg-gradient-to-br from-blue-600 to-blue-500';

  return (
    <div className={`w-full bg-gradient-to-r ${defaultBgColor} ${type === "routine"? `` : ""} transform transition-transform hover:scale-105 p-5 px-6 rounded-lg shadow-md text-dark-text dark:text-dark-text`}>
      <div className="flex items-center mb-4">
        <FaClipboardList className="text-4xl mr-3" />
        <h2 className="text-xl font-stix">
          {type === "task_page" || type === "routine"
            ? taskToEdit
              ? "Edit Task"
              : "Create New Task"
            : taskToEdit
            ? "Edit Task"
            : "Assign New Task"}
        </h2>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-4 rounded-lg placeholder:text-dark-text dark:placeholder:text-dark-text shadow-md text-dark-text dark:text-dark-text dark:placeholder-dark-text bg-blue-400 border border-blue-400 focus:border-dark-background dark:focus:border-light-background focus:outline-none transition-all duration-300 box-border"
        />
        <textarea
          ref={textareaRef}
          value={newTaskDesc}
          onChange={(e) => setNewTaskDesc(e.target.value)}
          placeholder="Description"
          className="w-full p-4 mt-3 overflow-hidden rounded-lg placeholder:text-dark-text dark:placeholder:text-dark-text shadow-md text-dark-text dark:text-dark-text dark:placeholder-dark-text bg-blue-400 border border-blue-400 focus:border-dark-background dark:focus:border-light-background focus:outline-none transition-all duration-300 box-border resize-none"
          style={{ minHeight: '4rem' }} 
        />
        <div className="flex flex-col">
          <input
            type="number"
            value={newTaskPoints}
            onChange={(e) => setNewTaskPoints(e.target.value)}
            placeholder="Points"
            className="flex-1 p-4 rounded-lg mt-1 placeholder:text-dark-text dark:placeholder:text-dark-text shadow-md text-dark-text dark:text-dark-text dark:placeholder-dark-text bg-blue-400 border border-blue-400 focus:border-dark-background dark:focus:border-light-background focus:outline-none transition-all duration-300 box-border no-spinner"
          />
          {type !== "routine" && (
            <input
              type="datetime-local"
              value={newTaskDueDate}
              placeholder="Select date and time"
              onChange={(e) => setNewTaskDueDate(e.target.value)}
              className="flex-1 p-4 rounded-lg mt-3 bg-blue-400 border border-blue-400 focus:border-dark-background dark:focus:border-light-background text-light-text dark:text-dark-text placeholder:text-light-text dark:placeholder-dark-text transition-all duration-300 focus:outline-none box-border"
              style={{
                WebkitAppearance: 'none',
                width: '100%', 
                color: '#ffffff', 
              }}
          />   
          )}
        
        </div>
      </div>
      <button
        onClick={handleCreate}
        className="w-full p-4 rounded-lg bg-primary text-dark-text dark:text-dark-text hover:bg-blue-600 dark:hover:bg-blue-700 transition-colors duration-300 flex items-center justify-center"
      >
        {type === "task_page" || type === "routine"
          ? taskToEdit
            ?  
             <>
              <FaEdit size={20} className="inline mr-2" />
              Update Task
             </>
            :  <>
                <FaPlus size={20} className="inline mr-2" />
                Create New Task
               </>
          : taskToEdit
          ?   <>
              <FaEdit size={20} className="inline mr-2" />
              Update Task
           </>
          :   <>
            <FaUserPlus size={20} className="inline mr-2" />
            Assign Task
            </>}
      </button>
      {showAlert &&
       <Alert
            title={status?.success}
            message={status?.message}
            bg={status?.bg} 
            onClose={handleAlertClose}
      />}
    </div>
  );
};
