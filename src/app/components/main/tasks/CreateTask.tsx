import { bgColors } from "@/data/style";
import { capitalizeFirstLetter } from "@/lib/formater";
import { TaskCardIf } from "@/lib/interface";
import { useState } from "react";
import { FaCalendarAlt, FaClipboardList, FaPlus, FaUserPlus } from "react-icons/fa";

const getRandomBgColor = () => {
  const randomIndex = Math.floor(Math.random() * bgColors.length);
  return bgColors[randomIndex];
};

interface CreateTaskProps {
  type: "task_page" | "task_menu" | "task_pending"; 
  onCreate: (task: TaskCardIf) => void;
}

export const CreateTask: React.FC<CreateTaskProps> = ({ type, onCreate }) => {
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskPoints, setNewTaskPoints] = useState<string | number>(10);
  const [newTaskDate, setNewTaskDate] = useState<string>("");

  const handleCreate = () => {
    if (newTaskTitle.trim() && newTaskDate) {
      const now = new Date().toISOString(); // Current date and time in ISO format
      const newTask: TaskCardIf = {
        title: capitalizeFirstLetter(newTaskTitle),
        points: newTaskPoints,
        creation_date: now,
        due_date: newTaskDate,
        icon: FaCalendarAlt,
        bgColor: getRandomBgColor(), 
      };
      onCreate(newTask);
      setNewTaskTitle("");
      setNewTaskPoints(10);
      setNewTaskDate("");
    }
  };

  return (
    <div className="bg-gradient-to-r transform transition-transform hover:scale-105 from-indigo-400 to-cyan-500 p-6 rounded-lg shadow-md text-light-text dark:text-dark-text">
      <div className="flex items-center mb-4">
        <FaClipboardList className="text-4xl mr-3" />
        <h2 className="text-xl font-stix">
          {type === "task_page" ? "Create New Task" : "Assign New Task"}
        </h2>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-4 rounded-lg placeholder:text-light-text dark:placeholder:text-dark-text shadow-md text-light-text dark:text-dark-text dark:placeholder-dark-text bg-indigo-400 border border-indigo-400 focus:border-dark-background dark:focus:border-light-background focus:outline-none transition-all duration-300"
        />
        <div className="flex flex-col">
          <input
            type="number"
            value={newTaskPoints}
            onChange={(e) => setNewTaskPoints(e.target.value)}
            placeholder="Points"
            className="flex-1 p-4 rounded-lg mt-3 placeholder:text-light-text dark:placeholder:text-dark-text shadow-md text-light-text dark:text-dark-text dark:placeholder-dark-text bg-indigo-400 border border-indigo-400 focus:border-dark-background dark:focus:border-light-background focus:outline-none transition-all duration-300 mr-1 no-spinner"
          />
          <input
            type="datetime-local"
            value={newTaskDate}
            onChange={(e) => setNewTaskDate(e.target.value)}
            className="flex-1 p-4  rounded-lg mt-3 bg-indigo-400 border border-indigo-400 focus:border-dark-background dark:focus:border-light-background text-light-text dark:text-dark-text placeholder:text-light-text dark:placeholder-dark-text transition-all duration-300"
          />
        </div>
      </div>
      <button
        onClick={handleCreate}
        className="w-full p-4 rounded-lg bg-primary text-light-text dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 flex items-center justify-center"
      >
        {type === "task_page" ? (
          <>
            <FaPlus size={20} className="inline mr-2" />
            Create Task
          </>
        ) : (
          <>
            <FaUserPlus size={20} className="inline mr-2" />
            Assign Task
          </>
        )}
      </button>
    </div>
  );
};
