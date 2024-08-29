import { capitalizeFirstLetter } from "@/lib/formater";
import { Task } from "@/lib/interface";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaClipboardList, FaEdit, FaPlus, FaUserPlus } from "react-icons/fa";

interface CreateTaskProps {
  type: "task_page" | "task_menu" | "task_pending" | "task_done"; 
  onCreate: (task: Task) => void;
  taskToEdit: Task | null;
}

export const CreateTask: React.FC<CreateTaskProps> = ({ type, onCreate, taskToEdit}) => {
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskPoints, setNewTaskPoints] = useState<string | number | undefined>(10);
  const [newTaskDate, setNewTaskDate] = useState<string | undefined>("");

  useEffect(() => {
    const now = new Date();
    const formattedDateTime = now.toISOString().slice(0, 16); // Format as 'YYYY-MM-DDTHH:MM'
    setNewTaskDate(formattedDateTime);
    
  }, []);
  
  useEffect(() => {
    if (taskToEdit) {
      setNewTaskTitle(taskToEdit.name);
      setNewTaskPoints(taskToEdit.points);
      
      if (taskToEdit.dueDate) {
        const dueDateObj = new Date(taskToEdit.dueDate);
        if (!isNaN(dueDateObj.getTime())) {
          setNewTaskDate(dueDateObj.toISOString().slice(0, 16));
        } else {
          setNewTaskDate(""); 
        }
      } else {
        setNewTaskDate(""); 
      }
    }
  }, [taskToEdit]);
  
  
  const handleCreate = () => {
    if (newTaskTitle.trim()) {
      const now = new Date();
      const newTask: Task = {
        name: capitalizeFirstLetter(newTaskTitle),
        points: newTaskPoints,
        creationDate: now,
        ...(type !== "task_page" && {
          dueDate: newTaskDate ? new Date(newTaskDate) : undefined,
        }),
        icon: taskToEdit?.icon || FaCalendarAlt,
      };      

      onCreate(newTask);
      setNewTaskTitle("");
      setNewTaskPoints(10);
      setNewTaskDate("");
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-purple-800 via-blue-800 to-blue-900 transform transition-transform hover:scale-105 p-6 py-10 rounded-lg shadow-md text-dark-text dark:text-dark-text">
    <div className="flex items-center mb-4">
      <FaClipboardList className="text-4xl mr-3" />
      <h2 className="text-xl font-stix">
      {type === "task_page"
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
        className="w-full p-4 rounded-lg placeholder:text-dark-text dark:placeholder:text-dark-text shadow-md text-dark-text dark:text-dark-text dark:placeholder-dark-text bg-indigo-400 border border-indigo-400 focus:border-dark-background dark:focus:border-light-background focus:outline-none transition-all duration-300 box-border"
      />
      <div className="flex flex-col">
        <input
          type="number"
          value={newTaskPoints}
          onChange={(e) => setNewTaskPoints(e.target.value)}
          placeholder="Points"
          className="flex-1 p-4 rounded-lg mt-3 placeholder:text-dark-text dark:placeholder:text-dark-text shadow-md text-dark-text dark:text-dark-text dark:placeholder-dark-text bg-indigo-400 border border-indigo-400 focus:border-dark-background dark:focus:border-light-background focus:outline-none transition-all duration-300 box-border no-spinner"
        />
          {type != "task_page" && (
          <input
            type="datetime-local"
            value={newTaskDate}
            placeholder="Select date and time"
            onChange={(e) => setNewTaskDate(e.target.value)}
            className="flex-1 p-4 rounded-lg mt-3 bg-indigo-400 border border-indigo-400 focus:border-dark-background dark:focus:border-light-background text-light-text dark:text-dark-text placeholder:text-light-text dark:placeholder-dark-text transition-all duration-300 focus:outline-none box-border"
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
      className="w-full p-4 rounded-lg bg-primary text-dark-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 flex items-center justify-center"
    >
      {type === "task_page"
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
  </div>
  
  );
};
