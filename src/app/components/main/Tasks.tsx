'use client';

import React, { useState, useEffect } from 'react';
import { FaPlus, FaCalendarAlt, FaClipboardList, FaEdit, FaTrashAlt, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface Task {
  title: string;
  points: string | number;
  icon: React.ElementType;
  bgColor: string;
}

// Define a list of background colors
const bgColors = [
  "bg-gradient-to-r from-green-400 to-blue-500",
  "bg-gradient-to-r from-purple-500 to-pink-500",
  "bg-gradient-to-r from-blue-500 to-cyan-500",
  "bg-gradient-to-r from-blue-700 to-blue-500",
  "bg-gradient-to-r from-gray-400 to-blue-600",
  "bg-gradient-to-r from-green-500 to-teal-500",
  "bg-gradient-to-r from-cyan-400 to-red-300",
];

const initialTasks: Task[] = [
  { title: "Make the bed", points: 10, icon: FaCalendarAlt, bgColor: bgColors[0] },
  { title: "Do homework", points: 10, icon: FaCalendarAlt, bgColor: bgColors[1] },
  { title: "Buy groceries", points: 10, icon: FaCalendarAlt, bgColor: bgColors[2] },
  { title: "Walk the dog", points: 10, icon: FaCalendarAlt, bgColor: bgColors[3] },
  { title: "Clean the house", points: 10, icon: FaCalendarAlt, bgColor: bgColors[4] },
  { title: "Prepare dinner", points: 10, icon: FaCalendarAlt, bgColor: bgColors[5] },
  { title: "Read a book", points: 10, icon: FaCalendarAlt, bgColor: bgColors[6] },
];

// Function to get a random color from the list
const getRandomBgColor = () => {
  const randomIndex = Math.floor(Math.random() * bgColors.length);
  return bgColors[randomIndex];
};

const Tasks: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = (newTask: Task) => {
    setTasks([newTask, ...tasks]); // Prepend new task
  };

  const modifyTask = (index: number) => {
    // Logic to modify the task
    console.log("Modify task:", index);
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const actionTask = (index: number) => {
    // Logic for task action (e.g., mark as done)
    console.log("Action task:", index);
  };

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <CreateTask onCreate={addTask} />
        </div>
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {tasks.map((task, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <TaskCard
                  {...task}
                  onModify={() => modifyTask(index)}
                  onRemove={() => removeTask(index)}
                  onAction={() => actionTask(index)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface TaskCardProps extends Task {
  onModify: () => void;
  onRemove: () => void;
  onAction: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ title, points, icon: Icon, bgColor, onModify, onRemove, onAction }) => (
  <div
    className={`p-6 rounded-lg cursor-pointer font-stix shadow-md ${bgColor} text-light-text dark:text-dark-text flex flex-col justify-between h-48 transform transition-transform hover:scale-105`}
  >
    <div className="flex items-center space-x-4">
      <div className="text-4xl">
        <Icon />
      </div>
      <div>
        <h4 className="text-lg font-semibold mb-1">{title}</h4>
        <div className="flex items-center">
          <p className="text-xl font-bold font-satisfy">{points}</p>
          <h4 className='text-base ml-1 font-satisfy'>Points</h4>
        </div>
      </div>
    </div>
    <div className="flex justify-between mt-4">
      <button
        onClick={onModify}
        className="p-4 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-gray-700"
      >
        <FaEdit size={20} />
      </button>
      <button
        onClick={onRemove}
        className="p-4 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-gray-700"
      >
        <FaTrashAlt size={20} />
      </button>
      <button
        onClick={onAction}
        className="p-4 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 text-gray-700"
      >
        <FaCheck size={20} />
      </button>
    </div>
  </div>
);

interface CreateTaskProps {
  onCreate: (task: Task) => void;
}

const CreateTask: React.FC<CreateTaskProps> = ({ onCreate }) => {
  const [newTaskTitle, setNewTaskTitle] = useState<string>("");
  const [newTaskPoints, setNewTaskPoints] = useState<string | number>(10);

  const handleCreate = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        title: newTaskTitle,
        points: newTaskPoints,
        icon: FaCalendarAlt,
        bgColor: getRandomBgColor(), // Assign a random background color
      };
      onCreate(newTask);
      setNewTaskTitle("");
      setNewTaskPoints(10);
    }
  };

  return (
    <div className="bg-gradient-to-r transform transition-transform hover:scale-105 from-indigo-400 to-cyan-500 p-6 rounded-lg shadow-md text-light-text dark:text-dark-text">
      <div className="flex items-center mb-4">
        <FaClipboardList className="text-4xl mr-3" />
        <h2 className="text-xl  font-stix">Create New Task</h2>
      </div>
      <div className="mb-4">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-4 rounded-lg placeholder:text-light-text dark:placeholder:text-dark-text shadow-md text-light-text dark:text-dark-text dark:placeholder-dark-text bg-indigo-400 border border-indigo-400 focus:border-dark-background dark:focus:border-light-background focus:outline-none transition-all duration-300 mb-4"
        />
        <input
          type="number"
          value={newTaskPoints}
          onChange={(e) => setNewTaskPoints(e.target.value)}
          placeholder="Points"
          className="w-full p-4 rounded-lg placeholder:text-light-text dark:placeholder:text-dark-text shadow-md text-light-text dark:text-dark-text dark:placeholder-dark-text bg-indigo-400 border border-indigo-400 focus:border-dark-background dark:focus:border-light-background focus:outline-none transition-all duration-300 mb-4 no-spinner"
        />
      </div>
      <button
        onClick={handleCreate}
        className="w-full p-4 rounded-lg bg-primary text-light-text  dark:text-dark-text hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300 flex items-center justify-center"
      >
        <FaPlus size={20} className="inline mr-2" />
        Create Task
      </button>
    </div>
  );
};

export default Tasks;
