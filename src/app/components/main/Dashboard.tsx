'use client';

import React, { useState } from 'react';
import { FaTasks, FaChartPie, FaEdit, FaTrashAlt, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';

interface TaskCard {
  childName: string;
  taskTitle: string;
  points: number;
  bgColor: string;
}

const bgColors = [
  "bg-gradient-to-r from-yellow-400 to-orange-500",
  "bg-gradient-to-r from-pink-500 to-red-500",
  "bg-gradient-to-r from-blue-500 to-green-500",
  "bg-gradient-to-r from-purple-600 to-purple-400",
  "bg-gradient-to-r from-green-500 to-yellow-500",
];

const initialTasks: TaskCard[] = [
  { childName: "John", taskTitle: "Clean Room", points: 20, bgColor: bgColors[0] },
  { childName: "Emma", taskTitle: "Do Homework", points: 30, bgColor: bgColors[1] },
  { childName: "Sophia", taskTitle: "Feed the Dog", points: 15, bgColor: bgColors[2] },
  { childName: "James", taskTitle: "Wash Dishes", points: 25, bgColor: bgColors[3] },
];

const ChildrenTasks: React.FC = () => {
  const [tasks, setTasks] = useState<TaskCard[]>(initialTasks);

  const modifyTask = (index: number) => {
    // Logic to modify the task
    console.log("Modify task:", index);
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const completeTask = (index: number) => {
    // Logic for completing the task
    console.log("Complete task:", index);
  };

  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-3">
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
                  onComplete={() => completeTask(index)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface TaskCardProps extends TaskCard {
  onModify: () => void;
  onRemove: () => void;
  onComplete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ childName, taskTitle, points, bgColor, onModify, onRemove, onComplete }) => {
  return (
    <div
      className={`p-6 rounded-lg cursor-pointer shadow-md ${bgColor} text-dark-text dark:text-dark-text flex flex-col justify-between h-48 transform transition-transform hover:scale-105`}
    >
      <div>
        <h4 className="text-lg font-semibold mb-1">{childName}</h4>
        <p className="text-md mb-1">{taskTitle}</p>
        <p className="text-xl font-bold">{points} Points</p>
      </div>
      <div className="flex justify-between mt-4">
        <button
          onClick={onModify}
          className="p-4 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
        >
          <FaEdit size={20} />
        </button>
        <button
          onClick={onRemove}
          className="p-4 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
        >
          <FaTrashAlt size={20} />
        </button>
        <button
          onClick={onComplete}
          className="p-4 rounded-full bg-light-background hover:bg-light-accent dark:hover:bg-dark-accent transition-colors duration-300"
        >
          <FaCheck size={20} />
        </button>
      </div>
    </div>
  );
};

const Statistics: React.FC = () => {
  return (
    <div className="p-6 rounded-lg shadow-md bg-gradient-to-r from-green-500 to-green-400">
      <h3 className="text-lg font-semibold mb-4">Statistics</h3>
      <div className="grid grid-cols-2 gap-4">
        <StatCard title="Total Tasks" value={15} />
        <StatCard title="Completed Tasks" value={10} />
        <StatCard title="Points Earned" value={150} />
        <StatCard title="Tasks Pending" value={5} />
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value }) => {
  return (
    <div className="p-4 rounded-lg shadow-md bg-light-background dark:bg-dark-background">
      <p className="text-sm mb-1">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
};

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-light-background dark:bg-dark-background text-light-text dark:text-dark-text p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ChildrenTasks />
        <Statistics />
      </div>
    </div>
  );
};

export default Dashboard;
