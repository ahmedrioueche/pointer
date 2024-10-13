import React, { useEffect, useRef, useState } from 'react';
import { FaTimes, FaPlus, FaCalendarAlt, FaTasks, FaFileAlt, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';
import TaskModal from '../tasks/TaskModal';
import useSWR from 'swr';
import { assertInt, fetcher } from '@/lib/helper';
import { Task } from '@/types/interface';
import { capitalizeFirstLetter } from '@/lib/formater';
import TaskDetailsModal from './TaskDetailsModal';
import { apiDeleteTask, apiUpdateTaskAssignment } from '@/lib/apiHelper';

interface RoutineModalProps {
  type: "daily" | "weekly";
  user: any;
  isOpen: boolean;
  child?: any;
  onClose: () => void;
}

const daysOfWeekFull = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const daysOfWeekShort = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const hoursOfDay = Array.from({ length: 24 }, (_, i) => `${(i + 6) % 24}:00`);

const RoutineModal: React.FC<RoutineModalProps> = ({ type, user, isOpen, child, onClose }) => {
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [openCalendarType, setOpenCalendarType] = useState(false);
  const [routineTime, setRoutineTime] = useState<any>();
  const [tasks, setTasks] = useState<any>();
  const [update, setUpdate] = useState<any>();
  const [selectedTask, setSelectedTask] = useState<any>(null); 
  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState<boolean>(false);
  const [clickedTimeSlot, setClickedTimeSlot] = useState<any>();
  const [selectedDay, setSelectedDay] = useState<string>(daysOfWeekFull[new Date().getDay()] || "Monday");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isSmallScreen, setIsSmallScreen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { data: data, error, mutate } = useSWR('/api/main/task/get-task-parent-id', (url) => fetcher(url, child.parentId), {
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
  }, [update, mutate])
  
  const handleCalendarClick = (e: React.MouseEvent<HTMLDivElement>, type : any, timeSlot : any) => {
    e.stopPropagation(); 
    setOpenCalendarType(type);
    if(type === "weekly" && isSmallScreen){ ///send selected day too
      const selectedTime = timeSlot + "-" + selectedDay;
      setRoutineTime(selectedTime);
    }
    else  
      setRoutineTime(timeSlot);
    
    setIsTaskModalOpen(true);
  }

  const findTasksForTime = (type: string, timeSlot: string) => {
    const hourToCompare = timeSlot.split('-')[0];
    const dayToCompare = timeSlot.split('-')[1] || selectedDay;
    let filteredTasks;
    if (tasks) {
      if (type === "daily") {
        filteredTasks = tasks.filter((task: any) => {
          return task.taskAssignments.some((assignment: any) => assignment.routineTime === hourToCompare);
       });  
      }

      if (type === "weekly") {
        if(isSmallScreen) {
          const timeToCompare = hourToCompare + "-" + selectedDay;
          filteredTasks = tasks.filter((task: any) => {
            return task.taskAssignments.some((assignment: any) => {
              return assignment.routineTime == timeToCompare
            });
          }); 
          
          filteredTasks = filteredTasks.filter((task: any) => {
            const assignment = task.taskAssignments[0]; 
            return !(assignment.routineExceptions && assignment.routineExceptions.includes(dayToCompare));
          });
          
          return filteredTasks;
        }

        filteredTasks = tasks.filter((task: any) => {
          return task.taskAssignments.some((assignment: any) => assignment.routineTime === timeSlot ||  assignment.routineTime === hourToCompare);
        }); 

        filteredTasks = filteredTasks.filter((task: any) => {
          const assignment = task.taskAssignments[0]; 
          return !(assignment.routineExceptions && assignment.routineExceptions.includes(dayToCompare));
        });
      }
      return filteredTasks;
    }
    return null;
  };

  const handleTaskClick = (task: any, timeSlot : any) => {
     //structure task
    const selectedTask = {
      ...task,
      ...task.taskAssignments[0], //we aleady filtered task assignment for this child
    } 
    setSelectedTask(selectedTask);

    if(type === "weekly" && isSmallScreen){ ///send selected day too
      const selectedTime = timeSlot + "-" + selectedDay
      setClickedTimeSlot(selectedTime);
    }
    else  
      setClickedTimeSlot(timeSlot);

    setIsTaskDetailsModalOpen(true);
  };

  const handleEdit = () => {
    // Handle editing logic here
    setIsTaskDetailsModalOpen(false);
  };

  const handleDelete = () => {
    // Handle deletion logic here
    setIsTaskDetailsModalOpen(false);
  };

  const handleRemoveTask = async (task: any) => {
    if (task) {
      const deleteResponse = await apiDeleteTask(task.id);
      console.log("Task deleted:", deleteResponse);
      mutate(); 
    }
  };

  const handleExcludeTask = async (task: any) => {
    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']; 
    const dayToExclude = selectedDay;
    if(task){
      const currentExceptions = task.taskAssignments[0].routineExceptions ? task.taskAssignments[0].routineExceptions.split(',').map((day : any) => day.trim()) : [];
  
      if (!currentExceptions.includes(dayToExclude)) {
        const updatedRoutineExceptions = [...currentExceptions, dayToExclude].join(',');
    
        const response = await apiUpdateTaskAssignment(task.id, child.id, {
          routineExceptions: updatedRoutineExceptions,
          dayToExclude,
        });
      
        const allDaysExcluded = daysOfWeek.every(day => updatedRoutineExceptions.includes(day));
    
        if (allDaysExcluded) {
          handleRemoveTask(task);
        }
      } else {
        console.log(`${dayToExclude} is already in routineExceptions.`);
      }
      
    }
  
  };

  const handleDaySelect = (day: string) => {
    setSelectedDay(day);
    setIsDropdownOpen(false);
  };
  
  const toggleDropdown = () => {
    setIsDropdownOpen(prev => !prev);
  };

  
  useEffect(() => {
    const handleResize = () => {
        setIsSmallScreen(window.innerWidth <= 700);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
        window.removeEventListener('resize', handleResize);
    };
}, []);

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
    <div
      className={`fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50 transition-transform duration-300 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'
      }`}
    >
      <div className={`rounded-lg shadow-lg p-4 w-full md:w-[80vw] lg:w-[80vw] max-h-[95vh] overflow-y-auto flex flex-col task-menu ${gradientBg}`}>
        {/* Header */}
        <div className="flex justify-between items-center p-3">
          <div className="flex items-center text-white">
            {child?.icon ? <img src={child.avatar} className='w-8 h-8 mr-3' alt="icon"/> : <FaCalendarAlt className="text-xl mr-3" />}
            <h2 className="md:text-xl font-bold font-stix sm:text-lg">Assign Routine for {child ? child.name : 'child'}</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full bg-white hover:bg-gray-300 transition-colors duration-300 hover:${gradientBg}`}
          >
            <FaTimes size={14} />
          </button>
        </div>

        {type === 'weekly' ? (
        <>
        {!isSmallScreen ? ( ///show calendar on large screens
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
                    onClick={(e) => handleCalendarClick(e, "weekly", timeSlot)} 
                  >
                    <div className="flex flex-col space-y-1 w-full px-2 sm:px-3 py-1 sm:py-2">
                      {tasksForTime && tasksForTime.length > 0 ? (
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
                            <FaPlus className="text-white text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                        )}
                    </div>
                </div>
                );
                })}
            </React.Fragment>
            ))}
          </div>
        ) : ( //show the mobile version 
        <>
        <div className="relative flex justify-end mb-3">
          <button
            onClick={toggleDropdown}
            className={`flex items-center px-5 py-2 mt-2 bg-white text-light-primary font-medium font-stix rounded-lg shadow-md hover:text-white transition-colors duration-300
            hover:bg-gradient-to-br ${gender === 'male' ? 'hover:from-blue-300 hover:to-blue-500' : 'hover:bg-gradient-to-br hover:from-pink-300 hover:to-pink-500'}`}
          >
            {selectedDay}
          </button>
      
          {/* Dropdown for day selection */}
          {isDropdownOpen && (
            <div ref={dropdownRef} className={`absolute right-0 mt-14 w-48 p-2 max-w-xs font-stix font-bold text-dark-text bg-gradient-to-br ${gender === 'male' ? 'from-blue-300 to-blue-500' : 'from-pink-300 to-pink-500'} rounded-lg shadow-lg z-50`}>
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
            const tasksForTime = findTasksForTime("weekly", hour);
            return (
              <div
                key={index}
                className="bg-white/30 hover:scale-105 transform duration-300 hover:cursor-pointer rounded-lg p-4 text-white flex items-center justify-between"
                onClick={(e) => handleCalendarClick(e, "weekly", hour)} 
              >
                <div className="text-base font-medium font-stix mr-1">{hour}</div>
                <div className="flex flex-col space-y-2">
                    {tasksForTime && tasksForTime.length > 0 ? (
                        tasksForTime.map((task: any, index: number) => (
                            <div
                              key={index}
                              className="relative bg-blue-500 text-white py-3 px-7 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-200"
                              style={{ width: '250px' }} 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTaskClick(task, hour);
                              }}
                              >
                              <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-base font-satisfy mr-3">{task.name}</h3>
                                <div className="bg-white text-blue-500 px-3 py-1 rounded-full text-sm font-medium font-stix">
                                  {task.points} pts
                                </div>
                               
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation(); 
                                    handleExcludeTask(task);
                                  }}  
                                   className="text-gray-200 hover:text-white transition-colors"
                                >
                                    <FaTrash />
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
                      <span className="text-gray-400 text-xs"></span>
                    )}
                  </div>
                  <FaPlus className="text-white opacity-80 hover:opacity-100 transition-opacity duration-300 cursor-pointer ml-1" />
              </div>
            );
          })}
        </div>
      </>      
    )}
        </>
        ) : (
          <div className="grid md:grid-cols-2 grid-cols-1 gap-3 mt-4">
            {hoursOfDay.map((hour, index) => {
              const tasksForTime = findTasksForTime("daily", hour);
              return (
                <div
                  key={index}
                  className="bg-white/30 hover:scale-105 transform duration-300 hover:cursor-pointer rounded-lg p-4 text-white flex items-center justify-between"
                  onClick={(e) => handleCalendarClick(e, "daily", hour)}
                >
                <div className="text-base font-medium font-stix mr-1">{hour}</div>
                  <div className="flex flex-col space-y-2">
                    {tasksForTime && tasksForTime.length > 0 ? (
                        tasksForTime.map((task: any, index: number) => (
                            <div
                              key={index}
                              className="relative bg-blue-500 text-white py-3 px-7 rounded-lg shadow-lg hover:bg-blue-600 transition-all duration-200"
                              style={{ width: '250px' }} 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleTaskClick(task, hour);
                              }}
                              >
                              <div className="flex justify-between items-center mb-3">
                                <h3 className="font-semibold text-base font-satisfy mr-3">{task.name}</h3>
                                <div className="bg-white text-blue-500 px-3 py-1 rounded-full text-sm font-medium font-stix">
                                  {task.points} pts
                                </div>
                               
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation(); 
                                    handleRemoveTask(task);
                                  }}  
                                   className="text-gray-200 hover:text-white transition-colors"
                                >
                                    <FaTrash />
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
                      <span className="text-gray-400 text-xs"></span>
                    )}
                  </div>
                  <FaPlus className="text-white opacity-80 hover:opacity-100 transition-opacity duration-300 cursor-pointer ml-1" />
                </div>
              );
            })}
          </div>
        )}
      </div>
      <TaskModal 
        type='create_only'
        child={child}
        isOpen={isTaskModalOpen} 
        routineTime={routineTime}
        bgColor={gradientBg}
        onClose={() => setIsTaskModalOpen(false)}
        onUpdate={() => setUpdate(true)}
      />
      <TaskDetailsModal
        isOpen={isTaskDetailsModalOpen}
        task={selectedTask}
        clickedTimeSlot={clickedTimeSlot}
        child={child}
        type='task_details'
        onClose={() => setIsTaskDetailsModalOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onUpdate={() => setUpdate(true)}
      />
    </div>
  );
};

export default RoutineModal;