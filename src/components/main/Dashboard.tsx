import React, { useEffect, useRef, useState } from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { Wallet, ShoppingBag, BarChart2, Award, ChevronDown } from 'lucide-react';
import ChildCardHori from './child/ChildCardHori';
import { useData } from '@/app/context/dataContext';

const lineData = [
  { name: 'Jan', value: 400 },
  { name: 'Feb', value: 300 },
  { name: 'Mar', value: 600 },
  { name: 'Apr', value: 400 },
  { name: 'May', value: 500 },
  { name: 'Jun', value: 700 },
];

const barData = [
  { name: 'Math', value: 85 },
  { name: 'Science', value: 70 },
  { name: 'English', value: 90 },
  { name: 'History', value: 75 },
  { name: 'Art', value: 95 },
];

const pieData = [
  { name: 'Tasks', value: 30 },
  { name: 'Rewards', value: 25 },
  { name: 'Homework', value: 35 },
  { name: 'Competitions', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const popularActivities = [
  { name: 'Math Quiz', score: 95, change: 5 },
  { name: 'Science Project', score: 88, change: -2 },
  { name: 'Reading Challenge', score: 100, change: 10 },
  { name: 'Sports Day', score: 92, change: 3 },
];

const Dashboard: React.FC = () => {
  const [totalPoints, setTotalPoints] = useState(500);
  const [tasksCompleted, setTasksCompleted] = useState(42);
  const [rewardsEarned, setRewardsEarned] = useState(15);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [children, setChildren] = useState<any>();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const data = useData();
  
  useEffect(() => {
    if(data){
      setChildren(data.children);
    }
  }, [data])
  

  const handleChildClick = async (child : any) => {
    console.log("child", child)
  }

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
  
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-2 shadow rounded">
          <p className="label">{`${payload[0].name} : ${payload[0].value}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 min-h-screen font-stix text-gray-800 dark:text-gray-200 transition-colors duration-200 relative">
      {/* Floating Button */}
      <div className="absolute ml-3 top-2 left-2 font-stix">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full shadow-lg transition-colors duration-200 flex items-center"
        >
          Choose Child
          <ChevronDown className="ml-2" size={20} />
        </button>

        {/* Dropdown - Now with ChildCarHori components */}
        {isDropdownOpen && (
          <div ref={dropdownRef} className="absolute mt-2 w-80 bg-white dark:bg-gray-700 rounded-md shadow-lg z-10">
           {children.map((child : any) => (
            <div key={child.id} onClick={() => handleChildClick(child)}>
              <ChildCardHori 
                name={child.name}
                age={child.age} 
                gender={child.gender} 
                avatar={child.avatar}
                callback={() => null} 
              />
            </div>
          ))}    
          </div>
        )}
      </div>

      <div className="p-1 mt-10 bg-gray-100 dark:bg-gray-800 min-h-screen font-stix text-gray-800 dark:text-gray-200 transition-colors duration-200">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-purple-600 dark:bg-purple-700 text-white p-6 rounded-lg shadow cursor-pointer transition-all hover:scale-105 hover:shadow-lg" onClick={() => setTotalPoints(prev => prev + 10)}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold">{totalPoints}</p>
              <p className="text-sm opacity-80">Total Points</p>
            </div>
            <Award className="w-10 h-10 opacity-80" />
          </div>
        </div>
        <div className="bg-blue-500 dark:bg-blue-600 text-white p-6 rounded-lg shadow cursor-pointer transition-all hover:scale-105 hover:shadow-lg" onClick={() => setTasksCompleted(prev => prev + 1)}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold">{tasksCompleted}</p>
              <p className="text-sm opacity-80">Tasks Completed</p>
            </div>
            <ShoppingBag className="w-10 h-10 opacity-80" />
          </div>
          <div className="mt-4 h-16">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={lineData}>
                <Line type="monotone" dataKey="value" stroke="#ffffff" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-blue-700 dark:bg-blue-800 text-white p-6 rounded-lg shadow cursor-pointer transition-all hover:scale-105 hover:shadow-lg" onClick={() => setRewardsEarned(prev => prev + 1)}>
          <div className="flex justify-between items-center">
            <div>
              <p className="text-3xl font-bold">{rewardsEarned}</p>
              <p className="text-sm opacity-80">Rewards Earned</p>
            </div>
            <Wallet className="w-10 h-10 opacity-80" />
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow transition-colors duration-200">
          <h2 className="text-xl font-bold mb-4">Subject Performance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="currentColor" />
                <YAxis stroke="currentColor" />
                <Tooltip contentStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.8)', color: '#fff' }} />
                <Bar dataKey="value" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow transition-colors duration-200">
          <h2 className="text-xl font-bold mb-4">Popular Activities</h2>
          <div>
            {popularActivities.map((activity, index) => (
              <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-600 last:border-b-0">
                <div>
                  <p className="font-semibold">{activity.name}</p>
                  <p className={`text-sm ${activity.change >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>
                    {activity.change >= 0 ? '+' : ''}{activity.change}% Change
                  </p>
                </div>
                <p className="font-bold">{activity.score}/100</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-700 p-6 rounded-lg shadow transition-colors duration-200">
        <h2 className="text-xl font-bold mb-4">Performance Distribution</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Dashboard;