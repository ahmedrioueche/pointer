'use client';

import React, { useState } from 'react';
import Card from './Card'; // Adjust the import path if necessary
import { Child, Task } from "../../../lib/interface";
import TaskModal from './tasks/TaskModal'; // Make sure to use the correct import path
import AddCard from './AddCard';
import AddChildModal from './AddChildModal';

interface HomeProps {
  userType: string;
}

const getRandomIcon = (gender : string) => {
  let iconNumber = 7;
  let randomIndex = Math.floor(Math.random() * iconNumber) + 1;
  let type = gender === "male"? "boy" : "girl";
  let icon = `/icons/${type}_${randomIndex}.png`;
  return icon;
}


const Home: React.FC<HomeProps> = ({ userType }) => {
  const [children, setChildren] = useState<Child[]>([
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
  ]);  

  children.forEach((child, index) => {
    const iconIndex = (index % 7) + 1; 
    let type;
    type = child.gender === "male"? "boy" : "girl";
    child.icon = `/icons/${type}_${iconIndex}.png`;
  });

  const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
  const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);

  const toggleTaskModal = () => {
    setIsTasksModalOpen(!isTasksModalOpen);
  };

  const toggleAddChildModal = () => {
    setIsAddChildModalOpen(!isAddChildModalOpen);
  };

  const handleAddChild = () => {
    setIsAddChildModalOpen(true);
  }

  const addChild = (name: string, age: string, gender: "male" | "female", image: File | null) => { 
    const id = 5; 
    const ageNumber = parseInt(age, 10); 
    console.log("image", image)
      if(image)
        console.log(" URL.createObjectURL(image)",  URL.createObjectURL(image))
    const child = {
      id: id,
      name: name,
      age: ageNumber,
      gender: gender,
      icon: image ? URL.createObjectURL(image) : getRandomIcon(gender), 
      achievedTasks: [], 
      pendingTasks: [], 
    };

    setChildren(prevChildren => [...prevChildren, child]);

}

  
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
              callback={toggleTaskModal}
            />
          </div>
        ))}
        <div onClick={handleAddChild}>
           <AddCard/>
        </div>
      </div>

      <AddChildModal
        isOpen={isAddChildModalOpen}
        onAddChild={addChild}
        onClose={toggleAddChildModal}/>

      <TaskModal
        isOpen={isTasksModalOpen}
        onClose={toggleTaskModal}
      />
    </div>
  );
};

export default Home;
