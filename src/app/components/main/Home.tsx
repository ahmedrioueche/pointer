'use client';

import React, { useState } from 'react';
import { FaClipboardList } from 'react-icons/fa';
import Card from './Card'; // Adjust the import path if necessary
import { Task, Child, TaskCardIf } from "../../../lib/interface";
import Menu from './tasks/TaskMenu'; // Make sure to use the correct import path
import { bgColors } from '@/data/style';
import AddCard from './AddCard';

interface HomeProps {
  userType: string;
}

const Home: React.FC<HomeProps> = ({ userType }) => {
  const children: Child[] = [
    {
      id: 1,
      name: 'Alice',
      age: 8,
      gender: 'female',
      achievedTasks: [
        { id: 1, title: 'Completed math homework', points: '10' },
        { id: 2, title: 'Helped with the chores', points: '5' },
      ],
      pendingTasks: [
        { id: 1, title: 'Finish reading chapter 3', points: '3' },
        { id: 2, title: 'Prepare for spelling test', points: '7' },
      ],
      icon: "",
    },
    {
      id: 2,
      name: 'Bob',
      age: 10,
      gender: 'male',
      achievedTasks: [
        { id: 1, title: 'Won the soccer match', points: '15' },
        { id: 2, title: 'Cleaned his room', points: '5' },
      ],
      pendingTasks: [
        { id: 1, title: 'Start science project', points: '8' },
        { id: 2, title: 'Practice guitar', points: '4' },
      ],
      icon: "",
    },
    {
      id: 3,
      name: 'Charlie',
      age: 9,
      gender: 'male',
      achievedTasks: [
        { id: 1, title: 'Completed art project', points: '12' },
        { id: 2, title: 'Helped a friend with homework', points: '6' },
      ],
      pendingTasks: [
        { id: 1, title: 'Prepare for math quiz', points: '9' },
        { id: 2, title: 'Finish book report', points: '7' },
      ],
      icon: "",
    },
    {
      id: 4,
      name: 'Daisy',
      age: 7,
      gender: 'female',
      achievedTasks: [
        { id: 1, title: 'Finished drawing competition', points: '10' },
        { id: 2, title: 'Made a craft', points: '5' },
      ],
      pendingTasks: [
        { id: 1, title: 'Learn a new song on piano', points: '8' },
        { id: 2, title: 'Practice spelling', points: '6' },
      ],
      icon: "",
    },
  ];  

  children.forEach((child, index) => {
    const iconIndex = (index % 7) + 1; 
    let type;
    type = child.gender === "male"? "boy" : "girl";
    child.icon = `/icons/${type}_${iconIndex}.png`;
    console.log(" child.icon",  child.icon)
  });

  const [isTasksMenuOpen, setIsTasksMenuOpen] = useState(false);

  const toggleTasksMenu = () => {
    setIsTasksMenuOpen(!isTasksMenuOpen);
  };

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map((child, index) => (
          <div key={index} className="h-full w-full">
            <Card
              id={child.id}
              name={child.name}
              age={child.age}
              gender={child.gender}
              achievedTasks={child.achievedTasks}
              pendingTasks={child.pendingTasks}
              icon={child.icon}
              callback={toggleTasksMenu}
            />
          </div>
        ))}
        <AddCard/>
      </div>

      <Menu
        isOpen={isTasksMenuOpen}
        onClose={toggleTasksMenu}
      />
    </div>
  );
};

export default Home;
