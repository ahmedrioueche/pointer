import React, { useEffect, useRef, useState } from 'react';
import { FaCalendarAlt, FaFileAlt, FaTrash, FaCheck } from 'react-icons/fa';
import useSWR from 'swr';
import { assertInt, fetcher } from '@/utils/helper';
import TaskDetailsModal from '../modals/TaskDetailsModal';
import { apiUpdateTaskAssignment } from '@/lib/apiHelper';
import { useData } from '@/app/context/dataContext';
import { capitalizeFirstLetter } from '@/utils/formater';

interface ChildHomeProps {
  user: any;
}

const daysOfWeekFull = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const daysOfWeekShort = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const hoursOfDay = Array.from({ length: 24 }, (_, i) => `${(i + 6) % 24}:00`);

const ChildHome: React.FC<ChildHomeProps> = ({ user }) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>("daily");
  const [taskAssignments, setTaskAssignment] = useState<any[]>([]);
  const [selectedTask, setSelectedTask] = useState<any | null>(null);
  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState<boolean>(false);
  const [clickedTimeSlot, setClickedTimeSlot] = useState<string | undefined>();
  const [children, setChildren] = useState<any>([]);
  const [child, setChild] = useState<any>([]);
  const [selectedDay, setSelectedDay] = useState<string>(daysOfWeekFull[new Date().getDay() - 1]);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  let userId : number = 0;
  if(user){
    userId = user.id;
  }

  const { data: data, error, mutate } = useSWR('/api/main/task/get-task-child-id', (url) => fetcher(url, userId), {
    revalidateOnFocus: true, 
  });

  useEffect(() => {
    if(data){
      setTaskAssignment(data.tasks);
    }
  }, [data])

  const childrenContext = useData();
  
  useEffect(() => {
      setChildren(childrenContext.children);
  },[childrenContext])

  useEffect(() => {
    if(children && children.length > 0){
      const childData = children.filter((child : any) => assertInt(child.id) === assertInt(userId))
      setChild(childData.length > 0 ? childData[0] : null);
    }
   
  }, [children, userId])

  const findTasksForTime = (type: string, timeSlot: string) => {
    const hourToCompare = timeSlot.split('-')[0];
    const dayToCompare = type === "weekly"? timeSlot.split('-')[1] : selectedDay; //either week view or daily view

    let filteredTasks;
     if (taskAssignments) {

      filteredTasks = taskAssignments.filter((taskAssignment: any) => {
        return taskAssignment.routineTime === timeSlot || taskAssignment.routineTime === hourToCompare;
      });

      filteredTasks = filteredTasks.filter((taskAssignment: any) => {
        return !(taskAssignment.routineExceptions && taskAssignment.routineExceptions.includes(dayToCompare));
      });

       return filteredTasks;
     }
    return [];
  };

  const handleTaskClick = (taskAssignment: any, timeSlot: string) => {

    //structure task
    const selectedTask = {
      ...taskAssignment,
      ...taskAssignment.task,
    } 
    
    setSelectedTask(selectedTask);
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

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setViewMode('daily');
        setIsSmallScreen(true);
      }
      else {
        setIsSmallScreen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, []);
  
  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    setIsDropdownOpen(false);
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
          setIsDropdownOpen(false);
        }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
}, []);

  const gender = child?.gender;
  const maleGradient = 'bg-gradient-to-br from-blue-300 to-blue-500';
  const femaleGradient = 'bg-gradient-to-br from-pink-300 to-pink-500';
  const gradientBg = gender === 'male' ? maleGradient : femaleGradient;

  return (
    <div className={`p-4 w-full max-h-[98vh] overflow-y-auto flex flex-col task-menu ${gradientBg} rounded-lg`}>
      {/* Header */}
      <div className="flex justify-between items-center py-3">
        <div className="flex items-center text-white">
          {child?.icon ? <img src={child.avatar} className='w-8 h-8 mr-3' /> : <FaCalendarAlt className="text-xl mr-3" />}
          <h2 className="md:text-xl text-lg font-bold font-stix">Your Routine</h2>
        </div>
        {!isSmallScreen && window.innerWidth > 768 && (
          <button
            onClick={() => setViewMode(viewMode === 'daily' ? 'weekly' : 'daily')}
            className={`flex items-center px-4 py-2 bg-white text-light-primary font-medium font-stix rounded-lg shadow-md hover:text-white transition-colors duration-300
            hover:bg-gradient-to-br ${gender === 'male' ? 'hover:from-blue-300 hover:to-blue-500' : 'hover:bg-gradient-to-br hover:from-pink-300 hover:to-pink-500'}`}>
            {viewMode === 'daily' ? 'Weekly View' : 'Daily View'}
        </button>
        )}
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
                        tasksForTime.map((taskAssignment: any, taskIndex: number) => (
                          <div
                            key={taskIndex}
                            className="relative bg-blue-500 text-white py-2 px-2 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-200 flex items-center justify-start w-full cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTaskClick(taskAssignment, timeSlot);
                            }}
                          >
                            <span className="text-left text-xs font-satisfy truncate mr-1">{taskAssignment.task.name}</span>
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
        <>
        <div className="relative flex justify-end mb-3">
          <button
            onClick={toggleDropdown}
            className={`flex items-center px-5 py-2 bg-white text-light-primary font-medium font-stix rounded-lg shadow-md hover:text-white transition-colors duration-300
            hover:bg-gradient-to-br ${gender === 'male' ? 'hover:from-blue-300 hover:to-blue-500' : 'hover:bg-gradient-to-br hover:from-pink-300 hover:to-pink-500'}`}
          >
            {selectedDay}
          </button>
      
          {/* Dropdown for day selection */}
          {isDropdownOpen && (
            <div ref={dropdownRef} className={`absolute right-0 mt-12 w-48 max-w-xs font-stix font-bold text-dark-text bg-gradient-to-br ${gender === 'male' ? 'from-blue-300 to-blue-500' : 'from-pink-300 to-pink-500'} rounded-lg shadow-lg z-50`}>
              {daysOfWeekFull.map((day, index) => (
                <div
                  key={index}
                  className="py-2 px-4 hover:bg-white hover:text-light-primary cursor-pointer"
                  onClick={() => handleDaySelect(day)}
                >
                  {day}
                  
                </div>
              ))}
            </div>
          )}
        </div>
      
        <div className="grid md:grid-cols-2 grid-cols-1 gap-3 mt-4">
          {hoursOfDay.map((hour, index) => {
            const tasksForTime = findTasksForTime("daily", hour);
            return (
              <div
                key={index}
                className="bg-white/30 hover:scale-105 transform duration-300 hover:cursor-pointer rounded-lg p-4 text-white flex items-center justify-between"
              >
                <div className="text-base font-medium font-stix mr-1">{hour}</div>
                <div className="flex flex-col space-y-2">
                  {tasksForTime && tasksForTime.length > 0 ? (
                    tasksForTime.map((taskAssignment: any, index: number) => (
                      <div
                        key={index}
                        className="relative bg-blue-500 text-white py-3 px-7 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-200"
                        style={{ width: '250px' }} 
                        onClick={() => handleTaskClick(taskAssignment, hour)}
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="font-semibold text-base font-satisfy mr-3">{taskAssignment.task.name}</h3>
                          <div className="bg-white text-blue-500 px-3 py-1 rounded-full text-sm font-medium font-stix">
                            {taskAssignment.task.points} pts
                          </div>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation(); 
                              handleTaskCompleted(taskAssignment);
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
                                  {taskAssignment.task.description ? capitalizeFirstLetter(taskAssignment.task.description) : "No description"}
                              </p>
                            </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-white text-sm">No tasks</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </>      
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

export default ChildHome;
