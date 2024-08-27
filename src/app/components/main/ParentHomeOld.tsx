'use client';
import React, { useEffect, useState } from 'react';
import useSWR from 'swr';
import ChildCard from './ChildCard'; 
import { Child, Task } from "../../../lib/interface";
import TaskModal from './tasks/TaskModal';
import AddCard from './AddCard';
import AddChildModal from './AddChildModal';
import { fetcher, getRandomIcon } from '@/utils/helper';
import { apiGetTasksByParentId, apiInsertChild } from '@/lib/apiHelper';

const ParentHome: React.FC<{id : number}> = ({id}) => {
        
    const [isTasksModalOpen, setIsTasksModalOpen] = useState(false);
    const [isAddChildModalOpen, setIsAddChildModalOpen] = useState(false);
    const [children, setChildren] = useState<Child[]>([]);
    const [openedChildTasksId, setOpenedChildTasksId] = useState<number>(0);
    const [childPendingTasks, setChildPendingTasks] = useState<Task[]>();
    const [fetched, setFetched] = useState(false);

    const { data: childrenDB, error, mutate } = useSWR<Child[]>('/api/main/home', (url) => fetcher(url, id), {
        revalidateOnFocus: true, 
    });

    useEffect(() => {
        if (childrenDB) {
            if (Array.isArray(childrenDB)) {
                const childrenWithTasks = childrenDB.map(child => ({
                    ...child,
                    achieved_tasks: [],
                    pending_tasks: [],
                 }));

            setChildren(childrenWithTasks);
           }
        }
    }, [childrenDB]);

    useEffect(() => {

        const fetchTasks = async () => {
            try {
                let response;
                if(!fetched){
                   response = await apiGetTasksByParentId(id);
                   console.log("response", response);
                   setFetched(true);
                }
                if (response) {
                    const tasks = response.tasks;
                    console.log("All tasks:", tasks);
                
                    const updatedChildren = children.map(child => {
                        // Filter tasks that are assigned to the current child
                        const childTasks = tasks.filter((task: any) => {
                            const match = task.assignedTo === child.id;
                            console.log(`Checking task for childId ${child.id}:`, task, "Match:", match);
                            return match;
                        });
                
                        console.log(`Tasks for child ${child.id}:`, childTasks);
                
                        const pendingTasks = childTasks
                            .filter((task: any) => {
                                const isPending = !task.isCompleted && !task.isApproved;
                                console.log(`Task ${task.id} is pending:`, isPending);
                                return isPending;
                            })
                            .map((task: any) => task);
                
                        console.log(`Pending tasks for child ${child.id}:`, pendingTasks);
                
                        const achievedTasks = childTasks
                            .filter((task: any) => {
                                const isAchieved = task.isCompleted && !task.isApproved;
                                console.log(`Task ${task.id} is achieved:`, isAchieved);
                                return isAchieved;
                            })
                            .map((task: any) => task);
                
                        console.log(`Achieved tasks for child ${child.id}:`, achievedTasks);
                
                        return {
                            ...child,
                            pending_tasks: pendingTasks,
                            achieved_tasks: achievedTasks,
                        };
                    });
                
                    console.log("Updated children:", updatedChildren);
                
                    setChildren(updatedChildren);
                }
                
            } catch (error) {
                console.error("Error fetching pending tasks:", error);
            }
        };

        if (children.length > 0) {
            fetchTasks();
        }
    }, [children, fetched]);
    
    const getChildPendingTasks = (id : number) : any=>  {
        const child = children.find(child => child.id === id);
        return child ? child.pending_tasks : [];  
    }

    const toggleTaskModal = (id : number) => {
        setIsTasksModalOpen(!isTasksModalOpen);
        setOpenedChildTasksId(id);

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
            achievedTasks: [],
            pendingTasks: [],
        };

        const result = await apiInsertChild(child);
        const child_id = result.id;
        child.id = child_id;

        setChildren(prev => [...prev, child]); 

    }

    return (
    <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {children.map((child, index) => (
            <div key={index} className="h-full w-full">
                <ChildCard
                    id={child.id}
                    name={child.name}
                    age={child.age}
                    gender={child.gender}
                    achievedTasks={child.achieved_tasks}
                    pendingTasks={child.pending_tasks}
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
            parent_id={id}
            fetchedPendingTasks={childPendingTasks}
            child_id={openedChildTasksId}
            isOpen={isTasksModalOpen}
            onClose={() => setIsTasksModalOpen(false)}
            onUpdate={() => setFetched(false) }
        />
    </div>
    );
};

export default ParentHome;