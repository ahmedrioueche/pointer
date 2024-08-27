// components/Dashboard.tsx

import React from 'react';
import { RewardCard } from './RewardCard';
import { CompetitionCard } from './CompetitionCard';
import { StatisticCard } from './StatisticCard';
import { FaStar, FaGift, FaTrophy, FaMedal, FaUsers, FaDollarSign, FaClock, FaChartLine, FaTasks, FaCheckCircle, FaTimesCircle, FaQuestionCircle, FaGamepad } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-light-background font-stix dark:bg-dark-background text-light-text dark:text-dark-text p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

        {/* Statistics Container */}
        <div className="p-8 rounded-lg shadow-md bg-white dark:bg-gray-800 col-span-1 md:col-span-2 lg:col-span-4">
          <h2 className="text-xl font-semibold mb-6 font-stix">Statistics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatisticCard
              title="Total Points Earned"
              figure="1,200"
              icon={FaDollarSign}
              bgColor="bg-gradient-to-r from-blue-400 to-blue-600"
              description="Points earned by all children"
            />
            <StatisticCard
              title="Total Rewards Claimed"
              figure="35"
              icon={FaGift}
              bgColor="bg-gradient-to-r from-yellow-400 to-yellow-600"
              description="Rewards claimed by children"
            />
            <StatisticCard
              title="Total Competitions Held"
              figure="10"
              icon={FaTrophy}
              bgColor="bg-gradient-to-r from-red-400 to-red-600"
              description="Competitions organized"
            />
            <StatisticCard
              title="Total Quizzes Completed"
              figure="50"
              icon={FaQuestionCircle}
              bgColor="bg-gradient-to-r from-green-400 to-green-600"
              description="Quizzes completed by children"
            />
            <StatisticCard
              title="Active Games"
              figure="7"
              icon={FaGamepad}
              bgColor="bg-gradient-to-r from-teal-400 to-teal-600"
              description="Games currently in progress"
            />
            <StatisticCard
              title="Total Tasks Assigned"
              figure="150"
              icon={FaTasks}
              bgColor="bg-gradient-to-r from-purple-400 to-purple-600"
              description="Tasks assigned to children"
            />
          </div>
        </div>

        {/* Pending Tasks Container */}
        <div className="p-8 rounded-lg shadow-md bg-white dark:bg-gray-800 col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-6 font-stix">Pending Tasks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatisticCard
              title="Total Pending Tasks"
              figure="12"
              icon={FaTasks}
              bgColor="bg-gradient-to-r from-yellow-400 to-yellow-600"
              description="Tasks yet to be completed"
            />
            <StatisticCard
              title="Overdue Tasks"
              figure="3"
              icon={FaTimesCircle}
              bgColor="bg-gradient-to-r from-red-400 to-red-600"
              description="Tasks past their due date"
            />
          </div>
        </div>

        {/* Finished Tasks Container */}
        <div className="p-8 rounded-lg shadow-md bg-white dark:bg-gray-800 col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-6 font-stix">Finished Tasks</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatisticCard
              title="Total Completed Tasks"
              figure="45"
              icon={FaCheckCircle}
              bgColor="bg-gradient-to-r from-green-400 to-green-600"
              description="Tasks completed successfully"
            />
            <StatisticCard
              title="Tasks Completed Today"
              figure="5"
              icon={FaClock}
              bgColor="bg-gradient-to-r from-teal-400 to-teal-600"
              description="Tasks finished today"
            />
          </div>
        </div>

        {/* Competitions Container */}
        <div className="p-8 rounded-lg shadow-md bg-white dark:bg-gray-800 col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-6 font-stix">Competitions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <CompetitionCard
              title="Annual Contest"
              participants={50}
              icon={FaTrophy}
              bgColor="bg-gradient-to-r from-blue-400 to-blue-600"
              start_date={new Date().toISOString()}
              end_date={new Date(new Date().setDate(new Date().getDate() + 30)).toISOString()}
              onShowDetails={() => alert('Show competition details')}
            />
            <CompetitionCard
              title="Monthly Challenge"
              participants={20}
              icon={FaMedal}
              bgColor="bg-gradient-to-r from-green-400 to-green-600"
              start_date={new Date().toISOString()}
              end_date={new Date(new Date().setDate(new Date().getDate() + 7)).toISOString()}
              onShowDetails={() => alert('Show competition details')}
            />
          </div>
        </div>

        {/* Quizzes Container */}
        <div className="p-8 rounded-lg shadow-md bg-white dark:bg-gray-800 col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-6 font-stix">Quizzes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatisticCard
              title="Upcoming Quizzes"
              figure="3"
              icon={FaQuestionCircle}
              bgColor="bg-gradient-to-r from-purple-400 to-purple-600"
              description="Quizzes scheduled in the next week"
            />
            <StatisticCard
              title="Completed Quizzes"
              figure="12"
              icon={FaCheckCircle}
              bgColor="bg-gradient-to-r from-green-400 to-green-600"
              description="Quizzes finished by children"
            />
          </div>
        </div>

        {/* Games Container */}
        <div className="p-8 rounded-lg shadow-md bg-white dark:bg-gray-800 col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-6 font-stix">Games</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <StatisticCard
              title="Active Games"
              figure="5"
              icon={FaGamepad}
              bgColor="bg-gradient-to-r from-teal-400 to-teal-600"
              description="Games currently being played"
            />
            <StatisticCard
              title="Games Played Today"
              figure="8"
              icon={FaChartLine}
              bgColor="bg-gradient-to-r from-orange-400 to-orange-600"
              description="Games completed today"
            />
          </div>
        </div>

        {/* Rewards Container */}
        <div className="p-8 rounded-lg shadow-md bg-white dark:bg-gray-800 col-span-1 md:col-span-2 lg:col-span-3">
          <h2 className="text-xl font-semibold mb-6 font-stix">Rewards</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <RewardCard
              type="reward_page"
              title="Top Performer"
              points={500}
              icon={FaStar}
              bgColor="bg-gradient-to-r from-yellow-400 to-yellow-600"
              creation_date={new Date().toISOString()}
              onModify={() => alert('Modify reward')}
              onRemove={() => alert('Remove reward')}
            />
            <RewardCard
              type="reward_page"
              title="Employee of the Month"
              points={1000}
              icon={FaGift}
              bgColor="bg-gradient-to-r from-pink-400 to-red-500"
              creation_date={new Date().toISOString()}
              onModify={() => alert('Modify reward')}
              onRemove={() => alert('Remove reward')}
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
