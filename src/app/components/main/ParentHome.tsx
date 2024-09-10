'use client';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import ChildCard from './child/ChildCard'; 
import { Child, Task } from "../../../lib/interface";
import TaskModal from './tasks/TaskModal';
import AddCard from './cards/AddCard';
import AddChildModal from './child/AddChildModal';
import { assertInt, fetcher, getRandomIcon } from '@/utils/helper';
import { apiGetTasksByParentId, apiInsertChild } from '@/lib/apiHelper';
import { useData } from '@/app/context/dataContext';

const ParentHome: React.FC<{id : number}> = ({id}) => {
    const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
    const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
    const [openedChild, setOpenedChild] = useState<any>();
    const [childPendingTasks, setChildPendingTasks] = useState<Task[]>();
    const [children, setChildren] = useState<any>([]);

    const childrenContext = useData();

    useEffect(() => {
        setChildren(childrenContext.children);
    },[childrenContext])
    
    const getChildPendingTasks = (id : number) : any=>  {
        const child = children.find((child: { id: number; }) => assertInt(child.id) === assertInt(id));
        return child ? child.pendingTasks : [];  
    }

    const toggleTaskModal = (id : number) => {
        const child = children.find((child: { id: number; }) => assertInt(child.id) === assertInt(id));
        console.log("child", child)
        setOpenedChild(child);

        setIsTasksModalOpen(!isTasksModalOpen);
        const pendingTasks = getChildPendingTasks(id)
        setChildPendingTasks(pendingTasks);

    };

    const toggleAddChildModal = () => {
        setIsAddChildModalOpen(!isAddChildModalOpen);
    };

    const handleAddChild = () => {
        setIsAddChildModalOpen(true);
    };

    const addChild = async (name: string, age: string, gender: "male" | "female", image: File | null) => {
        const ageNumber = parseInt(age, 10);
        const child = {
            id: 0,
            name: name,
            parent_id: id,
            age: ageNumber,
            gender: gender,
            icon: image ? URL.createObjectURL(image) : getRandomIcon(gender, 6),
            achieved_tasks: [],
            pending_tasks: [],
        };

        const result = await apiInsertChild(child);
        const child_id = result.id;
        child.id = child_id;

        setChildren((prev: any) => [...prev, child]); 

    }

    return (
    <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map((child : any, index : number) => (
            <div key={index} className="h-full w-full">
                <ChildCard
                    type='home'
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
            <AddCard />
        </div>
        </div>

        <AddChildModal
            isOpen={isAddChildModalOpen}
            onAddChild={addChild}
            onClose={toggleAddChildModal}
         />

        <TaskModal
            fetchedPendingTasks={childPendingTasks}
            child={openedChild}
            isOpen={isTasksModalOpen}
            onClose={() => setIsTasksModalOpen(false)}
            onUpdate={() => childrenContext.triggerFetch() }
        />
    </div>
    );
};

export default ParentHome;