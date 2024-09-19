import { getChildById } from '@/services/childService';
import { apiGetChildData, apiGetTasksByParentId } from '@/lib/apiHelper';
import { fetcher } from '@/utils/helper';
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import useSWR from 'swr';

interface Child {
  id: number;
  name: string;
  achieved_tasks: any[];
  pending_tasks: any[];
}

interface DataContextType {
  user: any;
  children: Child[];
  setChildren: React.Dispatch<React.SetStateAction<Child[]>>;
  triggerFetch: () => void; 
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ user: any; children: ReactNode }> = ({ user, children }) => {
  const [childrenData, setChildrenData] = useState<Child[]>([]);
  const [parentId, setParentId] = useState<any>();
  const [childId, setChildId] = useState<any>();
  const [fetched, setFetched] = useState(false);

  const getParentId = async (childId : number) => {
    const childData = await apiGetChildData(childId);
  
    return childData.parent_id;
  }
  
  useEffect(() => {
    const init = async () => {
      if(user){
        if(user.type === "parent" ){
          setParentId(user.id);
        }
        else {
          setChildId(user.id);
          const parentId = await getParentId(childId);
          setParentId(parentId);
        }
      }
    }
  
    init();
  }, [user, childId])


  //get children by parentId
  const { data: childrenDB, error } = useSWR<Child[]>(parentId ? `/api/main/home` : null, 
    (url) => fetcher(url, parentId), 
    { revalidateOnFocus: true }
  );


  useEffect(() => {
    if (childrenDB) {
        setChildrenData(childrenDB);
    }
  }, [childrenDB]);

  useEffect(() => {
    const fetchTasks = async () => {
        try {
            let response;
            if (!fetched) {
              response = parentId? await apiGetTasksByParentId(parentId) : null;
              setFetched(true);
           }

            if (response) {
                const tasks = response.tasks;
                const updatedChildren = childrenData.map((child : any) => {
                    // Filter task assignments for the current child
                    const childAssignments = tasks
                        .flatMap((task: any) =>
                            task.taskAssignments.map((assignment: any) => ({
                                ...assignment,
                                taskDetails: {
                                    id: task.id,
                                    name: task.name,
                                    description : task.description,
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
                            description: assignment.taskDetails.description,
                            points: assignment.taskDetails.points,
                            creatorId: assignment.taskDetails.creatorId,
                            creatorName: assignment.taskDetails.creatorName,
                            creationDate: assignment.taskDetails.creationDate,
                            assignmentDate: assignment.assignmentDate,
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
                        pendingTasks: pendingTasks,
                        achievedTasks: achievedTasks,
                    };
                });

                setChildrenData(updatedChildren);
            }

        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    if (childrenData.length > 0) {
      fetchTasks();
    }
}, [childrenData, fetched, parentId]);


const triggerFetch = () => {
  setFetched(prev => !prev);
};

  return (
    <DataContext.Provider value={{ user: user, children: childrenData, setChildren: setChildrenData, triggerFetch }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useChildren must be used within a ChildrenProvider');
  }
  return context;
};
