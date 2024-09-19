import { fetcher } from '@/utils/helper';
import React, { useEffect } from 'react';
import useSWR from 'swr';

interface Props {
  user: any;
  setChallenges: React.Dispatch<React.SetStateAction<any[]>>;
}

const ChallengeFetcher: React.FC<Props> = ({ user, setChallenges }) => {
  const userId = user.id;
  const isParent = user.type === "parent";
  const apiEndpoint = isParent
    ? '/api/main/challenge/get-challenge-parent-id'
    : '/api/main/challenge/get-challenge-child-id';

  const { data: challengesDB, error, mutate } = useSWR(
    userId ? apiEndpoint : null,
    (url: string) => fetcher(url, userId),
    { revalidateOnFocus: true }
  );

  useEffect(() => {
    console.log("challengesDB", challengesDB);
    if (challengesDB) {
      // Sort challenges by time, newest first
      const sortedChallenges = challengesDB.challenges.sort((a : any, b : any) => 
        new Date(b.time).getTime() - new Date(a.time).getTime()
      );
      setChallenges(sortedChallenges);
    }
  }, [challengesDB, setChallenges]);
  

  if (error) {
    console.error("Error fetching challenges:", error);
    return <div className="text-red-500 font-semibold p-4 bg-red-100 rounded-lg">Error loading challenges. Please try again later.</div>;
  }

  if (!challengesDB) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white shadow-md rounded-lg p-6 animate-pulse">
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="h-4 bg-gray-300 rounded w-full"></div>
              <div className="h-4 bg-gray-300 rounded w-5/6"></div>
              <div className="h-4 bg-gray-300 rounded w-4/6"></div>
            </div>
            <div className="mt-6 flex justify-between items-center">
              <div className="w-20 h-8 bg-gray-300 rounded"></div>
              <div className="w-20 h-8 bg-gray-300 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export default ChallengeFetcher;