import React, { useEffect, useState } from 'react';
import { FaPlus, FaCalendarAlt, FaFileAlt, FaTrash, FaCheck } from 'react-icons/fa';
import TaskModal from '../tasks/TaskModal';
import useSWR from 'swr';
import { assertInt, fetcher } from '@/utils/helper';
import TaskDetailsModal from '../tasks/TaskDetailsModal';
import { apiDeleteTask, apiUpdateTaskAssignment } from '@/lib/apiHelper';
import { useData } from '@/app/context/dataContext';
import { capitalizeFirstLetter } from '@/lib/formater';

interface ChildHomeTestProps {
  user: any;
}

const daysOfWeekFull = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const daysOfWeekShort = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const hoursOfDay = Array.from({ length: 24 }, (_, i) => `${(i + 6) % 24}:00`);

const ChildHomeTest: React.FC<ChildHomeTestProps> = ({ user }) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>("daily");
  const [tasks, setTasks] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState<boolean>(false);
  const [clickedTimeSlot, setClickedTimeSlot] = useState<string | undefined>();
  const [children, setChildren] = useState<any>([]);
  const [child, setChild] = useState<any>([]);
 
  let userId : number;
  if(user){
    userId = user? user.id : undefined;
    console.log("userId in childHome", userId)
  }

  const childrenContext = useData();
  
  useEffect(() => {
      setChildren(childrenContext.children);
  },[childrenContext])

  useEffect(() => {
    if(children && children.length > 0){
      const childData = children.filter((child : any) => child.id === userId)
      setChild(childData.length > 0 ? childData[0] : null);
    }
   
  }, [children])

  const { data: data, error, mutate } = useSWR('/api/main/task/get-task-parent-id', (url) => fetcher(url, child.parent_id), {
    revalidateOnFocus: true, 
  });

  useEffect(() => {
    if(data){
      const fetchedTasks = data.tasks
      if (fetchedTasks && Array.isArray(fetchedTasks) && child) {
        const childTasks = fetchedTasks.filter((task:any) => {
        return task.taskAssignments.some((assignment: any) => assertInt(assignment.childId) === assertInt(child.id));
       })
        setTasks(childTasks);
      }
    }
  }, [data, child]);

  useEffect(() => {
    mutate();
  }, [tasks]);

  const findTasksForTime = (type: string, timeSlot: string) => {
    const hourToCompare = timeSlot.split('-')[0];
    const dayToCompare = timeSlot.split('-')[1];
    let filteredTasks;

    if (tasks) {
      filteredTasks = tasks.filter((task: any) => {
        return task.taskAssignments.some((assignment: any) => assignment.routineTime === hourToCompare);
      });

      if (type === "weekly") {
        filteredTasks = tasks.filter((task: any) => {
          return task.taskAssignments.some((assignment: any) => assignment.routineTime === timeSlot || assignment.routineTime === hourToCompare);
        });
        filteredTasks = filteredTasks.filter((task: any) => {
          const assignment = task.taskAssignments[0];
          return !(assignment.routineExceptions && assignment.routineExceptions.includes(dayToCompare));
        });
      }
      return filteredTasks;
    }
    return [];
  };

  const handleTaskClick = (task: any, timeSlot: string) => {
    setSelectedTask(task);
    setClickedTimeSlot(timeSlot);
    setIsTaskDetailsModalOpen(true);
  };

  const handleEdit = () => {
    setIsTaskDetailsModalOpen(false);
  };

  const handleTaskCompleted = async (task : any) => {
    const response = await apiUpdateTaskAssignment(task.id, child.id, {isCompleted : true} );
    console.log("response", response);  
  }
  
  const gender = child?.gender;
  const maleGradient = 'bg-gradient-to-br from-blue-300 to-blue-500';
  const femaleGradient = 'bg-gradient-to-br from-pink-300 to-pink-500';
  const gradientBg = gender === 'male' ? maleGradient : femaleGradient;

  return (
    <div className={`p-4 w-full max-h-[98vh] overflow-y-auto flex flex-col task-menu ${gradientBg} rounded-lg`}>
      {/* Header */}
      <div className="flex justify-between items-center py-3">
        <div className="flex items-center text-white">
          {child?.icon ? <img src={child.icon} className='w-8 h-8 mr-3' /> : <FaCalendarAlt className="text-xl mr-3" />}
          <h2 className="md:text-xl text-lg font-bold font-stix">Your Routine</h2>
        </div>
        <button
          onClick={() => setViewMode(viewMode === 'daily' ? 'weekly' : 'daily')}
          className={`flex items-center px-4 py-2 bg-white text-light-primary font-medium font-stix rounded-lg shadow-md hover:text-white transition-colors duration-300
          hover:bg-gradient-to-br ${gender === 'male' ? 'hover:from-blue-300 hover:to-blue-500' : 'hover:bg-gradient-to-br hover:from-pink-300 hover:to-pink-500'}`}>
          {viewMode === 'daily' ? 'Weekly View' : 'Daily View'}
        </button>
      </div>

      {viewMode === 'weekly' ? (
        <div className="grid grid-cols-8 grid-rows-[auto] gap-2 mt-2">
          <div className="col-span-1" />
          {daysOfWeekFull && daysOfWeekFull.map((day, index) => (
            <div key={index} className="text-center text-base font-medium font-stix text-white sm:block hidden">
              {day}
            </div>
          ))}
          {daysOfWeekShort && daysOfWeekShort.map((day, index) => (
            <div key={index} className="text-center text-base font-medium font-stix text-white block sm:hidden">
              {day}
            </div>
          ))}

          {hoursOfDay && hoursOfDay.map((hour, index) => (
            <React.Fragment key={index}>
              <div className="text-right mt-3 md:mt-5 pr-2 md:text-base sm:text-sm font-medium font-stix text-white col-span-1">
                {hour}
              </div>
              {daysOfWeekFull && daysOfWeekFull.map((day) => {
                const timeSlot = `${hour}-${day}`;
                const tasksForTime = findTasksForTime("weekly", timeSlot);
                return (
                  <div
                    key={timeSlot}
                    className="relative group bg-white/30 rounded-lg min-h-12 sm:min-h-16 flex flex-col justify-between items-center transition-colors duration-300 hover:bg-white/50 cursor-pointer"
                  >
                    <div className="flex flex-col space-y-1 w-full px-2 sm:px-3 py-1 sm:py-2">
                      {tasksForTime.length > 0 ? (
                        tasksForTime.map((task: any, taskIndex: number) => (
                          <div
                            key={taskIndex}
                            className="relative bg-blue-500 text-white py-2 px-2 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-200 flex items-center justify-start w-full cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskClick(task, timeSlot);
                            }}
                          >
                            <span className="text-left text-xs font-satisfy truncate mr-1">{task.name}</span>
                          </div>
                        ))
                      ) : (
                        <div className="flex top-0 right-0 w-full h-full cursor-pointer">
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 grid-cols-1 gap-3 mt-4">
          {hoursOfDay.map((hour, index) => {
            const tasksForTime = findTasksForTime("daily", hour);
            return (
              <div
                key={index}
                className="bg-white/30 hover:scale-105 transform duration-300 hover:cursor-pointer rounded-lg p-4 text-white flex items-center justify-between"
                >
              <div className="text-base font-medium font-stix mr-1">{hour}</div>
              {tasksForTime.length > 0 ? (
                tasksForTime.map((task: any, index: number) => (
                  <div
                    key={index}
                    className="relative bg-blue-500 text-white py-3 px-7 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-200"
                    style={{ width: '280px' }} 
                    onClick={() => handleTaskClick(task, hour)}
                  >
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="font-semibold text-base font-satisfy mr-3">{task.name}</h3>
                      <div className="bg-white text-blue-500 px-3 py-1 rounded-full text-sm font-medium font-stix">
                        {task.points} pts
                      </div>
                     
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); 
                          handleTaskCompleted(task);
                        }}  
                         className="text-gray-200 hover:text-white transition-colors"
                       >
                          <FaCheck />
                      </button>
                   
                    </div>
                      <div className="flex flex-row items-start">
                          <FaFileAlt className="mr-1" />
                          <div className="flex-1 overflow-hidden break-words">
                          <p className="text-gray-200 text-sm font-stix">
                              {task.description? capitalizeFirstLetter(task.description) : "No description" }
                          </p>
                          </div>
                      </div>
                  </div>
                ))
                ) : (
                  <div className="text-white text-sm">No tasks</div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <TaskDetailsModal
        isOpen={isTaskDetailsModalOpen}
        onClose={() => setIsTaskDetailsModalOpen(false)}
        task={selectedTask}
        type="task_details_childview"
        onEdit={handleEdit} 
        child={child} 
        clickedTimeSlot={clickedTimeSlot}        
      />
    </div>
  );
};

export default ChildHomeTest;
