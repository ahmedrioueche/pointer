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
                if (!fetched) {
                    response = await apiGetTasksByParentId(id);
                    setFetched(true);
                }
    
                if (response) {
                    const tasks = response.tasks;
    
                    const updatedChildren = children.map(child => {
                        // Filter task assignments for the current child
                        const childAssignments = tasks
                            .flatMap((task: any) =>
                                task.taskAssignments.map((assignment: any) => ({
                                    ...assignment,
                                    taskDetails: {
                                        id: task.id,
                                        name: task.name,
                                        points: task.points,
                                        creatorId: task.creatorId,
                                        creatorName: task.creatorName,
                                        creationDate: task.creationDate,
                                    }
                                }))
                            )
                            .filter((assignment: any) => assignment.childId === child.id);
    
                        // Extract pending tasks from the task assignments
                        const pendingTasks = childAssignments
                            .filter((assignment: any) => !assignment.isCompleted && !assignment.isApproved)
                            .map((assignment: any) => ({
                                id: assignment.taskDetails.id,
                                name: assignment.taskDetails.name,
                                points: assignment.taskDetails.points,
                                creatorId: assignment.taskDetails.creatorId,
                                creatorName: assignment.taskDetails.creatorName,
                                creationDate: assignment.taskDetails.creationDate,
                                dueDate: assignment.dueDate,
                            }));
    
                        // Extract achieved tasks from the task assignments
                        const achievedTasks = childAssignments
                            .filter((assignment: any) => assignment.isCompleted)
                            .map((assignment: any) => ({
                                id: assignment.taskDetails.id,
                                name: assignment.taskDetails.name,
                                points: assignment.taskDetails.points,
                                creatorId: assignment.taskDetails.creatorId,
                                creatorName: assignment.taskDetails.creatorName,
                                creationDate: assignment.taskDetails.creationDate,
                                dueDate: assignment.dueDate,
                                completionDate: assignment.completionDate,
                                approvalDate: assignment.approvalDate,
                            }));
    
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
                console.error("Error fetching tasks:", error);
            }
        };
    
        if (children.length > 0) {
            fetchTasks();
        }
    }, [children, fetched]);
    
    
    const getChildPendingTasks = (id : number) : any=>  {
        const child = children.find(child => child.id === id);
        return child ? child.pendingTasks : [];  
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